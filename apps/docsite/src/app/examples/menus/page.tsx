// Copyright (c) Meta Platforms, Inc. and affiliates.

'use client';

import {useState, type ComponentProps} from 'react';
import {Stack} from '@astryxdesign/core/Stack';
import {Heading} from '@astryxdesign/core/Heading';
import {Button} from '@astryxdesign/core/Button';
import {SizeProvider} from '@astryxdesign/core/SizeContext';
import {Selector} from '@astryxdesign/core/Selector';
import {MultiSelector} from '@astryxdesign/core/MultiSelector';
import {
  Typeahead,
  type SearchableItem,
  type SearchSource,
} from '@astryxdesign/core/Typeahead';
import {Tokenizer} from '@astryxdesign/core/Tokenizer';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@astryxdesign/core/DropdownMenu';
import {Dialog, DialogHeader} from '@astryxdesign/core/Dialog';
import {Layout, LayoutContent, LayoutFooter} from '@astryxdesign/core/Layout';
import {Text} from '@astryxdesign/core/Text';
import {ContextMenu} from '@astryxdesign/core/ContextMenu';
import {
  SegmentedControl,
  SegmentedControlItem,
} from '@astryxdesign/core/SegmentedControl';
import {DateInput} from '@astryxdesign/core/DateInput';
import {DateRangeInput} from '@astryxdesign/core/DateRangeInput';
import {DateTimeInput} from '@astryxdesign/core/DateTimeInput';
import {TextInput} from '@astryxdesign/core/TextInput';
import {TextArea} from '@astryxdesign/core/TextArea';
import {NumberInput} from '@astryxdesign/core/NumberInput';
import {FileInput} from '@astryxdesign/core/FileInput';
import {InputGroup, InputGroupText} from '@astryxdesign/core/InputGroup';
import {ComplexSelector} from '@astryxdesign/core/ComplexSelector';
import {TimeInput} from '@astryxdesign/core/TimeInput';
import {useMinimDensity} from '../../providers';
import {EmptyState} from '@astryxdesign/core/EmptyState';
import {Icon} from '@astryxdesign/core/Icon';
import {
  PowerSearch,
  type PowerSearchConfig,
  type PowerSearchFilter,
} from '@astryxdesign/core/PowerSearch';

const filterConfig: PowerSearchConfig = {
  name: 'Menu review',
  fields: [
    {
      key: 'title',
      label: 'Title',
      defaultOperator: 'contains',
      operators: [
        {key: 'contains', label: 'contains', value: {type: 'string'}},
      ],
    },
  ],
};

const options = ['예약 목록', '예약 상세', '여행자 정보', '여행 일정'];
const entries = options.map((label, index) => ({id: String(index), label}));
const source: SearchSource = {
  search: query => entries.filter(item => item.label.includes(query)),
  bootstrap: () => entries,
};
const actions = options.map(label => ({label, onClick: () => {}}));

export default function MenuExamples() {
  const {density, setDensity} = useMinimDensity();
  const [checked, setChecked] = useState(true);
  const [radio, setRadio] = useState('one');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [single, setSingle] = useState(options[0]);
  const [filters, setFilters] = useState<ReadonlyArray<PowerSearchFilter>>([]);
  const [multiple, setMultiple] = useState<string[]>([options[0]]);
  const [person, setPerson] = useState<SearchableItem | null>(null);
  const [tokens, setTokens] = useState<SearchableItem[]>([]);
  const [range, setRange] =
    useState<ComponentProps<typeof DateRangeInput>['value']>(null);
  const [dateTime, setDateTime] =
    useState<ComponentProps<typeof DateTimeInput>['value']>();
  return (
    <SizeProvider value="lg">
      <Stack as="main" width="100%" maxWidth={480} padding={4} gap={5}>
        <Heading level={1}>Menus</Heading>
        <SegmentedControl
          label="Density"
          value={density}
          onChange={value => setDensity(value as 'base' | 'compact')}>
          <SegmentedControlItem label="Base" value="base" />
          <SegmentedControlItem label="Compact" value="compact" />
        </SegmentedControl>
        <Stack direction="horizontal" gap={2}>
          {(['md', 'lg'] as const).map(size => (
            <DropdownMenu
              key={size}
              button={{label: `Selection ${size}`, size}}>
              <DropdownMenuCheckboxItem
                label="Checkbox"
                value={checked}
                onChange={setChecked}
              />
              <DropdownMenuRadioGroup
                label="Selection options"
                value={radio}
                onChange={setRadio}
                hasCloseOnSelect={false}>
                <DropdownMenuRadioItem value="one" label="Radio one" />
                <DropdownMenuRadioItem value="two" label="Radio two" />
              </DropdownMenuRadioGroup>
            </DropdownMenu>
          ))}
          <Button label="Dialog review" onClick={() => setDialogOpen(true)} />
        </Stack>
        <Dialog isOpen={dialogOpen} onOpenChange={setDialogOpen}>
          <Layout
            header={
              <DialogHeader
                title="Dialog Title"
                hasDivider
                onOpenChange={setDialogOpen}
              />
            }
            content={
              <LayoutContent>
                <Text type="body">
                  Dialog content goes here. This area scrolls when content
                  exceeds the maximum height.
                </Text>
              </LayoutContent>
            }
            footer={
              <LayoutFooter hasDivider>
                <Stack direction="horizontal" gap={2} justify="end">
                  <Button
                    size="md"
                    variant="neutral-subtle"
                    label="Cancel"
                    onClick={() => setDialogOpen(false)}
                  />
                  <Button
                    size="md"
                    variant="primary"
                    label="Confirm"
                    onClick={() => setDialogOpen(false)}
                  />
                </Stack>
              </LayoutFooter>
            }
          />
        </Dialog>
        <div data-testid="empty-state-review">
          <EmptyState
            title="No results found"
            description="Try adjusting your search or filters."
            icon={<Icon icon="minim:mail" />}
          />
          <EmptyState
            isCompact
            title="No results found"
            description="Try adjusting your search or filters."
            icon={<Icon icon="minim:mail" />}
          />
        </div>
        <PowerSearch
          config={filterConfig}
          filters={filters}
          onChange={setFilters}
          label="PowerSearch review"
          placeholder="Add filter..."
        />
        <Selector
          label="Selector"
          options={options}
          value={single}
          onChange={setSingle}
        />
        <MultiSelector
          label="MultiSelector"
          options={options}
          value={multiple}
          onChange={setMultiple}
        />
        <Typeahead
          label="Typeahead"
          searchSource={source}
          value={person}
          onChange={setPerson}
          hasEntriesOnFocus
        />
        <Tokenizer
          label="Tokenizer"
          searchSource={source}
          value={tokens}
          onChange={setTokens}
          hasEntriesOnFocus
        />
        <DropdownMenu
          button={{label: 'DropdownMenu', size: 'lg'}}
          items={actions}
        />
        <Stack gap={3} data-testid="dropdown-variants">
          {(['neutral', 'outline', 'neutral-subtle'] as const).map(variant => (
            <Stack key={variant} gap={2}>
              <Heading level={2}>{variant}</Heading>
              {(['md', 'lg'] as const).map(size => (
                <Stack key={size} direction="horizontal" gap={2}>
                  <DropdownMenu
                    button={{label: `${variant} ${size}`, variant, size}}
                    items={actions}
                  />
                  <DropdownMenu
                    button={{
                      label: `${variant} ${size} actions`,
                      variant,
                      size,
                      isIconOnly: true,
                      icon: <Icon icon="moreHorizontal" />,
                    }}
                    items={actions}
                  />
                </Stack>
              ))}
            </Stack>
          ))}
        </Stack>
        <ContextMenu size="lg" items={actions}>
          <Button label="ContextMenu" />
        </ContextMenu>
        <DateInput label="DateInput" nativePicker="never" />
        <DateRangeInput
          label="DateRangeInput"
          value={range}
          onChange={setRange}
        />
        <DateTimeInput
          label="DateTimeInput"
          nativePicker="never"
          timeOptionInterval={30}
          value={dateTime}
          onChange={setDateTime}
        />
        <TextInput label="Readonly text" value="Reservation 1042" isReadOnly />
        <TextArea
          label="Readonly notes"
          value="Confirmed reservation"
          isReadOnly
        />
        <NumberInput
          label="Readonly number"
          value={2}
          onChange={() => {}}
          isReadOnly
        />
        <TextInput label="Loading text" value="" isLoading startIcon="search" />
        <div data-testid="disabled-input-icons">
          <TextInput
            label="Disabled search"
            value="Search"
            startIcon="search"
            isDisabled
          />
          <DateInput label="Disabled date" nativePicker="never" isDisabled />
          <TimeInput label="Disabled time" nativePicker="never" isDisabled />
          <DateTimeInput
            label="Disabled date time"
            onChange={() => {}}
            isDisabled
          />
          <Selector label="Disabled selector" options={options} isDisabled />
          <MultiSelector
            label="Disabled multi selector"
            options={options}
            value={[]}
            onChange={() => {}}
            isDisabled
          />
        </div>
        <Stack gap={4} data-testid="disabled-input-family">
          <TextInput
            label="Disabled placeholder"
            value=""
            placeholder="Placeholder text"
            description="Description text"
            isDisabled
          />
          <TextInput
            label="Disabled explanation"
            value=""
            placeholder="Placeholder text"
            isDisabled
            disabledMessage="Editing is unavailable"
          />
          <TextArea
            label="Disabled notes"
            value=""
            placeholder="Placeholder text"
            isDisabled
          />
          <NumberInput
            label="Disabled number"
            value={2}
            onChange={() => {}}
            isDisabled
          />
          <DateRangeInput
            label="Disabled range"
            value={null}
            onChange={() => {}}
            isDisabled
          />
          <Typeahead
            label="Disabled typeahead"
            searchSource={source}
            value={null}
            onChange={() => {}}
            isDisabled
          />
          <Tokenizer
            label="Disabled tokens"
            searchSource={source}
            value={[entries[0]]}
            onChange={() => {}}
            isDisabled
          />
          <InputGroup label="Disabled group" isDisabled>
            <InputGroupText>https://</InputGroupText>
            <TextInput
              label="Address"
              value=""
              placeholder="example.com"
              isDisabled
            />
            <InputGroupText>.com</InputGroupText>
          </InputGroup>
          <FileInput
            label="Disabled upload"
            value={[]}
            onChange={() => {}}
            isDisabled
          />
          <FileInput
            label="Disabled upload explanation"
            value={[]}
            onChange={() => {}}
            mode="dropzone"
            isDisabled
            disabledMessage="Uploads are unavailable"
          />
          <PowerSearch
            label="Disabled power search"
            config={filterConfig}
            filters={[]}
            onChange={() => {}}
            isDisabled
          />
          <ComplexSelector
            label="Disabled complex selector"
            value={null}
            triggerLabel="Select a value"
            isDisabled>
            {() => null}
          </ComplexSelector>
          <MultiSelector
            label="Disabled status"
            options={options}
            value={[]}
            onChange={() => {}}
            isDisabled
            status={{type: 'warning', message: 'Unavailable'}}
          />
        </Stack>
        <TextInput
          label="Clearable text"
          value={single}
          onChange={setSingle}
          hasClear
        />
        {(['error', 'warning', 'success'] as const).map(type => (
          <Stack key={type} gap={4}>
            <Selector
              label={`${type} selector`}
              options={options}
              status={{type, message: type}}
            />
            <MultiSelector
              label={`${type} multi selector`}
              options={options}
              value={[]}
              onChange={() => {}}
              status={{type, message: type}}
            />
            <TextArea
              label={`${type} notes`}
              value=""
              status={{type, message: type}}
            />
            <TimeInput
              label={`${type} time`}
              status={{type, message: type}}
              nativePicker="never"
            />
            <DateInput
              label={`${type} date`}
              status={{type, message: type}}
              nativePicker="never"
            />
            <DateRangeInput
              label={`${type} range`}
              value={range}
              onChange={setRange}
              status={{type, message: type}}
            />
            <TextInput
              label={`${type} tooltip`}
              value=""
              status={{type, message: type}}
              statusVariant="tooltip"
            />
          </Stack>
        ))}
      </Stack>
    </SizeProvider>
  );
}
