// Copyright (c) Meta Platforms, Inc. and affiliates.

import {describe, expect, it} from 'vitest';
import {defineTheme, generateThemeRules} from '@astryxdesign/core/theme';
import {minimActionComponents} from './actions';

describe('Minim action component overrides', () => {
  it('keeps neutral ButtonGroup seams transparent without fixed widths', () => {
    const group = minimActionComponents['button-group'];
    expect(group['variant:neutral'].backgroundColor).toBe(
      'var(--minim-bg-transparent)',
    );
    expect(group['variant:outline'].backgroundColor).toBe(
      'var(--minim-bg-neutral-subtle)',
    );
    expect(group['variant:subtle'].backgroundColor).toBe(
      'var(--minim-bg-neutral)',
    );
    expect(group.base).not.toHaveProperty('width');
  });

  it('keeps Toggle public sizes while applying Button md/lg geometry', () => {
    const toggle = minimActionComponents['toggle-button'];
    expect(toggle['size:sm'].height).toContain(
      '--minim-content-medium-box-size',
    );
    expect(toggle['size:md'].height).toContain(
      '--minim-content-large-box-size',
    );
    expect(toggle['size:sm']['--minim-button-label-font-size']).toBe(
      'var(--minim-typography-font-size-md)',
    );
    expect(toggle['size:md']['--minim-button-label-font-size']).toBe(
      'var(--minim-typography-font-size-lg)',
    );
  });

  it('uses actual selected Toggle masters', () => {
    const toggle = minimActionComponents['toggle-button'];
    expect(toggle['variant:default+isPressed:false']).toMatchObject({
      backgroundColor: 'var(--minim-bg-neutral-subtle)',
      boxShadow: 'inset 0 0 0 1px var(--minim-stroke-neutral)',
    });
    expect(toggle['variant:default+isPressed:true']).toMatchObject({
      color: 'var(--minim-fg-on-surface)',
      backgroundColor: 'var(--minim-bg-neutral-solid)',
    });
    expect(toggle['variant:ghost+isPressed:false'].backgroundColor).toBe(
      'var(--minim-bg-transparent)',
    );
    expect(toggle['variant:ghost+isPressed:true'].backgroundColor).toBe(
      'var(--minim-bg-neutral)',
    );
  });

  it('matches Link variants, typography, gap, and external icon slot', () => {
    expect(minimActionComponents.link.base).toMatchObject({
      gap: 'var(--minim-spacing-50)',
      fontSize: 'var(--minim-typography-font-size-md)',
      lineHeight: 'var(--minim-typography-line-height-md)',
    });
    expect(minimActionComponents['link-label']['variant:neutral'].color).toBe(
      'var(--minim-fg-neutral)',
    );
    expect(minimActionComponents['link-label']['variant:muted'].color).toBe(
      'var(--minim-fg-muted)',
    );
    expect(minimActionComponents['link-label']['variant:primary'].color).toBe(
      'var(--minim-fg-primary)',
    );
    expect(
      minimActionComponents['link-external-icon'].base['--minim-icon-box-size'],
    ).toBe('var(--minim-typography-line-height-md)');
  });

  it('generates compound Toggle and stable Link anatomy selectors', () => {
    const theme = defineTheme({
      name: 'minim-actions-test',
      components: minimActionComponents,
    });
    const css = generateThemeRules(theme).join('\n');
    expect(css).toContain(
      '.astryx-toggle-button[data-variant="default"][data-is-pressed="true"]',
    );
    expect(css).toContain('.astryx-button-group[data-variant="outline"]');
    expect(css).toContain('.astryx-button-group[data-variant="neutral"]');
    expect(css).toContain('background-color: var(--minim-bg-transparent)');
    expect(css).toContain('.astryx-link-label[data-variant="muted"]');
    expect(css).toContain('.astryx-link-external-icon');
  });
});
