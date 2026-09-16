// Copyright (c) Meta Platforms, Inc. and affiliates.

import type {ComponentStyleMap} from '@astryxdesign/core/theme';

const minim = (name: string) => `var(--minim-${name})`;

const menuSurface = {
  gap: '0',
  padding: minim('spacing-200'),
  borderRadius: minim('radius-container'),
  backgroundColor: minim('bg-layer'),
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
  'context-menu': {base: menuSurface},
  'dropdown-menu': {base: menuSurface},
  'dropdown-menu-item': {
    base: menuItemBase,
    'size:md': {
      '--minim-icon-box-size': minim('typography-line-height-md'),
      minHeight:
        'calc(var(--minim-content-medium-box-size) + 2 * var(--minim-row-medium-padding-block))',
      gap: minim('row-medium-gap'),
      paddingBlock: minim('row-medium-padding-block'),
      paddingInline: minim('row-medium-padding-inline'),
    },
    'size:lg': {
      '--minim-icon-box-size': minim('typography-line-height-lg'),
      minHeight:
        'calc(var(--minim-content-large-box-size) + 2 * var(--minim-row-large-padding-block))',
      gap: minim('row-large-gap'),
      paddingBlock: minim('row-large-padding-block'),
      paddingInline: minim('row-large-padding-inline'),
    },
    'variant:destructive': {
      color: minim('fg-critical'),
    },
  },
  'menu-radio-row': {
    // Verified Figma exception: these values are unbound and therefore stay
    // identical in base and compact rather than inventing a density scale.
    'size:md': {
      minHeight: '2.5rem',
      gap: '0.5rem',
      padding: '0.5rem',
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
    base: {gap: minim('spacing-200')},
    'size:md': {
      '--spinner-diameter': '14px',
      '--spinner-stroke-width': '3px',
      '--spinner-arc-fraction': '0.375',
    },
    'size:lg': {
      '--spinner-diameter': '18px',
      '--spinner-stroke-width': '3px',
      '--spinner-arc-fraction': '0.375',
    },
    'size:xl': {
      '--spinner-diameter': '28px',
      '--spinner-stroke-width': '4px',
      '--spinner-arc-fraction': '0.375',
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
      '--spinner-track-color': minim('fg-on-surface'),
    },
  },
} as const satisfies ComponentStyleMap;
