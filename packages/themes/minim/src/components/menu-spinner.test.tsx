// Copyright (c) Meta Platforms, Inc. and affiliates.

import {describe, expect, it} from 'vitest';
import {generateThemeCSS} from '@astryxdesign/core/theme';
import {minimMenuSpinnerComponents} from './menu-spinner';
import {minimMenuIndicators} from '../indicators';
import {minimTheme} from '../minimTheme';

describe('Minim menu and Spinner overrides', () => {
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

  it('preserves the unbound radio-row exception without compact scaling', () => {
    expect(minimMenuSpinnerComponents['menu-radio-row']['size:md']).toEqual({
      minHeight: '2.5rem',
      gap: '0.5rem',
      padding: '0.5rem',
      borderRadius: '0.625rem',
    });
  });

  it('maps Spinner through public variables and semantic paint tokens', () => {
    expect(minimMenuSpinnerComponents.spinner['size:xl']).toEqual({
      '--spinner-diameter': '28px',
      '--spinner-stroke-width': '4px',
      '--spinner-arc-fraction': '0.375',
    });
    expect(minimMenuSpinnerComponents.spinner['shade:default']).toEqual({
      '--spinner-color': 'var(--minim-fg-neutral)',
      '--spinner-track-color': 'var(--minim-stroke-neutral)',
    });
    expect(minimMenuSpinnerComponents.spinner['shade:onMedia']).toEqual({
      '--spinner-color': 'var(--minim-fg-on-surface)',
      '--spinner-track-color': 'var(--minim-fg-on-surface)',
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
