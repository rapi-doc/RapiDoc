# `src/styles` — RapiDoc Stylesheets and Theme Tokens

## Overview

The CSS of `<rapi-doc>` and `<rapi-doc-mini>`, written as Lit `css` templates (one default export
per stylesheet file), plus the theming helpers that turn the `theme` attribute into CSS custom
properties, and string transforms that reuse the same CSS outside a shadow root.

- `theme-tokens.js` defines the custom properties (shadcn/ui names such as `--background`,
  `--primary`, `--radius`; `--sidebar-*` for navigation; `--h1-font-size`… and `--heading-*`) and
  switches them on host attributes (`theme`, `color-scheme`, `radius`, `scale`,
  `nav-item-spacing`). The other stylesheets read those tokens and style component class names.
- `css-bundle.js` composes every stylesheet into `allStyles` and rewrites `:host` selectors for
  Light DOM use.

Not owned here: which attributes exist (`src/rapidoc.ts`), the documented token list
(`docs/src/page-data/styling-data.yaml`), and the portal's own layout CSS.

Dependents: `src/rapidoc.ts`, `src/rapidoc-mini.ts` and the shadow-root components in
`src/components/` list the stylesheets they need in `static get styles()`; `packages/rapidoc-static/src/index.js`
re-exports `getBundledCss`, `getNavCss` and `getThemeTokensCss` as `@rapidoc/static`, and
`packages/rapidoc-static/src/render.js` uses `getBundledCss` for Declarative Shadow DOM output; `@rapidoc/portal`
(`src/pages/api-reference.astro`) uses `getNavCss` and `getThemeTokensCss`.

## Interface

`theme-tokens.js`:

- `DEFAULT_THEME` (`"ember"`), `THEMES` (preset name to `{ dark, light }` declaration strings),
  `THEME_PRESETS` (its keys).
- `isValidHexColor`, `isValidTheme`, `isCustomColor`, `isLightColor`: theme value checks.
- `normalizeTheme(theme) -> { theme }`: presets lower-cased, hex kept, anything else becomes
  `DEFAULT_THEME`.
- `applyCustomTheme(element, themeVal)`: sets inline `--primary` and `--primary-foreground` on
  the host for a valid hex string, and removes them for anything else (presets, non-strings).
- default export: the token stylesheet (defaults, geometry switches, color schemes, presets).

`css-bundle.js`:

- `allStyles`: every stylesheet in cascade order, `ThemeTokens` first, `CustomStyles` last.
- `getBundledCss({ scope })` (also the default export): `allStyles` as one string; with a scope
  other than `:host`, rewrites `:host(X)` to `<scope>X`, `:host` to `<scope>` and `::slotted(X)` to
  `X`. Only `scope` is read, although the JSDoc also lists `theme` and `colorScheme`.
- `getNavCss(scope)`: `nav-styles.js` with the same rewrites, wrapped in a `<scope> { ... }` block
  that also sets a compact `--sidebar-item-padding`, for the portal sidebar.
- `getThemeTokensCss(theme, scope = ":root")`: the token stylesheet with `theme` / `color-scheme`
  host rules rewritten to `[data-theme='dark'|'light'|'system']` selectors (other presets keyed by
  `[data-theme-preset='<name>']`).

Every other file default-exports one stylesheet named after what it styles (`nav-styles.js`,
`endpoint-styles.js`, `schema-styles.js`, ...); `custom-styles.js` is an empty slot kept last.
`flow-styles.js` styles the Arazzo diagram for `<rapi-flow>` and `@rapidoc/static` `getFlowCss()`; it
uses plain class selectors (no `:host`) and is not part of `allStyles`.

The custom properties themselves are not listed here: `theme-tokens.js` is the source of truth and
`docs/src/page-data/styling-data.yaml` is the documented list (`packages/rapidoc/AGENTS.md` §5,
rule 6).

## Invariants

- Every custom property RapiDoc reads is defined somewhere in `src`; public tokens are defined
  with a default in `theme-tokens.js`. `tests/unit/css-variables.test.js` enforces this, forbids
  the removed v11 names and requires the shadcn/ui core tokens.
- Tokens are read as plain `var(--x)`, without a fallback. The one exception is the local
  `--method-color` in `endpoint-styles.js`, which `.m-endpoint` and the verb classes set and which
  is read with a fallback to `--method-default` or `--primary`.
- Adding, renaming or removing a token also updates `docs/src/page-data/styling-data.yaml` and the
  current migration guide.
- Dark is the default scheme: the dark block matches `:host`, `[color-scheme='dark']`,
  `[color-scheme='system']` and no `color-scheme`; `system` turns light only under
  `@media (prefers-color-scheme: light)`. `DEFAULT_THEME` also applies with no `theme` attribute.
- `--primary` and `--primary-foreground` have no `:host` default; they come from a preset rule or
  from `applyCustomTheme`. `--ring` follows `--primary`.
- The `:host(...)` selector shapes written by `presetCss` and the color-scheme block are exactly
  what `getThemeTokensCss` and `getNavCss` match with regular expressions; change both together.
  `getThemeTokensCss` rewrites only `theme` / `color-scheme` rules, so the `radius`, `scale` and
  `nav-item-spacing` rules come out as unusable `<scope>([...])` selectors.
- `ThemeTokens` is first in `allStyles` and in both components' `static get styles()`.
  `CustomStyles` is last in `allStyles` and in `rapidoc.ts`; `rapidoc-mini.ts` does not load it
  and ends with its own inline `css` block.
- Lit templates are not reformatted by oxfmt; keep the CSS text inside `css` templates as written.

## Side Effects

- Each stylesheet file creates a Lit `CSSResult` at import; `theme-tokens.js` also builds the
  preset CSS from `THEMES` once.
- `applyCustomTheme` mutates the element's inline style. Everything else is pure; nothing touches
  the network or disk.

## Verification

- `npm run test:unit` from the repo root. Suites: `tests/unit/css-variables.test.js` (defined
  tokens, no undefined reads), `tests/unit/theme-validation.test.js` (`theme-tokens.js` helpers,
  `nav-styles.js`), `tests/unit/static-renderer.test.js` (`getBundledCss`, `getNavCss`,
  `getThemeTokensCss` output).
- After editing, `npm run lint`, `npm run format-fix` and `npm run build:rapidoc`.
