// Copyright (c) Meta Platforms, Inc. and affiliates.

'use client';
/** Support inbox with assignment, customer context, replies and saved responses. */
import {useState} from 'react';
import {Stack} from '@astryxdesign/core/Stack';
import {Text} from '@astryxdesign/core/Text';
import {Heading} from '@astryxdesign/core/Heading';
import {Button} from '@astryxdesign/core/Button';
import {Avatar} from '@astryxdesign/core/Avatar';
import {TextInput} from '@astryxdesign/core/TextInput';
import {TextArea} from '@astryxdesign/core/TextArea';
import {Selector} from '@astryxdesign/core/Selector';
import {Token} from '@astryxdesign/core/Token';
import {Banner} from '@astryxdesign/core/Banner';
import {Switch} from '@astryxdesign/core/Switch';
import {RadioList, RadioListItem} from '@astryxdesign/core/RadioList';
import {ProgressBar} from '@astryxdesign/core/ProgressBar';
import {AdminShell, Metrics, Modal, useSavedState, Glyph, ui} from '../shared';

const seeds = [
  {
    id: 1042,
    name: '정유진',
    company: '플로우랩',
    subject: '팀원 초대 메일이 오지 않아요',
    message:
      '새 팀원을 초대했는데 초대 메일이 도착하지 않았어요. 회사 도메인을 사용하고 있습니다.',
    priority: '높음',
    status: '대기',
    agent: '김민지',
    replies: [] as {text: string; internal: boolean}[],
  },
  {
    id: 1041,
    name: '이준호',
    company: '오브젝트',
    subject: '연간 요금제 전환 문의',
    message:
      '월간 요금제에서 연간 요금제로 변경하면 기존 결제 금액은 어떻게 되나요?',
    priority: '보통',
    status: '진행 중',
    agent: '박지수',
    replies: [] as {text: string; internal: boolean}[],
  },
  {
    id: 1040,
    name: '김하린',
    company: '스튜디오 이음',
    subject: '내보내기 파일이 열리지 않습니다',
    message: '오늘 내려받은 보고서 파일을 확인 부탁드립니다.',
    priority: '높음',
    status: '대기',
    agent: '김민지',
    replies: [] as {text: string; internal: boolean}[],
  },
  {
    id: 1039,
    name: '박시우',
    company: '루프',
    subject: '워크스페이스 이름 변경',
    message: '워크스페이스 이름을 어디서 변경할 수 있나요?',
    priority: '낮음',
    status: '해결',
    agent: '김민지',
    replies: [] as {text: string; internal: boolean}[],
  },
];
export default function Support() {
  const [tickets, setTickets] = useSavedState('admin-support-tickets', seeds);
  const [section, setSection] = useState('문의함');
  const [id, setId] = useState(1042);
  const [filter, setFilter] = useState('전체');
  const [query, setQuery] = useState('');
  const [reply, setReply] = useState('');
  const [internal, setInternal] = useState(false);
  const [notice, setNotice] = useState('');
  const [templates, setTemplates] = useSavedState('admin-support-templates', [
    {
      title: '초대 메일 안내',
      text: '스팸 메일함과 회사 보안 정책을 확인해주세요. 초대 링크를 다시 발송해드릴게요.',
    },
    {
      title: '요금제 변경 안내',
      text: '설정 > 결제에서 요금제를 변경하실 수 있어요. 잔여 이용 금액은 다음 결제에 반영됩니다.',
    },
  ]);
  const [templateOpen, setTemplateOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [sla, setSla] = useSavedState('admin-support-sla', '4');
  const [notify, setNotify] = useSavedState('admin-support-notify', true);
  const ticket = tickets.find(t => t.id === id)!;
  const filtered = tickets.filter(
    t =>
      (filter === '전체' || t.status === filter) &&
      `${t.subject} ${t.name}`.includes(query),
  );
  const update = (patch: Partial<typeof ticket>) =>
    setTickets(old => old.map(t => (t.id === id ? {...t, ...patch} : t)));
  return (
    <AdminShell
      app="support"
      brand="RELAY DESK"
      title={section}
      section={section}
      onSection={setSection}
      sections={[
        {label: '문의함', icon: 'chat'},
        {label: '저장된 답변', icon: 'view-list'},
        {label: '응대 설정', icon: 'setting'},
      ]}
      action={
        <Token
          label={`${tickets.filter(t => t.status !== '해결').length}건 미해결`}
          color="blue"
        />
      }>
      {notice && (
        <Banner
          title={notice}
          status="success"
          isDismissable
          onDismiss={() => setNotice('')}
        />
      )}
      {section === '문의함' && (
        <>
          <Stack direction="horizontal" gap={3} vAlign="center">
            <TextInput
              label="문의 검색"
              isLabelHidden
              placeholder="제목 또는 고객 검색"
              startIcon="search"
              value={query}
              onChange={setQuery}
              width={320}
            />
            <Selector
              label="문의 상태 필터"
              isLabelHidden
              value={filter}
              onChange={setFilter}
              options={['전체', '대기', '진행 중', '해결']}
              width={160}
            />
            <Text color="secondary">{filtered.length}개 대화</Text>
          </Stack>
          <Stack xstyle={ui.inbox}>
            <Stack as="nav" aria-label="문의 목록" gap={2}>
              {filtered.map(t => (
                <Stack
                  key={t.id}
                  padding={3}
                  gap={2}
                  xstyle={id === t.id ? ui.muted : ui.row}>
                  <Stack direction="horizontal" hAlign="between">
                    <Text type="supporting">
                      #{t.id} · {t.name}
                    </Text>
                    <Token
                      label={t.status}
                      color={t.status === '해결' ? 'green' : 'default'}
                    />
                  </Stack>
                  <Button
                    label={t.subject}
                    variant="ghost"
                    onClick={() => {
                      setId(t.id);
                      setReply('');
                    }}
                    xstyle={ui.nav}
                  />
                  <Text type="supporting" color="secondary">
                    {t.company} · 담당 {t.agent}
                  </Text>
                </Stack>
              ))}
              {!filtered.length && <Text>조건에 맞는 문의가 없어요.</Text>}
            </Stack>
            <Stack gap={5}>
              <Stack gap={3} paddingBlock={3} xstyle={ui.line}>
                <Heading level={3}>{ticket.subject}</Heading>
                <Stack direction="horizontal" gap={2}>
                  <Token label={`#${ticket.id}`} />
                  <Token
                    label={ticket.priority}
                    color={ticket.priority === '높음' ? 'orange' : 'default'}
                  />
                  <Token label={ticket.status} />
                </Stack>
              </Stack>
              <Stack gap={5} xstyle={ui.conversation}>
                <Stack direction="horizontal" gap={3}>
                  <Avatar name={ticket.name} size="md" />
                  <Stack gap={2} xstyle={ui.grow}>
                    <Text weight="medium">{ticket.name}</Text>
                    <Text>{ticket.message}</Text>
                    <Text type="supporting" color="secondary">
                      오늘 오전 10:24 · 이메일
                    </Text>
                  </Stack>
                </Stack>
                {ticket.replies.map((r, i) => (
                  <Stack
                    key={i}
                    padding={4}
                    gap={2}
                    xstyle={r.internal ? ui.muted : ui.row}>
                    <Stack direction="horizontal" gap={2}>
                      <Text weight="medium">김민지</Text>
                      <Token
                        label={r.internal ? '내부 메모' : '답변 완료'}
                        color={r.internal ? 'orange' : 'blue'}
                      />
                    </Stack>
                    <Text>{r.text}</Text>
                  </Stack>
                ))}
              </Stack>
              <Selector
                label="저장된 답변 삽입"
                value=""
                placeholder="답변 템플릿 선택"
                options={templates.map((t, i) => ({
                  value: String(i),
                  label: t.title,
                }))}
                onChange={v => setReply(templates[Number(v)].text)}
              />
              <TextArea
                label={internal ? '내부 메모' : '고객에게 답변'}
                value={reply}
                onChange={setReply}
                rows={4}
                placeholder={
                  internal
                    ? '팀원만 볼 수 있는 메모'
                    : '문의에 대한 답변을 작성해주세요'
                }
              />
              <Switch
                label="내부 메모로 작성"
                value={internal}
                onChange={setInternal}
              />
              <Stack direction="horizontal" gap={3}>
                <Button
                  label={internal ? '메모 저장' : '답변 보내기'}
                  icon={<Glyph name="arrow-up" />}
                  isDisabled={!reply.trim()}
                  onClick={() => {
                    update({
                      replies: [
                        ...ticket.replies,
                        {text: reply.trim(), internal},
                      ],
                      status: internal ? ticket.status : '진행 중',
                    });
                    setReply('');
                    setNotice(
                      internal
                        ? '내부 메모를 저장했어요.'
                        : '답변을 기록했어요.',
                    );
                  }}
                />
                <Button
                  label={ticket.status === '해결' ? '다시 열기' : '해결 처리'}
                  variant="neutral-subtle"
                  onClick={() => {
                    update({
                      status: ticket.status === '해결' ? '진행 중' : '해결',
                    });
                    setNotice(
                      ticket.status === '해결'
                        ? '문의를 다시 열었어요.'
                        : '문의를 해결 처리했어요.',
                    );
                  }}
                />
              </Stack>
            </Stack>
            <Stack as="aside" gap={5} paddingInline={3} xstyle={ui.profile}>
              <Heading level={3}>고객 정보</Heading>
              <Stack direction="horizontal" gap={3} vAlign="center">
                <Avatar name={ticket.name} />
                <Stack>
                  <Text weight="medium">{ticket.name}</Text>
                  <Text type="supporting" color="secondary">
                    {ticket.company}
                  </Text>
                </Stack>
              </Stack>
              <Token label="팀 요금제" color="blue" />
              <Selector
                label="담당자"
                value={ticket.agent}
                onChange={agent => update({agent})}
                options={['김민지', '박지수', '정서윤']}
              />
              <Selector
                label="우선순위"
                value={ticket.priority}
                onChange={priority => update({priority})}
                options={['낮음', '보통', '높음']}
              />
              <Stack gap={2}>
                <Text>첫 응답 목표</Text>
                <Text weight="medium">{sla}시간 이내</Text>
                <ProgressBar
                  label="응답 대기 시간"
                  value={1}
                  max={Number(sla)}
                  variant="accent"
                />
                <Text type="supporting" color="secondary">
                  접수 후 1시간 경과 · 샘플 기준
                </Text>
              </Stack>
            </Stack>
          </Stack>
        </>
      )}
      {section === '저장된 답변' && (
        <Stack gap={4} maxWidth={820}>
          <Stack direction="horizontal" hAlign="between" vAlign="center">
            <Text color="secondary">반복 문의에 사용할 팀 공용 답변</Text>
            <Button
              label="답변 추가"
              icon={<Glyph name="plus" />}
              onClick={() => {
                setTitle('');
                setBody('');
                setTemplateOpen(true);
              }}
            />
          </Stack>
          {templates.map((t, i) => (
            <Stack key={i} gap={3} xstyle={ui.row}>
              <Heading level={3}>{t.title}</Heading>
              <Text>{t.text}</Text>
              <Button
                label={`${t.title} 사용`}
                variant="ghost"
                onClick={() => {
                  setReply(t.text);
                  setSection('문의함');
                }}>
                현재 문의에 사용
              </Button>
            </Stack>
          ))}
        </Stack>
      )}
      {section === '응대 설정' && (
        <Stack gap={6} maxWidth={640}>
          <Metrics
            items={[
              {label: '접수', value: `${tickets.length}건`, detail: '이번 주'},
              {
                label: '해결',
                value: `${tickets.filter(t => t.status === '해결').length}건`,
                detail: '처리 완료',
              },
            ]}
          />
          <RadioList label="첫 응답 목표" value={sla} onChange={setSla}>
            <RadioListItem label="2시간 이내" value="2" />
            <RadioListItem label="4시간 이내" value="4" />
            <RadioListItem label="8시간 이내" value="8" />
          </RadioList>
          <Switch
            label="담당 문의 알림"
            description="이 샘플에서는 알림 설정만 저장됩니다"
            value={notify}
            onChange={setNotify}
          />
        </Stack>
      )}
      {templateOpen && (
        <Modal title="답변 템플릿 추가" onClose={() => setTemplateOpen(false)}>
          <TextInput label="답변 제목" value={title} onChange={setTitle} />
          <TextArea
            label="답변 내용"
            value={body}
            onChange={setBody}
            rows={5}
          />
          <Button
            label="템플릿 저장"
            isDisabled={!title.trim() || !body.trim()}
            onClick={() => {
              setTemplates(old => [
                ...old,
                {title: title.trim(), text: body.trim()},
              ]);
              setTemplateOpen(false);
              setNotice('답변 템플릿을 저장했어요.');
            }}
          />
        </Modal>
      )}
    </AdminShell>
  );
}
