// Copyright (c) Meta Platforms, Inc. and affiliates.

import {defineConfig} from '@playwright/test';
export default defineConfig({
  testDir: './e2e',
  testMatch: 'admin-apps.spec.ts',
  timeout: 120000,
  expect: {timeout: 15000},
  workers: 1,
  use: {
    baseURL: process.env.MINIM_DOCSITE_URL ?? 'http://localhost:5181',
    channel: 'chrome',
    actionTimeout: 20000,
    trace: 'retain-on-failure',
  },
  outputDir: process.env.MINIM_QA_OUTPUT ?? '/tmp/minim-admin/results',
  projects: [
    {name: 'desktop', use: {viewport: {width: 1440, height: 1000}}},
    {name: 'laptop', use: {viewport: {width: 1280, height: 900}}},
  ],
});
