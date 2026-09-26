// Copyright (c) Meta Platforms, Inc. and affiliates.

import {expect, test} from '@playwright/test';

for (const density of ['Base', 'Compact']) {
  test(`${density}: disabled checkbox colors match Figma`, async ({page}) => {
    await page.goto('/examples/sizes');
    await page.getByRole('radio', {name: density, exact: true}).click();
    for (const size of ['md', 'lg']) {
      const samples = page
        .getByTestId(`size-${size}`)
        .getByTestId('disabled-checkboxes');
      const indicators = samples.locator('.astryx-checkbox-indicator');
      await expect(indicators).toHaveCount(4);
      for (const indicator of await indicators.all()) {
        await expect(indicator).toHaveCSS('color', 'rgb(212, 212, 216)');
        await expect(indicator).toHaveCSS('opacity', '1');
      }
      for (const check of await samples
        .locator('.astryx-checkbox-indicator-check')
        .all()) {
        await expect(check).toHaveCSS('color', 'rgb(212, 212, 216)');
      }
      await expect(
        samples.locator('.astryx-checkbox-indicator-dash:visible'),
      ).toHaveCSS('background-color', 'rgb(212, 212, 216)');
      await expect(
        samples.getByRole('checkbox', {name: 'Disabled checked', exact: true}),
      ).toBeChecked();
      await expect(
        samples.getByRole('checkbox', {name: 'Disabled checked', exact: true}),
      ).toBeDisabled();
      await expect(
        samples.getByRole('checkbox', {
          name: 'Disabled unchecked',
          exact: true,
        }),
      ).not.toBeChecked();
    }
  });
  test(`${density}: switch proportions and travel`, async ({page}) => {
    await page.emulateMedia({reducedMotion: 'reduce'});
    await page.goto('/examples/sizes');
    await page.getByRole('radio', {name: density, exact: true}).click();
    const placeholder = page.locator('.astryx-text-input-control').first();
    await expect(placeholder).toBeVisible();
    expect(
      await placeholder.evaluate(node => {
        node.setAttribute('placeholder', 'Placeholder text');
        return getComputedStyle(node, '::placeholder').color;
      }),
    ).toBe('rgb(158, 158, 158)');
    await expect(page.locator('.astryx-switch-label').first()).toHaveCSS(
      'font-size',
      density === 'Base' ? '13.5px' : '12px',
    );
    for (const size of ['default', 'md', 'lg']) {
      const section = page.getByTestId(`size-${size}`);
      const track = section.locator('.astryx-switch');
      const thumb = section.locator('.astryx-switch-thumb');
      const height = density === 'Base' ? 24 : 20;
      const inner = height - 4;
      await expect(track).toHaveCSS('height', `${height}px`);
      await expect(track).toHaveCSS('width', `${inner * 2.5 + 4}px`);
      for (const checked of [true, false, true]) {
        const input = section.getByRole('switch');
        await input.setChecked(checked);
        await expect(thumb).toHaveCSS('width', `${inner * 1.5}px`);
        await expect(thumb).toHaveCSS('height', `${inner}px`);
        await expect(thumb).toHaveCSS(
          'transform',
          `matrix(1, 0, 0, 1, ${checked ? inner : 0}, 0)`,
        );
      }
    }
    await page.getByTestId('size-lg').scrollIntoViewIfNeeded();
    await page.screenshot({
      path: `/tmp/minim-switch-${density.toLowerCase()}-${test.info().project.name}.png`,
    });
  });
  test(`${density}: file input icon slots and loading states`, async ({
    page,
  }) => {
    await page.goto('/examples/sizes');
    await page.getByRole('radio', {name: density, exact: true}).click();
    await expect(
      page.getByRole('radio', {name: density, exact: true}),
    ).toHaveAttribute('aria-checked', 'true');
    const base = density === 'Base';
    for (const mode of ['input', 'dropzone']) {
      const field = page.locator('.astryx-file-input').filter({
        has: page.getByTestId(`file-${mode}-default`),
      });
      const icon = field.locator('.astryx-file-input-icon');
      await expect(icon).toHaveCSS('width', base ? '24px' : '20px');
      await expect(icon).toHaveCSS('height', base ? '28px' : '24px');
      await expect(icon).toHaveCSS('color', 'rgb(113, 113, 122)');
      await expect(icon).toHaveCSS('font-size', base ? '22px' : '20px');
      const glyph = icon.locator('[data-minim-icon="arrow-up"] > span');
      await expect(glyph).toHaveCSS('font-size', base ? '16.5px' : '15px');
      await expect(glyph).toHaveCSS('font-weight', '500');
      await expect(icon).toHaveCSS('font-weight', '500');
      await expect(field.getByText('Choose file', {exact: true})).toHaveCSS(
        'font-size',
        base ? '16.5px' : '15px',
      );
      await expect(field).toHaveCSS('padding-left', base ? '12px' : '10px');
      const disabled = page.locator('.astryx-file-input').filter({
        has: page.getByTestId(`file-${mode}-disabled`),
      });
      await expect(disabled.locator('.astryx-file-input-icon')).toHaveCSS(
        'color',
        'rgb(24, 24, 27)',
      );
      const success = page.locator('.astryx-file-input').filter({
        has: page.getByTestId(`file-${mode}-success`),
      });
      await expect(success).toHaveCSS('border-top-color', 'rgba(0, 0, 0, 0.1)');
      const warning = page.locator('.astryx-file-input').filter({
        has: page.getByTestId(`file-${mode}-warning`),
      });
      await expect(warning).toHaveCSS('border-top-color', 'rgb(217, 119, 6)');
      const loading = page.locator('.astryx-file-input').filter({
        has: page.getByTestId(`file-${mode}-loading`),
      });
      await expect(loading.locator('.astryx-spinner')).toBeVisible();
      await expect(loading.locator('.astryx-file-input-icon')).toHaveCount(
        mode === 'input' ? 1 : 0,
      );
      if (mode === 'input') {
        await expect(warning.locator('.astryx-input-status-icon')).toHaveCSS(
          'font-size',
          base ? '22px' : '20px',
        );
        await expect(success.locator('.astryx-input-status-icon')).toHaveCSS(
          'font-size',
          base ? '22px' : '20px',
        );
        await expect(field).toHaveCSS('height', base ? '44px' : '36px');
      } else {
        await expect(field).toHaveCSS('height', base ? '98px' : '82px');
      }
    }
  });
}

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
      await expect(section.locator('.astryx-token-remove')).toHaveCSS(
        'margin-inline-end',
        '0px',
      );
      const medium = size === 'md';
      const height = mode === 'Base' ? (medium ? 36 : 44) : medium ? 28 : 36;
      const font = mode === 'Base' ? (medium ? 15 : 16.5) : medium ? 13.5 : 15;
      for (const pill of await section
        .locator('.astryx-badge, .astryx-token')
        .all()) {
        await expect(pill).toHaveAttribute('data-size', medium ? 'md' : 'lg');
        await expect(pill).toHaveCSS(
          'height',
          `${mode === 'Base' ? (medium ? 20 : 22) : medium ? 18 : 20}px`,
        );
        await expect(pill).toHaveCSS(
          'padding-left',
          mode === 'Base' ? '6px' : '4px',
        );
        await expect(pill).toHaveCSS(
          'padding-right',
          mode === 'Base' ? '6px' : '4px',
        );
        await expect(pill).toHaveCSS('column-gap', '4px');
      }
      const listItem = section.locator('.astryx-list-item').first();
      await expect(listItem).toHaveAttribute('data-size', medium ? 'md' : 'lg');
      await expect(listItem).toHaveCSS('height', `${height}px`);
      await expect(listItem.getByText('List item', {exact: true})).toHaveCSS(
        'font-size',
        `${font}px`,
      );
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
