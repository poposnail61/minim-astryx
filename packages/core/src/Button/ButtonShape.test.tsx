// Copyright (c) Meta Platforms, Inc. and affiliates.

import {describe, expect, it, vi} from 'vitest';
import {fireEvent, render, screen} from '@testing-library/react';
import {Button} from './Button';
import {ButtonGroup} from '../ButtonGroup';
import {ToggleButton} from '../ToggleButton';
import {DropdownMenu} from '../DropdownMenu';
import {MoreMenu} from '../MoreMenu';
import {SegmentedControl, SegmentedControlItem} from '../SegmentedControl';

describe('button family shape', () => {
  it('keeps existing buttons default and exposes the pill shape', () => {
    render(
      <>
        <Button label="Default" />
        <Button label="Pill" shape="pill" />
      </>,
    );
    expect(screen.getByRole('button', {name: 'Default'})).toHaveAttribute(
      'data-shape',
      'default',
    );
    expect(screen.getByRole('button', {name: 'Pill'})).toHaveAttribute(
      'data-shape',
      'pill',
    );
  });

  it('preserves joined button geometry', () => {
    render(
      <ButtonGroup>
        <Button label="Joined" shape="pill" />
      </ButtonGroup>,
    );
    expect(screen.getByRole('button', {name: 'Joined'})).toHaveAttribute(
      'data-shape',
      'default',
    );
  });

  it('preserves toggle behavior with pill shape', () => {
    const onChange = vi.fn();
    render(
      <ToggleButton
        label="Filter"
        shape="pill"
        isPressed={false}
        onPressedChange={onChange}
      />,
    );
    const toggle = screen.getByRole('button', {name: 'Filter'});
    expect(toggle).toHaveAttribute('data-shape', 'pill');
    fireEvent.click(toggle);
    expect(onChange).toHaveBeenCalledWith(true, expect.anything());
  });

  it('forwards shape only to menu triggers', () => {
    const items = [{label: 'Edit', onClick: () => {}}];
    render(
      <>
        <DropdownMenu
          button={{label: 'Actions', shape: 'pill'}}
          items={items}
        />
        <MoreMenu label="More" shape="pill" items={items} />
      </>,
    );
    expect(screen.getByRole('button', {name: 'Actions'})).toHaveAttribute(
      'data-shape',
      'pill',
    );
    expect(screen.getByRole('button', {name: 'More'})).toHaveAttribute(
      'data-shape',
      'pill',
    );
  });

  it('shares shape with every segment without changing selection', () => {
    const onChange = vi.fn();
    render(
      <SegmentedControl
        label="View"
        value="list"
        onChange={onChange}
        shape="pill">
        <SegmentedControlItem label="List" value="list" />
        <SegmentedControlItem label="Grid" value="grid" />
      </SegmentedControl>,
    );
    expect(screen.getByRole('radiogroup')).toHaveAttribute(
      'data-shape',
      'pill',
    );
    for (const radio of screen.getAllByRole('radio')) {
      expect(radio).toHaveAttribute('data-shape', 'pill');
    }
    expect(screen.getByRole('radio', {name: 'List'})).toHaveAttribute(
      'aria-checked',
      'true',
    );
    fireEvent.click(screen.getByRole('radio', {name: 'Grid'}));
    expect(onChange).toHaveBeenCalledWith('grid');
  });
});
