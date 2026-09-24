// Copyright (c) Meta Platforms, Inc. and affiliates.

import {describe, expect, it} from 'vitest';
import {minimNavigationComponents} from './navigation';

describe('Minim navigation horizontal spacing', () => {
  it('uses menu spacing for both navigation sizes', () => {
    for (const name of ['side-nav-item', 'top-nav-item'] as const) {
      for (const size of ['size:md', 'size:lg'] as const) {
        expect(minimNavigationComponents[name][size].paddingInline).toBe(
          'var(--minim-spacing-300)',
        );
      }
    }
    expect(
      minimNavigationComponents['side-nav-heading'].base.paddingInline,
    ).toBe('var(--minim-spacing-300)');
  });
  it('preserves collapsed navigation zero inset', () => {
    expect(
      minimNavigationComponents['side-nav-item']['size:lg+collapsed:true']
        .paddingInline,
    ).toBe('0');
  });
});
