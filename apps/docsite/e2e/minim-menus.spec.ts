// Copyright (c) Meta Platforms, Inc. and affiliates.

import {test, expect} from '@playwright/test';
import {mkdir} from 'node:fs/promises';

for (const density of ['Base', 'Compact']) {
  test(`${density} updated empty state and power-search editor`, async ({
    page,
  }) => {
    await page.goto('/examples/menus');
    await page.getByRole('radio', {name: density, exact: true}).click();
    await page.evaluate(() => document.fonts.ready);
    const empty = page.getByTestId('empty-state-review');
    await expect(empty.locator('.astryx-empty-state-title').first()).toHaveCSS(
      'font-size',
      '18px',
    );
    await empty.screenshot({path: `/tmp/minim-empty-state-${density}.png`});
    const input = page.getByRole('combobox', {
      name: 'PowerSearch review',
      exact: true,
    });
    await input.click();
    await page.getByRole('option', {name: 'Title', exact: true}).click();
    const editor = page.locator('.astryx-power-search-popover');
    await expect(editor).toBeVisible();
    const apply = editor.getByRole('button', {name: 'Apply', exact: true});
    await expect(apply).toHaveAttribute('data-size', 'lg');
    await expect(apply).toHaveAttribute('data-variant', 'neutral');
    await expect(editor.locator('.astryx-text-input')).toHaveAttribute(
      'data-size',
      'md',
    );
    await editor.screenshot({path: `/tmp/minim-power-search-${density}.png`});
    await editor.getByRole('button', {name: 'Cancel', exact: true}).click();
    await expect(editor).not.toBeVisible();
  });
  test(`${density} persistent affordances and single disabled opacity`, async ({
    page,
  }) => {
    await page.goto('/examples/menus');
    await page.getByRole('radio', {name: density, exact: true}).click();
    await expect(
      page.getByRole('radio', {name: density, exact: true}),
    ).toHaveAttribute('aria-checked', 'true');
    for (const type of ['error', 'warning', 'success']) {
      for (const [label, selector] of [
        [`${type} selector`, '.astryx-selector-indicator-icon'],
        [`${type} multi selector`, '.astryx-multi-selector-indicator-icon'],
      ]) {
        const trigger = page.getByRole('combobox', {name: label, exact: true});
        await expect(trigger.locator('..').locator(selector)).toBeVisible();
      }
      const date = page.getByRole('combobox', {
        name: `${type} date`,
        exact: true,
      });
      await expect(
        date.locator('..').locator('.astryx-date-input-toggle-icon'),
      ).toBeVisible();
    }
    const icons = page
      .getByTestId('disabled-input-icons')
      .locator('[data-minim-icon]:visible');
    await expect(icons).toHaveCount(7);
    for (const icon of await icons.all()) {
      await expect(icon).toHaveCSS('color', 'rgb(24, 24, 27)');
      const opacity = await icon.evaluate(el => {
        let alpha = 1;
        for (let node: Element | null = el; node; node = node.parentElement) {
          alpha *= Number(getComputedStyle(node).opacity);
        }
        return alpha;
      });
      expect(opacity).toBeCloseTo(0.5, 5);
    }
    await page
      .getByTestId('disabled-input-icons')
      .screenshot({path: `/tmp/minim-disabled-${density}.png`});
  });
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
    const ringMetrics = await ring.evaluate(element => {
      const style = getComputedStyle(element);
      return {
        actual: style.getPropertyValue('--spinner-box-size').trim(),
        expected: style
          .getPropertyValue('--minim-typography-line-height-md')
          .trim(),
      };
    });
    expect(ringMetrics.expected).not.toBe('');
    expect(ringMetrics.actual).toBe(ringMetrics.expected);
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
    const date = page.locator('.astryx-date-time-input-date-segment').first();
    const time = page.locator('.astryx-date-time-input-time-segment').first();
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
