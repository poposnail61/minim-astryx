// Copyright (c) Meta Platforms, Inc. and affiliates.

'use client';

/** Toss-inspired spending overview, expense editing and monthly budget flow. */
import {useState, type ComponentProps} from 'react';
import * as stylex from '@stylexjs/stylex';
import {Stack} from '@astryxdesign/core/Stack';
import {Heading} from '@astryxdesign/core/Heading';
import {Text} from '@astryxdesign/core/Text';
import {Button} from '@astryxdesign/core/Button';
import {TextInput} from '@astryxdesign/core/TextInput';
import {NumberInput} from '@astryxdesign/core/NumberInput';
import {Selector} from '@astryxdesign/core/Selector';
import {ProgressBar} from '@astryxdesign/core/ProgressBar';
import {DateInput} from '@astryxdesign/core/DateInput';
import {TextArea} from '@astryxdesign/core/TextArea';
import {AlertDialog} from '@astryxdesign/core/AlertDialog';
import {Slider} from '@astryxdesign/core/Slider';
import {CheckboxList, CheckboxListItem} from '@astryxdesign/core/CheckboxList';
import {MobileSheet} from '../mobile-sheet';
import {useSavedState} from '../shared';
import {
  MobileShell,
  SectionTitle,
  Glyph,
  IconAction,
  mobile,
  photo,
} from '../mobile-shared';

type DateValue = ComponentProps<typeof DateInput>['value'];
type Expense = {
  id: number;
  name: string;
  amount: number;
  category: string;
  date: string;
  isoDate?: DateValue;
  memo?: string;
};
const categories = ['식비', '카페', '교통', '쇼핑', '생활'];
const glyphs: Record<string, string> = {
  식비: 'meal',
  카페: 'store',
  교통: 'shipping-local',
  쇼핑: 'shopping-bag',
  생활: 'home',
};
const initial: Expense[] = [
  {id: 1, name: '마켓컬리', amount: 48600, category: '생활', date: '9월 23일'},
  {
    id: 2,
    name: '오후의 커피',
    amount: 5500,
    category: '카페',
    date: '9월 23일',
  },
  {id: 3, name: '동네 식당', amount: 12500, category: '식비', date: '9월 22일'},
  {id: 4, name: '서울 교통', amount: 32000, category: '교통', date: '9월 22일'},
  {id: 5, name: '가을 셔츠', amount: 89000, category: '쇼핑', date: '9월 21일'},
];
const won = (n: number) => `${n.toLocaleString('ko-KR')}원`;
export default function WalletApp() {
  const [expenses, setExpenses] = useSavedState(
    'minim-wallet-expenses-v1',
    initial,
  );
  const [budget, setBudget] = useSavedState('minim-wallet-budget-v1', 500000);
  const [tab, setTab] = useState('소비');
  const [filters, setFilters] = useState<string[]>(categories);
  const [filterOpen, setFilterOpen] = useState(false);
  const [minimum, setMinimum] = useState(0);
  const [date, setDate] = useState<DateValue>('2026-09-23');
  const [memo, setMemo] = useState('');
  const [editing, setEditing] = useState<Expense | null>(null);
  const [form, setForm] = useState(false);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState('식비');
  const [error, setError] = useState(false);
  const [notice, setNotice] = useState('');
  const [draftBudget, setDraftBudget] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const filtered = expenses.filter(
    e => filters.includes(e.category) && e.amount >= minimum,
  );
  function open(e: Expense | null) {
    setEditing(e);
    setName(e?.name ?? '');
    setAmount(e?.amount ?? 0);
    setCategory(e?.category ?? '식비');
    setDate(
      e?.isoDate ??
        (`2026-09-${String(e?.date.match(/(\d+)일/)?.[1] ?? '23').padStart(2, '0')}` as DateValue),
    );
    setMemo(e?.memo ?? '');
    setError(false);
    setForm(true);
    setNotice('');
    setDeleting(false);
  }
  function save() {
    if (!name.trim() || !Number.isFinite(amount) || amount <= 0 || !date) {
      setError(true);
      return;
    }
    const item = {
      id: editing?.id ?? Date.now(),
      name: name.trim(),
      amount,
      category,
      date: `9월 ${Number(date.slice(-2))}일`,
      isoDate: date,
      memo: memo.trim(),
    };
    setExpenses(old =>
      editing ? old.map(e => (e.id === editing.id ? item : e)) : [item, ...old],
    );
    setForm(false);
    setNotice('지출을 저장했어요.');
  }
  return (
    <MobileShell
      app="wallet"
      title="일상의 돈"
      tab={tab}
      onTab={v => {
        setTab(v);
        setForm(false);
        setNotice('');
      }}
      tabs={[
        {label: '소비', icon: 'currency-won-circle'},
        {label: '내역', icon: 'view-list'},
        {label: '예산', icon: 'category'},
      ]}>
      <MobileSheet
        title="내역 필터"
        open={filterOpen}
        onClose={() => setFilterOpen(false)}>
        <CheckboxList
          label="카테고리 선택"
          value={filters}
          onChange={setFilters}>
          {categories.map(c => (
            <CheckboxListItem key={c} value={c} label={c} />
          ))}
        </CheckboxList>
        <Slider
          label="최소 지출 금액"
          min={0}
          max={100000}
          step={1000}
          value={minimum}
          onChange={setMinimum}
          formatValue={won}
        />
        <Text hasTabularNumbers>{won(minimum)} 이상</Text>
        <Button label="필터 적용" onClick={() => setFilterOpen(false)} />
        <Button
          label="필터 초기화"
          variant="ghost"
          onClick={() => {
            setFilters(categories);
            setMinimum(0);
          }}
        />
      </MobileSheet>
      <AlertDialog
        isOpen={deleting}
        onOpenChange={setDeleting}
        title="지출을 삭제할까요?"
        description={`${editing?.name ?? ''} 내역은 삭제 후 되돌릴 수 없어요.`}
        actionLabel="삭제 확인"
        cancelLabel="삭제 취소"
        onAction={() => {
          if (editing) {
            setExpenses(old => old.filter(e => e.id !== editing.id));
          }
          setDeleting(false);
          setForm(false);
          setNotice('지출을 삭제했어요.');
        }}
      />
      {notice && (
        <Text role="status" color="accent">
          {notice}
        </Text>
      )}
      {form ? (
        <>
          <SectionTitle
            title={editing ? '지출 수정' : '지출 기록'}
            action={
              <IconAction
                name="close"
                label="입력 닫기"
                onClick={() => setForm(false)}
              />
            }
          />
          <TextInput
            label="사용처"
            value={name}
            onChange={setName}
            placeholder="어디에 사용했나요?"
            status={
              error && !name.trim()
                ? {type: 'error', message: '사용처를 입력해주세요.'}
                : undefined
            }
          />
          <NumberInput
            label="금액"
            value={amount}
            onChange={setAmount}
            min={0}
            max={100000000}
            units="원"
            isIntegerOnly
            status={
              error && amount <= 0
                ? {type: 'error', message: '0원보다 큰 금액을 입력해주세요.'}
                : undefined
            }
          />
          <Selector
            label="카테고리"
            options={categories}
            value={category}
            onChange={setCategory}
          />
          <DateInput
            label="사용 날짜"
            value={date}
            onChange={setDate}
            min="2026-09-01"
            max="2026-09-30"
            nativePicker="never"
            status={
              error && !date
                ? {type: 'error', message: '날짜를 선택해주세요.'}
                : undefined
            }
          />
          <TextArea
            label="지출 메모"
            value={memo}
            onChange={setMemo}
            rows={3}
            placeholder="함께한 사람이나 지출 이유"
          />
          <Button label="지출 저장" onClick={save} />
          {editing && (
            <Button
              label="지출 삭제"
              variant="ghost"
              onClick={() => setDeleting(true)}
            />
          )}
        </>
      ) : (
        <>
          {tab === '소비' && (
            <>
              <Stack gap={2} paddingBlock={4}>
                <Text color="secondary">9월에 쓴 돈</Text>
                <Heading level={1}>{won(total)}</Heading>
                <Text color="secondary">
                  이번 달 예산의 {Math.round((total / budget) * 100)}%를
                  사용했어요
                </Text>
              </Stack>
              <Stack gap={4} padding={5} xstyle={mobile.accent}>
                <Stack direction="horizontal" hAlign="between">
                  <Text>남은 생활비</Text>
                  <Text weight="semibold">
                    {won(Math.max(0, budget - total))}
                  </Text>
                </Stack>
                <ProgressBar
                  label="월 예산 사용량"
                  isLabelHidden
                  value={Math.min(total, budget)}
                  max={budget}
                  variant="accent"
                />
                {total > budget && (
                  <Text>예산보다 {won(total - budget)} 더 사용했어요.</Text>
                )}
                <Button
                  label="예산 관리"
                  variant="ghost"
                  endContent={<Glyph name="chevron-right" />}
                  onClick={() => setTab('예산')}
                />
              </Stack>
              <SectionTitle
                title="최근 사용 내역"
                action={
                  <IconAction
                    name="plus"
                    label="지출 추가"
                    onClick={() => open(null)}
                  />
                }
              />
              {expenses.slice(0, 4).map(e => (
                <ExpenseRow key={e.id} expense={e} onClick={() => open(e)} />
              ))}
              <Button
                label="내역 전체 보기"
                variant="ghost"
                onClick={() => setTab('내역')}
              />
            </>
          )}
          {tab === '내역' && (
            <>
              <SectionTitle
                title="9월 사용 내역"
                action={
                  <IconAction
                    name="plus"
                    label="지출 추가"
                    onClick={() => open(null)}
                  />
                }
              />
              <Button
                label="내역 필터 열기"
                variant="neutral-subtle"
                onClick={() => setFilterOpen(true)}>
                {filters.length === categories.length
                  ? '전체 카테고리'
                  : `${filters.length}개 카테고리`}{' '}
                · {won(minimum)} 이상
              </Button>
              <Text color="secondary">
                {filtered.length}건 ·{' '}
                {won(filtered.reduce((s, e) => s + e.amount, 0))}
              </Text>
              {filtered.map(e => (
                <ExpenseRow key={e.id} expense={e} onClick={() => open(e)} />
              ))}
              {!filtered.length && (
                <Text color="secondary">
                  이 카테고리에는 아직 지출이 없어요.
                </Text>
              )}
            </>
          )}
          {tab === '예산' && (
            <>
              <Stack gap={2}>
                <Heading level={2}>조금 더 여유 있는 한 달</Heading>
                <Text color="secondary">꼭 필요한 곳에, 계획한 만큼.</Text>
              </Stack>
              <img
                src={photo('photo-1470770841072-f978cf4d019e')}
                alt="저축 목표인 호숫가 여행"
                {...stylex.props(mobile.image)}
              />
              <NumberInput
                label="이번 달 생활비 예산"
                value={draftBudget ?? budget}
                onChange={setDraftBudget}
                min={10000}
                max={100000000}
                step={10000}
                units="원"
              />
              <Button
                label="예산 저장"
                onClick={() => {
                  const v = draftBudget ?? budget;
                  if (v >= 10000) {
                    setBudget(v);
                    setNotice('예산을 저장했어요.');
                  }
                }}
              />
              <SectionTitle title="어디에 가장 많이 썼을까" />
              {categories
                .map(c => ({
                  name: c,
                  total: expenses
                    .filter(e => e.category === c)
                    .reduce((s, e) => s + e.amount, 0),
                }))
                .sort((a, b) => b.total - a.total)
                .map(c => (
                  <Stack key={c.name} gap={2}>
                    <Stack direction="horizontal" hAlign="between">
                      <Text>{c.name}</Text>
                      <Text>{won(c.total)}</Text>
                    </Stack>
                    <ProgressBar
                      label={`${c.name} 비중`}
                      isLabelHidden
                      value={c.total}
                      max={Math.max(1, total)}
                      variant="neutral"
                    />
                  </Stack>
                ))}
            </>
          )}
        </>
      )}
    </MobileShell>
  );
}
function ExpenseRow({
  expense: e,
  onClick,
}: {
  expense: Expense;
  onClick: () => void;
}) {
  return (
    <Stack
      direction="horizontal"
      gap={3}
      vAlign="center"
      paddingBlock={3}
      xstyle={mobile.row}>
      <Glyph name={glyphs[e.category] ?? 'home'} />
      <Stack gap={1} xstyle={mobile.grow}>
        <Text weight="medium">{e.name}</Text>
        <Text color="secondary" type="supporting">
          {e.date} · {e.category}
        </Text>
      </Stack>
      <Text hasTabularNumbers>{won(e.amount)}</Text>
      <IconAction
        name="chevron-right"
        label={`${e.name} 상세`}
        onClick={onClick}
      />
    </Stack>
  );
}
