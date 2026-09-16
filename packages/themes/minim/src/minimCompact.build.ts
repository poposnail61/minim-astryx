// Copyright (c) Meta Platforms, Inc. and affiliates.

import {defineTheme} from '@astryxdesign/core/theme';
// @ts-expect-error Build adapters run after tsup creates these private modules.
import {minimIconRegistry} from '../dist/icons.mjs';
// @ts-expect-error Build adapters run after tsup creates these private modules.
import {minimMenuIndicators} from '../dist/indicators.mjs';
import {minimTheme} from './minim.build';
// @ts-expect-error Build adapters run after tsup creates these private modules.
import {
  minimCompactTheme as runtimeMinimCompactTheme,
  minimComponents,
} from '../dist/source.mjs';

export const minimCompactTheme = defineTheme({
  name: 'minim-compact',
  extends: minimTheme,
  typography: runtimeMinimCompactTheme.typography,
  localTokens: runtimeMinimCompactTheme.localTokens,
  tokens: runtimeMinimCompactTheme.tokens,
  icons: minimIconRegistry,
  indicators: minimMenuIndicators,
  components: minimComponents,
});

export default minimCompactTheme;
