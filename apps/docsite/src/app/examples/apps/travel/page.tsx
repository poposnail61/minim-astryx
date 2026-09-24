// Copyright (c) Meta Platforms, Inc. and affiliates.

'use client';

import {useState} from 'react';
import * as stylex from '@stylexjs/stylex';
import {Stack} from '@astryxdesign/core/Stack';
import {Heading} from '@astryxdesign/core/Heading';
import {Text} from '@astryxdesign/core/Text';
import {Button} from '@astryxdesign/core/Button';
import {Icon} from '@astryxdesign/core/Icon';
import {TextInput} from '@astryxdesign/core/TextInput';
import {TextArea} from '@astryxdesign/core/TextArea';
import {Selector} from '@astryxdesign/core/Selector';
import {CheckboxInput} from '@astryxdesign/core/CheckboxInput';
import {Token} from '@astryxdesign/core/Token';
import {ProgressBar} from '@astryxdesign/core/ProgressBar';
import {AppShell, Modal, Tabs, styles, useSavedState} from '../shared';

type Plan = {
  id: string;
  day: string;
  time: string;
  title: string;
  place: string;
  memo: string;
};
const initial: Plan[] = [
  {
    id: 'flight',
    day: '10.16',
    time: '09:10',
    title: '서울 → 도쿄',
    place: '인천 T2 · KE703',
    memo: '예약 번호 TRV2601 · 출발 2시간 전 공항 도착',
  },
  {
    id: 'hotel',
    day: '10.16',
    time: '15:00',
    title: '호텔 체크인',
    place: '시부야 스트림 호텔',
    memo: '예약 번호 HTL1016 · 2박 · 체크아웃 10월 18일 11:00',
  },
  {
    id: 'walk',
    day: '10.16',
    time: '17:00',
    title: '요요기 공원 산책',
    place: '하라주쿠역',
    memo: '저녁에는 근처에서 라멘 먹기',
  },
  {
    id: 'museum',
    day: '10.17',
    time: '10:00',
    title: '미술관과 카페',
    place: '롯폰기',
    memo: '전시 관람 후 점심',
  },
  {
    id: 'home',
    day: '10.18',
    time: '16:30',
    title: '도쿄 → 서울',
    place: '나리타 T1',
    memo: '12시 공항으로 출발',
  },
];
const packing = [
  '여권',
  '항공권 확인',
  '여행자 보험',
  '충전기 · 어댑터',
  '상비약',
  'eSIM',
];

export default function TravelApp() {
  const [plans, setPlans] = useSavedState('minim-travel-plans-v1', initial);
  const [checked, setChecked] = useSavedState<string[]>(
    'minim-travel-packing-v1',
    ['여권'],
  );
  const [day, setDay] = useState('10.16');
  const [tab, setTab] = useState('일정');
  const [draft, setDraft] = useState<Plan | null>(null);
  const [detail, setDetail] = useState<Plan | null>(null);
  const [error, setError] = useState(false);
  const [notice, setNotice] = useState('');
  const edit = (plan?: Plan) => {
    setError(false);
    setDraft(
      plan ?? {id: '', day, time: '12:00', title: '', place: '', memo: ''},
    );
    setDetail(null);
  };
  return (
    <AppShell
      app="travel"
      title="도쿄, 가을의 산책"
      subtitle="여행 수첩 / 2026.10.16 — 10.18">
      <Stack
        direction="horizontal"
        wrap="wrap"
        hAlign="between"
        gap={3}
        vAlign="center">
        <Tabs
          label="여행 보기"
          value={tab}
          onChange={setTab}
          items={['일정', '예약', '준비물']}
        />
        <Button
          icon={<Icon icon="minim:plus" />}
          label="일정 추가"
          onClick={() => edit()}
        />
      </Stack>
      {notice && <Text role="status">{notice}</Text>}
      <Stack xstyle={styles.split}>
        <Stack gap={5}>
          {tab === '일정' && (
            <>
              <Tabs
                label="여행 날짜"
                value={day}
                onChange={setDay}
                items={['10.16', '10.17', '10.18']}
              />
              <Heading level={2}>
                {day === '10.16'
                  ? '도쿄에 도착하는 날'
                  : day === '10.17'
                    ? '도시를 천천히 걷기'
                    : '다음 여행을 기약하며'}
              </Heading>
              {plans
                .filter(p => p.day === day)
                .sort((a, b) => a.time.localeCompare(b.time))
                .map(plan => (
                  <Stack
                    key={plan.id}
                    direction="horizontal"
                    gap={4}
                    vAlign="start"
                    xstyle={styles.row}>
                    <Stack gap={2}>
                      <Icon icon="clock" />
                      <Text weight="semibold">{plan.time}</Text>
                    </Stack>
                    <Stack gap={2} xstyle={styles.grow}>
                      <Heading level={3}>{plan.title}</Heading>
                      <Text color="secondary">{plan.place || '장소 미정'}</Text>
                      <Text type="supporting">{plan.memo}</Text>
                      <Stack direction="horizontal">
                        <Button
                          label="상세 보기"
                          onClick={() => setDetail(plan)}
                        />
                      </Stack>
                    </Stack>
                  </Stack>
                ))}
            </>
          )}
          {tab === '예약' && (
            <>
              <Heading level={2}>예약 보관함</Heading>
              {plans
                .filter(p => ['flight', 'hotel', 'home'].includes(p.id))
                .map(plan => (
                  <Stack key={plan.id} gap={3} padding={5} xstyle={styles.card}>
                    <Stack direction="horizontal" hAlign="between" gap={2}>
                      <Heading level={3}>{plan.title}</Heading>
                      <Token label="확정" color="blue" />
                    </Stack>
                    <Text>
                      {plan.day} · {plan.time}
                    </Text>
                    <Text>{plan.place}</Text>
                    <Button label="예약 상세" onClick={() => setDetail(plan)} />
                  </Stack>
                ))}
            </>
          )}
          {tab === '준비물' && (
            <>
              <Heading level={2}>가볍게, 빠짐없이</Heading>
              <ProgressBar
                label={`준비 완료 ${checked.length}/${packing.length}`}
                value={checked.length}
                max={packing.length}
              />
              {packing.map(item => (
                <Stack key={item} paddingBlock={3} xstyle={styles.row}>
                  <CheckboxInput
                    label={item}
                    value={checked.includes(item)}
                    onChange={value =>
                      setChecked(old =>
                        value ? [...old, item] : old.filter(x => x !== item),
                      )
                    }
                  />
                </Stack>
              ))}
            </>
          )}
        </Stack>
        <Stack as="aside" gap={5}>
          <img
            src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80"
            alt="도쿄의 네온사인이 빛나는 거리"
            {...stylex.props(styles.image)}
          />
          <Stack gap={3}>
            <Heading level={3}>여행 한눈에</Heading>
            <Text>2박 3일 · 친구와 둘이</Text>
            <Text color="secondary">도쿄, 일본 · 현지 시간 GMT+9</Text>
            <Text>
              {plans.length}개의 일정 · 준비물 {checked.length}/{packing.length}
            </Text>
          </Stack>
          <Stack padding={4} gap={2} xstyle={styles.muted}>
            <Text weight="semibold">출발 전 메모</Text>
            <Text>여권 유효기간과 공항 터미널을 다시 확인하기.</Text>
          </Stack>
        </Stack>
      </Stack>
      {detail && (
        <Modal title={detail.title} onClose={() => setDetail(null)}>
          <Text>
            {detail.day} · {detail.time}
          </Text>
          <Text>{detail.place}</Text>
          <Text>{detail.memo || '메모가 없습니다.'}</Text>
          <Button label="일정 수정" onClick={() => edit(detail)} />
        </Modal>
      )}
      {draft && (
        <Modal
          title={draft.id ? '일정 수정' : '일정 추가'}
          onClose={() => setDraft(null)}>
          <Stack
            as="form"
            gap={4}
            onSubmit={event => {
              event.preventDefault();
              if (
                !draft.title.trim() ||
                !/^([01]\d|2[0-3]):[0-5]\d$/.test(draft.time)
              ) {
                setError(true);
                return;
              }
              const saved = {
                ...draft,
                title: draft.title.trim(),
                id: draft.id || crypto.randomUUID(),
              };
              setPlans(old =>
                draft.id
                  ? old.map(p => (p.id === draft.id ? saved : p))
                  : [...old, saved],
              );
              setDay(saved.day);
              setTab('일정');
              setNotice('일정을 저장했습니다.');
              setDraft(null);
            }}>
            <TextInput
              label="일정 이름"
              value={draft.title}
              onChange={title => setDraft({...draft, title})}
              status={
                error && !draft.title.trim()
                  ? {type: 'error', message: '일정 이름을 입력해주세요.'}
                  : undefined
              }
            />
            <Selector
              label="날짜"
              value={draft.day}
              options={['10.16', '10.17', '10.18']}
              onChange={value => setDraft({...draft, day: value})}
            />
            <TextInput
              label="시간"
              value={draft.time}
              onChange={time => setDraft({...draft, time})}
              placeholder="12:00"
              status={
                error && !/^([01]\d|2[0-3]):[0-5]\d$/.test(draft.time)
                  ? {
                      type: 'error',
                      message: '시간을 00:00 형식으로 입력해주세요.',
                    }
                  : undefined
              }
            />
            <TextInput
              label="장소"
              value={draft.place}
              onChange={place => setDraft({...draft, place})}
            />
            <TextArea
              label="메모"
              value={draft.memo}
              onChange={memo => setDraft({...draft, memo})}
            />
            <Button label="일정 저장" type="submit" />
          </Stack>
        </Modal>
      )}
    </AppShell>
  );
}
