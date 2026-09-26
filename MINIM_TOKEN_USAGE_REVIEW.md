# Token Usage Review

## Content box removal - 2026-09-25

- Removed all four remaining content/*/box-size variables after verifying zero
  references across all 15 Figma content pages, including hidden instance content.
- Internal height is typography line-height plus twice component/{size}/padding-block-slot.
  No height-slot token is introduced. Outer controls use component/{size}/height;
  badges and tokens retain component/{size}/height-inline.
- Base/Compact internal heights: large 28/24, medium 24/20,
  supporting-large 20/18, supporting-medium 18/16.
- Figma wrappers hug their contents. Image and audio slots use a transparent
  inline-height reference plus slot padding; artwork stays absolutely positioned.
  Table labels retain their wrapper height through line-height and slot padding.
- Switch tracks hug their existing proportional shapes plus spacing/50 padding.
  The large shape height uses width-inline (24/20); medium uses spacing/500
  (20/16). Track dimensions remain large 64x28/54x24 and medium 54x24/44x20.
- Current exported semantic-token count is 59. Active source and CLI templates
  no longer reference content size tokens. Earlier audit records below are historical.
- Verification: 78 theme/component tests, 12 token-generation tests, and 16
  desktop/mobile browser checks passed in Base and Compact. Theme build passed.

## Component spacing consolidation - 2026-09-25

- Canonical vertical padding: component/{medium,large,xlarge}/padding-block.
  Base values are 6/8/12; Compact values are 4/6/10. Matching content slots
  produce heights 36/44/52 and 28/36/44 respectively.
- Nested segmented items use component/{medium,large}/padding-block-inner
  (Base 4/6, Compact 2/4), accounting for the outer container inset.
- Inline padding and gaps use spacing tokens, never component padding tokens.
  Component-specific spacing choices remain: fields and menus use spacing/300;
  large buttons use spacing/400. Menu-to-menu spacing stays spacing/50 (2/2).
- Removed 12 redundant inline/gap/row variables after rebinding Figma references.
  No control/, control-item/ or row/ token names remain. Live token count is 326.
- Inline normalization: former row 8/8 becomes spacing/200 (8/6), former control
  medium 8/5 becomes 8/6, xlarge 14/12 becomes 16/12, nested medium 6/3 becomes
  6/4. Vertical geometry and content-driven table height are unchanged.
- Verification: 95 Minim tests, 12 token-generation tests, the CLI bundle test,
  and four desktop/mobile size checks pass. Menu coverage passes for all 48
  cases across the initial run and a four-case rerun after replacing a stale
  pixel-string assertion with the actual typography token comparison.
- Figma verification found no retired token references across the 15 content
  pages. ListItem without a description measures Base 36/44 and Compact 28/36.
- Earlier sections below are historical records, not the current token contract.

## Second cleanup

- Removed eight additional variables: bg/neutral-glass, bg/muted-solid,
  bg/highlight-solid, stroke/highlight, radius/full/component-medium,
  radius/full/component-large, radius/full/component-xlarge, control/medium/gap.
- The old CLI date-time gap reference disappears when regenerating the bundle:
  current DateTimeInput is joined, with an intentional zero gap. For spaced
  layouts, spacing/200 remains the Base 8 / Compact 6 replacement.
- Refreshed the complete Minim CLI theme bundle, including missing component modules.
- Embedded Spinner SM/MD/LG geometry now follows typography line-height tokens;
  ring thickness retains the Figma proportions. Standalone XL remains 36px.
- Bound 28 EmptyState/CodeBlock spacing properties in Figma. EmptyState's old
  24px inline inset now uses spacing/500 (Base 20 / Compact 16), in code too.
- Current variable count: 338. The original audit below is historical evidence,
  not the current removal list.

## Applied follow-up

The audit below is the pre-change baseline. The approved follow-up is now applied:

- Retired four unused content/*/text-inset-inline variables. Slot padding stays zero.
- Retired bg/neutral-tint and bg/field-subtle. Existing canonical equivalents are
  bg/layer-overlay and bg/layer-base; no runtime/node references needed migration.
- Replaced shadow/neutral's alpha/black/100 alias with gray/1000 at 10% opacity,
  then removed alpha/black/100. Low/Medium/High style bindings and appearance remain.
- Synchronized shadow/neutral and three button/min-width tokens into the code export.
- Bound 16 Switch description fills to fg/muted and 32 Switch layout gaps to spacing.
- Bound padding on 14 Slider value bubbles to spacing tokens.
- Bound 94 Markdown table/list/blockquote spacing properties across 36 nodes.
- Retained control/medium/gap and radius/full/component-{medium,large,xlarge}:
  no file/style/alias/static-code use was detected, but deletion was not approved.
- Retained fg/readonly. Current Data Input and legacy component pages have no
  readonly/read-only component variants. This is a missing design-state example,
  not a wrongly colored existing readonly variant. Code uses the token correctly.

After cleanup: 346 live Figma variables and 346 exported code variables.
Validation: 11 token-generation tests pass, including retired token absence,
shadow alpha, and Base/Compact button minimum widths. Figma checks found no
unbound Switch description fills or 2/8px Slider bubble padding. Switch and
Markdown screenshots were inspected. No new readonly variants were created.

## Original audit baseline

## Scope

353 local variables, all 17 file pages including hidden descendants, 31 local
styles, recursive variable aliases, and static source references in Minim,
core and docsite. Generated registries and tests are not counted as runtime
usage. Published library consumers in other files and dynamically constructed
token names cannot be ruled out. Therefore these are candidates, not safe-to-delete findings.

## Highest-priority retirement candidates

- content/large/text-inset-inline
- content/medium/text-inset-inline
- content/supporting-large/text-inset-inline
- content/supporting-medium/text-inset-inline

These four tokens have no detected usage after slot horizontal padding was
removed. Do not substitute another nonzero spacing token; the agreed value is zero.

## Other semantic candidates without detected usage

| Token                        | Recommendation                                                                                                  |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------- |
| bg/neutral-tint              | Same definition as bg/layer-overlay; candidate for retiring the old name.                                       |
| bg/field-subtle              | Same definition as bg/layer-base; consolidate only if separate field styling is no longer needed.               |
| bg/neutral-glass             | No detected usage; retain only if a glass surface is planned.                                                   |
| bg/muted-solid               | No detected usage; do not replace with fg/muted merely because values match.                                    |
| bg/highlight-solid           | No detected usage; highlight/yellow is distinct from warning/amber.                                             |
| stroke/highlight             | No detected usage; same current value as fg/highlight but a different paint role.                               |
| control/medium/gap           | Same two-mode definition as spacing/200 and control/large/gap; choose one control-gap contract before retiring. |
| radius/full/component-medium | No detected usage; consider generic radius/full only for truly pill-shaped geometry.                            |
| radius/full/component-large  | Same caveat.                                                                                                    |
| radius/full/component-xlarge | Same caveat.                                                                                                    |

The total not reached by detected usage is 135: 6 semantic colors, 8 semantic
tokens, 95 base colors, 26 base numeric/type tokens. Base palette/ramp completeness
is intentional design infrastructure; absence from current screens alone is not
a reason to delete those 121 primitive tokens.

## Keep despite matching values or missing Figma usage

- fg/readonly is used by input.ts.
- stroke/secondary is used by minimTheme.ts.
- content/supporting-large/box-size and content/supporting-medium/box-size
  are used by Badge/Token-related code.
- bg/warning and bg/amber have the same definition but different semantic vs
  palette roles. Likewise fg/warning, stroke/warning and fg/amber.
- row padding, control padding, typography and radius tokens can share values
  today while retaining different responsibilities. Do not merge by number alone.

## Existing components bypassing tokens/styles

- Switch Description: 16 direct solid fills, RGB 78/96/111; no paint token.
  Switch also has direct 8px/2px layout gaps.
- Slider value bubble: direct horizontal 8px and vertical 2px padding.
- Markdown lists/tables: direct 4/6/8/16px spacing and padding.
- EmptyState, CodeBlock, PowerSearch popover: direct padding/gaps remain.
- Avatar initials: 25 text nodes across two sets without a text style or
  font-size binding. They use avatar-specific sizes; do not force button typography.
- Checkbox and some surfaces have effects without an effect style; inner
  shadows and focus rings must be classified before applying elevation styles.
- Fixed heights/minimum heights noted in MINIM_SIZE_VERIFICATION.md remain.

Unbound-value counts in the JSON are review candidates, not confirmed bugs:
instance-root values may inherit a master definition; icon vector geometry,
inactive gaps, fixed media dimensions and intentional 0/1px values need different handling.
Nested instance contents were excluded from the component-level candidate scan
to avoid counting the same master repeatedly. The usage scan includes them.

## Code snapshot drift

Five live tokens are absent from packages/themes/minim/figma/tokens.json:
shadow/neutral, alpha/black/100, and button/min-width/md, lg, xl.
Code may already implement equivalent results through other tokens or expressions;
this is a definition-sync gap, not proof of a visual mismatch.

Evidence and candidate IDs: figma-token-usage-audit.json.
