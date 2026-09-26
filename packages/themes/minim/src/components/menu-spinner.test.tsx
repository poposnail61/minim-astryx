// Copyright (c) Meta Platforms, Inc. and affiliates.

import {describe, expect, it} from 'vitest';
import {generateThemeCSS} from '@astryxdesign/core/theme';
import {minimMenuSpinnerComponents} from './menu-spinner';
import {minimMenuIndicators} from '../indicators';
import {minimTheme} from '../minimTheme';

describe('Minim menu and Spinner overrides', () => {
  it('shares responsive medium and large geometry across all menu row families', () => {
    for (const key of [
      'dropdown-menu-item',
      'selector-option-row',
      'multi-selector-option',
      'typeahead-option-row',
      'date-time-input-time-option',
      'nav-heading-menu-item',
    ] as const) {
      for (const [size, component] of [
        ['md', 'medium'],
        ['lg', 'large'],
      ] as const) {
        const row = minimMenuSpinnerComponents[key][`size:${size}`];
        expect(row.minHeight).toBe(
          `var(--minim-component-${component}-height)`,
        );
        expect(row['--text-body-size']).toBe(
          `var(--minim-typography-font-size-${size})`,
        );
        expect(row.paddingInline).toBe('var(--minim-spacing-300)');
        expect(row.paddingBlock).toContain(
          `--minim-component-${component}-padding-block`,
        );
      }
    }
  });

  it('keeps selection separate from keyboard and pointer highlight in listboxes', () => {
    for (const key of [
      'selector-option-row',
      'multi-selector-option',
      'typeahead-option-row',
      'date-time-input-time-option',
    ] as const) {
      const row = minimMenuSpinnerComponents[key].base;
      expect(row[':is([aria-selected="true"])']).toEqual({
        backgroundColor: 'var(--minim-bg-neutral)',
        fontWeight: 'var(--minim-typography-font-weight-regular)',
      });
      expect(
        row[':is([data-highlighted="true"]):not([aria-disabled="true"])']
          .backgroundImage,
      ).toContain('--minim-bg-overlay-hover');
    }
  });

  it('matches independent selected, hover and disabled Figma menu states', () => {
    const row = minimMenuSpinnerComponents['dropdown-menu-item'].base;
    expect(row[':is([aria-checked="true"])'].backgroundColor).toBe(
      'var(--minim-bg-neutral)',
    );
    expect(row[':focus:not([aria-disabled="true"])'].backgroundColor).toBe(
      'var(--minim-bg-overlay-hover)',
    );
    expect(
      row[':is([aria-checked="true"]):focus:not([aria-disabled="true"])'],
    ).toEqual({
      backgroundColor: 'var(--minim-bg-neutral)',
      backgroundImage:
        'linear-gradient(var(--minim-bg-overlay-hover), var(--minim-bg-overlay-hover))',
    });
    expect(row[':is([aria-disabled="true"])']).toEqual({
      opacity: '0.5',
      '--item-disabled-opacity': '1',
      backgroundImage: 'none',
    });
    const {component} = generateThemeCSS(minimTheme);
    expect(component).toContain(
      'linear-gradient(var(--minim-bg-overlay-hover), var(--minim-bg-overlay-hover))',
    );
  });
  it('scales embedded spinner geometry with the density typography tokens', () => {
    for (const [size, typography, ratio] of [
      ['sm', 'md', '0.85'],
      ['md', 'md', '0.85'],
      ['lg', 'lg', '0.875'],
    ] as const) {
      const recipe = minimMenuSpinnerComponents.spinner[`size:${size}`];
      expect(recipe['--spinner-box-size']).toBe(
        `var(--minim-typography-line-height-${typography})`,
      );
      expect(recipe['--spinner-diameter']).toBe(
        `calc(var(--minim-typography-line-height-${typography}) * ${ratio})`,
      );
    }
  });
  it('shares a single-inset surface across suggestion and calendar popups', () => {
    for (const key of [
      'selector-popup',
      'multi-selector-popup',
      'typeahead-popup',
      'date-input-popup',
      'date-range-input-popup',
      'date-time-input-popup',
      'date-time-input-time-popup',
    ] as const) {
      expect(minimMenuSpinnerComponents[key].base).toMatchObject({
        padding: '0',
        borderRadius: 'var(--minim-radius-container)',
        boxShadow: 'var(--minim-elevation-low)',
      });
    }
    expect(minimMenuSpinnerComponents['dropdown-menu'].base.gap).toBe(
      'var(--minim-spacing-50)',
    );
  });
  it('gives Selector one list inset and large Minim option typography', () => {
    expect(minimMenuSpinnerComponents['selector-popup'].base).toMatchObject({
      padding: '0',
      '--selector-list-padding': 'var(--minim-spacing-200)',
      '--selector-list-gap': 'var(--minim-spacing-50)',
    });
    expect(
      minimMenuSpinnerComponents['selector-option-row'].base,
    ).toMatchObject({
      paddingBlock: 'var(--minim-component-large-padding-block)',
      paddingInline: 'var(--minim-spacing-300)',
      '--text-body-size': 'var(--minim-typography-font-size-lg)',
    });
  });
  it('keeps menu surfaces caller-sized, borderless, and token-driven', () => {
    const surface = minimMenuSpinnerComponents['context-menu'].base;
    expect(surface).not.toHaveProperty('width');
    expect(surface).not.toHaveProperty('minWidth');
    expect(surface).not.toHaveProperty('border');
    expect(surface).not.toHaveProperty('borderWidth');
    expect(surface).toMatchObject({
      padding: 'var(--minim-spacing-200)',
      borderRadius: 'var(--minim-radius-container)',
      backgroundColor: 'var(--minim-bg-layer)',
    });
    expect(minimTheme.localTokens?.['--minim-elevation-low']).toBe(
      '0rem 0.0625rem 0.0625rem 0rem rgb(0% 0% 0% / 10.000000149011612%), 0rem 0.125rem 0.5rem 0rem rgb(0% 0% 0% / 10.000000149011612%)',
    );
  });

  it('inherits radio-row sizing from the shared menu item recipe', () => {
    expect(minimMenuSpinnerComponents['menu-radio-row']).toEqual({
      base: {paddingInline: 'var(--minim-spacing-300)'},
    });
  });

  it('maps Spinner through public variables and semantic paint tokens', () => {
    expect(minimMenuSpinnerComponents.spinner['size:xl']).toEqual({
      '--spinner-diameter': '32px',
      '--spinner-stroke-width': '4px',
      '--spinner-box-size': '36px',
      '--spinner-arc-fraction': '0.75',
    });
    expect(minimMenuSpinnerComponents.spinner['shade:default']).toEqual({
      '--spinner-color': 'var(--minim-fg-neutral)',
      '--spinner-track-color': 'var(--minim-stroke-neutral)',
    });
    expect(minimMenuSpinnerComponents.spinner['shade:onMedia']).toEqual({
      '--spinner-color': 'var(--minim-fg-on-surface)',
      '--spinner-track-color': 'var(--minim-fg-on-surface-subtle)',
    });
  });

  it('registers menu-only indicators backed by existing catalog glyphs', () => {
    expect(Object.keys(minimMenuIndicators)).toEqual([
      'menu-checkbox',
      'menu-radio',
    ]);
    expect(minimTheme.icons?.['minim:check']).toBeDefined();
    expect(minimTheme.icons?.['minim:dot']).toBeDefined();
    expect(minimTheme.icons?.['minim:check-mini-solid']).toBeUndefined();
    expect(minimTheme.icons?.['minim:dot-solid']).toBeUndefined();
  });

  it('emits the menu-radio-row and Spinner selectors', () => {
    const {component} = generateThemeCSS(minimTheme);
    expect(component).toContain('.astryx-menu-radio-row');
    expect(component).toContain('.astryx-spinner[data-shade="onMedia"]');
    expect(component).toContain(
      '--spinner-track-color: var(--minim-stroke-neutral)',
    );
  });
});
