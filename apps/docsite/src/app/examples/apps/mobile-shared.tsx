// Copyright (c) Meta Platforms, Inc. and affiliates.

'use client';

/** Mobile sample frame. Controls retain the active Minim theme and density. */
import type {ReactNode} from 'react';
import * as stylex from '@stylexjs/stylex';
import {Stack} from '@astryxdesign/core/Stack';
import {Text} from '@astryxdesign/core/Text';
import {Heading} from '@astryxdesign/core/Heading';
import {Button} from '@astryxdesign/core/Button';
import {Icon} from '@astryxdesign/core/Icon';
import {Link} from '@astryxdesign/core/Link';
import {Selector} from '@astryxdesign/core/Selector';
import {
  SegmentedControl,
  SegmentedControlItem,
} from '@astryxdesign/core/SegmentedControl';
import {
  colorVars,
  spacingVars,
  radiusVars,
} from '@astryxdesign/core/theme/tokens.stylex';
import {useMinimDensity} from '../../providers';

export const mobile = stylex.create({
  canvas: {
    minHeight: '100dvh',
    backgroundColor: colorVars['--color-background-muted'],
  },
  frame: {
    width: '100%',
    maxWidth: 480,
    height: '100dvh',
    overflow: 'hidden',
    marginInline: 'auto',
    backgroundColor: colorVars['--color-background-surface'],
  },
  top: {
    position: 'sticky',
    top: 0,
    zIndex: 5,
    backgroundColor: colorVars['--color-background-surface'],
    borderBottom: `1px solid ${colorVars['--color-border']}`,
  },
  main: {
    flex: 1,
    minWidth: 0,
    minHeight: 0,
    overflowY: 'auto',
    paddingBottom: spacingVars['--spacing-8'],
  },
  bottom: {
    position: 'sticky',
    bottom: 0,
    zIndex: 4,
    backgroundColor: colorVars['--color-background-surface'],
    borderTop: `1px solid ${colorVars['--color-border']}`,
    paddingBottom: 'max(env(safe-area-inset-bottom), 8px)',
  },
  nav: {flex: 1, minWidth: 0},
  navButton: {
    height: 'auto',
    minHeight: 60,
    paddingBlock: spacingVars['--spacing-2'],
  },
  row: {borderBottom: `1px solid ${colorVars['--color-border']}`},
  grow: {flex: 1, minWidth: 0},
  image: {
    width: '100%',
    aspectRatio: '2 / 1',
    objectFit: 'cover',
    borderRadius: radiusVars['--radius-element'],
    display: 'block',
  },
  cover: {
    width: '100%',
    aspectRatio: '1',
    objectFit: 'cover',
    display: 'block',
    borderRadius: radiusVars['--radius-element'],
  },
  thumb: {
    width: 52,
    height: 52,
    objectFit: 'cover',
    borderRadius: radiusVars['--radius-inner'],
    flexShrink: 0,
  },
  muted: {
    backgroundColor: colorVars['--color-background-muted'],
    borderRadius: radiusVars['--radius-element'],
  },
  accent: {
    backgroundColor: colorVars['--color-accent-muted'],
    borderRadius: radiusVars['--radius-element'],
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: spacingVars['--spacing-4'],
  },
  sets: {
    display: 'grid',
    gridTemplateColumns: '32px minmax(0, 1fr) minmax(0, 1fr) 44px',
    gap: spacingVars['--spacing-2'],
    alignItems: 'center',
  },
  number: {fontVariantNumeric: 'tabular-nums'},
  player: {
    paddingBlock: spacingVars['--spacing-3'],
    borderTop: `1px solid ${colorVars['--color-border']}`,
  },
});

export function Glyph({name}: {name: string}) {
  return <Icon icon={`minim:${name}`} />;
}
export function IconAction({
  name,
  label,
  onClick,
  disabled = false,
}: {
  name: string;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <Button
      label={label}
      tooltip={label}
      isIconOnly
      icon={<Glyph name={name} />}
      variant="ghost"
      onClick={onClick}
      isDisabled={disabled}
    />
  );
}
export function MobileShell({
  app,
  title,
  tab,
  tabs,
  onTab,
  children,
  accessory,
}: {
  app: string;
  title: string;
  tab: string;
  tabs: {label: string; icon: string}[];
  onTab: (tab: string) => void;
  children: ReactNode;
  accessory?: ReactNode;
}) {
  const {density, setDensity} = useMinimDensity();
  return (
    <Stack xstyle={mobile.canvas}>
      <Stack xstyle={mobile.frame}>
        <Stack as="header" padding={4} gap={3} xstyle={mobile.top}>
          <Stack
            direction="horizontal"
            hAlign="between"
            vAlign="center"
            gap={2}>
            <Selector
              label="샘플 앱"
              isLabelHidden
              variant="ghost"
              value={app}
              onChange={value => {
                window.location.href = `/examples/apps/${value}`;
              }}
              options={[
                {value: 'fitness', label: '운동 기록'},
                {value: 'wallet', label: '생활 가계부'},
                {value: 'music', label: '음악 감상'},
              ]}
            />
            <SegmentedControl
              label="화면 밀도"
              value={density}
              onChange={v => setDensity(v as 'base' | 'compact')}
              size="md">
              <SegmentedControlItem value="base" label="Base" />
              <SegmentedControlItem value="compact" label="Compact" />
            </SegmentedControl>
          </Stack>
          <Stack direction="horizontal" hAlign="between" vAlign="center">
            <Heading level={2} accessibilityLevel={1}>
              {title}
            </Heading>
            <Link href="/examples">Minim</Link>
          </Stack>
        </Stack>
        <Stack as="main" padding={5} gap={6} xstyle={mobile.main}>
          {children}
        </Stack>
        <Stack xstyle={mobile.bottom}>
          {accessory}
          <Stack
            as="nav"
            aria-label="앱 메뉴"
            direction="horizontal"
            gap={1}
            padding={2}>
            {tabs.map(item => (
              <Stack key={item.label} xstyle={mobile.nav}>
                <Button
                  label={item.label}
                  xstyle={mobile.navButton}
                  variant={tab === item.label ? 'neutral-subtle' : 'ghost'}
                  aria-current={tab === item.label ? 'page' : undefined}
                  onClick={() => onTab(item.label)}>
                  <Stack gap={1} vAlign="center">
                    <Glyph name={item.icon} />
                    <Text type="supporting" color="inherit">
                      {item.label}
                    </Text>
                  </Stack>
                </Button>
              </Stack>
            ))}
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}

export function SectionTitle({
  title,
  action,
}: {
  title: string;
  action?: ReactNode;
}) {
  return (
    <Stack direction="horizontal" hAlign="between" vAlign="center" gap={3}>
      <Heading level={3}>{title}</Heading>
      {action}
    </Stack>
  );
}
export const photo = (id: string, width = 800) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=80`;
