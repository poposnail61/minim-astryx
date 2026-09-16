// Copyright (c) Meta Platforms, Inc. and affiliates.

import type {ComponentStyleMap} from '@astryxdesign/core/theme';

const minim = (name: string) => `var(--minim-${name})`;
const baseFontFamily = 'var(--minim-font-family-base)';
const codeFontFamily = 'var(--minim-font-family-code)';

const bodyMedium = {
  fontFamily: baseFontFamily,
  fontSize: minim('typography-font-size-md'),
  lineHeight: minim('typography-line-height-md'),
};

const supportingMedium = {
  fontFamily: baseFontFamily,
  fontSize: minim('typography-font-size-xs'),
  lineHeight: minim('typography-line-height-xs'),
};

const heading = (scale: '3xl' | '2xl' | 'xl' | 'lg') => ({
  fontFamily: baseFontFamily,
  fontSize: minim(`typography-font-size-${scale}`),
  lineHeight: minim(`typography-line-height-${scale}`),
  fontWeight: minim('typography-font-weight-bold'),
});

/** Content-family overrides verified against the resolved Minim source. */
export const minimContentComponents = {
  avatar: {
    base: {
      backgroundColor: minim('bg-layer-base'),
      borderRadius: minim('radius-full'),
    },
    'size:xsm': {width: '20px', height: '20px'},
    'size:sm': {width: '24px', height: '24px'},
    'size:md': {width: '36px', height: '36px'},
    'size:lg': {width: '48px', height: '48px'},
    'size:xl': {width: '128px', height: '128px'},
  },
  'avatar-fallback': {
    base: {color: minim('fg-primary'), fontFamily: baseFontFamily},
    // Fixed source exceptions: the Avatar initials scale has no equivalent
    // semantic typography tokens and must not density-shrink.
    'size:xsm': {fontSize: '8px', lineHeight: '8px'},
    'size:sm': {fontSize: '10px', lineHeight: '10px'},
    'size:md': {fontSize: '14px', lineHeight: '14px'},
    'size:lg': {fontSize: '19px', lineHeight: '19px'},
    'size:xl': {fontSize: '51px', lineHeight: '51px'},
  },
  'avatar-status-dot': {
    base: {
      borderColor: minim('bg-layer-base'),
      borderRadius: minim('radius-full'),
    },
    'sizeTier:small': {width: '10px', height: '10px'},
    'sizeTier:medium': {width: '20px', height: '20px'},
    'sizeTier:large': {width: '32px', height: '32px'},
    'variant:success': {backgroundColor: minim('fg-primary')},
    'variant:neutral': {backgroundColor: minim('fg-muted')},
    'variant:error': {backgroundColor: minim('fg-critical')},
  },
  citation: {
    base: {
      height: 'auto',
      paddingBlock: '0',
      paddingInline: minim('spacing-100'),
      borderRadius: minim('radius-full'),
      backgroundColor: minim('bg-layer-base'),
      borderWidth: '0',
      ...supportingMedium,
    },
  },
  'citation-label': {
    base: {
      minWidth: '0',
      paddingBlock: minim('content-supporting-medium-text-inset-block'),
      paddingInline: minim('content-supporting-medium-text-inset-inline'),
      ...supportingMedium,
    },
  },
  'citation-icon': {
    base: {
      '--minim-icon-box-size': minim('typography-line-height-xs'),
      width: minim('content-supporting-medium-icon-box-width'),
      height: minim('content-supporting-medium-box-size'),
      fontSize: minim('typography-line-height-xs'),
      lineHeight: minim('typography-line-height-xs'),
      borderWidth: '0',
      backgroundColor: 'transparent',
    },
  },
  code: {
    base: {
      fontFamily: codeFontFamily,
      backgroundColor: minim('bg-layer-base'),
      paddingBlock: '0',
      paddingInline: minim('spacing-100'),
      borderRadius: minim('radius-inner'),
    },
    'color:primary': {color: minim('fg-neutral')},
    'color:secondary': {color: minim('fg-muted')},
    'color:inherit': {color: 'inherit'},
  },
  'code-block': {
    base: {
      maxWidth: '100%',
      backgroundColor: minim('bg-layer-base'),
      borderColor: minim('stroke-neutral'),
      borderStyle: 'solid',
      borderWidth: '1px',
      borderRadius: minim('radius-element'),
    },
  },
  'code-block-header': {
    base: {
      paddingBlock: minim('spacing-200'),
      paddingInline: minim('spacing-400'),
      backgroundColor: minim('bg-layer-base'),
      borderColor: minim('stroke-neutral'),
    },
  },
  'code-block-title': {
    base: {
      fontFamily: codeFontFamily,
      color: minim('fg-muted'),
    },
    'size:md': {
      fontSize: minim('typography-font-size-md'),
      lineHeight: minim('typography-line-height-md'),
    },
    'size:sm': {
      fontSize: minim('typography-font-size-xs'),
      lineHeight: minim('typography-line-height-xs'),
    },
  },
  'code-block-code': {
    base: {fontFamily: codeFontFamily, color: minim('fg-neutral')},
    'size:md': {
      fontSize: minim('typography-font-size-md'),
      lineHeight: minim('typography-line-height-md'),
    },
    'size:sm': {
      fontSize: minim('typography-font-size-xs'),
      lineHeight: minim('typography-line-height-xs'),
    },
  },
  'code-block-copy-button': {base: {color: minim('fg-muted')}},
  'empty-state': {
    base: {
      gap: minim('spacing-400'),
      paddingBlock: minim('spacing-800'),
      // The source inset is an unbound fixed 24px value.
      paddingInline: '1.5rem',
      color: minim('fg-neutral'),
    },
    'variant:compact': {
      gap: minim('spacing-200'),
      paddingBlock: minim('spacing-400'),
      paddingInline: minim('spacing-400'),
    },
  },
  'empty-state-title': {
    // Default: heading/heading 1 (27/36). Compact: body medium (15/20).
    base: heading('3xl'),
    'variant:compact': {
      fontSize: minim('typography-font-size-md'),
      lineHeight: minim('typography-line-height-md'),
    },
  },
  'empty-state-description': {
    base: {...bodyMedium, color: minim('fg-muted')},
    'variant:compact': supportingMedium,
  },
  heading: {
    base: {fontFamily: baseFontFamily, color: minim('fg-neutral')},
    'level:1': heading('3xl'),
    'level:2': heading('2xl'),
    'level:3': heading('xl'),
    'level:4': heading('lg'),
  },
  text: {
    base: {fontFamily: baseFontFamily},
    'type:body': bodyMedium,
    'color:primary': {color: minim('fg-neutral')},
    'color:secondary': {color: minim('fg-muted')},
    'color:disabled': {color: minim('fg-disabled')},
    'color:accent': {color: minim('fg-primary')},
  },
  markdown: {base: {...bodyMedium, color: minim('fg-neutral')}},
  'markdown-heading': {
    'level:1': heading('3xl'),
    'level:2': heading('2xl'),
    'level:3': heading('xl'),
    'level:4': heading('lg'),
  },
  'markdown-paragraph': {base: bodyMedium},
  'markdown-list': {base: bodyMedium},
  'markdown-codeblock': {
    base: {
      fontFamily: codeFontFamily,
      fontSize: minim('typography-font-size-md'),
      lineHeight: minim('typography-line-height-md'),
    },
  },
  'markdown-blockquote': {
    base: {
      color: minim('fg-muted'),
      borderColor: minim('stroke-neutral-strong'),
      paddingInlineStart: minim('spacing-400'),
    },
  },
  thumbnail: {
    base: {
      width: '64px',
      height: '64px',
      borderRadius: minim('radius-element'),
      backgroundColor: minim('bg-neutral-subtle'),
      '--minim-icon-box-size': minim('typography-line-height-lg'),
    },
  },
  timestamp: {
    base: {
      fontFamily: baseFontFamily,
    },
    'typography:source-default': {
      fontSize: minim('typography-font-size-xs'),
      lineHeight: minim('typography-line-height-xs'),
    },
    'color:primary': {color: minim('fg-neutral')},
    'color:secondary': {color: minim('fg-muted')},
    'color:disabled': {color: minim('fg-disabled')},
    // Figma's `active` color is represented by core's existing `accent` prop.
    'color:accent': {color: minim('fg-primary')},
  },
  kbd: {base: {gap: minim('spacing-50')}},
  'kbd-key': {
    base: {
      minWidth: '20px',
      height: '20px',
      paddingInline: minim('spacing-100'),
      borderRadius: minim('radius-inner'),
      backgroundColor: minim('bg-readonly'),
      borderColor: minim('stroke-neutral'),
      color: minim('fg-muted'),
      fontFamily: baseFontFamily,
      fontSize: minim('typography-font-size-xs'),
      lineHeight: minim('typography-line-height-xs'),
      fontWeight: minim('typography-font-weight-medium'),
    },
  },
  blockquote: {
    base: {
      ...bodyMedium,
      color: minim('fg-muted'),
      borderInlineStartColor: minim('stroke-neutral-strong'),
      borderInlineStartWidth: minim('spacing-50'),
      paddingInlineStart: minim('spacing-400'),
    },
  },
} as const satisfies ComponentStyleMap;
