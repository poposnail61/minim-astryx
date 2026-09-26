// Copyright (c) Meta Platforms, Inc. and affiliates.

import {expect, test} from '@playwright/test';

test('mobile OverflowList preview keeps visible items inside its card', async ({
  page,
}, testInfo) => {
  await page.setViewportSize({width: 390, height: 844});
  await page.goto('/components/OverflowList', {waitUntil: 'domcontentloaded'});
  const card = page.locator('.astryx-card').first();
  const list = card.locator('.astryx-overflow-list');
  await expect(list).toBeVisible();
  for (const mode of ['base', 'compact']) {
    await page.locator(`[role="radio"][data-value="${mode}"]`).first().click();
    await expect(list).toContainText('more');
    await expect
      .poll(() =>
        card.evaluate(card => {
          const bounds = card.getBoundingClientRect();
          const items = card.querySelector('.astryx-overflow-list')!.children;
          return Array.from(items).every(item => {
            const rect = item.getBoundingClientRect();
            return rect.left >= bounds.left && rect.right <= bounds.right;
          });
        }),
      )
      .toBe(true);
    await card.screenshot({path: testInfo.outputPath(`overflow-${mode}.png`)});
  }
});

test('Slider success message and icon use primary blue in both densities', async ({
  page,
}, testInfo) => {
  await page.goto('/components/Slider', {waitUntil: 'domcontentloaded'});
  const status = page
    .locator('.astryx-field-status[data-type="success"]')
    .first();
  await expect(status).toBeVisible();
  for (const mode of ['base', 'compact']) {
    await page.locator(`[role="radio"][data-value="${mode}"]`).first().click();
    const colors = await status.evaluate(node => {
      const probe = document.createElement('span');
      probe.style.color = 'var(--minim-fg-primary)';
      node.appendChild(probe);
      const expected = getComputedStyle(probe).color;
      probe.remove();
      return {
        expected,
        text: getComputedStyle(node).color,
        icon: getComputedStyle(node.querySelector('.astryx-icon')!).color,
      };
    });
    expect(colors.text).toBe(colors.expected);
    expect(colors.icon).toBe(colors.expected);
    await status.screenshot({path: testInfo.outputPath(`success-${mode}.png`)});
  }
});

test('OverflowList retains items across density round trips', async ({
  page,
}) => {
  await page.goto('/components/OverflowList', {waitUntil: 'domcontentloaded'});
  const lists = page.locator('.astryx-overflow-list');
  await expect(lists).toHaveCount(6);
  let baseCounts: number[] = [];
  for (const mode of ['base', 'compact', 'base', 'compact']) {
    await page.locator(`[role="radio"][data-value="${mode}"]`).first().click();
    await expect(lists.first()).toContainText('Edit');
    await expect(lists.first()).not.toHaveText('+5 more');
    // Let the ResizeObserver settle: the regression was a repeated shrink loop.
    await page.waitForTimeout(500);
    const counts = await lists.evaluateAll(nodes =>
      nodes.map(node => node.children.length),
    );
    expect(counts.every(count => count > 1)).toBe(true);
    if (mode === 'base') {
      if (baseCounts.length) {
        expect(counts).toEqual(baseCounts);
      }
      baseCounts = counts;
    }
  }
});

test('Slider width and status preserve track position and fixed thumb size', async ({
  page,
}) => {
  await page.goto('/components/Slider', {waitUntil: 'domcontentloaded'});
  await expect(
    page.getByRole('slider', {name: 'CPU Usage', exact: true}),
  ).toBeVisible();
  for (const mode of ['base', 'compact']) {
    await page.locator(`[role="radio"][data-value="${mode}"]`).first().click();
    for (const width of [200, 420]) {
      const geometry = await page
        .locator('.astryx-slider')
        .evaluateAll((nodes, width) => {
          const selected = nodes.filter(node => {
            const label = node
              .closest('.astryx-field')
              ?.querySelector('.astryx-field-label')?.textContent;
            return ['CPU Usage', 'Memory', 'Disk'].includes(label || '');
          });
          return selected.map(node => {
            const field = node.closest('.astryx-field') as HTMLElement;
            field.style.width = `${width}px`;
            const track = node
              .querySelector('.astryx-slider-control')!
              .getBoundingClientRect();
            const thumb = node.querySelector('[role="slider"]')!;
            const rect = thumb.getBoundingClientRect();
            const label = field.querySelector(
              '.astryx-field-label',
            ) as HTMLElement;
            return {
              width: track.width,
              thumbWidth: rect.width,
              x: rect.x + rect.width / 2 - track.x,
              value: Number(thumb.getAttribute('aria-valuenow')),
              offset: track.y - label.getBoundingClientRect().bottom,
              font: getComputedStyle(label).fontSize,
            };
          });
        }, width);
      expect(geometry).toHaveLength(3);
      for (const item of geometry) {
        expect(item.width).toBe(width);
        expect(item.thumbWidth).toBe(20);
        expect(item.x).toBeCloseTo(10 + ((width - 20) * item.value) / 100, 1);
        expect(item.offset).toBe(4);
        expect(item.font).toBe(mode === 'base' ? '15px' : '13.5px');
      }
    }
  }
});
