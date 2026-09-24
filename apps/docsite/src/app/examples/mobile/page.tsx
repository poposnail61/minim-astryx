// Copyright (c) Meta Platforms, Inc. and affiliates.

'use client';

// All workflows use local demonstration state, never real reservations/payments.
import {useState} from 'react';
import {SizeProvider} from '@astryxdesign/core/SizeContext';
import {Stack} from '@astryxdesign/core/Stack';
import {Heading} from '@astryxdesign/core/Heading';
import {Text} from '@astryxdesign/core/Text';
import {Button} from '@astryxdesign/core/Button';
import {TextInput} from '@astryxdesign/core/TextInput';
import {TextArea} from '@astryxdesign/core/TextArea';
import {Selector} from '@astryxdesign/core/Selector';
import {CheckboxInput} from '@astryxdesign/core/CheckboxInput';
import {RadioList, RadioListItem} from '@astryxdesign/core/RadioList';
import {Switch} from '@astryxdesign/core/Switch';
import {Token} from '@astryxdesign/core/Token';
import {Banner} from '@astryxdesign/core/Banner';
import {Divider} from '@astryxdesign/core/Divider';
import {Avatar} from '@astryxdesign/core/Avatar';
import {ProgressBar} from '@astryxdesign/core/ProgressBar';
import {DropdownMenu} from '@astryxdesign/core/DropdownMenu';
import {Dialog, DialogHeader} from '@astryxdesign/core/Dialog';
import {Layout, LayoutContent, LayoutFooter} from '@astryxdesign/core/Layout';
import {
  SegmentedControl,
  SegmentedControlItem,
} from '@astryxdesign/core/SegmentedControl';
import {useMinimDensity} from '../../providers';

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
const bookings = [
  {
    name: '도쿄 3박 4일',
    person: '김민지',
    date: '10.12 – 10.15',
    status: '확정',
  },
  {
    name: '오사카·교토 가족 여행',
    person: '이서준',
    date: '10.18 – 10.22',
    status: '확인 필요',
  },
  {
    name: '제주 자유 여행',
    person: '박지우',
    date: '11.03 – 11.05',
    status: '결제 대기',
  },
];

function BookingList({navigate}: {navigate: (screen: string) => void}) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('전체');
  const rows = bookings.filter(
    b =>
      `${b.name} ${b.person}`.includes(query) &&
      (status === '전체' || b.status === status),
  );
  return (
    <Stack gap={4}>
      <TextInput
        label="예약 검색"
        placeholder="이름 또는 여행지"
        value={query}
        onChange={setQuery}
        hasClear
      />
      <Selector
        label="예약 상태"
        value={status}
        onChange={setStatus}
        options={['전체', '확정', '확인 필요', '결제 대기']}
      />
      <Text type="supporting">총 {rows.length}건</Text>
      {rows.map(b => (
        <Stack key={b.name} gap={3}>
          <Stack
            direction="horizontal"
            wrap="wrap"
            hAlign="between"
            vAlign="center"
            gap={2}>
            <Text type="large">{b.name}</Text>
            <Token
              label={b.status}
              color={b.status === '확정' ? 'blue' : 'amber'}
            />
          </Stack>
          <Text>
            {b.person} · {b.date}
          </Text>
          <Button
            label={`${b.person} 예약 보기`}
            variant="neutral-subtle"
            onClick={() => navigate('예약 상세')}
          />
          <Divider />
        </Stack>
      ))}
      {rows.length === 0 && (
        <Stack gap={3}>
          <Text role="status">검색 결과가 없습니다.</Text>
          <Button
            label="검색 초기화"
            onClick={() => {
              setQuery('');
              setStatus('전체');
            }}
          />
        </Stack>
      )}
    </Stack>
  );
}

function BookingDetail({navigate}: {navigate: (screen: string) => void}) {
  const [notice, setNotice] = useState('');
  return (
    <Stack gap={4}>
      <Stack
        direction="horizontal"
        wrap="wrap"
        hAlign="between"
        vAlign="center"
        gap={2}>
        <Token label="예약 확정" color="blue" />
        <DropdownMenu
          button={{label: '예약 작업', variant: 'neutral-subtle'}}
          items={[
            {
              label: '예약 번호 확인',
              onClick: () => setNotice('예약 번호 YT-2401'),
            },
            {label: '취소 요청', onClick: () => navigate('취소 요청')},
          ]}
        />
      </Stack>
      <Heading level={2}>도쿄 3박 4일</Heading>
      <Text>10월 12일 – 10월 15일 · 성인 2명</Text>
      <ProgressBar label="출발 준비" value={66} hasValueLabel />
      <Divider />
      <Heading level={3}>예약자</Heading>
      <Stack direction="horizontal" gap={3} vAlign="center">
        <Avatar
          name="김민지"
          src="/template-assets/DATA-Ana-Thomas.png"
          size="lg"
        />
        <Stack gap={1}>
          <Text>김민지</Text>
          <Text type="supporting">minji@example.com</Text>
        </Stack>
      </Stack>
      <Divider />
      <Text>총 결제 금액</Text>
      <Heading level={2}>1,280,000원</Heading>
      <Banner status="warning" title="여권 정보를 확인해주세요." />
      <Button
        label="여행자 정보 확인"
        onClick={() => navigate('여행자 정보')}
      />
      {notice && <Text role="status">{notice}</Text>}
    </Stack>
  );
}

function Traveler() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [saved, setSaved] = useState(false);
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  return (
    <Stack
      as="form"
      gap={4}
      onSubmit={e => {
        e.preventDefault();
        setSubmitted(true);
        setSaved(!!name.trim() && validEmail && consent);
      }}>
      <Text>대표 여행자 · 성인 1</Text>
      <TextInput
        label="이름"
        value={name}
        onChange={v => {
          setName(v);
          setSaved(false);
        }}
        status={
          submitted && !name.trim()
            ? {type: 'error', message: '이름을 입력해주세요.'}
            : undefined
        }
      />
      <TextInput
        label="이메일"
        value={email}
        onChange={v => {
          setEmail(v);
          setSaved(false);
        }}
        status={
          submitted && !validEmail
            ? {type: 'error', message: '이메일 주소를 확인해주세요.'}
            : undefined
        }
      />
      <TextInput label="예약 번호" value="YT-2401" isReadOnly />
      <CheckboxInput
        label="여행 준비를 위한 개인정보 이용에 동의합니다."
        value={consent}
        onChange={v => {
          setConsent(v);
          setSaved(false);
        }}
      />
      {submitted && !consent && (
        <Text role="alert">개인정보 이용 동의가 필요합니다.</Text>
      )}
      <Button label="여행자 저장" type="submit" />
      {saved && <Banner status="success" title="여행자 정보를 저장했습니다." />}
    </Stack>
  );
}

function Filters() {
  const [city, setCity] = useState('전체');
  const [type, setType] = useState('자유 여행');
  const [direct, setDirect] = useState(false);
  const [applied, setApplied] = useState(false);
  return (
    <Stack gap={5}>
      <Selector
        label="여행지"
        value={city}
        onChange={v => {
          setCity(v);
          setApplied(false);
        }}
        options={['전체', '도쿄', '오사카', '제주']}
      />
      <RadioList
        label="여행 방식"
        value={type}
        onChange={v => {
          setType(v);
          setApplied(false);
        }}>
        <RadioListItem label="자유 여행" value="자유 여행" />
        <RadioListItem label="가이드 동행" value="가이드 동행" />
      </RadioList>
      <CheckboxInput
        label="직항 항공편만 보기"
        value={direct}
        onChange={v => {
          setDirect(v);
          setApplied(false);
        }}
      />
      <Divider />
      <Stack direction="horizontal" wrap="wrap" gap={2}>
        <Token label={city} />
        <Token label={type} />
        {direct && <Token label="직항" color="blue" />}
      </Stack>
      <Button label="필터 적용" onClick={() => setApplied(true)} />
      <Button
        label="필터 초기화"
        variant="neutral-subtle"
        onClick={() => {
          setCity('전체');
          setType('자유 여행');
          setDirect(false);
          setApplied(false);
        }}
      />
      {applied && (
        <Banner
          status="success"
          title={`${city} · ${type} 조건을 적용했습니다.`}
        />
      )}
    </Stack>
  );
}

function Itinerary() {
  const [day, setDay] = useState('1');
  const [done, setDone] = useState(false);
  return (
    <Stack gap={4}>
      <SegmentedControl
        label="여행 일차"
        value={day}
        onChange={v => {
          setDay(v);
          setDone(false);
        }}>
        {['1', '2', '3'].map(d => (
          <SegmentedControlItem key={d} value={d} label={`${d}일차`} />
        ))}
      </SegmentedControl>
      <Text>10월 {11 + Number(day)}일 · 도쿄</Text>
      {(day === '1'
        ? ['09:00 인천공항 출발', '12:00 나리타공항 도착', '15:00 호텔 체크인']
        : day === '2'
          ? ['09:00 호텔 조식', '11:00 아사쿠사 산책', '18:00 시부야 저녁 식사']
          : ['09:00 체크아웃', '11:00 공항 이동', '15:00 인천공항 도착']
      ).map(item => (
        <Stack key={item} gap={3}>
          <Text type="large">{item}</Text>
          <Divider />
        </Stack>
      ))}
      <CheckboxInput
        label="오늘의 일정을 확인했습니다."
        value={done}
        onChange={setDone}
      />
      {done && <Banner status="success" title={`${day}일차 확인 완료`} />}
    </Stack>
  );
}

function Notifications() {
  const [read, setRead] = useState(false);
  const [filter, setFilter] = useState('전체');
  return (
    <Stack gap={4}>
      <SegmentedControl label="알림 필터" value={filter} onChange={setFilter}>
        <SegmentedControlItem label="전체" value="전체" />
        <SegmentedControlItem label="읽지 않음" value="읽지 않음" />
      </SegmentedControl>
      <Button
        label="모두 읽음"
        variant="neutral-subtle"
        isDisabled={read}
        onClick={() => setRead(true)}
      />
      {read && filter === '읽지 않음' ? (
        <Text role="status">새로운 알림이 없습니다.</Text>
      ) : (
        <>
          <Banner
            status="success"
            title="예약이 확정되었습니다."
            description="도쿄 3박 4일 · 10분 전"
          />
          <Banner
            status="warning"
            title="여권 정보 확인이 필요합니다."
            description="출발 7일 전까지 여행자 정보를 확인해주세요."
          />
          <Banner
            status="error"
            title="결제를 완료하지 못했습니다."
            description="결제 수단을 확인한 후 다시 시도해주세요."
          />
        </>
      )}
      {read && <Text role="status">모든 알림을 읽었습니다.</Text>}
    </Stack>
  );
}

function Payment() {
  const [method, setMethod] = useState('card');
  const [agreed, setAgreed] = useState(false);
  const [paid, setPaid] = useState(false);
  return (
    <Stack gap={5}>
      <Text>도쿄 3박 4일 · 성인 2명</Text>
      <Heading level={2}>1,280,000원</Heading>
      <Divider />
      <RadioList
        label="결제 수단"
        value={method}
        onChange={v => {
          setMethod(v);
          setPaid(false);
        }}>
        <RadioListItem label="신용·체크카드" value="card" />
        <RadioListItem label="계좌 이체" value="bank" />
      </RadioList>
      <Banner
        status="info"
        title={
          method === 'card'
            ? '카드사 승인 후 예약이 확정됩니다.'
            : '입금 확인 후 예약이 확정됩니다.'
        }
      />
      <CheckboxInput
        label="결제 금액과 취소 규정을 확인했습니다."
        value={agreed}
        onChange={v => {
          setAgreed(v);
          setPaid(false);
        }}
      />
      <Button
        label="결제 확인"
        isDisabled={!agreed || paid}
        onClick={() => setPaid(true)}
      />
      {paid && (
        <Banner status="success" title="예시 결제 확인을 완료했습니다." />
      )}
    </Stack>
  );
}

function Documents() {
  const [checked, setChecked] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  return (
    <Stack gap={4}>
      <ProgressBar
        label="서류 준비"
        value={(checked.length / 3) * 100}
        hasValueLabel
      />
      {['여권 사본', '항공권', '숙박 예약 확인서'].map(label => (
        <Stack key={label} gap={3}>
          <CheckboxInput
            label={label}
            value={checked.includes(label)}
            onChange={v => {
              setChecked(items =>
                v ? [...items, label] : items.filter(x => x !== label),
              );
              setSubmitted(false);
            }}
          />
          <Divider />
        </Stack>
      ))}
      <Banner
        status="info"
        title="여권 유효기간을 확인해주세요."
        description="입국일 기준 잔여 유효기간 요건은 목적지별로 다릅니다."
      />
      <Button
        label="준비 완료"
        isDisabled={checked.length !== 3}
        onClick={() => setSubmitted(true)}
      />
      {submitted && (
        <Banner status="success" title="여행 서류 확인을 마쳤습니다." />
      )}
    </Stack>
  );
}

function Settings() {
  const [push, setPush] = useState(true);
  const [email, setEmail] = useState(false);
  const [language, setLanguage] = useState('한국어');
  return (
    <Stack gap={5}>
      <Stack direction="horizontal" vAlign="center" gap={3}>
        <Avatar
          name="김민지"
          src="/template-assets/DATA-Ana-Thomas.png"
          size="lg"
        />
        <Stack gap={1}>
          <Text type="large">김민지</Text>
          <Text type="supporting">minji@example.com</Text>
        </Stack>
      </Stack>
      <Divider />
      <Heading level={2}>알림 설정</Heading>
      <Switch label="예약 변경 알림" value={push} onChange={setPush} />
      <Switch
        label="이메일로 여행 소식 받기"
        size="lg"
        value={email}
        onChange={setEmail}
      />
      <Switch label="보안 알림 (필수)" value={true} isDisabled />
      <Divider />
      <Selector
        label="언어"
        value={language}
        onChange={setLanguage}
        options={['한국어', 'English', '日本語']}
      />
      <Text role="status">
        예약 알림 {push ? '켜짐' : '꺼짐'} · 이메일 {email ? '켜짐' : '꺼짐'}
      </Text>
    </Stack>
  );
}

function Cancellation() {
  const [reason, setReason] = useState('일정 변경');
  const [memo, setMemo] = useState('');
  const [open, setOpen] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  return (
    <Stack gap={4}>
      <Text>YT-2401 · 도쿄 3박 4일</Text>
      <Banner status="warning" title="취소 전 환불 규정을 확인해주세요." />
      <Selector
        label="취소 사유"
        value={reason}
        onChange={setReason}
        options={['일정 변경', '개인 사정', '기타']}
      />
      <TextArea
        label="추가 내용"
        value={memo}
        onChange={setMemo}
        placeholder="전달할 내용이 있으면 입력해주세요."
      />
      <Button
        label="취소 요청하기"
        isDisabled={cancelled}
        onClick={() => setOpen(true)}
      />
      {cancelled && (
        <Banner status="success" title="예시 취소 요청이 접수되었습니다." />
      )}
      <Dialog isOpen={open} onOpenChange={setOpen} purpose="form">
        <Layout
          header={
            <DialogHeader title="예약을 취소할까요?" onOpenChange={setOpen} />
          }
          content={
            <LayoutContent>
              <Text>
                {reason} 사유로 취소를 요청합니다. 환불 금액은 담당자가
                확인합니다.
              </Text>
            </LayoutContent>
          }
          footer={
            <LayoutFooter>
              <Stack direction="horizontal" wrap="wrap" hAlign="end" gap={2}>
                <Button
                  label="돌아가기"
                  variant="neutral-subtle"
                  onClick={() => setOpen(false)}
                />
                <Button
                  label="요청 확정"
                  onClick={() => {
                    setOpen(false);
                    setCancelled(true);
                  }}
                />
              </Stack>
            </LayoutFooter>
          }
        />
      </Dialog>
    </Stack>
  );
}

export default function MobileExamplesPage() {
  return (
    <SizeProvider value="lg">
      <MobileExamples />
    </SizeProvider>
  );
}

function MobileExamples() {
  const {density, setDensity} = useMinimDensity();
  const [screen, setScreen] = useState(screens[0]);
  const index = screens.indexOf(screen);
  return (
    <Stack as="main" width="100%" maxWidth={480} padding={4} gap={5}>
      <Stack
        direction="horizontal"
        wrap="wrap"
        hAlign="between"
        vAlign="center"
        gap={2}>
        <Text type="supporting">Minim · 모바일 {index + 1}/10</Text>
        <SegmentedControl
          label="Density"
          value={density}
          onChange={v => setDensity(v as 'base' | 'compact')}>
          <SegmentedControlItem label="Base" value="base" />
          <SegmentedControlItem label="Compact" value="compact" />
        </SegmentedControl>
      </Stack>
      <Selector
        label="예시 화면"
        value={screen}
        onChange={setScreen}
        options={screens}
      />
      <Divider />
      <Heading level={1}>{screen}</Heading>
      <Stack key={screen} gap={4}>
        {screen === '예약 목록' ? (
          <BookingList navigate={setScreen} />
        ) : screen === '예약 상세' ? (
          <BookingDetail navigate={setScreen} />
        ) : screen === '여행자 정보' ? (
          <Traveler />
        ) : screen === '검색 필터' ? (
          <Filters />
        ) : screen === '여행 일정' ? (
          <Itinerary />
        ) : screen === '알림' ? (
          <Notifications />
        ) : screen === '결제' ? (
          <Payment />
        ) : screen === '서류' ? (
          <Documents />
        ) : screen === '설정' ? (
          <Settings />
        ) : (
          <Cancellation />
        )}
      </Stack>
      <Divider />
      <Stack direction="horizontal" hAlign="between" gap={2}>
        <Button
          label="이전 화면"
          variant="neutral-subtle"
          isDisabled={index === 0}
          onClick={() => setScreen(screens[index - 1])}
        />
        <Button
          label="다음 화면"
          variant="neutral-subtle"
          isDisabled={index === screens.length - 1}
          onClick={() => setScreen(screens[index + 1])}
        />
      </Stack>
    </Stack>
  );
}
