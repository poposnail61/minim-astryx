// Copyright (c) Meta Platforms, Inc. and affiliates.

import {describe, expect, it} from 'vitest';
import {defineTheme, generateThemeCSS} from '@astryxdesign/core/theme';
import {minimAdvancedComponents} from './advanced';
import {minimBaseTokens, minimCompactTokens} from '../minimTokens.generated';

const px = (value: string) => Number.parseFloat(value) * 16;

describe('Minim advanced component styles', () => {
  it('uses a quiet neutral today marker without changing selection', () => {
    for (const marker of [
      'marker:today-only',
      'marker:today-in-range',
    ] as const) {
      expect(minimAdvancedComponents['calendar-day'][marker].boxShadow).toBe(
        'inset 0 0 0 1px var(--minim-stroke-neutral)',
      );
    }
    expect(
      minimAdvancedComponents['calendar-day']['selected:selected']
        .backgroundColor,
    ).toBe('var(--minim-bg-primary-solid)');
  });
  it('keeps audited unbound primitives density-independent', () => {
    expect(minimAdvancedComponents.calendar.base).toMatchObject({
      '--calendar-cell-size':
        'calc(var(--minim-content-large-box-size) + 2 * var(--minim-control-large-padding-block))',
      '--calendar-cell-padding': 'var(--minim-spacing-50)',
      borderRadius: 'var(--minim-radius-container)',
    });
    expect(minimAdvancedComponents['calendar-day'].base).toMatchObject({
      width: '100%',
      height: '100%',
      fontSize: 'var(--minim-typography-font-size-lg)',
      lineHeight: 'var(--minim-typography-line-height-lg)',
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
      px(tokens['--minim-content-large-box-size']) +
      2 * px(tokens['--minim-control-large-padding-block']);

    expect(height(minimBaseTokens)).toBe(44);
    expect(height(minimCompactTokens)).toBe(36);
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

  it('keeps file input border inside large controls and maps popover mode padding', () => {
    const fileHeight = (tokens: typeof minimBaseTokens) =>
      px(tokens['--minim-content-large-box-size']) +
      2 * px(tokens['--minim-control-large-padding-block']);

    expect(fileHeight(minimBaseTokens)).toBe(44);
    expect(fileHeight(minimCompactTokens)).toBe(36);
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
