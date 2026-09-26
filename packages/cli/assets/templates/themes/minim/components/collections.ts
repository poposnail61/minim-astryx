// Copyright (c) Meta Platforms, Inc. and affiliates.

import type {ComponentStyleMap} from '@astryxdesign/core/theme';

const token = (name: string) => `var(--minim-${name})`;

export const minimCollectionComponents = {
  'list-item': {
    'size:md': {
      paddingBlock: token('component-medium-padding-block'),
      paddingInline: token('spacing-200'),
      gap: token('spacing-200'),
      '--item-content-padding-block': token(
        'component-medium-padding-block-slot',
      ),
      '--item-content-gap': token('spacing-50'),
      '--item-label-font-size': token('typography-font-size-md'),
      '--item-label-line-height': token('typography-line-height-md'),
      '--text-supporting-size': token('typography-font-size-xs'),
      '--text-supporting-leading': token('typography-line-height-xs'),
    },
    'size:lg': {
      paddingBlock: token('component-large-padding-block'),
      paddingInline: token('spacing-200'),
      gap: token('spacing-200'),
      '--item-content-padding-block': token(
        'component-large-padding-block-slot',
      ),
      '--item-content-gap': token('spacing-50'),
      '--item-label-font-size': token('typography-font-size-lg'),
      '--item-label-line-height': token('typography-line-height-lg'),
      '--text-supporting-size': token('typography-font-size-sm'),
      '--text-supporting-leading': token('typography-line-height-sm'),
    },
  },
  item: {
    base: {gap: token('spacing-200'), borderRadius: token('radius-element')},
  },
  'table-cell': {
    base: {
      fontSize: token('typography-font-size-lg'),
      lineHeight: token('typography-line-height-lg'),
      borderColor: token('stroke-neutral-subtle'),
    },
  },
  'table-header-cell': {
    base: {
      fontSize: token('typography-font-size-md'),
      lineHeight: token('typography-line-height-md'),
      borderColor: token('stroke-neutral'),
      backgroundColor: token('bg-layer'),
    },
  },
  'tree-list': {
    base: {
      '--tree-list-indent': token('spacing-400'),
      '--tree-list-row-gap': token('spacing-50'),
    },
  },
  'tree-list-item': {
    base: {
      gap: token('spacing-200'),
      paddingInlineEnd: token('spacing-200'),
    },
    'density:balanced': {
      paddingBlock: token('component-medium-padding-block'),
    },
  },
  'tree-list-item-label': {
    base: {
      display: 'flex',
      alignItems: 'center',
      minHeight:
        'calc(var(--minim-typography-line-height-md) + 2 * var(--minim-component-medium-padding-block-slot))',
      fontSize: token('typography-font-size-md'),
      lineHeight: token('typography-line-height-md'),
    },
  },
} as const satisfies ComponentStyleMap;
