// Copyright (c) Meta Platforms, Inc. and affiliates.

import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, '..');
export const INPUT_FILE = path.join(
  REPO_ROOT,
  'packages/themes/minim/figma/tokens.json',
);
export const OUTPUT_FILE = path.join(
  REPO_ROOT,
  'packages/themes/minim/src/minimTokens.generated.ts',
);

const EXPORTED_COLLECTIONS = new Set([
  'semantic-color',
  'semantic-token',
  'font',
]);
const OUTPUT_MODES = ['base', 'compact'];

export function readTokenDocument(file = INPUT_FILE) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function compareStrings(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
}

function collectionKey(name) {
  return name.replaceAll(' ', '-');
}

function cssName(name) {
  return `--minim-${name.replaceAll('/', '-')}`;
}

function finiteNumber(value, label) {
  const number = Number(value);
  if (!Number.isFinite(number)) {
    throw new Error(`Expected finite ${label}, received ${String(value)}`);
  }
  return number;
}

function indexDocument(document) {
  const collections = new Map();
  const variables = new Map();
  for (const descriptor of document.collectionIndex) {
    const key = collectionKey(descriptor.name);
    const collection = {
      ...descriptor,
      key,
      defaultModeId: descriptor.defaultModeId ?? descriptor.modes[0]?.modeId,
    };
    if (!collection.defaultModeId) {
      throw new Error(`Collection ${descriptor.name} has no default mode`);
    }
    collections.set(key, collection);
    for (const variable of document.collections[key] ?? []) {
      if (variables.has(variable.id)) {
        throw new Error(`Duplicate variable ID ${variable.id}`);
      }
      variables.set(variable.id, {...variable, collection});
    }
  }
  for (const [id, entry] of Object.entries(
    document.aliasGraph?.externalVariables ?? {},
  )) {
    const descriptor = entry.collection;
    variables.set(id, {
      ...entry.variable,
      collection: {
        ...descriptor,
        key: `external:${descriptor.id}`,
        defaultModeId: descriptor.defaultModeId ?? descriptor.modes[0]?.modeId,
      },
    });
  }
  return {collections, variables};
}

function selectModeId(collection, requestedMode) {
  return (
    collection.modes.find(mode => mode.name === requestedMode)?.modeId ??
    collection.defaultModeId
  );
}

function rawModeValue(variable, requestedMode) {
  const modeId = selectModeId(variable.collection, requestedMode);
  if (!(modeId in variable.valuesByMode)) {
    throw new Error(
      `Variable ${variable.id} (${variable.name}) has no value for mode ${modeId}`,
    );
  }
  return {modeId, value: variable.valuesByMode[modeId]};
}

export function createResolver(document) {
  const {collections, variables} = indexDocument(document);

  function resolveValue(value, requestedMode, stack = []) {
    if (value?.type === 'VARIABLE_ALIAS') {
      if (stack.includes(value.id)) {
        throw new Error(`Variable alias cycle: ${[...stack, value.id].join(' -> ')}`);
      }
      const target = variables.get(value.id);
      if (!target) {
        throw new Error(`Unresolved variable alias ${value.id}`);
      }
      const selected = rawModeValue(target, requestedMode);
      return resolveValue(selected.value, requestedMode, [...stack, value.id]);
    }
    if (value?.color?.type === 'VARIABLE_ALIAS' && value.opacity != null) {
      const resolved = resolveValue(value.color, requestedMode, stack);
      if (!resolved || typeof resolved !== 'object' || resolved.r == null) {
        throw new Error('Color opacity wrapper did not resolve to a color');
      }
      return {
        ...resolved,
        a:
          finiteNumber(resolved.a ?? 1, 'color alpha') *
          (finiteNumber(value.opacity, 'opacity') / 100),
      };
    }
    return value;
  }

  function resolveVariable(id, requestedMode) {
    const variable = variables.get(id);
    if (!variable) {
      throw new Error(`Unresolved variable alias ${id}`);
    }
    const selected = rawModeValue(variable, requestedMode);
    return {
      modeId: selected.modeId,
      value: resolveValue(selected.value, requestedMode, [id]),
    };
  }

  return {collections, variables, resolveValue, resolveVariable};
}

function colorToCss(value) {
  const percentage = (channel, label) =>
    `${finiteNumber(channel, label) * 100}%`;
  return `rgb(${percentage(value.r, 'red channel')} ${percentage(value.g, 'green channel')} ${percentage(value.b, 'blue channel')} / ${percentage(value.a ?? 1, 'color alpha')})`;
}

function tokenValueToCss(variable, value) {
  if (variable.resolvedType === 'COLOR') {
    return colorToCss(value);
  }
  if (variable.resolvedType === 'STRING') {
    return String(value);
  }
  if (variable.resolvedType === 'FLOAT') {
    if (variable.scopes.includes('FONT_WEIGHT')) {
      return String(value);
    }
    return `${finiteNumber(value, variable.name) / 16}rem`;
  }
  throw new Error(
    `Unsupported resolved type ${variable.resolvedType} for ${variable.name}`,
  );
}

function allResolvedModes(variable, resolver) {
  return Object.fromEntries(
    variable.collection.modes.map(mode => [
      mode.name,
      tokenValueToCss(
        variable,
        resolver.resolveValue(variable.valuesByMode[mode.modeId], mode.name, [
          variable.id,
        ]),
      ),
    ]),
  );
}

function resolveTextStyle(style, mode, resolver) {
  const bindings = {};
  for (const [property, alias] of Object.entries(style.boundVariables ?? {})) {
    const resolved = resolver.resolveVariable(alias.id, mode);
    const variable = resolver.variables.get(alias.id);
    bindings[property] = {
      variableId: alias.id,
      variableName: variable.name,
      modeId: resolved.modeId,
      value: tokenValueToCss(variable, resolved.value),
    };
  }
  return bindings;
}

function resolveEffect(effect, mode, resolver) {
  const copy = structuredClone(effect);
  const alias = effect.boundVariables?.color;
  if (alias) {
    const resolved = resolver.resolveVariable(alias.id, mode);
    copy.resolvedColor = colorToCss(resolved.value);
    copy.resolvedColorModeId = resolved.modeId;
  }
  return copy;
}

function effectColorToCss(effect, mode, resolver) {
  const alias = effect.boundVariables?.color;
  if (alias) {
    return colorToCss(resolver.resolveVariable(alias.id, mode).value);
  }
  return colorToCss(effect.color);
}

function effectStyleToCss(style, mode, resolver) {
  return style.effects
    .map(effect => {
      if (effect.type !== 'DROP_SHADOW' && effect.type !== 'INNER_SHADOW') {
        throw new Error(
          `Effect style ${style.name} contains unsupported ${effect.type}`,
        );
      }
      const inset = effect.type === 'INNER_SHADOW' ? 'inset ' : '';
      return `${inset}${finiteNumber(effect.offset.x, 'effect x') / 16}rem ${finiteNumber(effect.offset.y, 'effect y') / 16}rem ${finiteNumber(effect.radius, 'effect radius') / 16}rem ${finiteNumber(effect.spread, 'effect spread') / 16}rem ${effectColorToCss(effect, mode, resolver)}`;
    })
    .join(', ');
}

export function generateTokenModel(document) {
  const resolver = createResolver(document);
  const maps = {base: {}, compact: {}};
  const metadata = {};

  for (const [collectionKeyName, variables] of Object.entries(
    document.collections,
  )) {
    if (!EXPORTED_COLLECTIONS.has(collectionKeyName)) {
      continue;
    }
    for (const source of variables) {
      const variable = resolver.variables.get(source.id);
      const name = cssName(variable.name);
      for (const mode of OUTPUT_MODES) {
        const resolved = resolver.resolveVariable(variable.id, mode);
        maps[mode][name] = tokenValueToCss(variable, resolved.value);
      }
      metadata[name] = {
        id: variable.id,
        name: variable.name,
        collection: collectionKeyName,
        resolvedModes: allResolvedModes(variable, resolver),
      };
    }
  }

  for (const style of document.effectStyles) {
    const suffix = style.name.split('/').at(-1).toLowerCase();
    const name = `--minim-elevation-${suffix}`;
    for (const mode of OUTPUT_MODES) {
      maps[mode][name] = effectStyleToCss(style, mode, resolver);
    }
  }

  const sortObject = object =>
    Object.fromEntries(
      Object.entries(object).sort(([left], [right]) =>
        compareStrings(left, right),
      ),
    );

  return {
    base: sortObject(maps.base),
    compact: sortObject(maps.compact),
    metadata: sortObject(metadata),
    textStyles: document.textStyles.map(style => ({
      ...style,
      resolvedBindings: Object.fromEntries(
        OUTPUT_MODES.map(mode => [mode, resolveTextStyle(style, mode, resolver)]),
      ),
    })),
    effectStyles: document.effectStyles.map(style => ({
      ...style,
      resolvedEffects: Object.fromEntries(
        OUTPUT_MODES.map(mode => [
          mode,
          style.effects.map(effect => resolveEffect(effect, mode, resolver)),
        ]),
      ),
    })),
  };
}

export function renderGeneratedFile(document = readTokenDocument()) {
  const model = generateTokenModel(document);
  return `// Copyright (c) Meta Platforms, Inc. and affiliates.\n// @generated by scripts/generate-minim-tokens.mjs. Do not edit directly.\n\nexport const minimBaseTokens = ${JSON.stringify(model.base, null, 2)} as const;\n\nexport const minimCompactTokens = ${JSON.stringify(model.compact, null, 2)} as const;\n\nexport const minimTokenMetadata = ${JSON.stringify(model.metadata, null, 2)} as const;\n\nexport const minimTextStyleMetadata = ${JSON.stringify(model.textStyles, null, 2)} as const;\n\nexport const minimEffectStyleMetadata = ${JSON.stringify(model.effectStyles, null, 2)} as const;\n\nexport type MinimTokenName = keyof typeof minimBaseTokens;\nexport type MinimTokenMetadata = typeof minimTokenMetadata;\nexport type MinimTextStyleMetadata = (typeof minimTextStyleMetadata)[number];\nexport type MinimEffectStyleMetadata = (typeof minimEffectStyleMetadata)[number];\n`;
}

export function writeGeneratedFile() {
  const output = renderGeneratedFile();
  fs.mkdirSync(path.dirname(OUTPUT_FILE), {recursive: true});
  fs.writeFileSync(OUTPUT_FILE, output);
  return output;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  writeGeneratedFile();
}
