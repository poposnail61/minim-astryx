// Copyright (c) Meta Platforms, Inc. and affiliates.

'use client';

/** Spotify-inspired discovery/library/player. Audio is an original synthesized preview. */
import {useEffect, useRef, useState} from 'react';
import * as stylex from '@stylexjs/stylex';
import {Stack} from '@astryxdesign/core/Stack';
import {Heading} from '@astryxdesign/core/Heading';
import {Text} from '@astryxdesign/core/Text';
import {Button} from '@astryxdesign/core/Button';
import {TextInput} from '@astryxdesign/core/TextInput';
import {Slider} from '@astryxdesign/core/Slider';
import {DropdownMenu} from '@astryxdesign/core/DropdownMenu';
import {CheckboxList, CheckboxListItem} from '@astryxdesign/core/CheckboxList';
import {Switch} from '@astryxdesign/core/Switch';
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

const tracks = [
  {
    title: 'Slow Morning',
    artist: 'Minim Sessions',
    mood: '잔잔한 시작',
    image: 'photo-1470770841072-f978cf4d019e',
    notes: [261.63, 329.63, 392, 493.88],
  },
  {
    title: 'City After Rain',
    artist: 'Minim Sessions',
    mood: '도시의 밤',
    image: 'photo-1519608487953-e999c86e7455',
    notes: [220, 261.63, 329.63, 392],
  },
  {
    title: 'Green Window',
    artist: 'Minim Sessions',
    mood: '집중하는 오후',
    image: 'photo-1441974231531-c6227db76b6e',
    notes: [293.66, 349.23, 440, 523.25],
  },
  {
    title: 'Sea, You',
    artist: 'Minim Sessions',
    mood: '잠깐의 휴식',
    image: 'photo-1471922694854-ff1b63b20054',
    notes: [246.94, 293.66, 369.99, 440],
  },
];
const duration = 30;
export default function MusicApp() {
  const [playlist, setPlaylist] = useSavedState('minim-music-playlist-v1', {
    name: '나의 플레이리스트',
    tracks: [] as string[],
  });
  const [editor, setEditor] = useState(false);
  const [draftName, setDraftName] = useState('');
  const [draftTracks, setDraftTracks] = useState<string[]>([]);
  const [repeat, setRepeat] = useSavedState('minim-music-repeat-v1', false);
  const [tab, setTab] = useState('둘러보기');
  const [query, setQuery] = useState('');
  const [liked, setLiked] = useSavedState<number[]>('minim-music-liked-v1', []);
  const [queue, setQueue] = useSavedState<number[]>(
    'minim-music-queue-v1',
    [0, 1, 2, 3],
  );
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [volume, setVolume] = useState(30);
  const [notice, setNotice] = useState('');
  const audio = useRef<AudioContext | null>(null);
  const track = tracks[index];
  // Short, low-volume original chord previews. No copied recordings or streaming account.
  useEffect(() => {
    if (!playing) {
      return;
    }
    const ctx = audio.current;
    if (!ctx) {
      return;
    }
    const bus = ctx.createGain();
    bus.gain.value = (volume / 100) * 0.05;
    bus.connect(ctx.destination);
    let beat = 0;
    const sound = () => {
      const osc = ctx.createOscillator();
      const envelope = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = track.notes[beat++ % track.notes.length];
      envelope.gain.setValueAtTime(0, ctx.currentTime);
      envelope.gain.linearRampToValueAtTime(1, ctx.currentTime + 0.04);
      envelope.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
      osc.connect(envelope);
      envelope.connect(bus);
      osc.start();
      osc.stop(ctx.currentTime + 0.9);
    };
    sound();
    const id = setInterval(sound, 500);
    return () => {
      clearInterval(id);
      bus.disconnect();
    };
  }, [playing, index, volume, track]);
  useEffect(() => {
    if (!playing) {
      return;
    }
    const id = setInterval(
      () => setPosition(p => Math.min(duration, p + 1)),
      1000,
    );
    return () => clearInterval(id);
  }, [playing]);
  useEffect(() => {
    if (position >= duration) {
      if (repeat) {
        setPosition(0);
      } else {
        setPlaying(false);
      }
    }
  }, [position, repeat]);
  useEffect(
    () => () => {
      void audio.current?.close();
    },
    [],
  );
  async function play(i = index) {
    try {
      if (!audio.current) {
        audio.current = new AudioContext();
      }
      await audio.current.resume();
      if (i !== index || position >= duration) {
        setPosition(0);
      }
      setIndex(i);
      setPlaying(true);
      setNotice('');
    } catch {
      setNotice('오디오를 시작하지 못했어요. 다시 재생해주세요.');
    }
  }
  function next(delta: number) {
    const current = queue.indexOf(index);
    const i = queue[(current + delta + queue.length) % queue.length] ?? 0;
    setIndex(i);
    setPosition(0);
  }
  function like(i: number) {
    setLiked(old => (old.includes(i) ? old.filter(x => x !== i) : [...old, i]));
  }
  function editPlaylist(add?: number) {
    setDraftName(playlist.name);
    setDraftTracks(
      add === undefined
        ? [...playlist.tracks]
        : [...new Set([...playlist.tracks, String(add)])],
    );
    setEditor(true);
  }
  const visible = tracks
    .map((t, i) => ({...t, i}))
    .filter(t =>
      `${t.title} ${t.mood}`.toLowerCase().includes(query.toLowerCase()),
    );
  return (
    <MobileShell
      app="music"
      title="사운드룸"
      tab={tab}
      onTab={setTab}
      tabs={[
        {label: '둘러보기', icon: 'music-note'},
        {label: '보관함', icon: 'heart'},
        {label: '재생 중', icon: 'headphone'},
      ]}
      accessory={
        tab !== '재생 중' ? (
          <Stack
            direction="horizontal"
            paddingInline={4}
            gap={3}
            vAlign="center"
            xstyle={mobile.player}>
            <img
              src={photo(track.image, 160)}
              alt=""
              {...stylex.props(mobile.thumb)}
            />
            <Stack xstyle={mobile.grow}>
              <Text weight="medium">{track.title}</Text>
              <Text type="supporting">{track.artist}</Text>
            </Stack>
            <IconAction
              label={playing ? '일시 정지' : '재생'}
              name={playing ? 'pause-solid' : 'play-solid'}
              onClick={() => (playing ? setPlaying(false) : void play())}
            />
            <IconAction
              label="재생 화면 열기"
              name="chevron-up"
              onClick={() => setTab('재생 중')}
            />
          </Stack>
        ) : undefined
      }>
      <MobileSheet
        title="플레이리스트 편집"
        open={editor}
        onClose={() => setEditor(false)}>
        <TextInput
          label="플레이리스트 이름"
          value={draftName}
          onChange={setDraftName}
        />
        <CheckboxList
          label="담을 곡"
          value={draftTracks}
          onChange={setDraftTracks}>
          {tracks.map((t, i) => (
            <CheckboxListItem
              key={i}
              value={String(i)}
              label={t.title}
              description={t.mood}
            />
          ))}
        </CheckboxList>
        <Button
          label="플레이리스트 저장"
          isDisabled={!draftName.trim() || !draftTracks.length}
          onClick={() => {
            setPlaylist({name: draftName.trim(), tracks: draftTracks});
            setEditor(false);
            setNotice('플레이리스트를 저장했어요.');
          }}
        />
      </MobileSheet>
      {notice && <Text role="status">{notice}</Text>}
      {tab === '둘러보기' && (
        <>
          <Stack gap={2}>
            <Text color="secondary">지금, 어떤 기분인가요?</Text>
            <Heading level={2}>오늘의 리듬을 찾아요</Heading>
          </Stack>
          <TextInput
            label="음악 검색"
            isLabelHidden
            placeholder="곡 또는 분위기 검색"
            value={query}
            onChange={setQuery}
            hasClear
          />
          <Stack xstyle={mobile.grid}>
            {visible.map(t => (
              <Stack key={t.i} gap={2}>
                <img
                  src={photo(t.image, 500)}
                  alt={`${t.mood} 앨범 커버`}
                  {...stylex.props(mobile.cover)}
                />
                <Text type="supporting">{t.mood}</Text>
                <Heading level={3}>{t.title}</Heading>
                <Stack direction="horizontal" gap={1}>
                  <Button
                    label={`${t.title} 재생`}
                    isIconOnly
                    variant="neutral-subtle"
                    icon={<Glyph name="play-solid" />}
                    onClick={() => {
                      void play(t.i);
                      setTab('재생 중');
                    }}>
                    재생
                  </Button>
                  <IconAction
                    label={`${t.title} ${liked.includes(t.i) ? '좋아요 취소' : '좋아요'}`}
                    name={liked.includes(t.i) ? 'heart-solid' : 'heart'}
                    onClick={() => like(t.i)}
                  />
                  <DropdownMenu
                    button={{
                      label: `${t.title} 곡 메뉴`,
                      variant: 'ghost',
                      isIconOnly: true,
                      icon: <Glyph name="more-horiz" />,
                    }}
                    hasChevron={false}
                    presentation="bottom-sheet"
                    items={[
                      {
                        label: '다음에 재생',
                        onClick: () => {
                          setQueue(q => {
                            const rest = q.filter(i => i !== t.i);
                            const at = rest.indexOf(index);
                            rest.splice(at + 1, 0, t.i);
                            return rest;
                          });
                          setNotice(`${t.title}을 다음 재생 순서에 넣었어요.`);
                        },
                      },
                      {
                        label: '플레이리스트에 담기',
                        onClick: () => editPlaylist(t.i),
                      },
                      {
                        label: liked.includes(t.i) ? '좋아요 취소' : '좋아요',
                        onClick: () => like(t.i),
                      },
                    ]}
                  />
                </Stack>
              </Stack>
            ))}
          </Stack>
          {!visible.length && <Text>검색 결과가 없어요.</Text>}
          <Text type="supporting">
            Minim Sessions · 오리지널 오디오 프리뷰 30초
          </Text>
        </>
      )}
      {tab === '보관함' && (
        <>
          <SectionTitle
            title={playlist.name}
            action={
              <IconAction
                name="edit"
                label="플레이리스트 편집"
                onClick={() => editPlaylist()}
              />
            }
          />
          <Text color="secondary">
            {playlist.tracks.length}곡 · 나만의 순서로 듣기
          </Text>
          {playlist.tracks.length > 0 ? (
            <Button
              label="플레이리스트 재생"
              icon={<Glyph name="play-solid" />}
              onClick={() => {
                setQueue(playlist.tracks.map(Number));
                void play(Number(playlist.tracks[0]));
                setTab('재생 중');
              }}
            />
          ) : (
            <Button
              label="플레이리스트 만들기"
              variant="neutral-subtle"
              onClick={() => editPlaylist()}
            />
          )}
          <SectionTitle title="좋아하는 곡" />
          <Text color="secondary">{liked.length}곡의 나다운 취향</Text>
          {!liked.length && (
            <Stack gap={4} paddingBlock={5}>
              <Text>마음에 드는 곡에 하트를 눌러보세요.</Text>
              <Button
                label="음악 둘러보기"
                onClick={() => setTab('둘러보기')}
              />
            </Stack>
          )}
          {liked.map(i => (
            <Stack
              key={i}
              direction="horizontal"
              vAlign="center"
              gap={3}
              paddingBlock={3}
              xstyle={mobile.row}>
              <img
                src={photo(tracks[i].image, 160)}
                alt=""
                {...stylex.props(mobile.thumb)}
              />
              <Stack xstyle={mobile.grow}>
                <Text>{tracks[i].title}</Text>
                <Text type="supporting">{tracks[i].artist}</Text>
              </Stack>
              <IconAction
                label={`${tracks[i].title} 재생`}
                name="play-solid"
                onClick={() => {
                  void play(i);
                  setTab('재생 중');
                }}
              />
              <IconAction
                label={`${tracks[i].title} 좋아요 취소`}
                name="heart-solid"
                onClick={() => like(i)}
              />
            </Stack>
          ))}
        </>
      )}
      {tab === '재생 중' && (
        <>
          <Text type="supporting">MINIM SESSIONS / ORIGINAL PREVIEW</Text>
          <img
            src={photo(track.image)}
            alt={`${track.mood} 앨범 커버`}
            {...stylex.props(mobile.cover)}
          />
          <SectionTitle
            title={track.title}
            action={
              <IconAction
                label={liked.includes(index) ? '좋아요 취소' : '좋아요'}
                name={liked.includes(index) ? 'heart-solid' : 'heart'}
                onClick={() => like(index)}
              />
            }
          />
          <Text color="secondary">
            {track.artist} · {track.mood}
          </Text>
          <Slider
            label="재생 위치"
            isLabelHidden
            min={0}
            max={duration}
            value={position}
            onChange={setPosition}
            formatValue={v => `${v}초`}
          />
          <Stack direction="horizontal" hAlign="between">
            <Text type="supporting" hasTabularNumbers>
              0:{String(position).padStart(2, '0')}
            </Text>
            <Text type="supporting">0:30</Text>
          </Stack>
          <Stack direction="horizontal" hAlign="center" vAlign="center" gap={6}>
            <IconAction
              label="이전 곡"
              name="skip-prev-solid"
              onClick={() => next(-1)}
            />
            <Button
              label={playing ? '일시 정지' : '재생'}
              isIconOnly
              icon={<Glyph name={playing ? 'pause-solid' : 'play-solid'} />}
              onClick={() => (playing ? setPlaying(false) : void play())}
            />
            <IconAction
              label="다음 곡"
              name="skip-next-solid"
              onClick={() => next(1)}
            />
          </Stack>
          <Slider
            label="볼륨"
            value={volume}
            onChange={setVolume}
            min={0}
            max={100}
            formatValue={v => `${v}%`}
          />
          <SectionTitle title="재생 순서" />
          <Switch label="한 곡 반복" value={repeat} onChange={setRepeat} />
          {queue.map((i, order) => (
            <Stack
              key={i}
              direction="horizontal"
              vAlign="center"
              gap={2}
              paddingBlock={2}
              xstyle={mobile.row}>
              <Text color={i === index ? 'accent' : 'secondary'}>
                {order + 1}
              </Text>
              <Stack xstyle={mobile.grow}>
                <Text color={i === index ? 'accent' : 'primary'}>
                  {tracks[i].title}
                </Text>
              </Stack>
              <IconAction
                label={`${tracks[i].title} 먼저 재생`}
                name="arrow-up"
                disabled={order === 0}
                onClick={() =>
                  setQueue(q => {
                    const copy = [...q];
                    [copy[order - 1], copy[order]] = [
                      copy[order],
                      copy[order - 1],
                    ];
                    return copy;
                  })
                }
              />
              <IconAction
                label={`${tracks[i].title} 재생`}
                name="play"
                onClick={() => void play(i)}
              />
            </Stack>
          ))}
        </>
      )}
    </MobileShell>
  );
}
