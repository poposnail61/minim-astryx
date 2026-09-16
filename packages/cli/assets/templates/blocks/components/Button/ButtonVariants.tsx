// Copyright (c) Meta Platforms, Inc. and affiliates.

'use client';

import {Button} from '@astryxdesign/core/Button';
import {Stack} from '@astryxdesign/core/Layout';
import {Text} from '@astryxdesign/core/Text';

const VARIANTS = [
  {variant: 'primary' as const, label: 'Primary'},
  {variant: 'neutral' as const, label: 'Neutral'},
  {variant: 'neutral-subtle' as const, label: 'Neutral subtle'},
  {variant: 'critical-subtle' as const, label: 'Critical subtle'},
  {variant: 'ghost' as const, label: 'Ghost'},
  {variant: 'outline' as const, label: 'Outline'},
  {variant: 'critical' as const, label: 'Critical'},
];

export default function ButtonVariants() {
  return (
    <Stack direction="vertical" gap={4}>
      <Stack direction="vertical" gap={1}>
        <Text type="supporting" color="secondary">
          Default
        </Text>
        <Stack direction="horizontal" gap={3} vAlign="center" wrap="wrap">
          {VARIANTS.map(({variant, label}) => (
            <Button key={variant} label={label} variant={variant} />
          ))}
        </Stack>
      </Stack>
      <Stack direction="vertical" gap={1}>
        <Text type="supporting" color="secondary">
          Disabled
        </Text>
        <Stack direction="horizontal" gap={3} vAlign="center" wrap="wrap">
          {VARIANTS.map(({variant, label}) => (
            <Button key={variant} label={label} variant={variant} isDisabled />
          ))}
        </Stack>
      </Stack>
      <Stack direction="vertical" gap={1}>
        <Text type="supporting" color="secondary">
          Loading
        </Text>
        <Stack direction="horizontal" gap={3} vAlign="center" wrap="wrap">
          {VARIANTS.map(({variant, label}) => (
            <Button key={variant} label={label} variant={variant} isLoading />
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
}
