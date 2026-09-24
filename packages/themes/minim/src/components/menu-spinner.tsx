// Copyright (c) Meta Platforms, Inc. and affiliates.

import type {ComponentStyleMap} from '@astryxdesign/core/theme';

const minim = (name: string) => `var(--minim-${name})`;

const menuSurface = {
  gap: minim('spacing-50'),
  padding: minim('spacing-200'),
  borderRadius: minim('radius-container'),
  backgroundColor: minim('bg-layer'),
  boxShadow: minim('elevation-low'),
} as const;

const selectionSurface = {
  ...menuSurface,
  padding: '0',
  '--selector-list-padding': minim('spacing-200'),
  '--selector-list-gap': minim('spacing-50'),
} as const;

const selectionList = {
  display: 'grid',
  gridAutoRows: 'max-content',
  padding: minim('spacing-200'),
  gap: minim('spacing-50'),
} as const;

const selectionRow = {
  color: minim('fg-neutral'),
  borderRadius: minim('radius-element'),
  minHeight:
    'calc(var(--minim-content-large-box-size) + 2 * var(--minim-row-large-padding-block))',
  paddingBlock:
    'calc(var(--minim-row-large-padding-block) + var(--minim-content-large-text-inset-block))',
  paddingInline: minim('spacing-300'),
  gap: minim('row-large-gap'),
  fontSize: minim('typography-font-size-lg'),
  lineHeight: minim('typography-line-height-lg'),
  '--text-body-size': minim('typography-font-size-lg'),
  '--text-body-leading': minim('typography-line-height-lg'),
  '--text-label-size': minim('typography-font-size-lg'),
  '--text-label-leading': minim('typography-line-height-lg'),
  '--minim-icon-box-size': minim('typography-line-height-lg'),
} as const;

const menuItemBase = {
  color: minim('fg-neutral'),
  borderRadius: minim('radius-element'),
  backgroundColor: 'transparent',
  ':focus': {backgroundColor: minim('bg-neutral')},
  ':active': {backgroundColor: minim('bg-overlay-pressed')},
  ':is([aria-disabled="true"])': {
    color: minim('fg-disabled'),
    opacity: '1',
  },
} as const;

/** Menu and Spinner overrides verified against the resolved Minim source. */
export const minimMenuSpinnerComponents = {
  // The scrolling list owns the inset; a generic Popover inset doubles it.
  'selector-popup': {
    base: selectionSurface,
  },
  'multi-selector-popup': {base: selectionSurface},
  'typeahead-popup': {base: selectionSurface},
  'typeahead-dropdown': {base: selectionList},
  'typeahead-option-row': {base: selectionRow},
  'multi-selector-option': {
    base: {...selectionRow, paddingBlock: minim('row-large-padding-block')},
  },
  'date-time-input-time-popup': {base: selectionSurface},
  'date-time-input-time-listbox': {base: selectionList},
  'date-time-input-time-option': {base: selectionRow},
  // Calendar already owns its content padding.
  'date-input-popup': {base: selectionSurface},
  'date-range-input-popup': {base: selectionSurface},
  'date-time-input-popup': {base: selectionSurface},
  'selector-option-row': {
    base: {
      color: minim('fg-neutral'),
      borderRadius: minim('radius-element'),
      paddingBlock: minim('row-large-padding-block'),
      paddingInline: minim('spacing-300'),
      gap: minim('row-large-gap'),
      minHeight:
        'calc(var(--minim-content-large-box-size) + 2 * var(--minim-row-large-padding-block))',
      '--selector-option-inset-block': minim('content-large-text-inset-block'),
      '--text-body-size': minim('typography-font-size-lg'),
      '--text-body-leading': minim('typography-line-height-lg'),
    },
    selected: {
      backgroundColor: minim('bg-neutral'),
      fontWeight: minim('typography-font-weight-regular'),
    },
    disabled: {color: minim('fg-disabled'), opacity: '1'},
  },
  'selector-option': {
    base: {paddingBlock: 'var(--selector-option-inset-block, 0px)'},
  },
  'context-menu': {base: menuSurface},
  'dropdown-menu-popup': {
    // DropdownMenu owns the painted surface, unlike the listbox-only popups.
    base: {
      padding: '0',
      borderWidth: '0',
      boxShadow: 'none',
      backgroundColor: 'transparent',
      borderRadius: minim('radius-container'),
    },
  },
  'dropdown-menu': {base: menuSurface},
  'dropdown-menu-item': {
    base: menuItemBase,
    'size:md': {
      '--text-body-size': minim('typography-font-size-md'),
      '--text-body-leading': minim('typography-line-height-md'),
      '--minim-icon-box-size': minim('typography-line-height-md'),
      minHeight:
        'calc(var(--minim-content-medium-box-size) + 2 * var(--minim-row-medium-padding-block))',
      gap: minim('row-medium-gap'),
      paddingBlock: minim('row-medium-padding-block'),
      paddingInline: minim('spacing-300'),
    },
    'size:lg': {
      '--text-body-size': minim('typography-font-size-lg'),
      '--text-body-leading': minim('typography-line-height-lg'),
      '--minim-icon-box-size': minim('typography-line-height-lg'),
      minHeight:
        'calc(var(--minim-content-large-box-size) + 2 * var(--minim-row-large-padding-block))',
      gap: minim('row-large-gap'),
      paddingBlock: minim('row-large-padding-block'),
      paddingInline: minim('spacing-300'),
    },
    'variant:destructive': {
      color: minim('fg-critical'),
    },
  },
  'menu-radio-row': {
    base: {paddingInline: minim('spacing-300')},
    // Preserve vertical geometry while sharing the menu inline inset.
    'size:md': {
      minHeight: '2.5rem',
      gap: '0.5rem',
      padding: '0.5rem',
      paddingInline: minim('spacing-300'),
      borderRadius: '0.625rem',
    },
  },
  'dropdown-menu-divider': {
    base: {
      boxSizing: 'border-box',
      marginBlock: '0',
      paddingBlock: minim('spacing-200'),
      paddingInline: minim('spacing-200'),
    },
  },
  spinner: {
    base: {gap: minim('spacing-200'), '--spinner-linecap': 'butt'},
    // Embedded loading affordances request sm; Minim's smallest defined ring
    // is medium, so use the same silhouette instead of Astryx's fallback ring.
    'size:sm': {
      '--spinner-diameter': '17px',
      '--spinner-stroke-width': '3px',
      '--spinner-box-size': '20px',
      '--spinner-padding-block': minim('content-medium-text-inset-block'),
      '--spinner-arc-fraction': '0.75',
    },
    'size:md': {
      '--spinner-diameter': '17px',
      '--spinner-stroke-width': '3px',
      '--spinner-box-size': '20px',
      '--spinner-padding-block': minim('content-medium-text-inset-block'),
      '--spinner-arc-fraction': '0.75',
    },
    'size:lg': {
      '--spinner-diameter': '19.25px',
      '--spinner-stroke-width': '2.75px',
      '--spinner-box-size': '22px',
      '--spinner-padding-inline':
        'max(0px, calc((var(--minim-content-large-icon-box-width) - var(--minim-typography-line-height-lg)) / 2))',
      '--spinner-padding-block': minim('content-large-text-inset-block'),
      '--spinner-arc-fraction': '0.75',
    },
    'size:xl': {
      '--spinner-diameter': '32px',
      '--spinner-stroke-width': '4px',
      '--spinner-box-size': '36px',
      '--spinner-arc-fraction': '0.75',
    },
    'shade:default': {
      '--spinner-color': minim('fg-neutral'),
      '--spinner-track-color': minim('stroke-neutral'),
    },
    'shade:subtle': {
      '--spinner-color': minim('fg-muted'),
      '--spinner-track-color': minim('stroke-neutral'),
    },
    'shade:onMedia': {
      '--spinner-color': minim('fg-on-surface'),
      '--spinner-track-color': minim('fg-on-surface-subtle'),
    },
  },
  'spinner-track': {'shade:onMedia': {strokeOpacity: '1'}},
  'spinner-label': {
    base: {fontWeight: minim('typography-font-weight-medium')},
    'size:md': {
      fontSize: minim('typography-font-size-md'),
      lineHeight: minim('typography-line-height-md'),
    },
    'size:lg': {
      fontSize: minim('typography-font-size-lg'),
      lineHeight: minim('typography-line-height-lg'),
    },
    'size:xl': {
      fontSize: minim('typography-font-size-lg'),
      lineHeight: minim('typography-line-height-lg'),
    },
    'shade:onMedia': {color: minim('fg-on-surface')},
  },
} as const satisfies ComponentStyleMap;
