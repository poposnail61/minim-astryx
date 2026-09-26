#!/usr/bin/env node
// Copyright (c) Meta Platforms, Inc. and affiliates.

import {spawn} from 'node:child_process';
import {createWriteStream} from 'node:fs';
import {mkdir, open, rm} from 'node:fs/promises';
import {createServer} from 'node:net';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import {setTimeout as delay} from 'node:timers/promises';

const root = fileURLToPath(new URL('..', import.meta.url));
const suites = new Set([
  'review-fixes',
  'menus',
  'sizes',
  'visual',
  'admin',
  'examples',
  'mobile-apps',
  'mobile-examples',
  'sample-apps',
]);
const requested = process.argv.slice(2);
if (requested.includes('--help')) {
  console.log(
    'pnpm qa [review-fixes menus sizes visual admin examples mobile-apps mobile-examples sample-apps]\nBuild once, then run selected suites sequentially on an isolated production server.',
  );
  process.exit(0);
}
for (const suite of requested) {
  if (!suites.has(suite)) throw new Error(`Unknown QA suite: ${suite}`);
}
const selected = requested.length ? [...new Set(requested)] : ['review-fixes'];
const dir = join(root, '.qa');
await mkdir(dir, {recursive: true});
const lockPath = join(dir, 'run.lock');
let lock;
try {
  lock = await open(lockPath, 'wx');
} catch (error) {
  if (error.code !== 'EEXIST') throw error;
  throw new Error(
    `Another QA run holds ${lockPath}. Check its recorded PID; remove the lock only if that process has stopped.`,
  );
}
await lock.writeFile(`${process.pid}\n`);
const children = new Set();
const env = {
  ...process.env,
  MINIM_QA: '1',
  DOCSITE_TARGET: 'canary',
  NEXT_TELEMETRY_DISABLED: '1',
};
delete env.NODE_ENV;

function launch(command, args, logName) {
  const log = createWriteStream(join(dir, logName));
  const child = spawn(command, args, {
    cwd: root,
    env,
    stdio: ['ignore', 'pipe', 'pipe'],
    detached: process.platform !== 'win32',
  });
  children.add(child);
  child.stdout.on('data', chunk => {
    process.stdout.write(chunk);
    log.write(chunk);
  });
  child.stderr.on('data', chunk => {
    process.stderr.write(chunk);
    log.write(chunk);
  });
  child.once('close', () => {
    children.delete(child);
    log.end();
  });
  return child;
}

function completed(child) {
  return new Promise((resolve, reject) => {
    child.once('error', reject);
    child.once('close', (code, signal) =>
      code === 0
        ? resolve()
        : reject(
            new Error(`QA command failed (${signal ?? code}); see ${dir}`),
          ),
    );
  });
}

async function freePort() {
  const probe = createServer();
  await new Promise((resolve, reject) => {
    probe.once('error', reject);
    probe.listen(0, '127.0.0.1', resolve);
  });
  const port = probe.address().port;
  await new Promise(resolve => probe.close(resolve));
  return port;
}

async function stop(child) {
  if (child.exitCode !== null || child.signalCode !== null) return;
  const closed = new Promise(resolve => child.once('close', resolve));
  const signal = value => {
    try {
      if (process.platform === 'win32') child.kill(value);
      else process.kill(-child.pid, value);
    } catch (error) {
      if (error.code !== 'ESRCH') throw error;
    }
  };
  signal('SIGTERM');
  const timer = setTimeout(() => signal('SIGKILL'), 5000);
  await closed;
  clearTimeout(timer);
}

let cleaning;
function cleanup() {
  return (cleaning ??= (async () => {
    for (const child of children) await stop(child);
    await lock.close();
    await rm(lockPath, {force: true});
  })());
}
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.once(signal, async () => {
    await cleanup();
    process.exit(130);
  });
}

try {
  console.log(
    'QA: generating docs and building .next-qa (development server untouched)',
  );
  await completed(launch('pnpm', ['generate'], 'generate.log'));
  await completed(
    launch(
      process.execPath,
      ['node_modules/next/dist/bin/next', 'build', '--webpack'],
      'build.log',
    ),
  );
  const port = await freePort();
  const url = `http://127.0.0.1:${port}`;
  const server = launch(
    process.execPath,
    [
      'node_modules/next/dist/bin/next',
      'start',
      '--hostname',
      '127.0.0.1',
      '--port',
      String(port),
    ],
    'server.log',
  );
  let serverError;
  server.once('error', error => {
    serverError = error;
  });
  let ready = false;
  for (let attempt = 0; attempt < 60; attempt++) {
    if (serverError) throw serverError;
    if (server.exitCode !== null)
      throw new Error('QA server exited before readiness');
    try {
      const response = await fetch(`${url}/components/OverflowList`, {
        signal: AbortSignal.timeout(5000),
      });
      await response.arrayBuffer();
      if (response.ok) {
        ready = true;
        break;
      }
    } catch {}
    await delay(500);
  }
  if (!ready)
    throw new Error('QA server did not become ready; see .qa/server.log');
  env.MINIM_DOCSITE_URL = url;
  env.MINIM_QA_BASE_URL = url;
  env.MINIM_QA_OUTPUT = join(dir, 'results');
  console.log(`QA: production server ready at ${url}`);
  for (const suite of selected) {
    env.MINIM_QA_OUTPUT = join(dir, 'results', suite);
    await completed(
      launch(
        'pnpm',
        [
          'exec',
          'playwright',
          'test',
          '--config',
          `playwright.${suite}.config.ts`,
          '--workers',
          '1',
        ],
        `${suite}.log`,
      ),
    );
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  await cleanup();
}
