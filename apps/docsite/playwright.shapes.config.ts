// Copyright (c) Meta Platforms, Inc. and affiliates.
import {defineConfig} from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  testMatch: 'minim-shapes.spec.ts',
  workers: 1,
  timeout: 60000,
  expect: {timeout: 10000},
  use: {
    baseURL: process.env.MINIM_DOCSITE_URL ?? 'http://localhost:5181',
    channel: 'chrome',
    trace: 'retain-on-failure',
  },
  outputDir: '/tmp/minim-shapes/results',
  projects: [
    {name: 'desktop', use: {viewport: {width: 1280, height: 1000}}},
    {name: 'mobile', use: {viewport: {width: 390, height: 844}}},
  ],
});
