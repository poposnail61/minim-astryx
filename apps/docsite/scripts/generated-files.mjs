import * as fs from 'node:fs';
import * as path from 'node:path';

// Preserve modification times so unchanged generated content does not trigger HMR.
export function writeIfChanged(filename, content) {
  const bytes = Buffer.isBuffer(content) ? content : Buffer.from(content);
  try {
    if (fs.readFileSync(filename).equals(bytes)) return false;
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  fs.writeFileSync(filename, bytes);
  return true;
}

export function pruneGeneratedPreviews(directory, expectedFiles) {
  const expected = new Set(expectedFiles);
  for (const entry of fs.readdirSync(directory, {withFileTypes: true})) {
    if (
      entry.isFile() &&
      entry.name.endsWith('.tsx') &&
      !expected.has(entry.name)
    ) {
      fs.unlinkSync(path.join(directory, entry.name));
    }
  }
}
