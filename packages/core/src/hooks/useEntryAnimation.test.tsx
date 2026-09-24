// Copyright (c) Meta Platforms, Inc. and affiliates.

import React, {act} from 'react';
import {renderToString} from 'react-dom/server';
import {hydrateRoot} from 'react-dom/client';
import {render} from '@testing-library/react';
import {expect, it, vi} from 'vitest';
import {useEntryAnimation} from './useEntryAnimation';

function Probe() {
  return <span data-animate={useEntryAnimation() !== null}>Message</span>;
}

it('keeps server-rendered messages static during hydration after first paint', async () => {
  await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
  const host = document.createElement('div');
  host.innerHTML = renderToString(<Probe />);
  document.body.append(host);
  const errors = vi.spyOn(console, 'error').mockImplementation(() => {});
  let root: ReturnType<typeof hydrateRoot>;
  try {
    await act(async () => {
      root = hydrateRoot(host, <Probe />);
    });
    expect(host.firstElementChild).toHaveAttribute('data-animate', 'false');
    expect(errors).not.toHaveBeenCalled();
  } finally {
    await act(async () => root!.unmount());
    host.remove();
    errors.mockRestore();
  }
});

it('still animates newly inserted client messages after first paint', async () => {
  await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
  const {container} = render(<Probe />);
  expect(container.firstElementChild).toHaveAttribute('data-animate', 'true');
});
