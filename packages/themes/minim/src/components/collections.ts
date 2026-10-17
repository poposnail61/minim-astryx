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
  table: {
    base: {'--table-selected-bg': token('bg-neutral')},
  },
  'table-cell': {
    base: {
      '--table-cell-padding-block': token('spacing-200'),
      '--table-cell-padding-inline': token('spacing-300'),
      '--table-content-gap': token('spacing-200'),
      '--checkbox-control-height': token('typography-line-height-lg'),
      fontSize: token('typography-font-size-lg'),
      lineHeight: token('typography-line-height-lg'),
      borderColor: token('stroke-neutral-subtle'),
    },
    'size:md': {
      '--checkbox-control-height': token('typography-line-height-md'),
      fontSize: token('typography-font-size-md'),
      lineHeight: token('typography-line-height-md'),
    },
  },
  'table-header-cell': {
    base: {
      '--table-cell-padding-block': token('spacing-200'),
      '--table-cell-padding-inline': token('spacing-300'),
      '--table-content-gap': token('spacing-200'),
      '--checkbox-control-height': token('typography-line-height-lg'),
      fontSize: token('typography-font-size-lg'),
      lineHeight: token('typography-line-height-lg'),
      borderColor: token('stroke-neutral'),
      backgroundColor: token('bg-layer'),
    },
    'size:md': {
      '--checkbox-control-height': token('typography-line-height-md'),
      fontSize: token('typography-font-size-md'),
      lineHeight: token('typography-line-height-md'),
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
    'disabled:disabled': {
      opacity: '1',
      color: token('fg-disabled'),
      '--color-text-primary': token('fg-disabled'),
      '--color-text-secondary': token('fg-disabled'),
      '--color-icon-primary': token('fg-disabled'),
      '--color-icon-secondary': token('fg-disabled'),
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
