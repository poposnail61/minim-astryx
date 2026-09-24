// Copyright (c) Meta Platforms, Inc. and affiliates.

import {describe, expect, it} from 'vitest';
import {JSDOM} from 'jsdom';
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

describe('Minim input icon paint', () => {
  it('only neutralizes secondary affordances, not semantic status colors', () => {
    const selectors = Object.entries(minimIconComponents.icon.base)
      .filter(([, rule]) => typeof rule === 'object' && 'color' in rule)
      .map(([selector]) => selector);
    const dom = new JSDOM();
    try {
      const {document} = dom.window;
      for (const hostClass of [
        'astryx-selector',
        'astryx-typeahead',
        'astryx-multi-selector',
        'astryx-tokenizer',
      ]) {
        const host = document.createElement('div');
        host.className = hostClass;
        document.body.append(host);
        const icon = document.createElement('span');
        icon.className = 'astryx-icon';
        host.append(icon);
        for (const color of [
          'secondary',
          'error',
          'warning',
          'success',
          'disabled',
        ]) {
          icon.dataset.color = color;
          expect(
            selectors.some(selector => icon.matches(selector)),
            `${hostClass}: ${color}`,
          ).toBe(color === 'secondary');
        }
      }
    } finally {
      dom.window.close();
    }
  });
});
