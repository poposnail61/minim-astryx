# EmptyState and PowerSearch Figma Sync

Source nodes: `10481:29816`, `10542:38054`, `10542:37993` in Minim Design System.

## Applied

- EmptyState: spacing/300 gap, spacing/500 padding; compact variant spacing/200 gap and spacing/300 padding.
- EmptyState title: xl bold; compact variant md medium. Description uses neutral ink and md/xs typography respectively. Passed icons use xl line-height geometry and bold weight.
- PowerSearch trigger: neutral-strong focus border with no additional ring; muted search icon and placeholder, medium icon weight.
- PowerSearch popover: spacing/200 outer padding and spacing/300 editor padding; content-to-footer gap totals spacing/500 in Base.
- Editor field/operator/value areas share available width. Cancel uses large neutral-subtle; Apply uses large neutral. Search/filter behavior remains unchanged.
- Value editors inherit medium size, matching the adjacent field and operator selectors in both density modes.
- Regenerated shipped theme templates and rebuilt core and Minim theme artifacts.

## Intentional Differences

- Figma specimens' fixed 400/300/768 widths do not become fixed application widths.
- EmptyState icon and actions remain caller-provided slots, not hardcoded mail or action content.
- The hidden EmptyState action instance retains a 32px height override despite its LG content. Code retains the established LG button height instead of clipping it.
- Disabled PowerSearch's Figma token instances are MD while enabled instances are LG. Code retains matching large tokens across state changes.
- No Figma nodes were edited in this sync.

## Validation

- Related theme, PowerSearch and EmptyState unit tests: 335 passing.
- Added browser regression checks and screenshots for both density modes to the menu examples suite.
- Production build and type checking passed. Initial menu suite: 50 passing, 6 test-assertion failures (duplicate date examples and an incorrect Compact xl font expectation). Corrected these assertions; all 8 affected wide/narrow Base/Compact checks passed against the updated local app.
- Visually inspected Base and Compact EmptyState and PowerSearch screenshots. Editor controls now have matching heights, with large footer actions.
