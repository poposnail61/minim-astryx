# Minim Size and Default Review

## Contract

- Default size: `lg` / `large` when the component has a size axis.
- Default color: `neutral` when the component exposes that semantic variant.
- Base medium: 15px type, 20px line height, 36px control.
- Base large: 16.5px type, 22px line height, 44px control.
- Compact medium: 13.5px type, 18px line height, 28px control.
- Compact large: 15px type, 20px line height, 36px control.
- Badge, avatar, multiline content and status indicators retain their own
  sizing roles. They do not become 44px controls.
- Explicit consumer sizes and semantic status colors remain explicit.

## Work Plan

- [x] Compare component defaults and size mappings with Figma.
- [x] Correct navigation and toggle size-token mappings.
- [x] Add large selection-control and pagination API sizes.
- [x] Correct Figma selection rows and adaptive field wrapper heights.
- [x] Synchronize documentation and regression tests.
- [x] Build core/theme and run visual Base/Compact checks.
- [x] Audit remaining Figma defaults, nested content and exceptions.

## Verified Changes

- Omitted size props resolve to large in buttons, fields, selectors, menus,
  tabs, selection controls and pagination. Explicit medium is preserved.
- CheckboxList forwards size to each child. Radio indicator slots follow
  density tokens instead of retaining fixed pixel heights.
- Top navigation icon-only controls keep equal width and height.
- FileInput uses the large control geometry; PowerSearch uses the same
  default geometry while retaining its token/chip content roles.
- Figma Field, DateTimeInput, InputGroupText, FileInput, PowerSearch and
  top-navigation triggers now follow adaptive content/padding tokens.
- Figma CheckboxInput and ProgressBar default variants are large and neutral,
  respectively. Token uses medium/large names matching the code, with large
  as its default. Dictation loading/listening controls keep button geometry.
- Badge/Token heights remain caption-based. Avatar/media, code typography,
  calendar day grids, multiline fields and explicit table/list density are
  separate sizing roles, not 44px button equivalents.

## Verification

- Core and Minim automated tests: 343 files, 9,687 tests passed.
- Final Minim theme tests after icon-only width correction: 79 passed.
- Core/theme builds and docsite TypeScript check passed.
- `/examples/sizes`: default/medium/large, Base/Compact, desktop/mobile
  geometry, label font sizes, neutral button default and icon-only squares.
- Menu checks: 48 cases verified. Date-menu tests were narrowed to the primary
  example after status examples introduced multiple calendar buttons.
- Mobile examples: 10 screens x 2 densities x 2 widths (390px and 320px),
  all 40 cases passed. Browser project teardown stalled between widths;
  the remaining width was run separately and completed successfully.
- Figma instance measurements: large Base 44px / Compact 36px for
  CheckboxInput, InputGroupText, PowerSearch and FileInput control surfaces.
- No commit, push, package publication or deployment performed.

## Compatibility

Omitting a size now selects large. Existing explicit medium values stay medium;
Toggle and navigation medium now use the medium token tier rather than the
previous off-by-one mapping. Legacy small values remain accepted in code.

## Button Horizontal Spacing

Latest adjustment: large Button/ToggleButton use `spacing-400` inline padding
(Base 16px, Compact 12px). Medium remains `spacing-300` (12px/10px).
Menu items and selection popup rows use `spacing-300` (12px/10px).
Gap and all vertical dimensions remain unchanged. Figma shared label and icon
slot masters now have zero inline padding across all variants.

- Button and ToggleButton use Astryx's horizontal spacing roles, mapped to
  Minim `spacing-300` for outer inline padding and `spacing-200` for the gap.
  Base resolves to 12px / 8px; Compact resolves to 10px / 6px.
- Button label inline padding is zero. Icon slots use their line-height width
  without an additional horizontal inset. Icon-only buttons retain zero outer
  inline padding and square sizing.
- Vertical padding, component heights, typography and colors are unchanged.
- Figma: updated all 252 Button variants; checked unchanged heights and top/bottom
  padding. Nested ToggleButton and ButtonGroup instances inherit the changes.
  Shared slot masters are unchanged to avoid changing unrelated controls.
- Regression examples include labels, leading/trailing icons, loading,
  ButtonGroup and icon-only Button/ToggleButton in both density modes.
