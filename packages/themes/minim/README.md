# @astryxdesign/theme-minim

Minim foundation themes for Astryx. The package exports standard (`minim`) and compact (`minim-compact`) density modes defined independently from generated Minim tokens; neither theme extends Neutral.

```tsx
import {Theme} from '@astryxdesign/core/theme';
import {minimTheme} from '@astryxdesign/theme-minim';

<Theme theme={minimTheme}>{children}</Theme>;
```

Use `minimCompactTheme` for the compact density. Optimized consumers import both named themes from `@astryxdesign/theme-minim/built` and load `@astryxdesign/theme-minim/theme.css` once.

## Fonts

Load `@astryxdesign/theme-minim/fonts.css` separately. Font files and their remote URLs remain consumer-owned. The Figma family `Minim Base VF` maps to the CSS family `MinimBaseVF`; `Minim Soft VF` maps to `MinimSoftVF`. The foundation theme uses `MinimBaseVF` for body and headings and `JetBrains Mono` for code, with system fallbacks.

## Scope

This theme maps global color roles, typography, radii, medium and large element sizes, shadows, generated local tokens, and the shared Minim icon registry. Component recipes in `src/components` adapt the existing Astryx implementations; they do not replace keyboard behavior, accessibility, or public React APIs.

The 36 blue-outline Figma families are recorded in `figma/blue-components.json`. Surfaces, navigation, and collections have dedicated recipes where the shared roles do not already express the Figma design. Card padding is a theme default, so an explicit `padding` prop still wins. Card selection rings remain composed with elevation.

Figma `padding=none|compact|default|spacious` maps to Card `padding={0|1|3|5}`; omitting padding uses the default. Figma `elevation=medium` maps to React `elevation="med"`. Figma names stay kebab-case; React prop names remain camelCase. `is-label-hidden`, disabled, open, selected, and optional slot visibility continue to use the existing component behavior.

The current Figma source is light-mode only, so both theme definitions use the same generated color values and do not invent dark values. `minimUnmappedGlobalRoles` lists upstream roles that remain on Astryx defaults until a reviewed Minim mapping exists. In particular, `--size-element-sm` is intentionally unchanged for legacy compatibility.

`minimGlobalTokenMappings` is exported as the readable QA contract for global color roles. Generated values remain owned by `src/minimTokens.generated.ts`.

## Verification

`scripts/check-minim-blue-components.mjs` opens all 36 documented families in both density modes and records screenshots, runtime errors, and page overflow. `scripts/check-minim-blue-interactions.mjs` checks keyboard navigation, card selection, popover dismissal, and five representative mobile layouts. Start the docsite first; the default QA URL is `http://127.0.0.1:5181` and can be changed with `MINIM_QA_URL`.

These checks exercise real component showcases, not generated playground controls. They are rendering and interaction checks, not a pixel-diff guarantee for every Figma variant. The captured Figma evidence preserves variant names and token bindings for further design review.
