// Copyright (c) Meta Platforms, Inc. and affiliates.

import {describe, expect, it} from 'vitest';
import {defineTheme, generateThemeRules} from '@astryxdesign/core/theme';
import {minimContentComponents} from './content';

describe('Minim content component styles', () => {
  it('keeps source-fixed Avatar, status, Thumbnail, and Kbd geometry', () => {
    expect(minimContentComponents.avatar['size:xl']).toEqual({
      width: '128px',
      height: '128px',
    });
    expect(
      minimContentComponents['avatar-status-dot']['sizeTier:small'],
    ).toEqual({width: '10px', height: '10px'});
    expect(minimContentComponents.thumbnail.base).toMatchObject({
      width: '64px',
      height: '64px',
      borderRadius: 'var(--minim-radius-element)',
    });
    expect(minimContentComponents['kbd-key'].base).toMatchObject({
      minWidth: '20px',
      height: '20px',
      fontFamily: 'var(--minim-font-family-base)',
      fontWeight: 'var(--minim-typography-font-weight-medium)',
    });
  });

  it('uses authoritative exported typography scales', () => {
    expect(minimContentComponents.heading['level:1']).toMatchObject({
      fontSize: 'var(--minim-typography-font-size-3xl)',
      lineHeight: 'var(--minim-typography-line-height-3xl)',
      fontWeight: 'var(--minim-typography-font-weight-bold)',
    });
    expect(minimContentComponents.heading['level:4']).toMatchObject({
      fontSize: 'var(--minim-typography-font-size-lg)',
      lineHeight: 'var(--minim-typography-line-height-lg)',
    });
    expect(minimContentComponents['code-block-code']['size:md']).toEqual({
      fontSize: 'var(--minim-typography-font-size-md)',
      lineHeight: 'var(--minim-typography-line-height-md)',
    });
    expect(minimContentComponents.code.base.fontFamily).toBe(
      'var(--minim-font-family-code)',
    );
    expect(
      minimContentComponents.timestamp['typography:source-default'],
    ).toMatchObject({
      fontSize: 'var(--minim-typography-font-size-xs)',
      lineHeight: 'var(--minim-typography-line-height-xs)',
    });
    expect(minimContentComponents['empty-state-title'].base).toMatchObject({
      fontSize: 'var(--minim-typography-font-size-3xl)',
      lineHeight: 'var(--minim-typography-line-height-3xl)',
    });
    expect(minimContentComponents['empty-state'].base.paddingInline).toBe(
      '1.5rem',
    );
  });

  it('does not let Text base styles override explicit type or size styles', () => {
    expect(minimContentComponents.text.base).toEqual({
      fontFamily: 'var(--minim-font-family-base)',
    });
    expect(minimContentComponents.text.base).not.toHaveProperty('fontSize');
    expect(minimContentComponents.text.base).not.toHaveProperty('lineHeight');
    expect(minimContentComponents.text['type:body']).toMatchObject({
      fontSize: 'var(--minim-typography-font-size-md)',
      lineHeight: 'var(--minim-typography-line-height-md)',
    });
    expect(minimContentComponents.timestamp.base).not.toHaveProperty(
      'fontSize',
    );
    expect(minimContentComponents.timestamp.base).not.toHaveProperty(
      'lineHeight',
    );
  });

  it('keeps content widths consumer-driven', () => {
    expect(minimContentComponents.markdown.base).not.toHaveProperty('width');
    expect(minimContentComponents['code-block'].base).not.toHaveProperty(
      'width',
    );
    expect(minimContentComponents.citation.base).not.toHaveProperty('width');
    expect(minimContentComponents['empty-state'].base).not.toHaveProperty(
      'width',
    );
    expect(minimContentComponents.blockquote.base).not.toHaveProperty('width');
  });

  it('emits selectors for existing and additive anatomy targets', () => {
    const theme = defineTheme({
      name: 'minim-content-test',
      components: minimContentComponents,
    });
    const css = generateThemeRules(theme).join('\n');

    expect(css).toContain('.astryx-avatar[data-size="xl"]');
    expect(css).toContain('.astryx-avatar-status-dot[data-size-tier="small"]');
    expect(css).toContain('.astryx-citation-label');
    expect(css).toContain('.astryx-code-block-code[data-size="sm"]');
    expect(css).toContain('.astryx-markdown-heading[data-level="1"]');
    expect(css).toContain('.astryx-kbd-key');
  });
});
