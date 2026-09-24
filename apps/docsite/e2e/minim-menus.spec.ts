// Copyright (c) Meta Platforms, Inc. and affiliates.

import {test, expect} from '@playwright/test';
import {mkdir} from 'node:fs/promises';

for (const density of ['Base', 'Compact']) {
  test(`${density} optional status and loading icons`, async ({page}) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => {
      if (message.type() === 'error') {
        errors.push(message.text());
      }
    });
    await page.goto('/examples/menus');
    await expect(async () => {
      await page.getByRole('radio', {name: 'Compact', exact: true}).click();
      await expect(
        page.getByRole('radio', {name: 'Compact', exact: true}),
      ).toHaveAttribute('aria-checked', 'true', {timeout: 1000});
    }).toPass();
    await page.getByRole('radio', {name: density, exact: true}).click();
    await page.evaluate(() => document.fonts.ready);
    for (const [status, glyph] of [
      ['error', 'close-circle-solid'],
      ['warning', 'warning-triangle-solid'],
      ['success', 'check-circle-solid'],
    ]) {
      const icons = page.locator(
        `.astryx-input-status-icon[data-status="${status}"]`,
      );
      await expect(icons).toHaveCount(5);
      for (const icon of await icons.all()) {
        await expect(icon).toHaveAttribute('data-size', 'lg');
        const symbol = icon.locator(`[data-minim-icon="${glyph}"]`);
        await expect(symbol).toBeVisible();
        await expect(symbol).toHaveCSS(
          'height',
          density === 'Base' ? '22px' : '20px',
        );
      }
    }
    const ring = page.locator('.astryx-spinner').first();
    await expect(ring).toBeVisible();
    await expect(ring).toHaveCSS('--spinner-box-size', '20px');
    await expect(ring).toHaveCSS('--spinner-arc-fraction', '0.75');
    await page.getByRole('button', {name: /Clear Clearable text/}).click();
    await expect(page.getByLabel('Clearable text', {exact: true})).toHaveValue(
      '',
    );
    expect(errors).toEqual([]);
  });
  test(`${density} joined fields and readonly paint`, async ({page}) => {
    await page.setViewportSize({width: 320, height: 900});
    await page.goto('/examples/menus');
    await expect(async () => {
      await page.getByRole('radio', {name: 'Compact', exact: true}).click();
      await expect(
        page.getByRole('radio', {name: 'Compact', exact: true}),
      ).toHaveAttribute('aria-checked', 'true', {timeout: 1000});
    }).toPass();
    await page.getByRole('radio', {name: density, exact: true}).click();
    const date = page.locator('.astryx-date-time-input-date-segment');
    const time = page.locator('.astryx-date-time-input-time-segment');
    const a = (await date.boundingBox())!;
    const b = (await time.boundingBox())!;
    expect(a.y).toBe(b.y);
    expect(a.x + a.width - b.x).toBeCloseTo(1, 0);
    expect(b.x + b.width).toBeLessThanOrEqual(320);
    expect(a.height).toBe(density === 'Base' ? 44 : 36);
    await expect(date).toHaveCSS('border-top-right-radius', '0px');
    await expect(time).toHaveCSS('border-top-left-radius', '0px');
    for (const label of [
      'Readonly text',
      'Readonly notes',
      'Readonly number',
    ]) {
      const input = page.getByLabel(label, {exact: true});
      await expect(input).toHaveAttribute('readonly');
      await expect(input).toHaveCSS('color', 'rgb(158, 158, 158)');
      await expect(input).not.toBeDisabled();
      const value = await input.inputValue();
      await input.focus();
      await page.keyboard.type('replacement');
      await expect(input).toHaveValue(value);
    }
  });
  for (const name of [
    'Selector',
    'MultiSelector',
    'Typeahead',
    'Tokenizer',
    'DropdownMenu',
    'ContextMenu',
    'DateInput',
    'DateRangeInput',
    'DateTimeInput',
    'TimeOptions',
  ]) {
    test(`${density} ${name}`, async ({page}, info) => {
      await mkdir('/tmp/minim-menus', {recursive: true});
      await page.goto('/examples/menus');
      await expect(async () => {
        await page.getByRole('radio', {name: 'Compact', exact: true}).click();
        await expect(
          page.getByRole('radio', {name: 'Compact', exact: true}),
        ).toHaveAttribute('aria-checked', 'true', {timeout: 1000});
      }).toPass();
      await page.getByRole('radio', {name: density, exact: true}).click();
      if (name === 'DropdownMenu' || name === 'ContextMenu') {
        await page
          .getByRole('button', {name, exact: true})
          .click({button: name === 'ContextMenu' ? 'right' : 'left'});
      } else if (name === 'TimeOptions') {
        await page
          .getByRole('combobox', {name: 'DateTimeInput time', exact: true})
          .click();
        await page.keyboard.press('Alt+ArrowDown');
      } else if (name.startsWith('Date')) {
        const cls =
          name === 'DateInput'
            ? 'date-input'
            : name === 'DateRangeInput'
              ? 'date-range-input'
              : 'date-time-input-date-segment';
        await page
          .locator(`.astryx-${cls}`)
          .first()
          .getByRole('button', {name: 'Open calendar', exact: true})
          .click();
      } else {
        await page.getByRole('combobox', {name, exact: true}).click();
      }
      const surface = page
        .locator(
          '.astryx-selector-popup, .astryx-multi-selector-popup, .astryx-typeahead-popup, .astryx-dropdown-menu, .astryx-context-menu, .astryx-date-input-popup, .astryx-date-range-input-popup, .astryx-date-time-input-popup, .astryx-date-time-input-time-popup',
        )
        .filter({visible: true});
      await expect(surface).toHaveCount(1);
      for (const row of await surface
        .locator(
          '.astryx-dropdown-menu-item, .astryx-menu-radio-row, .astryx-selector-option-row, .astryx-multi-selector-option, .astryx-typeahead-option-row, .astryx-date-time-input-time-option',
        )
        .all()) {
        await expect(row).toHaveCSS(
          'padding-left',
          density === 'Base' ? '12px' : '10px',
        );
        await expect(row).toHaveCSS(
          'padding-right',
          density === 'Base' ? '12px' : '10px',
        );
      }
      const box = (await surface.boundingBox())!;
      expect(box.x).toBeGreaterThanOrEqual(-1);
      expect(box.x + box.width).toBeLessThanOrEqual(
        page.viewportSize()!.width + 1,
      );
      if (!name.startsWith('Date')) {
        if (name === 'DropdownMenu') {
          await expect(
            page.locator('.astryx-dropdown-menu-popup').filter({visible: true}),
          ).toHaveCSS('padding', '0px');
          await expect(
            page.locator('.astryx-dropdown-menu-popup').filter({visible: true}),
          ).toHaveCSS('box-shadow', 'none');
        }
        const row = surface
          .getByRole(name.includes('Menu') ? 'menuitem' : 'option')
          .first();
        await expect(row).toBeVisible();
        await expect
          .poll(async () => (await row.boundingBox())!.height)
          .toBeCloseTo(density === 'Base' ? 44 : 36, 0);
      }
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({
        path: `/tmp/minim-menus/${info.project.name}-${density}-${name}.png`,
        animations: 'disabled',
      });
      await page.keyboard.press('Escape');
      await expect(surface).toHaveCount(0);
    });
  }
}
