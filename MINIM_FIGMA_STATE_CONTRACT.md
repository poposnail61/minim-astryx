# Minim Figma State Contract

User-approved mapping, 2026-09-26. This is a Figma authoring contract, not a React API migration.

| Figma property | Meaning                                              | Code correspondence                               |
| -------------- | ---------------------------------------------------- | ------------------------------------------------- |
| state          | Transient interaction: rest, hover, pressed, focused | CSS interaction or internal focus/highlight state |
| is-selected    | Persistent selection                                 | isSelected or parent value comparison             |
| is-disabled    | Unavailable interaction                              | isDisabled                                        |
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
