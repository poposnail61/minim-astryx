// Copyright (c) Meta Platforms, Inc. and affiliates.

'use client';
/** Order triage, batch dispatch, inventory editing, and store settings. */
import {useState} from 'react';
import * as stylex from '@stylexjs/stylex';
import {Stack} from '@astryxdesign/core/Stack';
import {Text} from '@astryxdesign/core/Text';
import {Heading} from '@astryxdesign/core/Heading';
import {Button} from '@astryxdesign/core/Button';
import {Table, proportional, pixel} from '@astryxdesign/core/Table';
import {TextInput} from '@astryxdesign/core/TextInput';
import {NumberInput} from '@astryxdesign/core/NumberInput';
import {Selector} from '@astryxdesign/core/Selector';
import {CheckboxInput} from '@astryxdesign/core/CheckboxInput';
import {Token} from '@astryxdesign/core/Token';
import {Pagination} from '@astryxdesign/core/Pagination';
import {Banner} from '@astryxdesign/core/Banner';
import {Switch} from '@astryxdesign/core/Switch';
import {AlertDialog} from '@astryxdesign/core/AlertDialog';
import {DropdownMenu} from '@astryxdesign/core/DropdownMenu';
import {
  AdminShell,
  Metrics,
  Modal,
  useSavedState,
  Glyph,
  photo,
  ui,
} from '../shared';

const products = [
  {
    name: '데일리 캔버스 백',
    price: 42000,
    stock: 18,
    image: 'photo-1553062407-98eeb64c6a62',
  },
  {
    name: '스튜디오 헤드폰',
    price: 129000,
    stock: 7,
    image: 'photo-1546435770-a3e426bf472b',
  },
  {
    name: '클래식 스니커즈',
    price: 89000,
    stock: 24,
    image: 'photo-1542291026-7eec264c27ff',
  },
];
const seed = Array.from({length: 14}, (_, i) => ({
  id: `OR-${2401 + i}`,
  customer: [
    '김서연',
    '이도윤',
    '박지우',
    '정하준',
    '최수빈',
    '한예린',
    '윤지호',
  ][i % 7],
  product: i % 3,
  quantity: i % 4 === 0 ? 2 : 1,
  status: ['결제 완료', '출고 대기', '배송 중', '배송 완료'][i % 4],
  date: `09.${23 - Math.floor(i / 5)}`,
  note: '',
}));
type Order = (typeof seed)[number];
const money = (n: number) => `${n.toLocaleString()}원`;
export default function Commerce() {
  const [section, setSection] = useState('주문 관리');
  const [orders, setOrders] = useSavedState('admin-commerce-orders', seed);
  const [stock, setStock] = useSavedState(
    'admin-commerce-stock',
    products.map(p => p.stock),
  );
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('전체');
  const [page, setPage] = useState(1);
  const [checked, setChecked] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [notice, setNotice] = useState('');
  const [confirm, setConfirm] = useState(false);
  const [editingStock, setEditingStock] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(0);
  const [alerts, setAlerts] = useSavedState('admin-commerce-alerts', true);
  const [threshold, setThreshold] = useSavedState(
    'admin-commerce-threshold',
    10,
  );
  const filtered = orders.filter(
    o =>
      (filter === '전체' || o.status === filter) &&
      `${o.id} ${o.customer} ${products[o.product].name}`.includes(query),
  );
  const current = orders.find(o => o.id === selected);
  const update = (id: string, patch: Partial<Order>) => {
    setOrders(old => old.map(o => (o.id === id ? {...o, ...patch} : o)));
    if (patch.status && !['결제 완료', '출고 대기'].includes(patch.status)) {
      setChecked(old => old.filter(value => value !== id));
    }
  };
  const sections = [
    {label: '주문 관리', icon: 'shopping-bag'},
    {label: '상품 재고', icon: 'category'},
    {label: '스토어 설정', icon: 'setting'},
  ];
  return (
    <AdminShell
      app="commerce"
      brand="STUDIO SUPPLY"
      title={section}
      section={section}
      onSection={setSection}
      sections={sections}
      action={
        section === '주문 관리' ? (
          <Button
            label="선택 주문 출고"
            icon={<Glyph name="shipping-local" />}
            isDisabled={!checked.length}
            onClick={() => {
              setOrders(old =>
                old.map(o =>
                  checked.includes(o.id) ? {...o, status: '배송 중'} : o,
                ),
              );
              setNotice(`${checked.length}개 주문을 출고 처리했어요.`);
              setChecked([]);
            }}
          />
        ) : undefined
      }>
      {notice && (
        <Banner
          status="success"
          title={notice}
          isDismissable
          onDismiss={() => setNotice('')}
        />
      )}
      {section === '주문 관리' && (
        <>
          <Metrics
            items={[
              {
                label: '총 주문 금액',
                value: money(
                  orders
                    .filter(o => o.status !== '취소')
                    .reduce(
                      (s, o) => s + products[o.product].price * o.quantity,
                      0,
                    ),
                ),
                detail: `9월 주문 ${orders.length}건`,
              },
              {
                label: '출고할 주문',
                value: `${orders.filter(o => ['결제 완료', '출고 대기'].includes(o.status)).length}건`,
                detail: '오늘 오후 3시 집하 마감',
              },
              {
                label: '배송 중',
                value: `${orders.filter(o => o.status === '배송 중').length}건`,
                detail: '고객에게 배송 안내 완료',
              },
            ]}
          />
          <Stack direction="horizontal" gap={3} vAlign="end">
            <TextInput
              label="주문 검색"
              isLabelHidden
              placeholder="주문번호, 고객, 상품 검색"
              startIcon="search"
              value={query}
              onChange={v => {
                setQuery(v);
                setPage(1);
              }}
              width={320}
            />
            <Selector
              label="주문 상태"
              isLabelHidden
              value={filter}
              options={[
                '전체',
                '결제 완료',
                '출고 대기',
                '배송 중',
                '배송 완료',
                '취소',
              ]}
              onChange={v => {
                setFilter(v);
                setPage(1);
              }}
              width={180}
            />
            <Text color="secondary">{filtered.length}건</Text>
            {checked.length > 0 && (
              <Token
                label={`${checked.length}건 선택`}
                onRemove={() => setChecked([])}
              />
            )}
          </Stack>
          <Table
            data={filtered.slice((page - 1) * 6, page * 6)}
            idKey="id"
            hasHover
            columns={[
              {
                key: 'select',
                header: '선택',
                width: pixel(60),
                renderCell: o => (
                  <CheckboxInput
                    label={`${o.id} 선택`}
                    isLabelHidden
                    value={checked.includes(o.id)}
                    isDisabled={!['결제 완료', '출고 대기'].includes(o.status)}
                    onChange={v =>
                      setChecked(old =>
                        v ? [...old, o.id] : old.filter(id => id !== o.id),
                      )
                    }
                  />
                ),
              },
              {
                key: 'id',
                header: '주문번호',
                width: proportional(1),
                renderCell: o => (
                  <Button
                    label={`${o.id} 상세`}
                    variant="ghost"
                    onClick={() => setSelected(o.id)}>
                    {o.id}
                  </Button>
                ),
              },
              {key: 'customer', header: '고객', width: pixel(90)},
              {
                key: 'product',
                header: '상품',
                width: proportional(2),
                renderCell: o => (
                  <Stack direction="horizontal" vAlign="center" gap={3}>
                    <img
                      src={photo(products[o.product].image, 120)}
                      alt=""
                      {...stylex.props(ui.photo)}
                    />
                    <Stack>
                      <Text>{products[o.product].name}</Text>
                      <Text type="supporting" color="secondary">
                        수량 {o.quantity}
                      </Text>
                    </Stack>
                  </Stack>
                ),
              },
              {
                key: 'amount',
                header: '결제 금액',
                width: pixel(130),
                renderCell: o => money(products[o.product].price * o.quantity),
              },
              {
                key: 'status',
                header: '처리 상태',
                width: pixel(120),
                renderCell: o => (
                  <Token
                    label={o.status}
                    color={
                      o.status === '배송 중'
                        ? 'blue'
                        : o.status === '취소'
                          ? 'red'
                          : 'default'
                    }
                  />
                ),
              },
              {key: 'date', header: '주문일', width: pixel(80)},
            ]}
          />
          {filtered.length > 6 && (
            <Pagination
              page={page}
              onChange={setPage}
              totalItems={filtered.length}
              pageSize={6}
            />
          )}
        </>
      )}
      {section === '상품 재고' && (
        <>
          <Metrics
            items={[
              {label: '판매 중인 상품', value: '3개', detail: '온라인 스토어'},
              {
                label: '보유 재고',
                value: `${stock.reduce((a, b) => a + b, 0)}개`,
                detail: '출고 가능 수량',
              },
              {
                label: '재고 부족',
                value: `${stock.filter(v => v < threshold).length}개`,
                detail: `기준 ${threshold}개 미만`,
              },
            ]}
          />
          {alerts && stock.some(v => v < threshold) && (
            <Banner
              status="warning"
              title="재고가 부족한 상품이 있어요"
              description="입고 수량을 확인하고 재고를 갱신해주세요."
            />
          )}
          <Table
            data={products.map((p, i) => ({...p, id: i}))}
            idKey="id"
            columns={[
              {
                key: 'name',
                header: '상품',
                width: proportional(2),
                renderCell: p => (
                  <Stack direction="horizontal" gap={3} vAlign="center">
                    <img
                      src={photo(p.image, 120)}
                      alt=""
                      {...stylex.props(ui.photo)}
                    />
                    <Text>{p.name}</Text>
                  </Stack>
                ),
              },
              {
                key: 'price',
                header: '판매가',
                width: proportional(1),
                renderCell: p => money(p.price),
              },
              {
                key: 'stock',
                header: '가용 재고',
                width: proportional(1),
                renderCell: p => (
                  <Token
                    label={`${stock[p.id]}개`}
                    color={stock[p.id] < threshold ? 'orange' : 'default'}
                  />
                ),
              },
              {
                key: 'edit',
                header: '관리',
                width: pixel(120),
                renderCell: p => (
                  <Button
                    label={`${p.name} 재고 수정`}
                    variant="ghost"
                    onClick={() => {
                      setEditingStock(p.id);
                      setQuantity(stock[p.id]);
                    }}>
                    재고 수정
                  </Button>
                ),
              },
            ]}
          />
        </>
      )}
      {section === '스토어 설정' && (
        <Stack gap={6} maxWidth={560}>
          <Heading level={3}>재고 알림</Heading>
          <Switch
            label="재고 부족 알림"
            description="기준 수량보다 적은 상품을 재고 화면에서 알려줘요"
            value={alerts}
            onChange={setAlerts}
          />
          <NumberInput
            label="재고 부족 기준"
            value={threshold}
            min={1}
            max={100}
            isIntegerOnly
            units="개"
            onChange={setThreshold}
          />
          <Text color="secondary">설정은 이 브라우저에 자동 저장됩니다.</Text>
        </Stack>
      )}
      {current && (
        <Modal
          title={`${current.id} 주문 상세`}
          onClose={() => setSelected(null)}>
          <Stack direction="horizontal" hAlign="between">
            <Text>{current.customer} 고객</Text>
            <Token label={current.status} />
          </Stack>
          <Heading level={3}>{products[current.product].name}</Heading>
          <Text>
            {current.quantity}개 ·{' '}
            {money(products[current.product].price * current.quantity)}
          </Text>
          <Selector
            label="처리 상태"
            value={current.status}
            options={['결제 완료', '출고 대기', '배송 중', '배송 완료', '취소']}
            onChange={status => {
              if (status === '취소') {
                setConfirm(true);
              } else {
                update(current.id, {status});
              }
            }}
          />
          <TextInput
            label="처리 메모"
            value={current.note}
            onChange={note => update(current.id, {note})}
          />
          <DropdownMenu
            button={{label: '주문 작업', variant: 'neutral-subtle'}}
            items={[
              {
                label: '출고 대기로 변경',
                isDisabled: !['결제 완료', '출고 대기'].includes(
                  current.status,
                ),
                onClick: () => update(current.id, {status: '출고 대기'}),
              },
              {
                label: '주문 취소',
                variant: 'destructive',
                onClick: () => setConfirm(true),
              },
            ]}
          />
        </Modal>
      )}
      <AlertDialog
        isOpen={confirm}
        onOpenChange={setConfirm}
        title="주문을 취소할까요?"
        description="이 샘플의 주문 상태만 변경됩니다. 실제 결제는 취소되지 않습니다."
        actionLabel="주문 취소 확정"
        cancelLabel="돌아가기"
        onAction={() => {
          if (current) {
            update(current.id, {status: '취소'});
          }
          setConfirm(false);
          setNotice('주문을 취소했어요.');
        }}
      />
      {editingStock !== null && (
        <Modal title="재고 수정" onClose={() => setEditingStock(null)}>
          <Text>{products[editingStock].name}</Text>
          <NumberInput
            label="재고 수량"
            value={quantity}
            onChange={setQuantity}
            min={0}
            max={10000}
            isIntegerOnly
          />
          <Button
            label="재고 저장"
            onClick={() => {
              setStock(old =>
                old.map((v, i) => (i === editingStock ? quantity : v)),
              );
              setEditingStock(null);
              setNotice('재고를 저장했어요.');
            }}
          />
        </Modal>
      )}
    </AdminShell>
  );
}
