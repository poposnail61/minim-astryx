// Copyright (c) Meta Platforms, Inc. and affiliates.

import {describe, expect, it} from 'vitest';
import {defineTheme, generateThemeRules} from '@astryxdesign/core/theme';
import {minimBadgeTokenComponents} from './badge-token';

describe('Minim Badge and Token overrides', () => {
  it('keeps Badge sizing content-driven', () => {
    expect(minimBadgeTokenComponents.badge.base).toMatchObject({
      height: 'auto',
      paddingBlock: '0',
      paddingInline: 'var(--minim-spacing-100)',
      borderRadius: 'var(--minim-radius-full)',
    });
    expect(minimBadgeTokenComponents.badge['size:dot']).toMatchObject({
      width: 'var(--minim-spacing-200)',
      height: 'var(--minim-spacing-200)',
    });
    expect(minimBadgeTokenComponents['badge-label']['size:md']).toMatchObject({
      paddingInline: 'var(--minim-spacing-50)',
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
    expect(minimBadgeTokenComponents.token['color:blue']).toEqual({
      backgroundColor: 'var(--minim-bg-primary)',
      color: 'var(--minim-fg-primary)',
    });
    expect(minimBadgeTokenComponents['token-label']['size:sm']).toMatchObject({
      paddingInline: 'var(--minim-spacing-50)',
      lineHeight: 'var(--minim-typography-line-height-xs)',
    });
    expect(minimBadgeTokenComponents['token-icon']['size:md']).toMatchObject({
      '--minim-icon-box-size': 'var(--minim-typography-line-height-sm)',
      width: 'var(--minim-content-supporting-large-icon-box-width)',
      height: 'var(--minim-content-supporting-large-box-size)',
    });
    expect(
      minimBadgeTokenComponents['token-end-content']['size:md'],
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
});
