# Mobile Sample Apps

Three mobile-first composition examples using the actual Minim theme, components,
and Minim Symbol icons. Existing travel, kitchen, and reading examples are unchanged.

## References

- Fitness: [Hevy workout logging](https://www.hevyapp.com/features/track-workouts/).
  Saved routines, editable sets, completion, rest timer, and workout history.
- Wallet: [Toss](https://toss.im/). Amount-first hierarchy, spending rows, and
  budget overview. This is a manual local ledger, not a banking integration.
- Music: [Spotify queue](https://support.spotify.com/us/article/play-queue/).
  Artwork-led discovery, likes, a persistent mini player, and an editable queue.
  Tracks are original synthesized 30-second previews, not Spotify recordings.

## Routes

- `/examples/apps/fitness`
- `/examples/apps/wallet`
- `/examples/apps/music`

Each shell caps its width at 480px. The header and bottom navigation stay visible;
only the main content scrolls. Controls default to large and neutral, and respect
Base/Compact. State is stored locally under separate `minim-*` storage keys.

## Component Workflows

- Fitness: BottomSheet, TextInput and CheckboxList edit saved routines; Switch and
  Selector configure the rest timer. TextArea notes are saved with each workout.
- Wallet: DateInput and TextArea capture expense details; BottomSheet,
  CheckboxList and Slider filter records; AlertDialog confirms deletion.
- Music: DropdownMenu opens mobile song actions; BottomSheet, TextInput and
  CheckboxList edit a persistent playlist; Switch enables single-track repeat.

## Verification

`pnpm exec playwright test --config apps/docsite/playwright.mobile-apps.config.ts`

Covers all three main flows in Base/Compact at 390px and 360px widths, image loading,
horizontal overflow, runtime/hydration errors, and persistence after reload.
Screenshots are written to `/tmp/minim-new-mobile/`.
