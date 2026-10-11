// Copyright (c) Meta Platforms, Inc. and affiliates.

'use client';

import {useState} from 'react';
import {Button, type ButtonShape} from '@astryxdesign/core/Button';
import {ToggleButton} from '@astryxdesign/core/ToggleButton';
import {DropdownMenu} from '@astryxdesign/core/DropdownMenu';
import {MoreMenu} from '@astryxdesign/core/MoreMenu';
import {
  SegmentedControl,
  SegmentedControlItem,
} from '@astryxdesign/core/SegmentedControl';
import {Icon} from '@astryxdesign/core/Icon';
import {Stack} from '@astryxdesign/core/Stack';
import {Heading} from '@astryxdesign/core/Heading';
import {useMinimDensity} from '../../providers';

function ShapeSample({shape, size}: {shape: ButtonShape; size: 'md' | 'lg'}) {
  const [pressed, setPressed] = useState(false);
  const [view, setView] = useState('list');
  const [action, setAction] = useState('Actions');
  const items = [{label: 'Edit', onClick: () => setAction('Edited')}];
  return (
    <Stack gap={3} data-testid={`${size}-${shape}`}>
      <Heading level={2}>
        {size.toUpperCase()} / {shape}
      </Heading>
      <Stack direction="horizontal" gap={2} wrap="wrap">
        <Button label="Save" size={size} shape={shape} />
        <Button
          label="Add"
          icon={<Icon icon="minim:plus" />}
          isIconOnly
          size={size}
          shape={shape}
        />
        <ToggleButton
          label="Filter"
          size={size}
          shape={shape}
          isPressed={pressed}
          onPressedChange={setPressed}
        />
      </Stack>
      <Stack direction="horizontal" gap={2} wrap="wrap">
        <Button label="Disabled" size={size} shape={shape} isDisabled />
        <Button label="Loading" size={size} shape={shape} isLoading />
      </Stack>
      <Stack direction="horizontal" gap={2}>
        <DropdownMenu button={{label: action, shape, size}} items={items} />
        <MoreMenu label="More" size={size} shape={shape} items={items} />
      </Stack>
      <SegmentedControl
        label="View"
        size={size}
        shape={shape}
        value={view}
        onChange={setView}>
        <SegmentedControlItem label="List" value="list" />
        <SegmentedControlItem label="Grid" value="grid" />
        <SegmentedControlItem label="Board" value="board" />
      </SegmentedControl>
    </Stack>
  );
}

export default function ShapeExamples() {
  const {density, setDensity} = useMinimDensity();
  return (
    <Stack as="main" padding={4} gap={5} maxWidth={960}>
      <Heading level={1}>Button Shapes</Heading>
      <SegmentedControl
        label="Density"
        value={density}
        onChange={value => setDensity(value as 'base' | 'compact')}>
        <SegmentedControlItem label="Base" value="base" />
        <SegmentedControlItem label="Compact" value="compact" />
      </SegmentedControl>
      {(['lg', 'md'] as const).map(size => (
        <Stack key={size} direction="horizontal" gap={8} wrap="wrap">
          <ShapeSample size={size} shape="default" />
          <ShapeSample size={size} shape="pill" />
        </Stack>
      ))}
    </Stack>
  );
}
