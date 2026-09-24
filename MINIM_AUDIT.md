# Minim audit, 2026-09-20

## Scope

Figma file `mHcauYaYWK3floQNsfolz6`, page `10633:55324`, and the local
Minim theme/core implementation. This is a structural audit plus representative
visual and behavioral verification, not a claim that every Figma state was
visually compared with every code state.

## Figma checks and correction

- Inventoried 127 component sets containing 1,513 variants.
- Component property names and variant values pass kebab-case checks. User-facing
  text property values are deliberately excluded from that naming rule.
- All 82 semantic numeric variables match the code snapshot in base and compact.
- Rebound font weight on 10 existing text/icon styles from primitive weight tokens
  to semantic regular/medium weight tokens. Preserved style IDs, font families,
  sizes and line heights. Follow-up inspection of 28 local text styles found no
  remaining primitive `weight/*` binding on their fontWeight property.
- Variables absent from the local-variable listing were individually resolvable;
  absence from that listing alone is not evidence of a broken binding.

## Code corrections

- DateTimeInput date/time shells now join with a one-pixel border overlap and only
  outer rounded corners, matching the Figma joined-field construction. At 320px,
  both remain on one row; large height is 44px base / 36px compact.
- Wired existing readonly foreground/background tokens to TextInput, NumberInput
  and TextArea without treating disabled-with-explanation controls as readonly.
- Documented Switch field size in the missing localized theming target.
- Documented Calendar's resolved internal cell-size variable alongside the public
  override. Classified public grid metrics and inner Spinner SVG/wrapper metrics
  correctly in the derived-variable contract test; root box CSS is not equivalent.
- Prevented DateInput's native-picker policy prop from leaking onto a DOM element,
  with a regression test.

## Verification

- Full core run: 327 files, 9,583 tests; 9,579 initially passed. Four documentation
  contract failures were found and corrected. The failed suites and all Minim
  theme tests then passed together: 602 tests across 16 files.
- DateInput regression suite: 96 tests passed, including the new policy-prop test.
- Token generator tests: 10 passed.
- Core production build and docsite TypeScript check passed.
- 36 blue-outline component pages rendered in base and compact (72 cases), with
  no captured runtime exceptions or horizontal document overflow. Representative
  Card, Table and Banner screenshots were visually inspected.
- Readonly controls were checked in Chrome in both modes; computed foreground
  rgb(158,158,158), background rgba(0,0,0,0.05), matching the existing tokens.
- Popup/browser regression: all 44 cases passed across wide/narrow viewports and
  base/compact. Includes 320px joined-field geometry and readonly keyboard checks.
  Final standalone console check reported no console errors or page exceptions.

## Remaining review limits

Existing status-text contrast and compact supporting-text size findings remain
in `MINIM_EXAMPLES_REVIEW.md`. Changing shared palette/type values would alter
the approved Figma design, so those values were not silently changed in code.
External references in documentation/example frames need a separate exhaustive
audit; this pass does not certify every nested example instance or visual state.

## Hidden-property and icon follow-up

- Included invisible instance children in the Figma scan: 3,046 icon text nodes
  inside component sets, including 1,924 under hidden nodes, use Minim fonts.
  This font check does not certify vector icons or every glyph's semantic meaning.
- Checked boolean references across 46 component sets, including native SLOT
  nodes. A reference existing somewhere in a set is not sufficient to certify
  each variant: targeted inspection found six missing visibility references in
  XDSFieldLabel's optional/required/disabled variants. Restored them and tested
  both true and false on temporary instances, which were removed afterward.
- Replaced 10 remote XDSFieldLabel instances inside InputGroup with local Minim
  variants. Retained text, default/disabled state and show-label references.
  Re-read all 10 main-component links; none remains remote. Inspected a screenshot.
- DateInput (pointer/touch/native), DateRangeInput, TimeInput and TextArea now
  pass the resolved field size to their status icon. Previously large controls
  silently rendered the medium status-icon variant.
- Embedded sm Spinner now uses Minim's smallest defined ring rather than the
  Astryx fallback. Success/error/warning registry entries resolve to solid Minim
  glyphs; tests also require each mapped glyph to exist in the font catalog.
- Fixed useEntryAnimation hydration: server-rendered messages remain static;
  later client-mounted messages retain entrance animations. Added regression
  tests for both cases after reproducing the warning in the optional-state page.
- Verification: affected input suites 291 passed; final focused hook/FieldStatus/
  theme suites 129 passed; docsite typecheck and core/theme builds passed.
  Browser checks cover optional status icons, loading and clearing in base and
  compact, on wide/narrow viewports, including console/hydration errors.
- Deliberately unresolved pending property-structure decision: Tab
  `is-label-hidden` and Collapsible `is-disabled` have no Figma visual binding.
  Selector `has-search` / `search-placeholder` describe its popup behavior, but
  the closed-field master contains no search row to bind. These are not reported
  as fully working Figma controls. Nine unavailable/unapproved semantic glyphs
  still use the inherited Astryx registry; no substitute glyphs were invented.
