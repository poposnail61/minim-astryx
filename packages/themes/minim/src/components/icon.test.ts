// Copyright (c) Meta Platforms, Inc. and affiliates.

import {describe, expect, it} from 'vitest';
import {defineTheme, generateThemeCSS} from '@astryxdesign/core/theme';
import {minimIconComponents} from './icon';

describe('Minim Icon overrides', () => {
  it.each([
    ['xsm', 'xs'],
    ['sm', 'sm'],
    ['md', 'md'],
    ['lg', 'lg'],
  ] as const)('maps %s to its semantic line-height fallback', (size, token) => {
    const expected = `var(--minim-icon-box-size, var(--minim-typography-line-height-${token}))`;
    expect(minimIconComponents.icon[`size:${size}`]).toEqual({
      width: expected,
      height: expected,
      fontSize: expected,
    });
  });

  it('does not force icon paint', () => {
    for (const rule of Object.values(minimIconComponents.icon)) {
      expect(rule).not.toHaveProperty('color');
      expect(rule).not.toHaveProperty('fill');
      expect(rule).not.toHaveProperty('stroke');
    }
  });

  it('emits the existing icon target and size axes', () => {
    const theme = defineTheme({
      name: 'minim-icon-contract',
      components: minimIconComponents,
    });
    const {component} = generateThemeCSS(theme);

    expect(component).toContain('.astryx-icon[data-size="xsm"]');
    expect(component).toContain('.astryx-icon[data-size="lg"]');
    expect(component).toContain('--minim-icon-box-size');
  });
});
