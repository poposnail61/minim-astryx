# Horizontal Spacing Audit

Date: 2026-09-20

## Correction Status

The findings below preserve the original audit snapshot. Corrections now applied:

- Removed nonzero label/icon slot overrides in the current 11 library pages.
  A second hidden-inclusive scan found 0 nonzero occurrences among 4,606 slots,
  down from 916. Direct edits plus inherited master changes produced this result.
- Code input, TextArea, segmented label, Badge, Token and Citation no longer add
  removed label inline insets. TextArea retains its outer field inset.
- Menu checkbox/radio, mega menu item, top navigation menu trigger and command
  palette item use spacing/300: Base12px, Compact10px. Shared table row tokens
  were not changed.
- XL Button now matches LG spacing/400: Base16px, Compact12px.
- Tab/segmented outer spacing and table/card/badge container spacing are retained.
  Vertical padding, typography and configured heights were not edited.
- These corrections do not change legacy component-v2 or icon glyph sources.

Validation after corrections: theme build and docsite typecheck passed;
83 theme unit tests passed; browser checks passed for 4 size cases,
48 menu cases and 40 mobile example cases. Browser coverage includes both
densities, desktop/narrow menus and 390px/320px mobile screens. Representative
Figma and browser screenshots were inspected; this is not a screenshot review
of every individual variant.

## Scope

Initial read-only audit of the 11 current minim-astryx library pages, including component masters, nested instances, examples and invisible instance children. Legacy `component v2`, icon glyph sources and layout/sample pages are excluded from current-library totals. Corrections are recorded separately above; the inventory below is the pre-correction snapshot.

127 component sets; 1,553 component masters; 34,277 frame/component/instance nodes; 4,606 icon/label slot instances. 916 slot occurrences retain nonzero inline padding. Occurrences include propagated instances, not 916 independent root defects.

## Findings

1. Shared slots have zero inline padding, but instance overrides survive: Badge label 2px, Token label 2px, four old Button examples 4px, eight input-content occurrences 4px and four shared button-content occurrences 4px. Fix owners before propagated instances.
2. Code still adds label insets in input.ts:156/162 and TextArea sums at179/186; selection.ts:264/270; badge-token.ts:98/104/141/147; content.ts:78. Shared-master change is therefore not synchronized end to end.
3. MenuCheckboxItem and MenuRadioItem remain8px; TopNavMegaMenuItem remains8px; CommandPaletteItem remains8px; closed TopNavMenu wrapper10px. These need role-specific12px/10px mapping, not changing all row tokens (table cells share those tokens).
4. Button XL uses12px/10px while LG uses16px/12px. XL policy needs explicit resolution; do not silently shrink a larger tier or change vertical sizing.
5. SegmentedControlItem still has outer8/6px (Base) and gap0, and code label insets remain. Tabs use older control inline tokens. These are separate control roles, not automatically menus.
6. Icon-only Button/TopNav, collapsed SideNav, badges, table cells, cards, breadcrumbs, calendar, image slots and tree indentation require separate rules. They must not receive button16/menu12 mechanically.

## Token Values

| Token                                     | Base | Compact |
| ----------------------------------------- | ---: | ------: |
| spacing/200                               |    8 |       6 |
| spacing/300                               |   12 |      10 |
| spacing/400                               |   16 |      12 |
| content/large/text-inset-inline           |    5 |       4 |
| content/medium/text-inset-inline          |    4 |       3 |
| supporting large/medium text-inset-inline |    3 |       2 |
| row large/medium padding-inline           |    8 |       8 |
| row large/medium gap                      |    8 |       6 |

## Coverage

| Page                     | Sets | Masters | Nodes | Slots | Nonzero slot occurrences |
| ------------------------ | ---: | ------: | ----: | ----: | -----------------------: |
| Action                   |   14 |     389 |  4993 |  1381 |                      202 |
| Chat                     |   12 |      50 |   887 |   171 |                       31 |
| Container                |    4 |      65 |   500 |    28 |                        7 |
| Content                  |   14 |     191 |  2376 |   305 |                       87 |
| Data Input               |   28 |     466 | 10672 |  1113 |                       78 |
| Feedback & Status        |    6 |      67 |   890 |   124 |                       36 |
| Layout                   |    6 |      45 |  3646 |   507 |                      145 |
| Navigation               |   16 |     113 |  4517 |   528 |                      192 |
| Overlay                  |    4 |      22 |  1425 |   195 |                       45 |
| Table & List             |    9 |      63 |  4077 |   234 |                       89 |
| Shared / Slots & Helpers |   14 |      82 |   294 |    20 |                        4 |

## Component Inventory

### Action

- Toolbar (10790:29417): 12 variants; observed inline/gap tuples: unsized 0/0; gap 0.
- Action / ButtonGroup (8400:13980): 12 variants; observed inline/gap tuples: lg 0/0; gap 0 | md 0/0; gap 0.
- ContextMenu (8406:27972): 2 variants; observed inline/gap tuples: lg 8/8; gap 0 | md 8/8; gap 0.
- MenuItem (8406:27695): 8 variants; observed inline/gap tuples: lg 12/12; gap 8 | md 12/12; gap 8.
- MenuCheckboxItem (8464:29488): 2 variants; observed inline/gap tuples: unsized 8/8; gap 8.
- MenuRadioItem (8464:29496): 2 variants; observed inline/gap tuples: unsized 8/8; gap 8.
- menu-divider (10301:18822): 2 variants; observed inline/gap tuples: medium 8/8; gap 10 | large 8/8; gap 10.
- DropdownMenu (10794:30460): 12 variants; observed inline/gap tuples: lg 0/0; gap 4 | sm 0/0; gap 4 | md 0/0; gap 4.
- Button / ToggleButton (8406:23379): 8 variants; observed inline/gap tuples: lg 0/0; gap 0 | md 0/0; gap 0.
- SegmentedControl (8464:32640): 4 variants; observed inline/gap tuples: md 2/2; gap 2 | lg 2/2; gap 2.
- SegmentedControl / SegmentedControlItem (8464:32785): 12 variants; observed inline/gap tuples: lg 8/8; gap 0 | md 6/6; gap 0.
- Link (8406:24297): 36 variants; observed inline/gap tuples: unsized 0/0; gap 2.
- Button (8400:9742): 252 variants; observed inline/gap tuples: lg 16/16; gap 8 | md 12/12; gap 8 | md 8/8; gap 8 | lg 10/10; gap 8 | xl 12/12; gap 8 | xl 14/14; gap 8.
- MoreMenu (10737:38548): 24 variants; observed inline/gap tuples: lg 0/0; gap 4 | sm 0/0; gap 4 | md 0/0; gap 4.

### Chat

- Chat / ChatMessageBubble (10794:31473): 4 variants; observed inline/gap tuples: unsized 16/16; gap 0.
- Chat / ChatMessageMetadata (10794:31482): 6 variants; observed inline/gap tuples: unsized 0/0; gap 4.
- Chat / ChatComposer (10794:31510): 3 variants; observed inline/gap tuples: unsized 0/0; gap 0.
- Chat / ChatSystemMessage (10794:31635): 2 variants; observed inline/gap tuples: unsized 0/0; gap 6 | unsized 0/0; gap 8.
- Chat / ChatMessage (10794:31642): 2 variants; observed inline/gap tuples: unsized 0/0; gap 8.
- Chat / ChatSendButton (10794:31659): 6 variants; observed inline/gap tuples: lg 0/0; gap 0 | md 0/0; gap 0.
- Chat / ChatDictationButton (10794:31672): 4 variants; observed inline/gap tuples: lg 0/0; gap 0 | md 0/0; gap 0 | md 6/6; gap 0 | lg 8/8; gap 0.
- Chat / ChatToolCalls (10794:31702): 8 variants; observed inline/gap tuples: unsized 0/0; gap 2.
- Chat / ChatComposerTokenElement (10794:31883): 4 variants; observed inline/gap tuples: unsized 0/0; gap 0.
- Chat / ChatLayoutScrollButton (10794:31892): 2 variants; observed inline/gap tuples: unsized 0/0; gap 0.
- Chat / ChatComposerInput (10794:31897): 4 variants; observed inline/gap tuples: unsized 4/4; gap 0.
- Chat / ChatComposerDrawer (10794:31913): 2 variants; observed inline/gap tuples: unsized 16/16; gap 0.

### Container

- SelectableCard (10653:22349): 24 variants; observed inline/gap tuples: unsized 12/12; gap 0.
- ClickableCard (10653:22204): 20 variants; observed inline/gap tuples: unsized 16/16; gap 0.
- Collapsible (10653:22049): 4 variants; observed inline/gap tuples: unsized 0/0; gap 0.
- Card (10653:21889): 16 variants; observed inline/gap tuples: unsized 0/0; gap 0 | unsized 4/4; gap 0 | unsized 12/12; gap 0 | unsized 20/20; gap 0.

### Content

- Token (10481:30669): 48 variants; observed inline/gap tuples: lg 4/4; gap 0 | md 4/4; gap 0.
- Timestamp (10481:30498): 32 variants; observed inline/gap tuples: unsized 0/0; gap 0.
- Thumbnail (10481:30392): 4 variants; observed inline/gap tuples: unsized 0/0; gap 0.
- Text (10481:30317): 2 variants; observed inline/gap tuples: unsized 0/0; gap 0.
- Markdown (10481:30054): 2 variants; observed inline/gap tuples: unsized 0/0; gap 0.
- Kbd (8397:9731): 4 variants; observed inline/gap tuples: unsized 0/0; gap 2.
- Heading (10481:29875): 4 variants; observed inline/gap tuples: unsized 0/0; gap 0.
- EmptyState (10481:29816): 2 variants; observed inline/gap tuples: default 24/24; gap 16 | compact 16/16; gap 8.
- CodeBlock (10481:29684): 2 variants; observed inline/gap tuples: md 0/0; gap 0 | sm 0/0; gap 0.
- Code (10481:29620): 3 variants; observed inline/gap tuples: inherit 4/4; gap 0.
- Citation (10481:29534): 3 variants; observed inline/gap tuples: unsized 4/4; gap 0.
- Avatar (10481:29146): 60 variants; observed inline/gap tuples: large 0/0; gap 0 | tiny 0/0; gap 0 | xsmall 0/0; gap 0 | small 0/0; gap 0 | medium 0/0; gap 0.
- Avatar / AvatarStatusDot (10481:29422): 9 variants; observed inline/gap tuples: unsized 0/0; gap 0.
- Avatar (10481:29438): 15 variants; observed inline/gap tuples: lg 0/0; gap 0 | xsm 0/0; gap 0 | sm 0/0; gap 0 | md 0/0; gap 0 | xl 0/0; gap 0.

### Data Input

- switch (7959:15688): 4 variants; observed inline/gap tuples: large 2/2; gap 0 | medium 2/2; gap 0.
- InputGroup (10322:37482): 10 variants; observed inline/gap tuples: large 0/0; gap 4 | medium 0/0; gap 4.
- DateTimeInput (10322:37116): 16 variants; observed inline/gap tuples: large 0/0; gap 4 | medium 0/0; gap 4.
- DateRangeInput (10322:36857): 16 variants; observed inline/gap tuples: large 0/0; gap 4 | medium 0/0; gap 4.
- Slider (10542:38446): 14 variants; observed inline/gap tuples: unsized 0/0; gap 4.
- Checkbox / CheckboxList (10388:57120): 4 variants; observed inline/gap tuples: lg 0/0; gap 8 | md 0/0; gap 8.
- Checkbox / CheckboxListItem (10388:57149): 24 variants; observed inline/gap tuples: lg 0/0; gap 8 | md 0/0; gap 8.
- FileInput (10542:38235): 16 variants; observed inline/gap tuples: unsized 0/0; gap 4.
- Typeahead (10322:36567): 16 variants; observed inline/gap tuples: large 0/0; gap 4 | medium 0/0; gap 4.
- Tokenizer (10322:36219): 16 variants; observed inline/gap tuples: large 0/0; gap 4 | medium 0/0; gap 4.
- TimeInput (10322:35877): 16 variants; observed inline/gap tuples: large 0/0; gap 4 | medium 0/0; gap 4.
- TextInput (10322:35557): 16 variants; observed inline/gap tuples: large 0/0; gap 4 | medium 0/0; gap 4.
- TextArea (10322:35184): 16 variants; observed inline/gap tuples: large 0/0; gap 4 | medium 0/0; gap 4.
- Switch (10542:38124): 16 variants; observed inline/gap tuples: unsized 0/0; gap 8.
- _switch (10823:40057): 4 variants; observed inline/gap tuples: large 2/2; gap 0 | medium 2/2; gap 0.
- Selector (10322:34900): 16 variants; observed inline/gap tuples: large 0/0; gap 4 | medium 0/0; gap 4.
- Radio / RadioListItem (10388:56854): 24 variants; observed inline/gap tuples: lg 0/0; gap 8 | md 0/0; gap 8.
- Radio / RadioList (10388:57047): 4 variants; observed inline/gap tuples: lg 0/0; gap 8 | md 0/0; gap 8.
- PowerSearch / Trigger (10542:37993): 6 variants; observed inline/gap tuples: unsized 10/10; gap 4.
- PowerSearch / Popover (10542:38054): 4 variants; observed inline/gap tuples: unsized 4/4; gap 0 | unsized 12/12; gap 0 | unsized 8/8; gap 0.
- NumberInput (10322:34531): 16 variants; observed inline/gap tuples: large 0/0; gap 4 | medium 0/0; gap 4.
- Selector / MultiSelector (10322:32283): 128 variants; observed inline/gap tuples: large 0/0; gap 4 | medium 0/0; gap 4.
- DateInput (10322:31820): 16 variants; observed inline/gap tuples: large 0/0; gap 4 | medium 0/0; gap 4.
- Field (10322:32097): 8 variants; observed inline/gap tuples: large 0/0; gap 4 | medium 0/0; gap 4.
- Field / .FieldLabel (10322:32134): 3 variants; observed inline/gap tuples: unsized 0/0; gap 4.
- Calendar (10542:37522): 4 variants; observed inline/gap tuples: unsized 12/12; gap 8.
- Calendar / .CalendarDay (10542:37927): 8 variants; observed inline/gap tuples: unsized 2/2; gap 0.
- Checkbox / CheckboxInput (10737:37768): 24 variants; observed inline/gap tuples: lg 0/0; gap 8 | md 0/0; gap 8.

### Feedback & Status

- StatusDot (10653:17760): 8 variants; observed inline/gap tuples: unsized 0/0; gap 0.
- Spinner (8406:14972): 12 variants; observed inline/gap tuples: lg 1/1; gap 0 | xl 0/0; gap 8 | lg 0/0; gap 8 | md 0/0; gap 8 | md 0/0; gap 0 | xl 0/0; gap 0.
- Skeleton (10653:17592): 7 variants; observed inline/gap tuples: unsized 0/0; gap 0.
- ProgressBar (10653:17470): 8 variants; observed inline/gap tuples: unsized 0/0; gap 4.
- Banner (10653:17320): 8 variants; observed inline/gap tuples: unsized 0/0; gap 0.
- Badge (8406:25250): 24 variants; observed inline/gap tuples: md 4/4; gap 0 | lg 4/4; gap 0 | dot 0/0; gap 0.

### Layout

- ResizeHandle (10653:25347): 12 variants; observed inline/gap tuples: unsized 0/0; gap 0.
- Layout / Section (10653:25306): 3 variants; observed inline/gap tuples: unsized 12/12; gap 0.
- Layout / FormLayout (10653:25212): 3 variants; observed inline/gap tuples: unsized 0/0; gap 0.
- Divider (10653:25124): 8 variants; observed inline/gap tuples: unsized 0/0; gap 12.
- AspectRatio (10653:25044): 3 variants; observed inline/gap tuples: unsized 0/0; gap 0.
- AppShell (10653:24881): 16 variants; observed inline/gap tuples: unsized 0/0; gap 0.

### Navigation

- Navigation / .TopNavItem (10653:31905): 24 variants; observed inline/gap tuples: lg 12/12; gap 8 | md 12/12; gap 8 | md 8/8; gap 8 | sm 12/12; gap 8 | sm 8/8; gap 8 | lg 10/10; gap 8.
- Navigation / TopNavMegaMenu (10653:32002): 2 variants; observed inline/gap tuples: unsized 0/0; gap 0 | unsized 0/0; gap 8.
- Navigation / TopNavMenu (10653:32027): 2 variants; observed inline/gap tuples: unsized 10/10; gap 8 | unsized 0/0; gap 8.
- Navigation / .TopNavMegaMenuItem (10653:32061): 2 variants; observed inline/gap tuples: unsized 8/8; gap 8.
- Tabs / TabList (10653:31706): 6 variants; observed inline/gap tuples: lg 0/0; gap 0 | md 0/0; gap 0 | sm 0/0; gap 0.
- Tabs / .Tab (10653:31737): 6 variants; observed inline/gap tuples: lg 0/0; gap 0 | md 0/0; gap 0 | sm 0/0; gap 0.
- Navigation / SideNav (10653:31427): 2 variants; observed inline/gap tuples: unsized 0/0; gap 0.
- Navigation / .SideNavItem (10653:31463): 12 variants; observed inline/gap tuples: lg 12/12; gap 8 | md 12/12; gap 8 | sm 12/12; gap 8.
- Navigation / .SideNavHeading (10653:31595): 2 variants; observed inline/gap tuples: unsized 12/12; gap 8.
- Navigation / .SideNavCollapseButton (10653:31620): 2 variants; observed inline/gap tuples: unsized 0/0; gap 0.
- Pagination (10653:31278): 10 variants; observed inline/gap tuples: lg 0/0; gap 16 | md 0/0; gap 16.
- .OutlineItem (10653:31120): 16 variants; observed inline/gap tuples: unsized 0/0; gap 2.
- Navigation / MobileNav (10653:30913): 4 variants; observed inline/gap tuples: unsized 0/0; gap 0.
- Navigation / .MobileNavToggle (10653:30964): 2 variants; observed inline/gap tuples: unsized 0/0; gap 0.
- Breadcrumbs / BreadcrumbItem (10653:30746): 12 variants; observed inline/gap tuples: unsized 0/0; gap 4.
- Breadcrumbs (10653:30813): 4 variants; observed inline/gap tuples: unsized 0/0; gap 8.

### Overlay

- Overlay (10653:38121): 9 variants; observed inline/gap tuples: unsized 0/0; gap 0.
- .CommandPaletteItem (10653:38009): 3 variants; observed inline/gap tuples: unsized 8/8; gap 8.
- Toast (10653:37821): 2 variants; observed inline/gap tuples: unsized 12/12; gap 12.
- Dialog (10653:37570): 2 variants; observed inline/gap tuples: unsized 0/0; gap 0.

### Table & List

- Item (10653:43381): 6 variants; observed inline/gap tuples: unsized 8/8; gap 8 | unsized 12/12; gap 8.
- TreeList / .TreeListItem (10653:43126): 9 variants; observed inline/gap tuples: unsized 0/8; gap 8.
- TreeList (10653:43219): 2 variants; observed inline/gap tuples: unsized 8/8; gap 8.
- TableHeaderCell (10653:42874): 9 variants; observed inline/gap tuples: unsized 8/8; gap 8 | unsized 12/12; gap 8 | unsized 16/16; gap 8.
- TableCell (10653:42947): 9 variants; observed inline/gap tuples: unsized 8/8; gap 8 | unsized 12/12; gap 8 | unsized 16/16; gap 8.
- OverflowList (10653:41599): 4 variants; observed inline/gap tuples: unsized 0/0; gap 8.
- MetadataList (10653:41481): 8 variants; observed inline/gap tuples: unsized 0/0; gap 12.
- MetadataList / MetadataListItem (10653:41542): 2 variants; observed inline/gap tuples: unsized 0/0; gap 16 | unsized 0/0; gap 2.
- List / .ListItem (10653:41266): 12 variants; observed inline/gap tuples: unsized 0/0; gap 0.

### Shared / Slots & Helpers

- image-content (7959:17331): 6 variants; observed inline/gap tuples: large 0/0; gap 0 | small 0/0; gap 0 | xsmall 0/0; gap 0 | medium 0/0; gap 0 | xlarge 0/0; gap 0 | xxlarge 0/0; gap 0.
- person-content (7959:17383): 6 variants; observed inline/gap tuples: large 0/0; gap 0 | small 0/0; gap 0 | xsmall 0/0; gap 0 | medium 0/0; gap 0 | xlarge 0/0; gap 0 | xxlarge 0/0; gap 0.
- multi-person-content (7959:17408): 1 variants; observed inline/gap tuples: h32 0/0; gap 0.
- slot-label-content (7959:17426): 12 variants; observed inline/gap tuples: large 0/0; gap 4 | large 0/0; gap 2 | medium 0/0; gap 4 | medium 0/0; gap 2.
- slot-icon-content (7962:28640): 4 variants; observed inline/gap tuples: large 0/0; gap 0 | medium 0/0; gap 0.
- slot-checkbox-content (7959:17464): 8 variants; observed inline/gap tuples: medium 0/0; gap 4 | large 0/0; gap 0 | large 1/1; gap 4.
- slot-radio-content (10318:15594): 8 variants; observed inline/gap tuples: medium 0/0; gap 4 | large 0/0; gap 0 | large 0/0; gap 4 | large 1/1; gap 4.
- icon-content (10388:60625): 4 variants; observed inline/gap tuples: large 0/0; gap 0 | medium 0/0; gap 0.
- slot-image-content (7959:17459): 2 variants; observed inline/gap tuples: large 0/2; gap 10 | medium 0/2; gap 10.
- slot-button-group (7959:17481): 2 variants; observed inline/gap tuples: unsized 0/0; gap 8.
- _description-content (7959:17492): 1 variants; observed inline/gap tuples: medium 0/0; gap 8.
- Navigation / TopNav — DEPRECATED (pre-slot) (10737:38177): 2 variants; observed inline/gap tuples: unsized 8/8; gap 16.
- Icon (10737:38806): 4 variants; observed inline/gap tuples: lg 0/0; gap 0 | sm 0/0; gap 0 | xsm 0/0; gap 0 | md 0/0; gap 0.
- XDSFieldLabel (10737:38829): 4 variants; observed inline/gap tuples: unsized 0/0; gap 4.

## Next Correction Order

1. Remove Badge/Token master-owned label overrides and remaining explicit shared-slot overrides, preserving vertical padding.
2. Synchronize corresponding code label insets without removing outer component padding.
3. Complete checkbox/radio/mega/command menu12px/10px mapping.
4. Agree XL/segmented/tab policy separately.
5. Repeat structural audit and test Base/Compact rendering, wrapping, icon-only sizing and interaction. Prior passing button tests do not certify these other components.
