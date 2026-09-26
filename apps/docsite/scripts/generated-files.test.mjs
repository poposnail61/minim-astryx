import assert from 'node:assert/strict';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import {test} from 'node:test';
import {writeIfChanged, pruneGeneratedPreviews} from './generated-files.mjs';

test('unchanged content preserves mtime; new and changed content is written', t => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'minim-generated-'));
  t.after(() => fs.rmSync(directory, {recursive: true, force: true}));
  const file = path.join(directory, 'preview.tsx');
  assert.equal(writeIfChanged(file, 'first'), true);
  fs.utimesSync(file, 1000, 1000);
  const before = fs.statSync(file).mtimeMs;
  assert.equal(writeIfChanged(file, Buffer.from('first')), false);
  assert.equal(fs.statSync(file).mtimeMs, before);
  assert.equal(writeIfChanged(file, 'updated'), true);
  assert.equal(fs.readFileSync(file, 'utf8'), 'updated');
});

test('pruning removes only stale generated preview files', t => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'minim-generated-'));
  t.after(() => fs.rmSync(directory, {recursive: true, force: true}));
  for (const name of ['keep.tsx', 'stale.tsx', 'notes.md']) {
    fs.writeFileSync(path.join(directory, name), 'content');
  }
  fs.mkdirSync(path.join(directory, 'nested.tsx'));
  pruneGeneratedPreviews(directory, ['keep.tsx']);
  assert.deepEqual(fs.readdirSync(directory).sort(), [
    'keep.tsx',
    'nested.tsx',
    'notes.md',
  ]);
});
