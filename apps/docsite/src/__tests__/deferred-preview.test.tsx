// Copyright (c) Meta Platforms, Inc. and affiliates.
// @vitest-environment jsdom

import {act, cleanup, render, screen} from '@testing-library/react';
import {afterEach, expect, it, vi} from 'vitest';
import {DeferredPreview} from '../components/component-detail/DeferredPreview';

vi.mock('@astryxdesign/core/Skeleton', () => ({
  Skeleton: () => <span>Pending</span>,
}));
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

it('mounts an example only near the viewport and preserves it afterwards', () => {
  let notify!: IntersectionObserverCallback;
  const disconnect = vi.fn();
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(callback: IntersectionObserverCallback) {
        notify = callback;
      }
      observe = vi.fn();
      disconnect = disconnect;
    },
  );
  const loaded = vi.fn();
  function Preview() {
    loaded();
    return <button>Example</button>;
  }
  const {rerender} = render(
    <DeferredPreview>
      <Preview />
    </DeferredPreview>,
  );
  expect(loaded).not.toHaveBeenCalled();
  act(() =>
    notify(
      [{isIntersecting: true} as IntersectionObserverEntry],
      {} as IntersectionObserver,
    ),
  );
  expect(screen.getByRole('button', {name: 'Example'})).toBeTruthy();
  expect(disconnect).toHaveBeenCalled();
  rerender(
    <DeferredPreview>
      <Preview />
    </DeferredPreview>,
  );
  expect(screen.queryByText('Pending')).toBeNull();
});

it('still renders where IntersectionObserver is unavailable', async () => {
  vi.stubGlobal('IntersectionObserver', undefined);
  render(
    <DeferredPreview>
      <button>Example</button>
    </DeferredPreview>,
  );
  expect(await screen.findByRole('button', {name: 'Example'})).toBeTruthy();
});
