// Copyright (c) Meta Platforms, Inc. and affiliates.

import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import {format} from 'prettier';
import {
  createResolver,
  generateTokenModel,
  INPUT_FILE,
  OUTPUT_FILE,
  readTokenDocument,
  renderGeneratedFile,
} from './generate-minim-tokens.mjs';
import {parseColor} from '../packages/core/src/utils/color.ts';

const document = readTokenDocument();

function minimalDocument(variables, externalVariables = {}) {
  return {
    collectionIndex: [
      {
        id: 'collection',
        name: 'semantic token',
        modes: [{name: 'base', modeId: 'base'}],
        defaultModeId: 'base',
      },
    ],
    collections: {'semantic-token': variables},
    aliasGraph: {externalVariables},
  };
}

test('generated output matches the checked-in file deterministically', async () => {
  const formatted = source => format(source, {parser: 'typescript'});
  assert.equal(
    await formatted(renderGeneratedFile(document)),
    await formatted(fs.readFileSync(OUTPUT_FILE, 'utf8')),
  );
  assert.doesNotMatch(
    fs.readFileSync(INPUT_FILE, 'utf8'),
    /\/tmp\/|\/Users\/|file:\/\//,
  );
});

test('resolver rejects cycles and unresolved aliases', () => {
  const variable = (id, target) => ({
    id,
    name: id,
    resolvedType: 'FLOAT',
    scopes: [],
    valuesByMode: {base: {type: 'VARIABLE_ALIAS', id: target}},
  });
  assert.throws(
    () =>
      createResolver(
        minimalDocument([variable('a', 'b'), variable('b', 'a')]),
      ).resolveVariable('a', 'base'),
    /alias cycle/,
  );
  assert.throws(
    () =>
      createResolver(
        minimalDocument([variable('a', 'missing')]),
      ).resolveVariable('a', 'base'),
    /Unresolved variable alias missing/,
  );
});

test('cross-collection aliases select the target collection mode independently', () => {
  const resolver = createResolver(document);
  const token = [...resolver.variables.values()].find(
    variable => variable.name === 'spacing/150',
  );
  assert.equal(resolver.resolveVariable(token.id, 'base').value, 6);
  assert.equal(resolver.resolveVariable(token.id, 'compact').value, 4);
});

test('five-percent opacity wrappers preserve alpha', () => {
  const model = generateTokenModel(document);
  assert.equal(model.base['--minim-bg-disabled'], 'rgb(0% 0% 0% / 5%)');
});

test('accepts finite scientific-notation color channels and alpha', () => {
  const resolver = createResolver(
    minimalDocument([
      {
        id: 'scientific-color',
        name: 'scientific-color',
        resolvedType: 'COLOR',
        scopes: [],
        valuesByMode: {base: {r: 1e-1, g: 2.5e-1, b: 5e-1, a: 5e-2}},
      },
    ]),
  );
  const resolved = resolver.resolveVariable('scientific-color', 'base');
  assert.deepEqual(resolved.value, {r: 0.1, g: 0.25, b: 0.5, a: 0.05});
  const model = generateTokenModel({
    ...minimalDocument([
      {
        id: 'scientific-color',
        name: 'scientific-color',
        resolvedType: 'COLOR',
        scopes: [],
        valuesByMode: {base: {r: 1e-1, g: 2.5e-1, b: 5e-1, a: 5e-2}},
      },
    ]),
    textStyles: [],
    effectStyles: [],
  });
  assert.equal(model.base['--minim-scientific-color'], 'rgb(10% 25% 50% / 5%)');
});

test('font weights are unitless and numeric dimensions are exact rem values', () => {
  const model = generateTokenModel(document);
  assert.equal(model.base['--minim-typography-font-weight-bold'], '700');
  assert.equal(model.base['--minim-typography-font-size-lg'], '1.03125rem');
});

test('font soft mode remains represented without theme-mode inference', () => {
  const model = generateTokenModel(document);
  assert.deepEqual(model.metadata['--minim-font'].resolvedModes, {
    base: 'Minim Base VF',
    soft: 'Minim Soft VF',
  });
  assert.equal(model.compact['--minim-font'], 'Minim Base VF');
});

test('component block padding preserves Base and Compact heights', () => {
  const model = generateTokenModel(document);
  const px = value => Number.parseFloat(value) * 16;
  for (const [mode, expected] of [['base', [36, 44, 52]], ['compact', [28, 36, 44]]]) {
    for (const [index, size] of ['medium', 'large', 'xlarge'].entries()) {
      const content = size === 'medium' ? 'medium' : 'large';
      const height = (px(model[mode][`--minim-typography-line-height-${content === 'medium' ? 'md' : 'lg'}`]) + 2 * px(model[mode][`--minim-component-${content}-padding-block-slot`])) + 2 * px(model[mode][`--minim-component-${size}-padding-block`]);
      assert.equal(height, expected[index]);
    }
  }
  for (const name of Object.keys(model.base)) {
    if (!name.startsWith('--minim-component-')) continue;
    assert.match(name, /^--minim-component-((medium|large|xlarge)-(height(-inline)?|padding-block(-inner|-slot)?)|supporting-(medium|large)-padding-block-slot|(supporting-)?(medium|large)-width-inline|person-(xsm|sm|xl|xxl)-height)$/);
  }
});

test('source and generated metadata counts match the validated export', () => {
  const model = generateTokenModel(document);
  assert.deepEqual(
    Object.fromEntries(
      Object.entries(document.collections).map(([name, values]) => [
        name,
        values.length,
      ]),
    ),
    {
      'semantic-color': 57,
      'base-color': 127,
      font: 3,
      'base-token': 74,
      'semantic-token': 63,
    },
  );
  assert.equal(Object.keys(model.base).length, 126);
  assert.equal(Object.keys(model.compact).length, 126);
  assert.equal(Object.keys(model.metadata).length, 123);
  assert.equal(model.textStyles.length, 28);
  assert.equal(model.effectStyles.length, 3);
});

test('retired aliases stay absent and button minimum widths follow density', () => {
  const model = generateTokenModel(document);
  const names = Object.values(document.collections)
    .flat()
    .map(v => v.name);
  assert.equal(names.some(name => /^(control|control-item|row)\//.test(name)), false);
  assert.equal(names.some(name => name.startsWith('content/')), false);
  assert.equal(names.some(name => name.endsWith('/height-slot')), false);
  for (const name of [
    'control/medium/gap',
    'bg/neutral-glass',
    'bg/muted-solid',
    'bg/highlight-solid',
    'stroke/highlight',
    'radius/full/component-medium',
    'radius/full/component-large',
    'radius/full/component-xlarge',
    'bg/neutral-tint',
    'bg/field-subtle',
    'alpha/black/100',
    'content/large/text-inset-inline',
    'content/medium/text-inset-inline',
    'content/supporting-large/text-inset-inline',
    'content/supporting-medium/text-inset-inline',
  ])
    assert.ok(!names.includes(name), name);
  assert.equal(model.base['--minim-shadow-neutral'], 'rgb(0% 0% 0% / 10%)');
  for (const [size, base, compact] of [
    ['medium', 36, 28],
    ['large', 44, 36],
    ['xlarge', 52, 44],
  ]) {
    assert.equal(
      model.base[`--minim-component-${size}-height`],
      `${base / 16}rem`,
    );
    assert.equal(
      model.compact[`--minim-component-${size}-height`],
      `${compact / 16}rem`,
    );
  }
});

test('publishes the expected named schema with resolved elevation values', () => {
  const model = generateTokenModel(document);
  const source = renderGeneratedFile(document);
  assert.match(source, /export const minimBaseTokens =/);
  assert.match(source, /export const minimCompactTokens =/);
  assert.match(source, /export type MinimTokenName =/);
  assert.deepEqual(
    Object.keys(model.base).filter(name =>
      name.startsWith('--minim-elevation-'),
    ),
    [
      '--minim-elevation-high',
      '--minim-elevation-low',
      '--minim-elevation-medium',
    ],
  );
  assert.equal(
    model.base['--minim-elevation-low'],
    '0rem 0.0625rem 0.0625rem 0rem rgb(0% 0% 0% / 10.000000149011612%), 0rem 0.125rem 0.5rem 0rem rgb(0% 0% 0% / 10.000000149011612%)',
  );
  for (const value of Object.values(model.base)) {
    assert.equal(typeof value, 'string');
    assert.doesNotMatch(value, /VARIABLE_ALIAS|VariableID:/);
  }
  for (const value of Object.values(model.compact)) {
    assert.equal(typeof value, 'string');
    assert.doesNotMatch(value, /VARIABLE_ALIAS|VariableID:/);
  }
});

test('every generated semantic color is compatible with core parseColor', () => {
  const model = generateTokenModel(document);
  for (const tokens of [model.base, model.compact]) {
    for (const [name, value] of Object.entries(tokens)) {
      if (
        name.startsWith('--minim-elevation-') ||
        !document.collections['semantic-color'].some(
          variable => `--minim-${variable.name.replaceAll('/', '-')}` === name,
        )
      ) {
        continue;
      }
      assert.notEqual(parseColor(value), null, `${name}: ${value}`);
    }
  }
});
