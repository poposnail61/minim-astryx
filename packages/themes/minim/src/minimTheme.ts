// Copyright (c) Meta Platforms, Inc. and affiliates.

import {defineTheme, type TokenValue} from '@astryxdesign/core/theme';
import {minimActionComponents} from './components/actions';
import {minimAdvancedComponents} from './components/advanced';
import {minimBadgeTokenComponents} from './components/badge-token';
import {minimButtonComponents} from './components/button';
import {minimContentComponents} from './components/content';
import {minimIconComponents} from './components/icon';
import {minimInputComponents} from './components/input';
import {minimMenuSpinnerComponents} from './components/menu-spinner';
import {minimSelectionComponents} from './components/selection';
import {minimSurfaceComponents} from './components/surfaces';
import {minimNavigationComponents} from './components/navigation';
import {minimCollectionComponents} from './components/collections';
import {minimIconRegistry} from './icons';
import {minimMenuIndicators} from './indicators';
import {minimBaseTokens, minimCompactTokens} from './minimTokens.generated';

const minim = (name: string) => `var(--minim-${name})`;

const typographySizes = [
  '6xl',
  '5xl',
  '4xl',
  '3xl',
  '2xl',
  'xl',
  'lg',
  'md',
  'sm',
  'xs',
] as const;

type GeneratedTokenMap = Record<string, TokenValue>;

function parsePositiveRem(
  value: TokenValue | undefined,
  token: string,
): number {
  if (typeof value !== 'string') {
    throw new TypeError(`${token} must be a rem string`);
  }
  const match = /^(?:0|[1-9]\d*)(?:\.\d+)?rem$/.exec(value);
  if (match == null) {
    throw new TypeError(`${token} must be a positive finite rem value`);
  }
  const parsed = Number.parseFloat(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new RangeError(`${token} must be greater than zero`);
  }
  return parsed;
}

/**
 * Derives unitless Astryx line-height ratios from Minim's generated rem tokens.
 * These are code-owned compatibility tokens, not variables exported by Figma.
 */
export function deriveMinimLeadingTokens(tokens: GeneratedTokenMap) {
  return Object.fromEntries(
    typographySizes.map(size => {
      const sizeToken = `--minim-typography-font-size-${size}`;
      const lineHeightToken = `--minim-typography-line-height-${size}`;
      const fontSize = parsePositiveRem(tokens[sizeToken], sizeToken);
      const lineHeight = parsePositiveRem(
        tokens[lineHeightToken],
        lineHeightToken,
      );
      const ratio = lineHeight / fontSize;
      if (!Number.isFinite(ratio) || ratio <= 0) {
        throw new RangeError(
          `--minim-leading-${size} must be finite and positive`,
        );
      }
      return [`--minim-leading-${size}`, ratio.toPrecision(15)];
    }),
  ) as Record<`--minim-leading-${(typeof typographySizes)[number]}`, string>;
}

const minimBaseLocalTokens = {
  ...minimBaseTokens,
  ...deriveMinimLeadingTokens(minimBaseTokens),
};

const minimCompactLocalTokens = {
  ...minimCompactTokens,
  ...deriveMinimLeadingTokens(minimCompactTokens),
};

export const minimComponents = {
  ...minimAdvancedComponents,
  ...minimButtonComponents,
  ...minimActionComponents,
  ...minimBadgeTokenComponents,
  ...minimContentComponents,
  ...minimInputComponents,
  ...minimIconComponents,
  ...minimSelectionComponents,
  ...minimSurfaceComponents,
  ...minimMenuSpinnerComponents,
  ...minimNavigationComponents,
  ...minimCollectionComponents,
};

/** Explicit Astryx-to-Minim role mappings, exported for contract QA. */
export const minimGlobalTokenMappings = {
  '--color-accent': minim('bg-primary-solid'),
  '--color-accent-muted': minim('bg-primary'),
  '--color-on-accent': minim('fg-on-surface'),
  '--color-neutral': minim('bg-neutral'),
  '--color-background-surface': minim('bg-layer'),
  '--color-background-card': minim('bg-layer'),
  '--color-background-popover': minim('bg-layer'),
  '--color-background-body': minim('bg-layer-base'),
  '--color-background-muted': minim('bg-neutral'),
  '--color-background-inverted': minim('bg-neutral-solid'),
  '--color-overlay': minim('bg-layer-overlay'),
  '--color-overlay-hover': minim('bg-overlay-hover'),
  '--color-overlay-pressed': minim('bg-overlay-pressed'),
  '--color-text-primary': minim('fg-neutral'),
  '--color-text-secondary': minim('fg-muted'),
  '--color-text-disabled': minim('fg-disabled'),
  '--color-text-accent': minim('fg-primary'),
  '--color-icon-primary': minim('fg-neutral'),
  '--color-icon-secondary': minim('fg-muted'),
  '--color-icon-disabled': minim('fg-disabled'),
  '--color-icon-accent': minim('fg-primary'),
  '--color-on-dark': minim('fg-on-surface'),
  '--color-on-light': minim('fg-neutral'),
  '--color-success': minim('fg-primary'),
  '--color-success-muted': minim('bg-primary'),
  '--color-on-success': minim('fg-on-surface'),
  '--color-error': minim('fg-critical'),
  '--color-error-muted': minim('bg-critical'),
  '--color-on-error': minim('fg-on-surface'),
  '--color-warning': minim('fg-warning'),
  '--color-warning-muted': minim('bg-warning'),
  '--color-on-warning': minim('fg-neutral'),
  '--color-border': minim('stroke-neutral'),
  '--color-border-emphasized': minim('stroke-neutral-strong'),
  '--color-background-blue': minim('bg-primary'),
  '--color-border-blue': minim('stroke-primary'),
  '--color-icon-blue': minim('fg-primary'),
  '--color-text-blue': minim('fg-primary'),
  '--color-background-green': minim('bg-secondary'),
  '--color-border-green': minim('stroke-secondary'),
  '--color-icon-green': minim('fg-secondary'),
  '--color-text-green': minim('fg-secondary'),
  '--color-background-red': minim('bg-critical'),
  '--color-border-red': minim('stroke-critical'),
  '--color-icon-red': minim('fg-critical'),
  '--color-text-red': minim('fg-critical'),
  '--color-background-gray': minim('bg-neutral'),
  '--color-border-gray': minim('stroke-neutral'),
  '--color-icon-gray': minim('fg-neutral'),
  '--color-text-gray': minim('fg-neutral'),
  '--color-background-cyan': minim('bg-cyan'),
  '--color-border-cyan': minim('fg-cyan'),
  '--color-icon-cyan': minim('fg-cyan'),
  '--color-text-cyan': minim('fg-cyan'),
  '--color-background-orange': minim('bg-orange'),
  '--color-border-orange': minim('fg-orange'),
  '--color-icon-orange': minim('fg-orange'),
  '--color-text-orange': minim('fg-orange'),
  '--color-background-pink': minim('bg-pink'),
  '--color-border-pink': minim('fg-pink'),
  '--color-icon-pink': minim('fg-pink'),
  '--color-text-pink': minim('fg-pink'),
  '--color-background-purple': minim('bg-purple'),
  '--color-border-purple': minim('fg-purple'),
  '--color-icon-purple': minim('fg-purple'),
  '--color-text-purple': minim('fg-purple'),
  '--color-background-teal': minim('bg-teal'),
  '--color-border-teal': minim('fg-teal'),
  '--color-icon-teal': minim('fg-teal'),
  '--color-text-teal': minim('fg-teal'),
  '--color-background-yellow': minim('bg-yellow'),
  '--color-border-yellow': minim('fg-yellow'),
  '--color-icon-yellow': minim('fg-yellow'),
  '--color-text-yellow': minim('fg-yellow'),
} as const satisfies Record<string, TokenValue>;

/** Exact Astryx spacing roles backed by Minim's generated spacing scale. */
export const minimGlobalSpacingMappings = {
  '--spacing-0': minim('spacing-0'),
  '--spacing-0-5': minim('spacing-50'),
  '--spacing-1': minim('spacing-100'),
  '--spacing-1-5': minim('spacing-150'),
  '--spacing-2': minim('spacing-200'),
  '--spacing-3': minim('spacing-300'),
  '--spacing-4': minim('spacing-400'),
  '--spacing-5': minim('spacing-500'),
  '--spacing-8': minim('spacing-800'),
  '--spacing-12': minim('spacing-1200'),
} as const satisfies Record<string, TokenValue>;

const foundationTokenMappings = {
  ...minimGlobalTokenMappings,
  ...minimGlobalSpacingMappings,
  '--font-weight-normal': minim('typography-font-weight-regular'),
  '--font-weight-medium': minim('typography-font-weight-medium'),
  '--font-weight-semibold': minim('typography-font-weight-medium'),
  '--font-weight-bold': minim('typography-font-weight-bold'),
  '--text-body-size': minim('typography-font-size-md'),
  '--text-body-weight': 'var(--font-weight-normal)',
  '--text-body-leading': minim('leading-md'),
  '--text-label-size': minim('typography-font-size-md'),
  '--text-label-weight': 'var(--font-weight-medium)',
  '--text-label-leading': minim('leading-md'),
  '--text-large-size': minim('typography-font-size-lg'),
  '--text-large-weight': 'var(--font-weight-normal)',
  '--text-large-leading': minim('leading-lg'),
  '--text-supporting-size': minim('typography-font-size-sm'),
  '--text-supporting-weight': 'var(--font-weight-normal)',
  '--text-supporting-leading': minim('leading-sm'),
  '--text-code-size': minim('typography-font-size-md'),
  '--text-code-weight': 'var(--font-weight-normal)',
  '--text-code-leading': minim('leading-md'),
  '--text-display-1-size': minim('typography-font-size-6xl'),
  '--text-display-1-weight': 'var(--font-weight-bold)',
  '--text-display-1-leading': minim('leading-6xl'),
  '--text-display-2-size': minim('typography-font-size-5xl'),
  '--text-display-2-weight': 'var(--font-weight-bold)',
  '--text-display-2-leading': minim('leading-5xl'),
  '--text-display-3-size': minim('typography-font-size-4xl'),
  '--text-display-3-weight': 'var(--font-weight-bold)',
  '--text-display-3-leading': minim('leading-4xl'),
  '--text-heading-1-size': minim('typography-font-size-3xl'),
  '--text-heading-1-weight': 'var(--font-weight-bold)',
  '--text-heading-1-leading': minim('leading-3xl'),
  '--text-heading-2-size': minim('typography-font-size-2xl'),
  '--text-heading-2-weight': 'var(--font-weight-bold)',
  '--text-heading-2-leading': minim('leading-2xl'),
  '--text-heading-3-size': minim('typography-font-size-xl'),
  '--text-heading-3-weight': 'var(--font-weight-bold)',
  '--text-heading-3-leading': minim('leading-xl'),
  '--text-heading-4-size': minim('typography-font-size-lg'),
  '--text-heading-4-weight': 'var(--font-weight-bold)',
  '--text-heading-4-leading': minim('leading-lg'),
  '--text-heading-5-size': minim('typography-font-size-md'),
  '--text-heading-5-weight': 'var(--font-weight-bold)',
  '--text-heading-5-leading': minim('leading-md'),
  '--text-heading-6-size': minim('typography-font-size-sm'),
  '--text-heading-6-weight': 'var(--font-weight-bold)',
  '--text-heading-6-leading': minim('leading-sm'),
  '--radius-inner': minim('radius-inner'),
  '--radius-element': minim('radius-element'),
  '--radius-container': minim('radius-container'),
  '--radius-page': minim('radius-overlay'),
  '--radius-full': minim('radius-full'),
  '--size-element-md': 'var(--minim-component-medium-height)',
  '--size-element-lg': 'var(--minim-component-large-height)',
  '--shadow-low': minim('elevation-low'),
  '--shadow-med': minim('elevation-medium'),
  '--shadow-high': minim('elevation-high'),
} as const satisfies Record<string, TokenValue>;

const typography = {
  body: {
    family: 'MinimBaseVF',
    fallbacks:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  },
  heading: {
    family: 'MinimBaseVF',
    fallbacks:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  },
  code: {
    family: 'JetBrains Mono',
    fallbacks:
      '"SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },
} as const;

export const minimUnmappedGlobalRoles = [
  '--color-background-error-inverted',
  '--color-skeleton',
  '--color-track',
  '--color-shadow',
  '--color-tint-hover',
  '--radius-chat',
  '--size-element-sm',
  '--spacing-6',
  '--spacing-7',
  '--spacing-9',
  '--spacing-10',
  '--spacing-11',
] as const;

export const minimTheme = defineTheme({
  name: 'minim',
  typography,
  localTokens: minimBaseLocalTokens,
  tokens: foundationTokenMappings,
  icons: minimIconRegistry,
  indicators: minimMenuIndicators,
  components: minimComponents,
});

export const minimCompactTheme = defineTheme({
  name: 'minim-compact',
  extends: minimTheme,
  typography,
  localTokens: minimCompactLocalTokens,
  tokens: foundationTokenMappings,
  icons: minimIconRegistry,
  indicators: minimMenuIndicators,
  components: minimComponents,
});

export default minimTheme;
