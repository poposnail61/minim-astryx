# Minim Figma State Contract

## Current Contract (2026-10-17)

Figma uses `state=normal/placeholder/hover/focused/readonly/disabled/error/warning/success/loading`
where supported. Preserve `pressed` and domain-specific states where meaningful;
do not add unsupported states simply to complete a matrix.

`state` is an authoring preview, not a React prop. React keeps `isDisabled`,
`isLoading`, `isReadOnly`, `status`, and native interaction behavior. Persistent
selection, checked/indeterminate values, and toggle state stay independent.

Existing disabled/loading axes were consolidated in place across Action, Chat,
Container, Content, Layout, Navigation, Table & List, and Shared components.
Disabled previews were added for SegmentedControlItem, ChatComposer, and Thumbnail
using their existing code treatments: disabled foreground, 0.6 opacity, and 0.5
opacity respectively.

Simple Citation icon, Spinner label, and MobileNav header visibility use Boolean
properties. Checkbox/Radio list descriptions and Breadcrumb icons use existing
nested properties, not additional helper components.

Keep Item's `compact/balanced/spacious` density unchanged until the user decides.
Keep decoration/structure variants (Link underline, Tabs divider, Divider label,
slot padding), existing size exceptions, and domain-specific behavior.

## Historical Contract (Superseded Where Conflicting)

User-approved mapping, 2026-09-26. This is a Figma authoring contract, not a React API migration.

| Figma property | Meaning                                              | Code correspondence                               |
| -------------- | ---------------------------------------------------- | ------------------------------------------------- |
| state          | Transient interaction: rest, hover, pressed, focused | CSS interaction or internal focus/highlight state |
| is-selected    | Persistent selection                                 | isSelected or parent value comparison             |
| is-disabled    | Unavailable interaction                              | isDisabled                                        |
| is-readonly    | Value is readable but cannot be edited               | isReadOnly where supported                        |
| is-loading     | Loading indicator                                    | isLoading                                         |
| status         | none, error, warning, success                        | status.type                                       |
| size           | Existing supported size                              | size                                              |
| variant        | Existing visual/semantic treatment                   | variant or component adapter                      |

Preserve distinct semantics: checkbox value can be false/true/indeterminate;
toggle-button is-pressed is persistent toggle state, not pointer-down;
is-current identifies the current navigation location. These are not renamed
to is-selected. Content/operation modes such as chat streaming are not selection.

## Applied Migration

Existing variant IDs, geometry and nested instances are retained.
Only existing visual combinations were migrated; independent property axes do
not imply that every possible combination has an authored variant.

- segmented-control-item, tab, table-cell: state=selected becomes state=rest with is-selected=true.
- outline-item: state=active becomes state=rest with is-current=true.
- typeahead, tokenizer: loading moves from state to is-loading.
- number-input: loading, disabled and validation move to is-loading, is-disabled and status.
- power-search/trigger: disabled moves to is-disabled.
- calendar-day: selection, disabled, today, outside and range position use separate axes.
- card-surface: hover/pressed move from variant to state; selected moves to is-selected.
- legacy xds-field-label: optional/required move to indicator; disabled to is-disabled.
- legacy replace-button, button-symbol and four chip sets: disabled moves to is-disabled; selected to is-selected where applicable.

17 existing sets (138 variants) migrated, plus menu-item updated separately.

## Shared Menu Row

Figma menu-item (8406:27695) now has is-selected. Existing 8 variants remain;
6 default-variant selections were added: lg/md x rest/hover/disabled-rest.
Selected rows use bg/neutral and preserve the configurable end-content slot.
No selected destructive action was added.

The shared Figma row is visual composition. React behavior remains separated:
DropdownMenuItem performs actions, Selector/SelectorOption manages listbox
selection, and DropdownMenuRadioItem/CheckboxItem manages checked menu state.
Do not add a selection API to plain action menu items solely to mirror Figma.

## Validation

- No duplicate variant names in modified sets.
- All 138 renamed variants retained their IDs and measured width/height.
- Menu row: 14 variants, selected background bound to bg/neutral.
- No runtime React API or behavior changed in this migration.

## Input Reconciliation (2026-10-14)

- Success input borders use stroke/neutral at rest/hover. Keyboard focus remains
  visible with stroke/neutral-strong. Success icon/message colors remain blue.
- The linked Data Input section's Field and Selector sets now provide independent
  is-readonly previews, rather than treating read-only as disabled.
- Selector adds trigger-display=labels alongside count and badges.
- Field text/number and Selector input wrappers use component height variables
  for their minimum height, replacing fixed 44/36px values. Base is LG 44 / MD
  36; Compact is LG 36 / MD 28. Text values fill the available inline space.
- Figma Field is a composition mapping to TextInput, NumberInput, or Field plus a
  custom child. It is not a replacement public React Field API.
- Property exposure levels and the current inventory are documented in
  FIGMA_PROPERTY_NAMING.md and figma-property-level-audit.json.
