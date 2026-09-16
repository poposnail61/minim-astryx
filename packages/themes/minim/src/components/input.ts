// Copyright (c) Meta Platforms, Inc. and affiliates.

import type {ComponentStyleMap} from '@astryxdesign/core/theme';

const minim = (name: string) => 'var(--minim-' + name + ')';

const inputBase = {
  gap: minim('content-medium-text-gap'),
  paddingBlock: minim('control-medium-padding-block'),
  paddingInline: minim('control-medium-padding-inline'),
  borderColor: minim('stroke-neutral'),
  backgroundColor: minim('bg-field'),
  borderRadius: minim('radius-element'),
  borderWidth: '0',
  outline: '1px solid ' + minim('stroke-neutral'),
  outlineOffset: '-1px',
  boxShadow: 'inset 0 0 0 1px ' + minim('stroke-neutral'),
  ':hover': {
    outlineColor: minim('stroke-neutral'),
    boxShadow: 'inset 0 0 0 1px ' + minim('stroke-neutral'),
  },
  ':hover:not(:focus-within):where(:not(:disabled,[aria-disabled="true"]))': {
    boxShadow: 'inset 0 0 0 1px ' + minim('stroke-neutral'),
  },
  ':focus-within': {
    outlineColor: minim('stroke-neutral-strong'),
    boxShadow: 'inset 0 0 0 1px ' + minim('stroke-neutral-strong'),
  },
} as const;

const inputStyles = {
  base: inputBase,
  'size:md': {
    '--minim-icon-box-size': minim('typography-line-height-md'),
    gap: minim('content-medium-text-gap'),
    paddingBlock: minim('control-medium-padding-block'),
    paddingInline: minim('control-medium-padding-inline'),
  },
  'size:lg': {
    '--minim-icon-box-size': minim('typography-line-height-lg'),
    gap: minim('content-large-text-gap'),
    paddingBlock: minim('control-large-padding-block'),
    paddingInline: minim('control-large-padding-inline'),
  },
  'status:error': {
    outlineColor: minim('stroke-critical'),
    boxShadow: 'inset 0 0 0 1px ' + minim('stroke-critical'),
    ':hover:not(:focus-within):where(:not(:disabled,[aria-disabled="true"]))': {
      boxShadow: 'inset 0 0 0 1px ' + minim('stroke-critical'),
    },
    ':focus-within': {
      outlineColor: minim('stroke-critical'),
      boxShadow: 'inset 0 0 0 1px ' + minim('stroke-critical'),
    },
  },
  'status:warning': {
    outlineColor: minim('stroke-warning'),
    boxShadow: 'inset 0 0 0 1px ' + minim('stroke-warning'),
    ':hover:not(:focus-within):where(:not(:disabled,[aria-disabled="true"]))': {
      boxShadow: 'inset 0 0 0 1px ' + minim('stroke-warning'),
    },
    ':focus-within': {
      outlineColor: minim('stroke-warning'),
      boxShadow: 'inset 0 0 0 1px ' + minim('stroke-warning'),
    },
  },
  'status:success': {
    outlineColor: minim('stroke-primary'),
    boxShadow: 'inset 0 0 0 1px ' + minim('stroke-primary'),
    ':hover:not(:focus-within):where(:not(:disabled,[aria-disabled="true"]))': {
      boxShadow: 'inset 0 0 0 1px ' + minim('stroke-primary'),
    },
    ':focus-within': {
      outlineColor: minim('stroke-primary'),
      boxShadow: 'inset 0 0 0 1px ' + minim('stroke-primary'),
    },
  },
  'disabled:disabled': {
    backgroundColor: minim('bg-disabled'),
    opacity: '1',
  },
} as const;

const textAreaStyles = {
  base: {
    ...inputBase,
    paddingBlock: '0',
    paddingInline: '0',
  },
  'size:md': {
    '--minim-icon-box-size': minim('typography-line-height-md'),
    paddingInline: minim('control-medium-padding-inline'),
  },
  'size:lg': {
    '--minim-icon-box-size': minim('typography-line-height-lg'),
    paddingInline: minim('control-large-padding-inline'),
  },
  'status:error': inputStyles['status:error'],
  'status:warning': inputStyles['status:warning'],
  'status:success': inputStyles['status:success'],
  'disabled:disabled': {
    backgroundColor: minim('bg-disabled'),
    opacity: '1',
  },
} as const;

const {
  paddingBlock: _tokenizerPaddingBlock,
  paddingInline: _tokenizerPaddingInline,
  ...tokenizerBase
} = inputBase;

const tokenizerStyles = {
  base: tokenizerBase,
  'size:md': {
    '--minim-icon-box-size': minim('typography-line-height-md'),
    '--tokenizer-gap': minim('content-medium-text-gap'),
    '--tokenizer-padding-block': minim('control-medium-padding-block'),
    '--tokenizer-padding-inline': minim('control-medium-padding-inline'),
  },
  'size:lg': {
    '--minim-icon-box-size': minim('typography-line-height-lg'),
    '--tokenizer-gap': minim('content-large-text-gap'),
    '--tokenizer-padding-block': minim('control-large-padding-block'),
    '--tokenizer-padding-inline': minim('control-large-padding-inline'),
  },
  'status:error': inputStyles['status:error'],
  'status:warning': inputStyles['status:warning'],
  'status:success': inputStyles['status:success'],
  'disabled:disabled': {opacity: '0.5'},
} as const;

const multiSelectorStyles = {
  'variant:input': inputBase,
  'variant:input+size:md': inputStyles['size:md'],
  'variant:input+size:lg': inputStyles['size:lg'],
  'variant:input+status:error': inputStyles['status:error'],
  'variant:input+status:warning': inputStyles['status:warning'],
  'variant:input+status:success': inputStyles['status:success'],
  'variant:input+disabled:disabled': inputStyles['disabled:disabled'],
} as const;

const controlStyles = {
  base: {boxSizing: 'border-box'},
  'size:md': {
    fontSize: minim('typography-font-size-md'),
    paddingBlock: minim('content-medium-text-inset-block'),
    paddingInline: minim('content-medium-text-inset-inline'),
    lineHeight: minim('typography-line-height-md'),
  },
  'size:lg': {
    fontSize: minim('typography-font-size-lg'),
    paddingBlock: minim('content-large-text-inset-block'),
    paddingInline: minim('content-large-text-inset-inline'),
    lineHeight: minim('typography-line-height-lg'),
  },
  'disabled:disabled': {
    color: minim('fg-disabled'),
    '::placeholder': {color: minim('fg-disabled')},
  },
} as const;

/** Input-family overrides verified against the resolved Minim source. */
export const minimInputComponents = {
  field: {
    base: {gap: minim('spacing-100')},
  },
  'field-label': {
    base: {
      gap: minim('spacing-100'),
      color: minim('fg-neutral'),
      fontSize: minim('typography-font-size-md'),
      lineHeight: minim('typography-line-height-md'),
      fontWeight: minim('typography-font-weight-regular'),
    },
    'disabled:disabled': {color: minim('fg-disabled')},
  },
  'field-description': {
    base: {
      color: minim('fg-muted'),
      fontSize: minim('typography-font-size-xs'),
      lineHeight: minim('typography-line-height-xs'),
      fontWeight: minim('typography-font-weight-regular'),
    },
    'disabled:disabled': {color: minim('fg-disabled')},
  },
  'text-input': inputStyles,
  'number-input': inputStyles,
  'date-input': inputStyles,
  'time-input': inputStyles,
  'date-range-input': inputStyles,
  selector: inputStyles,
  'multi-selector': multiSelectorStyles,
  typeahead: inputStyles,
  tokenizer: tokenizerStyles,
  'date-time-input': {
    base: {gap: minim('control-medium-gap')},
    'disabled:disabled': {opacity: '0.5'},
  },
  'date-time-input-date-segment': inputStyles,
  'date-time-input-time-segment': inputStyles,
  'text-area': textAreaStyles,
  'text-input-control': controlStyles,
  'number-input-control': controlStyles,
  'text-area-control': controlStyles,
  'input-start-icon': {
    base: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: '0',
      lineHeight: '1',
    },
    'size:md': {
      '--minim-icon-box-size': minim('typography-line-height-md'),
      width: minim('content-medium-icon-box-width'),
      height: minim('content-medium-box-size'),
    },
    'size:lg': {
      '--minim-icon-box-size': minim('typography-line-height-lg'),
      width: minim('content-large-icon-box-width'),
      height: minim('content-large-box-size'),
    },
  },
  'input-status-icon': {
    base: {
      lineHeight: '1',
      color: 'inherit',
    },
    'size:md': {
      '--minim-icon-box-size': minim('typography-line-height-md'),
      width: minim('content-medium-icon-box-width'),
      height: minim('content-medium-box-size'),
    },
    'size:lg': {
      '--minim-icon-box-size': minim('typography-line-height-lg'),
      width: minim('content-large-icon-box-width'),
      height: minim('content-large-box-size'),
    },
    'status:error': {color: minim('fg-critical')},
    'status:warning': {color: minim('fg-warning')},
    'status:success': {color: minim('fg-primary')},
  },
  'field-input-status': {
    'variant:attached+message:visible': {
      overflow: 'hidden',
      borderRadius: minim('radius-element'),
    },
    'variant:attached+message:visible+status:error': {
      backgroundColor: minim('bg-critical'),
    },
    'variant:attached+message:visible+status:warning': {
      backgroundColor: minim('bg-warning'),
    },
    'variant:attached+message:visible+status:success': {
      backgroundColor: minim('bg-primary'),
    },
  },
  'field-status': {
    'variant:attached': {
      boxSizing: 'border-box',
      minHeight:
        'calc(var(--minim-typography-line-height-xs) + 2 * var(--minim-spacing-200))',
      marginTop: '0',
      padding: minim('spacing-200'),
      fontSize: minim('typography-font-size-xs'),
      lineHeight: minim('typography-line-height-xs'),
      borderEndStartRadius: minim('radius-element'),
      borderEndEndRadius: minim('radius-element'),
    },
    'variant:attached+type:error': {
      backgroundColor: minim('bg-critical'),
      color: minim('fg-critical'),
    },
    'variant:attached+type:warning': {
      backgroundColor: minim('bg-warning'),
      color: minim('fg-warning'),
    },
    'variant:attached+type:success': {
      backgroundColor: minim('bg-primary'),
      color: minim('fg-primary'),
    },
  },
  'input-group': {
    'size:md': {
      '--minim-icon-box-size': minim('typography-line-height-md'),
      height:
        'calc(var(--minim-content-medium-box-size) + 2 * var(--minim-control-medium-padding-block))',
    },
    'size:lg': {
      '--minim-icon-box-size': minim('typography-line-height-lg'),
      height:
        'calc(var(--minim-content-large-box-size) + 2 * var(--minim-control-large-padding-block))',
    },
    'disabled:disabled': {opacity: '0.5'},
  },
  'input-group-text': {
    base: {
      backgroundColor: minim('bg-neutral'),
      borderColor: minim('stroke-neutral'),
      color: minim('fg-muted'),
      borderRadius: minim('radius-element'),
    },
    'size:md': {
      paddingInline: minim('control-medium-padding-inline'),
      fontSize: minim('typography-font-size-md'),
      lineHeight: minim('typography-line-height-md'),
    },
    'size:lg': {
      paddingInline: minim('control-large-padding-inline'),
      fontSize: minim('typography-font-size-lg'),
      lineHeight: minim('typography-line-height-lg'),
    },
  },
} as const satisfies ComponentStyleMap;
