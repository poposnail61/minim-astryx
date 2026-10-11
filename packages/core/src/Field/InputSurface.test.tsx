// Copyright (c) Meta Platforms, Inc. and affiliates.

/**
 * @file InputSurface.test.tsx
 * @input Uses React Testing Library and the shared input surface
 * @output Status composition and accessibility regression evidence
 * @position Tests standalone status messages and Field/InputGroup ownership
 */

import {afterEach, describe, expect, it} from 'vitest';
import {render, screen} from '@testing-library/react';
import * as stylex from '@stylexjs/stylex';
import {InputSurface} from './InputSurface';
import {Field} from './Field';
import {themeProps} from '../utils/themeProps';
import {__resetLiveRegionsForTest} from '../hooks/useAnnounce';

const styles = stylex.create({control: {height: 44}});
const theming = themeProps('text-input', {size: 'lg'});

afterEach(() => __resetLiveRegionsForTest());

describe('InputSurface status composition', () => {
  it('renders and updates a standalone message described by the control', () => {
    const {rerender} = render(
      <InputSurface
        theming={theming}
        controlStyles={styles.control}
        status={{type: 'error', message: 'Must be positive'}}
        statusMessageID="amount-status">
        <input aria-label="Amount" aria-describedby="amount-status" />
      </InputSurface>,
    );
    expect(screen.getByRole('textbox')).toHaveAccessibleDescription(
      'Must be positive',
    );
    expect(screen.getByText('Must be positive')).toHaveAttribute(
      'data-type',
      'error',
    );

    rerender(
      <InputSurface
        theming={theming}
        controlStyles={styles.control}
        status={{type: 'success', message: 'On track'}}
        statusMessageID="amount-status">
        <input aria-label="Amount" aria-describedby="amount-status" />
      </InputSurface>,
    );
    expect(screen.getByRole('textbox')).toHaveAccessibleDescription('On track');
    expect(screen.queryByText('Must be positive')).not.toBeInTheDocument();
    expect(screen.getByText('On track')).toHaveAttribute(
      'data-type',
      'success',
    );
  });

  it('hides the message without reserving a status wrapper', () => {
    const {container} = render(
      <InputSurface
        theming={theming}
        controlStyles={styles.control}
        status={{type: 'warning', message: 'Unusual amount'}}
        hasStatusMessage={false}>
        <input aria-label="Amount" />
      </InputSurface>,
    );
    expect(screen.queryByText('Unusual amount')).not.toBeInTheDocument();
    expect(container.querySelector('.astryx-field-input-status')).toBeNull();
  });

  it.each(['detached', 'tooltip'] as const)(
    'supports %s placement',
    statusVariant => {
      render(
        <InputSurface
          theming={theming}
          controlStyles={styles.control}
          status={{type: 'warning', message: 'Unusual amount'}}
          statusVariant={statusVariant}>
          <input aria-label="Amount" />
        </InputSurface>,
      );
      if (statusVariant === 'tooltip') {
        expect(screen.queryByText('Unusual amount')).not.toBeInTheDocument();
      } else {
        expect(screen.getByText('Unusual amount')).toBeInTheDocument();
        expect(document.querySelector('.astryx-field-status')).toHaveAttribute(
          'data-variant',
          'detached',
        );
      }
    },
  );

  it('renders one message when Field owns the status', () => {
    const status = {type: 'error' as const, message: 'Must be positive'};
    render(
      <Field label="Amount" inputID="amount" status={status}>
        <InputSurface
          theming={theming}
          controlStyles={styles.control}
          status={status}>
          <input id="amount" aria-describedby="amount-status" />
        </InputSurface>
      </Field>,
    );
    expect(screen.getAllByText('Must be positive')).toHaveLength(1);
    expect(screen.getByRole('textbox')).toHaveAccessibleDescription(
      'Must be positive',
    );
    expect(
      document.querySelectorAll('.astryx-field-input-status'),
    ).toHaveLength(1);
  });

  it('leaves grouped messages with the group owner', () => {
    render(
      <InputSurface
        theming={theming}
        controlStyles={styles.control}
        status={{type: 'error', message: 'Child message'}}
        isGrouped>
        <input aria-label="Amount" />
      </InputSurface>,
    );
    expect(screen.queryByText('Child message')).not.toBeInTheDocument();
  });
});
