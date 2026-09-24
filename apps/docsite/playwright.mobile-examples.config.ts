// Copyright (c) Meta Platforms, Inc. and affiliates.

import {defineConfig} from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  testMatch: 'minim-mobile.spec.ts',
  timeout: 60000,
  expect: {timeout: 10000},
  workers: 1,
  use: {
    baseURL: 'http://localhost:5181',
    channel: 'chrome',
    isMobile: true,
    hasTouch: true,
    colorScheme: 'light',
    trace: 'retain-on-failure',
  },
  outputDir: '/tmp/minim-mobile/results',
  projects: [
    {name: 'mobile-390', use: {viewport: {width: 390, height: 844}}},
    {name: 'mobile-320', use: {viewport: {width: 320, height: 740}}},
  ],
});
