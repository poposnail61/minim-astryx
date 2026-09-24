// Copyright (c) Meta Platforms, Inc. and affiliates.

import {expect, test} from '@playwright/test';

for (const mode of ['Base', 'Compact']) {
  test(`${mode}: default large and explicit medium/large`, async ({
    page,
  }, info) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('/examples/sizes');
    await expect(async () => {
      await page
        .getByRole('radio', {
          name: mode === 'Base' ? 'Compact' : 'Base',
          exact: true,
        })
        .click();
      await page.getByRole('radio', {name: mode, exact: true}).click();
      await expect(
        page.getByRole('radio', {name: mode, exact: true}),
      ).toHaveAttribute('aria-checked', 'true', {timeout: 1000});
    }).toPass();
    await page.evaluate(() => document.fonts.ready);
    for (const size of ['default', 'md', 'lg']) {
      const section = page.getByTestId(`size-${size}`);
      const medium = size === 'md';
      const height = mode === 'Base' ? (medium ? 36 : 44) : medium ? 28 : 36;
      const font = mode === 'Base' ? (medium ? 15 : 16.5) : medium ? 13.5 : 15;
      const controls = section.locator(
        '.astryx-button, .astryx-text-input, .astryx-selector, .astryx-checkbox-list-item, .astryx-radio-list-item, .astryx-tab',
      );
      for (const control of await controls.all()) {
        await expect(control).toHaveAttribute(
          'data-size',
          medium ? 'md' : 'lg',
        );
        await expect(control).toHaveCSS('height', `${height}px`);
      }
      for (const label of await section
        .locator(
          '.astryx-button-label, .astryx-tab, .astryx-checkbox-list-item .astryx-item-label, .astryx-radio-list-item .astryx-item-label',
        )
        .all()) {
        await expect(label).toHaveCSS('font-size', `${font}px`);
      }
      await expect(section.locator('.astryx-button').first()).toHaveAttribute(
        'data-variant',
        'neutral',
      );
      for (const button of await section.locator('.astryx-button').all()) {
        const iconOnly =
          (await button.getAttribute('data-content')) === 'icon-only';
        const large = (await button.getAttribute('data-size')) === 'lg';
        const inlinePadding =
          mode === 'Base' ? (large ? 16 : 12) : large ? 12 : 10;
        await expect(button).toHaveCSS(
          'padding-left',
          iconOnly ? '0px' : `${inlinePadding}px`,
        );
        await expect(button).toHaveCSS(
          'column-gap',
          mode === 'Base' ? '8px' : '6px',
        );
      }
      for (const label of await section
        .locator(
          '.astryx-button-label, .astryx-badge-label, .astryx-token-label, .astryx-text-input-control',
        )
        .all()) {
        await expect(label).toHaveCSS('padding-left', '0px');
        await expect(label).toHaveCSS('padding-right', '0px');
      }
      for (const iconOnly of [
        section.getByRole('button', {name: 'Search', exact: true}),
        section.getByRole('link', {name: 'Search navigation'}),
      ]) {
        await expect(iconOnly).toHaveCSS('width', `${height}px`);
        await expect(iconOnly).toHaveCSS('height', `${height}px`);
        await expect(
          iconOnly.locator('[data-minim-icon="search"]'),
        ).toBeVisible();
      }
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    expect(errors).toEqual([]);
    await page.screenshot({
      path: info.outputPath(`${mode}.png`),
      fullPage: true,
    });
  });
}
