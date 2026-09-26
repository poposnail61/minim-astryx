// Copyright (c) Meta Platforms, Inc. and affiliates.

import {describe, expect, it} from 'vitest';
import {defineTheme, generateThemeCSS} from '@astryxdesign/core/theme';
import {minimSelectionComponents} from './selection';
import {minimBaseTokens, minimCompactTokens} from '../minimTokens.generated';

const px = (value: string) => Number.parseFloat(value) * 16;

function segmentedHeight(
  tokens: typeof minimBaseTokens | typeof minimCompactTokens,
  size: 'medium' | 'large',
) {
  const line = size === 'medium' ? 'md' : 'lg';
  return (
    px(tokens[`--minim-typography-line-height-${line}`]) +
    2 * px(tokens[`--minim-component-${size}-padding-block-slot`]) +
    2 * px(tokens[`--minim-component-${size}-padding-block-inner`]) +
    2 * px(tokens['--minim-spacing-50'])
  );
}

describe('Minim selection component styles', () => {
  it('uses spacing instead of retired content gap tokens', () => {
    expect(JSON.stringify(minimSelectionComponents)).not.toContain('text-gap');
    for (const tokens of [minimBaseTokens, minimCompactTokens]) {
      expect(Object.keys(tokens).some(key => key.endsWith('-text-gap'))).toBe(
        false,
      );
      expect(px(tokens['--minim-spacing-100'])).toBe(4);
    }
  });
  it('uses the Figma switch dimensions and shared geometry in both densities', () => {
    const field = minimSelectionComponents['switch-field'];
    expect(field.base['--switch-width']).toBe(
      'calc(var(--switch-thumb-height) * 2.5 + 2 * var(--switch-padding))',
    );
    expect(field.base['--switch-thumb-width']).toBe(
      'calc(var(--switch-thumb-height) * 1.5)',
    );
    expect(field.base['--switch-travel']).toBe('var(--switch-thumb-height)');
    expect(field.base['--switch-height']).toBe(
      'calc(var(--minim-spacing-500) + 2 * var(--switch-padding))',
    );
    expect(
      px(minimBaseTokens['--minim-typography-line-height-md']) +
        2 * px(minimBaseTokens['--minim-component-medium-padding-block-slot']),
    ).toBe(24);
    expect(
      px(minimCompactTokens['--minim-typography-line-height-md']) +
        2 *
          px(minimCompactTokens['--minim-component-medium-padding-block-slot']),
    ).toBe(20);
    expect(
      px(minimBaseTokens['--minim-typography-line-height-lg']) +
        2 * px(minimBaseTokens['--minim-component-large-padding-block-slot']),
    ).toBe(28);
    expect(
      px(minimCompactTokens['--minim-typography-line-height-lg']) +
        2 *
          px(minimCompactTokens['--minim-component-large-padding-block-slot']),
    ).toBe(24);
    expect(minimSelectionComponents['switch-thumb'].base.height).toBe(
      'var(--switch-thumb-height)',
    );
    for (const [tokens, widths] of [
      [minimBaseTokens, [54, 54]],
      [minimCompactTokens, [44, 44]],
    ] as const) {
      const padding = px(tokens['--minim-spacing-50']);
      for (const index of [0, 1]) {
        const inner = px(tokens['--minim-spacing-500']);
        expect(inner * 2.5 + 2 * padding).toBe(widths[index]);
      }
    }
  });
  it('keeps list rows transparent and maps selection indicators to tokens', () => {
    expect(minimSelectionComponents['checkbox-list-content'].base.gap).toBe(
      'var(--minim-spacing-200)',
    );
    expect(minimSelectionComponents['radio-list'].base.gap).toBe(
      'var(--minim-spacing-200)',
    );
    expect(minimSelectionComponents['checkbox-list-item'].base).toMatchObject({
      gap: 'var(--minim-spacing-200)',
      paddingBlock: 'var(--minim-spacing-100)',
      paddingInline: '0',
      backgroundColor: 'transparent',
    });
    expect(minimSelectionComponents['checkbox-indicator']['size:lg']).toEqual({
      width: 'var(--minim-typography-line-height-lg)',
      height: 'var(--minim-typography-line-height-lg)',
    });
    expect(
      minimSelectionComponents['checkbox-list-item']['size:sm'],
    ).toMatchObject({
      paddingBlock: 'var(--minim-component-medium-padding-block-slot)',
      fontSize: 'var(--minim-typography-font-size-md)',
      lineHeight: 'var(--minim-typography-line-height-md)',
    });
    expect(
      minimSelectionComponents['radio-indicator']['checked:checked'],
    ).toMatchObject({
      backgroundColor: 'var(--minim-bg-primary-solid)',
      color: 'var(--minim-fg-on-surface)',
    });
    expect(
      minimSelectionComponents['checkbox-indicator']['disabled:disabled'],
    ).toMatchObject({
      color: 'var(--minim-fg-disabled)',
      opacity: '1',
      backgroundColor: 'var(--minim-bg-disabled)',
    });
    expect(
      minimSelectionComponents['checkbox-indicator-check'].base.color,
    ).toBe('inherit');
  });

  it('uses Figma radio text and disabled colors without compounded opacity', () => {
    expect(minimSelectionComponents['radio-list-item'].base).toMatchObject({
      '--item-disabled-opacity': '1',
    });
    expect(
      minimSelectionComponents['radio-list-item']['disabled:disabled'],
    ).toMatchObject({
      opacity: '1',
      color: 'var(--minim-fg-disabled)',
    });
    expect(
      minimSelectionComponents['radio-indicator']['disabled:disabled'],
    ).toMatchObject({
      opacity: '1',
      color: 'var(--minim-fg-disabled)',
      backgroundColor: 'var(--minim-bg-disabled)',
    });
  });

  it('derives segmented geometry from content and padding in both densities', () => {
    expect(minimSelectionComponents['segmented-control'].base).toMatchObject({
      gap: 'var(--minim-spacing-50)',
      padding: 'var(--minim-spacing-50)',
      borderRadius: 'var(--minim-radius-element)',
    });
    expect(
      minimSelectionComponents['segmented-control-item']['size:md'],
    ).toEqual({
      height: 'auto',
      paddingBlock: 'var(--minim-component-medium-padding-block-inner)',
      paddingInline: 'var(--minim-spacing-300)',
    });
    expect(
      minimSelectionComponents['segmented-control-item']['size:lg'],
    ).toEqual({
      height: 'auto',
      paddingBlock: 'var(--minim-component-large-padding-block-inner)',
      paddingInline: 'var(--minim-spacing-300)',
    });
    expect(segmentedHeight(minimBaseTokens, 'medium')).toBe(36);
    expect(segmentedHeight(minimBaseTokens, 'large')).toBe(44);
    expect(segmentedHeight(minimCompactTokens, 'medium')).toBe(28);
    expect(segmentedHeight(minimCompactTokens, 'large')).toBe(36);
  });

  it('uses Figma segment spacing without adding label insets', () => {
    for (const size of ['md', 'lg'] as const) {
      expect(
        minimSelectionComponents['segmented-control-item'][`size:${size}`]
          .paddingInline,
      ).toBe('var(--minim-spacing-300)');
    }
    expect(minimSelectionComponents['segmented-control-item'].base.gap).toBe(
      'var(--minim-spacing-200)',
    );
    expect(
      minimSelectionComponents['segmented-control-item-label']['size:md']
        .paddingInline,
    ).toBe('0');
    expect(
      minimSelectionComponents['segmented-control-item-label']['size:lg']
        .paddingInline,
    ).toBe('0');
    expect([
      px(minimBaseTokens['--minim-spacing-400']),
      px(minimBaseTokens['--minim-spacing-300']),
      px(minimBaseTokens['--minim-spacing-200']),
    ]).toEqual([16, 12, 8]);
    expect([
      px(minimCompactTokens['--minim-spacing-400']),
      px(minimCompactTokens['--minim-spacing-300']),
      px(minimCompactTokens['--minim-spacing-200']),
    ]).toEqual([12, 10, 6]);
  });

  it('passes md and lg line-height context to the actual Icon target', () => {
    expect(
      minimSelectionComponents['segmented-control-item-icon']['size:md'],
    ).toMatchObject({
      '--minim-icon-box-size': 'var(--minim-typography-line-height-md)',
      width: 'var(--minim-component-medium-width-inline)',
      fontSize: 'var(--minim-typography-line-height-md)',
      lineHeight: 'var(--minim-typography-line-height-md)',
    });
    expect(
      minimSelectionComponents['segmented-control-item-icon']['size:lg'],
    ).toMatchObject({
      '--minim-icon-box-size': 'var(--minim-typography-line-height-lg)',
      width: 'var(--minim-component-large-width-inline)',
      fontSize: 'var(--minim-typography-line-height-lg)',
      lineHeight: 'var(--minim-typography-line-height-lg)',
    });
  });

  it('emits the existing and three approved new targets', () => {
    const theme = defineTheme({
      name: 'minim-selection-contract',
      components: minimSelectionComponents,
    });
    const {component} = generateThemeCSS(theme);

    expect(component).toContain('.astryx-checkbox-list-item');
    expect(component).toContain('.astryx-checkbox-list-content');
    expect(component).toContain('.astryx-radio-list');
    expect(component).toContain('.astryx-radio-list-item');
    expect(component).toContain('.astryx-switch-field');
    expect(component).toContain('.astryx-switch-label');
    expect(component).toContain('.astryx-segmented-control-item-icon');
    expect(component).toContain('.astryx-segmented-control-item-label');
  });
});
