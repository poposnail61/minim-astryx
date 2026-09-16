# Minim Astryx

Minim Astryx is a work-in-progress, unofficial adaptation of [Astryx](https://github.com/facebook/astryx) for the Minim visual system. It is maintained at [poposnail61/minim-astryx](https://github.com/poposnail61/minim-astryx).

This project is not affiliated with, endorsed by, or supported by Meta. The starting point is `facebook/astryx` commit [`d6fd8d45deb1318b7f332dbb8e717c752ac7af48`](https://github.com/facebook/astryx/commit/d6fd8d45deb1318b7f332dbb8e717c752ac7af48).

## Status

The source inventory, 343-variable token export, base and compact themes, glyph registry, mapped component recipes, and generated documentation metadata are implemented in the workspace. Focused component tests, token conversion tests, theme-build tests, type checks for the mapped scope, and knowledge validation pass.

The configured focused browser validation passes. The visual regression checkpoint passes both suites (2/2) across 1440px desktop and 390px mobile viewports, in `base` and `compact` modes: 32 PNG comparisons and the example-clipping checks pass. The advanced-component checkpoint passes all four configured desktop/mobile geometry and keyboard suites for Calendar, PowerSearch, FileInput, Slider, and Switch. ButtonGroup also passes desktop/mobile validation in both modes after its transparent-group and split-boundary correction. The documentation-site TypeScript check passes after its configuration correction, and the production documentation build generates all 395 pages. [MINIM_IMPLEMENTATION.md](MINIM_IMPLEMENTATION.md) records the exact scope and evidence.

These scoped results are not a claim of complete Figma parity or visual acceptance for all 1,049 indexed variants. The repository also does not claim a production release, npm publication, or completed deployment.

`@astryxdesign/theme-minim` is the workspace package name. It has not been published to npm, so this README does not provide an npm consumer-install command.

The intended approach is deliberately bounded:

- preserve Astryx behavior, public APIs, and accessibility contracts;
- add Minim semantic theme variables for the actual Figma `base` and `compact` modes only;
- add a glyph-font registry using the required [Minim Symbol](https://minim-symbol.sanjay0227.chatgpt.site/) source;
- add component overrides only for cases supported by exact measurements;
- reuse the upstream generated documentation system with actual repository metadata; and
- avoid inventing variants or behaviors absent from the authorized design source.

See [MINIM_IMPLEMENTATION.md](MINIM_IMPLEMENTATION.md) for the evidence ledger and remaining visual-validation work, and [ATTRIBUTION.md](ATTRIBUTION.md) for source attribution.

## Local development

The component packages require React 19 or later. Use Node.js 24, pinned by `.nvmrc`, and pnpm 11.10.0, pinned by the root `packageManager` field.

```bash
nvm install
nvm use
corepack enable
pnpm --version
```

Install the workspace dependencies from the repository root:

```bash
pnpm install
```

Build only the Minim theme package:

```bash
pnpm -F @astryxdesign/theme-minim build
```

Build the full workspace, including the Minim theme in dependency order:

```bash
pnpm build
```

Generate and start the local documentation site:

```bash
pnpm docsite
```

The documentation command runs the `@astryxdesign/docsite` package's generation step before starting its local Next.js development server.

## Upstream

Astryx is an open-source design system built with React and StyleX. Upstream documentation, packages, contributor guidance, and project history remain available in the [facebook/astryx repository](https://github.com/facebook/astryx).

Changes in this fork should continue to follow applicable upstream repository guidance unless this project documents a narrower constraint.

## License

This fork retains the upstream [MIT License](LICENSE). The existing `LICENSE` file and its copyright notice remain unchanged. See [ATTRIBUTION.md](ATTRIBUTION.md) for additional provenance.
