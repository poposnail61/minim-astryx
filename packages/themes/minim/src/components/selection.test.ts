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
    2 * px(tokens[`--minim-content-${size}-text-inset-block`]) +
    2 * px(tokens[`--minim-control-item-${size}-padding-block`]) +
    2 * px(tokens['--minim-spacing-50'])
  );
}

describe('Minim selection component styles', () => {
  it('uses the Figma switch dimensions and shared geometry in both densities', () => {
    const field = minimSelectionComponents['switch-field'];
    expect(field.base['--switch-width']).toBe('3.375rem');
    expect(field['size:lg']['--switch-width']).toBe('4rem');
    expect(px(minimBaseTokens['--minim-content-medium-box-size'])).toBe(24);
    expect(px(minimCompactTokens['--minim-content-medium-box-size'])).toBe(20);
    expect(px(minimBaseTokens['--minim-content-large-box-size'])).toBe(28);
    expect(px(minimCompactTokens['--minim-content-large-box-size'])).toBe(24);
    expect(minimSelectionComponents['switch-thumb'].base.height).toBe(
      'calc(var(--switch-height) - 2 * var(--switch-padding))',
    );
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
      paddingBlock: 'var(--minim-content-medium-text-inset-block)',
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
      opacity: '1',
      backgroundColor: 'var(--minim-bg-disabled)',
    });
    expect(
      minimSelectionComponents['checkbox-indicator-check'].base.color,
    ).toBe('inherit');
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
      paddingBlock: 'var(--minim-control-item-medium-padding-block)',
      paddingInline: 'var(--minim-spacing-300)',
    });
    expect(
      minimSelectionComponents['segmented-control-item']['size:lg'],
    ).toEqual({
      height: 'auto',
      paddingBlock: 'var(--minim-control-item-large-padding-block)',
      paddingInline: 'var(--minim-spacing-400)',
    });
    expect(segmentedHeight(minimBaseTokens, 'medium')).toBe(36);
    expect(segmentedHeight(minimBaseTokens, 'large')).toBe(44);
    expect(segmentedHeight(minimCompactTokens, 'medium')).toBe(28);
    expect(segmentedHeight(minimCompactTokens, 'large')).toBe(36);
  });

  it('matches button horizontal spacing without adding label insets', () => {
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
      width: 'var(--minim-content-medium-icon-box-width)',
      fontSize: 'var(--minim-typography-line-height-md)',
      lineHeight: 'var(--minim-typography-line-height-md)',
    });
    expect(
      minimSelectionComponents['segmented-control-item-icon']['size:lg'],
    ).toMatchObject({
      '--minim-icon-box-size': 'var(--minim-typography-line-height-lg)',
      width: 'var(--minim-content-large-icon-box-width)',
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
    expect(component).toContain('.astryx-switch-field[data-size="lg"]');
    expect(component).toContain('.astryx-segmented-control-item-icon');
    expect(component).toContain('.astryx-segmented-control-item-label');
  });
});
