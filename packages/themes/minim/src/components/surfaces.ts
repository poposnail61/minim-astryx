// Copyright (c) Meta Platforms, Inc. and affiliates.

import type {ComponentStyleMap} from '@astryxdesign/core/theme';

const token = (name: string) => `var(--minim-${name})`;

/** Figma blue-outline surfaces; interaction and layout remain owned by core. */
export const minimSurfaceComponents = {
  card: {
    base: {padding: token('spacing-300')},
    'variant:default': {borderColor: token('stroke-neutral-subtle')},
  },
  'clickable-card': {
    base: {'--astryx-card-padding': token('spacing-400')},
    'variant:default': {borderColor: token('stroke-neutral')},
  },
  'selectable-card': {
    base: {'--astryx-card-padding': token('spacing-300')},
    'variant:default': {borderColor: token('stroke-neutral')},
  },
  'collapsible-trigger': {
    base: {paddingBlock: token('spacing-200')},
    'density:compact': {paddingBlock: token('spacing-100')},
    'density:spacious': {paddingBlock: token('spacing-300')},
  },
  'collapsible-content': {
    base: {paddingTop: token('spacing-100')},
  },
  section: {base: {padding: token('spacing-300')}},
  'aspect-ratio': {'shape:rectangle': {borderRadius: token('radius-inner')}},
  divider: {base: {'--color-border': token('stroke-neutral-subtle')}},
  'overlay-scrim': {
    'scrim:dark': {backgroundColor: token('bg-layer-overlay')},
    'scrim:light': {backgroundColor: token('bg-layer-overlay-light')},
  },
  'form-layout': {base: {gap: token('spacing-400')}},
  dialog: {
    base: {
      borderRadius: token('radius-overlay'),
      padding: token('spacing-400'),
    },
    'variant:fullscreen': {borderRadius: '0'},
  },
  'dialog-header': {base: {gap: token('spacing-300')}},
  'dialog-header-title-block': {base: {gap: token('spacing-50')}},
  'hover-card': {
    base: {
      borderRadius: token('radius-element'),
      padding: token('spacing-300'),
      borderColor: token('stroke-neutral'),
    },
  },
  popover: {
    base: {
      borderRadius: token('radius-element'),
      padding: token('spacing-300'),
      borderColor: token('stroke-neutral'),
    },
  },
  toast: {
    base: {
      padding: token('spacing-300'),
      borderRadius: token('radius-element'),
      color: token('fg-neutral-inverted'),
    },
  },
  tooltip: {
    base: {
      paddingBlock: token('spacing-100'),
      paddingInline: token('spacing-200'),
      borderRadius: token('radius-inner'),
      backgroundColor: token('bg-neutral-solid'),
      color: token('fg-neutral-inverted'),
      fontSize: token('typography-font-size-xs'),
      lineHeight: token('typography-line-height-xs'),
    },
  },
  'command-palette-input': {
    base: {
      paddingBlock: token('spacing-300'),
      paddingInline: token('spacing-400'),
      gap: token('spacing-200'),
      fontSize: token('typography-font-size-lg'),
      lineHeight: token('typography-line-height-lg'),
    },
  },
  'command-palette-list': {
    base: {padding: token('spacing-100'), gap: token('spacing-50')},
  },
  'command-palette-item': {
    base: {
      paddingBlock: token('row-medium-padding-block'),
      paddingInline: token('spacing-300'),
      gap: token('row-medium-gap'),
      borderRadius: token('radius-element'),
      '--minim-icon-box-size': token('typography-line-height-md'),
    },
  },
  'command-palette-footer': {
    base: {
      paddingBlock: token('spacing-200'),
      paddingInline: token('spacing-400'),
      gap: token('spacing-400'),
    },
  },
  'command-palette-empty': {
    base: {
      paddingBlock: token('spacing-800'),
      paddingInline: token('spacing-400'),
    },
  },
  // Header and expandable content paint their own corners. Share the radius
  // role rather than forcing four rounded corners on each nested surface.
  'banner-frame': {base: {'--radius-container': token('radius-element')}},
  banner: {
    base: {
      paddingBlock: token('spacing-300'),
      paddingInline: token('spacing-400'),
      gap: token('spacing-200'),
    },
    'status:info': {
      backgroundColor: token('bg-neutral'),
      color: token('fg-neutral'),
    },
    'status:success': {
      backgroundColor: token('bg-primary'),
      color: token('fg-primary'),
    },
    'status:warning': {
      backgroundColor: token('bg-warning'),
      color: token('fg-warning'),
    },
    'status:error': {
      backgroundColor: token('bg-critical'),
      color: token('fg-critical'),
    },
  },
  'banner-icon': {
    base: {'--minim-icon-box-size': token('typography-line-height-sm')},
    'status:info': {color: token('fg-neutral')},
  },
  'banner-title': {
    base: {
      fontSize: token('typography-font-size-sm'),
      lineHeight: token('typography-line-height-sm'),
      fontWeight: token('typography-font-weight-medium'),
      color: 'inherit',
    },
  },
  'banner-description': {
    base: {
      fontSize: token('typography-font-size-xs'),
      lineHeight: token('typography-line-height-xs'),
      color: 'inherit',
    },
  },
  'banner-content': {
    base: {
      paddingBlock: token('spacing-300'),
      paddingInline: token('spacing-400'),
      backgroundColor: token('bg-layer'),
      borderColor: token('stroke-neutral'),
    },
    'container:card': {
      borderEndStartRadius: token('radius-container'),
      borderEndEndRadius: token('radius-container'),
    },
    'status:success': {borderColor: token('stroke-primary')},
    'status:warning': {borderColor: token('stroke-warning')},
    'status:error': {borderColor: token('stroke-critical')},
  },
  'progress-bar': {
    base: {
      '--text-body-size': token('typography-font-size-sm'),
      '--text-body-leading': token('typography-line-height-sm'),
      gap: token('spacing-100'),
    },
  },
  'progress-bar-track': {base: {backgroundColor: token('bg-neutral')}},
  'progress-bar-fill': {
    'variant:accent': {backgroundColor: token('bg-primary-solid')},
    'variant:success': {backgroundColor: token('bg-primary-solid')},
    'variant:warning': {backgroundColor: token('fg-warning')},
    'variant:error': {backgroundColor: token('bg-critical-solid')},
    'variant:neutral': {backgroundColor: token('bg-neutral-solid')},
  },
  skeleton: {
    base: {backgroundColor: token('bg-neutral')},
    'radius:none': {borderRadius: '0'},
    'radius:0': {borderRadius: token('radius-inner')},
    'radius:1': {borderRadius: token('radius-element-item')},
    'radius:2': {borderRadius: token('radius-element')},
    'radius:3': {borderRadius: token('radius-container')},
    'radius:4': {borderRadius: token('radius-overlay')},
    'radius:rounded': {borderRadius: token('radius-full')},
  },
  'status-dot': {
    'variant:neutral': {backgroundColor: token('fg-neutral')},
  },
} as const satisfies ComponentStyleMap;
