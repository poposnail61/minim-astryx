// Copyright (c) Meta Platforms, Inc. and affiliates.

import type {ComponentStyleMap} from '@astryxdesign/core/theme';

const minim = (name: string) => `var(--minim-${name})`;

const iconBox = (fallback: string) =>
  `var(--minim-icon-box-size, ${minim(fallback)})`;

/**
 * Generic Icon sizing for registry glyphs and direct SVG icons.
 *
 * Component wrappers may set the inherited --minim-icon-box-size context
 * variable. Standalone icons fall back to their own semantic line-height.
 * Color remains owned by Icon's existing color axis and currentColor cascade.
 */
export const minimIconComponents = {
  icon: {
    base: {
      lineHeight: '1',
    },
    'size:xsm': {
      width: iconBox('typography-line-height-xs'),
      height: iconBox('typography-line-height-xs'),
      fontSize: iconBox('typography-line-height-xs'),
    },
    'size:sm': {
      width: iconBox('typography-line-height-sm'),
      height: iconBox('typography-line-height-sm'),
      fontSize: iconBox('typography-line-height-sm'),
    },
    'size:md': {
      width: iconBox('typography-line-height-md'),
      height: iconBox('typography-line-height-md'),
      fontSize: iconBox('typography-line-height-md'),
    },
    'size:lg': {
      width: iconBox('typography-line-height-lg'),
      height: iconBox('typography-line-height-lg'),
      fontSize: iconBox('typography-line-height-lg'),
    },
  },
} as const satisfies ComponentStyleMap;
