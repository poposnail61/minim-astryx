// Copyright (c) Meta Platforms, Inc. and affiliates.

/**
 * @file inputControlStyles.stylex.ts
 * @input Uses StyleX and body typography/color tokens
 * @output Internal inputControlStyles for native single-line input elements
 * @position Shared text control appearance for TextInput, NumberInput, DateInput,
 *   and TimeInput; callers own value parsing, accessibility, and invalid styling.
 */

import * as stylex from '@stylexjs/stylex';
import {colorVars, typographyVars, typeScaleVars} from '../theme/tokens.stylex';

export const inputControlStyles = stylex.create({
  input: {
    display: 'block',
    flex: 1,
    minWidth: 0,
    borderWidth: 0,
    borderStyle: 'none',
    padding: 0,
    fontFamily: typographyVars['--font-family-body'],
    fontSize: {
      default: typeScaleVars['--text-body-size'],
      '@media (pointer: coarse)': `max(1rem, ${typeScaleVars['--text-body-size']})`,
    },
    lineHeight: typeScaleVars['--text-body-leading'],
    color: colorVars['--color-text-primary'],
    backgroundColor: 'transparent',
    outline: 'none',
    '::placeholder': {
      color: colorVars['--color-text-secondary'],
    },
  },
  inputDisabled: {
    cursor: 'default',
  },
});
