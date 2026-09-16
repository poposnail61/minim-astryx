// Copyright (c) Meta Platforms, Inc. and affiliates.

'use client';

import {Button} from '@astryxdesign/core/Button';
import {Stack} from '@astryxdesign/core/Layout';

export default function ButtonShowcase() {
  return (
    <Stack direction="horizontal" gap={3} vAlign="center" wrap="wrap">
      <Button label="Primary" variant="primary" />
      <Button label="Neutral" variant="neutral" />
      <Button label="Neutral subtle" variant="neutral-subtle" />
      <Button label="Critical subtle" variant="critical-subtle" />
      <Button label="Ghost" variant="ghost" />
      <Button label="Outline" variant="outline" />
      <Button label="Critical" variant="critical" />
    </Stack>
  );
}
