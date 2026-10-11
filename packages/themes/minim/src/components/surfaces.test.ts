// Copyright (c) Meta Platforms, Inc. and affiliates.

import {describe, expect, it} from 'vitest';
import {minimSurfaceComponents} from './surfaces';

describe('Minim dialog geometry', () => {
  it('uses the Figma container radius and spacing in both density modes', () => {
    expect(minimSurfaceComponents.dialog.base).toEqual({
      borderRadius: 'var(--minim-radius-container)',
      padding: 'var(--minim-spacing-500)',
    });
    expect(
      minimSurfaceComponents.dialog['variant:fullscreen'].borderRadius,
    ).toBe('0');
  });
  it('matches the dialog title typography without changing its heading semantics', () => {
    expect(
      minimSurfaceComponents['dialog-header-title-block'].base,
    ).toMatchObject({
      '--text-heading-2-size': 'var(--minim-typography-font-size-xl)',
      '--text-heading-2-leading': 'var(--minim-typography-line-height-xl)',
    });
  });
});
