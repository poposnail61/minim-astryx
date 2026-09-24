// Copyright (c) Meta Platforms, Inc. and affiliates.

import {test, expect, type Page} from '@playwright/test';
import {mkdir, writeFile} from 'node:fs/promises';

async function screenshot(page: Page, name: string) {
  await page.evaluate(() => document.fonts.ready);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  ).toBe(true);
  await page.screenshot({
    path: `/tmp/minim-examples/${name}.png`,
    fullPage: true,
    animations: 'disabled',
  });
}

for (const density of ['base', 'compact'] as const) {
  test(`${density}: settings, detail and feedback review`, async ({
    page,
  }, info) => {
    await mkdir('/tmp/minim-examples', {recursive: true});
    await page.goto('/examples');
    await expect(async () => {
      await page.getByRole('radio', {name: 'Compact', exact: true}).click();
      await expect(
        page.getByRole('radio', {name: 'Compact', exact: true}),
      ).toHaveAttribute('aria-checked', 'true', {timeout: 1000});
    }).toPass({timeout: 30_000});
    await page
      .getByRole('radio', {
        name: density === 'base' ? 'Base' : 'Compact',
        exact: true,
      })
      .click();
    const report: Record<string, unknown> = {};
    for (const [label, slug] of [
      ['설정', 'settings'],
      ['예약 상세', 'detail'],
      ['처리 상태', 'feedback'],
    ]) {
      await page.getByRole('radio', {name: label, exact: true}).click();
      await screenshot(page, `${info.project.name}-${density}-${slug}`);
      report[slug] = await page.locator('main').evaluate(root => {
        const selectors = [
          '.astryx-switch',
          '.astryx-radio-indicator',
          '.astryx-checkbox-indicator',
          '.astryx-avatar',
          '.astryx-card',
          '.astryx-field-status',
          '.astryx-text-input-control',
          '.astryx-banner',
          '.astryx-button',
        ];
        return selectors.flatMap(selector =>
          Array.from(root.querySelectorAll(selector)).map(node => {
            const css = getComputedStyle(node);
            const box = node.getBoundingClientRect();
            const backgrounds: string[] = [];
            for (
              let parent: Element | null = node;
              parent;
              parent = parent.parentElement
            ) {
              backgrounds.push(getComputedStyle(parent).backgroundColor);
            }
            return {
              selector,
              text: node.textContent,
              size: node.getAttribute('data-size'),
              width: box.width,
              height: box.height,
              font: css.fontSize,
              color: css.color,
              backgrounds,
              padding: css.padding,
              radius: css.borderRadius,
            };
          }),
        );
      });
      if (slug === 'settings') {
        for (const [index, width, height, thumbWidth] of [
          [0, 54, density === 'base' ? 24 : 20, 30],
          [1, 64, density === 'base' ? 28 : 24, 36],
        ]) {
          const field = page.locator('.astryx-switch-field').nth(index);
          const input = field.getByRole('switch');
          const track = field.locator('.astryx-switch');
          const thumb = field.locator('.astryx-switch-thumb');
          const box = await track.boundingBox();
          expect(box!.width).toBe(width);
          expect(box!.height).toBe(height);
          const inputBox = await input.boundingBox();
          expect(inputBox!.width).toBe(width);
          expect(inputBox!.height).toBeGreaterThanOrEqual(height);
          for (const checked of [false, true]) {
            await input.setChecked(checked);
            await expect
              .poll(async () => {
                const t = (await thumb.boundingBox())!;
                return Math.round(t.x - box!.x);
              })
              .toBe(checked ? width - thumbWidth - 2 : 2);
            const t = (await thumb.boundingBox())!;
            expect(t.width).toBe(thumbWidth);
            expect(t.height).toBe(height - 4);
          }
        }
        await screenshot(
          page,
          `${info.project.name}-${density}-switch-updated`,
        );
        await page
          .getByRole('radio', {name: '등록된 휴대전화로 문자 메시지 받기'})
          .click();
        await page.getByRole('button', {name: '설정 저장'}).click();
        await expect(
          page.getByText('알림 설정이 저장되었습니다.'),
        ).toBeVisible();
      }
      if (slug === 'detail') {
        await page
          .getByRole('button', {name: '결제 확인', exact: true})
          .click();
        await expect(
          page.getByRole('button', {name: '결제 확인 완료'}),
        ).toBeDisabled();
      }
      if (slug === 'feedback') {
        for (const glyph of [
          'check-circle-solid',
          'warning-triangle-solid',
          'close-circle-solid',
        ]) {
          await expect(
            page.locator(`[data-minim-icon="${glyph}"]`).first(),
          ).toBeVisible();
        }
        await expect(
          page.locator(
            '[data-minim-icon="check-circle"], [data-minim-icon="warning-triangle"], [data-minim-icon="close-circle"]',
          ),
        ).toHaveCount(0);
        await page
          .getByRole('button', {name: '예약서 발송', exact: true})
          .click();
        await expect(
          page.getByRole('button', {name: '발송 중지'}),
        ).toBeVisible();
        await screenshot(page, `${info.project.name}-${density}-loading`);
        await page.getByRole('button', {name: '발송 중지'}).click();
      }
    }
    await writeFile(
      `/tmp/minim-examples/${info.project.name}-${density}-review.json`,
      JSON.stringify(report, null, 2),
    );
  });
  test(`${density}: composed pages and interactions`, async ({page}, info) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await mkdir('/tmp/minim-examples', {recursive: true});
    await page.goto('/examples');
    // SSR controls are visible before hydration. Confirm an actual state change
    // before exercising the form so early clicks cannot be silently discarded.
    await expect(async () => {
      const compact = page.getByRole('radio', {name: 'Compact', exact: true});
      await compact.click();
      await expect(compact).toHaveAttribute('aria-checked', 'true', {
        timeout: 1000,
      });
    }).toPass({timeout: 30_000});
    await page
      .getByRole('radio', {
        name: density === 'base' ? 'Base' : 'Compact',
        exact: true,
      })
      .click();
    await expect(
      page.getByRole('radio', {
        name: density === 'base' ? 'Base' : 'Compact',
        exact: true,
      }),
    ).toHaveAttribute('aria-checked', 'true');
    const name = `${info.project.name}-${density}`;
    await expect(page.getByRole('heading', {name: '예약 관리'})).toBeVisible();
    const height = await page
      .getByRole('button', {name: '예약 추가', exact: true})
      .evaluate(node => node.getBoundingClientRect().height);
    expect(height).toBeCloseTo(density === 'base' ? 36 : 28, 0);
    await screenshot(page, `${name}-reservations`);
    await page.getByRole('textbox', {name: '예약 검색'}).fill('김민지');
    await expect(page.getByText('총 1건')).toBeVisible();
    await page.getByRole('button', {name: '목록 작업'}).click();
    await expect(page.getByRole('menu')).toBeVisible();
    await screenshot(page, `${name}-menu`);
    const menuBox = await page.getByRole('menu').boundingBox();
    expect(menuBox).not.toBeNull();
    expect(menuBox!.x).toBeGreaterThanOrEqual(0);
    expect(menuBox!.x + menuBox!.width).toBeLessThanOrEqual(
      page.viewportSize()!.width,
    );
    await page.getByRole('menuitem', {name: '필터 초기화'}).click();
    await expect(page.getByText('총 4건')).toBeVisible();
    await page.getByRole('combobox', {name: '예약 상태'}).click();
    await page.getByRole('option', {name: '확인 필요', exact: true}).click();
    await expect(page.getByText('총 1건')).toBeVisible();

    await page.getByRole('button', {name: '예약 추가', exact: true}).click();
    await expect(
      page.getByRole('textbox', {name: '예약 번호'}),
    ).toHaveAttribute('readonly', '');
    await expect(page.getByRole('textbox', {name: '담당자'})).toBeDisabled();
    const insets = await page
      .getByRole('textbox', {name: '요청 사항'})
      .evaluate(node => {
        const style = getComputedStyle(node);
        return {
          inline: parseFloat(style.paddingInlineStart),
          block: parseFloat(style.paddingBlockStart),
        };
      });
    expect(insets.inline).toBe(density === 'base' ? 12 : 8);
    expect(insets.block).toBe(density === 'base' ? 8 : 5);
    await screenshot(page, `${name}-form`);
    await page.getByRole('button', {name: '저장', exact: true}).click();
    await expect(
      page
        .locator('.astryx-field-status')
        .filter({hasText: '이메일 주소를 확인해주세요.'}),
    ).toBeVisible();
    await screenshot(page, `${name}-validation`);
    await page
      .getByRole('textbox', {name: '이메일', exact: true})
      .fill('minim@example.com');
    await page.getByRole('button', {name: '저장', exact: true}).click();
    await expect(page.getByText('예시 예약을 저장했습니다.')).toBeVisible();

    await page.getByRole('radio', {name: '상담', exact: true}).click();
    await screenshot(page, `${name}-conversation`);
    const composer = page.locator('[contenteditable="true"][role="textbox"]');
    await composer.fill('오전 10시 이후로 부탁드립니다.');
    await composer.press('Enter');
    await expect(
      page.getByText('오전 10시 이후로 부탁드립니다.', {exact: true}),
    ).toBeVisible();
    expect(errors).toEqual([]);
    expect(await page.locator('button button, a a, button input').count()).toBe(
      0,
    );
    const icons = await page.locator('[data-minim-icon]').evaluateAll(nodes =>
      nodes
        .map(node => {
          const box = node.getBoundingClientRect();
          return {width: box.width, height: box.height};
        })
        .filter(box => box.width > 0 && box.height > 0),
    );
    expect(icons.length).toBeGreaterThan(0);
    for (const icon of icons) {
      expect(Math.abs(icon.width - icon.height)).toBeLessThan(1);
    }
  });
}
