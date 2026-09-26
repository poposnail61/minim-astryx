# Size Verification - 2026-09-24

## Scope and method

- Scanned component sets across all 11 current library categories.
- Measured 806 lg/md variants in Base and Compact. Components without those
  size axes are not covered by the button-size comparison.
- Compact measurements used temporary clones, read in a subsequent call after
  Figma layout settled. Immediate post-mode-change measurements were discarded.
- All temporary clones were removed; production Figma nodes were not edited.
- Browser: 4 size tests and 48 menu/input/state tests passed on localhost:5181,
  covering Base/Compact and desktop/mobile or wide/narrow viewports.
- Screenshots inspected: Compact size overview, Base/Compact mobile Selector,
  Compact calendar, and Figma Compact default Button. This is not an exhaustive
  visual review of every state of every component.

## Findings requiring follow-up

1. Fixed 2026-09-25: all 21 icon-only loading Button variants bind both dimensions
   to the existing button size/minimum-width token. Compact measurements confirmed
   md=28, lg=36, xl=44; Base remains md=36, lg=44, xl=52.
2. Fixed 2026-09-25: removed the unbound minHeight=36 from all four menu-item md
   variants (set 8406:27695). HUG layout now measures 28px in Compact and 36px in Base.
3. Fixed: all 36 direct button instances in ButtonGroup set 8400:13980 now
   hug content vertically. Horizontal LG/MD measured Base 44/36 and Compact 36/28.
4. Spinner sizing was fixed. The 2026-09-25 full measurement confirms loading
   TextInput, NumberInput, DateInput, DateRangeInput, TimeInput and Typeahead
   have correct Compact heights. A separate InputGroup error-state issue remains:
   lg=38/md=30 rather than 36/28, caused by fixed-height truncated label text,
   not by the status icon. Examples: 10322:37605 and 10322:37589.
5. Fixed: removed fixed input-wrapper minimum heights from all 16 Tokenizer
   variants. LG/MD measured Base 44/36 and Compact 36/28, including MD loading.
   Badge/token heights remain independent typography-line-height values.

## Intentional exceptions

- Badge/Token: Base lg/md heights 22/20; Compact 20/18, matching text-line tokens.
- SegmentedControl items are 4px shorter than their outer control, accounting
  for the container inset: Base 40/32, Compact 32/24.
- Multiline list items, field label/description blocks, textarea, avatars,
  spinners and composed popup roots do not use the single-line button height.

## Test environment note

Compact mode switching on the sizes page failed with 127.0.0.1 but succeeded
with localhost in a direct two-host comparison. The size test configuration
now uses the same localhost URL as the app and menu suite. Root cause of the
host-dependent behavior is not established; do not classify it as a size bug.

Evidence: figma-size-verification.json. Browser screenshots are under
/tmp/minim-sizes-results and /tmp/minim-menus.

## Full height audit - 2026-09-25

- Measured all 1,513 component definitions/variants on the 11 current library
  pages: 911 standard-size variants and 602 other variants/standalone components.
  Legacy `component v2` and the icon source page are outside this scope.
- Measured settled Compact instances and removed every temporary instance.
  Production Figma components and code were not modified during this audit.
- Evidence: `figma-height-audit-2026-09-25.json`. This is a numerical/structural
  audit, not an exhaustive visual review of every component and example.
- Button, menu-item, toggle-button, horizontal button-group, tabs, pagination,
  checkbox single-line rows, radio single-line rows, standard inputs and
  Selector/MultiSelector triggers follow Base lg/md=44/36 and Compact=36/28.
  Button xl is 52/44. Badge and Token follow 22/20 and 20/18 respectively.
- ListItem (10653:41266) has unbound fixed root heights of 48/56/64 in both
  modes. Its content can shrink, but its outer bounds do not.
- TableCell has Base density heights 30/38/46 and Compact 28/32/40.
  TableHeaderCell has Base 28/36/46 and Compact 26/30/40. These standalone
  Figma cells do not implement a 36/44/52 row contract. Code likewise uses
  general spacing padding in TableCell/TableHeaderCell rather than row-height
  tokens; actual HTML row height also depends on the tallest cell and borders.
- TreeListItem measures 36/30: a 20/18 text line plus large row padding 8/6.
  It is not the same equation as a medium slot-based control (36/28).
- Image-content and slot-image-content retain fixed image dimensions across
  modes. Person-content md measures 36/32, not 36/28. Treat these as separate
  media layouts until their intended density behavior is decided.
- Do not delete vertical padding tokens wholesale: slots alone are shorter
  than controls. Component-specific aliases can be consolidated only when
  their Base AND Compact values and layout roles match. Badges, segmented
  items, multiline content, switch tracks, avatars and popups are exceptions.

## Approved corrections - 2026-09-25

- InputGroup: removed fixed-height truncation overrides from the two error-state
  placeholder labels. One-line auto sizing preserves Base md/lg=36/44 and
  Compact md/lg=28/36. Verified settled layout and screenshot after correction.
- ListItem: replaced density variants with eight md/lg state variants; no xl.
  The Figma default is lg. Labels/descriptions use the exposed vertical
  slot-label-content; icons use slot-icon-content with matching text-range
  font-size/line-height bindings. Description visibility uses has-addon.
  With description off, all states measure Base md=36/lg=44 and Compact
  md=28/lg=36. Height is content plus token-bound block padding, not fixed.
  Code exposes size on List and ListItem and uses the same slot metrics.
  Legacy List density is deprecated but remains accepted for compatibility.
  Verified all 16 Figma size/state/mode combinations without description;
  focused unit tests: 61 passed. Desktop/mobile Base/Compact size checks:
  4 passed at /examples/sizes. Core and Minim theme builds passed.
- TreeListItem: all nine variants use medium content height plus medium row
  padding; Base=36 and Compact=28. Matching balanced-density code and CLI theme
  template use the same tokens. Descriptions may still grow the code row.
- Image/person content: both axes and inner images now follow existing sizing
  tokens. md=36/28, lg=44/36, sm=32/28, xsm=28/24, xl=68/60. The existing xxl
  token remains 100/100; no new token values were invented.
- Slot-image-content: outer slot and inner image match the content box token:
  lg=28/24, md=24/20. The previous oversized inner image no longer overflows.
- Table cell and header sizing were left unchanged by explicit user decision.
- Focused collection/input tests: 14 passed. Theme build passed; the pre-existing
  toggle-button `content` prop warning remains. No browser interaction suite was
  rerun for this correction; Figma layout measurements and screenshots were used.
