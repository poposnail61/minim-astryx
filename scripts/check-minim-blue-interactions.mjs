// Copyright (c) Meta Platforms, Inc. and affiliates.

import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';

const browser = await chromium.launch({channel: 'chrome', headless: true});
const page = await browser.newPage({viewport: {width: 1440, height: 1000}});
const url = process.env.MINIM_QA_URL ?? 'http://127.0.0.1:5181';
const results = [];
async function visit(name) {
  await page.goto(`${url}/components/${name}`, {
    waitUntil: 'domcontentloaded',
    timeout: 60000,
  });
  await page.locator('[role="main"]').waitFor();
  await page
    .locator('.astryx-segmented-control-item')
    .filter({hasText: /^Compact$/})
    .waitFor();
}
try {
  await visit('TabList');
  const home = page.locator('.astryx-tab[data-tab-value="home"]').first();
  await home.focus();
  await page.keyboard.press('ArrowRight');
  assert.equal(
    await page
      .locator('.astryx-tab[data-tab-value="projects"]')
      .first()
      .evaluate(el => el === document.activeElement),
    true,
  );
  await page.keyboard.press('Enter');
  assert.equal(
    await page
      .locator('.astryx-tab[data-tab-value="projects"]')
      .first()
      .getAttribute('aria-current'),
    'true',
  );
  results.push('tab keyboard selection');

  await visit('SelectableCard');
  const basic = page
    .locator('.astryx-selectable-card')
    .filter({hasText: 'Basic'})
    .first();
  await basic.click();
  assert.equal(await basic.locator('input').isChecked(), true);
  results.push('card selection');

  await visit('Popover');
  await page
    .getByRole('button', {name: 'Settings', exact: true})
    .first()
    .click();
  await page
    .locator('.astryx-popover:visible')
    .filter({hasText: 'Notifications'})
    .first()
    .waitFor();
  await page.screenshot({path: '/tmp/minim-blue-qa/Popover-open.png'});
  await page.keyboard.press('Escape');
  await page
    .locator('.astryx-popover:visible')
    .filter({hasText: 'Notifications'})
    .first()
    .waitFor({state: 'hidden'});
  results.push('popover open and Escape');

  await page.setViewportSize({width: 390, height: 844});
  for (const name of ['Card', 'TabList', 'Table', 'Dialog', 'Banner']) {
    await visit(name);
    const selectors = {
      Card: '.astryx-card',
      TabList: '.astryx-tab',
      Table: '.astryx-table',
      Dialog: '.astryx-dialog',
      Banner: '.astryx-banner-frame',
    };
    await page.locator(`[role="main"] ${selectors[name]}`).first().waitFor();
    await page.locator('[role="main"] .astryx-spinner').first().waitFor({state: 'hidden'});
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      true,
      `${name}: page overflow`,
    );
    await page.screenshot({path: `/tmp/minim-blue-qa/${name}-mobile.png`});
    results.push(`${name} mobile layout`);
  }
  await writeFile(
    '/tmp/minim-blue-qa/interactions.json',
    JSON.stringify(results, null, 2),
  );
  console.log(results.join('\n'));
} finally {
  await browser.close();
}
