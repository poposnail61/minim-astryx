// Copyright (c) Meta Platforms, Inc. and affiliates.

import {test, expect, type Page} from '@playwright/test';

const errors = new WeakMap<Page, string[]>();
test.beforeEach(async ({page}) => {
  const messages: string[] = [];
  errors.set(page, messages);
  page.on('pageerror', error => messages.push(error.message));
  page.on('console', message => {
    if (
      message.type() === 'error' &&
      /hydration|unstable value|cannot be a descendant/i.test(message.text())
    ) {
      messages.push(message.text());
    }
  });
});
test.afterEach(async ({page}) => {
  expect(errors.get(page)).toEqual([]);
});

async function inspect(page: Page, name: string) {
  await page.evaluate(() => document.fonts.ready);
  await expect
    .poll(() =>
      page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    )
    .toBe(true);
  await expect
    .poll(() =>
      page.locator('main').evaluate(n => n.scrollWidth <= n.clientWidth),
    )
    .toBe(true);
  await expect
    .poll(() =>
      page
        .locator('img')
        .evaluateAll(nodes =>
          nodes.every(
            n =>
              (n as HTMLImageElement).complete &&
              (n as HTMLImageElement).naturalWidth > 0,
          ),
        ),
    )
    .toBe(true);
  await page.screenshot({
    path: `/tmp/minim-new-mobile/${name}.png`,
    fullPage: true,
    animations: 'disabled',
  });
}
for (const density of ['Base', 'Compact']) {
  test(`input icon contracts ${density}`, async ({page}) => {
    await page.goto('/examples/apps/wallet');
    await page.getByRole('radio', {name: density, exact: true}).click();
    await page.goto('/examples/menus');
    for (const target of [
      '.astryx-input-start-icon',
      '.astryx-date-range-input-toggle-icon',
      '.astryx-date-time-input-toggle-icon',
      '.astryx-date-time-input-clock-icon',
      '.astryx-time-input',
    ]) {
      const glyph = page.locator(`${target} [data-minim-icon] > span`).first();
      await expect(glyph).toHaveCSS('color', 'rgb(24, 24, 27)');
      await expect(glyph).toHaveCSS('font-weight', '500');
    }
  });
  test(`fitness flow ${density}`, async ({page}, info) => {
    await page.goto('/examples/apps/fitness');
    await page.getByRole('radio', {name: density, exact: true}).click();
    await inspect(page, `${info.project.name}-fitness-${density}`);
    await page.getByRole('button', {name: '상체 A 시작', exact: true}).click();
    await page
      .getByRole('spinbutton', {name: '1번 운동 1세트 무게', exact: true})
      .fill('45');
    await page
      .getByRole('spinbutton', {name: '1번 운동 1세트 무게', exact: true})
      .blur();
    await page
      .getByRole('button', {name: '1번 운동 1세트 완료', exact: true})
      .click();
    await expect(page.getByText('세트 사이 휴식')).toBeVisible();
    await inspect(page, `${info.project.name}-session-${density}`);
    await page.getByRole('button', {name: '휴식 건너뛰기'}).click();
    await page.getByRole('button', {name: '운동 완료', exact: true}).click();
    await expect(page.getByText('오늘 운동을 저장했어요.')).toBeVisible();
    await expect(page.getByText(/1세트 · 450kg/)).toBeVisible();
    await page.getByRole('button', {name: '루틴', exact: true}).click();
    await page.getByRole('button', {name: '상체 A 편집', exact: true}).click();
    await page.getByRole('textbox', {name: '루틴 이름'}).fill('나의 상체 루틴');
    await page.getByRole('checkbox', {name: '스쿼트', exact: true}).check();
    await inspect(page, `${info.project.name}-routine-editor-${density}`);
    await page.getByRole('button', {name: '루틴 저장'}).click();
    await expect(
      page.getByRole('heading', {name: '나의 상체 루틴'}),
    ).toBeVisible();
    await page.reload();
    await page.getByRole('button', {name: '기록', exact: true}).click();
    await expect(page.getByText(/1세트 · 450kg/)).toBeVisible();
  });
  test(`wallet flow ${density}`, async ({page}, info) => {
    await page.goto('/examples/apps/wallet');
    await page.getByRole('radio', {name: density, exact: true}).click();
    await inspect(page, `${info.project.name}-wallet-${density}`);
    await page.getByRole('button', {name: '지출 추가', exact: true}).click();
    const calendarIcon = page.locator('.astryx-date-input-toggle-icon');
    const selectorIcon = page.locator('main .astryx-selector-indicator-icon');
    await expect(selectorIcon).toHaveCSS('color', 'rgb(24, 24, 27)');
    await expect(selectorIcon.locator('[data-minim-icon] > span')).toHaveCSS(
      'font-weight',
      '500',
    );
    await expect(calendarIcon).toHaveCSS('color', 'rgb(24, 24, 27)');
    await expect(
      calendarIcon.locator('[data-minim-icon="calendar"] > span'),
    ).toHaveCSS('font-weight', '500');
    await page.getByRole('button', {name: '지출 저장'}).click();
    await expect(page.getByText('사용처를 입력해주세요.')).toBeVisible();
    await page
      .getByRole('textbox', {name: '사용처', exact: true})
      .fill('테스트 식당');
    await page
      .getByRole('spinbutton', {name: '금액', exact: true})
      .fill('18000');
    await page.getByRole('spinbutton', {name: '금액', exact: true}).blur();
    await page.getByRole('textbox', {name: '지출 메모'}).fill('친구와 점심');
    await page.getByRole('button', {name: '지출 저장'}).click();
    await expect(page.getByText('지출을 저장했어요.')).toBeVisible();
    await page.reload();
    await page.getByRole('button', {name: '테스트 식당 상세'}).click();
    await expect(
      page.getByRole('textbox', {name: '사용처', exact: true}),
    ).toHaveValue('테스트 식당');
    await expect(page.getByRole('textbox', {name: '지출 메모'})).toHaveValue(
      '친구와 점심',
    );
    await page.getByRole('button', {name: '지출 삭제', exact: true}).click();
    await expect(page.getByRole('alertdialog')).toBeVisible();
    await inspect(page, `${info.project.name}-delete-dialog-${density}`);
    await page.getByRole('button', {name: '삭제 취소'}).click();
    await page.getByRole('button', {name: '입력 닫기'}).click();
    await page.getByRole('button', {name: '예산', exact: true}).click();
    await page
      .getByRole('spinbutton', {name: '이번 달 생활비 예산'})
      .fill('600000');
    await page.getByRole('spinbutton', {name: '이번 달 생활비 예산'}).blur();
    await page.getByRole('button', {name: '예산 저장'}).click();
    await expect(page.getByText('예산을 저장했어요.')).toBeVisible();
    await inspect(page, `${info.project.name}-budget-${density}`);
    await page.getByRole('button', {name: '내역', exact: true}).click();
    await page.getByRole('button', {name: '내역 필터 열기'}).click();
    await page.getByRole('checkbox', {name: '생활', exact: true}).uncheck();
    await inspect(page, `${info.project.name}-filters-${density}`);
    await page.getByRole('button', {name: '필터 적용'}).click();
    await expect(page.getByRole('button', {name: '마켓컬리 상세'})).toHaveCount(
      0,
    );
  });
  test(`music flow ${density}`, async ({page}, info) => {
    await page.goto('/examples/apps/music');
    await page.getByRole('radio', {name: density, exact: true}).click();
    await inspect(page, `${info.project.name}-music-${density}`);
    await page
      .getByRole('button', {name: 'Slow Morning 좋아요', exact: true})
      .click();
    await page
      .getByRole('button', {name: 'Slow Morning 재생', exact: true})
      .click();
    await expect(
      page.getByRole('button', {name: '일시 정지', exact: true}),
    ).toBeVisible();
    await expect(
      page.getByRole('slider', {name: '재생 위치'}),
    ).not.toHaveAttribute('aria-valuenow', '0');
    await page.getByRole('button', {name: '일시 정지', exact: true}).click();
    await inspect(page, `${info.project.name}-player-${density}`);
    await page.getByRole('button', {name: '다음 곡', exact: true}).click();
    await expect(
      page.getByRole('heading', {name: 'City After Rain', exact: true}),
    ).toBeVisible();
    await page.reload();
    await page.getByRole('button', {name: '보관함', exact: true}).click();
    await expect(page.getByText('1곡의 나다운 취향')).toBeVisible();
    await page.getByRole('button', {name: '둘러보기', exact: true}).click();
    await page.getByRole('button', {name: 'Slow Morning 곡 메뉴'}).click();
    await page
      .getByRole('button', {name: '플레이리스트에 담기', exact: true})
      .click();
    await page.getByRole('textbox', {name: '플레이리스트 이름'}).fill('출근길');
    await page
      .getByRole('checkbox', {name: 'Green Window', exact: true})
      .check();
    await inspect(page, `${info.project.name}-playlist-${density}`);
    await page.getByRole('button', {name: '플레이리스트 저장'}).click();
    await page.reload();
    await page.getByRole('button', {name: '보관함', exact: true}).click();
    await expect(page.getByRole('heading', {name: '출근길'})).toBeVisible();
    await expect(page.getByText('2곡 · 나만의 순서로 듣기')).toBeVisible();
  });
}
