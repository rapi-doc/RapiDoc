# @rapidoc/prerender — Static Renderer

## Overview

The build-time, framework-agnostic renderer, published as `@rapidoc/prerender` (`dist/index.js`, built
by `../vite.config.mjs` in SSR library mode; types in `index.d.ts`). It renders the templates and
components of `packages/rapidoc/src` on the server, so a change there shows up here too. It turns an OpenAPI spec into HTML strings without a
browser: the sidebar markup and navigation model that `@rapidoc/portal` places beside a headless
`<rapi-doc>`, and pre-rendered `<rapi-doc>` output as Declarative Shadow DOM or light DOM.

It does not parse specs (`../../rapidoc/src/utils/spec-parser.js`), build CSS (`../../rapidoc/src/styles/css-bundle.js`),
compute anchors (`../../rapidoc/src/utils/slugger.js`) or bind the sidebar in the browser
(`../../rapidoc/src/utils/bind-navbar.js`); it re-exports those entry points. Its Lit templates come from
`../../rapidoc/src/templates/` and its schema renderers from `../../rapidoc/src/components/`.

## Interface

Everything is exported, named and as a default object, from `index.js`; `index.d.ts` is the
typed contract (option types, navigation types, signatures) and declares no default export.

- `resolveSpecInput(specInput, options?)` [render.js:resolveSpecInput] — object, JSON/YAML
  string, local file path or URL, run through `ProcessSpec`; an already-parsed spec (one whose
  `securitySchemes` is an array) is returned as-is.
- `renderRapiDoc(options)` [render.js:renderRapiDoc] — a whole API as `<rapi-doc>` + DSD, or as a
  scoped light-DOM container (`outputMode`).
- `renderEndpoint(options)` / `renderSchema(options)` [render.js] — one operation, or one schema
  (object or `components.schemas` name), in a container `div`.
- `getSpecNavigation(specInput, options?)` [navigation.js:getSpecNavigation] — the navigation
  model (`tagGroups`, `tags`, `remainingTags`, operations).
- `getNavBarHtml(specInput, options?)` / `renderNavBarHtml(resolvedSpec, options?)`
  [navigation.js] — sidebar HTML (async from input, sync from a resolved spec).
- `getNavFilterHtml(options?)`, `getMethodBadge(method, format?)` [navigation.js] — filter box
  and method badge text.
- `renderTemplateToString(result, options?)`, `escapeHtml(str)` [serializer.js] — DOM-free
  serializer for Lit `TemplateResult` values.
- Re-exports: `bindNavBar` (browser-side, `../../rapidoc/src/utils/bind-navbar.js`); `getBundledCss`,
  `getNavCss`, `getThemeTokensCss` (`../../rapidoc/src/styles/css-bundle.js`); `toKebabCase`, `methodPathSlug`,
  `operationAnchorSource` (`../../rapidoc/src/utils/slugger.js`); `renderArazzoWorkflow`
  (`../../rapidoc/src/utils/arazzo/index.js`: one Arazzo workflow as an SVG string) and `getFlowCss` (its
  stylesheet, `../../rapidoc/src/styles/flow-styles.js`; the page also needs `getThemeTokensCss`).

## Invariants

- No DOM required: `render.js`, `navigation.js` and `serializer.js` do not reference `document`
  or `window`. Templates are serialized by `renderTemplateToString`, not `@lit-labs/ssr`; schemas
  by calling `SchemaTable` / `SchemaTree` `.render()` directly. Only `bindNavBar` needs a browser.
- Errors are thrown, not returned: `resolveSpecInput` on empty input; `renderEndpoint` when `path`
  or `method` is missing or no operation matches; `renderSchema` when a name is given without
  `spec`, the name is not found, or the schema is invalid.
- `renderEndpoint` matches `path` exactly and `method` case-insensitively; the first tag with a
  match wins.
- DSD output (`outputMode` other than `"html"` / `"light"`): `spec-url` is set when `spec` is an
  `http(s)://` string; an object `spec` is inlined as `<script type="application/json"
  slot="rapidoc-spec">` (with `<` escaped) unless `inlineSpec === false`; extra non-internal
  options are reflected as kebab-case attributes. Attribute values go through `escapeHtml`.
- Anchors match `<rapi-doc>`: each `renderNavBarHtml` / `getSpecNavigation` call uses a fresh
  `OperationSlugger`. An operation's own `elementId` is used as-is; otherwise its id is
  `${tagSlug}--${opSlug}`, or just `opSlug` when the tag slug is empty or `general`
  [navigation.js:renderOperation].
- In `routingMode: "tag-pages"`, hrefs are `${base}/${tagSlug}#${opSlug}` except for an empty or
  `general` tag slug, which keeps the single-page `${base}#${id}` form.
- `@rapidoc/portal` and `../../rapidoc/src/utils/bind-navbar.js` rely on the sidebar's classes and `data-*`
  attributes (`.nav-bar-path`, `data-action`, `data-content-id`, `data-op-slug`,
  `data-tag-href`); changing them is a breaking change
  [navigation.js:renderNavBarHtml].
- The serializer drops event (`@x`) and property (`.x`) bindings, emits `unsafeHTML` /
  `unsafeSVG` string values raw, and treats text as escaped (`& < >`) and attribute values via
  `escapeHtml`.

## Side Effects

- Importing patches the global custom-element registry. In Node, `serializer.js` installs a no-op
  `globalThis.customElements` when none exists; `render.js` then wraps `customElements.define`
  (and `CustomElementRegistry.prototype.define` when it exists) to skip names already defined and
  swallow errors, marking it with `__safeDefinePatched`.
- `resolveSpecInput` may read a local file with `node:fs` when running in Node; read errors fall
  through to parsing the string. URL inputs are loaded by `ProcessSpec`, not here.
- The serializer calls a directive's function argument (as with Lit `guard`).
- No module-level caches; slugger state is per call.

## Verification

- Run `npm run test:unit` from the repo root; `tests/unit/static-renderer.test.js` covers this
  folder.
- After changes here or in the `packages/rapidoc/src` code it renders, rebuild with
  `npm run build:prerender` from the root (or `npm run build` in `packages/rapidoc-prerender`).
