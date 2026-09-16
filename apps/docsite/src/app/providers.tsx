// Copyright (c) Meta Platforms, Inc. and affiliates.

'use client';

import {createContext, useContext, useState} from 'react';
import Link from 'next/link';
import {Theme} from '@astryxdesign/core/theme';
import {LinkProvider} from '@astryxdesign/core/Link';
import {minimCompactTheme, minimTheme} from '@astryxdesign/theme-minim/built';

type ThemeMode = 'light' | 'dark';
export type MinimDensity = 'base' | 'compact';

type SiteThemeContextValue = {
  /** Resolved color mode retained for existing docsite consumers. */
  mode: ThemeMode;
  /** Raw mode retained for existing theme-preview consumers. */
  themeMode: 'system' | ThemeMode;
  /** Minim only has a light mode, so this compatibility action is inert. */
  toggleMode: () => void;
  density: MinimDensity;
  setDensity: (density: MinimDensity) => void;
};

const noop = () => {};

const ThemeModeContext = createContext<SiteThemeContextValue>({
  mode: 'light',
  themeMode: 'light',
  toggleMode: noop,
  density: 'base',
  setDensity: noop,
});

export function useThemeMode() {
  return useContext(ThemeModeContext);
}

export function useMinimDensity() {
  const {density, setDensity} = useContext(ThemeModeContext);
  return {density, setDensity};
}

export function Providers({children}: {children: React.ReactNode}) {
  const [density, setDensity] = useState<MinimDensity>('base');
  const theme = density === 'compact' ? minimCompactTheme : minimTheme;

  return (
    <ThemeModeContext
      value={{
        mode: 'light',
        themeMode: 'light',
        toggleMode: noop,
        density,
        setDensity,
      }}>
      <Theme theme={theme} mode="light">
        <LinkProvider component={Link}>{children}</LinkProvider>
      </Theme>
    </ThemeModeContext>
  );
}
