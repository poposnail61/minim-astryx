// Copyright (c) Meta Platforms, Inc. and affiliates.

'use client';

/**
 * @input Existing Minim-themed components and local demonstration data.
 * @output Interactive composition examples in base and compact density.
 * @position Docsite /examples; no network writes or production data.
 */
import {useState} from 'react';
import {Stack} from '@astryxdesign/core/Stack';
import {Grid} from '@astryxdesign/core/Grid';
import {Heading} from '@astryxdesign/core/Heading';
import {Text} from '@astryxdesign/core/Text';
import {Button} from '@astryxdesign/core/Button';
import {Link} from '@astryxdesign/core/Link';
import {TextInput} from '@astryxdesign/core/TextInput';
import {TextArea} from '@astryxdesign/core/TextArea';
import {Selector} from '@astryxdesign/core/Selector';
import {CheckboxInput} from '@astryxdesign/core/CheckboxInput';
import {Switch} from '@astryxdesign/core/Switch';
import {Token} from '@astryxdesign/core/Token';
import {Banner} from '@astryxdesign/core/Banner';
import {Divider} from '@astryxdesign/core/Divider';
import {DropdownMenu} from '@astryxdesign/core/DropdownMenu';
import {Table, proportional, type TableColumn} from '@astryxdesign/core/Table';
import {
  SegmentedControl,
  SegmentedControlItem,
} from '@astryxdesign/core/SegmentedControl';
import {
  ChatComposer,
  ChatMessage,
  ChatMessageBubble,
  ChatMessageList,
  ChatMessageMetadata,
} from '@astryxdesign/core/Chat';
import {useMinimDensity} from '../providers';
import {
  SettingsScenario,
  DetailScenario,
  FeedbackScenario,
} from './CompositionScenarios';

const initialRows = [
  {id: 'YT-2401', name: '김민지', destination: '도쿄 3박 4일', status: '확정'},
  {
    id: 'YT-2402',
    name: '이서준',
    destination: '오사카 가족 여행',
    status: '확인 필요',
  },
  {
    id: 'YT-2403',
    name: '박지우',
    destination: '제주 자유 여행',
    status: '확정',
  },
  {
    id: 'YT-2404',
    name: '정하늘',
    destination: '삿포로 겨울 여행',
    status: '대기',
  },
];
type Reservation = (typeof initialRows)[number];

function Reservations({onCreate}: {onCreate: () => void}) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('전체');
  const [notice, setNotice] = useState('');
  const columns: TableColumn<Reservation>[] = [
    {key: 'id', header: '예약 번호', width: proportional(1)},
    {key: 'name', header: '예약자', width: proportional(1)},
    {key: 'destination', header: '여행 상품', width: proportional(2)},
    {
      key: 'status',
      header: '상태',
      width: proportional(1),
      renderCell: row => (
        <Token
          label={row.status}
          color={
            row.status === '확정'
              ? 'blue'
              : row.status === '확인 필요'
                ? 'amber'
                : 'default'
          }
        />
      ),
    },
  ];
  const rows = initialRows.filter(
    row =>
      `${row.id} ${row.name} ${row.destination}`.includes(query) &&
      (filter === '전체' || row.status === filter),
  );
  return (
    <Stack gap={5}>
      <Stack
        direction="horizontal"
        wrap="wrap"
        hAlign="between"
        vAlign="center"
        gap={3}>
        <Heading level={2}>예약 관리</Heading>
        <Button label="예약 추가" onClick={onCreate} />
      </Stack>
      <Banner status="warning" title="확인이 필요한 예약이 1건 있습니다." />
      <Stack direction="horizontal" wrap="wrap" gap={3} vAlign="end">
        <TextInput
          label="예약 검색"
          placeholder="이름, 예약 번호, 상품명"
          value={query}
          onChange={setQuery}
          hasClear
        />
        <Selector
          label="예약 상태"
          value={filter}
          onChange={setFilter}
          options={['전체', '확정', '확인 필요', '대기']}
        />
        <DropdownMenu
          button={{label: '목록 작업'}}
          items={[
            {
              label: '필터 초기화',
              onClick: () => {
                setQuery('');
                setFilter('전체');
              },
            },
            {
              label: '선택 목록 확인',
              onClick: () =>
                setNotice(`${rows.length}건의 예약이 선택되었습니다.`),
            },
          ]}
        />
      </Stack>
      {notice && <Text role="status">{notice}</Text>}
      <Stack isScrollable width="100%" aria-label="예약 목록">
        <Table data={rows} columns={columns} idKey="id" hasHover />
      </Stack>
      {rows.length === 0 && <Text role="status">검색 결과가 없습니다.</Text>}
      <Text type="supporting">총 {rows.length}건</Text>
    </Stack>
  );
}

function ReservationForm() {
  const [name, setName] = useState('김민지');
  const [email, setEmail] = useState('');
  const [destination, setDestination] = useState('도쿄');
  const [memo, setMemo] = useState('');
  const [consent, setConsent] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [saved, setSaved] = useState(false);
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  return (
    <Stack
      as="form"
      gap={5}
      maxWidth={760}
      onSubmit={event => {
        event.preventDefault();
        setSubmitted(true);
        setSaved(Boolean(name.trim()) && validEmail && consent);
      }}>
      <Heading level={2}>예약 입력</Heading>
      {saved && <Banner status="success" title="예시 예약을 저장했습니다." />}
      <Grid columns={{minWidth: 260}} gap={4}>
        <TextInput
          label="예약자 이름"
          value={name}
          onChange={value => {
            setName(value);
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
          placeholder="name@example.com"
          value={email}
          onChange={value => {
            setEmail(value);
            setSaved(false);
          }}
          status={
            submitted && !validEmail
              ? {type: 'error', message: '이메일 주소를 확인해주세요.'}
              : undefined
          }
        />
        <Selector
          label="여행지"
          value={destination}
          onChange={setDestination}
          options={['도쿄', '오사카', '제주', '삿포로']}
        />
        <TextInput label="예약 번호" value="YT-2405" isReadOnly />
        <TextInput label="담당자" value="배정 대기" isDisabled />
      </Grid>
      <TextArea
        label="요청 사항"
        value={memo}
        onChange={setMemo}
        placeholder="여행 중 필요한 사항을 남겨주세요."
      />
      <Divider />
      <Switch
        label="예약 변경 알림 받기"
        value={notifications}
        onChange={setNotifications}
      />
      <CheckboxInput
        label="예약 정보 이용에 동의합니다."
        value={consent}
        onChange={setConsent}
      />
      {submitted && !consent && (
        <Text role="alert">예약 정보 이용에 동의해주세요.</Text>
      )}
      <Stack direction="horizontal" hAlign="end" gap={2}>
        <Button label="저장" type="submit" />
      </Stack>
    </Stack>
  );
}

function Conversation() {
  const [messages, setMessages] = useState<string[]>([]);
  return (
    <Stack gap={5} maxWidth={760}>
      <Heading level={2}>여행 상담</Heading>
      <Stack direction="horizontal" gap={2} wrap="wrap">
        <Token label="도쿄" color="blue" />
        <Token label="출발 일정 확인" color="amber" />
      </Stack>
      <ChatMessageList>
        <ChatMessage sender="user">
          <ChatMessageBubble>
            도쿄 여행 출발 시간을 변경할 수 있나요?
          </ChatMessageBubble>
        </ChatMessage>
        <ChatMessage sender="assistant">
          <ChatMessageBubble
            variant="ghost"
            metadata={
              <ChatMessageMetadata
                footer={<Text type="supporting">여행 상담팀</Text>}
              />
            }>
            항공편의 좌석을 확인한 후 안내드리겠습니다. 원하시는 출발 시간을
            알려주세요.
          </ChatMessageBubble>
        </ChatMessage>
        {messages.map((message, index) => (
          <ChatMessage sender="user" key={index}>
            <ChatMessageBubble metadata={<ChatMessageMetadata status="sent" />}>
              {message}
            </ChatMessageBubble>
          </ChatMessage>
        ))}
      </ChatMessageList>
      <ChatComposer
        placeholder="메시지를 입력하세요"
        onSubmit={value => setMessages(previous => [...previous, value])}
      />
    </Stack>
  );
}

export default function ExamplesPage() {
  const {density, setDensity} = useMinimDensity();
  const [example, setExample] = useState('reservations');
  return (
    <Stack as="main" padding={5} gap={6} width="100%" maxWidth={1200}>
      <Stack
        direction="horizontal"
        wrap="wrap"
        hAlign="between"
        vAlign="center"
        gap={3}>
        <Heading level={1}>Minim 예시</Heading>
        <SegmentedControl
          label="Density"
          value={density}
          onChange={value => setDensity(value as 'base' | 'compact')}>
          <SegmentedControlItem value="base" label="Base" />
          <SegmentedControlItem value="compact" label="Compact" />
        </SegmentedControl>
      </Stack>
      <Stack isScrollable width="100%">
        <Link href="/examples/admin/commerce" isStandalone>
          PC 어드민: 쇼핑몰 운영
        </Link>
        <Link href="/examples/admin/support" isStandalone>
          PC 어드민: 고객지원
        </Link>
        <Link href="/examples/admin/recruiting" isStandalone>
          PC 어드민: 채용 관리
        </Link>
        <Link href="/examples/apps" isStandalone>
          샘플 앱: 여행 수첩 · 오늘의 식탁 · 책갈피
        </Link>
        <Link href="/examples/apps/fitness" isStandalone>
          모바일 앱: 운동 기록
        </Link>
        <Link href="/examples/apps/wallet" isStandalone>
          모바일 앱: 생활 가계부
        </Link>
        <Link href="/examples/apps/music" isStandalone>
          모바일 앱: 음악 감상
        </Link>
        <Link href="/examples/mobile" isStandalone>
          모바일 화면 10개
        </Link>
        <SegmentedControl
          label="예시 화면"
          value={example}
          onChange={setExample}>
          <SegmentedControlItem value="reservations" label="예약 목록" />
          <SegmentedControlItem value="form" label="입력 폼" />
          <SegmentedControlItem value="conversation" label="상담" />
          <SegmentedControlItem value="settings" label="설정" />
          <SegmentedControlItem value="detail" label="예약 상세" />
          <SegmentedControlItem value="feedback" label="처리 상태" />
        </SegmentedControl>
      </Stack>
      <Divider />
      {example === 'reservations' ? (
        <Reservations onCreate={() => setExample('form')} />
      ) : example === 'form' ? (
        <ReservationForm />
      ) : example === 'settings' ? (
        <SettingsScenario />
      ) : example === 'detail' ? (
        <DetailScenario />
      ) : example === 'feedback' ? (
        <FeedbackScenario />
      ) : (
        <Conversation />
      )}
    </Stack>
  );
}
