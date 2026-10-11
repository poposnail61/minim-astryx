// Copyright (c) Meta Platforms, Inc. and affiliates.

'use client';

/**
 * @file InputSurface.tsx
 * @input Uses React DOM props/context, InputStatusSurface, and shared input styles
 * @output Internal InputSurface component; not part of the public Field API
 * @position Owns the existing input wrapper DOM and shared state styling.
 *   Includes optional status messages; Field/group composition keeps one owner.
 *   Callers retain labels, editing behavior, icons, refs, and theme targets.
 */

import {use, type ComponentPropsWithRef} from 'react';
import * as stylex from '@stylexjs/stylex';
import type {StyleXStyles} from '@stylexjs/stylex';
import {groupStyles} from '../InputGroup/groupStyles';
import {mergeProps} from '../utils/mergeProps';
import type {ThemeProps} from '../utils/themeProps';
import type {InputStatus} from './types';
import type {FieldStatusVariant} from '../FieldStatus/FieldStatus';
import {
  InputStatusSurface,
  InputStatusOwnerContext,
} from './InputStatusSurface';
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
  /** Hide supporting text while retaining status paint and on-control icons. */
  hasStatusMessage?: boolean;
  /** Match the control's aria-describedby reference when used without Field. */
  statusMessageID?: string;
  statusVariant?: FieldStatusVariant;
  xstyle?: StyleXStyles;
}

export function InputSurface({
  theming,
  controlStyles,
  isDisabled,
  isGrouped,
  status,
  hasStatusMessage = true,
  statusMessageID,
  statusVariant = 'attached',
  xstyle,
  className,
  style,
  ...props
}: InputSurfaceProps) {
  const hasStatusOwner = use(InputStatusOwnerContext);
  const control = (
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

  if (
    hasStatusOwner ||
    isGrouped ||
    !hasStatusMessage ||
    !status?.message ||
    statusVariant === 'tooltip'
  ) {
    return control;
  }

  return (
    <InputStatusSurface
      status={status}
      messageID={statusMessageID}
      statusVariant={statusVariant}>
      {control}
    </InputStatusSurface>
  );
}
