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

This foundation maps global color roles, typography, radii, medium and large element sizes, shadows, generated local tokens, and the shared Minim icon registry. It intentionally has no component style overrides.

The current Figma source is light-mode only, so both theme definitions use the same generated color values and do not invent dark values. `minimUnmappedGlobalRoles` lists upstream roles that remain on Astryx defaults until a reviewed Minim mapping exists. In particular, `--size-element-sm` is intentionally unchanged for legacy compatibility.

`minimGlobalTokenMappings` is exported as the readable QA contract for global color roles. Generated values remain owned by `src/minimTokens.generated.ts`.
