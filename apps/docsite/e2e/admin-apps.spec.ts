// Copyright (c) Meta Platforms, Inc. and affiliates.

import {test, expect, type Page} from '@playwright/test';
const errors = new WeakMap<Page, string[]>();
test.beforeEach(async ({page}) => {
  const list: string[] = [];
  errors.set(page, list);
  page.on('pageerror', e => list.push(e.message));
  page.on('console', m => {
    if (
      m.type() === 'error' &&
      /hydration|cannot be a descendant|unstable value/.test(m.text())
    ) {
      list.push(m.text());
    }
  });
});
test.afterEach(async ({page}) => {
  expect(errors.get(page)).toEqual([]);
});
async function shot(page: Page, name: string) {
  await page.evaluate(() => document.fonts.ready);
  const menuItems = page.locator('nav[aria-label="업무 메뉴"] button');
  const first = await menuItems.nth(0).boundingBox();
  const second = await menuItems.nth(1).boundingBox();
  expect(first).not.toBeNull();
  expect(second).not.toBeNull();
  expect(second!.y - first!.y - first!.height).toBeCloseTo(2, 1);
  await expect
    .poll(() =>
      page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    )
    .toBe(true);
  await page.screenshot({path: `/tmp/minim-admin/${name}.png`, fullPage: true});
}
for (const density of ['Base', 'Compact']) {
  test(`search and selector typography ${density}`, async ({page}) => {
    await page.goto('/examples/admin/recruiting');
    await page.getByRole('radio', {name: density, exact: true}).click();
    const search = page.getByPlaceholder('지원자 이름 검색');
    const selector = page.locator('main .astryx-selector').first();
    const size = density === 'Base' ? '16.5px' : '15px';
    await expect(search).toHaveCSS('font-size', size);
    await expect(selector).toHaveCSS('font-size', size);
    await expect(
      selector
        .locator('span')
        .filter({hasText: /^전체$/})
        .last(),
    ).toHaveCSS('font-size', size);
  });
  test(`calendar today marker ${density}`, async ({page}, info) => {
    await page.clock.setFixedTime(new Date('2026-09-23T12:00:00'));
    await page.goto('/examples/admin/recruiting');
    await page.getByRole('radio', {name: density, exact: true}).click();
    await page.getByRole('button', {name: '김서현 검토'}).click();
    await page.locator('.astryx-date-input-toggle-icon').click();
    const today = page.locator('.astryx-calendar-day[aria-current="date"]');
    await expect(today).toBeVisible();
    await expect(today).toHaveCSS(
      'width',
      density === 'Base' ? '40px' : '32px',
    );
    await expect(today).toHaveCSS(
      'height',
      density === 'Base' ? '40px' : '32px',
    );
    await page
      .locator('.astryx-calendar')
      .evaluate(el =>
        (el as HTMLElement).style.setProperty('--calendar-cell-padding', '4px'),
      );
    await expect(today).toHaveCSS(
      'width',
      density === 'Base' ? '36px' : '28px',
    );
    await expect(today).toHaveCSS(
      'height',
      density === 'Base' ? '36px' : '28px',
    );
    await page
      .locator('.astryx-calendar')
      .evaluate(el =>
        (el as HTMLElement).style.removeProperty('--calendar-cell-padding'),
      );
    await expect(page.locator('.astryx-calendar-nav').first()).toHaveCSS(
      'width',
      density === 'Base' ? '44px' : '36px',
    );
    await expect(page.locator('.astryx-calendar-nav').first()).toHaveCSS(
      'height',
      density === 'Base' ? '44px' : '36px',
    );
    const navIcon = page.locator('.astryx-calendar-nav .astryx-icon').first();
    await expect(navIcon).toHaveCSS(
      'width',
      density === 'Base' ? '22px' : '20px',
    );
    await expect(navIcon).toHaveCSS('font-weight', '500');
    const expected = await today.evaluate(el => {
      const probe = document.createElement('span');
      probe.style.color = 'var(--minim-stroke-neutral)';
      el.append(probe);
      const color = getComputedStyle(probe).color;
      probe.remove();
      return color;
    });
    await expect(today).toHaveCSS(
      'box-shadow',
      `${expected} 0px 0px 0px 1px inset`,
    );
    await expect(today).toHaveCSS(
      'font-size',
      density === 'Base' ? '16.5px' : '15px',
    );
    await page.screenshot({
      path: `/tmp/minim-admin/${info.project.name}-calendar-${density}.png`,
    });
    await page.locator('.astryx-calendar-day[data-date="2026-09-24"]').click();
    await page.locator('.astryx-date-input-toggle-icon').click();
    await expect(
      page.locator('.astryx-calendar-day[data-date="2026-09-24"]'),
    ).toHaveAttribute('data-selected', 'selected');
  });
  test(`commerce ${density}`, async ({page}, info) => {
    await page.goto('/examples/admin/commerce');
    await page.getByRole('radio', {name: density, exact: true}).click();
    await shot(page, `${info.project.name}-commerce-${density}`);
    await page.getByRole('checkbox', {name: 'OR-2401 선택'}).check();
    await page.getByRole('button', {name: '선택 주문 출고'}).click();
    await expect(page.getByText('1개 주문을 출고 처리했어요.')).toBeVisible();
    await page.getByRole('button', {name: 'OR-2401 상세'}).click();
    await shot(page, `${info.project.name}-order-${density}`);
    await page.getByRole('textbox', {name: '처리 메모'}).fill('오늘 출고 완료');
    await page.keyboard.press('Escape');
    await page.getByRole('button', {name: '상품 재고', exact: true}).click();
    await page
      .getByRole('button', {name: '데일리 캔버스 백 재고 수정'})
      .click();
    await page.getByRole('spinbutton', {name: '재고 수량'}).fill('32');
    await page.getByRole('spinbutton', {name: '재고 수량'}).blur();
    await page.getByRole('button', {name: '재고 저장'}).click();
    await expect(page.getByText('32개', {exact: true})).toBeVisible();
    await page.reload();
    await page.getByRole('button', {name: 'OR-2401 상세'}).click();
    await expect(page.getByRole('textbox', {name: '처리 메모'})).toHaveValue(
      '오늘 출고 완료',
    );
  });
  test(`support ${density}`, async ({page}, info) => {
    await page.goto('/examples/admin/support');
    await page.getByRole('radio', {name: density, exact: true}).click();
    await shot(page, `${info.project.name}-support-${density}`);
    await page
      .getByRole('textbox', {name: '고객에게 답변'})
      .fill('초대 링크를 다시 보내드렸어요.');
    await page.getByRole('button', {name: '답변 보내기'}).click();
    await expect(
      page.getByText('초대 링크를 다시 보내드렸어요.', {exact: true}),
    ).toBeVisible();
    await page.getByRole('button', {name: '해결 처리', exact: true}).click();
    await expect(page.getByRole('button', {name: '다시 열기'})).toBeVisible();
    await page.getByRole('button', {name: '저장된 답변', exact: true}).click();
    await page.getByRole('button', {name: '답변 추가'}).click();
    await page.getByRole('textbox', {name: '답변 제목'}).fill('감사 인사');
    await page
      .getByRole('textbox', {name: '답변 내용'})
      .fill('문의해주셔서 감사합니다.');
    await page.getByRole('button', {name: '템플릿 저장'}).click();
    await expect(page.getByRole('heading', {name: '감사 인사'})).toBeVisible();
    await page.reload();
    await expect(
      page.getByText('초대 링크를 다시 보내드렸어요.', {exact: true}),
    ).toBeVisible();
  });
  test(`recruiting ${density}`, async ({page}, info) => {
    await page.goto('/examples/admin/recruiting');
    await page.getByRole('radio', {name: density, exact: true}).click();
    await shot(page, `${info.project.name}-recruiting-${density}`);
    await page.getByRole('button', {name: '김서현 검토'}).click();
    await page
      .getByRole('checkbox', {name: '포트폴리오 검토', exact: true})
      .check();
    await page
      .getByRole('textbox', {name: '검토 메모'})
      .fill('제품 설계 경험이 좋음');
    await shot(page, `${info.project.name}-candidate-${density}`);
    await page.getByRole('button', {name: '검토 완료'}).click();
    await page.getByRole('button', {name: '지원자 추가'}).click();
    await page
      .getByRole('textbox', {name: '지원자 이름'})
      .fill('테스트 지원자');
    await page.getByRole('button', {name: '지원자 저장'}).click();
    await expect(
      page.getByRole('button', {name: '테스트 지원자 검토'}),
    ).toBeVisible();
    await page.reload();
    await page.getByRole('button', {name: '김서현 검토'}).click();
    await expect(page.getByRole('textbox', {name: '검토 메모'})).toHaveValue(
      '제품 설계 경험이 좋음',
    );
    await expect(
      page.getByRole('checkbox', {name: '포트폴리오 검토', exact: true}),
    ).toBeChecked();
  });
}
