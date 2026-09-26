// Copyright (c) Meta Platforms, Inc. and affiliates.

'use client';

import {useState} from 'react';
import {Stack} from '@astryxdesign/core/Stack';
import {Heading} from '@astryxdesign/core/Heading';
import {Button} from '@astryxdesign/core/Button';
import {ButtonGroup} from '@astryxdesign/core/ButtonGroup';
import {Icon} from '@astryxdesign/core/Icon';
import {ToggleButton} from '@astryxdesign/core/ToggleButton';
import {TextInput} from '@astryxdesign/core/TextInput';
import {NumberInput} from '@astryxdesign/core/NumberInput';
import {FileInput} from '@astryxdesign/core/FileInput';
import {Selector} from '@astryxdesign/core/Selector';
import {MultiSelector} from '@astryxdesign/core/MultiSelector';
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
import {List, ListItem} from '@astryxdesign/core/List';
import {
  SegmentedControl,
  SegmentedControlItem,
} from '@astryxdesign/core/SegmentedControl';
import {useMinimDensity} from '../../providers';

export default function SizeExamples() {
  const {density, setDensity} = useMinimDensity();
  const [switches, setSwitches] = useState<Record<string, boolean>>({});
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
      <Stack as="section" gap={3} data-testid="file-input-sizes">
        <Heading level={2}>File input</Heading>
        {(['input', 'dropzone'] as const).map(mode => (
          <Stack key={mode} gap={3}>
            <FileInput
              label={`${mode} default`}
              mode={mode}
              value={null}
              onChange={() => {}}
              data-testid={`file-${mode}-default`}
            />
            <FileInput
              label={`${mode} warning`}
              mode={mode}
              value={null}
              onChange={() => {}}
              status={{type: 'warning', message: 'Check the file format.'}}
              data-testid={`file-${mode}-warning`}
            />
            <FileInput
              label={`${mode} loading`}
              mode={mode}
              value={null}
              onChange={() => {}}
              isLoading
              data-testid={`file-${mode}-loading`}
            />
            <FileInput
              label={`${mode} success`}
              mode={mode}
              value={null}
              onChange={() => {}}
              status={{type: 'success', message: 'File checked.'}}
              data-testid={`file-${mode}-success`}
            />
            <FileInput
              label={`${mode} disabled`}
              mode={mode}
              value={null}
              onChange={() => {}}
              isDisabled
              data-testid={`file-${mode}-disabled`}
            />
          </Stack>
        ))}
      </Stack>
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
          <List size={size}>
            <ListItem
              label="List item"
              startContent={<Icon icon="search" size={size} />}
            />
            <ListItem label="List item" description="Description" />
          </List>
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
          <Stack gap={2} data-testid="disabled-checkboxes">
            <CheckboxInput
              label="Disabled checked"
              value={true}
              isDisabled
              size={size}
            />
            <CheckboxInput
              label="Disabled mixed"
              value="indeterminate"
              isDisabled
              size={size}
            />
            <CheckboxInput
              label="Disabled unchecked"
              value={false}
              isDisabled
              size={size}
            />
            <CheckboxList
              label="Disabled list"
              value={['selected']}
              onChange={() => {}}
              size={size}>
              <CheckboxListItem
                label="Disabled selection"
                value="selected"
                isDisabled
              />
            </CheckboxList>
          </Stack>
          <MultiSelector
            label="Nested badges"
            options={['Seoul', 'Busan']}
            value={['Seoul', 'Busan']}
            onChange={() => {}}
            triggerDisplay="badges"
            size={size}
          />
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
            value={switches[size ?? 'default'] ?? true}
            onChange={value =>
              setSwitches(previous => ({
                ...previous,
                [size ?? 'default']: value,
              }))
            }
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
