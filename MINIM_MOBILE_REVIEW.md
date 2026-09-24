# Mobile Composition Review

## Scope

Route: `/examples/mobile`. Ten independently resettable demonstration screens
using the existing Minim-themed Astryx components, real icon font, and tokens.
All mutations are local demo state; no real payment or reservation is submitted.

| Screen               | Interaction checked                                       |
| -------------------- | --------------------------------------------------------- |
| Reservation list     | Search, empty result, reset, open detail                  |
| Reservation detail   | Menu, reservation number feedback                         |
| Traveler information | Empty validation, valid submission, consent               |
| Search filters       | Selector, radio, checkbox, apply, reset                   |
| Itinerary            | Day selection and acknowledgement                         |
| Notifications        | Solid status icons, mark read, empty unread list          |
| Payment              | Method selection, consent gating, completion              |
| Documents            | Checklist, progress, completion gating                    |
| Settings             | Medium/large switches, disabled switch, language selector |
| Cancellation         | Text area, modal dismissal, confirmation                  |

## Verification

- Chromium touch emulation, 390x844 and 320x740, Base and Compact.
- 40 scenario combinations passed.
- Checks include horizontal page/control overflow, nested buttons, image loads,
  popup horizontal bounds, expected state changes, and runtime errors.
- Screenshots before and after interactions are in `/tmp/minim-mobile`.
- Visually reviewed all ten 390px screens in both densities, plus narrow error,
  settings, menu, and modal states.
- This is not a physical iOS/Android device or virtual-keyboard test. It is not
  a complete accessibility certification or production business-flow test.

## Fixed During Review

1. A Token in a row with a taller menu button stretched vertically. Explicit
   center alignment now preserves its intrinsic height. The same composition
   rule is applied to reservation list labels.
2. DialogHeader was mixed with bare body/footer stacks, giving the title and
   body different inline insets. The existing Layout, LayoutContent and
   LayoutFooter now provide the intended shared dialog composition.
3. The mobile list uses stacked rows rather than hiding booking status beyond
   the right edge of the desktop table.

## Design Decisions Still Needed

### Compact action density

The mobile examples now inherit `lg` from SizeProvider, rather than falling
back to the core `md` size. Explicit component sizes remain intentional.
Prefer Base for mobile task forms, or separately
define larger touch hit areas without changing the visual density everywhere.
Do not silently upscale the whole Compact theme.

### Selector menu correction

The selected-item overlay positioning is intentional upstream behavior and is
preserved. The popup previously inherited generic Popover padding in addition
to its own list inset. It now uses the Figma ContextMenu surface: spacing-200
inset, spacing-50 row gap, radius-container and elevation-low. Large option rows
use row-large padding plus the label content's block inset: 44px / 16.5px type
in Base and 36px / 15px type in Compact. The scrolling list owns the only outer
inset; theme ordering keeps the generic Popover rule from overriding it.

The same surface and row rules now cover MultiSelector, Typeahead, Tokenizer,
DropdownMenu, ContextMenu and DateTimeInput time options. DateInput,
DateRangeInput and DateTimeInput calendars retain their own internal layout,
without a second Popover inset. DropdownMenu paints its background and shadow
only once. `/examples/menus` provides all ten popup cases for comparison.

Popup verification covers Base and Compact at 1280px and 390px: 40 cases,
checking open/close behavior, horizontal bounds, 44px/36px large option rows,
and duplicate surface padding. Native operating-system pickers are unchanged.

### Supporting text and status contrast

The Compact notification descriptions and validation messages are visibly
small. The existing supporting ramp reaches 10.5px. Important guidance would
benefit from a larger minimum independently of control geometry.

Warning and success foregrounds remain visually weak on their tinted surfaces.
The earlier review measured field-status contrast at 2.86:1 for warning and
3.48:1 for success; those are previous measurements, not newly computed Banner
ratios. Review dedicated status text foregrounds without darkening the icons
or changing the surface colors indiscriminately.

### Readonly affordance

The reservation number is correctly readonly, but visually resembles an editable
field. Revisit the existing readonly token mapping as a separate design-system
fix. Do not emulate readonly with disabled; users must still select/copy it.

### Composition documentation

Document center alignment for mixed-height inline components and the canonical
Dialog/Layout assembly. These examples showed that correct individual components
can still look wrong when composed with default stretching or mixed insets.
