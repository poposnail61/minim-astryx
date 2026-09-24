// Copyright (c) Meta Platforms, Inc. and affiliates.

import {test, expect, type Page} from '@playwright/test';
import {mkdir, writeFile} from 'node:fs/promises';

const screens = [
  '예약 목록',
  '예약 상세',
  '여행자 정보',
  '검색 필터',
  '여행 일정',
  '알림',
  '결제',
  '서류',
  '설정',
  '취소 요청',
];
async function select(page: Page, label: string, value: string) {
  await page.getByRole('combobox', {name: label, exact: true}).click();
  const popup = page.getByRole('listbox');
  await expect(popup).toBeVisible();
  await expect(
    page.locator('.astryx-selector-popup').filter({has: popup}),
  ).toHaveCSS('padding', '0px');
  await expect(
    page
      .locator('.astryx-selector')
      .filter({has: page.getByRole('combobox', {name: label, exact: true})}),
  ).toHaveAttribute('data-size', 'lg');
  const insets = await popup.evaluate(el => {
    const css = getComputedStyle(el);
    return {
      padding: css.paddingTop,
      expected: css.getPropertyValue('--selector-list-padding').trim(),
    };
  });
  expect(parseFloat(insets.padding)).toBeGreaterThan(0);
  if (label === '예시 화면') {
    await page.screenshot({
      path: `/tmp/minim-mobile/menu-${page.viewportSize()!.width}-${insets.padding}.png`,
      animations: 'disabled',
    });
    const row = popup.getByRole('option').first();
    const metrics = await row.evaluate(el => {
      const css = getComputedStyle(el);
      const label = Array.from(el.querySelectorAll('span')).find(
        n => n.childElementCount === 0 && n.textContent?.trim(),
      )!;
      return {
        height: el.getBoundingClientRect().height,
        font: getComputedStyle(label).fontSize,
        padding: css.paddingTop,
      };
    });
    await writeFile(
      `/tmp/minim-mobile/menu-${page.viewportSize()!.width}-${insets.padding}.json`,
      JSON.stringify(metrics),
    );
  }
  const box = (await popup.boundingBox())!;
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(page.viewportSize()!.width + 1);
  await page.getByRole('option', {name: value, exact: true}).click();
}

async function snapshot(page: Page, name: string) {
  await page.evaluate(() => document.fonts.ready);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  ).toBe(true);
  expect(await page.locator('button button').count()).toBe(0);
  const imagesLoaded = () =>
    page
      .locator('main img')
      .evaluateAll(nodes =>
        nodes.every(
          n =>
            (n as HTMLImageElement).complete &&
            (n as HTMLImageElement).naturalWidth > 0,
        ),
      );
  await expect.poll(imagesLoaded).toBe(true);
  const overflow = await page.locator('main').evaluate(root =>
    Array.from(root.querySelectorAll<HTMLElement>('button, input, textarea'))
      .filter(n => {
        const b = n.getBoundingClientRect();
        return b.width > 0 && (b.left < -1 || b.right > innerWidth + 1);
      })
      .map(n => n.textContent || n.getAttribute('aria-label')),
  );
  expect(overflow).toEqual([]);
  await page.screenshot({
    path: `/tmp/minim-mobile/${name}.png`,
    fullPage: true,
    animations: 'disabled',
  });
}

for (const density of ['base', 'compact']) {
  for (const [index, title] of screens.entries()) {
    test(`${density} ${index + 1} ${title}`, async ({page}, info) => {
      await mkdir('/tmp/minim-mobile', {recursive: true});
      const errors: string[] = [];
      page.on('pageerror', e => errors.push(e.message));
      await page.goto('/examples/mobile');
      await expect(async () => {
        await page.getByRole('radio', {name: 'Compact', exact: true}).click();
        await expect(
          page.getByRole('radio', {name: 'Compact', exact: true}),
        ).toHaveAttribute('aria-checked', 'true', {timeout: 1000});
      }).toPass({timeout: 30000});
      await page
        .getByRole('radio', {
          name: density === 'base' ? 'Base' : 'Compact',
          exact: true,
        })
        .click();
      if (index) {
        await select(page, '예시 화면', title);
      }
      await expect(
        page.getByRole('heading', {name: title, exact: true, level: 1}),
      ).toBeVisible();
      const id = `${info.project.name}-${density}-${index + 1}`;
      await snapshot(page, id);
      const controls = await page
        .locator('main button, main input, main [role="switch"]')
        .evaluateAll(nodes =>
          nodes.map(n => {
            const b = n.getBoundingClientRect();
            return {
              name: n.getAttribute('aria-label') || n.textContent,
              width: b.width,
              height: b.height,
            };
          }),
        );
      await writeFile(
        `/tmp/minim-mobile/${id}.json`,
        JSON.stringify(controls, null, 2),
      );

      if (index === 0) {
        await page.getByRole('textbox', {name: '예약 검색'}).fill('없는예약');
        await expect(page.getByText('검색 결과가 없습니다.')).toBeVisible();
        await snapshot(page, `${id}-empty`);
        await page.getByRole('button', {name: '검색 초기화'}).click();
        await expect(page.getByText('총 3건')).toBeVisible();
        await page.getByRole('button', {name: '김민지 예약 보기'}).click();
        await expect(
          page.getByRole('heading', {name: '예약 상세', exact: true}),
        ).toBeVisible();
      } else if (index === 1) {
        await page.getByRole('button', {name: '예약 작업'}).click();
        await snapshot(page, `${id}-menu`);
        await page.getByRole('menuitem', {name: '예약 번호 확인'}).click();
        await expect(page.getByText('예약 번호 YT-2401')).toBeVisible();
      } else if (index === 2) {
        await page.getByRole('button', {name: '여행자 저장'}).click();
        await expect(
          page
            .locator('.astryx-field-status')
            .filter({hasText: '이메일 주소를 확인해주세요.'}),
        ).toBeVisible();
        await snapshot(page, `${id}-errors`);
        await page
          .getByRole('textbox', {name: '이름', exact: true})
          .fill('김민지');
        await page
          .getByRole('textbox', {name: '이메일', exact: true})
          .fill('minji@example.com');
        await page.getByRole('checkbox').check();
        await page.getByRole('button', {name: '여행자 저장'}).click();
        await expect(
          page.getByText('여행자 정보를 저장했습니다.'),
        ).toBeVisible();
      } else if (index === 3) {
        await select(page, '여행지', '도쿄');
        await page.getByRole('radio', {name: '가이드 동행'}).click();
        await page.getByRole('checkbox', {name: '직항 항공편만 보기'}).check();
        await page.getByRole('button', {name: '필터 적용'}).click();
        await expect(
          page.getByText('도쿄 · 가이드 동행 조건을 적용했습니다.'),
        ).toBeVisible();
        await page.getByRole('button', {name: '필터 초기화'}).click();
        await expect(page.getByRole('checkbox')).not.toBeChecked();
      } else if (index === 4) {
        await page.getByRole('radio', {name: '2일차'}).click();
        await expect(page.getByText('11:00 아사쿠사 산책')).toBeVisible();
        await page.getByRole('checkbox').check();
        await expect(page.getByText('2일차 확인 완료')).toBeVisible();
      } else if (index === 5) {
        for (const icon of [
          'check-circle-solid',
          'warning-triangle-solid',
          'close-circle-solid',
        ]) {
          await expect(
            page.locator(`[data-minim-icon="${icon}"]`),
          ).toBeVisible();
        }
        await page.getByRole('button', {name: '모두 읽음'}).click();
        await page.getByRole('radio', {name: '읽지 않음', exact: true}).click();
        await expect(page.getByText('새로운 알림이 없습니다.')).toBeVisible();
      } else if (index === 6) {
        await expect(
          page.getByRole('button', {name: '결제 확인', exact: true}),
        ).toBeDisabled();
        await page.getByRole('radio', {name: '계좌 이체'}).click();
        await expect(
          page.getByText('입금 확인 후 예약이 확정됩니다.'),
        ).toBeVisible();
        await page.getByRole('checkbox').check();
        await page
          .getByRole('button', {name: '결제 확인', exact: true})
          .click();
        await expect(
          page.getByText('예시 결제 확인을 완료했습니다.'),
        ).toBeVisible();
      } else if (index === 7) {
        await expect(
          page.getByRole('button', {name: '준비 완료'}),
        ).toBeDisabled();
        for (const name of ['여권 사본', '항공권', '숙박 예약 확인서']) {
          await page.getByRole('checkbox', {name, exact: true}).check();
        }
        await page.getByRole('button', {name: '준비 완료'}).click();
        await expect(
          page.getByText('여행 서류 확인을 마쳤습니다.'),
        ).toBeVisible();
      } else if (index === 8) {
        await page.getByRole('switch', {name: '예약 변경 알림'}).uncheck();
        await page
          .getByRole('switch', {name: '이메일로 여행 소식 받기'})
          .check();
        await expect(
          page.getByRole('switch', {name: '보안 알림 (필수)'}),
        ).toBeDisabled();
        await expect(
          page.getByText('예약 알림 꺼짐 · 이메일 켜짐'),
        ).toBeVisible();
        await select(page, '언어', 'English');
      } else {
        await page
          .getByRole('textbox', {name: '추가 내용'})
          .fill('일정이 변경되어 취소를 요청합니다.');
        await page.getByRole('button', {name: '취소 요청하기'}).click();
        const dialog = page.getByRole('dialog');
        await expect(dialog).toBeVisible();
        const b = (await dialog.boundingBox())!;
        expect(b.x).toBeGreaterThanOrEqual(0);
        expect(b.x + b.width).toBeLessThanOrEqual(page.viewportSize()!.width);
        await snapshot(page, `${id}-dialog`);
        await page.getByRole('button', {name: '돌아가기', exact: true}).click();
        await expect(dialog).not.toBeVisible();
        await page.getByRole('button', {name: '취소 요청하기'}).click();
        await page.getByRole('button', {name: '요청 확정'}).click();
        await expect(
          page.getByText('예시 취소 요청이 접수되었습니다.'),
        ).toBeVisible();
      }
      await snapshot(page, `${id}-after`);
      expect(errors).toEqual([]);
    });
  }
}
