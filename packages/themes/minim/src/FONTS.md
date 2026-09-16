# Minim Theme Font Sources

The theme loads font files remotely and does not redistribute font binaries.

- `Minim Symbol` is loaded from the font owner's catalog endpoint. `font-display: block` prevents ligature source text such as `:search:` from flashing as visible content during the short icon-font load.
- `MinimBaseVF` and `MinimSoftVF` use the public stylesheets published by the `poposnail61/minim-font` repository. Those stylesheets split each variable font into Unicode-range subsets.
- `JetBrains Mono Regular` is loaded from the official JetBrains Mono repository at the pinned `v2.304` tag. JetBrains Mono is licensed under the SIL Open Font License 1.1.

Remote fonts require network access and permissive cross-origin font responses. Content Security Policy must allow the two CDN origins and `minim-symbol.sanjay0227.chatgpt.site` in `font-src`; the CDN origin is also required in `style-src` for the imported Base and Soft stylesheets. If a remote font is unavailable, body and code text use the declared fallbacks, while symbol icons remain blank during the `block` period and may then expose ligature text according to browser fallback behavior.
