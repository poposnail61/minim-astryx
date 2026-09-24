# Figma Property Naming

The React source in `packages/core/src` is the API authority. Figma names are
kebab-case representations, not a reason to rename the public React API.

## Rules

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
