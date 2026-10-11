// Copyright (c) Meta Platforms, Inc. and affiliates.

'use client';

/**
 * @file InputSurface.tsx
 * @input Uses React DOM props, StyleX, shared input styles, and InputGroup styles
 * @output Internal InputSurface component; not part of the public Field API
 * @position Owns the existing input wrapper DOM and shared state styling.
 *   Callers retain labels, editing behavior, icons, refs, and theme targets.
 */

import type {ComponentPropsWithRef} from 'react';
import * as stylex from '@stylexjs/stylex';
import type {StyleXStyles} from '@stylexjs/stylex';
import {groupStyles} from '../InputGroup/groupStyles';
import {mergeProps} from '../utils/mergeProps';
import type {ThemeProps} from '../utils/themeProps';
import type {InputStatus} from './types';
import {
  inputWrapperStyles,
  inputStatusBorderStyles,
  inputStatusHoverShadowStyles,
  inputStatusFocusWithinStyles,
} from './inputStyles.stylex';

interface InputSurfaceProps extends ComponentPropsWithRef<'div'> {
  theming: ThemeProps;
  controlStyles: StyleXStyles;
  isDisabled?: boolean;
  isGrouped?: boolean;
  status?: InputStatus;
  xstyle?: StyleXStyles;
}

export function InputSurface({
  theming,
  controlStyles,
  isDisabled,
  isGrouped,
  status,
  xstyle,
  className,
  style,
  ...props
}: InputSurfaceProps) {
  return (
    <div
      {...props}
      {...mergeProps(
        theming,
        stylex.props(
          inputWrapperStyles.base,
          controlStyles,
          isDisabled && inputWrapperStyles.disabled,
          status && inputStatusBorderStyles[status.type],
          status && !isDisabled && inputStatusHoverShadowStyles[status.type],
          status && inputStatusFocusWithinStyles[status.type],
          isGrouped && groupStyles.inGroup,
          xstyle,
        ),
        className,
        style,
      )}
    />
  );
}
