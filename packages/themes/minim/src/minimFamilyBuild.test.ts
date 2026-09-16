// Copyright (c) Meta Platforms, Inc. and affiliates.

import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {describe, expect, it} from 'vitest';

describe('Minim family build output', () => {
  it('emits every centrally merged component family', () => {
    const css = readFileSync(
      new URL('../dist/minim-family.css', import.meta.url),
      'utf8',
    );

    for (const selector of [
      '.astryx-button-label',
      '.astryx-toggle-button',
      '.astryx-badge',
      '.astryx-text-input',
      '.astryx-icon',
      '.astryx-segmented-control',
      '.astryx-menu-radio-row',
      '.astryx-spinner',
      '.astryx-calendar-day',
    ]) {
      expect(css).toContain(selector);
    }

    expect(css).toContain('.astryx-button[data-size="md"]');
    expect(css).toContain(
      'padding-block: var(--minim-control-medium-padding-block)',
    );
    expect(css).toContain(
      'padding-inline: var(--minim-button-label-inset-inline, var(--minim-spacing-100))',
    );
    expect(css).toContain(
      'padding-block: var(--minim-button-label-inset-block, var(--minim-content-medium-text-inset-block))',
    );
  });

  it('imports under the React server condition without the runtime bundle', () => {
    const familyUrl = new URL('../dist/minim-family.js', import.meta.url);
    const source = readFileSync(familyUrl, 'utf8');

    expect(source).toContain('../dist/icons.mjs');
    expect(source).toContain('../dist/indicators.mjs');
    expect(source).not.toContain('source.mjs');

    expect(() =>
      execFileSync(
        process.execPath,
        [
          '--conditions=react-server',
          '--input-type=module',
          '--eval',
          `await import(${JSON.stringify(familyUrl.href)});`,
        ],
        {stdio: 'pipe'},
      ),
    ).not.toThrow();
  });
});
