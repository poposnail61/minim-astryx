// Copyright (c) Meta Platforms, Inc. and affiliates.

/**
 * @file icons.tsx
 * @input Uses the verified Minim Symbol catalog and ReactNode icon registry contract
 * @output Exports minimIconRegistry and minimUnmappedIconNames
 * @position Theme-scoped icon configuration for the Minim theme
 */

import React, {type CSSProperties, type ReactNode} from 'react';
import type {IconName, NamespacedIconName} from '@astryxdesign/core/Icon';
import iconCatalog from '../assets/icon-catalog.json';

const wrapperStyle: CSSProperties = {
  alignItems: 'center',
  color: 'inherit',
  display: 'inline-flex',
  flex: '0 0 auto',
  height: '1em',
  justifyContent: 'center',
  lineHeight: 1,
  width: '1em',
};

// Verified font metrics: UPEM 864, hhea ascent 864, descent -288. The font's
// natural line box is therefore 1152/864 = 4/3 em. Scaling the glyph run to
// 3/4 em produces a 1em line box (15/20 and 16.5/22 in the Figma icon styles)
// while the outer wrapper remains the stable square Astryx icon slot.
const MINIM_SYMBOL_GLYPH_SCALE = 0.75;
const MINIM_SYMBOL_LINE_HEIGHT = 4 / 3;

const glyphStyle: CSSProperties = {
  color: 'inherit',
  direction: 'ltr',
  display: 'inline-block',
  fontFamily: '"Minim Symbol"',
  fontFeatureSettings: '"liga" 1',
  fontSize: `${MINIM_SYMBOL_GLYPH_SCALE}em`,
  fontStyle: 'normal',
  fontSynthesis: 'none',
  fontVariantLigatures: 'common-ligatures',
  fontWeight: 'inherit',
  letterSpacing: 0,
  lineHeight: MINIM_SYMBOL_LINE_HEIGHT,
  textTransform: 'none',
  unicodeBidi: 'isolate',
  whiteSpace: 'nowrap',
};

function minimGlyph(name: string): ReactNode {
  return (
    <span aria-hidden="true" data-minim-icon={name} style={wrapperStyle}>
      <span style={glyphStyle}>{`:${name}:`}</span>
    </span>
  );
}

const semanticGlyphNames = {
  close: 'close',
  chevronDown: 'chevron-down',
  chevronLeft: 'chevron-left',
  chevronRight: 'chevron-right',
  check: 'check',
  success: 'check-circle',
  error: 'close-circle',
  warning: 'warning-triangle',
  info: 'info-circle',
  calendar: 'calendar',
  clock: 'time',
  externalLink: 'open-window',
  menu: 'menu',
  moreHorizontal: 'more-horiz',
  search: 'search',
  arrowUp: 'arrow-up',
  arrowDown: 'arrow-down',
  copy: 'copy',
  stop: 'stop',
} as const satisfies Partial<Record<IconName, string>>;

const namespacedIcons = Object.fromEntries(
  iconCatalog.icons.map(({name}) => [`minim:${name}`, minimGlyph(name)]),
) as Record<NamespacedIconName, ReactNode>;

const semanticIcons = Object.fromEntries(
  Object.entries(semanticGlyphNames).map(([semanticName, glyphName]) => [
    semanticName,
    minimGlyph(glyphName),
  ]),
) as Partial<Record<IconName, ReactNode>>;

export const minimIconRegistry: Partial<
  Record<IconName | NamespacedIconName, ReactNode>
> = {
  ...namespacedIcons,
  ...semanticIcons,
  'token:remove': minimGlyph('close-mini'),
};

/** Semantic Astryx icons intentionally left to the inherited/default registry. */
export const minimUnmappedIconNames = [
  'chevronsLeft',
  'chevronsRight',
  'arrowsUpDown',
  'funnel',
  'eyeSlash',
  'viewColumns',
  'checkDouble',
  'wrench',
  'microphone',
] as const satisfies readonly IconName[];

export {semanticGlyphNames as minimSemanticGlyphNames};
