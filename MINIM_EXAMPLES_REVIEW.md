# Minim composition review

Date: 2026-09-19. Review observations, not approved design changes.

## Scope and evidence

Six local examples at `/examples`: reservations, reservation form, conversation,
account settings, reservation detail, and processing feedback. All compose the
existing core components under the real Minim theme. No substitute components
or example-only component styling was introduced.

Reviewed at 1440x1000 and 390x844, in base and compact. Reproduce with:

```sh
pnpm exec playwright test -c apps/docsite/playwright.examples.config.ts
```

Screenshots and computed-style measurements are saved to `/tmp/minim-examples`.
Passing interaction checks does not imply passing design or accessibility review.
This is not a complete audit of every component, state, or Figma variant.

## Findings requiring follow-up

### 1. Status-message text contrast is too low

Computed foreground/background colors of attached, active field messages:

| Status  | Foreground      | Background       | Contrast |
| ------- | --------------- | ---------------- | -------- |
| Success | rgb(45,121,242) | rgb(222,239,252) | 3.48:1   |
| Warning | rgb(217,119,6)  | rgb(254,243,199) | 2.86:1   |
| Error   | rgb(216,26,26)  | rgb(250,229,229) | 4.26:1   |

All are below the 4.5:1 minimum for ordinary text in
[WCAG 2.2 SC 1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).
These are active instructions, not disabled-control text. Measurements use
computed CSS colors, not anti-aliased screenshot pixels.

Recommendation: keep the current status backgrounds and hues; select darker
semantic foreground values for message text, verifying every consumer before
changing a shared foreground token. Warning's amber-600 foreground needs a darker
text treatment on its pale background. Do not darken every fill or border.
Owner: `packages/themes/minim/src/components/input.ts`, `field-status` mappings.

### 2. Compact supporting messages become very small

Attached messages are 12px in base and 10.5px in compact, at the default root size.
In the processing and settings examples they are noticeably harder to scan than
the input values. This is a visual recommendation, not a claim that WCAG defines
a minimum font size.

Recommendation: consider retaining at least 12px for important instructions in
compact, with the existing line-height ratio preserved. Avoid increasing all
typography or all component heights to solve one supporting-text problem.
Owner: typography XS token choice in `field-status`.

### 3. Read-only styling is not wired through the input theme

The control correctly prevents edits, but has the same dark text and white field
background as an editable input. The theme exports `fg-readonly` and `bg-readonly`,
but `input.ts` has no readonly mapping. This conflicts with the previously stated
intent to distinguish the readonly appearance.

Recommendation: connect the existing readonly tokens through the supported input
targets, while preserving selection/copy and keyboard access. Recheck current
Figma before treating this report as a new visual specification.

Resolved on 2026-09-20: the Minim input theme now applies `fg-readonly` and
`bg-readonly` to readonly TextInput, NumberInput and TextArea controls. Disabled
controls with an explanation are excluded from the readonly selector. Base and
compact computed colors were verified; controls remain focusable and non-disabled.

### 4. Switch density follows a different rule

The default switch is 40x24px in both modes, from hardcoded dimensions in
`selection.ts`. Radio and checkbox indicators change from 22px to 20px.
As surrounding text shrinks, the compact switch is relatively more prominent.

Follow-up Figma inspection: the user has already revised `_switch`
(`10823:40057`). Medium is 54px wide with height 24px base / 20px compact;
large is 64px wide with height 28px base / 24px compact. Both use spacing/50
insets and an elongated thumb. This is a code synchronization gap, not an
undecided design policy. Code is now synchronized: md is medium, lg is large,
and legacy sm remains a medium alias in Minim. Shared geometry variables keep
the native input, wrapper, track and thumb travel aligned in both densities.

### 5. Main and secondary actions need a composition rule

In the reservation list, both the primary page action and the dropdown trigger
receive the default dark neutral treatment. This is consistent with Button's
neutral default, but weakens action hierarchy when composed.

Recommendation: retain the neutral Button default; use a lower-emphasis existing
variant for filter/utility menu triggers. This is an example/application choice,
not a reason to change every Button to primary.

### 6. Mobile tables need a priority strategy

The table scrolls inside its own region without widening the page. At 390px the
status column starts offscreen, however, so an important reservation property is
not immediately visible.

Recommendation: choose an existing sticky-column option or put status alongside
the reservation identity in a mobile composition. Horizontal scrolling alone
solves overflow, not discoverability. No new Table component is required.

## Positive observations

- Ordinary inputs, selectors and buttons align in the two densities.
- Avatar media remains visually larger than adjacent typography without forcing
  control line heights to match the avatar.
- Menus remain visible above table content; checked popovers stay within viewport.
- Form validation, settings selection, payment confirmation and chat submission
  work using existing component state handling.
- TextArea's missing combined control/content inset was repaired in the preceding
  review, without changing the public component API.

## Decision boundary

Only example pages and review tests were extended in this pass. Findings above
have not been silently applied as new typography, color or density decisions.
Prioritize status contrast and readonly wiring first, then compact supporting
typography. The remaining items are composition guidance or explicit exceptions.
