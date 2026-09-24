// Copyright (c) Meta Platforms, Inc. and affiliates.

import {defineConfig} from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  testMatch: 'minim-sizes.spec.ts',
  workers: 1,
  timeout: 60000,
  use: {baseURL: 'http://localhost:5181', channel: 'chrome'},
  outputDir: '/tmp/minim-sizes-results',
  projects: [
    {name: 'desktop', use: {viewport: {width: 1280, height: 1000}}},
    {name: 'mobile', use: {viewport: {width: 390, height: 844}}},
  ],
});
