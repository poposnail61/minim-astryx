// Copyright (c) Meta Platforms, Inc. and affiliates.

import {mkdir, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {expect, test, type Locator, type Page} from '@playwright/test';

const BASE_URL = process.env.MINIM_QA_BASE_URL ?? 'http://127.0.0.1:5180';
const OUTPUT_DIR = '/tmp/minim-advanced-visual-qa';
const densities = ['base', 'compact'] as const;

type Metric = {
  width: number;
  height: number;
  paddingBlock: string;
  paddingInline: string;
  gap: string;
  flexDirection: string;
  borderColor: string;
};

async function openComponent(page: Page, slug: string) {
  await page.goto(`${BASE_URL}/components/${slug}`, {
    waitUntil: 'domcontentloaded',
  });
  await expect(page.locator('body')).toContainText(
    slug.replace(/([A-Z])/g, ' $1').trim(),
    {
      ignoreCase: true,
    },
  );
  await page.evaluate(() => document.fonts.ready);
}

async function setDensity(page: Page, density: (typeof densities)[number]) {
  const control = page.locator(`[role="radio"][data-value="${density}"]`);
  await expect(control).toBeVisible();
  await control.click();
  await expect(control).toHaveAttribute('aria-checked', 'true');
}

async function metric(locator: Locator): Promise<Metric> {
  return locator.evaluate(element => {
    const style = getComputedStyle(element);
    const box = element.getBoundingClientRect();
    return {
      width: Number(box.width.toFixed(2)),
      height: Number(box.height.toFixed(2)),
      paddingBlock: style.paddingBlock,
      paddingInline: style.paddingInline,
      gap: style.gap,
      flexDirection: style.flexDirection,
      borderColor: style.borderColor,
    };
  });
}

async function assertNoOverflow(page: Page) {
  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
}

function componentPreview(page: Page, className: string) {
  return page.locator(`${className}:visible`).first();
}

test.beforeAll(async () => {
  await mkdir(OUTPUT_DIR, {recursive: true});
});

test('advanced Minim components match source geometry in both densities', async ({
  page,
}, testInfo) => {
  const report: Record<string, Metric> = {};

  for (const density of densities) {
    await openComponent(page, 'Calendar');
    await setDensity(page, density);
    const calendar = page.locator('.astryx-calendar:visible').first();
    const day = calendar.locator('.astryx-calendar-day:visible').first();
    await expect(day).toBeVisible();
    expect((await metric(day)).width).toBeCloseTo(28, 0);
    expect((await metric(day)).height).toBeCloseTo(28, 0);
    const cellHeight = await day.evaluate(element =>
      Number(
        (element.parentElement?.getBoundingClientRect().height ?? 0).toFixed(2),
      ),
    );
    expect(cellHeight).toBeCloseTo(32, 0);
    report[`${density}/Calendar`] = await metric(calendar);

    await openComponent(page, 'PowerSearch');
    await setDensity(page, density);
    const power = page.locator('.astryx-power-search-trigger:visible').first();
    const tokenizer = power.locator('.astryx-tokenizer:visible').first();
    await expect(tokenizer).toBeVisible();
    const powerMetric = await metric(tokenizer);
    expect(powerMetric.height).toBeCloseTo(density === 'base' ? 32 : 26, 0);
    const powerSpacing = await power.evaluate(element => {
      const style = getComputedStyle(element);
      return {
        block: style.getPropertyValue('--power-search-padding-block').trim(),
        inline: style.getPropertyValue('--power-search-padding-inline').trim(),
      };
    });
    expect(powerSpacing.block).toBe(
      density === 'base' ? '0.375rem' : '0.25rem',
    );
    expect(powerSpacing.inline).toBe(
      density === 'base' ? '0.75rem' : '0.625rem',
    );
    const tokenParts = await power
      .locator('.astryx-token')
      .evaluateAll(tokens =>
        tokens.map(token => {
          const endContent = token.querySelector('.astryx-token-end-content');
          const remove = token.querySelector('.astryx-token-remove');
          const endRect = endContent?.getBoundingClientRect();
          const removeRect = remove?.getBoundingClientRect();
          return {
            contentWidth: endRect?.width ?? 0,
            scrollWidth: endContent?.scrollWidth ?? 0,
            contentRight: endRect?.right ?? 0,
            removeLeft: removeRect?.left ?? Number.POSITIVE_INFINITY,
          };
        }),
      );
    expect(tokenParts.length).toBeGreaterThan(0);
    for (const part of tokenParts) {
      // scrollWidth is integer-rounded while getBoundingClientRect preserves
      // subpixels; allow only that rounding delta, never a real text clip.
      expect(part.scrollWidth - part.contentWidth).toBeLessThanOrEqual(0.5);
      expect(part.contentRight).toBeLessThanOrEqual(part.removeLeft);
    }
    report[`${density}/PowerSearch`] = powerMetric;

    await openComponent(page, 'FileInput');
    await setDensity(page, density);
    const fileInput = page
      .locator('.astryx-file-input[data-mode="input"]:visible')
      .first();
    await expect(fileInput).toBeVisible();
    const fileMetric = await metric(fileInput);
    expect(fileMetric.height).toBeCloseTo(density === 'base' ? 32 : 28, 0);
    report[`${density}/FileInput`] = fileMetric;

    await openComponent(page, 'Slider');
    await setDensity(page, density);
    const track = page
      .locator('.astryx-slider-track[data-orientation="horizontal"]:visible')
      .first();
    const thumb = page.locator('.astryx-slider-thumb:visible').first();
    await expect(track).toBeVisible();
    expect((await metric(track)).height).toBeCloseTo(4, 0);
    expect((await metric(thumb)).width).toBeCloseTo(20, 0);
    report[`${density}/Slider`] = await metric(track);

    for (const slug of ['CheckboxList', 'RadioList', 'Switch'] as const) {
      await openComponent(page, slug);
      await setDensity(page, density);
      const selector =
        slug === 'CheckboxList'
          ? '.astryx-checkbox-list-content:visible'
          : slug === 'RadioList'
            ? '.astryx-radio-list:visible'
            : '.astryx-switch[data-size="md"]:visible';
      const target = page.locator(selector).first();
      await expect(target).toBeVisible();
      const measured = await metric(target);
      if (slug === 'Switch') {
        expect(measured.width).toBeCloseTo(40, 0);
        expect(measured.height).toBeCloseTo(24, 0);
      } else {
        expect(measured.gap).toBe(density === 'base' ? '8px' : '6px');
      }
      report[`${density}/${slug}`] = measured;
    }

    await assertNoOverflow(page);
    await page.screenshot({
      path: path.join(
        OUTPUT_DIR,
        `${testInfo.project.name}-${density}-selection.png`,
      ),
      fullPage: true,
    });
  }

  await writeFile(
    path.join(OUTPUT_DIR, `${testInfo.project.name}-metrics.json`),
    `${JSON.stringify(report, null, 2)}\n`,
  );
});

test('advanced controls retain keyboard focus and interaction', async ({
  page,
}) => {
  await openComponent(page, 'Calendar');
  const calendar = componentPreview(page, '.astryx-calendar');
  const calendarDay = calendar
    .locator('.astryx-calendar-day[tabindex="0"]')
    .first();
  await calendarDay.focus();
  await expect(calendarDay).toBeFocused();
  const initialDate = await calendarDay.getAttribute('data-date');
  await page.keyboard.press('ArrowRight');
  expect(
    await page.locator('.astryx-calendar-day:focus').getAttribute('data-date'),
  ).not.toBe(initialDate);

  await openComponent(page, 'PowerSearch');
  const powerSearch = componentPreview(page, '.astryx-power-search-trigger');
  const search = powerSearch.getByRole('combobox').first();
  await search.focus();
  await page.keyboard.type('status');
  await expect(search).toBeFocused();

  await openComponent(page, 'FileInput');
  const fileInput = componentPreview(
    page,
    '.astryx-file-input[data-mode="input"]',
  );
  const fileButton = fileInput.locator('button[aria-label]').first();
  await expect(fileButton).toHaveAttribute('aria-label', /.+/);
  await fileButton.focus();
  await expect(fileButton).toBeFocused();

  await openComponent(page, 'Slider');
  const slider = componentPreview(page, '.astryx-slider')
    .getByRole('slider')
    .first();
  await slider.focus();
  const before = await slider.getAttribute('aria-valuenow');
  await page.keyboard.press('ArrowRight');
  expect(await slider.getAttribute('aria-valuenow')).not.toBe(before);

  await openComponent(page, 'CheckboxList');
  const checkboxList = componentPreview(page, '.astryx-checkbox-list-content');
  const checkbox = checkboxList.getByRole('checkbox').first();
  await checkbox.focus();
  const checked = await checkbox.isChecked();
  await page.keyboard.press('Space');
  expect(await checkbox.isChecked()).toBe(!checked);

  await openComponent(page, 'RadioList');
  const radioList = componentPreview(page, '.astryx-radio-list');
  const radio = radioList.getByRole('radio').first();
  await radio.focus();
  await page.keyboard.press('ArrowDown');
  await expect(radioList.getByRole('radio').nth(1)).toBeFocused();

  await openComponent(page, 'Switch');
  const toggle = page
    .locator('input[role="switch"]:has(+ .astryx-switch:visible)')
    .first();
  await toggle.focus();
  const switched = await toggle.isChecked();
  await page.keyboard.press('Space');
  expect(await toggle.isChecked()).toBe(!switched);
});
