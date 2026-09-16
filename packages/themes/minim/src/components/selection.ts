// Copyright (c) Meta Platforms, Inc. and affiliates.

import type {ComponentStyleMap} from '@astryxdesign/core/theme';

const minim = (name: string) => `var(--minim-${name})`;

const transparentRow = {
  gap: minim('spacing-200'),
  paddingBlock: minim('spacing-100'),
  paddingInline: '0',
  borderRadius: '0',
  backgroundColor: 'transparent',
  ':hover': {backgroundColor: 'transparent'},
} as const;

const selectionIndicator = {
  boxSizing: 'border-box',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: minim('stroke-neutral'),
  backgroundColor: minim('bg-neutral-subtle'),
} as const;

const selectedIndicator = {
  color: minim('fg-on-surface'),
  borderColor: minim('bg-primary-solid'),
  backgroundColor: minim('bg-primary-solid'),
  ':hover': {
    borderColor: minim('bg-primary-solid'),
    backgroundColor: minim('bg-primary-solid'),
  },
} as const;

const disabledIndicator = {
  color: minim('fg-disabled'),
  opacity: '1',
  borderColor: minim('bg-disabled'),
  backgroundColor: minim('bg-disabled'),
  ':hover': {
    borderColor: minim('bg-disabled'),
    backgroundColor: minim('bg-disabled'),
  },
} as const;

/** Minim selection-control overrides and the three approved anatomy hooks. */
export const minimSelectionComponents = {
  'checkbox-list-content': {
    base: {gap: minim('spacing-200')},
  },
  'radio-list': {
    base: {gap: minim('spacing-200')},
  },
  'checkbox-list-item': {
    base: transparentRow,
    'size:sm': {
      gap: minim('content-medium-text-gap'),
      paddingBlock: minim('content-medium-text-inset-block'),
      fontSize: minim('typography-font-size-md'),
      lineHeight: minim('typography-line-height-md'),
    },
    'size:md': {
      gap: minim('content-large-text-gap'),
      paddingBlock: minim('content-large-text-inset-block'),
      fontSize: minim('typography-font-size-lg'),
      lineHeight: minim('typography-line-height-lg'),
    },
    'disabled:disabled': {color: minim('fg-disabled')},
  },
  'radio-list-item': {
    base: transparentRow,
    'size:sm': {
      gap: minim('content-medium-text-gap'),
      paddingBlock: minim('content-medium-text-inset-block'),
      fontSize: minim('typography-font-size-md'),
      lineHeight: minim('typography-line-height-md'),
    },
    'size:md': {
      gap: minim('content-large-text-gap'),
      paddingBlock: minim('content-large-text-inset-block'),
      fontSize: minim('typography-font-size-lg'),
      lineHeight: minim('typography-line-height-lg'),
    },
    'disabled:disabled': {color: minim('fg-disabled')},
  },
  'checkbox-indicator': {
    base: {...selectionIndicator, borderRadius: minim('radius-inner')},
    'size:sm': {
      width: minim('typography-line-height-md'),
      height: minim('typography-line-height-md'),
    },
    'size:md': {
      width: minim('typography-line-height-lg'),
      height: minim('typography-line-height-lg'),
    },
    'checked:checked': selectedIndicator,
    'checked:indeterminate': selectedIndicator,
    'disabled:disabled': disabledIndicator,
  },
  'checkbox-indicator-check': {base: {color: 'inherit'}},
  'checkbox-indicator-dash': {
    base: {backgroundColor: 'currentColor'},
  },
  'radio-indicator': {
    base: {...selectionIndicator, borderRadius: minim('radius-full')},
    'size:sm': {
      width: minim('typography-line-height-md'),
      height: minim('typography-line-height-md'),
    },
    'size:md': {
      width: minim('typography-line-height-lg'),
      height: minim('typography-line-height-lg'),
    },
    'checked:checked': selectedIndicator,
    'disabled:disabled': disabledIndicator,
  },
  'radio-indicator-dot': {
    base: {
      borderRadius: minim('radius-full'),
      backgroundColor: 'currentColor',
    },
  },
  switch: {
    base: {
      '--focus-outline-color': minim('stroke-primary'),
      borderRadius: minim('radius-full'),
      backgroundColor: minim('fg-disabled'),
      ':hover': {backgroundColor: minim('fg-disabled')},
    },
    'size:md': {width: '40px', height: '24px'},
    'checked:checked': {
      backgroundColor: minim('bg-primary-solid'),
      ':hover': {backgroundColor: minim('bg-primary-solid')},
    },
    'disabled:disabled': {opacity: '0.5'},
  },
  'switch-thumb': {
    base: {
      borderRadius: minim('radius-full'),
      backgroundColor: minim('fg-on-surface'),
    },
    'size:md': {width: '16px', height: '16px'},
    'size:md+checked:checked': {width: '20px', height: '20px'},
  },
  'segmented-control': {
    base: {
      gap: minim('spacing-50'),
      padding: minim('spacing-50'),
      borderRadius: minim('radius-element'),
      backgroundColor: minim('bg-neutral'),
    },
  },
  'segmented-control-item': {
    base: {
      gap: '0',
      borderRadius: minim('radius-element-item'),
      backgroundColor: 'transparent',
      boxShadow: 'none',
      ':hover': {backgroundColor: minim('bg-overlay-hover')},
    },
    'size:md': {
      height: 'auto',
      paddingBlock: minim('control-item-medium-padding-block'),
      paddingInline: minim('control-item-medium-padding-inline'),
    },
    'size:lg': {
      height: 'auto',
      paddingBlock: minim('control-item-large-padding-block'),
      paddingInline: minim('control-item-large-padding-inline'),
    },
    'selected:selected': {
      color: minim('fg-neutral'),
      backgroundColor: minim('bg-neutral-subtle'),
      boxShadow: 'none',
      ':hover': {backgroundColor: minim('bg-neutral-subtle')},
    },
  },
  'segmented-control-item-icon': {
    base: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: '0',
      color: minim('fg-neutral'),
    },
    'size:md': {
      '--minim-icon-box-size': minim('typography-line-height-md'),
      width: minim('content-medium-icon-box-width'),
      height:
        'calc(var(--minim-typography-line-height-md) + 2 * var(--minim-content-medium-text-inset-block))',
      fontSize: minim('typography-line-height-md'),
      lineHeight: minim('typography-line-height-md'),
    },
    'size:lg': {
      '--minim-icon-box-size': minim('typography-line-height-lg'),
      width: minim('content-large-icon-box-width'),
      height:
        'calc(var(--minim-typography-line-height-lg) + 2 * var(--minim-content-large-text-inset-block))',
      fontSize: minim('typography-line-height-lg'),
      lineHeight: minim('typography-line-height-lg'),
    },
    'disabled:disabled': {color: minim('fg-disabled')},
  },
  'segmented-control-item-label': {
    base: {color: minim('fg-muted')},
    'size:md': {
      paddingBlock: minim('content-medium-text-inset-block'),
      paddingInline: minim('content-medium-text-inset-inline'),
      fontSize: minim('typography-font-size-md'),
      lineHeight: minim('typography-line-height-md'),
    },
    'size:lg': {
      paddingBlock: minim('content-large-text-inset-block'),
      paddingInline: minim('content-large-text-inset-inline'),
      fontSize: minim('typography-font-size-lg'),
      lineHeight: minim('typography-line-height-lg'),
    },
    'selected:selected': {color: minim('fg-neutral')},
    'disabled:disabled': {color: minim('fg-disabled')},
  },
} as const satisfies ComponentStyleMap;
