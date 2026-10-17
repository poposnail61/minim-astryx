// Copyright (c) Meta Platforms, Inc. and affiliates.

import type {ComponentStyleMap} from '@astryxdesign/core/theme';

const minim = (name: string) => 'var(--minim-' + name + ')';

// DateInput is the disabled-field reference: neutral ink, disabled surface,
// and one opacity owner. Grouped inputs inherit the owner's opacity guard.
const disabledInput = {
  opacity: 'var(--minim-input-disabled-opacity, 0.5)',
  backgroundColor: minim('bg-disabled'),
  color: minim('fg-neutral'),
  ':is(*) input, :is(*) textarea': {color: minim('fg-neutral')},
  ':is(*) input::placeholder, :is(*) textarea::placeholder': {
    color: minim('fg-neutral'),
  },
  ':is(*) .astryx-input-start-icon .astryx-icon': {
    color: minim('fg-neutral'),
  },
  ':is(*) > button:is([aria-haspopup="dialog"],[role="combobox"])': {
    color: minim('fg-neutral'),
  },
  ':is(*) .astryx-token': {opacity: '1'},
  ':is(*) .astryx-input-placeholder': {color: minim('fg-neutral')},
} as const;

const inputBase = {
  ':is(*) input::placeholder, :is(*) textarea::placeholder': {
    color: minim('fg-placeholder'),
  },
  ':is(*) .astryx-input-placeholder': {color: minim('fg-placeholder')},
  gap: minim('spacing-200'),
  paddingBlock: minim('component-medium-padding-block'),
  paddingInline: minim('spacing-300'),
  borderColor: minim('stroke-neutral'),
  backgroundColor: minim('bg-field'),
  borderRadius: minim('radius-element'),
  borderWidth: '0',
  outline: '1px solid ' + minim('stroke-neutral'),
  outlineOffset: '-1px',
  boxShadow: 'inset 0 0 0 1px ' + minim('stroke-neutral'),
  ':has(input[readonly]:not(:disabled,[aria-disabled="true"]),textarea[readonly]:not(:disabled,[aria-disabled="true"]))':
    {
      backgroundColor: minim('bg-readonly'),
    },
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
    fontSize: minim('typography-font-size-md'),
    lineHeight: minim('typography-line-height-md'),
    gap: minim('spacing-200'),
    paddingBlock: minim('component-medium-padding-block'),
    paddingInline: minim('spacing-300'),
  },
  'size:lg': {
    '--minim-icon-box-size': minim('typography-line-height-lg'),
    fontSize: minim('typography-font-size-lg'),
    lineHeight: minim('typography-line-height-lg'),
    gap: minim('spacing-200'),
    paddingBlock: minim('component-large-padding-block'),
    paddingInline: minim('spacing-300'),
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
    // Success is conveyed by the blue icon/message, not an accent border.
    outlineColor: minim('stroke-neutral'),
    boxShadow: 'inset 0 0 0 1px ' + minim('stroke-neutral'),
    ':hover:not(:focus-within):where(:not(:disabled,[aria-disabled="true"]))': {
      boxShadow: 'inset 0 0 0 1px ' + minim('stroke-neutral'),
    },
    ':focus-within': {
      outlineColor: minim('stroke-neutral-strong'),
      boxShadow: 'inset 0 0 0 1px ' + minim('stroke-neutral-strong'),
    },
  },
  'disabled:disabled': disabledInput,
} as const;

const textAreaStyles = {
  base: {
    ...inputBase,
    paddingBlock: '0',
    paddingInline: '0',
  },
  'size:md': {
    '--minim-icon-box-size': minim('typography-line-height-md'),
    paddingInline: minim('spacing-300'),
  },
  'size:lg': {
    '--minim-icon-box-size': minim('typography-line-height-lg'),
    paddingInline: minim('spacing-300'),
  },
  'status:error': inputStyles['status:error'],
  'status:warning': inputStyles['status:warning'],
  'status:success': inputStyles['status:success'],
  'disabled:disabled': disabledInput,
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
    '--tokenizer-gap': minim('spacing-200'),
    '--tokenizer-padding-block': minim('component-medium-padding-block'),
    '--tokenizer-padding-inline': minim('spacing-300'),
  },
  'size:lg': {
    '--minim-icon-box-size': minim('typography-line-height-lg'),
    '--tokenizer-gap': minim('spacing-200'),
    '--tokenizer-padding-block': minim('component-large-padding-block'),
    '--tokenizer-padding-inline': minim('spacing-300'),
  },
  'status:error': inputStyles['status:error'],
  'status:warning': inputStyles['status:warning'],
  'status:success': inputStyles['status:success'],
  'disabled:disabled': disabledInput,
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
  base: {
    boxSizing: 'border-box',
    '::placeholder': {color: minim('fg-placeholder')},
    ':is([readonly]):not(:disabled,[aria-disabled="true"])': {
      color: minim('fg-readonly'),
    },
  },
  'size:md': {
    fontSize: minim('typography-font-size-md'),
    paddingBlock: minim('component-medium-padding-block-slot'),
    paddingInline: '0',
    lineHeight: minim('typography-line-height-md'),
  },
  'size:lg': {
    fontSize: minim('typography-font-size-lg'),
    paddingBlock: minim('component-large-padding-block-slot'),
    paddingInline: '0',
    lineHeight: minim('typography-line-height-lg'),
  },
  'disabled:disabled': {
    color: minim('fg-neutral'),
    '::placeholder': {color: minim('fg-neutral')},
  },
} as const;

// TextArea owns its inset on the native control (the wrapper has no padding).
// Keep the outer field inset, without the removed label-slot inline inset.
const textAreaControlStyles = {
  ...controlStyles,
  base: {
    ...controlStyles.base,
    '::placeholder': {color: minim('fg-placeholder')},
  },
  'disabled:disabled': {
    ...controlStyles['disabled:disabled'],
    '::placeholder': {color: minim('fg-neutral')},
  },
  'size:md': {
    ...controlStyles['size:md'],
    paddingBlock:
      'calc(var(--minim-component-medium-padding-block) + var(--minim-component-medium-padding-block-slot))',
    paddingInline: 'var(--_textarea-inline-padding)',
  },
  'size:lg': {
    ...controlStyles['size:lg'],
    paddingBlock:
      'calc(var(--minim-component-large-padding-block) + var(--minim-component-large-padding-block-slot))',
    paddingInline: 'var(--_textarea-inline-padding)',
  },
} as const;

/** Input-family overrides share DateInput's disabled surface without dimming labels. */
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
    'disabled:disabled': {color: minim('fg-neutral')},
  },
  'field-description': {
    base: {
      color: minim('fg-muted'),
      fontSize: minim('typography-font-size-xs'),
      lineHeight: minim('typography-line-height-xs'),
      fontWeight: minim('typography-font-weight-regular'),
    },
    'disabled:disabled': {color: minim('fg-muted')},
  },
  'text-input': inputStyles,
  'number-input': inputStyles,
  'date-input': inputStyles,
  // Figma DateInput's calendar slot uses neutral ink and Medium Symbol weight.
  'date-input-toggle-icon': {
    base: {
      color: minim('fg-neutral'),
      fontWeight: minim('typography-font-weight-medium'),
    },
  },
  'date-range-input-toggle-icon': {
    base: {
      color: minim('fg-neutral'),
      fontWeight: minim('typography-font-weight-medium'),
    },
  },
  'date-time-input-toggle-icon': {
    base: {
      color: minim('fg-neutral'),
      fontWeight: minim('typography-font-weight-medium'),
    },
  },
  'date-time-input-clock-icon': {
    base: {
      color: minim('fg-neutral'),
      fontWeight: minim('typography-font-weight-medium'),
    },
  },
  'selector-indicator-icon': {
    base: {
      color: minim('fg-neutral'),
      fontWeight: minim('typography-font-weight-medium'),
    },
  },
  'multi-selector-indicator-icon': {
    base: {
      color: minim('fg-neutral'),
      fontWeight: minim('typography-font-weight-medium'),
    },
  },
  'time-input': inputStyles,
  'date-range-input': inputStyles,
  selector: inputStyles,
  'multi-selector': multiSelectorStyles,
  'complex-selector': {
    'variant:input': {
      ':has(> button:disabled)': {
        opacity: disabledInput.opacity,
        backgroundColor: disabledInput.backgroundColor,
        color: disabledInput.color,
        borderColor: minim('stroke-neutral'),
        boxShadow: 'inset 0 0 0 1px ' + minim('stroke-neutral'),
      },
      ':has(> button:disabled) > .astryx-icon': {color: minim('fg-neutral')},
    },
  },
  typeahead: inputStyles,
  tokenizer: tokenizerStyles,
  'date-time-input': {
    base: {gap: '0', flexWrap: 'nowrap'},
    'disabled:disabled': {
      opacity: 'var(--minim-field-disabled-opacity, 0.5)',
      '--minim-input-disabled-opacity': '1',
    },
  },
  'date-time-input-date-segment': {
    ...inputStyles,
    base: {
      ...inputBase,
      flexBasis: '0',
      minWidth: '0',
      borderStartEndRadius: '0',
      borderEndEndRadius: '0',
      marginInlineEnd: '-1px',
      position: 'relative',
      ':focus-within': {...inputBase[':focus-within'], zIndex: '1'},
    },
  },
  'date-time-input-time-segment': {
    ...inputStyles,
    base: {
      ...inputBase,
      flexBasis: '0',
      minWidth: '0',
      borderStartStartRadius: '0',
      borderEndStartRadius: '0',
      position: 'relative',
      ':focus-within': {...inputBase[':focus-within'], zIndex: '1'},
    },
  },
  'text-area': textAreaStyles,
  'text-input-control': {
    ...controlStyles,
    base: {
      ...controlStyles.base,
      '::placeholder': {color: minim('fg-placeholder')},
    },
    'disabled:disabled': {
      ...controlStyles['disabled:disabled'],
      '::placeholder': {color: minim('fg-neutral')},
    },
  },
  'number-input-control': controlStyles,
  'text-area-control': textAreaControlStyles,
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
      width: minim('component-medium-width-inline'),
      height:
        'calc(var(--minim-typography-line-height-md) + 2 * var(--minim-component-medium-padding-block-slot))',
    },
    'size:lg': {
      '--minim-icon-box-size': minim('typography-line-height-lg'),
      width: minim('component-large-width-inline'),
      height:
        'calc(var(--minim-typography-line-height-lg) + 2 * var(--minim-component-large-padding-block-slot))',
    },
  },
  'input-status-icon': {
    base: {
      lineHeight: '1',
      color: 'inherit',
      fontWeight: minim('typography-font-weight-medium'),
    },
    'size:md': {
      '--minim-icon-box-size': minim('typography-line-height-md'),
      width: minim('component-medium-width-inline'),
      height:
        'calc(var(--minim-typography-line-height-md) + 2 * var(--minim-component-medium-padding-block-slot))',
    },
    'size:lg': {
      '--minim-icon-box-size': minim('typography-line-height-lg'),
      width: minim('component-large-width-inline'),
      height:
        'calc(var(--minim-typography-line-height-lg) + 2 * var(--minim-component-large-padding-block-slot))',
    },
    'status:error': {color: minim('fg-critical')},
    'status:warning': {color: minim('fg-warning')},
    'status:success': {color: minim('fg-primary')},
  },
  'field-input-status': {
    base: {
      ':has(> [data-disabled="disabled"], > .astryx-file-input button:is(:disabled,[aria-disabled="true"]), > .astryx-complex-selector > button:disabled)':
        {
          opacity: '0.5',
          '--minim-input-disabled-opacity': '1',
          '--minim-field-disabled-opacity': '1',
        },
    },
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
    'variant:detached': {
      '--minim-icon-box-size': minim('typography-line-height-xs'),
      padding: minim('spacing-200'),
      paddingInline: minim('spacing-300'),
      fontSize: minim('typography-font-size-xs'),
      lineHeight: minim('typography-line-height-xs'),
    },
    'variant:attached': {
      boxSizing: 'border-box',
      minHeight:
        'calc(var(--minim-typography-line-height-xs) + 2 * var(--minim-spacing-200))',
      marginTop: '0',
      padding: minim('spacing-200'),
      paddingInline: minim('spacing-300'),
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
    'variant:detached+type:success': {
      backgroundColor: minim('bg-primary'),
      color: minim('fg-primary'),
    },
  },
  'input-group': {
    'size:md': {
      '--minim-icon-box-size': minim('typography-line-height-md'),
      height: 'var(--minim-component-medium-height)',
    },
    'size:lg': {
      '--minim-icon-box-size': minim('typography-line-height-lg'),
      height: 'var(--minim-component-large-height)',
    },
    'disabled:disabled': {
      opacity: 'var(--minim-field-disabled-opacity, 0.5)',
      '--minim-input-disabled-opacity': '1',
      ':is(*) > .astryx-input-group-text': {color: minim('fg-neutral')},
    },
  },
  'input-group-text': {
    base: {
      backgroundColor: minim('bg-neutral'),
      borderColor: minim('stroke-neutral'),
      color: minim('fg-muted'),
      borderRadius: minim('radius-element'),
    },
    'size:md': {
      paddingInline: minim('spacing-300'),
      fontSize: minim('typography-font-size-md'),
      lineHeight: minim('typography-line-height-md'),
    },
    'size:lg': {
      paddingInline: minim('spacing-300'),
      fontSize: minim('typography-font-size-lg'),
      lineHeight: minim('typography-line-height-lg'),
    },
  },
} as const satisfies ComponentStyleMap;
