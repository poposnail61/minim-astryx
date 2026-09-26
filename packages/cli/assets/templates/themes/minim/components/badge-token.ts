// Copyright (c) Meta Platforms, Inc. and affiliates.

import type {ComponentStyleMap} from '@astryxdesign/core/theme';

const minim = (name: string) => `var(--minim-${name})`;

const solid = (background: string) => ({
  backgroundColor: minim(background),
  color: minim('fg-on-surface'),
});

const subtle = (background: string, foreground: string) => ({
  backgroundColor: minim(background),
  color: minim(foreground),
});

const supportingPart = {
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    flexShrink: '0',
  },
  'size:md': {
    '--minim-icon-box-size': minim('typography-line-height-xs'),
    width: minim('component-supporting-medium-width-inline'),
    height:
      'calc(var(--minim-typography-line-height-xs) + 2 * var(--minim-component-supporting-medium-padding-block-slot))',
    fontSize: minim('typography-line-height-xs'),
    lineHeight: minim('typography-line-height-xs'),
  },
  'size:lg': {
    '--minim-icon-box-size': minim('typography-line-height-sm'),
    width: minim('component-supporting-large-width-inline'),
    height:
      'calc(var(--minim-typography-line-height-sm) + 2 * var(--minim-component-supporting-large-padding-block-slot))',
    fontSize: minim('typography-line-height-sm'),
    lineHeight: minim('typography-line-height-sm'),
  },
} as const;

const supportingContentPart = {
  base: supportingPart.base,
  'size:md': {
    height:
      'calc(var(--minim-typography-line-height-xs) + 2 * var(--minim-component-supporting-medium-padding-block-slot))',
    fontSize: minim('typography-font-size-xs'),
    lineHeight: minim('typography-line-height-xs'),
  },
  'size:lg': {
    height:
      'calc(var(--minim-typography-line-height-sm) + 2 * var(--minim-component-supporting-large-padding-block-slot))',
    fontSize: minim('typography-font-size-sm'),
    lineHeight: minim('typography-line-height-sm'),
  },
} as const;

/** Badge and Token overrides verified against the decoded Minim source. */
export const minimBadgeTokenComponents = {
  badge: {
    base: {
      width: 'fit-content',
      height: minim('component-large-height-inline'),
      gap: minim('spacing-100'),
      paddingBlock: '0',
      paddingInline: minim('spacing-150'),
      borderRadius: minim('radius-full'),
    },
    'size:md': {
      height: minim('component-medium-height-inline'),
    },
    'size:lg': {
      height: minim('component-large-height-inline'),
      gap: minim('spacing-100'),
    },
    'size:dot': {
      width: minim('spacing-200'),
      height: minim('spacing-200'),
      minWidth: minim('spacing-200'),
      padding: '0',
    },
    'variant:neutral': solid('bg-neutral-solid'),
    'variant:primary': solid('bg-primary-solid'),
    'variant:secondary': solid('bg-secondary-solid'),
    'variant:critical': solid('bg-critical-solid'),
    'variant:neutral-subtle': subtle('bg-layer-base', 'fg-neutral'),
    'variant:primary-subtle': subtle('bg-primary', 'fg-primary'),
    'variant:secondary-subtle': subtle('bg-secondary', 'fg-secondary'),
    'variant:critical-subtle': subtle('bg-critical', 'fg-critical'),
    // Released Astryx aliases remain themed for backwards compatibility.
    'variant:info': solid('bg-primary-solid'),
    'variant:success': solid('bg-secondary-solid'),
    'variant:warning': subtle('bg-warning', 'fg-warning'),
    'variant:error': solid('bg-critical-solid'),
    'variant:blue': subtle('bg-primary', 'fg-primary'),
    'variant:green': subtle('bg-secondary', 'fg-secondary'),
    'variant:red': subtle('bg-critical', 'fg-critical'),
    'variant:orange': subtle('bg-orange', 'fg-orange'),
    'variant:yellow': subtle('bg-yellow', 'fg-yellow'),
    'variant:teal': subtle('bg-teal', 'fg-teal'),
    'variant:cyan': subtle('bg-cyan', 'fg-cyan'),
    'variant:purple': subtle('bg-purple', 'fg-purple'),
    'variant:pink': subtle('bg-pink', 'fg-pink'),
  },
  'badge-label': {
    'size:md': {
      paddingInline: '0',
      paddingBlock: minim('component-supporting-medium-padding-block-slot'),
      fontSize: minim('typography-font-size-xs'),
      lineHeight: minim('typography-line-height-xs'),
    },
    'size:lg': {
      paddingInline: '0',
      paddingBlock: minim('component-supporting-large-padding-block-slot'),
      fontSize: minim('typography-font-size-sm'),
      lineHeight: minim('typography-line-height-sm'),
    },
  },
  'badge-icon': supportingPart,
  token: {
    base: {
      width: 'fit-content',
      height: minim('component-large-height-inline'),
      gap: minim('spacing-100'),
      paddingBlock: '0',
      paddingInline: minim('spacing-150'),
      borderRadius: minim('radius-full'),
    },
    'size:sm': {
      height: minim('component-medium-height-inline'),
      gap: minim('spacing-100'),
    },
    'size:md': {
      height: minim('component-medium-height-inline'),
      gap: minim('spacing-100'),
    },
    'size:lg': {
      height: minim('component-large-height-inline'),
      gap: minim('spacing-100'),
    },
    'color:default': subtle('bg-layer-base', 'fg-neutral'),
    'color:red': subtle('bg-critical', 'fg-critical'),
    'color:orange': subtle('bg-orange', 'fg-orange'),
    'color:amber': subtle('bg-amber', 'fg-amber'),
    'color:yellow': subtle('bg-yellow', 'fg-yellow'),
    'color:green': subtle('bg-secondary', 'fg-secondary'),
    'color:teal': subtle('bg-teal', 'fg-teal'),
    'color:cyan': subtle('bg-cyan', 'fg-cyan'),
    'color:blue': subtle('bg-primary', 'fg-primary'),
    'color:purple': subtle('bg-purple', 'fg-purple'),
    'color:pink': subtle('bg-pink', 'fg-pink'),
    'color:gray': solid('bg-neutral-solid'),
  },
  'token-label': {
    'size:sm': {
      paddingInline: '0',
      paddingBlock: minim('component-supporting-medium-padding-block-slot'),
      fontSize: minim('typography-font-size-xs'),
      lineHeight: minim('typography-line-height-xs'),
    },
    'size:md': {
      paddingInline: '0',
      paddingBlock: minim('component-supporting-medium-padding-block-slot'),
      fontSize: minim('typography-font-size-xs'),
      lineHeight: minim('typography-line-height-xs'),
    },
    'size:lg': {
      paddingInline: '0',
      paddingBlock: minim('component-supporting-large-padding-block-slot'),
      fontSize: minim('typography-font-size-sm'),
      lineHeight: minim('typography-line-height-sm'),
    },
  },
  'token-icon': {
    ...supportingPart,
    'size:sm': supportingPart['size:md'],
  },
  'token-end-content': {
    ...supportingContentPart,
    'size:sm': supportingContentPart['size:md'],
  },
  'token-remove': {
    base: {color: 'inherit'},
    'size:sm': {
      '--minim-icon-box-size': minim('typography-line-height-xs'),
      width: minim('component-supporting-medium-width-inline'),
      height:
        'calc(var(--minim-typography-line-height-xs) + 2 * var(--minim-component-supporting-medium-padding-block-slot))',
      fontSize: minim('typography-line-height-xs'),
      lineHeight: minim('typography-line-height-xs'),
    },
    'size:md': {
      ...supportingPart['size:md'],
    },
    'size:lg': {
      '--minim-icon-box-size': minim('typography-line-height-sm'),
      width: minim('component-supporting-large-width-inline'),
      height:
        'calc(var(--minim-typography-line-height-sm) + 2 * var(--minim-component-supporting-large-padding-block-slot))',
      fontSize: minim('typography-line-height-sm'),
      lineHeight: minim('typography-line-height-sm'),
    },
  },
} as const satisfies ComponentStyleMap;
