// Copyright (c) Meta Platforms, Inc. and affiliates.

'use client';

/**
 * ComponentPreviewTheme.
 *
 * @input component preview chrome and preview content from the docsite
 * @output children rendered under the selected Minim density theme
 * @position Component detail previews — wraps the preview container as well as
 * the component so their backgrounds, borders, and content tokens match.
 */

import {type ReactNode} from 'react';
import {Theme} from '@astryxdesign/core/theme';
import {minimCompactTheme, minimTheme} from '@astryxdesign/theme-minim/built';
import {useMinimDensity} from '../../app/providers';

// Do NOT add a global icon registration here. That API writes to a process-wide
// registry, and this module is in the client bundle of the component-detail
// routes ONLY — while on the server one module registry is shared by every
// route. Registering here therefore gave the SSR pass of pages that never load
// this module (the home page, /blog, /templates, /docs/*) the Lucide icons
// while their client bundle still had the built-in defaults, and hydration
// failed with React #418 on those routes.

export function ComponentPreviewTheme({children}: {children: ReactNode}) {
  const {density} = useMinimDensity();
  const theme = density === 'compact' ? minimCompactTheme : minimTheme;

  return (
    <Theme theme={theme} mode="light">
      {children}
    </Theme>
  );
}
