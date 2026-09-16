// Copyright (c) Meta Platforms, Inc. and affiliates.

import type {ComponentStyleMap} from '@astryxdesign/core/theme';

const minim = (name: string) => `var(--minim-${name})`;

const focus = (stroke: string) => ({
  outlineWidth: '2px',
  outlineStyle: 'solid',
  outlineColor: 'transparent',
  outlineOffset: '2px',
  boxShadow: `inset 0 0 0 2px ${minim(stroke)}`,
});

const solidOnSurface = {
  color: minim('fg-on-surface'),
};

const neutralForeground = {
  color: minim('fg-neutral'),
};

/**
 * Minim's Button-only theme overrides.
 *
 * The 4px label inset is intentionally spacing/100 for every size. Figma's
 * large content token resolves to 5px, but the actual Button instances bind
 * and render 4px; this keeps the implementation aligned to the component.
 */
export const minimButtonComponents = {
  button: {
    base: {
      gap: '0',
      borderRadius: `var(--_button-radius, ${minim('radius-element')})`,
      borderInlineStartColor: minim('stroke-neutral'),
      borderBlockStartColor: minim('stroke-neutral'),
      ':active': {transform: 'none'},
    },
    'size:md': {
      height:
        'calc(var(--minim-content-medium-box-size) + 2 * var(--minim-control-medium-padding-block))',
      paddingInline: minim('control-medium-padding-inline'),
      paddingBlock: minim('control-medium-padding-block'),
    },
    'size:lg': {
      height:
        'calc(var(--minim-content-large-box-size) + 2 * var(--minim-control-large-padding-block))',
      paddingInline: minim('control-large-padding-inline'),
      paddingBlock: minim('control-large-padding-block'),
    },
    'size:xl': {
      height:
        'calc(var(--minim-content-large-box-size) + 2 * var(--minim-control-xlarge-padding-block))',
      paddingInline: minim('control-xlarge-padding-inline'),
      paddingBlock: minim('control-xlarge-padding-block'),
    },
    'content:icon-only': {
      paddingInline: '0',
      paddingBlock: '0',
    },
    'variant:primary': {
      ...solidOnSurface,
      backgroundColor: minim('bg-primary-solid'),
      ':focus-visible': focus('stroke-primary'),
    },
    'variant:neutral': {
      ...solidOnSurface,
      backgroundColor: minim('bg-neutral-solid'),
      ':focus-visible': focus('stroke-neutral-strong'),
    },
    'variant:neutral-subtle': {
      ...neutralForeground,
      backgroundColor: minim('bg-neutral'),
      ':focus-visible': focus('stroke-neutral-strong'),
    },
    'variant:critical-subtle': {
      color: minim('fg-critical'),
      backgroundColor: minim('bg-critical'),
      ':focus-visible': focus('stroke-critical'),
    },
    'variant:ghost': {
      ...neutralForeground,
      backgroundColor: minim('bg-transparent'),
      ':focus-visible': focus('stroke-neutral-strong'),
    },
    'variant:outline': {
      ...neutralForeground,
      backgroundColor: minim('bg-neutral-subtle'),
      borderWidth: '0',
      boxShadow: `inset 0 0 0 1px ${minim('stroke-neutral')}`,
      ':focus-visible': focus('stroke-neutral-strong'),
    },
    'variant:critical': {
      ...solidOnSurface,
      backgroundColor: minim('bg-critical-solid'),
      ':focus-visible': focus('stroke-critical'),
    },
    'variant:secondary': {
      ...neutralForeground,
      backgroundColor: minim('bg-neutral'),
      ':focus-visible': focus('stroke-neutral-strong'),
    },
    'variant:destructive': {
      ...solidOnSurface,
      backgroundColor: minim('bg-critical-solid'),
      ':focus-visible': focus('stroke-critical'),
    },
  },
  'button-icon': {
    // The central Minim icon recipe consumes this inherited glyph-box size.
    // This wrapper remains the larger alignment slot from the Button anatomy.
    'size:sm': {
      '--minim-icon-box-size':
        'var(--minim-button-icon-size, var(--minim-typography-line-height-md))',
      width:
        'var(--minim-button-icon-slot-width, var(--minim-content-medium-icon-box-width))',
      height:
        'var(--minim-button-icon-slot-height, calc(var(--minim-typography-line-height-md) + 2 * var(--minim-content-medium-text-inset-block)))',
      fontSize:
        'var(--minim-button-icon-size, var(--minim-typography-line-height-md))',
      lineHeight:
        'var(--minim-button-icon-size, var(--minim-typography-line-height-md))',
    },
    'size:md': {
      '--minim-icon-box-size':
        'var(--minim-button-icon-size, var(--minim-typography-line-height-md))',
      width:
        'var(--minim-button-icon-slot-width, var(--minim-content-medium-icon-box-width))',
      height:
        'var(--minim-button-icon-slot-height, calc(var(--minim-typography-line-height-md) + 2 * var(--minim-content-medium-text-inset-block)))',
      fontSize:
        'var(--minim-button-icon-size, var(--minim-typography-line-height-md))',
      lineHeight:
        'var(--minim-button-icon-size, var(--minim-typography-line-height-md))',
    },
    'size:lg': {
      '--minim-icon-box-size': minim('typography-line-height-lg'),
      width: minim('content-large-icon-box-width'),
      height:
        'calc(var(--minim-typography-line-height-lg) + 2 * var(--minim-content-large-text-inset-block))',
      fontSize: minim('typography-line-height-lg'),
      lineHeight: minim('typography-line-height-lg'),
    },
    'size:xl': {
      '--minim-icon-box-size': minim('typography-line-height-lg'),
      width: minim('content-large-icon-box-width'),
      height:
        'calc(var(--minim-typography-line-height-lg) + 2 * var(--minim-content-large-text-inset-block))',
      fontSize: minim('typography-line-height-lg'),
      lineHeight: minim('typography-line-height-lg'),
    },
  },
  'button-label': {
    base: {
      paddingInline:
        'var(--minim-button-label-inset-inline, var(--minim-spacing-100))',
    },
    'size:sm': {
      paddingBlock:
        'var(--minim-button-label-inset-block, var(--minim-content-medium-text-inset-block))',
      fontSize:
        'var(--minim-button-label-font-size, var(--minim-typography-font-size-md))',
      lineHeight:
        'var(--minim-button-label-line-height, var(--minim-typography-line-height-md))',
    },
    'size:md': {
      paddingBlock:
        'var(--minim-button-label-inset-block, var(--minim-content-medium-text-inset-block))',
      fontSize:
        'var(--minim-button-label-font-size, var(--minim-typography-font-size-md))',
      lineHeight:
        'var(--minim-button-label-line-height, var(--minim-typography-line-height-md))',
    },
    'size:lg': {
      paddingBlock: minim('content-large-text-inset-block'),
      fontSize: minim('typography-font-size-lg'),
      lineHeight: minim('typography-line-height-lg'),
    },
    'size:xl': {
      paddingBlock: minim('content-large-text-inset-block'),
      fontSize: minim('typography-font-size-lg'),
      lineHeight: minim('typography-line-height-lg'),
    },
  },
  'button-end-content': {
    base: {
      color: 'inherit',
    },
  },
} as const satisfies ComponentStyleMap;
