// Copyright (c) Meta Platforms, Inc. and affiliates.

'use client';

import {Calendar} from '@astryxdesign/core/Calendar';
import {Stack, VStack} from '@astryxdesign/core/Layout';
import {Text} from '@astryxdesign/core/Text';

export default function CalendarShowcase() {
  return (
    <Stack direction="horizontal" align="start" gap={6} wrap="wrap">
      {(['lg', 'md'] as const).map(size => (
        <VStack key={size} align="start" gap={3}>
          <Text>{size === 'lg' ? 'Large' : 'Medium'}</Text>
          <Calendar
            size={size}
            mode="range"
            defaultValue={{start: '2026-04-10', end: '2026-04-20'}}
          />
        </VStack>
      ))}
    </Stack>
  );
}
