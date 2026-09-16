// Copyright (c) Meta Platforms, Inc. and affiliates.

import {describe, expect, it} from 'vitest';
import {defineTheme, generateThemeCSS} from '@astryxdesign/core/theme';
import {minimAdvancedComponents} from './advanced';
import {minimBaseTokens, minimCompactTokens} from '../minimTokens.generated';

const px = (value: string) => Number.parseFloat(value) * 16;

describe('Minim advanced component styles', () => {
  it('keeps audited unbound primitives density-independent', () => {
    expect(minimAdvancedComponents.calendar.base).toMatchObject({
      '--calendar-cell-size': '32px',
      borderRadius: 'var(--minim-radius-container)',
    });
    expect(minimAdvancedComponents['calendar-day'].base).toMatchObject({
      width: '28px',
      height: '28px',
    });
    expect(minimAdvancedComponents['slider-track'].base).toMatchObject({
      backgroundColor: 'var(--minim-fg-neutral)',
    });
    expect(
      minimAdvancedComponents['slider-track']['orientation:horizontal'],
    ).toEqual({height: '4px'});
    expect(
      minimAdvancedComponents['slider-track']['orientation:vertical'],
    ).toEqual({width: '4px'});
  });

  it('derives power-search height inside the border box in both densities', () => {
    const height = (tokens: typeof minimBaseTokens) =>
      px(tokens['--minim-typography-line-height-md']) +
      2 * px(tokens['--minim-spacing-150']);

    expect(height(minimBaseTokens)).toBe(32);
    expect(height(minimCompactTokens)).toBe(26);
    expect(
      minimAdvancedComponents['power-search-trigger'].base[
        '--power-search-trigger-min-height'
      ],
    ).not.toContain('+ 2px');
    expect(
      minimAdvancedComponents['power-search-trigger'].base[
        '--power-search-focus-border-color'
      ],
    ).toBe('var(--minim-stroke-primary)');
  });

  it('keeps file input border inside 32px and maps popover mode padding', () => {
    const fileHeight = (tokens: typeof minimBaseTokens) =>
      px(tokens['--minim-content-medium-box-size']) +
      2 * px(tokens['--minim-spacing-100']);

    expect(fileHeight(minimBaseTokens)).toBe(32);
    expect(minimAdvancedComponents['file-input'].base.boxSizing).toBe(
      'border-box',
    );
    expect(
      minimAdvancedComponents['power-search-popover']['mode:fields'].padding,
    ).toBe('var(--minim-spacing-100)');
    expect(
      minimAdvancedComponents['power-search-popover']['mode:value-editor'][
        '--power-search-popover-padding'
      ],
    ).toBe('var(--minim-spacing-300)');
    expect(
      minimAdvancedComponents['power-search-popover']['mode:results'].padding,
    ).toBe('var(--minim-spacing-200)');
  });

  it('keeps specimen widths fluid and emits approved targets', () => {
    const serialized = JSON.stringify(minimAdvancedComponents);
    expect(serialized).not.toContain('752px');
    expect(serialized).not.toContain('488px');
    expect(serialized).not.toContain('280px');

    const {component} = generateThemeCSS(
      defineTheme({
        name: 'minim-advanced-contract',
        components: minimAdvancedComponents,
      }),
    );
    expect(component).toContain('.astryx-calendar');
    expect(component).toContain('.astryx-power-search-trigger');
    expect(component).toContain('.astryx-power-search-popover');
    expect(component).toContain('[data-mode="value-editor"]');
    expect(component).toContain('.astryx-file-input');
    expect(component).toContain('.astryx-slider-track');
    expect(component).toContain('.astryx-slider-mark');
  });
});
