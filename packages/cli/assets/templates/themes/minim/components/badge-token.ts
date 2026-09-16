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
    width: minim('content-supporting-medium-icon-box-width'),
    height: minim('content-supporting-medium-box-size'),
    fontSize: minim('typography-line-height-xs'),
    lineHeight: minim('typography-line-height-xs'),
  },
  'size:lg': {
    '--minim-icon-box-size': minim('typography-line-height-sm'),
    width: minim('content-supporting-large-icon-box-width'),
    height: minim('content-supporting-large-box-size'),
    fontSize: minim('typography-line-height-sm'),
    lineHeight: minim('typography-line-height-sm'),
  },
} as const;

const supportingContentPart = {
  base: supportingPart.base,
  'size:md': {
    height: minim('content-supporting-medium-box-size'),
    fontSize: minim('typography-font-size-xs'),
    lineHeight: minim('typography-line-height-xs'),
  },
  'size:lg': {
    height: minim('content-supporting-large-box-size'),
    fontSize: minim('typography-font-size-sm'),
    lineHeight: minim('typography-line-height-sm'),
  },
} as const;

/** Badge and Token overrides verified against the decoded Minim source. */
export const minimBadgeTokenComponents = {
  badge: {
    base: {
      width: 'fit-content',
      height: 'auto',
      gap: minim('content-supporting-medium-text-gap'),
      paddingBlock: '0',
      paddingInline: minim('spacing-100'),
      borderRadius: minim('radius-full'),
    },
    'size:lg': {
      gap: minim('content-supporting-large-text-gap'),
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
      paddingInline: minim('spacing-50'),
      paddingBlock: minim('content-supporting-medium-text-inset-block'),
      fontSize: minim('typography-font-size-xs'),
      lineHeight: minim('typography-line-height-xs'),
    },
    'size:lg': {
      paddingInline: minim('spacing-50'),
      paddingBlock: minim('content-supporting-large-text-inset-block'),
      fontSize: minim('typography-font-size-sm'),
      lineHeight: minim('typography-line-height-sm'),
    },
  },
  'badge-icon': supportingPart,
  token: {
    base: {
      width: 'fit-content',
      height: 'auto',
      gap: minim('content-supporting-medium-text-gap'),
      paddingBlock: '0',
      paddingInline: minim('spacing-100'),
      borderRadius: minim('radius-full'),
    },
    'size:sm': {
      gap: minim('content-supporting-medium-text-gap'),
    },
    'size:md': {
      gap: minim('content-supporting-large-text-gap'),
    },
    'color:default': subtle('bg-layer-base', 'fg-neutral'),
    'color:red': subtle('bg-critical', 'fg-critical'),
    'color:orange': subtle('bg-orange', 'fg-orange'),
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
      paddingInline: minim('spacing-50'),
      paddingBlock: minim('content-supporting-medium-text-inset-block'),
      fontSize: minim('typography-font-size-xs'),
      lineHeight: minim('typography-line-height-xs'),
    },
    'size:md': {
      paddingInline: minim('spacing-50'),
      paddingBlock: minim('content-supporting-large-text-inset-block'),
      fontSize: minim('typography-font-size-sm'),
      lineHeight: minim('typography-line-height-sm'),
    },
  },
  'token-icon': {
    ...supportingPart,
    'size:sm': supportingPart['size:md'],
    'size:md': supportingPart['size:lg'],
  },
  'token-end-content': {
    ...supportingContentPart,
    'size:sm': supportingContentPart['size:md'],
    'size:md': supportingContentPart['size:lg'],
  },
  'token-remove': {
    base: {color: 'inherit'},
    'size:sm': {
      '--minim-icon-box-size': minim('typography-line-height-xs'),
      width: minim('content-supporting-medium-icon-box-width'),
      height: minim('content-supporting-medium-box-size'),
      fontSize: minim('typography-line-height-xs'),
      lineHeight: minim('typography-line-height-xs'),
    },
    'size:md': {
      '--minim-icon-box-size': minim('typography-line-height-sm'),
      width: minim('content-supporting-large-icon-box-width'),
      height: minim('content-supporting-large-box-size'),
      fontSize: minim('typography-line-height-sm'),
      lineHeight: minim('typography-line-height-sm'),
    },
  },
} as const satisfies ComponentStyleMap;
