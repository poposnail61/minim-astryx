// Copyright (c) Meta Platforms, Inc. and affiliates.

import {describe, expect, it} from 'vitest';
import {
  localImportSpecifiers,
  rewriteSpecifierLiterals,
} from './generate-cli-themes.mjs';

describe('generate-cli-themes import rewriting', () => {
  it('rewrites only parsed import/export literal spans', () => {
    const source = `
// Keep ../assets/catalog.json in this comment.
const example = '../assets/catalog.json';
import catalog from '../assets/catalog.json';
export {value} from '../assets/value';
`;
    const replacements = localImportSpecifiers(source).map(imported => ({
      ...imported,
      specifier: imported.specifier.replace('../assets/', './assets/'),
    }));

    expect(rewriteSpecifierLiterals(source, replacements)).toBe(`
// Keep ../assets/catalog.json in this comment.
const example = '../assets/catalog.json';
import catalog from './assets/catalog.json';
export {value} from './assets/value';
`);
  });
});
