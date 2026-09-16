// Copyright (c) Meta Platforms, Inc. and affiliates.

import {defineTheme} from '@astryxdesign/core/theme';
// @ts-expect-error Build adapters run after tsup creates these private modules.
import {minimIconRegistry} from '../dist/icons.mjs';
// @ts-expect-error Build adapters run after tsup creates these private modules.
import {minimMenuIndicators} from '../dist/indicators.mjs';
// @ts-expect-error Build adapters run after tsup creates these private modules.
import {
  minimComponents,
  minimTheme as runtimeMinimTheme,
} from '../dist/source.mjs';

export const minimTheme = defineTheme({
  name: 'minim',
  typography: runtimeMinimTheme.typography,
  localTokens: runtimeMinimTheme.localTokens,
  tokens: runtimeMinimTheme.tokens,
  icons: minimIconRegistry,
  indicators: minimMenuIndicators,
  components: minimComponents,
});

export default minimTheme;
