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
  minHeight: 'var(--minim-component-large-height)',
  paddingBlock:
    'calc(var(--minim-component-large-padding-block) + var(--minim-component-large-padding-block-slot))',
  paddingInline: minim('spacing-300'),
  gap: minim('spacing-200'),
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
  ':focus:not([aria-disabled="true"])': {
    backgroundColor: minim('bg-overlay-hover'),
  },
  ':active:not([aria-disabled="true"])': {
    backgroundColor: minim('bg-overlay-pressed'),
  },
  ':is([aria-checked="true"])': {backgroundColor: minim('bg-neutral')},
  ':is([aria-checked="true"]):focus:not([aria-disabled="true"])': {
    backgroundColor: minim('bg-neutral'),
    backgroundImage: `linear-gradient(${minim('bg-overlay-hover')}, ${minim('bg-overlay-hover')})`,
  },
  ':is([aria-disabled="true"])': {
    opacity: '0.5',
    '--item-disabled-opacity': '1',
    backgroundImage: 'none',
  },
} as const;

// Rows with plain text need the slot inset included; Item-based rows own it.
const rowSize = (size: 'md' | 'lg', hasSlot = false) => {
  const component = size === 'lg' ? 'large' : 'medium';
  return {
    minHeight: minim(`component-${component}-height`),
    paddingBlock: hasSlot
      ? minim(`component-${component}-padding-block`)
      : `calc(${minim(`component-${component}-padding-block`)} + ${minim(`component-${component}-padding-block-slot`)})`,
    paddingInline: minim('spacing-300'),
    gap: minim('spacing-200'),
    fontSize: minim(`typography-font-size-${size}`),
    lineHeight: minim(`typography-line-height-${size}`),
    '--text-body-size': minim(`typography-font-size-${size}`),
    '--text-body-leading': minim(`typography-line-height-${size}`),
    '--text-label-size': minim(`typography-font-size-${size}`),
    '--text-label-leading': minim(`typography-line-height-${size}`),
    '--minim-icon-box-size': minim(`typography-line-height-${size}`),
    '--selector-option-inset-block': minim(
      `component-${component}-padding-block-slot`,
    ),
  };
};

const optionStates = {
  ':is([aria-selected="true"])': {
    backgroundColor: minim('bg-neutral'),
    fontWeight: minim('typography-font-weight-regular'),
  },
  ':is([data-highlighted="true"]):not([aria-disabled="true"])': {
    backgroundImage: `linear-gradient(${minim('bg-overlay-hover')}, ${minim('bg-overlay-hover')})`,
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
  'typeahead-option-row': {
    base: {...selectionRow, ...optionStates},
    'size:md': rowSize('md'),
    'size:lg': rowSize('lg'),
  },
  'multi-selector-option': {
    base: {
      ...selectionRow,
      ...optionStates,
      paddingBlock: minim('component-large-padding-block'),
    },
    'size:md': rowSize('md', true),
    'size:lg': rowSize('lg', true),
  },
  'date-time-input-time-popup': {base: selectionSurface},
  'date-time-input-time-listbox': {base: selectionList},
  'date-time-input-time-option': {
    base: {...selectionRow, ...optionStates},
    'size:md': rowSize('md'),
    'size:lg': rowSize('lg'),
  },
  // Calendar already owns its content padding.
  'date-input-popup': {base: selectionSurface},
  'date-range-input-popup': {base: selectionSurface},
  'date-time-input-popup': {base: selectionSurface},
  'selector-option-row': {
    base: {
      ...optionStates,
      color: minim('fg-neutral'),
      borderRadius: minim('radius-element'),
      paddingBlock: minim('component-large-padding-block'),
      paddingInline: minim('spacing-300'),
      gap: minim('spacing-200'),
      minHeight: 'var(--minim-component-large-height)',
      '--selector-option-inset-block': minim(
        'component-large-padding-block-slot',
      ),
      '--text-body-size': minim('typography-font-size-lg'),
      '--text-body-leading': minim('typography-line-height-lg'),
    },
    selected: {
      backgroundColor: minim('bg-neutral'),
      fontWeight: minim('typography-font-weight-regular'),
    },
    disabled: {color: minim('fg-disabled'), opacity: '1'},
    'size:md': rowSize('md', true),
    'size:lg': rowSize('lg', true),
  },
  'selector-option': {
    base: {paddingBlock: 'var(--selector-option-inset-block, 0px)'},
  },
  'context-menu': {base: menuSurface},
  'nav-heading-menu': {base: {gap: minim('spacing-50')}},
  'nav-heading-menu-item': {
    base: {...menuItemBase, ...rowSize('lg')},
    'size:md': rowSize('md'),
    'size:lg': rowSize('lg'),
  },
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
    'size:md': rowSize('md', true),
    'size:lg': rowSize('lg', true),
    'variant:destructive': {
      color: minim('fg-critical'),
    },
  },
  'menu-radio-row': {
    // Radio rows also carry dropdown-menu-item and inherit its size recipe.
    base: {paddingInline: minim('spacing-300')},
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
      '--spinner-diameter':
        'calc(var(--minim-typography-line-height-md) * 0.85)',
      '--spinner-stroke-width':
        'calc(var(--minim-typography-line-height-md) * 0.15)',
      '--spinner-box-size': minim('typography-line-height-md'),
      '--spinner-padding-block': minim('component-medium-padding-block-slot'),
      '--spinner-arc-fraction': '0.75',
    },
    'size:md': {
      '--spinner-diameter':
        'calc(var(--minim-typography-line-height-md) * 0.85)',
      '--spinner-stroke-width':
        'calc(var(--minim-typography-line-height-md) * 0.15)',
      '--spinner-box-size': minim('typography-line-height-md'),
      '--spinner-padding-block': minim('component-medium-padding-block-slot'),
      '--spinner-arc-fraction': '0.75',
    },
    'size:lg': {
      '--spinner-diameter':
        'calc(var(--minim-typography-line-height-lg) * 0.875)',
      '--spinner-stroke-width':
        'calc(var(--minim-typography-line-height-lg) * 0.125)',
      '--spinner-box-size': minim('typography-line-height-lg'),
      '--spinner-padding-inline':
        'max(0px, calc((var(--minim-component-large-width-inline) - var(--minim-typography-line-height-lg)) / 2))',
      '--spinner-padding-block': minim('component-large-padding-block-slot'),
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
