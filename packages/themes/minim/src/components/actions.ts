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

export const minimActionComponents = {
  'button-group': {
    base: {
      borderRadius: minim('radius-element'),
    },
    // Child Buttons own their surfaces. A solid group background leaks through
    // transparent neutral buttons and joined seams as an unreadable black bar.
    'variant:neutral': {backgroundColor: minim('bg-transparent')},
    'variant:outline': {backgroundColor: minim('bg-neutral-subtle')},
    'variant:subtle': {backgroundColor: minim('bg-neutral')},
  },
  'toggle-button': {
    base: {
      gap: minim('spacing-200'),
      borderRadius: `var(--_button-radius, ${minim('radius-element')})`,
      ':active': {transform: 'none'},
    },
    'size:md': {
      '--minim-button-icon-size': minim('typography-line-height-md'),
      '--minim-button-icon-slot-height': minim('content-medium-box-size'),
      '--minim-button-label-font-size': minim('typography-font-size-md'),
      '--minim-button-label-line-height': minim('typography-line-height-md'),
      '--minim-button-label-inset-block': minim(
        'content-medium-text-inset-block',
      ),
      height:
        'calc(var(--minim-content-medium-box-size) + 2 * var(--minim-control-medium-padding-block))',
      paddingBlock: minim('control-medium-padding-block'),
      paddingInline: minim('spacing-300'),
    },
    'size:lg': {
      '--minim-button-icon-size': minim('typography-line-height-lg'),
      '--minim-button-icon-slot-height': minim('content-large-box-size'),
      '--minim-button-label-font-size': minim('typography-font-size-lg'),
      '--minim-button-label-line-height': minim('typography-line-height-lg'),
      '--minim-button-label-inset-block': minim(
        'content-large-text-inset-block',
      ),
      height:
        'calc(var(--minim-content-large-box-size) + 2 * var(--minim-control-large-padding-block))',
      paddingBlock: minim('control-large-padding-block'),
      paddingInline: minim('spacing-400'),
    },
    'content:icon-only': {paddingInline: '0'},
    'variant:default+isPressed:false': {
      color: minim('fg-neutral'),
      backgroundColor: minim('bg-neutral-subtle'),
      borderWidth: '0',
      boxShadow: `inset 0 0 0 1px ${minim('stroke-neutral')}`,
      ':focus-visible': focus('stroke-neutral-strong'),
    },
    'variant:default+isPressed:true': {
      color: minim('fg-on-surface'),
      backgroundColor: minim('bg-neutral-solid'),
      borderWidth: '0',
      boxShadow: 'none',
      ':focus-visible': focus('stroke-neutral-strong'),
    },
    'variant:ghost+isPressed:false': {
      color: minim('fg-neutral'),
      backgroundColor: minim('bg-transparent'),
      ':focus-visible': focus('stroke-neutral-strong'),
    },
    'variant:ghost+isPressed:true': {
      color: minim('fg-neutral'),
      backgroundColor: minim('bg-neutral'),
      ':focus-visible': focus('stroke-neutral-strong'),
    },
  },
  link: {
    base: {
      gap: minim('spacing-50'),
      fontSize: minim('typography-font-size-md'),
      lineHeight: minim('typography-line-height-md'),
      ':disabled': {color: minim('fg-disabled'), opacity: '0.5'},
    },
    'variant:neutral': {color: minim('fg-neutral')},
    'variant:muted': {color: minim('fg-muted')},
    'variant:primary': {color: minim('fg-primary')},
  },
  'link-label': {
    base: {
      fontSize: minim('typography-font-size-md'),
      lineHeight: minim('typography-line-height-md'),
    },
    'variant:neutral': {color: minim('fg-neutral')},
    'variant:muted': {color: minim('fg-muted')},
    'variant:primary': {color: minim('fg-primary')},
  },
  'link-external-icon': {
    base: {
      '--minim-icon-box-size': minim('typography-line-height-md'),
      display: 'inline-flex',
      width: minim('typography-line-height-md'),
      height: minim('typography-line-height-md'),
      fontSize: minim('typography-line-height-md'),
      lineHeight: minim('typography-line-height-md'),
      color: 'inherit',
    },
  },
} as const satisfies ComponentStyleMap;
