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

1. Figma icon-only loading Button variants retain fixed, unbound heights.
   Compact lg remains 44 rather than 36; md remains 36 rather than 28.
   Examples: 8400:10292 and 8400:10285. Regular buttons resolve correctly.
2. Figma menu-item md retains an unbound minHeight=36, preventing the Compact
   28px height. All four md variants are affected (set 8406:27695).
3. Figma ButtonGroup outer geometry does not contract with Compact children:
   horizontal lg/md remain 44/36; vertical layouts remain 134/110.
   Set 8400:13980 needs container/child sizing review, not typography changes.
4. Figma input loading states can expand by 2px in Compact: lg 38 vs 36,
   md 30 vs 28. Seen in TextInput, NumberInput, DateInput, DateRangeInput,
   TimeInput, Typeahead and InputGroup. Inspect trailing spinner geometry.
   Example: TextInput loading md 10322:35728.
5. Figma Tokenizer md input-wrapper resolves to 32px in Compact rather than
   the 28px single-line control baseline. Inspect token/content constraints
   before changing wrapping behavior. Example: 10322:36232.

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
