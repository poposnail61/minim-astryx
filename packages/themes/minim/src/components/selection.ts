// Copyright (c) Meta Platforms, Inc. and affiliates.

import type {ComponentStyleMap} from '@astryxdesign/core/theme';

const minim = (name: string) => `var(--minim-${name})`;

const selectionRow = (size: 'medium' | 'large', type: 'md' | 'lg') => ({
  minHeight: minim(`component-${size}-height`),
  gap: minim('spacing-100'),
  paddingBlock: minim(`component-${size}-padding-block`),
  fontSize: minim(`typography-font-size-${type}`),
  lineHeight: minim(`typography-line-height-${type}`),
});

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
  'radio-control-slot': {
    'size:md': {
      width: minim('component-medium-width-inline'),
      height:
        'calc(var(--minim-typography-line-height-md) + 2 * var(--minim-component-medium-padding-block-slot))',
    },
    'size:lg': {
      width: minim('component-large-width-inline'),
      height:
        'calc(var(--minim-typography-line-height-lg) + 2 * var(--minim-component-large-padding-block-slot))',
    },
  },
  'checkbox-control-slot': {
    'size:md': {
      width: minim('component-medium-width-inline'),
      height:
        'calc(var(--minim-typography-line-height-md) + 2 * var(--minim-component-medium-padding-block-slot))',
    },
    'size:lg': {
      width: minim('component-large-width-inline'),
      height:
        'calc(var(--minim-typography-line-height-lg) + 2 * var(--minim-component-large-padding-block-slot))',
    },
  },
  'checkbox-input': {
    'size:md+label:visible': selectionRow('medium', 'md'),
    'size:lg+label:visible': selectionRow('large', 'lg'),
  },
  'checkbox-list-content': {
    base: {gap: minim('spacing-200')},
  },
  'radio-list': {
    base: {gap: minim('spacing-200')},
  },
  'checkbox-list-item': {
    base: transparentRow,
    'size:lg': selectionRow('large', 'lg'),
    'size:sm': {
      gap: minim('spacing-100'),
      paddingBlock: minim('component-medium-padding-block-slot'),
      fontSize: minim('typography-font-size-md'),
      lineHeight: minim('typography-line-height-md'),
    },
    'size:md': selectionRow('medium', 'md'),
    'disabled:disabled': {color: minim('fg-disabled')},
  },
  'radio-list-item': {
    base: {
      ...transparentRow,
      '--item-disabled-opacity': '1',
    },
    'size:lg': selectionRow('large', 'lg'),
    'size:sm': {
      gap: minim('spacing-100'),
      paddingBlock: minim('component-medium-padding-block-slot'),
      fontSize: minim('typography-font-size-md'),
      lineHeight: minim('typography-line-height-md'),
    },
    'size:md': selectionRow('medium', 'md'),
    'disabled:disabled': {
      opacity: '1',
      color: minim('fg-disabled'),
    },
  },
  'checkbox-indicator': {
    base: {...selectionIndicator, borderRadius: minim('radius-inner')},
    'size:sm': {
      width: minim('typography-line-height-md'),
      height: minim('typography-line-height-md'),
    },
    'size:md': {
      width: minim('typography-line-height-md'),
      height: minim('typography-line-height-md'),
    },
    'size:lg': {
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
      width: minim('typography-line-height-md'),
      height: minim('typography-line-height-md'),
    },
    'size:lg': {
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
  'checkbox-label': {
    'size:md': {
      fontSize: minim('typography-font-size-md'),
      lineHeight: minim('typography-line-height-md'),
    },
    'size:lg': {
      fontSize: minim('typography-font-size-lg'),
      lineHeight: minim('typography-line-height-lg'),
    },
  },
  'switch-field': {
    base: {
      '--switch-width':
        'calc(var(--switch-thumb-height) * 2.5 + 2 * var(--switch-padding))',
      '--switch-height':
        'calc(var(--minim-spacing-500) + 2 * var(--switch-padding))',
      '--switch-padding': minim('spacing-50'),
      '--switch-thumb-height':
        'calc(var(--switch-height) - 2 * var(--switch-padding))',
      '--switch-thumb-width': 'calc(var(--switch-thumb-height) * 1.5)',
      '--switch-travel': 'var(--switch-thumb-height)',
    },
  },
  'switch-label': {
    base: {
      fontSize: minim('typography-font-size-sm'),
      lineHeight: minim('typography-line-height-sm'),
    },
  },
  switch: {
    base: {
      '--focus-outline-color': minim('stroke-primary'),
      borderRadius: minim('radius-full'),
      backgroundColor: minim('fg-disabled'),
      ':hover': {backgroundColor: minim('fg-disabled')},
    },
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
      width: 'var(--switch-thumb-width)',
      height: 'var(--switch-thumb-height)',
      flexShrink: '0',
    },
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
      gap: minim('spacing-200'),
      borderRadius: minim('radius-element-item'),
      backgroundColor: 'transparent',
      boxShadow: 'none',
      ':hover': {backgroundColor: minim('bg-overlay-hover')},
    },
    'size:md': {
      height: 'auto',
      paddingBlock: minim('component-medium-padding-block-inner'),
      paddingInline: minim('spacing-300'),
    },
    'size:lg': {
      height: 'auto',
      paddingBlock: minim('component-large-padding-block-inner'),
      paddingInline: minim('spacing-300'),
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
      width: minim('component-medium-width-inline'),
      height:
        'calc(var(--minim-typography-line-height-md) + 2 * var(--minim-component-medium-padding-block-slot))',
      fontSize: minim('typography-line-height-md'),
      lineHeight: minim('typography-line-height-md'),
    },
    'size:lg': {
      '--minim-icon-box-size': minim('typography-line-height-lg'),
      width: minim('component-large-width-inline'),
      height:
        'calc(var(--minim-typography-line-height-lg) + 2 * var(--minim-component-large-padding-block-slot))',
      fontSize: minim('typography-line-height-lg'),
      lineHeight: minim('typography-line-height-lg'),
    },
    'disabled:disabled': {color: minim('fg-disabled')},
  },
  'segmented-control-item-label': {
    base: {color: minim('fg-muted')},
    'size:md': {
      paddingBlock: minim('component-medium-padding-block-slot'),
      paddingInline: '0',
      fontSize: minim('typography-font-size-md'),
      lineHeight: minim('typography-line-height-md'),
    },
    'size:lg': {
      paddingBlock: minim('component-large-padding-block-slot'),
      paddingInline: '0',
      fontSize: minim('typography-font-size-lg'),
      lineHeight: minim('typography-line-height-lg'),
    },
    'selected:selected': {color: minim('fg-neutral')},
    'disabled:disabled': {color: minim('fg-disabled')},
  },
} as const satisfies ComponentStyleMap;
