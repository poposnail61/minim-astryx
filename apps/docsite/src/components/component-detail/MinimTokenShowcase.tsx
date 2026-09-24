// Copyright (c) Meta Platforms, Inc. and affiliates.

'use client';

import {Token} from '@astryxdesign/core/Token';
import {Stack} from '@astryxdesign/core/Layout';
import type {MinimTokenColor} from '@astryxdesign/theme-minim';

/** Minim palette examples using the actual Token and registered icon. */
export default function MinimTokenShowcase() {
  const colors: MinimTokenColor[] = ['orange', 'amber', 'yellow'];
  return (
    <Stack direction="vertical" gap={3}>
      {(['sm', 'md'] as const).map(size => (
        <Stack key={size} direction="horizontal" gap={2}>
          {colors.map(color => (
            <Token key={color} label={color} color={color} size={size} />
          ))}
        </Stack>
      ))}
      <Stack direction="horizontal" gap={2}>
        <Token label="amber" color="amber" onRemove={() => {}} />
        <Token label="amber" color="amber" isDisabled onRemove={() => {}} />
      </Stack>
    </Stack>
  );
}
