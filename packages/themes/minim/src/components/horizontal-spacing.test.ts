// Copyright (c) Meta Platforms, Inc. and affiliates.

import {describe, expect, it} from 'vitest';
import {minimInputComponents} from './input';
import {minimSelectionComponents} from './selection';
import {minimBadgeTokenComponents} from './badge-token';
import {minimButtonComponents} from './button';

describe('shared horizontal content contract', () => {
  it('removes label insets without removing vertical insets', () => {
    for (const size of ['md', 'lg'] as const) {
      for (const styles of [
        minimInputComponents['text-input-control'][`size:${size}`],
        minimInputComponents['number-input-control'][`size:${size}`],
        minimSelectionComponents['segmented-control-item-label'][
          `size:${size}`
        ],
        minimBadgeTokenComponents['badge-label'][`size:${size}`],
      ]) {
        expect(styles.paddingInline).toBe('0');
        expect(styles.paddingBlock).toContain('padding-block');
      }
    }
    for (const size of ['sm', 'md'] as const) {
      expect(
        minimBadgeTokenComponents['token-label'][`size:${size}`].paddingInline,
      ).toBe('0');
    }
  });
  it('keeps XL no narrower than large', () => {
    expect(minimButtonComponents.button['size:xl'].paddingInline).toBe(
      minimButtonComponents.button['size:lg'].paddingInline,
    );
  });
});
