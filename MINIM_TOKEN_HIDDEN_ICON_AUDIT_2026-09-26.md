# Minim token, property and icon audit (2026-09-26)

## Remediation Follow-up

- Connected 16 TextInput and 10 InputGroup description texts to `description#23:172`; verified zero unbound descriptions in those masters.
- Connected ChatComposerInput empty/disabled placeholder text to `placeholder#2262:6`. Moved these texts out of the content slot because slot descendants cannot carry component property references; filled/focused content slots remain available.
- Removed unused Collapsible `children#10849:4`; retained the live `children#2287:0` slot.
- Replaced EmptyState action buttons and icons, PowerSearch selectors/buttons/empty state, and hidden external input icons. Re-scan of PowerSearch, Tokenizer, NumberInput and TextArea returned zero remote component instances.
- Replaced seven semantic code icon fallbacks with catalog-backed Minim glyphs. Kept `microphone` and `eyeSlash`: no sufficiently precise catalog equivalent for dictation/password visibility.
- Rebound legacy content/person tokens and the audited external typography, color, spacing, radius and border bindings. Eleven categorized pages including hidden descendants returned zero `content/*` or `component/content/person*` bindings.
- Preserved person helper geometry through four `component/person-*/height` tokens; exported the same variables to the code snapshot and generated theme.
- Re-applied CodeBlock syntax color ranges using the production TypeScript tokenizer and Minim semantic colors rather than flattening all syntax into a neutral color.
- Regenerated CLI theme templates, including the recent Switch and placeholder changes.
- Theme tests: 18 files, 96 passing tests. Browser size QA: 16 passing checks across Base/Compact and desktop/mobile. Production docsite build completed; existing optional Vega canvas dependency warning remains.
- Visually inspected Figma PowerSearch, EmptyState, ChatComposerInput and CodeBlock. This is not a pixel-by-pixel screenshot approval of every variant.

The findings below describe the original audit, not unresolved status. Selector search properties describe its open-menu behavior and are not rendered in the closed-trigger master; they were not deleted.

## Scope

- Read-only audit of 11 categorized Figma pages, 161 component sets/standalone components and 1,513 variants.
- Included invisible instance descendants. 5,183 nodes have their own visibility set false; inherited invisibility is additional.
- Excluded legacy component v2, icon catalog and layout reference pages. This is not a screenshot comparison of every variant.
- Theme unit tests: 18 files / 96 tests passed.
- Literal minim(...) references in component overrides resolve to the generated token definitions. Local Figma variable aliases checked: no unresolved alias target.
- No component code or Figma design edits during this audit.

## Confirmed Findings

### 1. Figma legacy token bindings remain

Local collection enumeration no longer lists some variables, but getVariableByIdAsync and node bindings still resolve them. Do not treat a clean collection listing as proof of completed migration.

- content/medium/icon-inset-inline
- content/large/icon-inset-inline
- content/large/icon-inset-block
- component/content/person/{small-size,xsmall-size,xlarge-size,xxlarge-size}
- component/content/person-radius-full

Examples:

- [Checkbox slot](https://www.figma.com/design/mHcauYaYWK3floQNsfolz6?node-id=7959-17475): LG horizontal padding 1, vertical padding 3 still linked to old content tokens.
- [Button loading spinner](https://www.figma.com/design/mHcauYaYWK3floQNsfolz6?node-id=8400-10289): same old LG inset bindings.
- [Image content](https://www.figma.com/design/mHcauYaYWK3floQNsfolz6?node-id=7959-17331) and [Person content](https://www.figma.com/design/mHcauYaYWK3floQNsfolz6?node-id=7959-17383): old person size/radius bindings.

Do not blindly zero all these insets: checkbox geometry must retain its approved design. Remap by role and check Base/Compact dimensions.

### 2. Figma public properties without consumers

- [TextInput](https://www.figma.com/design/mHcauYaYWK3floQNsfolz6?node-id=10322-35557): description#23:172 has no consumer. Actual description text 10322:35581 has empty componentPropertyReferences.
- [InputGroup](https://www.figma.com/design/mHcauYaYWK3floQNsfolz6?node-id=10322-37482): same description property issue, text 10322:37516.
- [ChatComposerInput](https://www.figma.com/design/mHcauYaYWK3floQNsfolz6?node-id=10794-31897): placeholder#2262:6 is unbound. Empty/disabled placeholder texts 10794:31900 and 10794:31912 have no characters reference.
- [Collapsible](https://www.figma.com/design/mHcauYaYWK3floQNsfolz6?node-id=10653-22049): duplicate children properties. children#2287:0 is used by both open variants; children#10849:4 has no consumer.
- [Selector](https://www.figma.com/design/mHcauYaYWK3floQNsfolz6?node-id=10322-34900): has-search and search-placeholder have no visual consumers in this closed-trigger set. Could be documentation-only properties; must explicitly document that or connect them to an open-menu composition.

Code does consume TextInput.description, ChatComposerInput.placeholder and Collapsible.children. These are Figma wiring discrepancies, not missing code APIs.

### 3. Hidden legacy instances

- [EmptyState](https://www.figma.com/design/mHcauYaYWK3floQNsfolz6?node-id=10481-29816): hidden Action buttons (10481:29824, 10481:29832) retain external Element/Medium 32px, external color/radius, Figtree and nested badges.
- [PowerSearch popover](https://www.figma.com/design/mHcauYaYWK3floQNsfolz6?node-id=10542-38054): hidden field labels/status text and nested buttons/badges retain external tokens and Figtree.
- [Tokenizer](https://www.figma.com/design/mHcauYaYWK3floQNsfolz6?node-id=10322-36219), [NumberInput](https://www.figma.com/design/mHcauYaYWK3floQNsfolz6?node-id=10322-34531), [TextArea](https://www.figma.com/design/mHcauYaYWK3floQNsfolz6?node-id=10322-35184): hidden circle-dashed remote icon instances remain.
- In Data Input, icon-name candidate scan found 57 remote Size=sm, 50 Size=xsm and 101 nested circle-dashed instance occurrences; all are effectively hidden. These counts include wrapper/nested occurrences, not unique glyphs.
- PowerSearch has one effectively visible external flag icon. It was an acknowledged prior exception; not an unapproved automatic replacement.

### 4. Visible external Figma tokens/fonts

- [Blockquote](https://www.figma.com/design/mHcauYaYWK3floQNsfolz6?node-id=10481-31028): Figtree and external Font Size/base, Font Size/sm, Line Height/Body, Line Height/Supporting.
- [Markdown](https://www.figma.com/design/mHcauYaYWK3floQNsfolz6?node-id=10481-30054): external Text/Primary, spacing and border bindings remain.
- [Thumbnail](https://www.figma.com/design/mHcauYaYWK3floQNsfolz6?node-id=10481-30392): external Border/Default, Core/Neutral and Core/Overlay.
- [ButtonGroup](https://www.figma.com/design/mHcauYaYWK3floQNsfolz6?node-id=8400-13980): 24 divider width bindings to external Border Width.
- [ContextMenu](https://www.figma.com/design/mHcauYaYWK3floQNsfolz6?node-id=8406-27972): 2 gap bindings to external Spacing/half (2px). Appearance currently matches but ownership is wrong.
- [InputGroupText](https://www.figma.com/design/mHcauYaYWK3floQNsfolz6?node-id=10322-24204): external Text/Secondary.

Syntax highlighting colors in CodeBlock require role-specific review; don't replace all with neutral.

### 5. Code icon fallback remains

packages/themes/minim/src/icons.tsx:100 deliberately leaves nine semantic icons to the default registry:
chevronsLeft, chevronsRight, arrowsUpDown, funnel, eyeSlash, viewColumns, checkDouble, wrench, microphone.

Concrete uses:

- Pagination.tsx:816,871 (first/last navigation)
- Table/plugins/sortable/useTableSortable.tsx:264 (unsorted)
- Table/plugins/filtering/useTableFiltering.tsx:1020 (filter)
- Chat/ChatToolCalls.tsx:616,650
- Chat/ChatDictationButton.tsx:182
- Chat/ChatMessageMetadata.tsx:40,41

Thus not every code icon is Minim. Confirm catalog equivalents; retain/document intentional missing-shape exceptions rather than inventing glyphs.

### 6. Shipping template lag

packages/cli/assets/templates/themes/minim/components/selection.ts still has the old switch height and lacks the new switch-label font override.
packages/cli/assets/templates/themes/minim/components/input.ts lacks fg/placeholder override.
The running theme source is updated; freshly generated template projects would receive stale styling.

## Normal / Not Automatically An Error

- Status-dependent hidden focus rings, status messages and loading layers need not each have a public visibility boolean.
- All hidden nodes lacking a visibility property are not defects.
- Figma component-set purple outlines are authoring chrome, not unbound product strokes.
- Unit tests passed but do not prove Figma public property consumers or all hidden icon branches are correct.
