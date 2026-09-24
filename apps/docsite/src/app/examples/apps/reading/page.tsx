// Copyright (c) Meta Platforms, Inc. and affiliates.

'use client';

import {useState} from 'react';
import * as stylex from '@stylexjs/stylex';
import {Stack} from '@astryxdesign/core/Stack';
import {Grid} from '@astryxdesign/core/Grid';
import {Heading} from '@astryxdesign/core/Heading';
import {Text} from '@astryxdesign/core/Text';
import {Button} from '@astryxdesign/core/Button';
import {TextInput} from '@astryxdesign/core/TextInput';
import {TextArea} from '@astryxdesign/core/TextArea';
import {NumberInput} from '@astryxdesign/core/NumberInput';
import {Selector} from '@astryxdesign/core/Selector';
import {Token} from '@astryxdesign/core/Token';
import {ProgressBar} from '@astryxdesign/core/ProgressBar';
import {AppShell, Modal, Tabs, styles, useSavedState} from '../shared';

const books = [
  {
    id: 'habits',
    title: 'Atomic Habits',
    author: 'James Clear',
    isbn: '9780735211292',
    pages: 320,
    description: '작은 습관이 만들어내는 변화에 관하여.',
  },
  {
    id: 'prince',
    title: 'The Little Prince',
    author: 'Antoine de Saint-Exupéry',
    isbn: '9780156012195',
    pages: 96,
    description: '어른이 되어 다시 만나는 어린 왕자의 이야기.',
  },
  {
    id: 'library',
    title: 'The Midnight Library',
    author: 'Matt Haig',
    isbn: '9780525559474',
    pages: 304,
    description: '다른 선택을 했다면 펼쳐졌을 수많은 삶.',
  },
  {
    id: 'educated',
    title: 'Educated',
    author: 'Tara Westover',
    isbn: '9780399590504',
    pages: 352,
    description: '배움을 통해 자신의 세계를 넓혀가는 회고록.',
  },
];
type Record = {pages: number; shelf: string; rating: string; note: string};
const initial: {[id: string]: Record} = {
  habits: {pages: 84, shelf: '읽는 중', rating: '미정', note: ''},
  prince: {pages: 0, shelf: '읽고 싶은', rating: '미정', note: ''},
};

export default function ReadingApp() {
  const [library, setLibrary] = useSavedState(
    'minim-reading-library-v1',
    initial,
  );
  const [tab, setTab] = useState('내 서재');
  const [filter, setFilter] = useState('전체');
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState<Record>({
    pages: 0,
    shelf: '읽는 중',
    rating: '미정',
    note: '',
  });
  const [notice, setNotice] = useState('');
  const current = books.find(book => book.id === editing);
  const finished = Object.values(library).filter(
    record => record.shelf === '완독',
  ).length;
  const visible = books.filter(
    book =>
      `${book.title} ${book.author}`
        .toLowerCase()
        .includes(query.toLowerCase()) &&
      (tab === '책 찾기' || Boolean(library[book.id])) &&
      (tab !== '내 서재' ||
        filter === '전체' ||
        library[book.id]?.shelf === filter),
  );
  function record(id: string) {
    setEditing(id);
    setDraft({...library[id]});
  }
  return (
    <AppShell app="reading" title="책갈피" subtitle="한 장씩 쌓이는 나의 기록">
      <Stack direction="horizontal" wrap="wrap" hAlign="between" gap={4}>
        <Tabs
          label="서재 메뉴"
          value={tab}
          onChange={value => {
            setTab(value);
            setQuery('');
            setNotice('');
          }}
          items={['내 서재', '책 찾기', '독서 기록']}
        />
        <Stack direction="horizontal" gap={5}>
          <Text>서재 {Object.keys(library).length}권</Text>
          <Text>완독 {finished}권</Text>
        </Stack>
      </Stack>
      {notice && <Text role="status">{notice}</Text>}
      {tab !== '독서 기록' ? (
        <>
          <Stack direction="horizontal" wrap="wrap" vAlign="end" gap={3}>
            <TextInput
              label="책 검색"
              placeholder="제목 또는 작가"
              value={query}
              onChange={setQuery}
              hasClear
            />
            {tab === '내 서재' && (
              <Selector
                label="책장"
                options={['전체', '읽는 중', '읽고 싶은', '완독']}
                value={filter}
                onChange={setFilter}
              />
            )}
          </Stack>
          <Grid columns={{minWidth: 300}} gap={6}>
            {visible.map(book => {
              const entry = library[book.id];
              return (
                <Stack
                  key={book.id}
                  gap={4}
                  paddingBlock={5}
                  xstyle={styles.row}>
                  <Stack direction="horizontal" gap={4} vAlign="start">
                    <img
                      src={`https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`}
                      alt={`${book.title} 표지`}
                      {...stylex.props(styles.cover)}
                    />
                    <Stack gap={2} xstyle={styles.grow}>
                      <Heading level={2}>{book.title}</Heading>
                      <Text color="secondary">{book.author}</Text>
                      <Text type="supporting">{book.pages}쪽</Text>
                      {entry && (
                        <Token
                          label={entry.shelf}
                          color={entry.shelf === '완독' ? 'blue' : 'default'}
                        />
                      )}
                    </Stack>
                  </Stack>
                  <Text>{book.description}</Text>
                  {entry ? (
                    <>
                      <ProgressBar
                        label={`${entry.pages} / ${book.pages}쪽`}
                        value={entry.pages}
                        max={book.pages}
                      />
                      <Button
                        label="독서 기록하기"
                        onClick={() => record(book.id)}
                      />
                    </>
                  ) : (
                    <Button
                      label="서재에 추가"
                      onClick={() => {
                        setLibrary(old => ({
                          ...old,
                          [book.id]: {
                            pages: 0,
                            shelf: '읽고 싶은',
                            rating: '미정',
                            note: '',
                          },
                        }));
                        setNotice(`${book.title}을 서재에 추가했습니다.`);
                      }}
                    />
                  )}
                </Stack>
              );
            })}
          </Grid>
          {!visible.length && (
            <Stack paddingBlock={8} gap={3}>
              <Heading level={2}>책이 없어요</Heading>
              <Text>검색어나 책장 필터를 바꿔보세요.</Text>
              <Button
                label="전체 보기"
                onClick={() => {
                  setQuery('');
                  setFilter('전체');
                }}
              />
            </Stack>
          )}
        </>
      ) : (
        <Stack maxWidth={760} gap={5}>
          <Heading level={2}>책에 남긴 흔적</Heading>
          {books
            .filter(
              book =>
                library[book.id] &&
                (library[book.id].note || library[book.id].pages > 0),
            )
            .map(book => (
              <Stack key={book.id} gap={3} xstyle={styles.row}>
                <Heading level={3}>{book.title}</Heading>
                <Text>
                  {library[book.id].shelf} · {library[book.id].pages}쪽 · 평점{' '}
                  {library[book.id].rating}
                </Text>
                <Text>
                  {library[book.id].note || '아직 남긴 메모가 없습니다.'}
                </Text>
                <Stack direction="horizontal">
                  <Button label="기록 수정" onClick={() => record(book.id)} />
                </Stack>
              </Stack>
            ))}
        </Stack>
      )}
      {current && (
        <Modal
          title={`${current.title} · 독서 기록`}
          onClose={() => setEditing(null)}>
          <Stack
            as="form"
            gap={4}
            onSubmit={event => {
              event.preventDefault();
              const pages = Math.max(0, Math.min(current.pages, draft.pages));
              setLibrary(old => ({
                ...old,
                [current.id]: {
                  ...draft,
                  pages,
                  shelf:
                    pages === current.pages
                      ? '완독'
                      : draft.shelf === '완독'
                        ? '읽는 중'
                        : draft.shelf,
                },
              }));
              setEditing(null);
              setNotice('독서 기록을 저장했습니다.');
            }}>
            <Selector
              label="독서 상태"
              value={draft.shelf}
              options={['읽고 싶은', '읽는 중', '완독']}
              onChange={shelf =>
                setDraft({
                  ...draft,
                  shelf,
                  pages:
                    shelf === '완독'
                      ? current.pages
                      : shelf === '읽고 싶은'
                        ? 0
                        : Math.min(draft.pages, current.pages - 1),
                })
              }
            />
            <NumberInput
              label="읽은 페이지"
              value={draft.pages}
              min={0}
              max={current.pages}
              onChange={pages =>
                setDraft({
                  ...draft,
                  pages: pages ?? 0,
                  shelf: pages === current.pages ? '완독' : '읽는 중',
                })
              }
            />
            <Text type="supporting">전체 {current.pages}쪽</Text>
            <Selector
              label="평점"
              options={['미정', '1', '2', '3', '4', '5']}
              value={draft.rating}
              onChange={rating => setDraft({...draft, rating})}
            />
            <TextArea
              label="기억하고 싶은 문장과 생각"
              value={draft.note}
              onChange={note => setDraft({...draft, note})}
            />
            <Button label="기록 저장" type="submit" />
          </Stack>
        </Modal>
      )}
    </AppShell>
  );
}
