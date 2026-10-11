// Copyright (c) Meta Platforms, Inc. and affiliates.
// @vitest-environment jsdom

import {act, cleanup, fireEvent, render, screen} from '@testing-library/react';
import {afterEach, expect, it, vi} from 'vitest';
import type {ButtonHTMLAttributes, ReactNode} from 'react';
type ExampleStub = {name: string};
const loaders = vi.hoisted(() => ({Alpha: vi.fn(), Beta: vi.fn()}));
vi.mock('../generated/componentExampleLoaders', () => ({
  componentExampleLoaders: loaders,
}));
vi.mock('@astryxdesign/core/Layout', () => ({
  VStack: ({children}: {children?: ReactNode}) => <div>{children}</div>,
}));
vi.mock('@astryxdesign/core/Skeleton', () => ({
  Skeleton: () => <div>Loading</div>,
}));
vi.mock('@astryxdesign/core/Button', () => ({
  Button: ({
    label,
    onClick,
  }: {
    label: string;
    onClick?: ButtonHTMLAttributes<HTMLButtonElement>['onClick'];
  }) => <button onClick={onClick}>{label}</button>,
}));
vi.mock('../components/component-detail/ExampleBlock', () => ({
  ExampleBlock: ({entry}: {entry: ExampleStub}) => <div>{entry.name}</div>,
}));
import {ComponentExamples} from '../components/component-detail/ComponentExamples';

afterEach(() => {
  cleanup();
  vi.resetAllMocks();
});

it('loads only the requested component examples', async () => {
  loaders.Alpha.mockResolvedValue({default: [{name: 'Alpha example'}]});
  render(<ComponentExamples name="Alpha" />);
  expect(await screen.findByText('Alpha example')).toBeTruthy();
  expect(loaders.Beta).not.toHaveBeenCalled();
});

it('can retry a failed example import', async () => {
  loaders.Alpha.mockRejectedValueOnce(
    new Error('network'),
  ).mockResolvedValueOnce({default: [{name: 'Recovered'}]});
  render(<ComponentExamples name="Alpha" />);
  fireEvent.click(await screen.findByRole('button', {name: 'Retry examples'}));
  expect(await screen.findByText('Recovered')).toBeTruthy();
  expect(loaders.Alpha).toHaveBeenCalledTimes(2);
});

it('ignores a previous page load that resolves after navigation', async () => {
  let finish!: (value: {default: ExampleStub[]}) => void;
  loaders.Alpha.mockReturnValue(
    new Promise<{default: ExampleStub[]}>(resolve => {
      finish = resolve;
    }),
  );
  loaders.Beta.mockResolvedValue({default: [{name: 'Beta example'}]});
  const {rerender} = render(<ComponentExamples name="Alpha" />);
  rerender(<ComponentExamples name="Beta" />);
  await screen.findByText('Beta example');
  await act(async () => {
    finish({default: [{name: 'Stale example'}]});
  });
  expect(screen.queryByText('Stale example')).toBeNull();
  expect(screen.getByText('Beta example')).toBeTruthy();
});
