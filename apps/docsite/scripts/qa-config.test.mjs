// Copyright (c) Meta Platforms, Inc. and affiliates.

import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';

const root = fileURLToPath(new URL('..', import.meta.url));

test('QA output and type checking are isolated from the dev build', async () => {
  const previous = process.env.MINIM_QA;
  try {
    delete process.env.MINIM_QA;
    const {default: dev} = await import('../next.config.mjs?test=dev');
    process.env.MINIM_QA = '1';
    const {default: qa} = await import('../next.config.mjs?test=qa');
    assert.equal(dev.distDir, '.next');
    assert.equal(qa.distDir, '.next-qa');
    assert.equal(qa.typescript.tsconfigPath, 'tsconfig.qa.json');
    assert.equal(dev.outputFileTracingRoot, resolve(root, '../..'));
    assert.equal(qa.outputFileTracingRoot, dev.outputFileTracingRoot);
  } finally {
    if (previous === undefined) delete process.env.MINIM_QA;
    else process.env.MINIM_QA = previous;
  }
});

test('every supported QA suite accepts an isolated server and artifact directory', () => {
  for (const suite of [
    'review-fixes',
    'menus',
    'sizes',
    'visual',
    'admin',
    'examples',
    'mobile-apps',
    'mobile-examples',
    'sample-apps',
  ]) {
    const source = readFileSync(
      resolve(root, `playwright.${suite}.config.ts`),
      'utf8',
    );
    assert.match(source, /process\.env\.MINIM_DOCSITE_URL/);
    assert.match(source, /process\.env\.MINIM_QA_OUTPUT/);
  }
});

test('help and invalid suite arguments do not start a build', () => {
  const help = spawnSync(process.execPath, ['scripts/run-qa.mjs', '--help'], {
    cwd: root,
    encoding: 'utf8',
  });
  assert.equal(help.status, 0);
  assert.match(help.stdout, /Build once/);
  const invalid = spawnSync(
    process.execPath,
    ['scripts/run-qa.mjs', 'not-a-suite'],
    {cwd: root, encoding: 'utf8'},
  );
  assert.equal(invalid.status, 1);
  assert.match(invalid.stderr, /Unknown QA suite/);
  assert.doesNotMatch(invalid.stdout, /generating docs/);
});
