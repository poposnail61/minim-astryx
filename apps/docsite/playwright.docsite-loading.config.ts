// Copyright (c) Meta Platforms, Inc. and affiliates.
import {defineConfig} from '@playwright/test';
export default defineConfig({
  testDir: './e2e',
  testMatch: 'minim-docsite-loading.spec.ts',
  workers: 1,
  timeout: 180000,
  expect: {timeout: 60000},
  use: {
    baseURL: 'http://localhost:5181',
    channel: 'chrome',
    screenshot: 'only-on-failure',
  },
  outputDir: '/tmp/minim-docsite-loading',
});
