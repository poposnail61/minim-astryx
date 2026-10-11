// Copyright (c) Meta Platforms, Inc. and affiliates.

'use client';

import {
  Component as ReactComponent,
  lazy,
  Suspense,
  useState,
  type ComponentType,
  type ReactNode,
} from 'react';
import {Center} from '@astryxdesign/core/Center';
import {Text} from '@astryxdesign/core/Text';
import {Spinner} from '@astryxdesign/core/Spinner';
import {Button} from '@astryxdesign/core/Button';
import {useMediaQuery} from '@astryxdesign/core/hooks';
import {showcaseRegistry} from '../../generated/showcaseRegistry';
import {preventPreviewNavigation} from './previewNavigation';

interface ShowcasePreviewProps {
  name: string;
}

const showcaseCache = new Map<string, ComponentType>();
const fluidShowcases = new Set([
  'TextArea',
  'Toolbar',
  'ChatComposerInput',
  'Collapsible',
  'OverflowList',
]);

function getShowcase(name: string) {
  const cached = showcaseCache.get(name);
  if (cached) {return cached;}
  const loader: (() => Promise<{default: ComponentType}>) | undefined =
    name === 'Token'
      ? () => import('./MinimTokenShowcase')
      : showcaseRegistry[name];
  if (!loader) {return null;}
  // Stable lazy identities cache imports and cannot apply a stale request to a new name.
  const component = lazy(loader);
  showcaseCache.set(name, component);
  return component;
}

class ShowcaseBoundary extends ReactComponent<
  {children: ReactNode; fallback: ReactNode},
  {failed: boolean}
> {
  state = {failed: false};
  static getDerivedStateFromError() {
    return {failed: true};
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export function ShowcasePreview({name}: ShowcasePreviewProps) {
  const [attempt, setAttempt] = useState(0);
  const Component = getShowcase(name);
  const isSmall = useMediaQuery('(max-width: 768px)');

  const previewNavigationProps =
    name === 'SideNav' ? {onClickCapture: preventPreviewNavigation} : {};

  const placeholderStyle = isSmall
    ? {minHeight: 160, width: '100%'}
    : {aspectRatio: '16 / 9', width: '100%'};

  const unavailable = (
    <Center style={placeholderStyle}>
      <Text type="supporting" color="secondary">
        Preview not available
      </Text>
    </Center>
  );

  if (!Component) {
    return unavailable;
  }

  const preview = (
    <ShowcaseBoundary
      key={`${name}/${attempt}`}
      fallback={
        <Center style={placeholderStyle}>
          <Button
            label="Retry preview"
            variant="ghost"
            onClick={() => {
              showcaseCache.delete(name);
              setAttempt(value => value + 1);
            }}
          />
        </Center>
      }>
      <Suspense
        fallback={
          <Center style={placeholderStyle}>
            <Spinner size="md" />
          </Center>
        }>
        <Component />
      </Suspense>
    </ShowcaseBoundary>
  );

  if (isSmall) {
    return (
      <div
        data-testid="showcase-viewport"
        style={{
          width: '100%',
          overflow: 'auto',
          minHeight: 160,
          display: 'flex',
          alignItems: 'center',
          // `safe center` centers the preview when it fits but falls back to
          // start alignment when it overflows the frame, so a showcase wider
          // than the viewport isn't pushed into the unscrollable negative
          // gutter and clipped at its leading edge.
          justifyContent: 'safe center',
        }}
        {...previewNavigationProps}>
        <div
          style={
            fluidShowcases.has(name)
              ? {width: '100%', minWidth: 0}
              : {minWidth: 'fit-content'}
          }>
          {preview}
        </div>
      </div>
    );
  }

  return (
    <div
      data-testid="showcase-viewport"
      style={{
        width: '100%',
        aspectRatio: '16 / 9',
        overflow: 'auto',
        display: 'flex',
        alignItems: 'center',
        // See the small-viewport branch above: `safe center` keeps the leading
        // edge reachable when a preview overflows instead of clipping it.
        justifyContent: 'safe center',
      }}
      {...previewNavigationProps}>
      {preview}
    </div>
  );
}
