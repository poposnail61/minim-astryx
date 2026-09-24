// Copyright (c) Meta Platforms, Inc. and affiliates.

import {describe, expect, it} from 'vitest';
import {defineTheme, generateThemeRules} from '@astryxdesign/core/theme';
import {minimBadgeTokenComponents} from './badge-token';
import {minimBaseTokens, minimCompactTokens} from '../minimTokens.generated';
import type {MinimTokenColor} from '../token-colors';

describe('Minim Badge and Token overrides', () => {
  it('uses amber for warning without changing yellow or highlight', () => {
    for (const tokens of [minimBaseTokens, minimCompactTokens]) {
      expect(tokens['--minim-bg-warning']).toBe(tokens['--minim-bg-amber']);
      expect(tokens['--minim-fg-warning']).toBe(tokens['--minim-fg-amber']);
      expect(tokens['--minim-stroke-warning']).toBe(tokens['--minim-fg-amber']);
      expect(tokens['--minim-bg-warning']).not.toBe(
        tokens['--minim-bg-yellow'],
      );
      expect(tokens['--minim-bg-warning']).not.toBe(
        tokens['--minim-bg-highlight'],
      );
    }
  });
  it('adds amber through the theme color extension in both modes', () => {
    const color: MinimTokenColor = 'amber';
    expect(minimBadgeTokenComponents.token[`color:${color}`]).toEqual({
      backgroundColor: 'var(--minim-bg-amber)',
      color: 'var(--minim-fg-amber)',
    });
    for (const tokens of [minimBaseTokens, minimCompactTokens]) {
      expect(tokens['--minim-bg-amber']).toBeDefined();
      expect(tokens['--minim-fg-amber']).toBeDefined();
      expect(tokens['--minim-bg-amber']).not.toBe(tokens['--minim-bg-yellow']);
    }
  });
  it('uses body text line-height for Badge height while preserving its label', () => {
    expect(minimBadgeTokenComponents.badge.base).toMatchObject({
      height: 'var(--minim-typography-line-height-lg)',
      paddingBlock: '0',
      paddingInline: 'var(--minim-spacing-200)',
      gap: 'var(--minim-spacing-100)',
      borderRadius: 'var(--minim-radius-full)',
    });
    expect(minimBadgeTokenComponents.badge['size:dot']).toMatchObject({
      width: 'var(--minim-spacing-200)',
      height: 'var(--minim-spacing-200)',
    });
    expect(minimBadgeTokenComponents['badge-label']['size:md']).toMatchObject({
      paddingInline: '0',
      paddingBlock: 'var(--minim-content-supporting-medium-text-inset-block)',
      lineHeight: 'var(--minim-typography-line-height-xs)',
    });
    expect(minimBadgeTokenComponents['badge-icon']['size:lg']).toMatchObject({
      '--minim-icon-box-size': 'var(--minim-typography-line-height-sm)',
      width: 'var(--minim-content-supporting-large-icon-box-width)',
      height: 'var(--minim-content-supporting-large-box-size)',
      fontSize: 'var(--minim-typography-line-height-sm)',
    });
  });

  it('maps the eight canonical Badge appearances to semantic variables', () => {
    expect(minimBadgeTokenComponents.badge['variant:primary']).toEqual({
      backgroundColor: 'var(--minim-bg-primary-solid)',
      color: 'var(--minim-fg-on-surface)',
    });
    expect(minimBadgeTokenComponents.badge['variant:critical-subtle']).toEqual({
      backgroundColor: 'var(--minim-bg-critical)',
      color: 'var(--minim-fg-critical)',
    });
  });

  it('uses decoded Token color pairs and stable anatomy targets', () => {
    expect(minimBadgeTokenComponents.token.base).toMatchObject({
      paddingInline: 'var(--minim-spacing-200)',
      gap: 'var(--minim-spacing-100)',
      paddingBlock: '0',
    });
    expect(minimBadgeTokenComponents.token['color:blue']).toEqual({
      backgroundColor: 'var(--minim-bg-primary)',
      color: 'var(--minim-fg-primary)',
    });
    expect(minimBadgeTokenComponents['token-label']['size:sm']).toMatchObject({
      paddingInline: '0',
      lineHeight: 'var(--minim-typography-line-height-xs)',
    });
    expect(minimBadgeTokenComponents['token-icon']['size:lg']).toMatchObject({
      '--minim-icon-box-size': 'var(--minim-typography-line-height-sm)',
      width: 'var(--minim-content-supporting-large-icon-box-width)',
      height: 'var(--minim-content-supporting-large-box-size)',
    });
    expect(
      minimBadgeTokenComponents['token-end-content']['size:lg'],
    ).toMatchObject({
      height: 'var(--minim-content-supporting-large-box-size)',
      fontSize: 'var(--minim-typography-font-size-sm)',
      lineHeight: 'var(--minim-typography-line-height-sm)',
    });
    expect(
      minimBadgeTokenComponents['token-end-content']['size:md'],
    ).not.toHaveProperty('width');
    expect(minimBadgeTokenComponents['token-remove']['size:sm']).toMatchObject({
      '--minim-icon-box-size': 'var(--minim-typography-line-height-xs)',
      width: 'var(--minim-content-supporting-medium-icon-box-width)',
      height: 'var(--minim-content-supporting-medium-box-size)',
    });
    const theme = defineTheme({
      name: 'minim-badge-token-test',
      components: minimBadgeTokenComponents,
    });
    const css = generateThemeRules(theme).join('\n');
    expect(css).toContain('.astryx-badge[data-size="dot"]');
    expect(css).toContain('.astryx-badge-label[data-size="lg"]');
    expect(css).toContain('.astryx-token-remove[data-size="md"]');
  });

  it('shares mode-aware heights across Badge and Token sizes', () => {
    for (const [size, expected] of [
      ['md', [20, 18]],
      ['lg', [22, 20]],
    ] as const) {
      const variable = `--minim-typography-line-height-${size}` as const;
      for (const component of ['badge', 'token'] as const) {
        expect(
          minimBadgeTokenComponents[component][`size:${size}`].height,
        ).toBe(`var(${variable})`);
      }
      [minimBaseTokens, minimCompactTokens].forEach((tokens, index) => {
        expect(parseFloat(tokens[variable]) * 16).toBe(expected[index]);
      });
    }
    expect(minimBadgeTokenComponents['token-label']['size:md'].fontSize).toBe(
      'var(--minim-typography-font-size-xs)',
    );
    expect(minimBadgeTokenComponents['token-label']['size:lg'].fontSize).toBe(
      'var(--minim-typography-font-size-sm)',
    );
  });
});
