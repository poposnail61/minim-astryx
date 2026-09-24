// Copyright (c) Meta Platforms, Inc. and affiliates.

import type {TokenColor} from '@astryxdesign/core/Token';

declare module '@astryxdesign/core/Token' {
  interface TokenColorMap {
    amber: true;
  }
}

export type MinimTokenColor = TokenColor;
