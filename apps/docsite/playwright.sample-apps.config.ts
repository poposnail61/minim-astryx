// Copyright (c) Meta Platforms, Inc. and affiliates.

import {defineConfig} from '@playwright/test';
export default defineConfig({
  testDir: './e2e',
  testMatch: 'sample-apps.spec.ts',
  timeout: 120000,
  expect: {timeout: 15000},
  workers: 1,
  use: {
    baseURL: 'http://localhost:5181',
    channel: 'chrome',
    colorScheme: 'light',
    trace: 'retain-on-failure',
  },
  outputDir: '/tmp/minim-sample-apps/results',
  projects: [
    {name: 'desktop', use: {viewport: {width: 1440, height: 1000}}},
    {name: 'mobile', use: {viewport: {width: 390, height: 844}}},
  ],
});
