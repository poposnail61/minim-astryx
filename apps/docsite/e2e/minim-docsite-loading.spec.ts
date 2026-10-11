// Copyright (c) Meta Platforms, Inc. and affiliates.

import {expect, test} from '@playwright/test';

test('component examples load on approach and preserve code links', async ({
  page,
}) => {
  const requests: string[] = [];
  page.on('request', request => requests.push(request.url()));
  await page.setViewportSize({width: 390, height: 844});
  await page.goto('/components/TextArea', {waitUntil: 'domcontentloaded'});
  await page.getByRole('radio', {name: 'Compact', exact: true}).click();
  await expect(
    page.getByTestId('showcase-viewport').getByRole('textbox'),
  ).toBeVisible();
  expect(requests.some(url => url.includes('componentExamples_TextArea'))).toBe(
    false,
  );
  await page
    .getByRole('heading', {name: 'Examples', exact: true})
    .scrollIntoViewIfNeeded();
  const example = page
    .locator('.astryx-card')
    .filter({has: page.getByText('TextArea — Character Count', {exact: true})});
  await expect(example).toBeVisible();
  await example.scrollIntoViewIfNeeded();
  await expect(
    example.getByRole('textbox', {name: 'Status update'}),
  ).toBeVisible();
  await expect(
    example.getByRole('link', {name: 'Open in Playground'}),
  ).toHaveAttribute('href', /\/playground#code=/);
  await example.getByRole('button', {name: 'Code', exact: true}).click();
  await expect(example.locator('pre')).toContainText('maxLength={280}');
  await expect(example.getByRole('button', {name: 'Copy code'})).toBeVisible();
  expect(requests.some(url => url.includes('componentExamples_TextArea'))).toBe(
    true,
  );
  expect(
    requests.some(url => /componentExamples_(Toolbar|Table|Slider)/.test(url)),
  ).toBe(false);
});

test('mobile showcase and navigation fit both densities', async ({page}) => {
  for (const width of [320, 390]) {
    await page.setViewportSize({width, height: 900});
    await page.goto('/components/Toolbar', {waitUntil: 'domcontentloaded'});
    for (const mode of ['Base', 'Compact']) {
      await page.getByRole('radio', {name: mode, exact: true}).click();
      const preview = page.getByTestId('showcase-viewport');
      await expect(
        preview.getByRole('button', {name: 'Discard', exact: true}),
      ).toBeVisible();
      const overflow = await preview.evaluate(
        node => node.scrollWidth - node.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(1);
    }
    await page
      .getByRole('button', {name: 'Open navigation', exact: true})
      .click();
    await expect(
      page
        .locator('.astryx-top-nav-item[data-mode="drawer"]')
        .filter({hasText: 'GitHub'}),
    ).toBeVisible();
  }
});
