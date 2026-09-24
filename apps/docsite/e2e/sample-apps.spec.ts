// Copyright (c) Meta Platforms, Inc. and affiliates.

import {test, expect, type Page} from '@playwright/test';

test('badge and token use typography heights', async ({page}, info) => {
  for (const component of ['Badge', 'Token']) {
    await page.goto(`/components/${component}`);
    const items = page.locator(
      `.astryx-${component.toLowerCase()}:not([data-size="dot"])`,
    );
    await expect(items.first()).toBeVisible();
    const measurements = await items.evaluateAll(nodes =>
      nodes.map(node => {
        const style = getComputedStyle(node);
        const size = node.getAttribute('data-size') === 'lg' ? 'lg' : 'md';
        const rem = parseFloat(
          style.getPropertyValue(`--minim-typography-line-height-${size}`),
        );
        return {
          actual: parseFloat(style.height),
          expected:
            rem *
            parseFloat(getComputedStyle(document.documentElement).fontSize),
        };
      }),
    );
    for (const {actual, expected} of measurements) {
      expect(actual).toBeCloseTo(expected, 1);
    }
    await page.screenshot({
      path: `/tmp/minim-sample-apps/${info.project.name}-${component}-height.png`,
    });
  }
});

async function visual(page: Page, name: string, project: string) {
  await expect
    .poll(() =>
      page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    )
    .toBe(true);
  await expect
    .poll(() =>
      page
        .locator('main img')
        .evaluateAll(images =>
          images.every(
            img =>
              (img as HTMLImageElement).complete &&
              (img as HTMLImageElement).naturalWidth > 0,
          ),
        ),
    )
    .toBe(true);
  await page.screenshot({
    path: `/tmp/minim-sample-apps/${project}-${name}.png`,
    fullPage: (await page.getByRole('dialog').count()) === 0,
    animations: 'disabled',
  });
}

for (const density of ['Base', 'Compact']) {
  test(`travel main flow ${density}`, async ({page}, info) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('/examples/apps/travel');
    await page.getByRole('radio', {name: density, exact: true}).click();
    await visual(page, `travel-${density}`, info.project.name);
    await page.getByRole('button', {name: '일정 추가', exact: true}).click();
    const inputPadding = density === 'Base' ? '12px' : '10px';
    await expect(
      page.getByRole('dialog').locator('.astryx-text-input').first(),
    ).toHaveCSS('padding-left', inputPadding);
    await expect(
      page.getByRole('dialog').locator('.astryx-text-area'),
    ).toHaveCSS('padding-left', '0px');
    await expect(
      page
        .getByRole('dialog')
        .getByRole('textbox', {name: '메모', exact: true}),
    ).toHaveCSS('padding-left', inputPadding);
    await visual(page, `travel-form-${density}`, info.project.name);
    await page.getByRole('button', {name: '일정 저장'}).click();
    await expect(
      page.getByRole('dialog').getByText('일정 이름을 입력해주세요.'),
    ).toBeVisible();
    await page.getByRole('textbox', {name: '일정 이름'}).fill('서점 방문');
    await page
      .getByRole('textbox', {name: '장소', exact: true})
      .fill('다이칸야마');
    await page.getByRole('button', {name: '일정 저장'}).click();
    await expect(page.getByRole('heading', {name: '서점 방문'})).toBeVisible();
    await page.reload();
    await expect(page.getByRole('heading', {name: '서점 방문'})).toBeVisible();
    await page.getByRole('button', {name: '상세 보기'}).nth(1).click();
    await page.getByRole('button', {name: '일정 수정'}).click();
    await page.getByRole('textbox', {name: '일정 이름'}).fill('서점과 카페');
    await page.getByRole('button', {name: '일정 저장'}).click();
    await expect(
      page.getByRole('heading', {name: '서점과 카페'}),
    ).toBeVisible();
    await page.getByRole('radio', {name: '예약', exact: true}).click();
    await page.getByRole('button', {name: '예약 상세'}).first().click();
    await expect(page.getByRole('dialog')).toContainText('TRV2601');
    await page.keyboard.press('Escape');
    await page.getByRole('radio', {name: '준비물', exact: true}).click();
    await page.getByRole('checkbox', {name: '충전기 · 어댑터'}).check();
    await expect(
      page.getByRole('checkbox', {name: '충전기 · 어댑터'}),
    ).toBeChecked();
    expect(errors).toEqual([]);
  });

  test(`kitchen main flow ${density}`, async ({page}, info) => {
    await page.goto('/examples/apps/kitchen');
    await page.getByRole('radio', {name: density, exact: true}).click();
    await visual(page, `kitchen-${density}`, info.project.name);
    await page.getByRole('textbox', {name: '레시피 검색'}).fill('없는 메뉴');
    await expect(page.getByText('찾는 레시피가 없어요')).toBeVisible();
    await page.getByRole('button', {name: '검색 초기화'}).click();
    await page.getByRole('button', {name: '레시피 보기'}).first().click();
    await visual(page, `kitchen-detail-${density}`, info.project.name);
    await page.getByRole('spinbutton', {name: '인분'}).fill('3');
    await page.getByRole('spinbutton', {name: '인분'}).blur();
    await expect(page.getByText('300g', {exact: true})).toBeVisible();
    await page.getByRole('button', {name: '장보기 목록에 담기'}).click();
    await page.getByRole('button', {name: '장보기로 이동'}).click();
    await page.getByRole('checkbox', {name: '파스타', exact: true}).check();
    await page.reload();
    await page.getByRole('radio', {name: '장보기', exact: true}).click();
    await expect(
      page.getByRole('checkbox', {name: '파스타', exact: true}),
    ).toBeChecked();
    await page.getByRole('button', {name: '구매 완료 항목 삭제'}).click();
    await expect(
      page.getByRole('checkbox', {name: '파스타', exact: true}),
    ).toHaveCount(0);
  });

  test(`reading main flow ${density}`, async ({page}, info) => {
    await page.goto('/examples/apps/reading');
    await page.getByRole('radio', {name: density, exact: true}).click();
    await visual(page, `reading-${density}`, info.project.name);
    await page.getByRole('radio', {name: '책 찾기', exact: true}).click();
    await page.getByRole('textbox', {name: '책 검색'}).fill('Midnight');
    await page.getByRole('button', {name: '서재에 추가'}).click();
    await page.getByRole('button', {name: '독서 기록하기'}).click();
    await visual(page, `reading-record-${density}`, info.project.name);
    await page.getByRole('spinbutton', {name: '읽은 페이지'}).fill('304');
    await page.getByRole('spinbutton', {name: '읽은 페이지'}).blur();
    await page
      .getByRole('textbox', {name: '기억하고 싶은 문장과 생각'})
      .fill('다른 선택을 상상하게 되는 책.');
    await page.getByRole('button', {name: '기록 저장'}).click();
    await page.reload();
    await page.getByRole('radio', {name: '독서 기록', exact: true}).click();
    await expect(page.getByText('다른 선택을 상상하게 되는 책.')).toBeVisible();
    await expect(page.getByText('완독 · 304쪽 · 평점 미정')).toBeVisible();
  });
}
