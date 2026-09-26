// Copyright (c) Meta Platforms, Inc. and affiliates.

import type {ComponentStyleMap} from '@astryxdesign/core/theme';

const minim = (name: string) => `var(--minim-${name})`;

const fieldSurface = {
  boxSizing: 'border-box',
  backgroundColor: minim('bg-field'),
  borderColor: minim('stroke-neutral'),
  borderRadius: minim('radius-element'),
  ':focus-within': {
    borderColor: minim('stroke-primary'),
    boxShadow: `inset 0 0 0 1px ${minim('stroke-primary')}`,
  },
} as const;

/**
 * Minim advanced-control recipes. Calendar cells/day visuals and slider
 * rails/thumbs retain the source's explicit, density-independent primitives.
 */
export const minimAdvancedComponents = {
  calendar: {
    base: {
      '--calendar-cell-size': 'var(--minim-component-large-height)',
      '--calendar-cell-padding': minim('spacing-50'),
      '--calendar-month-font-size': minim('typography-font-size-lg'),
      '--calendar-month-line-height': minim('typography-line-height-lg'),
      '--calendar-weekday-height': minim('typography-line-height-sm'),
      '--calendar-weekday-padding-bottom': '0px',
      '--calendar-row-gap': minim('spacing-200'),
      padding: minim('spacing-300'),
      borderRadius: minim('radius-container'),
      backgroundColor: minim('bg-layer'),
    },
  },
  'calendar-day': {
    base: {
      width: '100%',
      height: '100%',
      fontSize: minim('typography-font-size-lg'),
      lineHeight: minim('typography-line-height-lg'),
      color: minim('fg-neutral'),
      borderRadius: minim('radius-full'),
    },
    'marker:today-only': {
      boxShadow: `inset 0 0 0 1px ${minim('stroke-neutral')}`,
    },
    'marker:today-in-range': {
      boxShadow: `inset 0 0 0 1px ${minim('stroke-neutral')}`,
    },
    'selected:selected': {
      color: minim('fg-on-surface'),
      backgroundColor: minim('bg-primary-solid'),
    },
    'disabled:disabled': {color: minim('fg-disabled')},
  },
  'power-search-trigger': {
    base: {
      '--power-search-trigger-min-height':
        'var(--minim-component-large-height)',
      '--power-search-content-gap': minim('spacing-200'),
      '--power-search-padding-block': minim('component-large-padding-block'),
      '--power-search-padding-inline': minim('spacing-300'),
      '--power-search-background': minim('bg-field'),
      '--power-search-border-color': minim('stroke-neutral'),
      '--power-search-focus-border-color': minim('stroke-neutral-strong'),
      '--power-search-focus-ring': 'none',
      '--power-search-radius': minim('radius-element'),
      ':is(*) .astryx-tokenizer > span > .astryx-icon': {
        color: minim('fg-muted'),
        fontWeight: minim('typography-font-weight-medium'),
      },
      ':is(*) input::placeholder': {color: minim('fg-muted')},
    },
  },
  'power-search-popover': {
    base: {
      backgroundColor: minim('bg-layer'),
      borderRadius: minim('radius-container'),
      boxShadow: minim('elevation-low'),
    },
    'mode:fields': {padding: minim('spacing-200')},
    'mode:value-editor': {
      padding: minim('spacing-200'),
      '--power-search-popover-padding': minim('spacing-300'),
      '--power-search-editor-footer-gap': minim('spacing-200'),
      ':is(*) .astryx-power-search-editor-field': {
        flex: '1 1 0',
        minWidth: '0',
      },
    },
    'mode:results': {padding: minim('spacing-200')},
    'mode:empty': {padding: minim('spacing-200')},
  },
  'file-input': {
    base: {
      ...fieldSurface,
      gap: minim('spacing-200'),
      ':is(*) > span:not(.astryx-icon):not(.astryx-spinner)': {
        fontSize: minim('typography-font-size-lg'),
        lineHeight: minim('typography-line-height-lg'),
      },
      ':is(.astryx-file-input) .astryx-input-status-icon': {
        fontSize: minim('typography-line-height-lg'),
        width: minim('component-large-width-inline'),
        height:
          'calc(var(--minim-typography-line-height-lg) + 2 * var(--minim-component-large-padding-block-slot))',
      },
      ':focus-within': {
        borderColor: minim('stroke-neutral-strong'),
        boxShadow: 'none',
      },
      ':has(button:disabled)': {
        backgroundColor: minim('bg-disabled'),
      },
      ':has(button:disabled) .astryx-file-input-icon': {
        color: minim('fg-neutral'),
      },
      ':has(button:disabled) > span:not(.astryx-icon):not(.astryx-spinner)': {
        color: minim('fg-neutral'),
      },
    },
    'mode:input': {
      height: 'var(--minim-component-large-height)',
      paddingBlock: minim('component-large-padding-block'),
      paddingInline: minim('spacing-300'),
    },
    'mode:dropzone': {
      // Figma draws the 1px stroke inside its auto-layout bounds.
      paddingBlock: 'calc(var(--minim-spacing-500) - 1px)',
      paddingInline: minim('spacing-300'),
    },
    'status:error': {borderColor: minim('stroke-critical')},
    'status:warning': {borderColor: minim('stroke-warning')},
    'status:success': {borderColor: minim('stroke-neutral')},
  },
  'file-input-icon': {
    base: {
      color: minim('fg-muted'),
      fontWeight: minim('typography-font-weight-medium'),
    },
    'mode:input': {
      '--minim-icon-box-size': minim('typography-line-height-lg'),
      ':is(.astryx-icon)': {
        fontSize: minim('typography-line-height-lg'),
        width: minim('component-large-width-inline'),
        height:
          'calc(var(--minim-typography-line-height-lg) + 2 * var(--minim-component-large-padding-block-slot))',
      },
    },
    'mode:dropzone': {
      '--minim-icon-box-size': minim('typography-line-height-lg'),
      ':is(.astryx-icon)': {
        fontSize: minim('typography-line-height-lg'),
        width: minim('component-large-width-inline'),
        height:
          'calc(var(--minim-typography-line-height-lg) + 2 * var(--minim-component-large-padding-block-slot))',
      },
    },
  },
  slider: {base: {gap: minim('spacing-200')}},
  'slider-track': {
    base: {
      backgroundColor: minim('bg-neutral'),
      borderRadius: minim('radius-full'),
    },
    'orientation:horizontal': {height: '4px'},
    'orientation:vertical': {width: '4px'},
  },
  'slider-mark': {
    base: {
      backgroundColor: minim('stroke-neutral'),
      borderRadius: minim('radius-full'),
    },
    'orientation:horizontal': {width: '2px', height: '8px'},
    'orientation:vertical': {width: '8px', height: '2px'},
  },
  'slider-thumb': {
    base: {
      width: '20px',
      height: '20px',
      borderRadius: minim('radius-full'),
      backgroundColor: minim('bg-primary-solid'),
    },
  },
} as const satisfies ComponentStyleMap;
