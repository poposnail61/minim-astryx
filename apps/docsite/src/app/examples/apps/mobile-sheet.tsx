// Copyright (c) Meta Platforms, Inc. and affiliates.

'use client';

import type {ReactNode} from 'react';
import {BottomSheet} from '@astryxdesign/core/BottomSheet';
import {Stack} from '@astryxdesign/core/Stack';
import {SectionTitle, IconAction} from './mobile-shared';

/** Shared mobile form surface; fields remain the design system's own controls. */
export function MobileSheet({
  title,
  open,
  onClose,
  children,
}: {
  title: string;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <BottomSheet
      label={title}
      isOpen={open}
      onOpenChange={value => {
        if (!value) {
          onClose();
        }
      }}
      height="tall"
      purpose="form">
      <Stack padding={5} gap={5}>
        <SectionTitle
          title={title}
          action={
            <IconAction
              name="close"
              label={`${title} 닫기`}
              onClick={onClose}
            />
          }
        />
        {children}
      </Stack>
    </BottomSheet>
  );
}
