// Copyright (c) Meta Platforms, Inc. and affiliates.

import {describe, expect, it} from 'vitest';
import {generateThemeCSS} from '@astryxdesign/core/theme';
import {minimMenuSpinnerComponents} from './menu-spinner';
import {minimMenuIndicators} from '../indicators';
import {minimTheme} from '../minimTheme';

describe('Minim menu and Spinner overrides', () => {
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
      paddingBlock: 'var(--minim-row-large-padding-block)',
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

  it('preserves radio-row vertical sizing with shared menu inline spacing', () => {
    expect(minimMenuSpinnerComponents['menu-radio-row']['size:md']).toEqual({
      minHeight: '2.5rem',
      gap: '0.5rem',
      padding: '0.5rem',
      paddingInline: 'var(--minim-spacing-300)',
      borderRadius: '0.625rem',
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
    expect(component).toContain('.astryx-menu-radio-row[data-size="md"]');
    expect(component).toContain('.astryx-spinner[data-shade="onMedia"]');
    expect(component).toContain(
      '--spinner-track-color: var(--minim-stroke-neutral)',
    );
  });
});
