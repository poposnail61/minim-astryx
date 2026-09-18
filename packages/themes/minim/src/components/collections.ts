// Copyright (c) Meta Platforms, Inc. and affiliates.

import type {ComponentStyleMap} from '@astryxdesign/core/theme';

const token = (name: string) => `var(--minim-${name})`;

export const minimCollectionComponents = {
  'list-item': {
    'density:compact': {
      paddingBlock: token('row-medium-padding-block'),
      paddingInline: token('row-medium-padding-inline'),
      gap: token('row-medium-gap'),
    },
    'density:balanced': {
      paddingBlock: token('row-large-padding-block'),
      paddingInline: token('row-large-padding-inline'),
      gap: token('row-large-gap'),
    },
    'density:spacious': {
      paddingBlock: token('row-large-padding-block'),
      paddingInline: token('row-large-padding-inline'),
      gap: token('row-large-gap'),
    },
  },
  item: {
    base: {gap: token('row-medium-gap'), borderRadius: token('radius-element')},
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
      gap: token('row-large-gap'),
      paddingInlineEnd: token('row-large-padding-inline'),
    },
  },
} as const satisfies ComponentStyleMap;
