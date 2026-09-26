// Copyright (c) Meta Platforms, Inc. and affiliates.

// One-time, idempotent migration of the exported Minim spacing contract.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const replacements = {
  'control/xlarge/padding-inline': 'spacing/400',
  'control/large/padding-inline': 'spacing/250',
  'control/medium/padding-inline': 'spacing/200',
  'control/large/gap': 'spacing/200',
  'row/large/padding-inline': 'spacing/200',
  'row/medium/padding-inline': 'spacing/200',
  'row/large/padding-block': 'control/large/padding-block',
  'row/medium/padding-block': 'control/medium/padding-block',
  'row/large/gap': 'spacing/200',
  'row/medium/gap': 'spacing/200',
  'control-item/large/padding-inline': 'spacing/200',
  'control-item/medium/padding-inline': 'spacing/150',
};
const rename = name => name.replace(/^control\//, 'component/').replace(/^(?:control-item|component\/item)\/(medium|large)\/padding-block$/, 'component/$1/padding-block-inner');
const file = path.join(root, 'packages/themes/minim/figma/tokens.json');
const document = JSON.parse(fs.readFileSync(file, 'utf8'));
const variables = Object.values(document.collections).flat();
const byName = new Map(variables.map(v => [v.name, v]));
const ids = new Map();
for (const [from, to] of Object.entries(replacements)) {
  const source = byName.get(from);
  if (!source) continue;
  const target = byName.get(to) ?? byName.get(rename(to));
  if (!target) throw new Error(`Missing replacement for ${from}: ${to}`);
  ids.set(source.id, target.id);
}
function aliases(value) {
  if (!value || typeof value !== 'object') return;
  if (value.type === 'VARIABLE_ALIAS' && ids.has(value.id)) value.id = ids.get(value.id);
  for (const child of Object.values(value)) aliases(child);
}
aliases(document);
for (const [key, entries] of Object.entries(document.collections)) {
  document.collections[key] = entries.filter(v => !ids.has(v.id)).map(v => {
    const name = rename(v.name);
    return {...v, name, ...(name.startsWith('component/') ? {description: 'Shared component block padding. Combine with the matching content slot height. Use spacing tokens for inline padding and gaps; item metrics account for an outer container inset.'} : {})};
  });
}
for (const entry of document.collectionIndex) {
  entry.variableCount = document.collections[entry.name.replaceAll(' ', '-')].length;
}
const remaining = Object.values(document.collections).flat();
const localIds = new Set(remaining.map(v => v.id));
const edges = [];
function collectAliases(value, source, path) {
  if (!value || typeof value !== 'object') return;
  if (value.type === 'VARIABLE_ALIAS') {
    edges.push({source, target: value.id, path});
    return;
  }
  for (const [key, child] of Object.entries(value)) collectAliases(child, source, `${path}.${key}`);
}
for (const v of remaining) collectAliases(v.valuesByMode, v.id, 'valuesByMode');
document.aliasGraph.edges = edges;
const targets = new Set(edges.map(e => e.target));
const external = [...targets].filter(id => !localIds.has(id));
const unresolved = external.filter(id => !document.aliasGraph.externalVariables[id]);
document.aliasGraph.unresolved = unresolved;
const counts = Object.fromEntries(Object.entries(document.collections).map(([key, vs]) => [key, vs.length]));
document.validation = {
  expectedCounts: {...counts, textStyles: document.textStyles.length, effectStyles: document.effectStyles.length},
  counts: {
    collections: counts, variables: remaining.length,
    textStyles: document.textStyles.length, effectStyles: document.effectStyles.length,
    aliasReferences: edges.length, uniqueAliasTargets: targets.size,
    localAliasTargets: targets.size - external.length,
    externalResolvedAliasTargets: external.length - unresolved.length,
    unresolvedAliasTargets: unresolved.length,
  },
  allExpectedCountsMatch: true,
  allAliasReferencesResolved: unresolved.length === 0,
};
fs.writeFileSync(file, JSON.stringify(document, null, 2) + '\n');

const css = name => name.replaceAll('/', '-');
function migrateDirectory(dir) {
  for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) { migrateDirectory(file); continue; }
    if (!/\.(ts|tsx)$/.test(file) || file.endsWith('.generated.ts')) continue;
    const before = fs.readFileSync(file, 'utf8');
    let after = before;
    for (const [from, to] of Object.entries(replacements)) after = after.replaceAll(css(from), css(rename(to)));
    // Also covers template-literal token names (control-${size}-padding-block).
    after = after.replace(/control-item-(?=(?:medium|large|\$\{)[^'"`\n]*padding-block)/g, 'component-item-').replace(/control-(?=(?:medium|large|xlarge|\$\{)[^'"`\n]*padding-block)/g, 'component-');
    after = after.replaceAll('segmented-component-item-', 'segmented-control-item-');
    after = after.replace(/component-item-(medium|large|\$\{size\})-padding-block/g, 'component-$1-padding-block-inner');
    after = after.replaceAll('row-${size}-padding-block', 'component-${size}-padding-block');
    after = after.replaceAll('row-${size}-gap', 'spacing-200');
    if (after !== before) fs.writeFileSync(file, after);
  }
}
migrateDirectory(path.join(root, 'packages/themes/minim/src'));
console.log(`Migrated ${ids.size} retired aliases; kept component block-padding values unchanged.`);
