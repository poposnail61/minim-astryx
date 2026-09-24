// Copyright (c) Meta Platforms, Inc. and affiliates.

'use client';
/** Hiring pipeline, candidate evaluation and interview scheduling. */
import {useState, type ComponentProps} from 'react';
import {Stack} from '@astryxdesign/core/Stack';
import {Text} from '@astryxdesign/core/Text';
import {Heading} from '@astryxdesign/core/Heading';
import {Button} from '@astryxdesign/core/Button';
import {Avatar} from '@astryxdesign/core/Avatar';
import {TextInput} from '@astryxdesign/core/TextInput';
import {TextArea} from '@astryxdesign/core/TextArea';
import {NumberInput} from '@astryxdesign/core/NumberInput';
import {DateInput} from '@astryxdesign/core/DateInput';
import {TimeInput} from '@astryxdesign/core/TimeInput';
import {Selector} from '@astryxdesign/core/Selector';
import {Token} from '@astryxdesign/core/Token';
import {Banner} from '@astryxdesign/core/Banner';
import {CheckboxList, CheckboxListItem} from '@astryxdesign/core/CheckboxList';
import {AlertDialog} from '@astryxdesign/core/AlertDialog';
import {AdminShell, Metrics, Modal, useSavedState, Glyph, ui} from '../shared';
const stages = ['서류 검토', '1차 면접', '최종 면접', '오퍼'];
const jobs = ['프로덕트 디자이너', '프론트엔드 엔지니어', '그로스 마케터'];
type Candidate = {
  id: number;
  name: string;
  role: string;
  years: number;
  stage: string;
  note: string;
  checks: string[];
  date: ComponentProps<typeof DateInput>['value'];
  time: ComponentProps<typeof TimeInput>['value'];
};
const seed: Candidate[] = [
  '김서현',
  '이도현',
  '박유나',
  '최준서',
  '정지민',
  '한서우',
  '오지훈',
  '유하은',
].map((name, i) => ({
  id: i + 1,
  name,
  role: jobs[i % 3],
  years: 3 + (i % 5),
  stage: stages[i % 4],
  note: '',
  checks: [],
  date: undefined,
  time: '14:00' as ComponentProps<typeof TimeInput>['value'],
}));
export default function Recruiting() {
  const [people, setPeople] = useSavedState('admin-hiring-people', seed);
  const [section, setSection] = useState('지원자 보드');
  const [role, setRole] = useState('전체');
  const [query, setQuery] = useState('');
  const [current, setCurrent] = useState<number | null>(null);
  const [create, setCreate] = useState(false);
  const [name, setName] = useState('');
  const [newRole, setNewRole] = useState(jobs[0]);
  const [years, setYears] = useState(3);
  const [notice, setNotice] = useState('');
  const [confirm, setConfirm] = useState(false);
  const selected = people.find(p => p.id === current);
  const visible = people.filter(
    p => (role === '전체' || p.role === role) && p.name.includes(query),
  );
  const update = (patch: Partial<Candidate>) =>
    setPeople(old => old.map(p => (p.id === current ? {...p, ...patch} : p)));
  return (
    <AdminShell
      app="recruiting"
      brand="PEOPLE STUDIO"
      title={section}
      section={section}
      onSection={setSection}
      sections={[
        {label: '지원자 보드', icon: 'person'},
        {label: '면접 일정', icon: 'calendar'},
        {label: '채용 현황', icon: 'category'},
      ]}
      action={
        <Button
          label="지원자 추가"
          icon={<Glyph name="plus" />}
          onClick={() => {
            setName('');
            setCreate(true);
          }}
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
      {section === '지원자 보드' && (
        <>
          <Stack direction="horizontal" gap={3} vAlign="center">
            <TextInput
              label="지원자 검색"
              isLabelHidden
              placeholder="지원자 이름 검색"
              value={query}
              onChange={setQuery}
              startIcon="search"
              width={280}
            />
            <Selector
              label="채용 직무"
              isLabelHidden
              value={role}
              onChange={setRole}
              options={['전체', ...jobs]}
              width={240}
            />
            <Text color="secondary">{visible.length}명</Text>
            {role !== '전체' && (
              <Token label={role} onRemove={() => setRole('전체')} />
            )}
          </Stack>
          <Stack xstyle={ui.board}>
            {stages.map(stage => (
              <Stack key={stage} gap={3}>
                <Stack
                  direction="horizontal"
                  hAlign="between"
                  paddingBlock={3}
                  xstyle={ui.line}>
                  <Heading level={3}>{stage}</Heading>
                  <Text color="secondary">
                    {visible.filter(p => p.stage === stage).length}
                  </Text>
                </Stack>
                {visible
                  .filter(p => p.stage === stage)
                  .map(p => (
                    <Stack key={p.id} padding={4} gap={4} xstyle={ui.item}>
                      <Stack direction="horizontal" gap={3} vAlign="center">
                        <Avatar name={p.name} size="md" />
                        <Stack>
                          <Text weight="semibold">{p.name}</Text>
                          <Text type="supporting" color="secondary">
                            경력 {p.years}년
                          </Text>
                        </Stack>
                      </Stack>
                      <Text>{p.role}</Text>
                      <Stack direction="horizontal" gap={2} wrap="wrap">
                        <Token
                          label={p.date ? '면접 확정' : '일정 미정'}
                          color={p.date ? 'blue' : 'default'}
                        />
                        {p.checks.length > 0 && (
                          <Token label={`평가 ${p.checks.length}/3`} />
                        )}
                      </Stack>
                      <Button
                        label={`${p.name} 검토`}
                        variant="neutral-subtle"
                        onClick={() => setCurrent(p.id)}>
                        지원서 검토
                      </Button>
                    </Stack>
                  ))}
              </Stack>
            ))}
          </Stack>
          {!visible.length && <Text>검색 조건에 맞는 지원자가 없어요.</Text>}
        </>
      )}
      {section === '면접 일정' && (
        <Stack gap={4} maxWidth={940}>
          <Heading level={3}>다가오는 면접</Heading>
          {people
            .filter(p => p.date)
            .sort((a, b) =>
              `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`),
            )
            .map(p => (
              <Stack
                key={p.id}
                direction="horizontal"
                gap={6}
                vAlign="center"
                xstyle={ui.row}>
                <Stack>
                  <Text weight="semibold">{p.date}</Text>
                  <Text color="secondary">{p.time}</Text>
                </Stack>
                <Avatar name={p.name} />
                <Stack xstyle={ui.grow}>
                  <Heading level={3}>{p.name}</Heading>
                  <Text>
                    {p.role} · {p.stage}
                  </Text>
                </Stack>
                <Token label="화상 면접" color="blue" />
                <Button
                  label={`${p.name} 일정 변경`}
                  variant="ghost"
                  onClick={() => setCurrent(p.id)}>
                  일정 변경
                </Button>
              </Stack>
            ))}
          {!people.some(p => p.date) && (
            <Stack gap={4} paddingBlock={8}>
              <Text color="secondary">
                아직 확정한 면접이 없어요. 지원서에서 날짜와 시간을
                선택해주세요.
              </Text>
              <Button
                label="지원자 보드로 이동"
                onClick={() => setSection('지원자 보드')}
              />
            </Stack>
          )}
        </Stack>
      )}
      {section === '채용 현황' && (
        <>
          <Metrics
            items={[
              {
                label: '전체 지원자',
                value: `${people.length}명`,
                detail: '진행 중인 채용',
              },
              {
                label: '면접 진행',
                value: `${people.filter(p => p.stage.includes('면접')).length}명`,
                detail: '1차 및 최종 면접',
              },
              {
                label: '오퍼',
                value: `${people.filter(p => p.stage === '오퍼').length}명`,
                detail: '합류 조건 협의',
              },
            ]}
          />
          {jobs.map(job => (
            <Stack key={job} gap={3} paddingBlock={4} xstyle={ui.line}>
              <Heading level={3}>{job}</Heading>
              <Stack direction="horizontal" gap={6}>
                {stages.map(s => (
                  <Stack key={s} xstyle={ui.grow}>
                    <Text color="secondary">{s}</Text>
                    <Heading level={2}>
                      {
                        people.filter(p => p.role === job && p.stage === s)
                          .length
                      }
                      명
                    </Heading>
                  </Stack>
                ))}
              </Stack>
            </Stack>
          ))}
        </>
      )}
      {selected && (
        <Modal
          title={`${selected.name} 지원서`}
          onClose={() => setCurrent(null)}>
          <Stack direction="horizontal" gap={4} vAlign="center">
            <Avatar name={selected.name} />
            <Stack>
              <Heading level={3}>{selected.name}</Heading>
              <Text color="secondary">
                {selected.role} · 경력 {selected.years}년
              </Text>
            </Stack>
          </Stack>
          <Selector
            label="채용 단계"
            value={selected.stage}
            options={stages}
            onChange={stage => update({stage})}
          />
          <CheckboxList
            label="평가 체크리스트"
            value={selected.checks}
            onChange={checks => update({checks})}>
            <CheckboxListItem label="직무 경험 확인" value="experience" />
            <CheckboxListItem label="포트폴리오 검토" value="portfolio" />
            <CheckboxListItem label="협업 역량 확인" value="teamwork" />
          </CheckboxList>
          <TextArea
            label="검토 메모"
            value={selected.note}
            onChange={note => update({note})}
            rows={3}
          />
          <DateInput
            label="면접 날짜"
            value={selected.date}
            onChange={date => update({date})}
            min="2026-09-23"
            hasClear
            nativePicker="never"
          />
          <TimeInput
            label="면접 시간"
            value={selected.time}
            onChange={time => update({time})}
            nativePicker="never"
          />
          <Button
            label="검토 완료"
            onClick={() => {
              setCurrent(null);
              setNotice('지원자 검토 내용을 저장했어요.');
            }}
          />
          <Button
            label="지원자 삭제"
            variant="ghost"
            onClick={() => setConfirm(true)}
          />
        </Modal>
      )}
      <AlertDialog
        isOpen={confirm}
        onOpenChange={setConfirm}
        title="지원자를 삭제할까요?"
        description="평가와 면접 일정이 함께 삭제됩니다."
        actionLabel="지원자 삭제 확정"
        cancelLabel="돌아가기"
        onAction={() => {
          setPeople(old => old.filter(p => p.id !== current));
          setCurrent(null);
          setConfirm(false);
          setNotice('지원자를 삭제했어요.');
        }}
      />
      {create && (
        <Modal title="지원자 추가" onClose={() => setCreate(false)}>
          <TextInput label="지원자 이름" value={name} onChange={setName} />
          <Selector
            label="지원 직무"
            value={newRole}
            onChange={setNewRole}
            options={jobs}
          />
          <NumberInput
            label="경력"
            units="년"
            value={years}
            onChange={setYears}
            min={0}
            max={50}
            isIntegerOnly
          />
          <Button
            label="지원자 저장"
            isDisabled={!name.trim()}
            onClick={() => {
              setPeople(old => [
                ...old,
                {
                  id: Date.now(),
                  name: name.trim(),
                  role: newRole,
                  years,
                  stage: stages[0],
                  checks: [],
                  note: '',
                  date: undefined,
                  time: '14:00' as ComponentProps<typeof TimeInput>['value'],
                },
              ]);
              setCreate(false);
              setNotice('지원자를 추가했어요.');
            }}
          />
        </Modal>
      )}
    </AdminShell>
  );
}
