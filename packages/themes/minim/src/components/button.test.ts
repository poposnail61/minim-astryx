// Copyright (c) Meta Platforms, Inc. and affiliates.

import {describe, expect, it} from 'vitest';
import {defineTheme, generateThemeRules} from '@astryxdesign/core/theme';
import {minimButtonComponents} from './button';

describe('Minim Button overrides', () => {
  it('exports one additive component map with stable anatomy targets', () => {
    expect(Object.keys(minimButtonComponents)).toEqual([
      'button',
      'button-icon',
      'button-label',
      'button-end-content',
    ]);
    expect(minimButtonComponents.button['size:xl'].height).toContain(
      '--minim-control-xlarge-padding-block',
    );
    expect(minimButtonComponents.button['content:icon-only']).toEqual({
      paddingInline: '0',
      paddingBlock: '0',
    });
    expect(minimButtonComponents['button-label'].base.paddingInline).toBe('0');
    expect(minimButtonComponents.button.base.gap).toBe(
      'var(--minim-spacing-200)',
    );
    expect(minimButtonComponents.button['size:lg'].paddingInline).toBe(
      'var(--minim-spacing-400)',
    );
    expect(minimButtonComponents.button['size:md'].paddingBlock).toBe(
      'var(--minim-control-medium-padding-block)',
    );
    expect(minimButtonComponents['button-icon']['size:md']).toMatchObject({
      '--minim-icon-box-size': expect.stringContaining(
        '--minim-button-icon-size',
      ),
      width: expect.stringContaining('--minim-button-icon-size'),
      fontSize: expect.stringContaining('--minim-button-icon-size'),
      lineHeight: expect.stringContaining('--minim-button-icon-size'),
    });
    expect(minimButtonComponents['button-icon']['size:lg']).toMatchObject({
      '--minim-icon-box-size': 'var(--minim-typography-line-height-lg)',
      width: 'var(--minim-typography-line-height-lg)',
      fontSize: 'var(--minim-typography-line-height-lg)',
      lineHeight: 'var(--minim-typography-line-height-lg)',
    });
  });

  it('covers seven Minim variants and released compatibility variants', () => {
    expect(Object.keys(minimButtonComponents.button)).toEqual(
      expect.arrayContaining([
        'variant:primary',
        'variant:neutral',
        'variant:neutral-subtle',
        'variant:critical-subtle',
        'variant:ghost',
        'variant:outline',
        'variant:critical',
        'variant:secondary',
        'variant:destructive',
      ]),
    );
    expect(
      minimButtonComponents.button['variant:outline'].backgroundColor,
    ).toBe('var(--minim-bg-neutral-subtle)');
    expect(minimButtonComponents.button['variant:outline']).toMatchObject({
      borderWidth: '0',
      boxShadow: 'inset 0 0 0 1px var(--minim-stroke-neutral)',
    });
  });

  it('uses inset focus without layout shift and keeps an outline fallback', () => {
    const focused =
      minimButtonComponents.button['variant:primary'][':focus-visible'];
    expect(focused).toEqual({
      outlineWidth: '2px',
      outlineStyle: 'solid',
      outlineColor: 'transparent',
      outlineOffset: '2px',
      boxShadow: 'inset 0 0 0 2px var(--minim-stroke-primary)',
    });
    expect(minimButtonComponents.button.base[':active']).toEqual({
      transform: 'none',
    });
  });

  it('emits selectors for the root and each stable inner target', () => {
    const theme = defineTheme({
      name: 'minim-button-test',
      components: minimButtonComponents,
    });
    const css = generateThemeRules(theme).join('\n');

    expect(css).toContain('.astryx-button[data-size="xl"]');
    expect(css).toContain('.astryx-button[data-variant="critical-subtle"]');
    expect(css).toContain('.astryx-button-icon[data-size="md"]');
    expect(css).toContain('.astryx-button-label[data-size="lg"]');
    expect(css).toContain('.astryx-button-end-content');
  });
});
