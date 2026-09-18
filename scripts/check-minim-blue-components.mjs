// Copyright (c) Meta Platforms, Inc. and affiliates.

import {chromium} from 'playwright';
import {readFile, mkdir, writeFile} from 'node:fs/promises';

const scope = JSON.parse(
  await readFile(
    new URL(
      '../packages/themes/minim/figma/blue-components.json',
      import.meta.url,
    ),
    'utf8',
  ),
).scope;
const url = process.env.MINIM_QA_URL ?? 'http://127.0.0.1:5181';
const output = process.env.MINIM_QA_OUTPUT ?? '/tmp/minim-blue-qa';
await mkdir(output, {recursive: true});
const browser = await chromium.launch({channel: 'chrome', headless: true});
const page = await browser.newPage({viewport: {width: 1440, height: 1000}});
const results = [];
try {
  for (const {name} of scope) {
    const errors = [];
    const recordError = error => errors.push(error.message);
    page.on('pageerror', recordError);
    await page.goto(`${url}/components/${name}`, {
      waitUntil: 'domcontentloaded',
      timeout: 300000,
    });
    await page
      .locator('.astryx-segmented-control-item')
      .filter({hasText: /^Compact$/})
      .waitFor({timeout: 60000});
    await page.evaluate(() => document.fonts.ready);
    await page
      .locator('[role="main"] .astryx-spinner')
      .first()
      .waitFor({state: 'hidden', timeout: 60000});
    for (const mode of ['Base', 'Compact']) {
      await page
        .locator('.astryx-segmented-control-item')
        .filter({hasText: new RegExp(`^${mode}$`)})
        .click();
      await page.waitForTimeout(200);
      const metrics = await page.evaluate(() => {
        const main = document.querySelector('main, [role="main"]');
        const theme =
          document.documentElement.getAttribute('data-astryx-theme');
        return {
          theme,
          title: main?.textContent?.slice(0, 100),
          width: document.documentElement.scrollWidth,
          viewport: innerWidth,
          examples: main?.querySelectorAll('[data-astryx-theme]').length ?? 0,
        };
      });
      await page.screenshot({
        path: `${output}/${name}-${mode.toLowerCase()}.png`,
      });
      results.push({name, mode, ...metrics, errors: [...errors]});
    }
    page.off('pageerror', recordError);
    await writeFile(`${output}/report.json`, JSON.stringify(results, null, 2));
    console.log(
      `${name}: ${errors.length ? errors.join('; ') : 'rendered in both modes'}`,
    );
  }
  await writeFile(`${output}/report.json`, JSON.stringify(results, null, 2));
} finally {
  await browser.close();
}
if (
  results.some(
    result =>
      result.errors.length || !result.title || result.width > result.viewport,
  )
)
  process.exitCode = 1;
