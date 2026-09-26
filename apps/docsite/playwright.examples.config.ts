// Copyright (c) Meta Platforms, Inc. and affiliates.

import {defineConfig} from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  testMatch: 'minim-examples.spec.ts',
  timeout: 120_000,
  expect: {timeout: 15_000},
  workers: 1,
  use: {
    baseURL: process.env.MINIM_DOCSITE_URL ?? 'http://localhost:5181',
    channel: 'chrome',
    colorScheme: 'light',
    trace: 'retain-on-failure',
  },
  outputDir: process.env.MINIM_QA_OUTPUT ?? '/tmp/minim-examples/results',
  projects: [
    {name: 'desktop', use: {viewport: {width: 1440, height: 1000}}},
    {name: 'mobile', use: {viewport: {width: 390, height: 844}}},
  ],
});
