// Copyright (c) Meta Platforms, Inc. and affiliates.

'use client';

import {useState} from 'react';
import {TextArea} from '@astryxdesign/core/TextArea';
import {Stack} from '@astryxdesign/core/Stack';

export default function TextAreaShowcase() {
  const [value, setValue] = useState('');
  return (
    <Stack width="100%" maxWidth={400}>
      <TextArea
        label="Description"
        value={value}
        onChange={setValue}
        placeholder="Enter a description..."
      />
    </Stack>
  );
}
