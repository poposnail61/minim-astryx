// Copyright (c) Meta Platforms, Inc. and affiliates.

import {defineConfig} from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  testMatch: 'minim-visual-qa.spec.ts',
  timeout: 180_000,
  expect: {timeout: 15_000},
  workers: 1,
  fullyParallel: false,
  reporter: [['list']],
  use: {
    baseURL: process.env.MINIM_DOCSITE_URL ?? 'http://localhost:5180',
    browserName: 'chromium',
    channel: 'chrome',
    colorScheme: 'light',
    trace: 'retain-on-failure',
  },
  outputDir:
    process.env.MINIM_QA_OUTPUT ?? '/tmp/minim-visual-qa/playwright-results',
  projects: [
    {name: 'desktop', use: {viewport: {width: 1440, height: 1000}}},
    {
      name: 'mobile',
      use: {viewport: {width: 390, height: 844}, isMobile: true},
    },
  ],
});
