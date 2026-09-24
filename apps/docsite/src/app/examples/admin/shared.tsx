// Copyright (c) Meta Platforms, Inc. and affiliates.

'use client';

/** Desktop sample frame shared by three independent operational workflows. */
import type {ReactNode} from 'react';
import * as stylex from '@stylexjs/stylex';
import {Stack} from '@astryxdesign/core/Stack';
import {Heading} from '@astryxdesign/core/Heading';
import {Text} from '@astryxdesign/core/Text';
import {SideNavItem, SideNavSection} from '@astryxdesign/core/SideNav';
import {Link} from '@astryxdesign/core/Link';
import {Avatar} from '@astryxdesign/core/Avatar';
import {Selector} from '@astryxdesign/core/Selector';
import {
  SegmentedControl,
  SegmentedControlItem,
} from '@astryxdesign/core/SegmentedControl';
import {
  colorVars,
  spacingVars,
  borderVars,
} from '@astryxdesign/core/theme/tokens.stylex';
import {useMinimDensity} from '../../providers';
import {Glyph} from '../apps/mobile-shared';
export {Glyph, photo} from '../apps/mobile-shared';
export {Modal, useSavedState} from '../apps/shared';

const applications = [
  {value: 'commerce', label: '쇼핑몰 운영'},
  {value: 'support', label: '고객지원'},
  {value: 'recruiting', label: '채용 관리'},
];
export function AdminShell({
  app,
  brand,
  title,
  section,
  onSection,
  sections,
  children,
  action,
}: {
  app: string;
  brand: string;
  title: string;
  section: string;
  onSection: (v: string) => void;
  sections: {label: string; icon: string}[];
  children: ReactNode;
  action?: ReactNode;
}) {
  const {density, setDensity} = useMinimDensity();
  return (
    <Stack xstyle={ui.frame}>
      <Stack as="aside" gap={6} padding={5} xstyle={ui.sidebar}>
        <Stack direction="horizontal" vAlign="center" gap={3}>
          <Glyph name={sections[0].icon} />
          <Heading level={3}>{brand}</Heading>
        </Stack>
        <Selector
          label="어드민 전환"
          value={app}
          options={applications}
          onChange={v => {
            window.location.href = `/examples/admin/${v}`;
          }}
        />
        <Stack as="nav" aria-label="업무 메뉴">
          <SideNavSection title="업무 메뉴" isHeaderHidden>
            {sections.map(s => (
              <SideNavItem
                key={s.label}
                label={s.label}
                icon={<Glyph name={s.icon} />}
                isSelected={section === s.label}
                onClick={() => onSection(s.label)}
              />
            ))}
          </SideNavSection>
        </Stack>
        <Stack xstyle={ui.bottom} gap={4}>
          <Link href="/examples">Minim 샘플 전체</Link>
          <Stack direction="horizontal" gap={3} vAlign="center">
            <Avatar name="김민지" size="md" />
            <Stack>
              <Text weight="medium">김민지</Text>
              <Text type="supporting" color="secondary">
                워크스페이스 관리자
              </Text>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
      <Stack xstyle={ui.workspace}>
        <Stack
          as="header"
          direction="horizontal"
          hAlign="between"
          vAlign="center"
          paddingInline={6}
          paddingBlock={4}
          xstyle={ui.line}>
          <Text color="secondary">
            {brand} / {section}
          </Text>
          <SegmentedControl
            label="화면 밀도"
            value={density}
            onChange={v => setDensity(v as 'base' | 'compact')}>
            <SegmentedControlItem label="Base" value="base" />
            <SegmentedControlItem label="Compact" value="compact" />
          </SegmentedControl>
        </Stack>
        <Stack as="main" padding={6} gap={6} xstyle={ui.main}>
          <Stack
            direction="horizontal"
            hAlign="between"
            vAlign="center"
            gap={4}>
            <Stack gap={2}>
              <Text type="supporting" color="secondary">
                2026년 9월 · 운영 워크스페이스
              </Text>
              <Heading level={1}>{title}</Heading>
            </Stack>
            {action}
          </Stack>
          {children}
        </Stack>
      </Stack>
    </Stack>
  );
}
export function Metrics({
  items,
}: {
  items: {label: string; value: string; detail: string}[];
}) {
  return (
    <Stack direction="horizontal" gap={6} paddingBlock={5} xstyle={ui.line}>
      {items.map(i => (
        <Stack key={i.label} gap={2} xstyle={ui.grow}>
          <Text color="secondary">{i.label}</Text>
          <Heading level={2}>{i.value}</Heading>
          <Text type="supporting" color="secondary">
            {i.detail}
          </Text>
        </Stack>
      ))}
    </Stack>
  );
}
export const ui = stylex.create({
  nav: {justifyContent: 'flex-start', width: '100%'},
  frame: {
    display: 'grid',
    gridTemplateColumns: {
      default: '224px minmax(0,1fr)',
      '@media(max-width:1100px)': '192px minmax(0,1fr)',
    },
    minHeight: '100dvh',
    backgroundColor: colorVars['--color-background-surface'],
  },
  sidebar: {
    backgroundColor: colorVars['--color-background-muted'],
    position: 'sticky',
    top: 0,
    height: '100dvh',
    minWidth: 0,
  },
  workspace: {minWidth: 0},
  main: {minWidth: 0},
  grow: {flex: 1, minWidth: 0},
  bottom: {marginTop: 'auto'},
  line: {
    borderBottomWidth: borderVars['--border-width'],
    borderBottomStyle: 'solid',
    borderBottomColor: colorVars['--color-border'],
  },
  row: {
    borderBottomWidth: borderVars['--border-width'],
    borderBottomStyle: 'solid',
    borderBottomColor: colorVars['--color-border'],
    paddingBlock: spacingVars['--spacing-4'],
  },
  split: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0,1fr) 320px',
    gap: spacingVars['--spacing-6'],
    alignItems: 'start',
  },
  inbox: {
    display: 'grid',
    gridTemplateColumns: {
      default: '280px minmax(280px,1fr) 248px',
      '@media(max-width:1250px)': '240px minmax(240px,1fr)',
    },
    gap: spacingVars['--spacing-5'],
    alignItems: 'start',
  },
  profile: {
    gridColumn: {default: 'auto', '@media(max-width:1250px)': '1 / -1'},
  },
  board: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4,minmax(0,1fr))',
    gap: spacingVars['--spacing-4'],
  },
  item: {
    borderWidth: borderVars['--border-width'],
    borderStyle: 'solid',
    borderColor: colorVars['--color-border'],
    borderRadius: 8,
    backgroundColor: colorVars['--color-background-surface'],
    minWidth: 0,
  },
  muted: {backgroundColor: colorVars['--color-background-muted']},
  photo: {width: 44, height: 44, objectFit: 'cover', borderRadius: 6},
  conversation: {minHeight: 260},
});
