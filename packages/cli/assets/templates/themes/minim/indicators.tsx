// Copyright (c) Meta Platforms, Inc. and affiliates.

import type {CSSProperties, ReactNode} from 'react';
import type {
  IndicatorProps,
  IndicatorRegistry,
} from '@astryxdesign/core/Indicator';

declare module '@astryxdesign/core/Indicator' {
  interface IndicatorMap {
    'menu-checkbox': 'multiSelection';
    'menu-radio': 'singleSelection';
  }
}

const glyphStyle: CSSProperties = {
  fontFamily: 'var(--minim-font-family-icon, "Minim Symbol")',
  fontSize: 'var(--minim-icon-box-size, 1em)',
  fontVariantLigatures: 'common-ligatures',
  lineHeight: 1,
};

function marker(
  className: string,
  glyph: ':check:' | ':dot:',
  children: ReactNode,
) {
  return (
    children ?? (
      <span className={className} aria-hidden="true" style={glyphStyle}>
        {glyph}
      </span>
    )
  );
}

export function MinimMenuCheckboxIndicator({
  state,
  size = 'md',
  isDisabled = false,
  children,
  className,
  style,
  xstyle: _xstyle,
  ...rest
}: IndicatorProps<'multiSelection'>) {
  return (
    <span
      {...rest}
      aria-hidden="true"
      className={['astryx-checkbox-indicator', 'astryx-checkbox', className]
        .filter(Boolean)
        .join(' ')}
      data-size={size}
      data-checked={state === 'unchecked' ? undefined : state}
      data-disabled={isDisabled ? 'disabled' : undefined}
      style={style}>
      {state === 'checked'
        ? marker('astryx-checkbox-indicator-check', ':check:', children)
        : state === 'indeterminate'
          ? children
          : undefined}
    </span>
  );
}

export function MinimMenuRadioIndicator({
  state,
  size = 'md',
  isDisabled = false,
  children,
  className,
  style,
  xstyle: _xstyle,
  ...rest
}: IndicatorProps<'singleSelection'>) {
  return (
    <span
      {...rest}
      aria-hidden="true"
      className={['astryx-radio-indicator', 'astryx-radio', className]
        .filter(Boolean)
        .join(' ')}
      data-size={size}
      data-checked={state === 'checked' ? 'checked' : undefined}
      data-disabled={isDisabled ? 'disabled' : undefined}
      style={style}>
      {state === 'checked'
        ? marker('astryx-radio-indicator-dot', ':dot:', children)
        : undefined}
    </span>
  );
}

export const minimMenuIndicators = {
  'menu-checkbox': MinimMenuCheckboxIndicator,
  'menu-radio': MinimMenuRadioIndicator,
} as const satisfies IndicatorRegistry;
