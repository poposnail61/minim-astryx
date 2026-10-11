// Copyright (c) Meta Platforms, Inc. and affiliates.
// @vitest-environment jsdom

import {act, cleanup, render, screen} from '@testing-library/react';
import {afterEach, expect, it, vi} from 'vitest';
import type {ReactNode} from 'react';

const loaders = vi.hoisted(() => ({a: vi.fn(), b: vi.fn(), retry: vi.fn()}));
vi.mock('../generated/showcaseRegistry', () => ({
  showcaseRegistry: {
    AuditA: loaders.a,
    AuditB: loaders.b,
    Retry: loaders.retry,
  },
}));
vi.mock('@astryxdesign/core/hooks', () => ({useMediaQuery: () => false}));
vi.mock('@astryxdesign/core/Center', () => ({
  Center: ({children}: {children: ReactNode}) => <div>{children}</div>,
}));
vi.mock('@astryxdesign/core/Text', () => ({
  Text: ({children}: {children: ReactNode}) => <span>{children}</span>,
}));
vi.mock('@astryxdesign/core/Spinner', () => ({
  Spinner: () => <span role="status">Loading</span>,
}));
vi.mock('@astryxdesign/core/Button', () => ({
  Button: ({label, onClick}: {label: string; onClick: () => void}) => (
    <button onClick={onClick}>{label}</button>
  ),
}));
import {ShowcasePreview} from '../components/component-detail/ShowcasePreview';

afterEach(cleanup);

it('ignores an old import after navigation and caches the resolved showcase', async () => {
  let resolveA!: (module: {default: () => ReactNode}) => void;
  loaders.a.mockReturnValue(
    new Promise(resolve => {
      resolveA = resolve;
    }),
  );
  loaders.b.mockResolvedValue({
    default: () => <button>Current preview</button>,
  });
  const {rerender, unmount} = render(<ShowcasePreview name="AuditA" />);
  expect(screen.getByRole('status')).toBeTruthy();
  rerender(<ShowcasePreview name="AuditB" />);
  await screen.findByRole('button', {name: 'Current preview'});
  await act(async () => {
    resolveA({default: () => <button>Stale preview</button>});
  });
  expect(screen.queryByText('Stale preview')).toBeNull();
  unmount();
  render(<ShowcasePreview name="AuditB" />);
  expect(screen.getByRole('button', {name: 'Current preview'})).toBeTruthy();
  expect(screen.queryByRole('status')).toBeNull();
  expect(loaders.b).toHaveBeenCalledTimes(1);
});

it('shows an unavailable state instead of an endless loader for unknown names', () => {
  render(<ShowcasePreview name="MissingPreview" />);
  expect(screen.getByText('Preview not available')).toBeTruthy();
  expect(screen.queryByRole('status')).toBeNull();
});

it('retries a failed import instead of caching its rejection forever', async () => {
  const error = vi.spyOn(console, 'error').mockImplementation(() => {});
  try {
    loaders.retry
      .mockRejectedValueOnce(new Error('Chunk failed'))
      .mockResolvedValueOnce({default: () => <button>Recovered</button>});
    render(<ShowcasePreview name="Retry" />);
    const retry = await screen.findByRole('button', {name: 'Retry preview'});
    await act(async () => retry.click());
    expect(await screen.findByRole('button', {name: 'Recovered'})).toBeTruthy();
    expect(loaders.retry).toHaveBeenCalledTimes(2);
  } finally {
    error.mockRestore();
  }
});
