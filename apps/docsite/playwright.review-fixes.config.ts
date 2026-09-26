// Copyright (c) Meta Platforms, Inc. and affiliates.

import {defineConfig} from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  testMatch: 'minim-review-fixes.spec.ts',
  workers: 1,
  timeout: 120000,
  expect: {timeout: 30000},
  use: {
    baseURL: process.env.MINIM_DOCSITE_URL ?? 'http://localhost:5181',
    channel: 'chrome',
    viewport: {width: 1440, height: 1000},
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  outputDir: process.env.MINIM_QA_OUTPUT ?? '/tmp/minim-review-fixes-results',
});
