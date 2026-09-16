// Copyright (c) Meta Platforms, Inc. and affiliates.

import {mkdir, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {expect, test, type Locator, type Page} from '@playwright/test';

const OUTPUT_DIR = '/tmp/minim-visual-qa';
const densities = ['base', 'compact'] as const;
const pages = [
  {slug: 'Button', selector: '.astryx-button'},
  {slug: 'ButtonGroup', selector: '.astryx-button-group'},
  {slug: 'TextInput', selector: '.astryx-text-input'},
  {slug: 'NumberInput', selector: '.astryx-number-input'},
  {slug: 'Badge', selector: '.astryx-badge'},
  {slug: 'Token', selector: '.astryx-token'},
  {slug: 'CheckboxInput', selector: '.astryx-checkbox-input'},
  {slug: 'RadioList', selector: '.astryx-radio-list'},
  {slug: 'Switch', selector: '.astryx-switch'},
] as const;

type BoxMetrics = {
  selector: string;
  size: string | null;
  width: number;
  height: number;
  fontFamily: string;
  fontSize: string;
  lineHeight: string;
  paddingBlock: string;
  paddingInline: string;
};

async function waitForDocsite(page: Page) {
  await page.goto('/', {waitUntil: 'domcontentloaded'});
  await expect(page.locator('body')).toContainText('Minim Astryx');
  await page.evaluate(() => document.fonts.ready);
}

async function setDensity(page: Page, density: (typeof densities)[number]) {
  const item = page.locator(`[role="radio"][data-value="${density}"]`);
  await expect(item).toBeVisible();
  await item.click();
  await expect(item).toHaveAttribute('aria-checked', 'true');
  await page.evaluate(() => document.fonts.ready);
}

async function assertFontsAndLigature(page: Page) {
  const fontState = await page.evaluate(() => ({
    base: document.fonts.check('15px "MinimBaseVF"'),
    baseSpaced: document.fonts.check('15px "Minim Base VF"'),
    icon: document.fonts.check('20px "Minim Symbol"'),
    loadedFaces: Array.from(document.fonts)
      .filter(face => face.status === 'loaded')
      .map(face => face.family.replaceAll('"', '')),
  }));
  expect
    .soft(fontState.base || fontState.baseSpaced, 'Minim base font loaded')
    .toBe(true);
  expect.soft(fontState.icon, 'Minim Symbol font loaded').toBe(true);
  expect.soft(fontState.loadedFaces).toContain('Minim Symbol');

  const evidence = await page
    .locator('[data-minim-icon] > span')
    .evaluateAll(elements =>
      elements
        .map(element => {
          const style = getComputedStyle(element);
          const box = element.getBoundingClientRect();
          return {
            family: style.fontFamily,
            text: element.textContent?.trim() ?? '',
            width: box.width,
            height: box.height,
            visible:
              style.visibility !== 'hidden' &&
              style.display !== 'none' &&
              box.width > 0 &&
              box.height > 0,
          };
        })
        .find(icon => icon.visible && icon.family.includes('Minim Symbol')),
    );
  expect.soft(evidence, 'no visible Minim Symbol ligature icon').toBeDefined();
  if (evidence) {
    expect.soft(evidence.family).toContain('Minim Symbol');
    expect.soft(evidence.text.length).toBeGreaterThan(0);
    expect.soft(evidence.width).toBeGreaterThan(0);
    expect.soft(evidence.height).toBeGreaterThan(0);
  }
}

async function assertNoHorizontalOverflow(page: Page) {
  const widths = await page.evaluate(() => ({
    scroll: document.documentElement.scrollWidth,
    client: document.documentElement.clientWidth,
  }));
  expect(widths.scroll).toBeLessThanOrEqual(widths.client + 1);
}

async function assertButtonPreviewsAreNotClipped(page: Page) {
  const clipped = await page
    .locator('main .astryx-button:visible')
    .evaluateAll(buttons =>
      buttons.flatMap(button => {
        let viewport = button.parentElement;
        while (viewport) {
          const overflow = getComputedStyle(viewport).overflowX;
          if (overflow === 'auto' || overflow === 'scroll') {
            break;
          }
          viewport = viewport.parentElement;
        }
        if (!viewport) {
          return [];
        }
        const buttonBox = button.getBoundingClientRect();
        const viewportBox = viewport.getBoundingClientRect();
        const isClipped =
          buttonBox.left < viewportBox.left - 1 ||
          buttonBox.right > viewportBox.right + 1;
        return isClipped
          ? [
              {
                label:
                  button.textContent?.trim() ??
                  button.getAttribute('aria-label'),
                buttonLeft: buttonBox.left,
                buttonRight: buttonBox.right,
                viewportLeft: viewportBox.left,
                viewportRight: viewportBox.right,
              },
            ]
          : [];
      }),
    );
  expect(
    clipped,
    'Button example controls clipped by preview viewport',
  ).toEqual([]);
}

async function collectAndAssertButtonGroupEvidence(page: Page) {
  const evidence = await page
    .locator('.astryx-button-group:visible')
    .evaluateAll(groups =>
      groups.slice(0, 2).map(group => {
        const groupStyle = getComputedStyle(group);
        const children = Array.from(group.children).map(child => {
          const style = getComputedStyle(child);
          const box = child.getBoundingClientRect();
          return {
            text: child.textContent?.trim() ?? '',
            backgroundColor: style.backgroundColor,
            color: style.color,
            left: box.left,
            right: box.right,
          };
        });
        return {
          backgroundColor: groupStyle.backgroundColor,
          text: group.textContent?.trim() ?? '',
          children,
        };
      }),
    );

  const [neutral, split] = evidence;
  expect(neutral?.text).toBe('CopyCutPaste');
  expect(neutral?.backgroundColor).toMatch(/^rgba\(.+, 0\)$/);
  for (const child of neutral?.children ?? []) {
    expect(child.color).toBe('rgb(24, 24, 27)');
    expect(child.backgroundColor).toBe('rgba(0, 0, 0, 0.05)');
  }

  expect(split?.text).toBe('Save');
  expect(split?.backgroundColor).toMatch(/^rgba\(.+, 0\)$/);
  for (const child of split?.children ?? []) {
    expect(child.color).toBe('rgb(255, 255, 255)');
    expect(child.backgroundColor).toBe('rgb(68, 154, 252)');
  }
  expect(
    Math.abs(
      (split?.children[0]?.right ?? 0) - (split?.children[1]?.left ?? 0),
    ),
  ).toBeLessThanOrEqual(0.5);

  return evidence;
}

async function collectMetrics(locator: Locator, selector: string) {
  return locator.evaluateAll(
    (elements, resolvedSelector) =>
      elements
        .filter(element => {
          const box = element.getBoundingClientRect();
          return box.width > 0 && box.height > 0;
        })
        .map(element => {
          const box = element.getBoundingClientRect();
          const style = getComputedStyle(element);
          return {
            selector: resolvedSelector,
            size: element.getAttribute('data-size'),
            width: Number(box.width.toFixed(2)),
            height: Number(box.height.toFixed(2)),
            fontFamily: style.fontFamily,
            fontSize: style.fontSize,
            lineHeight: style.lineHeight,
            paddingBlock: style.paddingBlock,
            paddingInline: style.paddingInline,
          };
        }),
    selector,
  ) as Promise<BoxMetrics[]>;
}

async function assertMeasuredHeights(
  metrics: BoxMetrics[],
  expected: Record<string, number>,
) {
  for (const [size, height] of Object.entries(expected)) {
    const match = metrics.find(metric => metric.size === size);
    expect.soft(match, `missing visible data-size=${size}`).toBeDefined();
    if (match) {
      expect
        .soft(match.height, `data-size=${size} height`)
        .toBeCloseTo(height, 0);
    }
  }
}

async function collectButtonSizeMetrics(page: Page) {
  const examples = [
    {size: 'md', label: 'Medium'},
    {size: 'lg', label: 'Large'},
    {size: 'xl', label: 'Extra large'},
  ];
  const metrics: BoxMetrics[] = [];
  for (const example of examples) {
    const button = page
      .getByRole('button', {name: example.label, exact: true})
      .first();
    if (await button.isVisible().catch(() => false)) {
      const [metric] = await collectMetrics(button, '.astryx-button');
      if (metric) {
        metrics.push({...metric, size: example.size});
      }
    }
  }
  return metrics;
}

async function assertCompactButtonInsets(page: Page) {
  const button = page
    .locator('.astryx-button[data-size="md"]:visible')
    .filter({hasText: /^Primary$/})
    .first();
  const label = button.locator('.astryx-button-label');
  await expect.soft(button).toHaveCSS('padding-block', '4px');
  await expect.soft(button).toHaveCSS('padding-inline', '5px');
  await expect.soft(label).toHaveCSS('padding-block', '1px');
  await expect.soft(label).toHaveCSS('padding-inline', '4px');
}

async function exerciseSizeSelector(page: Page, value: string) {
  const selector = page.getByRole('combobox', {name: 'size'});
  await expect(selector).toBeVisible();
  await selector.click();
  const option = page.getByRole('option', {name: value, exact: true});
  await expect(option).toBeVisible();
  await expect(selector).toBeFocused();
  await expect(selector).toHaveAttribute('aria-activedescendant', /.+/);
  await option.click();
}

async function assertInputGeometry(
  page: Page,
  selector: string,
  size: 'md' | 'lg',
  expected: {root: number; content: number},
) {
  const root = page.locator(`${selector}[data-size="${size}"]:visible`).first();
  const control = root.locator(`${selector}-control`);
  const styles = await root.evaluate(element => {
    const style = getComputedStyle(element);
    const box = element.getBoundingClientRect();
    return {
      height: box.height,
      borderWidth: style.borderWidth,
      outlineWidth: style.outlineWidth,
      outlineOffset: style.outlineOffset,
      boxShadow: style.boxShadow,
    };
  });
  const controlHeight = await control.evaluate(
    element => element.getBoundingClientRect().height,
  );

  expect
    .soft(styles.height, `${selector} ${size} root height`)
    .toBeCloseTo(expected.root, 0);
  expect
    .soft(controlHeight, `${selector} ${size} content height`)
    .toBeCloseTo(expected.content, 0);
  expect
    .soft(styles.borderWidth, `${selector} ${size} layout border`)
    .toBe('0px');
  expect
    .soft(styles.outlineWidth, `${selector} ${size} inside outline`)
    .toBe('1px');
  expect
    .soft(styles.outlineOffset, `${selector} ${size} inside outline offset`)
    .toBe('-1px');
  expect
    .soft(styles.boxShadow, `${selector} ${size} inset stroke`)
    .toContain('inset');

  await root.hover();
  expect
    .soft(await root.evaluate(element => getComputedStyle(element).boxShadow))
    .toContain('inset');
  await control.focus();
  await expect(control).toBeFocused();
  expect
    .soft(await root.evaluate(element => getComputedStyle(element).boxShadow))
    .toContain('inset');
}

test.beforeAll(async () => {
  await mkdir(OUTPUT_DIR, {recursive: true});
});

test('Minim component pages render in both densities', async ({
  page,
}, testInfo) => {
  await waitForDocsite(page);
  const project = testInfo.project.name;
  const report: Record<string, unknown> = {project, pages: {}};

  for (const density of densities) {
    for (const target of pages) {
      await page.goto(`/components/${target.slug}`, {
        waitUntil: 'domcontentloaded',
      });
      await setDensity(page, density);
      await expect(
        page.locator(target.selector + ':visible').first(),
      ).toBeVisible();
      if (target.slug === 'Button') {
        await assertFontsAndLigature(page);
      }
      await assertNoHorizontalOverflow(page);

      const metrics = await collectMetrics(
        page.locator(target.selector),
        target.selector,
      );
      expect(metrics.length).toBeGreaterThan(0);
      (report.pages as Record<string, unknown>)[`${density}/${target.slug}`] =
        metrics;
      await page.screenshot({
        path: path.join(OUTPUT_DIR, `${project}-${density}-${target.slug}.png`),
        fullPage: true,
      });
      if (target.slug === 'Button') {
        await assertButtonPreviewsAreNotClipped(page);
      }
      if (target.slug === 'ButtonGroup') {
        (report.pages as Record<string, unknown>)[
          `${density}/ButtonGroupEvidence`
        ] = await collectAndAssertButtonGroupEvidence(page);
      }
    }
  }

  await page.goto('/components/Button', {waitUntil: 'domcontentloaded'});
  await setDensity(page, 'base');
  await assertMeasuredHeights(await collectButtonSizeMetrics(page), {
    md: 36,
    lg: 44,
    xl: 52,
  });
  await setDensity(page, 'compact');
  await assertMeasuredHeights(await collectButtonSizeMetrics(page), {
    md: 28,
    lg: 36,
    xl: 44,
  });
  await assertCompactButtonInsets(page);

  for (const input of [
    {slug: 'TextInput', selector: '.astryx-text-input'},
    {slug: 'NumberInput', selector: '.astryx-number-input'},
  ]) {
    await page.goto(`/components/${input.slug}?tab=properties`, {
      waitUntil: 'domcontentloaded',
    });
    for (const density of densities) {
      await setDensity(page, density);
      const expected =
        density === 'base'
          ? {md: {root: 36, content: 24}, lg: {root: 44, content: 28}}
          : {md: {root: 28, content: 20}, lg: {root: 36, content: 24}};
      for (const size of ['md', 'lg'] as const) {
        await exerciseSizeSelector(page, size);
        await assertInputGeometry(page, input.selector, size, expected[size]);
      }
    }
  }

  await page.goto('/components/DropdownMenu?tab=properties', {
    waitUntil: 'domcontentloaded',
  });
  await setDensity(page, 'base');
  const trigger = page.locator('[aria-haspopup="menu"]:visible').first();
  await expect(trigger).toBeVisible();
  await trigger.click();
  const menu = page.locator('[role="menu"]:visible').first();
  await expect(menu).toBeVisible();
  await page.keyboard.press('ArrowDown');
  await expect(page.locator('[role="menuitem"]:visible').first()).toBeFocused();

  await writeFile(
    path.join(OUTPUT_DIR, `${project}-metrics.json`),
    `${JSON.stringify(report, null, 2)}\n`,
  );
});
