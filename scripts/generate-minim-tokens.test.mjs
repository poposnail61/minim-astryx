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
  assert.equal(await formatted(renderGeneratedFile(document)), await formatted(fs.readFileSync(OUTPUT_FILE, 'utf8')));
  assert.doesNotMatch(fs.readFileSync(INPUT_FILE, 'utf8'), /\/tmp\/|\/Users\/|file:\/\//);
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
    () => createResolver(minimalDocument([variable('a', 'b'), variable('b', 'a')])).resolveVariable('a', 'base'),
    /alias cycle/,
  );
  assert.throws(
    () => createResolver(minimalDocument([variable('a', 'missing')])).resolveVariable('a', 'base'),
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
  assert.equal(
    model.base['--minim-bg-disabled'],
    'rgb(0% 0% 0% / 5%)',
  );
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
  assert.equal(
    model.base['--minim-scientific-color'],
    'rgb(10% 25% 50% / 5%)',
  );
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
      'semantic-color': 60,
      'base-color': 125,
      font: 3,
      'base-token': 74,
      'semantic-token': 82,
    },
  );
  assert.equal(Object.keys(model.base).length, 148);
  assert.equal(Object.keys(model.compact).length, 148);
  assert.equal(Object.keys(model.metadata).length, 145);
  assert.equal(model.textStyles.length, 28);
  assert.equal(model.effectStyles.length, 3);
});

test('publishes the expected named schema with resolved elevation values', () => {
  const model = generateTokenModel(document);
  const source = renderGeneratedFile(document);
  assert.match(source, /export const minimBaseTokens =/);
  assert.match(source, /export const minimCompactTokens =/);
  assert.match(source, /export type MinimTokenName =/);
  assert.deepEqual(
    Object.keys(model.base).filter(name => name.startsWith('--minim-elevation-')),
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
