// Copyright (c) Meta Platforms, Inc. and affiliates.

'use client';

import {useEffect, useState, type ReactNode} from 'react';
import * as stylex from '@stylexjs/stylex';
import {Stack} from '@astryxdesign/core/Stack';
import {Heading} from '@astryxdesign/core/Heading';
import {Text} from '@astryxdesign/core/Text';
import {Link} from '@astryxdesign/core/Link';
import {Dialog, DialogHeader} from '@astryxdesign/core/Dialog';
import {Layout, LayoutContent} from '@astryxdesign/core/Layout';
import {
  SegmentedControl,
  SegmentedControlItem,
} from '@astryxdesign/core/SegmentedControl';
import {
  borderVars,
  colorVars,
  radiusVars,
  spacingVars,
} from '@astryxdesign/core/theme/tokens.stylex';
import {useMinimDensity} from '../../providers';

// Wait for hydration before persisting so the initial render cannot erase saved work.
export function useSavedState<T>(key: string, initial: T) {
  const [value, setValue] = useState(initial);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        setValue(JSON.parse(saved) as T);
      }
    } catch {
      /* Keep the sample usable when storage is unavailable. */
    }
    setReady(true);
  }, [key]);
  useEffect(() => {
    if (ready) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch {
        /* Private browsing may disable storage. */
      }
    }
  }, [key, value, ready]);
  return [value, setValue] as const;
}

export const styles = stylex.create({
  page: {
    minHeight: '100dvh',
    backgroundColor: colorVars['--color-background-surface'],
  },
  container: {width: '100%', maxWidth: 1180, marginInline: 'auto', minWidth: 0},
  toolbar: {
    borderBottomWidth: borderVars['--border-width'],
    borderBottomStyle: 'solid',
    borderBottomColor: colorVars['--color-border'],
  },
  split: {
    display: 'grid',
    gridTemplateColumns: {
      default: 'minmax(0, 1fr) 300px',
      '@media (max-width: 800px)': 'minmax(0, 1fr)',
    },
    gap: spacingVars['--spacing-8'],
    alignItems: 'start',
  },
  row: {
    borderBottomWidth: borderVars['--border-width'],
    borderBottomStyle: 'solid',
    borderBottomColor: colorVars['--color-border'],
    paddingBlock: spacingVars['--spacing-3'],
  },
  muted: {
    backgroundColor: colorVars['--color-background-muted'],
    borderRadius: radiusVars['--radius-element'],
  },
  image: {
    width: '100%',
    height: 180,
    objectFit: 'cover',
    borderRadius: radiusVars['--radius-element'],
    display: 'block',
  },
  cover: {
    width: 90,
    height: 132,
    objectFit: 'cover',
    borderRadius: radiusVars['--radius-inner'],
    flexShrink: 0,
    backgroundColor: colorVars['--color-background-muted'],
  },
  card: {
    borderWidth: borderVars['--border-width'],
    borderStyle: 'solid',
    borderColor: colorVars['--color-border'],
    borderRadius: radiusVars['--radius-element'],
    overflow: 'hidden',
    minWidth: 0,
  },
  photo: {
    width: '100%',
    aspectRatio: '4 / 3',
    objectFit: 'cover',
    display: 'block',
  },
  grow: {flex: 1, minWidth: 0},
  wrap: {overflowWrap: 'anywhere'},
});

const apps = [
  {id: 'travel', label: '여행 수첩'},
  {id: 'kitchen', label: '오늘의 식탁'},
  {id: 'reading', label: '책갈피'},
];

export function AppShell({
  app,
  title,
  subtitle,
  children,
}: {
  app: string;
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  const {density, setDensity} = useMinimDensity();
  return (
    <Stack xstyle={styles.page}>
      <Stack as="header" padding={4} xstyle={styles.toolbar}>
        <Stack
          direction="horizontal"
          wrap="wrap"
          gap={4}
          hAlign="between"
          vAlign="center"
          xstyle={styles.container}>
          <Stack
            as="nav"
            aria-label="샘플 앱"
            direction="horizontal"
            gap={4}
            wrap="wrap">
            {apps.map(item => (
              <Link
                key={item.id}
                href={`/examples/apps/${item.id}`}
                aria-current={app === item.id ? 'page' : undefined}>
                <Text weight={app === item.id ? 'semibold' : 'normal'}>
                  {item.label}
                </Text>
              </Link>
            ))}
          </Stack>
          <SegmentedControl
            label="화면 밀도"
            value={density}
            onChange={value => setDensity(value as 'base' | 'compact')}>
            <SegmentedControlItem value="base" label="Base" />
            <SegmentedControlItem value="compact" label="Compact" />
          </SegmentedControl>
        </Stack>
      </Stack>
      <Stack as="main" padding={5} gap={6} xstyle={styles.container}>
        <Stack gap={2} paddingBlock={4}>
          <Text type="supporting">{subtitle}</Text>
          <Heading level={1}>{title}</Heading>
        </Stack>
        {children}
        <Stack as="footer" paddingBlock={6}>
          <Link href="/examples">Minim 예시로 돌아가기</Link>
        </Stack>
      </Stack>
    </Stack>
  );
}

export function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <Dialog
      isOpen
      onOpenChange={open => {
        if (!open) {
          onClose();
        }
      }}>
      <Layout
        header={
          <DialogHeader
            title={title}
            onOpenChange={open => {
              if (!open) {
                onClose();
              }
            }}
          />
        }
        content={
          <LayoutContent>
            <Stack gap={5}>{children}</Stack>
          </LayoutContent>
        }
      />
    </Dialog>
  );
}

export function Tabs({
  label,
  value,
  onChange,
  items,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  items: string[];
}) {
  return (
    <Stack isScrollable>
      <SegmentedControl label={label} value={value} onChange={onChange}>
        {items.map(item => (
          <SegmentedControlItem key={item} value={item} label={item} />
        ))}
      </SegmentedControl>
    </Stack>
  );
}
