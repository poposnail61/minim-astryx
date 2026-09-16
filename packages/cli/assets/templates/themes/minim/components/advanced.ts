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
      '--calendar-cell-size': '32px',
      padding: minim('spacing-300'),
      borderRadius: minim('radius-container'),
      backgroundColor: minim('bg-layer'),
    },
  },
  'calendar-day': {
    base: {
      width: '28px',
      height: '28px',
      color: minim('fg-neutral'),
      borderRadius: minim('radius-full'),
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
        'calc(var(--minim-typography-line-height-md) + 2 * var(--minim-spacing-150))',
      '--power-search-content-gap': minim('content-medium-text-gap'),
      '--power-search-padding-block': minim('spacing-150'),
      '--power-search-padding-inline': minim('spacing-300'),
      '--power-search-background': minim('bg-field'),
      '--power-search-border-color': minim('stroke-neutral'),
      '--power-search-focus-border-color': minim('stroke-primary'),
      '--power-search-focus-ring': `inset 0 0 0 1px ${minim('stroke-primary')}`,
      '--power-search-radius': minim('radius-element'),
    },
  },
  'power-search-popover': {
    base: {
      backgroundColor: minim('bg-layer'),
      borderRadius: minim('radius-container'),
      boxShadow: minim('elevation-low'),
    },
    'mode:fields': {padding: minim('spacing-100')},
    'mode:value-editor': {
      '--power-search-popover-padding': minim('spacing-300'),
    },
    'mode:results': {padding: minim('spacing-200')},
    'mode:empty': {padding: minim('spacing-200')},
  },
  'file-input': {
    base: {...fieldSurface, gap: minim('spacing-200')},
    'mode:input': {
      height:
        'calc(var(--minim-content-medium-box-size) + 2 * var(--minim-spacing-100))',
      paddingBlock: minim('spacing-100'),
      paddingInline: minim('spacing-200'),
    },
    'mode:dropzone': {
      paddingBlock: minim('spacing-500'),
      paddingInline: minim('spacing-400'),
    },
    'status:error': {borderColor: minim('stroke-critical')},
    'status:warning': {borderColor: minim('stroke-warning')},
    'status:success': {borderColor: minim('stroke-primary')},
  },
  'file-input-icon': {
    base: {color: minim('fg-neutral')},
    'mode:input': {
      '--minim-icon-box-size': minim('typography-line-height-xs'),
      width: minim('typography-line-height-xs'),
      height: minim('typography-line-height-xs'),
    },
    'mode:dropzone': {
      '--minim-icon-box-size': minim('typography-line-height-md'),
      width: minim('typography-line-height-md'),
      height: minim('typography-line-height-md'),
    },
  },
  slider: {base: {gap: minim('spacing-200')}},
  'slider-track': {
    base: {
      backgroundColor: minim('fg-neutral'),
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
