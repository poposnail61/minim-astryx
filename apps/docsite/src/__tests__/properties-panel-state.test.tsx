// Copyright (c) Meta Platforms, Inc. and affiliates.
// @vitest-environment jsdom
import {cleanup, fireEvent, render, screen} from '@testing-library/react';
import {afterEach, expect, it, vi} from 'vitest';
import type {ReactNode} from 'react';
import type {ComponentEntry} from '../generated/componentRegistry';

vi.mock('@stylexjs/stylex', () => ({
  create: (v: unknown) => v,
  props: () => ({}),
}));
vi.mock('@astryxdesign/core/Layout', () => ({
  VStack: ({children}: {children: ReactNode}) => <div>{children}</div>,
}));
vi.mock('@astryxdesign/core/Text', () => ({
  Heading: ({children}: {children: ReactNode}) => <h3>{children}</h3>,
}));
vi.mock('@astryxdesign/core/Section', () => ({
  Section: ({children}: {children: ReactNode}) => <section>{children}</section>,
}));
vi.mock('../components/component-detail/interactiveState', () => ({
  pickPrimaryProps: () => [],
  buildInitialState: () => ({label: 'Initial'}),
  getMissingRequiredProps: () => [],
}));
vi.mock('../components/component-detail/InteractivePreview', () => ({
  InteractivePreviewStage: ({
    state,
    onPropChange,
  }: {
    state: {label: string};
    onPropChange: (name: string, value: string) => void;
  }) => (
    <input
      aria-label="Preview label"
      value={state.label}
      onChange={e => onPropChange('label', e.target.value)}
    />
  ),
}));
vi.mock('../components/component-detail/PlaygroundPropsTable', () => ({
  PlaygroundPropsTable: () => null,
}));
import PropertiesPanel from '../components/component-detail/PropertiesPanel';
afterEach(cleanup);

it('preserves edits across tab switches without retaining a hidden preview', () => {
  const comp = {name: 'Button', props: []} as unknown as ComponentEntry;
  const {rerender} = render(<PropertiesPanel comp={comp} active />);
  fireEvent.change(screen.getByRole('textbox'), {target: {value: 'Edited'}});
  rerender(<PropertiesPanel comp={comp} active={false} />);
  expect(screen.queryByRole('textbox')).toBeNull();
  rerender(<PropertiesPanel comp={comp} active />);
  expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe(
    'Edited',
  );
});
