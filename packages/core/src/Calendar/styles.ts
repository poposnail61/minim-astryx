// Copyright (c) Meta Platforms, Inc. and affiliates.

/**
 * @file styles.ts
 * @input Uses stylex, theme tokens
 * @output Exports calendar styles (structural) and theme styles (customizable)
 * @position Shared styles; used by Calendar
 *
 * Style Organization:
 * - *Styles objects: Structural/layout styles (spacing, sizing, positioning)
 * - *Theme objects: Themeable styles (colors, borders) that can be overridden
 *
 * SYNC: When modified, update this header
 */

import * as stylex from '@stylexjs/stylex';
import {
  colorVars,
  spacingVars,
  sizeVars,
  radiusVars,
  durationVars,
  easeVars,
  fontWeightVars,
  typeScaleVars,
} from '../theme/tokens.stylex';

// =============================================================================
// Calendar Container Styles
// =============================================================================

export const calendarStyles = stylex.create({
  calendar: {
    display: 'inline-block',
    padding: spacingVars['--spacing-3'],
    minWidth: '220px',
    '--_calendar-cell-size': `var(--calendar-cell-size, ${sizeVars['--size-element-md']})`,
    '--_calendar-day-size': sizeVars['--size-element-sm'],
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacingVars['--spacing-2'],
    gap: spacingVars['--spacing-2'],
  },
  monthYearLabel: {
    flex: 1,
    textAlign: 'center',
    fontWeight: fontWeightVars['--font-weight-semibold'],
    fontSize: `var(--calendar-month-font-size, ${typeScaleVars['--text-label-size']})`,
    lineHeight: 'var(--calendar-month-line-height, normal)',
    color: colorVars['--color-text-primary'],
  },
  monthsContainer: {
    display: 'flex',
    // Wraps rather than overflowing: two months side by side need ~488px, so
    // an unwrapped row scrolls the document sideways below that and puts the
    // next-month button off-viewport (WCAG 1.4.10). Above 488px nothing moves.
    flexWrap: 'wrap',
    gap: spacingVars['--spacing-4'],
  },
  /**
   * Wrapper for the month nav chevrons. RTL mirroring is applied by
   * composing the shared `rtlStyles.mirror` transform onto this wrapper
   * at the call site (see Calendar.tsx).
   */
  navIcon: {
    display: 'inline-flex',
  },
});

// =============================================================================
// Month Grid Styles
// =============================================================================

export const monthGridStyles = stylex.create({
  monthGrid: {
    flex: '1 1 0',
  },
  dayName: {
    width: 'var(--_calendar-cell-size)',
    // Restores the small gap the standalone header used to have below it.
    height: `var(--calendar-weekday-height, calc(var(--_calendar-cell-size) + ${spacingVars['--spacing-1']}))`,
    paddingBottom: `var(--calendar-weekday-padding-bottom, ${spacingVars['--spacing-1']})`,
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: typeScaleVars['--text-supporting-size'],
    fontWeight: fontWeightVars['--font-weight-normal'],
    color: colorVars['--color-text-secondary'],
  },
  weekNumberHeader: {
    width: 'var(--_calendar-cell-size)',
  },
  daysGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    rowGap: 'var(--calendar-row-gap, 0px)',
  },
  daysGridWithNumbers: {
    gridTemplateColumns: 'auto repeat(7, 1fr)',
  },
  weekNumber: {
    width: 'var(--_calendar-cell-size)',
    height: 'var(--_calendar-cell-size)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: typeScaleVars['--text-supporting-size'],
    color: colorVars['--color-text-secondary'],
  },
  weekRow: {
    display: 'contents',
  },
});

// =============================================================================
// Day Cell Styles - Structural (layout, sizing, positioning)
// =============================================================================

// Padding-based themes keep the range band and hit area aligned with the day.
// Other themes retain their existing 2px inset.
const BAND_INSET = 'var(--calendar-cell-padding, 2px)';
const HIT_BLEED = 'calc(-1 * var(--calendar-cell-padding, 2px))';

export const dayCellStyles = stylex.create({
  // Cell container
  cell: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 'var(--_calendar-cell-size)',
    boxSizing: 'border-box',
    padding: 'var(--calendar-cell-padding, 0px)',
    isolation: 'isolate',
  },

  // Range background - structural positioning
  rangeBg: {
    position: 'absolute',
    top: BAND_INSET,
    bottom: BAND_INSET,
    insetInlineStart: 0,
    insetInlineEnd: 0,
  },
  rangeBgRadiusStart: {
    insetInlineStart: BAND_INSET,
    borderStartStartRadius: radiusVars['--radius-full'],
    borderEndStartRadius: radiusVars['--radius-full'],
  },
  rangeBgRadiusEnd: {
    insetInlineEnd: BAND_INSET,
    borderStartEndRadius: radiusVars['--radius-full'],
    borderEndEndRadius: radiusVars['--radius-full'],
  },
  rangeInsetStart: {
    insetInlineStart: BAND_INSET,
  },
  rangeInsetEnd: {
    insetInlineEnd: BAND_INSET,
  },

  // Preview background - structural positioning
  previewBg: {
    position: 'absolute',
    top: BAND_INSET,
    bottom: BAND_INSET,
    insetInlineStart: 0,
    insetInlineEnd: 0,
  },
  previewBgRadiusStart: {
    insetInlineStart: BAND_INSET,
    borderStartStartRadius: radiusVars['--radius-full'],
    borderEndStartRadius: radiusVars['--radius-full'],
  },
  previewBgRadiusEnd: {
    insetInlineEnd: BAND_INSET,
    borderStartEndRadius: radiusVars['--radius-full'],
    borderEndEndRadius: radiusVars['--radius-full'],
  },
  previewStart: {
    insetInlineStart: BAND_INSET,
    borderStartStartRadius: radiusVars['--radius-full'],
    borderEndStartRadius: radiusVars['--radius-full'],
  },
  previewEnd: {
    insetInlineEnd: BAND_INSET,
    borderStartEndRadius: radiusVars['--radius-full'],
    borderEndEndRadius: radiusVars['--radius-full'],
  },

  // Day button - structural
  day: {
    width: 'var(--_calendar-day-size)',
    height: 'var(--_calendar-day-size)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radiusVars['--radius-full'],
    borderWidth: 0,
    borderStyle: 'none',
    cursor: {
      default: 'pointer',
      ':is(:disabled,[aria-disabled="true"])': 'default',
    },
    fontFamily: 'inherit',
    fontSize: typeScaleVars['--text-body-size'],
    padding: 0,
    position: 'relative',
    zIndex: 1,
    transitionProperty: {
      default: 'background-color, color',
      '@media (prefers-reduced-motion: reduce)': 'none',
    },
    transitionDuration: durationVars['--duration-fast'],
    transitionTimingFunction: easeVars['--ease-standard'],
    // Expand hit target so adjacent days meet with no gap
    '::before': {
      content: '""',
      position: 'absolute',
      top: HIT_BLEED,
      insetInlineEnd: HIT_BLEED,
      bottom: HIT_BLEED,
      insetInlineStart: HIT_BLEED,
    },
  },

  // State modifiers - structural only
  dayOutside: {
    opacity: 0.5,
  },
  dayToday: {},
  dayTodayInRange: {},
  daySelected: {},
  dayDisabled: {
    cursor: 'default',
  },
});

// =============================================================================
// Day Cell Theme - Colors and visual appearance (customizable)
// =============================================================================

export const dayCellTheme = stylex.create({
  // Range background color
  rangeBg: {
    backgroundColor: `var(--_calendar-range-background, ${colorVars['--color-accent-muted']})`,
  },

  // Preview background (muted overlay)
  previewBg: {
    backgroundColor: colorVars['--color-overlay-hover'],
  },

  // Day button - default state
  day: {
    color: colorVars['--color-text-primary'],
    backgroundColor: 'transparent',
  },

  // Outside days (adjacent months)
  dayOutside: {
    color: colorVars['--color-text-secondary'],
  },

  // Today indicator
  dayToday: {
    boxShadow: `inset 0 0 0 1px ${colorVars['--color-border-emphasized']}`,
  },

  // Today when inside a selected range
  dayTodayInRange: {
    boxShadow: `inset 0 0 0 1px ${colorVars['--color-text-primary']}`,
  },

  // Selected state (single selection or range endpoints)
  daySelected: {
    // Forced colors (Windows High Contrast) strips the accent fill, which
    // leaves the selected date looking exactly like every other day.
    // Highlight/HighlightText is the platform convention for a selected
    // control (WCAG 1.4.11), and `forced-color-adjust: none` is required
    // because this is a <button>: the UA otherwise keeps the native
    // ButtonFace surface and ignores the authored fill, the same trap
    // ToggleButton documents.
    forcedColorAdjust: 'none',
    backgroundColor: {
      default: colorVars['--color-accent'],
      '@media (forced-colors: active)': 'Highlight',
    },
    color: {
      default: colorVars['--color-on-accent'],
      '@media (forced-colors: active)': 'HighlightText',
    },
  },

  // Disabled state
  dayDisabled: {
    opacity: 0.3,
    backgroundImage: {
      default: 'none',
      ':hover:where(:not(:disabled,[aria-disabled="true"]))': {
        '@media (hover: hover)': 'none',
      },
    },
  },
});
