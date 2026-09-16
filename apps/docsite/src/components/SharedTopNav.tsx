// Copyright (c) Meta Platforms, Inc. and affiliates.

'use client';

import {lazy, Suspense, useEffect, useState} from 'react';
import {usePathname} from 'next/navigation';
import * as stylex from '@stylexjs/stylex';
import {
  TopNav,
  TopNavHeading,
  TopNavItem,
  TopNavRenderContext,
  useTopNavRenderMode,
} from '@astryxdesign/core/TopNav';
import {useAppShellMobile} from '@astryxdesign/core/AppShell';
import {MobileNav} from '@astryxdesign/core/MobileNav';
import {Button} from '@astryxdesign/core/Button';
import {Icon} from '@astryxdesign/core/Icon';
import {
  SegmentedControl,
  SegmentedControlItem,
} from '@astryxdesign/core/SegmentedControl';
import {HStack} from '@astryxdesign/core/Layout';
import {spacingVars} from '@astryxdesign/core/theme/tokens.stylex';
import {GITHUB_REPO} from '../constants';
import {useThemeMode} from '../app/providers';
import {trackSearch, trackClickCta} from '../lib/analytics';

const LazySearchPalette = lazy(() =>
  import('./SearchPalette').then(module => ({default: module.SearchPalette})),
);

// Responsive helpers. The desktop links and the mobile hamburger both live in
// the DOM at all times; a pure CSS @media query decides which is visible so the
// server-rendered HTML is correct on first paint (no post-hydration flip).
const MOBILE_BREAKPOINT = '@media (max-width: 768px)';

const styles = stylex.create({
  desktopNav: {
    display: {
      default: 'flex',
      [MOBILE_BREAKPOINT]: 'none',
    },
    alignItems: 'center',
    gap: spacingVars['--spacing-1'],
  },
  mobileToggle: {
    display: {
      default: 'none',
      [MOBILE_BREAKPOINT]: 'flex',
    },
    alignItems: 'center',
  },
  drawerItems: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacingVars['--spacing-0-5'],
  },
});

// Primary navigation links, shared by the desktop bar and the mobile drawer.
const NAV_ITEMS = [
  {key: 'docs', label: 'Docs', href: '/docs/getting-started'},
  {key: 'components', label: 'Components', href: '/components'},
] as const;

export function SharedTopNav() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [hasLoadedSearch, setHasLoadedSearch] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const {density = 'base', setDensity} = useThemeMode();
  // When AppShell owns the mobile drawer (docs, which has a sideNav) we defer
  // to its single hamburger; otherwise we render our own.
  const {isMobileNavEnabled, closeMobileNav} = useAppShellMobile();
  const renderMode = useTopNavRenderMode();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) {
        return;
      }
      if (
        (event.metaKey || event.ctrlKey) &&
        !event.shiftKey &&
        !event.altKey &&
        event.key.toLowerCase() === 'k'
      ) {
        event.preventDefault();
        trackSearch({target: 'open'});
        setHasLoadedSearch(true);
        setIsSearchOpen(true);
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  // Determine active nav item
  const getActiveItem = () => {
    if (
      pathname === '/docs' ||
      pathname.startsWith('/docs/') ||
      pathname.startsWith('/changelog')
    ) {
      return 'docs';
    }
    if (pathname.startsWith('/templates')) {
      return 'templates';
    }
    if (pathname.startsWith('/themes')) {
      return 'themes';
    }
    if (pathname.startsWith('/components')) {
      return 'components';
    }
    if (pathname.startsWith('/playground')) {
      return 'playground';
    }
    return undefined;
  };

  const navLinks = (onNavigate?: () => void) =>
    NAV_ITEMS.map(item => (
      <TopNavItem
        key={item.key}
        label={item.label}
        href={item.href}
        isSelected={getActiveItem() === item.key}
        onClick={onNavigate}
      />
    ));

  return (
    <>
      <TopNav
        label="Minim Astryx navigation"
        heading={
          <TopNavHeading logo={<span>Minim Astryx</span>} headingHref="/" />
        }
        centerContent={
          renderMode === 'drawer' ? (
            // Bare items — AppShell's drawer supplies its own vertical list;
            // the desktopNav wrapper would hide them (display:none) here.
            <>{navLinks(closeMobileNav)}</>
          ) : (
            <div {...stylex.props(styles.desktopNav)}>{navLinks()}</div>
          )
        }
        endContent={
          <HStack gap={2}>
            <HStack gap={0.5}>
              <Button
                label="Search"
                tooltip="Search"
                variant="ghost"
                isIconOnly
                icon={<Icon icon="search" size="md" />}
                onClick={() => {
                  trackSearch({target: 'open'});
                  setHasLoadedSearch(true);
                  setIsSearchOpen(true);
                }}
              />
              <SegmentedControl
                value={density}
                onChange={value => {
                  if (value === 'base' || value === 'compact') {
                    setDensity?.(value);
                  }
                }}
                label="Interface density"
                size="md">
                <SegmentedControlItem value="base" label="Base" />
                <SegmentedControlItem value="compact" label="Compact" />
              </SegmentedControl>
              <Button
                label="GitHub"
                variant="ghost"
                href={GITHUB_REPO}
                onClick={() => trackClickCta({target: 'github'})}
              />
            </HStack>
            {!isMobileNavEnabled && (
              <div {...stylex.props(styles.mobileToggle)}>
                <Button
                  label="Open menu"
                  tooltip="Menu"
                  variant="ghost"
                  isIconOnly
                  icon={<Icon icon="menu" size="md" />}
                  onClick={() => setIsMenuOpen(true)}
                />
              </div>
            )}
          </HStack>
        }
      />
      {hasLoadedSearch && (
        <Suspense fallback={null}>
          <LazySearchPalette
            isOpen={isSearchOpen}
            onOpenChange={setIsSearchOpen}
          />
        </Suspense>
      )}
      {!isMobileNavEnabled && (
        <MobileNav
          isOpen={isMenuOpen}
          onOpenChange={setIsMenuOpen}
          side="end"
          label="Minim Astryx navigation"
          header={<span>Minim Astryx</span>}>
          <TopNavRenderContext value="drawer">
            <div {...stylex.props(styles.drawerItems)}>
              {navLinks(() => setIsMenuOpen(false))}
            </div>
          </TopNavRenderContext>
        </MobileNav>
      )}
    </>
  );
}
