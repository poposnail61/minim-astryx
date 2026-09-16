// Copyright (c) Meta Platforms, Inc. and affiliates.

import {describe, expect, it} from 'vitest';
import {defineTheme, generateThemeCSS} from '@astryxdesign/core/theme';
import {minimInputComponents} from './input';
import {minimBaseTokens, minimCompactTokens} from '../minimTokens.generated';

describe('Minim input component styles', () => {
  it('keeps Astryx md/lg sizes mapped to verified Minim aliases', () => {
    expect(minimInputComponents['text-input']['size:md']).toMatchObject({
      gap: 'var(--minim-content-medium-text-gap)',
      paddingBlock: 'var(--minim-control-medium-padding-block)',
      paddingInline: 'var(--minim-control-medium-padding-inline)',
    });
    expect(minimInputComponents['number-input']['size:lg']).toMatchObject({
      gap: 'var(--minim-content-large-text-gap)',
      paddingBlock: 'var(--minim-control-large-padding-block)',
      paddingInline: 'var(--minim-control-large-padding-inline)',
    });
    expect(minimInputComponents['input-start-icon']['size:md']).toMatchObject({
      '--minim-icon-box-size': 'var(--minim-typography-line-height-md)',
    });
    expect(minimInputComponents['input-start-icon']['size:lg']).toMatchObject({
      '--minim-icon-box-size': 'var(--minim-typography-line-height-lg)',
    });
    expect(minimInputComponents['text-input-control']['size:md']).toMatchObject(
      {
        fontSize: 'var(--minim-typography-font-size-md)',
        lineHeight: 'var(--minim-typography-line-height-md)',
      },
    );
    expect(minimInputComponents['text-input-control']['size:lg']).toMatchObject(
      {
        fontSize: 'var(--minim-typography-font-size-lg)',
        lineHeight: 'var(--minim-typography-line-height-lg)',
      },
    );
  });

  it('pins semantic focus, status, and disabled paints', () => {
    expect(minimInputComponents['text-input'].base).toMatchObject({
      borderColor: 'var(--minim-stroke-neutral)',
      ':focus-within': {
        outlineColor: 'var(--minim-stroke-neutral-strong)',
      },
    });
    expect(minimInputComponents['text-input']['status:error']).toMatchObject({
      outlineColor: 'var(--minim-stroke-critical)',
      boxShadow: 'inset 0 0 0 1px var(--minim-stroke-critical)',
    });
    expect(minimInputComponents['text-input']['status:warning']).toMatchObject({
      outlineColor: 'var(--minim-stroke-warning)',
      boxShadow: 'inset 0 0 0 1px var(--minim-stroke-warning)',
    });
    expect(minimInputComponents['text-input']['status:success']).toMatchObject({
      outlineColor: 'var(--minim-stroke-primary)',
      boxShadow: 'inset 0 0 0 1px var(--minim-stroke-primary)',
    });
    expect(
      minimInputComponents['text-input']['disabled:disabled'],
    ).toMatchObject({
      backgroundColor: 'var(--minim-bg-disabled)',
      opacity: '1',
    });
    expect(
      minimInputComponents['text-input-control']['disabled:disabled'],
    ).toEqual({
      color: 'var(--minim-fg-disabled)',
      '::placeholder': {color: 'var(--minim-fg-disabled)'},
    });
  });

  it('uses density-aware XS attached status geometry only', () => {
    expect(
      minimInputComponents['field-status']['variant:attached'],
    ).toMatchObject({
      minHeight:
        'calc(var(--minim-typography-line-height-xs) + 2 * var(--minim-spacing-200))',
      fontSize: 'var(--minim-typography-font-size-xs)',
      lineHeight: 'var(--minim-typography-line-height-xs)',
      marginTop: '0',
      padding: 'var(--minim-spacing-200)',
    });
    expect(minimInputComponents['field-status']).not.toHaveProperty(
      'variant:detached',
    );
  });

  it('pins base and compact metrics, including border-box control heights', () => {
    expect(minimBaseTokens).toMatchObject({
      '--minim-typography-font-size-md': '0.9375rem',
      '--minim-typography-line-height-md': '1.25rem',
      '--minim-typography-font-size-lg': '1.03125rem',
      '--minim-typography-line-height-lg': '1.375rem',
      '--minim-typography-font-size-xs': '0.75rem',
      '--minim-typography-line-height-xs': '1rem',
      '--minim-spacing-200': '0.5rem',
    });
    expect(minimCompactTokens).toMatchObject({
      '--minim-typography-font-size-md': '0.84375rem',
      '--minim-typography-line-height-md': '1.125rem',
      '--minim-typography-font-size-lg': '0.9375rem',
      '--minim-typography-line-height-lg': '1.25rem',
      '--minim-typography-font-size-xs': '0.65625rem',
      '--minim-typography-line-height-xs': '0.875rem',
      '--minim-spacing-200': '0.375rem',
    });

    const rem = (value: string) => Number.parseFloat(value) * 16;
    expect(
      rem(minimBaseTokens['--minim-content-medium-box-size']) +
        2 * rem(minimBaseTokens['--minim-control-medium-padding-block']),
    ).toBe(36);
    expect(
      rem(minimBaseTokens['--minim-content-large-box-size']) +
        2 * rem(minimBaseTokens['--minim-control-large-padding-block']),
    ).toBe(44);
    expect(minimInputComponents['text-input'].base).toMatchObject({
      borderColor: 'var(--minim-stroke-neutral)',
      borderWidth: '0',
      outline: '1px solid var(--minim-stroke-neutral)',
      outlineOffset: '-1px',
    });
    expect(36 - 2 * 6).toBe(24);
    expect(44 - 2 * 8).toBe(28);
  });

  it('generates compound status selectors and size-specific control rules', () => {
    const theme = defineTheme({
      name: 'minim-input-contract',
      components: minimInputComponents,
    });
    const {component} = generateThemeCSS(theme);

    expect(component).toContain('.astryx-text-input[data-size="md"]');
    expect(component).toContain('.astryx-text-input-control[data-size="lg"]');
    expect(component).toContain('.astryx-tokenizer[data-size="md"]');
    expect(component).toContain(
      '--tokenizer-gap: var(--minim-content-medium-text-gap)',
    );
    expect(component).toContain(
      '--tokenizer-padding-block: var(--minim-control-medium-padding-block)',
    );
    expect(component).toContain(
      '--tokenizer-padding-inline: var(--minim-control-medium-padding-inline)',
    );
    expect(component).toContain(
      '.astryx-field-status[data-variant="attached"][data-type="error"]',
    );
  });

  it('covers every verified input-family surface without copied recipes', () => {
    for (const target of [
      'date-input',
      'time-input',
      'date-range-input',
      'selector',
      'typeahead',
      'date-time-input-date-segment',
      'date-time-input-time-segment',
    ] as const) {
      expect(minimInputComponents[target]).toBe(
        minimInputComponents['text-input'],
      );
    }

    expect(minimInputComponents['text-area']['size:md']).toEqual({
      '--minim-icon-box-size': 'var(--minim-typography-line-height-md)',
      paddingInline: 'var(--minim-control-medium-padding-inline)',
    });
    expect(minimInputComponents['input-group']['size:lg']).toMatchObject({
      height:
        'calc(var(--minim-content-large-box-size) + 2 * var(--minim-control-large-padding-block))',
    });
    expect(minimInputComponents['multi-selector']).not.toHaveProperty('base');
    expect(minimInputComponents['multi-selector']).toHaveProperty(
      'variant:input+size:md',
    );
    expect(minimInputComponents['multi-selector']).not.toHaveProperty(
      'variant:ghost',
    );
    expect(minimInputComponents.tokenizer.base).not.toHaveProperty(
      'paddingBlock',
    );
    expect(minimInputComponents.tokenizer['size:md']).toMatchObject({
      '--tokenizer-gap': 'var(--minim-content-medium-text-gap)',
      '--tokenizer-padding-block': 'var(--minim-control-medium-padding-block)',
      '--tokenizer-padding-inline':
        'var(--minim-control-medium-padding-inline)',
    });
    expect(minimInputComponents.tokenizer['disabled:disabled']).toEqual({
      opacity: '0.5',
    });
    expect(minimInputComponents['date-time-input']).toMatchObject({
      base: {gap: 'var(--minim-control-medium-gap)'},
      'disabled:disabled': {opacity: '0.5'},
    });
  });

  it('pins verified Field label and description typography', () => {
    expect(minimInputComponents['field-label'].base).toMatchObject({
      gap: 'var(--minim-spacing-100)',
      color: 'var(--minim-fg-neutral)',
      fontSize: 'var(--minim-typography-font-size-md)',
      lineHeight: 'var(--minim-typography-line-height-md)',
      fontWeight: 'var(--minim-typography-font-weight-regular)',
    });
    expect(minimInputComponents['field-description'].base).toMatchObject({
      color: 'var(--minim-fg-muted)',
      fontSize: 'var(--minim-typography-font-size-xs)',
      lineHeight: 'var(--minim-typography-line-height-xs)',
    });
  });
});
