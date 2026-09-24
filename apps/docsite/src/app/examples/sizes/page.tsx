// Copyright (c) Meta Platforms, Inc. and affiliates.

'use client';

import {Stack} from '@astryxdesign/core/Stack';
import {Heading} from '@astryxdesign/core/Heading';
import {Button} from '@astryxdesign/core/Button';
import {ButtonGroup} from '@astryxdesign/core/ButtonGroup';
import {Icon} from '@astryxdesign/core/Icon';
import {ToggleButton} from '@astryxdesign/core/ToggleButton';
import {TextInput} from '@astryxdesign/core/TextInput';
import {NumberInput} from '@astryxdesign/core/NumberInput';
import {Selector} from '@astryxdesign/core/Selector';
import {CheckboxInput} from '@astryxdesign/core/CheckboxInput';
import {RadioList, RadioListItem} from '@astryxdesign/core/RadioList';
import {CheckboxList, CheckboxListItem} from '@astryxdesign/core/CheckboxList';
import {TabList, Tab} from '@astryxdesign/core/TabList';
import {TopNavItem} from '@astryxdesign/core/TopNav';
import {Pagination} from '@astryxdesign/core/Pagination';
import {Badge} from '@astryxdesign/core/Badge';
import {Token} from '@astryxdesign/core/Token';
import {Switch} from '@astryxdesign/core/Switch';
import {ProgressBar} from '@astryxdesign/core/ProgressBar';
import {
  SegmentedControl,
  SegmentedControlItem,
} from '@astryxdesign/core/SegmentedControl';
import {useMinimDensity} from '../../providers';

export default function SizeExamples() {
  const {density, setDensity} = useMinimDensity();
  return (
    <Stack as="main" padding={4} gap={5} maxWidth={720} width="100%">
      <Heading level={1}>Component sizes</Heading>
      <SegmentedControl
        label="Density"
        value={density}
        onChange={value => setDensity(value as 'base' | 'compact')}>
        <SegmentedControlItem label="Base" value="base" />
        <SegmentedControlItem label="Compact" value="compact" />
      </SegmentedControl>
      {([undefined, 'md', 'lg'] as const).map(size => (
        <Stack
          as="section"
          gap={3}
          key={size ?? 'default'}
          data-testid={`size-${size ?? 'default'}`}>
          <Heading level={2}>{size ?? 'Default'}</Heading>
          <Button
            label="Button"
            size={size}
            icon={<Icon icon="search" size={size} />}
          />
          <ToggleButton label="Toggle" size={size} />
          <Button
            label="Continue"
            size={size}
            endContent={<Icon icon="chevronRight" size={size} />}
          />
          <Button label="Loading" size={size} isLoading />
          <ButtonGroup label="Grouped actions" size={size}>
            <Button label="First" />
            <Button label="Second" />
          </ButtonGroup>
          <Stack direction="horizontal" gap={2}>
            <Button
              label="Search"
              size={size}
              isIconOnly
              icon={<Icon icon="search" size={size} />}
            />
            <ToggleButton
              label="Toggle search"
              size={size}
              isIconOnly
              icon={<Icon icon="search" size={size} />}
            />
            <TopNavItem
              label="Search navigation"
              href="#"
              size={size}
              isIconOnly
              icon={<Icon icon="search" size={size} />}
            />
          </Stack>
          <TextInput label="Text" value="Reservation" size={size} />
          <NumberInput
            label="Number"
            value={2}
            onChange={() => {}}
            size={size}
          />
          <Selector
            label="Selector"
            value="Seoul"
            options={['Seoul', 'Busan']}
            onChange={() => {}}
            size={size}
          />
          <CheckboxInput label="Checkbox" value={true} size={size} />
          <CheckboxList
            label="Checkbox list"
            value={['a']}
            onChange={() => {}}
            size={size}>
            <CheckboxListItem label="Selection" value="a" />
          </CheckboxList>
          <RadioList
            label="Radio list"
            value="a"
            onChange={() => {}}
            size={size}>
            <RadioListItem label="Selection" value="a" />
          </RadioList>
          <TabList value="a" onChange={() => {}} size={size}>
            <Tab label="Overview" value="a" />
            <Tab label="Details" value="b" />
          </TabList>
          <Pagination
            page={1}
            totalItems={50}
            onChange={() => {}}
            size={size}
          />
          <Switch
            label="Notifications"
            value={true}
            onChange={() => {}}
            size={size}
          />
          <Stack direction="horizontal" gap={2}>
            <Badge label="Badge" size={size} />
            <Token label="Token" size={size} onRemove={() => {}} />
          </Stack>
        </Stack>
      ))}
      <ProgressBar label="Progress" value={50} />
    </Stack>
  );
}
