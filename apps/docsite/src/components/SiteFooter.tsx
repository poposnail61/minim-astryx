// Copyright (c) Meta Platforms, Inc. and affiliates.

'use client';

import * as stylex from '@stylexjs/stylex';
import {Text} from '@astryxdesign/core/Text';
import {Link} from '@astryxdesign/core/Link';
import {HStack, VStack} from '@astryxdesign/core/Layout';
import {Grid, GridSpan} from '@astryxdesign/core/Grid';
import {Divider} from '@astryxdesign/core/Divider';
import {Section} from '@astryxdesign/core/Section';
import {GITHUB_REPO, UPSTREAM_REPO} from '../constants';

const MOBILE = '@media (max-width: 768px)';

const styles = stylex.create({
  siteFooter: {
    // Match the section rhythm above (responsive); fall back off the home page.
    paddingTop:
      'var(--astryx-marketing-section-gap, calc(var(--spacing-12) * 2))',
  },
  // Keeps the wrapped link list to a readable measure once it stacks; on
  // desktop the links sit in their own grid column and must not be clamped.
  mobileFooterLinks: {
    maxWidth: {default: 'none', [MOBILE]: 320},
  },
  // The footer is one markup at every width — the layout swaps in CSS, not in
  // JS. It used to branch on `useAppShellMobile().isMobile`, which is a
  // `useMediaQuery` whose server snapshot is always `false`: the prerendered
  // HTML therefore carried the DESKTOP grid at every width, so on a phone the
  // wordmark, the link list and the social buttons all painted on top of each
  // other in ~80px columns until hydration replaced them. A media query has
  // the right answer on the very first paint.
  //
  // Every override below RESTATES its desktop value in `default` rather than
  // leaving it `null`. `xstyle` merges after the component's own styles and a
  // `null` there *unsets* the property, so `{default: null, …}` would strip
  // VStack's gap and Grid's `display: grid` at desktop width.
  stack: {
    // VStack gap={4}
    gap: {default: 'var(--spacing-4)', [MOBILE]: 'var(--spacing-6)'},
  },
  // `grid-template-columns` (from Grid) and `grid-column` (from GridSpan) are
  // inert under `display: flex`, and `flex-direction` is inert under
  // `display: grid`, so switching `display` alone turns the row into a
  // centered column.
  row: {
    display: {default: 'grid', [MOBILE]: 'flex'},
    flexDirection: 'column',
    alignItems: 'center',
  },
  navRow: {
    gap: {default: 'normal', [MOBILE]: 'var(--spacing-6)'},
  },
  legalRow: {
    gap: {default: 'normal', [MOBILE]: 'var(--spacing-2)'},
  },
  navLinks: {
    // HStack gap={4}
    gap: {default: 'var(--spacing-4)', [MOBILE]: 'var(--spacing-3)'},
  },
  social: {
    // Must stay `nowrap` on desktop: the social buttons sit in a `1fr` grid
    // track, and a track only grows past its share to fit its MIN-CONTENT — a
    // wrappable row has a one-icon min-content, so the track would stay at
    // 1/5 of the row and the icons would wrap onto a second line.
    flexWrap: {default: 'nowrap', [MOBILE]: 'wrap'},
  },
});

const FOOTER_LINKS: ReadonlyArray<{
  label: string;
  href: string;
}> = [
  {label: 'Docs', href: '/docs/getting-started'},
  {label: 'Components', href: '/components'},
];

function NavLinks() {
  return (
    <>
      {FOOTER_LINKS.map(item => (
        <Link
          key={item.label}
          href={item.href}
          type="supporting"
          color="secondary"
          isStandalone>
          {item.label}
        </Link>
      ))}
    </>
  );
}

export function SiteFooter({year}: {year: number}) {
  void year;
  const minimLogo = (
    <Link href="/components" label="Minim Astryx">
      <Text type="body" weight="semibold">
        Minim Astryx
      </Text>
    </Link>
  );

  return (
    <Section role="contentinfo" padding={6} xstyle={styles.siteFooter}>
      <VStack gap={4} xstyle={styles.stack}>
        <Grid columns={5} align="center" xstyle={[styles.row, styles.navRow]}>
          {minimLogo}
          <GridSpan columns={3}>
            <HStack
              gap={4}
              wrap="wrap"
              align="center"
              hAlign="center"
              xstyle={[styles.navLinks, styles.mobileFooterLinks]}>
              <NavLinks />
            </HStack>
          </GridSpan>
          <HStack gap={2} align="center" justify="end" xstyle={styles.social}>
            <Link href={GITHUB_REPO} type="supporting" color="secondary">
              GitHub
            </Link>
          </HStack>
        </Grid>

        <Divider />

        <HStack gap={1} align="center" hAlign="center" width="100%">
          <Text type="supporting" color="secondary">
            Based on
          </Text>
          <Link href={UPSTREAM_REPO} type="supporting" color="secondary">
            Astryx
          </Link>
          <Text type="supporting" color="secondary">
            under the
          </Text>
          <Link
            href={`${GITHUB_REPO}/blob/main/LICENSE`}
            type="supporting"
            color="secondary">
            MIT License
          </Link>
        </HStack>
      </VStack>
    </Section>
  );
}
