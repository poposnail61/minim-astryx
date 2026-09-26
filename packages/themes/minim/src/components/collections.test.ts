// Copyright (c) Meta Platforms, Inc. and affiliates.

import {describe, expect, it} from 'vitest';
import {minimCollectionComponents as components} from './collections';

describe('Collection density sizing', () => {
  it('uses shared slot metrics for both ListItem sizes', () => {
    for (const [size, name] of [
      ['md', 'medium'],
      ['lg', 'large'],
    ] as const) {
      const rules = components['list-item'][`size:${size}`];
      expect(rules.paddingBlock).toBe(
        `var(--minim-component-${name}-padding-block)`,
      );
      expect(rules['--item-content-padding-block']).toBe(
        `var(--minim-component-${name}-padding-block-slot)`,
      );
      expect(rules['--item-label-line-height']).toBe(
        `var(--minim-typography-line-height-${size})`,
      );
    }
    for (const [line, inset, padding, height] of [
      [20, 2, 6, 36],
      [22, 3, 8, 44],
      [18, 1, 4, 28],
      [20, 2, 6, 36],
    ]) {
      expect(line + 2 * inset + 2 * padding).toBe(height);
    }
  });

  it('sizes balanced tree rows from the medium content box and row padding', () => {
    expect(components['tree-list-item']['density:balanced'].paddingBlock).toBe(
      'var(--minim-component-medium-padding-block)',
    );
    expect(components['tree-list-item-label'].base.minHeight).toBe(
      'calc(var(--minim-typography-line-height-md) + 2 * var(--minim-component-medium-padding-block-slot))',
    );
    for (const [box, padding, height] of [
      [24, 6, 36],
      [20, 4, 28],
    ]) {
      expect(box + 2 * padding).toBe(height);
    }
  });

  it('leaves table padding content-driven', () => {
    expect(components['table-cell'].base).not.toHaveProperty('height');
    expect(components['table-cell'].base).not.toHaveProperty('paddingBlock');
    expect(components['table-header-cell'].base).not.toHaveProperty('height');
  });
});
