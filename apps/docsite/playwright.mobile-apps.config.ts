// Copyright (c) Meta Platforms, Inc. and affiliates.

import {defineConfig} from '@playwright/test';
export default defineConfig({
  testDir: './e2e',
  testMatch: 'mobile-apps.spec.ts',
  timeout: 180000,
  expect: {timeout: 15000},
  workers: 1,
  use: {
    baseURL: 'http://localhost:5181',
    channel: 'chrome',
    colorScheme: 'light',
    trace: 'retain-on-failure',
  },
  outputDir: '/tmp/minim-new-mobile/results',
  projects: [
    {name: 'mobile', use: {viewport: {width: 390, height: 844}}},
    {name: 'narrow', use: {viewport: {width: 360, height: 780}}},
  ],
});
