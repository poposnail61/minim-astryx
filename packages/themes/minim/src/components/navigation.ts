// Copyright (c) Meta Platforms, Inc. and affiliates.

import type {ComponentStyleMap} from '@astryxdesign/core/theme';

const token = (name: string) => `var(--minim-${name})`;
const control = (size: 'medium' | 'large' | 'xlarge', type: 'md' | 'lg') => ({
  '--minim-icon-box-size': token(`typography-line-height-${type}`),
  height: `calc(${token(`content-${size === 'medium' ? 'medium' : 'large'}-box-size`)} + 2 * ${token(`control-${size}-padding-block`)})`,
  paddingBlock: token(`control-${size}-padding-block`),
  paddingInline: token(`control-${size}-padding-inline`),
  fontSize: token(`typography-font-size-${type}`),
  lineHeight: token(`typography-line-height-${type}`),
});
const row = (size: 'medium' | 'large') => ({
  '--minim-icon-box-size': token(
    `typography-line-height-${size === 'medium' ? 'md' : 'lg'}`,
  ),
  height: `calc(${token(`content-${size}-box-size`)} + 2 * ${token(`row-${size}-padding-block`)})`,
  fontSize: token(`typography-font-size-${size === 'medium' ? 'md' : 'lg'}`),
  lineHeight: token(
    `typography-line-height-${size === 'medium' ? 'md' : 'lg'}`,
  ),
  gap: token(`row-${size}-gap`),
  paddingInline: token('spacing-300'),
});

export const minimNavigationComponents = {
  'top-nav-menu': {base: {paddingInline: token('spacing-300')}},
  'top-nav-mega-menu-item': {base: {paddingInline: token('spacing-300')}},
  'breadcrumb-item': {
    base: {paddingBlock: token('spacing-50'), gap: token('spacing-100')},
  },
  breadcrumbs: {base: {gap: token('spacing-200')}},
  pagination: {base: {gap: token('spacing-400')}},
  'side-nav-item': {
    'size:sm': row('medium'),
    'size:md': row('medium'),
    'size:lg': row('large'),
    'size:sm+collapsed:true': {width: row('medium').height, paddingInline: '0'},
    'size:md+collapsed:true': {width: row('medium').height, paddingInline: '0'},
    'size:lg+collapsed:true': {width: row('large').height, paddingInline: '0'},
  },
  'side-nav-heading': {
    base: {gap: token('spacing-200'), paddingInline: token('spacing-300')},
  },
  'tab-strip': {base: {gap: token('spacing-50')}},
  tab: {
    base: {gap: token('spacing-100')},
    'size:sm': control('medium', 'md'),
    'size:md': control('medium', 'md'),
    'size:lg': control('large', 'lg'),
  },
  'tab-hover': {base: {height: '100%'}},
  'tab-icon': {
    'size:sm': {
      width: token('typography-line-height-md'),
      height: token('typography-line-height-md'),
    },
    'size:md': {
      width: token('typography-line-height-md'),
      height: token('typography-line-height-md'),
    },
    'size:lg': {
      width: token('typography-line-height-lg'),
      height: token('typography-line-height-lg'),
    },
  },
  'top-nav-item': {
    'size:sm': {
      ...control('medium', 'md'),
      paddingInline: token('spacing-300'),
    },
    'size:md': {
      ...control('medium', 'md'),
      paddingInline: token('spacing-300'),
    },
    'size:lg': {...control('large', 'lg'), paddingInline: token('spacing-300')},
    'size:sm+isIconOnly:true': {
      width: control('medium', 'md').height,
      paddingInline: token('control-medium-padding-block'),
    },
    'size:md+isIconOnly:true': {
      width: control('medium', 'md').height,
      paddingInline: token('control-medium-padding-block'),
    },
    'size:lg+isIconOnly:true': {
      width: control('large', 'lg').height,
      paddingInline: token('control-large-padding-block'),
    },
  },
} as const satisfies ComponentStyleMap;
