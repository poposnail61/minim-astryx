// Copyright (c) Meta Platforms, Inc. and affiliates.

/**
 * @file Bundles each theme's source, optional icons and palette-authoring
 * artifacts, and a `manifest.json` into
 * `packages/cli/assets/templates/themes/` so `astryx theme add` can scaffold a
 * complete, reproducible theme without the package installed. Run from the repo
 * root; commit the output so the published CLI carries it.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const require = createRequire(
  path.join(REPO_ROOT, 'packages', 'cli', 'package.json'),
);
const {parse} = require('@babel/parser');
const THEMES_SRC_ROOT = path.join(REPO_ROOT, 'packages', 'themes');
const CLI_THEMES_OUT = path.join(
  REPO_ROOT,
  'packages',
  'cli',
  'assets',
  'templates',
  'themes',
);

// Flagged in the manifest so `theme list` can mark it "(maintained)".
const MAINTAINED_SLUG = 'neutral';

function toIdentifier(slug) {
  return slug.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

/** Title-case a slug for display ("y2k" → "Y2K" is special-cased). */
function toDisplayName(slug) {
  if (slug === 'y2k') return 'Y2K';
  return slug.charAt(0).toUpperCase() + slug.slice(1);
}

function readJSON(file) {
  return JSON.parse(fs.readFileSync(file, 'utf-8'));
}

const SOURCE_EXTENSIONS = ['', '.ts', '.tsx', '.mjs', '.js', '.json', '.css'];

function isWithin(file, directory) {
  const relative = path.relative(directory, file);
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}

function resolveLocalImport(importer, specifier) {
  const base = path.resolve(path.dirname(importer), specifier);
  for (const extension of SOURCE_EXTENSIONS) {
    const candidate = `${base}${extension}`;
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      return candidate;
    }
  }
  for (const extension of SOURCE_EXTENSIONS.slice(1)) {
    const candidate = path.join(base, `index${extension}`);
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      return candidate;
    }
  }
  return null;
}

export function localImportSpecifiers(source) {
  const ast = parse(source, {
    sourceType: 'unambiguous',
    plugins: ['typescript', 'jsx', 'decorators-legacy', 'importAttributes'],
  });
  return ast.program.body.flatMap(node => {
    if (
      node.type !== 'ImportDeclaration' &&
      node.type !== 'ExportNamedDeclaration' &&
      node.type !== 'ExportAllDeclaration'
    ) {
      return [];
    }
    const literal = node.source;
    if (
      literal == null ||
      typeof literal.value !== 'string' ||
      !literal.value.startsWith('.') ||
      literal.start == null ||
      literal.end == null
    ) {
      return [];
    }
    return [{specifier: literal.value, start: literal.start, end: literal.end}];
  });
}

export function rewriteSpecifierLiterals(source, replacements) {
  let rewritten = source;
  for (const replacement of [...replacements].sort((a, b) => b.start - a.start)) {
    const quote = source[replacement.start];
    rewritten =
      rewritten.slice(0, replacement.start) +
      `${quote}${replacement.specifier}${quote}` +
      rewritten.slice(replacement.end);
  }
  return rewritten;
}

function outputPathForSource(file, packageDir, srcDir) {
  return path.relative(isWithin(file, srcDir) ? srcDir : packageDir, file);
}

/** Collect a theme entry's complete local dependency graph. */
function collectThemeFiles(themeFile, packageDir, srcDir) {
  const pending = [themeFile];
  const records = new Map();

  while (pending.length > 0) {
    const source = pending.shift();
    if (records.has(source)) continue;
    if (!isWithin(source, packageDir)) {
      throw new Error(
        `Theme dependency escapes its package: ${path.relative(REPO_ROOT, source)}`,
      );
    }

    const output = outputPathForSource(source, packageDir, srcDir);
    const dependencies = [];
    if (/\.(?:ts|tsx|mjs|js)$/.test(source)) {
      const contents = fs.readFileSync(source, 'utf-8');
      for (const imported of localImportSpecifiers(contents)) {
        const dependency = resolveLocalImport(source, imported.specifier);
        if (dependency == null) {
          throw new Error(
            `Cannot resolve ${imported.specifier} imported by ${path.relative(REPO_ROOT, source)}`,
          );
        }
        dependencies.push({...imported, source: dependency});
        pending.push(dependency);
      }
    }
    records.set(source, {source, output, dependencies});
  }

  return records;
}

function copyThemeRecord(record, records, outDir) {
  let contents = fs.readFileSync(record.source, 'utf-8');
  const replacements = [];
  for (const dependency of record.dependencies) {
    if (isWithin(dependency.source, path.dirname(record.source))) continue;
    const target = records.get(dependency.source);
    let specifier = path.relative(path.dirname(record.output), target.output);
    if (!specifier.startsWith('.')) specifier = `./${specifier}`;
    replacements.push({...dependency, specifier});
  }
  contents = rewriteSpecifierLiterals(contents, replacements);
  const destination = path.join(outDir, record.output);
  fs.mkdirSync(path.dirname(destination), {recursive: true});
  fs.writeFileSync(destination, contents);
}

function listThemeSlugs() {
  if (!fs.existsSync(THEMES_SRC_ROOT)) return [];
  return fs
    .readdirSync(THEMES_SRC_ROOT, {withFileTypes: true})
    .filter(e => e.isDirectory())
    .map(e => e.name)
    .filter(slug => {
      // A theme dir must have a package.json + a src/<slug>Theme.ts to qualify.
      const pkg = path.join(THEMES_SRC_ROOT, slug, 'package.json');
      const themeFile = path.join(
        THEMES_SRC_ROOT,
        slug,
        'src',
        `${toIdentifier(slug)}Theme.ts`,
      );
      if (!fs.existsSync(pkg) || !fs.existsSync(themeFile)) return false;
      // A PRIVATE theme package is not a theme a user can pick — it is a test
      // fixture that happens to live here (packages/themes/probe). These
      // assets ship inside the CLI tarball, so without this the fixture
      // becomes a selectable theme in `astryx theme add`.
      return readJSON(pkg).private !== true;
    })
    .sort();
}

function main() {
  const slugs = listThemeSlugs();
  if (slugs.length === 0) {
    console.warn('generate-cli-themes: no theme packages found — skipping.');
    return;
  }

  // Reset the output dir so removed themes don't linger.
  fs.rmSync(CLI_THEMES_OUT, {recursive: true, force: true});
  fs.mkdirSync(CLI_THEMES_OUT, {recursive: true});

  const entries = [];

  for (const slug of slugs) {
    const id = toIdentifier(slug);
    const srcDir = path.join(THEMES_SRC_ROOT, slug, 'src');
    const packageDir = path.join(THEMES_SRC_ROOT, slug);
    const themeFileName = `${id}Theme.ts`;
    const themeFile = path.join(srcDir, themeFileName);

    const outDir = path.join(CLI_THEMES_OUT, slug);
    fs.mkdirSync(outDir, {recursive: true});

    const records = collectThemeFiles(themeFile, packageDir, srcDir);
    const files = [...records.values()].map(record => record.output);
    for (const record of records.values()) {
      copyThemeRecord(record, records, outDir);
    }

    // Keep optional theme-owned authoring artifacts with the template. A
    // palette-backed theme must remain reproducible after `theme add`, not
    // merely compile because a generated palette file happened to be copied.
    const optionalFiles = [
      {source: path.join(srcDir, 'fonts.css'), output: 'fonts.css'},
      {
        source: path.join(srcDir, `${id}Palettes.ts`),
        output: `${id}Palettes.ts`,
      },
      {
        source: path.join(srcDir, `${id}Palettes.generated.ts`),
        output: `${id}Palettes.generated.ts`,
      },
      {
        source: path.join(srcDir, `${id}PaletteRefs.generated.ts`),
        output: `${id}PaletteRefs.generated.ts`,
      },
      {
        source: path.join(srcDir, `${id}Palettes.generated.receipt.json`),
        output: `${id}Palettes.generated.receipt.json`,
      },
      {
        source: path.join(THEMES_SRC_ROOT, slug, 'palette.config.json'),
        output: 'palette.config.json',
      },
    ];
    for (const file of optionalFiles) {
      if (!fs.existsSync(file.source)) continue;
      if (files.includes(file.output)) continue;
      files.push(file.output);
      fs.mkdirSync(path.dirname(path.join(outDir, file.output)), {
        recursive: true,
      });
      fs.copyFileSync(file.source, path.join(outDir, file.output));
    }

    files.sort((a, b) =>
      a === themeFileName ? -1 : b === themeFileName ? 1 : a.localeCompare(b),
    );

    // Pull the human description from the package.json (falls back to empty).
    let description = '';
    try {
      const pkg = readJSON(path.join(THEMES_SRC_ROOT, slug, 'package.json'));
      description = pkg.description || '';
    } catch {
      /* best-effort */
    }

    entries.push({
      slug,
      displayName: toDisplayName(slug),
      description,
      maintained: slug === MAINTAINED_SLUG,
      entry: themeFileName,
      exportName: `${id}Theme`,
      files,
    });

    console.log(`  bundled theme "${slug}" (${files.length} files)`);
  }

  const manifest = {
    version: 1,
    generatedBy: 'scripts/generate-cli-themes.mjs',
    themes: entries,
  };
  fs.writeFileSync(
    path.join(CLI_THEMES_OUT, 'manifest.json'),
    JSON.stringify(manifest, null, 2) + '\n',
  );

  console.log(
    `generate-cli-themes: wrote ${entries.length} themes + manifest to ${path.relative(REPO_ROOT, CLI_THEMES_OUT)}`,
  );
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
