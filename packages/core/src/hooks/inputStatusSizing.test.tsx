// Copyright (c) Meta Platforms, Inc. and affiliates.

import React from 'react';
import {render} from '@testing-library/react';
import {describe, expect, it} from 'vitest';
import {TextInput} from '../TextInput';
import {TextArea} from '../TextArea';
import {TimeInput} from '../TimeInput';
import {DateInput} from '../DateInput';
import {DateRangeInput} from '../DateRangeInput';

describe('optional input status icon sizing', () => {
  for (const size of ['md', 'lg'] as const) {
    for (const type of ['error', 'warning', 'success'] as const) {
      for (const statusVariant of ['attached', 'tooltip'] as const) {
        it(`${size} ${type} ${statusVariant} follows the field size`, () => {
          const props = {
            size,
            status: {type, message: 'Status'},
            statusVariant,
          };
          const {container} = render(
            <>
              <TextInput label="Text" value="" {...props} />
              <TextArea label="Notes" value="" {...props} />
              <TimeInput label="Time" nativePicker="never" {...props} />
              <DateInput label="Date" nativePicker="never" {...props} />
              <DateInput label="Native date" nativePicker="always" {...props} />
              <DateRangeInput
                label="Range"
                value={null}
                onChange={() => {}}
                {...props}
              />
            </>,
          );
          const icons = container.querySelectorAll('.astryx-input-status-icon');
          expect(icons).toHaveLength(6);
          for (const icon of icons) {
            expect(icon).toHaveAttribute('data-size', size);
            expect(icon).toHaveAttribute('data-status', type);
          }
        });
      }
    }
  }
});
