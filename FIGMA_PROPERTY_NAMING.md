# Figma Property Naming

The React source in `packages/core/src` is the API authority. Figma names are
kebab-case representations, not a reason to rename the public React API.

## Current Rules (2026-10-17)

- Use `state=normal/placeholder/hover/focused/readonly/disabled/error/warning/success/loading`
  only where supported. Preserve `pressed` and meaningful domain-specific states.
- Disabled/loading previews use `state`, not independent Figma variant axes.
  React keeps its existing `isDisabled`, `isLoading`, and `isReadOnly` API.
- Keep persistent selection, checkbox values, and toggle state independent.
- Use Boolean properties for simple visibility, and existing nested properties
  for label descriptions and breadcrumb icons. Do not add helper components.
- Keep Link underline, Tabs divider, Divider label, and slot padding variants:
  these change decoration or structure, not just visibility.
- Item keeps `density=compact/balanced/spacious`; size migration is deferred by
  the user. Other existing density, size-tier, and platform exceptions remain.
- Kebab-case naming and explicit code mappings below still apply. Dated sections
  and mappings that conflict with this section are historical, not current rules.

## Earlier Rules (Historical Where Conflicting)

- Component names and folders use kebab-case. Preserve `/` folder boundaries.
- Property names and enum values use kebab-case. Do not transform user-facing
  text, labels, entered values, icon names, or source data as enum values.
- Map enum spelling explicitly when writing React: `on-media` maps to
  `onMedia`, `line-guides` to `lineGuides`, and Timestamp `date-time` to
  `date_time`. Kebab-case is the Figma representation, not a new runtime value.
- Use `variant` for a combined semantic and visual treatment when that is the
  component's code contract, e.g. `neutral`, `neutral-subtle`, `critical-subtle`.
  Do not introduce a second appearance axis for these components.
- Preserve real component-specific API names. Token uses `color`; Timestamp
  uses `color`; validation uses `status`. These are not Button variants.
- Controls use code size values `lg` and `md`. Other supported sizes remain.
  Avatar sizes are mapped by the actual tier, not just the spelling of a label.
- Boolean values are `true` and `false`. CheckboxInput additionally supports
  `indeterminate`.
- Runtime flags use the actual code names, e.g. `is-disabled`, `is-loading`,
  `is-icon-only`, `is-pressed`, `is-open`, or `is-menu-open`.
- `state` is a Figma preview of interaction, such as `rest`, `hover`, `pressed`,
  or `focused`. Do not pass it as a React prop. Component-specific previews
  without a direct runtime prop are listed in the component description.
- `status=none` represents an omitted status; the remaining values map to
  `status.type`: `error`, `warning`, and `success`.
- Switch uses `value=true/false`. ToggleButton uses `is-pressed`.
  CheckboxListItem uses `is-checked`. Radio selection is derived from the
  parent's value; Figma `is-selected` is a preview helper, not a new React prop.
- Content properties use the actual slot/content name where one exists:
  `children`, `icon`, `start-icon`, `start-content`, `end-content`.
- Presence switches use `has-*`, e.g. `has-icon`, `has-description`,
  `has-end-content`. A presence switch does not become a React boolean prop
  unless the source explicitly declares it. Usually it means supply/omit that
  content. `has-label=false` maps to `isLabelHidden=true` where supported.
- Never rename a visibility toggle to a content prop just because their names
  look similar. Keep `has-description` separate from `description`.
- Preserve existing supported combinations. Do not manufacture a full Cartesian
  product of mutually incompatible visual states. Figma variant flags remain
  enum axes with `true`/`false` values, not layer visibility switches.

## Examples

| Figma                            | React                                 |
| -------------------------------- | ------------------------------------- |
| `size=lg`                        | `size="lg"`                           |
| `variant=neutral-subtle`         | `variant="neutral-subtle"`            |
| `is-disabled=true`               | `isDisabled={true}`                   |
| `is-loading=true`                | `isLoading={true}`                    |
| `is-icon-only=true`              | `isIconOnly={true}`                   |
| `has-underline=true`             | `hasUnderline={true}`                 |
| `is-external-link=true`          | `isExternalLink={true}`               |
| Switch `value=true`              | `value={true}`                        |
| DropdownMenu `is-menu-open=true` | `isMenuOpen={true}`                   |
| `status=warning`                 | `status={{type: 'warning'}}`          |
| `has-icon=true`                  | Supply the component's `icon` content |
| `state=hover`                    | Browser interaction, not a React prop |

## Verification Scope

The counts in this section describe the earlier naming migration, not the
current inventory. The 2026-10-14 property-level review is recorded below.

Applied to the current library's 11 categories: Action, Data Input, Content,
Chat, Container, Feedback & Status, Layout, Navigation, Overlay, Table & List,
and Shared / Slots & Helpers.

- 161 component-property owners and 1,475 existing variants checked.
- Final audit: no malformed property sets, duplicate variant combinations,
  or non-kebab-case component/property/enum names in these categories.
- Existing component IDs were retained; no variant or sample was deleted.
- Text content, text styles, visibility, and text dimensions were compared
  during the page migrations. Representative Button rendering was also checked.
- Legacy platform components and the icon library were not given invented
  React property contracts. This pass does not revalidate Compact dimensions.
- Current component descriptions reference the current source file or identify
  a Figma-only composition helper. Presence and interaction controls follow
  the helper rules above. The inventory is `figma-property-audit.json`.

## Code Sync Recheck

- Toolbar and Section use `muted`, not `wash`; Toast uses `info`, not `default`.
- Timestamp uses `accent`; AvatarStatusDot uses `success` and `error`.
- Card padding uses numeric spacing steps `0`, `1`, `3`, and `5`.
- Overlay's omitted scrim is `false`.
- MultiSelector `has-value=false` previews an empty value array. It does not
  introduce a runtime prop or a `triggerDisplay="placeholder"` value.
- Button's actual Figma default variant is neutral/lg, with a 44px height.
  The top-left variant placement was corrected, not only the child order.
- Stale package mapping blocks were removed. Card surface remains a Figma
  composition helper rather than claiming the public Card variant contract.

Run `node scripts/check-minim-figma-props.cjs figma-property-audit.json` from
the repository root. This checks mapped closed enum types against the current
TypeScript source, including the Minim Token color augmentation. Unknown
composition properties and open-ended content types are not validated by this
enum check. It does not test layout, token bindings, or browser behavior.

The current snapshot passes. A deliberately invalid Button variant was also
tested and correctly caused a nonzero exit with the invalid value reported.

## Property Levels (2026-10-14 Historical Snapshot)

This section records an earlier inventory and migration proposal. The current
rules above and MINIM_FIGMA_STATE_CONTRACT.md take precedence. Later input
composition changes removed temporary helper components and merged state axes;
do not recreate those helpers or independent state axes from this snapshot.

This authoring guidance extends the existing naming rules. It does not rename
React props or authorize destructive changes to existing Figma instances.
The current inventory covers 179 property owners in 11 component categories,
including shared helpers and the separate Data Input composition board.
See `figma-property-level-audit.json`. Legacy `component v2`, icon drawings and
layout experiments are outside this public-component property review.

Keep three editing levels; do not add another token or component hierarchy:

| Level     | What belongs here                                       | Examples                                            |
| --------- | ------------------------------------------------------- | --------------------------------------------------- |
| Component | Settings that change the complete component             | size, variant, shape, type, selection, mode         |
| Content   | Text, optional content and nested slots                 | label, description, value, has-icon, end-content    |
| Preview   | Runtime or interaction state used to show a design case | state, is-disabled, is-readonly, is-loading, status |

- Order the main decisions before content, then preview state. These are editing
  responsibilities, not prefixes to add to every property name.
- Expose a nested instance when its settings are useful; do not copy all of its
  properties onto the outer component. In inputs, edit label/description/indicator
  together in `field-label-description`. Do not expose internal surface padding,
  radius, text weight or duplicate child size controls.
- Every exposed setting must have a visible effect in its relevant variant.
  A slot's `has-*` flag controls presence; the slot controls content. Do not add
  a third mode that encodes the same presence again.
- `state` remains an interaction preview, not a catch-all for loading,
  validation, selection or entered data. Content-specific exceptions need an
  explicit mapping in the component description; do not rename them blindly.
- `is-*` means a runtime flag where one exists. `has-*` normally means supply
  or omit content. `value` can be text, number or checked state depending on the
  component; it must not be globally renamed to `is-selected`.
- Base/Compact is a variable mode, never another size value. Shared child size
  must follow the parent. Component-specific density APIs remain exceptions
  when the code explicitly defines them.
- A useful target is 3-6 main decisions before content/state controls. This is
  not a hard cap: do not remove required accessibility or editing features to
  reach a count. Evaluate settings per active variant, not only per set.
- Do not create every Cartesian state combination. Document authored previews
  and precedence. Disabled wins over read-only; read-only is not faded disabled.

### Family Mapping

| Family                        | Main decisions                                             | Content editing                                     | Preview                                              |
| ----------------------------- | ---------------------------------------------------------- | --------------------------------------------------- | ---------------------------------------------------- |
| Button / toggle / dropdown    | size, variant, shape                                       | label, icon, end-content in their owning child      | disabled, loading, pressed/open, interaction         |
| Inputs                        | size and input kind; selection or date mode where relevant | field-label-description, value, optional adornments | readonly, disabled, loading, validation, interaction |
| Tabs / segmented controls     | parent size and shape                                      | item labels/icons                                   | selected item, disabled, interaction                 |
| Menu / table / list           | parent size; row type only where necessary                 | shared slots and row content                        | selected/checked/current as defined by the code      |
| Badge / token                 | size and existing variant or color API                     | label, icon, removal affordance                     | disabled where supported                             |
| Dialog / overlay / navigation | layout, placement or supported variant                     | header/body/footer slots                            | open/collapsed and interaction                       |
| Chat / feedback               | existing domain status or mode                             | message/content/actions                             | domain state; do not equate it to selection          |
| Shared helpers                | only the primitive's own contract                          | slot contents                                       | derived from the owning public component             |

### Review Candidates (Not Bulk-Migrated)

| Component                       | Evidence                                                                   | Recommended next step                                                                   |
| ------------------------------- | -------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| InputGroup                      | 30 properties, including separate date/time end-content and addon controls | Edit each segment through an exposed nested instance; retain mode/size at the parent    |
| Selector                        | 20 properties after adding labels and readonly                             | Keep selection/display at parent; expose only content relevant to single/multiple       |
| Kbd                             | key-1-label, key-1-label2, key-1-label3 and related duplicates             | Nested key items with one label each; preserve existing text overrides before migration |
| OverflowList                    | item1-label through item5-label                                            | Repeated child content instead of a numbered top-level property for every item          |
| DropdownMenu / Button           | trigger=icon-only versus is-icon-only                                      | Keep the code mapping explicit; migrate only after checking nested trigger ownership    |
| Tabs / segmented items          | has-label versus is-label-hidden                                           | Define one visibility editing location; preserve code accessibility semantics           |
| Chat / Thumbnail / OverflowList | state includes content and runtime previews                                | Distinguish domain mode from interaction in a future compatible migration               |
| Data Input composition board    | Separate same-named sets outside the linked Data Input section             | Choose a single editable source before replacing copies; no deletion in this pass       |

## Consolidated Input Mapping (Historical Snapshot)

Figma-only composition does not require a combined React component:

| Figma                         | React                         | Important distinction                                                     |
| ----------------------------- | ----------------------------- | ------------------------------------------------------------------------- |
| field, type=text              | TextInput                     | React type=text/password/email remains a TextInput option                 |
| field, type=number            | NumberInput                   | Numeric parsing, stepping and value type remain separate                  |
| field, type=custom            | Field plus a supplied control | React Field owns label/description/status framing, not the input behavior |
| selector, selection=single    | Selector                      | Scalar selected value                                                     |
| selector, selection=multiple  | MultiSelector                 | Value array; triggerDisplay=count/labels/badges                           |
| date-input, mode=single/range | DateInput / DateRangeInput    | Different value shape and selection behavior                              |

`selected-labels` is the preview of MultiSelector's formatted selected labels,
not a new React prop. `has-value=false` previews an empty selection. Read-only
Field text/number uses bg/readonly and fg/readonly; read-only Selector keeps its
surface/value colors and hides its editing affordances, matching current code.
Only rest read-only previews were added for existing sizes and validation
states. Custom Field children keep their own read-only contract.

### Code Consolidation Assessment

Already shared: input theme styles, Field framing, input status rendering,
input-wrapper styles, and selector presentation/interaction infrastructure.
Possible next extraction: a private input-frame renderer with leading content,
control content and trailing status/actions, while retaining existing public
components, refs, native controls, keyboard behavior and event contracts.
Do not introduce a public catch-all Input with dozens of conditional props just
to mirror the Figma picker. Such an extraction needs focused accessibility and
interaction regression tests; it is not part of this visual/property update.

### Composition Board Contract (2026-10-15)

This applies to the experimental composition board (`11672:14333`), not the
canonical Data Input section. The earlier property inventory is a dated snapshot.

| Owner                                          | Properties / responsibility                                                                        |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| input (`11672:17551`)                          | `type`, `has-label`; `has-counter` and `counter-value` apply to textarea only                      |
| Nested field-label-description (`11675:31240`) | Label, description, optional/required indicator, heading icon and tooltip                          |
| Nested input-base (`11672:17639`)              | Size, interaction, disabled/loading, validation, status message, leading icon and trailing content |
| Default slot-label-content                     | Text and addon; size follows input-base                                                            |
| Custom content / end-content slots             | Consumer-owned composition, including matching size tokens                                         |

Each field preset directly contains the shared heading instance followed by the
shared input-base instance. It does not duplicate the input surface, padding,
icons or validation-message layers. The unified input set has 12 content presets
instead of multiplying content by input state. State and size are edited
on the exposed input-base instance, not copied onto the field parent.

`input-base.content-type=label` uses a normal nested content instance. Editing
its text must preserve automatic LG/MD resizing. `content-type=custom` exposes
the content slot instead. Figma slot edits snapshot their contents: custom slot
children do not automatically inherit a changed size, so callers must match
their content sizing explicitly. Do not use a custom slot merely to edit a
plain text value. No additional height or spacing tokens were introduced.

The unified `type` values are `text`, `number`, `date`, `date-range`, `time`,
`search`, `select`, `multi-select-empty`, `multi-select-count`,
`multi-select-badges`, `tokenizer`, and `textarea`. Original component IDs and
existing instance connections are retained. The unused outer `custom` preset
is removed; lower-level custom-body uses remain supported.
FileInput and InputGroup remain separate. Size, state, icons and validation
are edited on the exposed nested input-base, not duplicated on the parent.

TextArea uses `input-base.content-type=multiline`: the regular text content is
allowed to wrap, with an expanded minimum content area. It no longer uses a
separate custom text-area content component. Tokenizer and Selector use the
regular text content plus `start-content` for tokens or badges. Count and plain
selection labels use regular text. `has-text` allows a badges-only selection;
its leading slot fills remaining width to keep the arrow at the trailing edge.
FileInput remains a separate input/dropzone component.

Regular text and default leading badges/tokens follow input-base size.
`start-content` is an exposed nested `input-start-content` instance, not a native
editable SLOT whose content override would freeze its size. Each input master
supplies its matching LG/MD instance, hidden by default. Toggle
`has-start-content` to show it. Edit kind, item text, second-item visibility and
overflow on the nested instance; these values survive input size/state changes.
Group prefix/suffix slots and both date/time bodies remain consumer-owned.
Base/Compact density uses inherited variables.

Selector arrows use the exposed `end-icon` instance and `has-end-icon`, not
an edited native end-content slot. This keeps LG/MD arrow sizing automatic;
`end-content` remains available for genuinely custom trailing content.

Other surface-only input-base uses outside these migrated presets remain empty
custom-body instances so the composition migration does not add background text.
Public React APIs remain separate; these are Figma authoring properties.

`input-base.is-placeholder=true/false` is a Figma-only boolean-valued variant
axis, like `is-disabled`. The default is false. It changes the regular or
multiline label color to `fg/placeholder` without changing text, icons, opacity,
or geometry. Disabled inputs retain `fg/neutral` and the existing disabled
opacity. Custom-body content remains consumer-owned. React continues to use
native `placeholder` and `value`; it does not need an `isPlaceholder` prop.
