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
import {NumberInput} from '@astryxdesign/core/NumberInput';
import {Selector} from '@astryxdesign/core/Selector';
import {CheckboxInput} from '@astryxdesign/core/CheckboxInput';
import {Token} from '@astryxdesign/core/Token';
import {ProgressBar} from '@astryxdesign/core/ProgressBar';
import {AppShell, Tabs, styles, useSavedState} from '../shared';

type Ingredient = {name: string; amount: number; unit: string};
type Grocery = Ingredient & {checked: boolean};
const recipes = [
  {
    id: 'pasta',
    name: '버섯 시금치 파스타',
    category: '한 끼',
    time: 20,
    image: 'photo-1473093226795-af9932fe5856',
    ingredients: [
      {name: '파스타', amount: 100, unit: 'g'},
      {name: '양송이버섯', amount: 4, unit: '개'},
      {name: '시금치', amount: 50, unit: 'g'},
      {name: '올리브오일', amount: 1, unit: '큰술'},
    ],
    steps: [
      '끓는 소금물에 파스타를 포장지의 권장 시간대로 삶아요.',
      '팬에 올리브오일과 얇게 썬 버섯을 넣고 5분간 볶아요.',
      '시금치와 면, 면수 두 큰술을 넣고 골고루 볶아요.',
    ],
  },
  {
    id: 'salad',
    name: '아보카도 그린 샐러드',
    category: '가볍게',
    time: 10,
    image: 'photo-1512621776951-a57141f2eefd',
    ingredients: [
      {name: '아보카도', amount: 1, unit: '개'},
      {name: '샐러드 채소', amount: 100, unit: 'g'},
      {name: '토마토', amount: 1, unit: '개'},
      {name: '올리브오일', amount: 1, unit: '큰술'},
    ],
    steps: [
      '채소를 씻고 물기를 충분히 빼요.',
      '아보카도와 토마토를 먹기 좋은 크기로 썰어요.',
      '모두 담고 올리브오일과 소금으로 간해요.',
    ],
  },
  {
    id: 'toast',
    name: '주말의 프렌치토스트',
    category: '브런치',
    time: 15,
    image: 'photo-1484723091739-30a097e8f929',
    ingredients: [
      {name: '식빵', amount: 2, unit: '장'},
      {name: '달걀', amount: 1, unit: '개'},
      {name: '우유', amount: 50, unit: 'ml'},
      {name: '버터', amount: 10, unit: 'g'},
    ],
    steps: [
      '달걀과 우유를 골고루 섞어요.',
      '식빵을 달걀물에 앞뒤로 적셔요.',
      '버터를 녹인 팬에서 양면을 노릇하게 굽고 과일을 곁들여요.',
    ],
  },
  {
    id: 'bowl',
    name: '싱그러운 채소 한 그릇',
    category: '가볍게',
    time: 10,
    image: 'photo-1540420773420-3366772f4999',
    ingredients: [
      {name: '샐러드 채소', amount: 80, unit: 'g'},
      {name: '토마토', amount: 1, unit: '개'},
      {name: '오이', amount: 0.5, unit: '개'},
      {name: '올리브오일', amount: 1, unit: '큰술'},
    ],
    steps: [
      '채소를 씻고 물기를 빼요.',
      '오이와 토마토를 한입 크기로 썰어요.',
      '모든 채소를 담고 올리브오일을 둘러 가볍게 섞어요.',
    ],
  },
];

export default function KitchenApp() {
  const [groceries, setGroceries] = useSavedState<Grocery[]>(
    'minim-kitchen-groceries-v1',
    [],
  );
  const [tab, setTab] = useState('레시피');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('전체');
  const [selected, setSelected] = useState<string | null>(null);
  const [servings, setServings] = useState(2);
  const [notice, setNotice] = useState('');
  const recipe = recipes.find(r => r.id === selected);
  const visible = recipes.filter(
    r =>
      r.name.includes(query.trim()) &&
      (category === '전체' || r.category === category),
  );
  const completed = groceries.filter(item => item.checked).length;
  function addIngredients() {
    if (!recipe) {
      return;
    }
    setGroceries(old => {
      const next = old.map(item => ({...item}));
      recipe.ingredients.forEach(ingredient => {
        const item = next.find(
          x => x.name === ingredient.name && x.unit === ingredient.unit,
        );
        if (item) {
          item.amount += ingredient.amount * servings;
          item.checked = false;
        } else {
          next.push({
            ...ingredient,
            amount: ingredient.amount * servings,
            checked: false,
          });
        }
      });
      return next;
    });
    setNotice(`${recipe.name} ${servings}인분 재료를 담았습니다.`);
  }
  return (
    <AppShell
      app="kitchen"
      title="오늘의 식탁"
      subtitle="맛있는 일상, 차근차근">
      <Stack direction="horizontal" hAlign="between" wrap="wrap" gap={3}>
        <Tabs
          label="식탁 메뉴"
          value={tab}
          onChange={value => {
            setTab(value);
            setSelected(null);
            setNotice('');
          }}
          items={['레시피', '장보기']}
        />
        <Text>{groceries.length - completed}개 재료 구매 예정</Text>
      </Stack>
      {notice && <Text role="status">{notice}</Text>}
      {tab === '레시피' && !recipe && (
        <>
          <Stack direction="horizontal" gap={3} wrap="wrap" vAlign="end">
            <TextInput
              label="레시피 검색"
              placeholder="오늘 먹고 싶은 메뉴"
              value={query}
              onChange={setQuery}
              hasClear
            />
            <Selector
              label="종류"
              options={['전체', '한 끼', '가볍게', '브런치']}
              value={category}
              onChange={setCategory}
            />
          </Stack>
          <Grid columns={{minWidth: 250}} gap={5}>
            {visible.map(item => (
              <Stack key={item.id} xstyle={styles.card}>
                <img
                  src={`https://images.unsplash.com/${item.image}?auto=format&fit=crop&w=700&q=80`}
                  alt={item.name}
                  {...stylex.props(styles.photo)}
                />
                <Stack padding={4} gap={3}>
                  <Stack direction="horizontal" hAlign="between">
                    <Token label={item.category} color="green" />
                    <Text type="supporting">{item.time}분</Text>
                  </Stack>
                  <Heading level={2}>{item.name}</Heading>
                  <Text color="secondary">
                    재료 {item.ingredients.length}가지
                  </Text>
                  <Button
                    label="레시피 보기"
                    onClick={() => {
                      setSelected(item.id);
                      setServings(2);
                      setNotice('');
                    }}
                  />
                </Stack>
              </Stack>
            ))}
          </Grid>
          {!visible.length && (
            <Stack paddingBlock={8} gap={3}>
              <Heading level={2}>찾는 레시피가 없어요</Heading>
              <Text>다른 이름으로 검색하거나 종류를 바꿔보세요.</Text>
              <Button
                label="검색 초기화"
                onClick={() => {
                  setQuery('');
                  setCategory('전체');
                }}
              />
            </Stack>
          )}
        </>
      )}
      {tab === '레시피' && recipe && (
        <>
          <Stack direction="horizontal">
            <Button
              label="레시피 목록"
              onClick={() => {
                setSelected(null);
                setNotice('');
              }}
            />
          </Stack>
          <Stack xstyle={styles.split}>
            <Stack gap={5}>
              <img
                src={`https://images.unsplash.com/${recipe.image}?auto=format&fit=crop&w=1000&q=80`}
                alt={recipe.name}
                {...stylex.props(styles.image)}
              />
              <Heading level={2}>{recipe.name}</Heading>
              <Text>
                {recipe.time}분 · {recipe.category}
              </Text>
              <Heading level={3}>만드는 순서</Heading>
              {recipe.steps.map((step, index) => (
                <Stack
                  key={step}
                  direction="horizontal"
                  gap={4}
                  paddingBlock={3}>
                  <Token label={`0${index + 1}`} color="green" />
                  <Text>{step}</Text>
                </Stack>
              ))}
            </Stack>
            <Stack as="aside" gap={4}>
              <Heading level={2}>재료</Heading>
              <NumberInput
                label="인분"
                value={servings}
                min={1}
                max={12}
                onChange={value =>
                  setServings(Math.max(1, Math.min(12, value ?? 1)))
                }
              />
              {recipe.ingredients.map(item => (
                <Stack
                  key={item.name}
                  direction="horizontal"
                  hAlign="between"
                  gap={3}
                  xstyle={styles.row}>
                  <Text>{item.name}</Text>
                  <Text>
                    {item.amount * servings}
                    {item.unit}
                  </Text>
                </Stack>
              ))}
              <Button label="장보기 목록에 담기" onClick={addIngredients} />
              <Button label="장보기로 이동" onClick={() => setTab('장보기')} />
            </Stack>
          </Stack>
        </>
      )}
      {tab === '장보기' && (
        <Stack maxWidth={720} gap={5}>
          <Stack direction="horizontal" wrap="wrap" hAlign="between" gap={3}>
            <Heading level={2}>장보기 목록</Heading>
            <Button
              label="구매 완료 항목 삭제"
              isDisabled={!completed}
              onClick={() =>
                setGroceries(old => old.filter(item => !item.checked))
              }
            />
          </Stack>
          {groceries.length ? (
            <>
              <ProgressBar
                label={`${completed}/${groceries.length} 구매 완료`}
                value={completed}
                max={groceries.length}
              />
              {groceries.map(item => (
                <Stack
                  key={item.name}
                  direction="horizontal"
                  hAlign="between"
                  gap={3}
                  xstyle={styles.row}>
                  <CheckboxInput
                    label={item.name}
                    value={item.checked}
                    onChange={checked =>
                      setGroceries(old =>
                        old.map(x =>
                          x.name === item.name ? {...x, checked} : x,
                        ),
                      )
                    }
                  />
                  <Text>
                    {item.amount}
                    {item.unit}
                  </Text>
                </Stack>
              ))}
            </>
          ) : (
            <Stack paddingBlock={8} gap={4}>
              <Heading level={3}>아직 담은 재료가 없어요</Heading>
              <Text>레시피에서 필요한 인분만큼 재료를 담아보세요.</Text>
              <Button
                label="레시피 둘러보기"
                onClick={() => {
                  setTab('레시피');
                  setSelected(null);
                }}
              />
            </Stack>
          )}
        </Stack>
      )}
    </AppShell>
  );
}
