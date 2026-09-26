// Copyright (c) Meta Platforms, Inc. and affiliates.

import {describe, expect, it} from 'vitest';
import {defineTheme, generateThemeCSS} from '@astryxdesign/core/theme';
import {minimInputComponents} from './input';
import {minimBaseTokens, minimCompactTokens} from '../minimTokens.generated';

describe('Minim input component styles', () => {
  it('derives control heights from slots and padding in both densities', () => {
    for (const [tokens, expected] of [
      [minimBaseTokens, [36, 44, 52]],
      [minimCompactTokens, [28, 36, 44]],
    ] as const) {
      const px = (value: string) => parseFloat(value) * 16;
      const medium =
        px(tokens['--minim-typography-line-height-md']) +
        2 * px(tokens['--minim-component-medium-padding-block-slot']);
      const large =
        px(tokens['--minim-typography-line-height-lg']) +
        2 * px(tokens['--minim-component-large-padding-block-slot']);
      expect([
        medium + 2 * px(tokens['--minim-component-medium-padding-block']),
        large + 2 * px(tokens['--minim-component-large-padding-block']),
        large + 2 * px(tokens['--minim-component-xlarge-padding-block']),
      ]).toEqual(expected);
    }
  });
  it('matches selector and text input typography at each size', () => {
    for (const size of ['md', 'lg'] as const) {
      for (const name of ['selector', 'text-input'] as const) {
        expect(minimInputComponents[name][`size:${size}`]).toMatchObject({
          fontSize: `var(--minim-typography-font-size-${size})`,
          lineHeight: `var(--minim-typography-line-height-${size})`,
        });
      }
    }
  });
  it('keeps Astryx md/lg sizes mapped to verified Minim aliases', () => {
    expect(minimInputComponents['text-input']['size:md']).toMatchObject({
      gap: 'var(--minim-spacing-200)',
      paddingBlock: 'var(--minim-component-medium-padding-block)',
      paddingInline: 'var(--minim-spacing-300)',
    });
    expect(minimInputComponents['number-input']['size:lg']).toMatchObject({
      gap: 'var(--minim-spacing-200)',
      paddingBlock: 'var(--minim-component-large-padding-block)',
      paddingInline: 'var(--minim-spacing-300)',
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
      opacity: 'var(--minim-input-disabled-opacity, 0.5)',
    });
    expect(
      minimInputComponents['text-input-control']['disabled:disabled'],
    ).toEqual({
      color: 'var(--minim-fg-neutral)',
      '::placeholder': {color: 'var(--minim-fg-placeholder)'},
    });
  });

  it('uses the Figma placeholder token for editable text inputs', () => {
    expect(
      minimInputComponents['text-input-control'].base['::placeholder'],
    ).toEqual({color: 'var(--minim-fg-placeholder)'});
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
      paddingInline: 'var(--minim-spacing-300)',
    });
    expect(minimInputComponents['field-status']).not.toHaveProperty(
      'variant:detached',
    );
  });

  it('uses primary blue for attached and detached success messages', () => {
    for (const variant of ['attached', 'detached'] as const) {
      expect(
        minimInputComponents['field-status'][`variant:${variant}+type:success`],
      ).toEqual({
        backgroundColor: 'var(--minim-bg-primary)',
        color: 'var(--minim-fg-primary)',
      });
    }
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
      rem(minimBaseTokens['--minim-typography-line-height-md']) +
        2 *
          rem(minimBaseTokens['--minim-component-medium-padding-block-slot']) +
        2 * rem(minimBaseTokens['--minim-component-medium-padding-block']),
    ).toBe(36);
    expect(
      rem(minimBaseTokens['--minim-typography-line-height-lg']) +
        2 * rem(minimBaseTokens['--minim-component-large-padding-block-slot']) +
        2 * rem(minimBaseTokens['--minim-component-large-padding-block']),
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
    expect(component).toContain('--tokenizer-gap: var(--minim-spacing-200)');
    expect(component).toContain(
      '--tokenizer-padding-block: var(--minim-component-medium-padding-block)',
    );
    expect(component).toContain(
      '--tokenizer-padding-inline: var(--minim-spacing-300)',
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
    ] as const) {
      expect(minimInputComponents[target]).toBe(
        minimInputComponents['text-input'],
      );
    }

    expect(minimInputComponents['text-area']['size:md']).toEqual({
      '--minim-icon-box-size': 'var(--minim-typography-line-height-md)',
      paddingInline: 'var(--minim-spacing-300)',
    });
    expect(minimInputComponents['input-group']['size:lg']).toMatchObject({
      height: 'var(--minim-component-large-height)',
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
      '--tokenizer-gap': 'var(--minim-spacing-200)',
      '--tokenizer-padding-block':
        'var(--minim-component-medium-padding-block)',
      '--tokenizer-padding-inline': 'var(--minim-spacing-300)',
    });
    expect(minimInputComponents.tokenizer['disabled:disabled']).toEqual({
      opacity: '0.5',
    });
    expect(minimInputComponents['date-time-input']).toMatchObject({
      base: {gap: '0', flexWrap: 'nowrap'},
      'disabled:disabled': {opacity: '0.5'},
    });
  });

  it('joins date and time segments without rounding the shared seam', () => {
    expect(
      minimInputComponents['date-time-input-date-segment'].base,
    ).toMatchObject({
      flexBasis: '0',
      minWidth: '0',
      marginInlineEnd: '-1px',
      borderStartEndRadius: '0',
      borderEndEndRadius: '0',
      ':focus-within': {zIndex: '1'},
    });
    expect(
      minimInputComponents['date-time-input-time-segment'].base,
    ).toMatchObject({
      flexBasis: '0',
      minWidth: '0',
      borderStartStartRadius: '0',
      borderEndStartRadius: '0',
      ':focus-within': {zIndex: '1'},
    });
  });

  it('uses readonly paints without treating disabled explanation controls as readonly', () => {
    expect(minimInputComponents['text-input-control'].base).toMatchObject({
      ':is([readonly]):not(:disabled,[aria-disabled="true"])': {
        color: 'var(--minim-fg-readonly)',
      },
    });
    expect(minimInputComponents['text-input'].base).toHaveProperty(
      ':has(input[readonly]:not(:disabled,[aria-disabled="true"]),textarea[readonly]:not(:disabled,[aria-disabled="true"]))',
      {backgroundColor: 'var(--minim-bg-readonly)'},
    );
  });

  it('keeps TextArea field insets on the native control in both sizes', () => {
    for (const [size, tokenSize] of [
      ['md', 'medium'],
      ['lg', 'large'],
    ] as const) {
      const control = minimInputComponents['text-area-control'][`size:${size}`];
      expect(control.paddingInline).toBe('var(--_textarea-inline-padding)');
      expect(control.paddingBlock).toBe(
        `calc(var(--minim-component-${tokenSize}-padding-block) + var(--minim-component-${tokenSize}-padding-block-slot))`,
      );
    }
  });

  it('pins verified Field label and description typography', () => {
    for (const target of [
      'date-range-input-toggle-icon',
      'date-time-input-toggle-icon',
      'date-time-input-clock-icon',
      'selector-indicator-icon',
      'multi-selector-indicator-icon',
    ] as const) {
      expect(minimInputComponents[target].base).toEqual({
        color: 'var(--minim-fg-neutral)',
        fontWeight: 'var(--minim-typography-font-weight-medium)',
      });
    }
    expect(
      minimInputComponents['input-status-icon']['status:error'].color,
    ).toBe('var(--minim-fg-critical)');
    expect(
      minimInputComponents['input-status-icon']['status:warning'].color,
    ).toBe('var(--minim-fg-warning)');
    expect(
      minimInputComponents['input-status-icon']['status:success'].color,
    ).toBe('var(--minim-fg-primary)');
    expect(minimInputComponents['date-input-toggle-icon'].base).toEqual({
      color: 'var(--minim-fg-neutral)',
      fontWeight: 'var(--minim-typography-font-weight-medium)',
    });
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
