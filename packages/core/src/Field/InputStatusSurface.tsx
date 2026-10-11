// Copyright (c) Meta Platforms, Inc. and affiliates.

'use client';

/**
 * @file InputStatusSurface.tsx
 * @input Uses React context, FieldStatus, and shared input geometry tokens
 * @output Internal input/status composition and its message ownership context
 * @position Shared by Field and standalone InputSurface; keeps one status box,
 *   announcement, and attached overlap around the control.
 */

import {createContext, type ReactNode} from 'react';
import * as stylex from '@stylexjs/stylex';
import {FieldStatus, type FieldStatusVariant} from '../FieldStatus/FieldStatus';
import {sizeVars} from '../theme/tokens.stylex';
import {mergeProps} from '../utils/mergeProps';
import {themeProps} from '../utils/themeProps';
import type {InputStatus} from './types';

export const InputStatusOwnerContext = createContext(false);
InputStatusOwnerContext.displayName = 'InputStatusOwnerContext';

const styles = stylex.create({
  inputStatusWrapper: {
    display: 'flex',
    flexDirection: 'column',
    isolation: 'isolate',
    // Extend the background behind the lower half of the fixed-height control.
    '--_field-status-overlap': {
      default: `calc(${sizeVars['--size-element-md']} / 2)`,
      ':has(> [data-size="sm"])': `calc(${sizeVars['--size-element-sm']} / 2)`,
      ':has(> [data-size="lg"])': `calc(${sizeVars['--size-element-lg']} / 2)`,
    },
  },
  attachedStatusLayer: {
    position: 'relative',
    zIndex: -1,
  },
});

interface InputStatusSurfaceProps {
  children: ReactNode;
  status?: InputStatus;
  messageID?: string;
  statusVariant?: FieldStatusVariant;
  /** Horizontal-label layouts keep their description/control in one grid cell. */
  hasWrapper?: boolean;
}

export function InputStatusSurface({
  children,
  status,
  messageID,
  statusVariant = 'attached',
  hasWrapper = statusVariant === 'attached',
}: InputStatusSurfaceProps) {
  const statusNode =
    status?.message && statusVariant !== 'tooltip' ? (
      <FieldStatus
        type={status.type}
        message={status.message}
        id={messageID}
        variant={statusVariant}
        xstyle={
          statusVariant === 'attached' ? styles.attachedStatusLayer : undefined
        }
      />
    ) : null;

  return (
    <InputStatusOwnerContext value={status != null}>
      {hasWrapper ? (
        <div
          {...mergeProps(
            themeProps('field-input-status', {
              status: status?.type ?? null,
              variant: statusVariant,
              message: status?.message ? 'visible' : null,
            }),
            stylex.props(styles.inputStatusWrapper),
          )}>
          {children}
          {statusNode}
        </div>
      ) : (
        <>
          {children}
          {statusNode}
        </>
      )}
    </InputStatusOwnerContext>
  );
}
