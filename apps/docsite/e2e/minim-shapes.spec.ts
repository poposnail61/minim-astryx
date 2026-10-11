// Copyright (c) Meta Platforms, Inc. and affiliates.
import {test, expect} from '@playwright/test';

for (const density of ['Base', 'Compact']) {
  test(`${density}: pill changes radius only and keeps interactions`, async ({
    page,
  }, info) => {
    await page.goto('/examples/shapes');
    await page.getByRole('radio', {name: density, exact: true}).click();
    await expect(
      page.getByRole('radio', {name: density, exact: true}),
    ).toHaveAttribute('aria-checked', 'true');
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({
      path: `/tmp/minim-shapes/${info.project.name}-${density}.png`,
      fullPage: true,
    });
    for (const size of ['md', 'lg']) {
      const base = page.getByTestId(`${size}-default`);
      const pill = page.getByTestId(`${size}-pill`);
      await expect(pill.locator('[data-minim-icon="plus"]')).toBeVisible();
      const shapeMetrics = (root: typeof pill) =>
        root.locator('button').evaluateAll(elements =>
          elements.map(el => {
            const css = getComputedStyle(el);
            return {
              width: el.getBoundingClientRect().width,
              height: el.getBoundingClientRect().height,
              font: css.fontSize,
              padding: css.padding,
              gap: css.gap,
            };
          }),
        );
      expect(await shapeMetrics(pill)).toEqual(await shapeMetrics(base));
      for (const target of await pill
        .locator('button, .astryx-segmented-control')
        .all()) {
        await expect(target).toHaveCSS('border-radius', '999px');
      }
      const expectedHeight =
        size === 'lg'
          ? density === 'Base'
            ? 44
            : 36
          : density === 'Base'
            ? 36
            : 28;
      await expect(
        pill.getByRole('button', {name: 'Save', exact: true}),
      ).toHaveCSS('height', `${expectedHeight}px`);
      await pill.getByRole('button', {name: 'Filter', exact: true}).click();
      await expect(
        pill.getByRole('button', {name: 'Filter', exact: true}),
      ).toHaveAttribute('aria-pressed', 'true');
      await pill.getByRole('radio', {name: 'Grid', exact: true}).click();
      await expect(
        pill.getByRole('radio', {name: 'Grid', exact: true}),
      ).toHaveAttribute('aria-checked', 'true');
      await base.getByRole('button', {name: 'Actions', exact: true}).click();
      const menu = page.getByRole('menu');
      await expect(menu).toBeVisible();
      const menuRadius = await menu.evaluate(
        el => getComputedStyle(el).borderRadius,
      );
      await page.keyboard.press('Escape');
      await pill.getByRole('button', {name: 'Actions', exact: true}).click();
      await expect(menu).toBeVisible();
      await expect(menu).toHaveCSS('border-radius', menuRadius);
      await page.getByRole('menuitem', {name: 'Edit', exact: true}).click();
      await expect(
        pill.getByRole('button', {name: 'Edited', exact: true}),
      ).toBeVisible();
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
  });
}
