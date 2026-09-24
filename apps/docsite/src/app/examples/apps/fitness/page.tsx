// Copyright (c) Meta Platforms, Inc. and affiliates.

'use client';

/** Hevy-inspired routine > session > rest > history flow; records stay local. */
import {useEffect, useState} from 'react';
import * as stylex from '@stylexjs/stylex';
import {Stack} from '@astryxdesign/core/Stack';
import {Heading} from '@astryxdesign/core/Heading';
import {Text} from '@astryxdesign/core/Text';
import {Button} from '@astryxdesign/core/Button';
import {NumberInput} from '@astryxdesign/core/NumberInput';
import {ProgressBar} from '@astryxdesign/core/ProgressBar';
import {CheckboxList, CheckboxListItem} from '@astryxdesign/core/CheckboxList';
import {TextInput} from '@astryxdesign/core/TextInput';
import {TextArea} from '@astryxdesign/core/TextArea';
import {Switch} from '@astryxdesign/core/Switch';
import {Selector} from '@astryxdesign/core/Selector';
import {MobileSheet} from '../mobile-sheet';
import {useSavedState} from '../shared';
import {
  MobileShell,
  SectionTitle,
  IconAction,
  Glyph,
  mobile,
  photo,
} from '../mobile-shared';

const initialRoutines = [
  {
    name: '상체 A',
    subtitle: '가슴 · 등 · 어깨',
    exercise: ['벤치 프레스', '랫 풀다운', '숄더 프레스'],
    weight: [40, 35, 20],
  },
  {
    name: '하체 & 코어',
    subtitle: '하체 · 복근',
    exercise: ['스쿼트', '레그 프레스', '케이블 크런치'],
    weight: [50, 80, 20],
  },
];
type SetEntry = {kg: number; reps: number; done: boolean};
type Session = {routine: number; sets: SetEntry[][]; started: number};
type RecordEntry = {
  id: number;
  title: string;
  sets: number;
  volume: number;
  minutes: number;
  note?: string;
};
export default function FitnessApp() {
  const [routines, setRoutines] = useSavedState(
    'minim-fit-routines-v1',
    initialRoutines,
  );
  const [editor, setEditor] = useState<number | null>(null);
  const [routineName, setRoutineName] = useState('');
  const [exercises, setExercises] = useState<string[]>([]);
  const [autoRest, setAutoRest] = useSavedState('minim-fit-auto-rest-v1', true);
  const [restDuration, setRestDuration] = useSavedState(
    'minim-fit-rest-duration-v1',
    '60',
  );
  const [note, setNote] = useSavedState('minim-fit-note-v1', '');
  const exerciseOptions = initialRoutines.flatMap(r =>
    r.exercise.map((name, i) => ({name, weight: r.weight[i]})),
  );
  const [tab, setTab] = useState('루틴');
  const [session, setSession] = useSavedState<Session | null>(
    'minim-fit-session-v1',
    null,
  );
  const [history, setHistory] = useSavedState<RecordEntry[]>(
    'minim-fit-history-v1',
    [],
  );
  const [restUntil, setRestUntil] = useState(0);
  const [now, setNow] = useState(0);
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const rest = Math.max(0, Math.ceil((restUntil - now) / 1000));
  const completed = session?.sets.flat().filter(s => s.done).length ?? 0;
  function start(index: number) {
    setSession({
      routine: index,
      sets: routines[index].weight.map(kg =>
        Array.from({length: 3}, () => ({kg, reps: 10, done: false})),
      ),
      started: Date.now(),
    });
    setNote('');
    setTab('운동');
    setSaved(false);
  }
  function update(ex: number, index: number, patch: Partial<SetEntry>) {
    setSession(old =>
      old
        ? {
            ...old,
            sets: old.sets.map((sets, e) =>
              e === ex
                ? sets.map((s, i) => (i === index ? {...s, ...patch} : s))
                : sets,
            ),
          }
        : old,
    );
  }
  function finish() {
    if (!session || !completed) {
      return;
    }
    setHistory(old => [
      {
        id: Date.now(),
        title: routines[session.routine].name,
        note: note.trim(),
        sets: completed,
        volume: session.sets
          .flat()
          .filter(s => s.done)
          .reduce((a, s) => a + s.kg * s.reps, 0),
        minutes: Math.max(
          1,
          Math.round((Date.now() - session.started) / 60000),
        ),
      },
      ...old,
    ]);
    setSession(null);
    setRestUntil(0);
    setTab('기록');
    setSaved(true);
  }
  return (
    <MobileShell
      app="fitness"
      title="한 세트 더"
      tab={tab}
      onTab={setTab}
      tabs={[
        {label: '루틴', icon: 'category'},
        {label: '운동', icon: 'bolt'},
        {label: '기록', icon: 'calendar'},
      ]}>
      <MobileSheet
        title="루틴 편집"
        open={editor !== null}
        onClose={() => setEditor(null)}>
        <TextInput
          label="루틴 이름"
          value={routineName}
          onChange={setRoutineName}
        />
        <CheckboxList
          label="운동 선택"
          value={exercises}
          onChange={setExercises}>
          {exerciseOptions.map(e => (
            <CheckboxListItem
              key={e.name}
              value={e.name}
              label={e.name}
              description={`기본 ${e.weight}kg · 3세트`}
            />
          ))}
        </CheckboxList>
        <Button
          label="루틴 저장"
          isDisabled={!routineName.trim() || !exercises.length}
          onClick={() => {
            setRoutines(old =>
              old.map((r, i) =>
                i === editor
                  ? {
                      ...r,
                      name: routineName.trim(),
                      exercise: exercises,
                      weight: exercises.map(
                        name =>
                          exerciseOptions.find(e => e.name === name)!.weight,
                      ),
                    }
                  : r,
              ),
            );
            setEditor(null);
          }}
        />
      </MobileSheet>
      {tab === '루틴' && (
        <>
          <Stack gap={2}>
            <Text color="secondary">오늘도, 어제보다 한 걸음.</Text>
            <Heading level={2}>나의 페이스로 쌓는 힘</Heading>
          </Stack>
          <img
            src={photo('photo-1534438327276-14e5300c3a48')}
            alt="웨이트 트레이닝 운동 기구"
            {...stylex.props(mobile.image)}
          />
          <Stack direction="horizontal" hAlign="between" paddingBlock={3}>
            <Stack gap={1}>
              <Text color="secondary">누적 운동</Text>
              <Heading level={2}>{history.length}회</Heading>
            </Stack>
            <Stack gap={1}>
              <Text color="secondary">완료한 세트</Text>
              <Heading level={2}>
                {history.reduce((n, h) => n + h.sets, 0)}세트
              </Heading>
            </Stack>
            <Glyph name="trophy" />
          </Stack>
          <SectionTitle title="저장한 루틴" />
          {routines.map((r, i) => (
            <Stack key={r.name} gap={4} paddingBlock={4} xstyle={mobile.row}>
              <Stack direction="horizontal" gap={3} vAlign="center">
                <Glyph name="bolt" />
                <Stack gap={1} xstyle={mobile.grow}>
                  <Heading level={3}>{r.name}</Heading>
                  <Text color="secondary">
                    {r.exercise.length}개 운동 · {r.exercise.length * 3}세트
                  </Text>
                </Stack>
                <IconAction
                  name="edit"
                  label={`${r.name} 편집`}
                  disabled={!!session}
                  onClick={() => {
                    setEditor(i);
                    setRoutineName(r.name);
                    setExercises([...r.exercise]);
                  }}
                />
              </Stack>
              <Text color="secondary">{r.exercise.join(' / ')}</Text>
              <Button
                label={session ? '진행 중인 운동 계속' : `${r.name} 시작`}
                onClick={() => (session ? setTab('운동') : start(i))}
              />
            </Stack>
          ))}
          <SectionTitle title="운동 설정" />
          <Switch
            label="자동 휴식 타이머"
            description="세트를 완료하면 휴식을 시작해요"
            value={autoRest}
            onChange={setAutoRest}
          />
          {autoRest && (
            <Selector
              label="휴식 시간"
              value={restDuration}
              onChange={setRestDuration}
              options={[
                {value: '30', label: '30초'},
                {value: '60', label: '60초'},
                {value: '90', label: '90초'},
              ]}
            />
          )}
        </>
      )}
      {tab === '운동' && !session && (
        <Stack paddingBlock={8} gap={5}>
          <Heading level={2}>준비되면 시작해요</Heading>
          <Text color="secondary">
            오늘의 루틴을 골라 첫 세트를 기록해보세요.
          </Text>
          <Button label="루틴 선택" onClick={() => setTab('루틴')} />
        </Stack>
      )}
      {tab === '운동' && session && (
        <>
          <SectionTitle
            title={routines[session.routine].name}
            action={
              <Text hasTabularNumbers>
                {Math.floor((now - session.started) / 60000)}분
              </Text>
            }
          />
          <ProgressBar
            label={`${completed} / ${session.sets.flat().length}세트 완료`}
            value={completed}
            max={session.sets.flat().length}
            variant="accent"
          />
          {rest > 0 && (
            <Stack padding={4} gap={2} xstyle={mobile.accent}>
              <Stack direction="horizontal" hAlign="between" vAlign="center">
                <Stack>
                  <Text>세트 사이 휴식</Text>
                  <Heading level={2}>{rest}초</Heading>
                </Stack>
                <Button
                  label="휴식 건너뛰기"
                  variant="ghost"
                  onClick={() => setRestUntil(0)}
                />
              </Stack>
            </Stack>
          )}
          {session.sets.map((sets, e) => (
            <Stack key={e} gap={3}>
              <SectionTitle title={routines[session.routine].exercise[e]} />
              <Stack xstyle={mobile.sets}>
                <Text type="supporting">세트</Text>
                <Text type="supporting">무게 kg</Text>
                <Text type="supporting">횟수</Text>
                <Text type="supporting">완료</Text>
              </Stack>
              {sets.map((s, i) => (
                <Stack key={i} xstyle={mobile.sets}>
                  <Text hasTabularNumbers>{i + 1}</Text>
                  <NumberInput
                    label={`${e + 1}번 운동 ${i + 1}세트 무게`}
                    isLabelHidden
                    value={s.kg}
                    min={0}
                    max={500}
                    step={2.5}
                    width="100%"
                    onChange={kg => update(e, i, {kg})}
                  />
                  <NumberInput
                    label={`${e + 1}번 운동 ${i + 1}세트 횟수`}
                    isLabelHidden
                    value={s.reps}
                    min={1}
                    max={100}
                    width="100%"
                    onChange={reps => update(e, i, {reps})}
                  />
                  <Button
                    label={`${e + 1}번 운동 ${i + 1}세트 ${s.done ? '완료 취소' : '완료'}`}
                    isIconOnly
                    icon={
                      <Glyph name={s.done ? 'check-circle-solid' : 'check'} />
                    }
                    variant={s.done ? 'primary' : 'neutral-subtle'}
                    onClick={() => {
                      update(e, i, {done: !s.done});
                      if (!s.done && autoRest) {
                        setNow(Date.now());
                        setRestUntil(Date.now() + Number(restDuration) * 1000);
                      }
                    }}
                  />
                </Stack>
              ))}
              <Button
                label={`${routines[session.routine].exercise[e]} 세트 추가`}
                icon={<Glyph name="plus" />}
                variant="ghost"
                onClick={() =>
                  setSession(old =>
                    old
                      ? {
                          ...old,
                          sets: old.sets.map((s, i) =>
                            i === e
                              ? [...s, {...s[s.length - 1], done: false}]
                              : s,
                          ),
                        }
                      : old,
                  )
                }
              />
            </Stack>
          ))}
          <TextArea
            label="오늘의 운동 메모"
            value={note}
            onChange={setNote}
            rows={3}
            placeholder="컨디션이나 다음 운동 목표를 남겨요"
          />
          <Button label="운동 완료" isDisabled={!completed} onClick={finish} />
        </>
      )}
      {tab === '기록' && (
        <>
          <SectionTitle title="차곡차곡 쌓인 기록" />
          {saved && (
            <Text role="status" color="accent">
              오늘 운동을 저장했어요.
            </Text>
          )}
          {history.length === 0 ? (
            <Text color="secondary">첫 운동을 완료하면 여기에 기록돼요.</Text>
          ) : (
            history.map(h => (
              <Stack key={h.id} gap={3} paddingBlock={4} xstyle={mobile.row}>
                <Stack direction="horizontal" hAlign="between">
                  <Heading level={3}>{h.title}</Heading>
                  <Text color="secondary">
                    {new Date(h.id).toLocaleDateString('ko-KR')}
                  </Text>
                </Stack>
                <Text>
                  {h.sets}세트 · {h.volume.toLocaleString()}kg · {h.minutes}분
                </Text>
                {h.note && <Text color="secondary">{h.note}</Text>}
              </Stack>
            ))
          )}
        </>
      )}
    </MobileShell>
  );
}
