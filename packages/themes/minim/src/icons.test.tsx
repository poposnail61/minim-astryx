// Copyright (c) Meta Platforms, Inc. and affiliates.

/**
 * @file icons.test.tsx
 * @input Uses the Minim icon catalog and theme icon registry
 * @output Validates catalog integrity, approved mappings, and font-node rendering
 * @position Unit coverage for the Minim theme icon contract
 */

import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {describe, expect, it} from 'vitest';
import iconCatalog from '../assets/icon-catalog.json';
import {
  minimIconRegistry,
  minimSemanticGlyphNames,
  minimUnmappedIconNames,
} from './icons';

describe('Minim icon registry', () => {
  it('keeps every catalog glyph structurally valid and unique', () => {
    expect(iconCatalog.icons).toHaveLength(186);

    const names = new Set<string>();
    const ligatures = new Set<string>();
    const codepoints = new Set<number>();

    for (const glyph of iconCatalog.icons) {
      expect(glyph.name).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      expect(glyph.ligature).toBe(`:${glyph.name}:`);
      expect(glyph.codepoint).toBeGreaterThanOrEqual(0xe000);
      expect(glyph.codepoint).toBeLessThanOrEqual(0xf8ff);
      expect(names.has(glyph.name)).toBe(false);
      expect(ligatures.has(glyph.ligature)).toBe(false);
      expect(codepoints.has(glyph.codepoint)).toBe(false);
      names.add(glyph.name);
      ligatures.add(glyph.ligature);
      codepoints.add(glyph.codepoint);
    }
  });

  it('registers all 186 glyphs under minim extension keys', () => {
    for (const {name} of iconCatalog.icons) {
      const node = minimIconRegistry[`minim:${name}`];
      expect(node).toBeDefined();
      expect(renderToStaticMarkup(<>{node}</>)).toContain(`:${name}:`);
    }
  });

  it('normalizes the verified font line box inside a square 1em slot', () => {
    const markup = renderToStaticMarkup(
      <>{minimIconRegistry['minim:checkbox']}</>,
    );

    expect(markup).toContain('height:1em');
    expect(markup).toContain('width:1em');
    expect(markup).toContain('font-size:0.75em');
    expect(markup).toContain('line-height:1.3333333333333333');
  });

  it('uses exactly the approved semantic mappings', () => {
    expect(minimSemanticGlyphNames).toEqual({
      close: 'close',
      chevronDown: 'chevron-down',
      chevronLeft: 'chevron-left',
      chevronRight: 'chevron-right',
      check: 'check',
      success: 'check-circle-solid',
      error: 'close-circle-solid',
      warning: 'warning-triangle-solid',
      info: 'info-circle',
      calendar: 'calendar',
      clock: 'time',
      externalLink: 'open-window',
      menu: 'menu',
      moreHorizontal: 'more-horiz',
      search: 'search',
      arrowUp: 'arrow-up',
      arrowDown: 'arrow-down',
      copy: 'copy',
      stop: 'stop',
    });

    for (const semanticName of Object.keys(minimSemanticGlyphNames) as Array<
      keyof typeof minimSemanticGlyphNames
    >) {
      const glyphName = minimSemanticGlyphNames[semanticName];
      expect(iconCatalog.icons.some(glyph => glyph.name === glyphName)).toBe(
        true,
      );
      const markup = renderToStaticMarkup(
        <>{minimIconRegistry[semanticName]}</>,
      );
      expect(markup).toContain(`:${glyphName}:`);
      expect(markup).toContain('aria-hidden="true"');
      expect(markup).not.toContain('<svg');
    }
  });

  it('uses close-mini only for the Token remove affordance', () => {
    const tokenRemove = renderToStaticMarkup(
      <>{minimIconRegistry['token:remove']}</>,
    );
    const globalClose = renderToStaticMarkup(<>{minimIconRegistry.close}</>);

    expect(tokenRemove).toContain(':close-mini:');
    expect(globalClose).toContain(':close:');
    expect(globalClose).not.toContain(':close-mini:');
  });

  it('leaves unapproved or unavailable semantic icons unmapped', () => {
    expect(minimUnmappedIconNames).toEqual([
      'chevronsLeft',
      'chevronsRight',
      'arrowsUpDown',
      'funnel',
      'eyeSlash',
      'viewColumns',
      'checkDouble',
      'wrench',
      'microphone',
    ]);

    for (const iconName of minimUnmappedIconNames) {
      expect(minimIconRegistry[iconName]).toBeUndefined();
    }
  });
});
