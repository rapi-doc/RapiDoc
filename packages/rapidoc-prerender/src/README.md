# @rapidoc/prerender — Static Renderer

## Overview

The build-time, framework-agnostic renderer, published as `@rapidoc/prerender` (`dist/index.js`, built
by `../vite.config.mjs` in SSR library mode, with `dist/internal.js` beside it; types in `index.d.ts`). It renders the templates and
components of `packages/rapidoc/src` on the server, so a change there shows up here too. It turns an OpenAPI spec into HTML strings without a
browser: the sidebar markup and navigation model that `@rapidoc/portal` places beside a headless
`<rapi-doc>`, and pre-rendered `<rapi-doc>` output as Declarative Shadow DOM or light DOM.

It does not parse specs (`../../rapidoc/src/utils/spec-parser.js`), build CSS (`../../rapidoc/src/styles/css-bundle.js`),
compute anchors (`../../rapidoc/src/utils/slugger.js`) or bind the sidebar in the browser
(`../../rapidoc/src/utils/bind-navbar.js`); it re-exports those entry points. Its Lit templates come from
`../../rapidoc/src/templates/` and its schema renderers from `../../rapidoc/src/components/`.

## Interface

`index.js` exports the public API, named exports only; `index.d.ts` is its typed contract.
`internal.js` (`@rapidoc/prerender/internal`, typed in `internal.d.ts`) holds what other RapiDoc
packages and the tests use beyond it. It is not covered by semver: the parsed model it deals in
follows the parser of `packages/rapidoc` and changes with it.

Public (`index.js`):

- `renderRapiDoc(options)` [render.js:renderRapiDoc]: a whole API as `<rapi-doc>` + DSD, or as a
  scoped light-DOM container (`outputMode`).
- `renderEndpoint(options)` / `renderSchema(options)` [render.js]: one operation, or one schema
  (object or `components.schemas` name), in a container `div`.
- `getSpecNavigation(specInput, options?)` [navigation.js:getSpecNavigation]: the navigation
  model (`tagGroups`, `tags`, `remainingTags`, operations). An operation has exactly the fields of
  `NavigationOperation` [navigation.js:toNavigationOperation], never the parser's object.
- `getNavBarHtml(specInput, options?)` [navigation.js]: sidebar HTML. Options mirror `<rapi-doc>`'s
  sidebar attributes, including `showBadgesInNavBar` (`dot` by default: a dot in the first badge's
  color on items whose operation shows a badge, from `navBadgeDot` of
  `rapidoc/src/utils/common-utils.js`, as `<rapi-doc>` draws it).
- `getNavFilterHtml(options?)` [navigation.js]: the filter box alone.
- `getBundledCss(options?)` [index.js]: the element's CSS; `scope` is its only option.
- Re-exports: `bindNavBar` (browser-side, `../../rapidoc/src/utils/bind-navbar.js`); `getNavCss`,
  `getThemeTokensCss`, `getFlowCss` (`../../rapidoc/src/styles/css-bundle.js`); `toKebabCase`,
  `methodPathSlug`, `operationAnchorSource` (`../../rapidoc/src/utils/slugger.js`);
  `renderArazzoWorkflow` (`../../rapidoc/src/utils/arazzo/index.js`: one Arazzo workflow as an SVG
  string; `getFlowCss` is that diagram's stylesheet, and the page also needs `getThemeTokensCss`).

Internal (`internal.js`):

- `resolveSpecInput(specInput, options?)` [render.js:resolveSpecInput]: object, JSON/YAML text,
  local file path or URL, run through `ProcessSpec`; an already parsed model (one whose
  `securitySchemes` is an array) is returned as-is.
- `renderNavBarHtml(resolvedSpec, options?)` [navigation.js]: the sidebar from a parsed model,
  synchronous. The portal parses each spec once and renders every page's sidebar from it.
- `renderTemplateToString(result, options?)`, `escapeHtml(str)` [serializer.js]: DOM-free
  serializer for Lit `TemplateResult` values.
- `OperationSlugger` (`../../rapidoc/src/utils/slugger.js`): the portal's search index computes
  the sidebar's links with it.

## Options

One reader for every function [options.js:readOptions]:

- Options are camelCase, named as `<rapi-doc>`'s property for the same thing (`usePathInNavBar`,
  `schemaStyle`, `apiKeyName`).
- An option that is also an attribute of `<rapi-doc>` is accepted under the attribute's kebab-case
  name too (`"schema-style"`). An option of this package only (`basePath`, `routingMode`,
  `outputMode`, `includeStyles`, ...) has its camelCase name alone.
- An unknown name throws, with the list of valid names. No aliases and no old names. The one
  exception is `renderRapiDoc`: any name it does not know is taken for an attribute of
  `<rapi-doc>` and written to the element, so a typo there is not caught.
- A name given in both forms throws.
- The spec options (`SPEC_OPTIONS`: `sortTags`, `sortSchemas`, `sortEndpointsBy`,
  `generateMissingTags`, `filterOperations`, `showUnusedTags`, `apiKeyName`, `apiKeyLocation`,
  `apiKeyValue`, `serverUrl`) are accepted wherever a spec is loaded, except by `renderSchema`.

Defaults:

- `renderRapiDoc` renders with `<rapi-doc>`'s own defaults (`layout: "row"`,
  `schemaStyle: "tree"`, `allowAdvancedSearch: true`, ... [render.js:ELEMENT_DEFAULTS]) and, in DSD
  output, writes an attribute only for an option the caller passed. The element then reads the same
  defaults, so what it renders on taking over matches the HTML. No option needs a different value
  for pre-rendering. One known difference: `sortEndpointsBy` is `"none"` here (the spec's order) and
  `"path"` on the element, so pass it to get the same order before and after the element loads.
- `renderEndpoint` and `renderSchema` produce static light-DOM HTML that no element takes over;
  their defaults are their own: `layout: "column"`, `schemaStyle: "table"`, `allowTry: false`.

## Invariants

- No DOM required: `render.js`, `navigation.js` and `serializer.js` do not reference `document`
  or `window`. Templates are serialized by `renderTemplateToString`, not `@lit-labs/ssr`; schemas
  by calling `SchemaTable` / `SchemaTree` `.render()` directly. Only `bindNavBar` needs a browser.
- Errors are thrown, not returned. A spec that cannot be loaded or parsed throws
  `Cannot load the OpenAPI spec <what>: <why>` from every function that takes a spec
  [render.js:resolveSpecInput]: a URL that does not answer, text or a file that is not JSON or
  YAML, a document that is not OpenAPI, and anything the parser reports as `specLoadError`. A
  string that is not a URL (`http://`, `https://`) and not spec text (starts with `{` or `[`, or
  has more than one line) is a local file path: when no such file exists the error is
  `file not found: <path>`, and nothing is fetched. Also thrown: an unknown option name;
  `renderEndpoint` when `path` or `method` is missing or no operation matches; `renderSchema` when
  a name is given without `spec`, the name is not found, or the schema is invalid.
- `renderEndpoint` matches `path` exactly and `method` case-insensitively; the first tag with a
  match wins.
- DSD output (`outputMode` other than `"html"` / `"light"`): only the options the caller passed
  become attributes (kebab-case, booleans as `"true"` / `"false"`); `spec-url` is set when `spec`
  is an `http(s)://` string; an object `spec` is inlined as `<script type="application/json"
  slot="rapidoc-spec">` (with `<` escaped) unless `inlineSpec === false`. Attribute values go
  through `escapeHtml`.
- Anchors match `<rapi-doc>`: each `renderNavBarHtml` / `getSpecNavigation` call uses a fresh
  `OperationSlugger`. An operation's own `elementId` is used as-is; otherwise its id is
  `${tagSlug}--${opSlug}`, or just `opSlug` when the tag slug is empty or `general`
  [navigation.js:renderOperation].
- Links: a closing slash of `basePath` is ignored, so every link has one form
  (`${base}#${id}`, `${base}/${tagSlug}`). In `routingMode: "tag-pages"`, hrefs are
  `${base}/${tagSlug}#${opSlug}` except for an empty or `general` tag slug, which keeps the
  single-page `${base}#${id}` form.
- `@rapidoc/portal` and `../../rapidoc/src/utils/bind-navbar.js` rely on the sidebar's classes and `data-*`
  attributes (`.nav-bar-path`, `data-action`, `data-content-id`, `data-op-slug`,
  `.nav-bar-section-label`, `.tags-as-labels`), the same structure `<rapi-doc>`'s sidebar renders;
  changing them is a breaking change. Every item is a real link (`<a href>`): a tag's row holds the
  link to the tag and a `<button>` that opens and closes it, side by side; the current item's link
  has `aria-current="true"`
  [navigation.js:renderNavBarHtml].
- The serializer drops event (`@x`) and property (`.x`) bindings, emits `unsafeHTML` /
  `unsafeSVG` string values raw, and treats text as escaped (`& < >`) and attribute values via
  `escapeHtml`.

## Side Effects

- Importing patches the global custom-element registry. In Node, `serializer.js` installs a no-op
  `globalThis.customElements` when none exists; `render.js` then wraps `customElements.define`
  (and `CustomElementRegistry.prototype.define` when it exists) to skip names already defined and
  swallow errors, marking it with `__safeDefinePatched`.
- `resolveSpecInput` reads a local file with `node:fs` when running in Node or Bun. URL inputs are
  fetched by `ProcessSpec`, not here; outside Node a path is passed to it as well.
- The serializer calls a directive's function argument (as with Lit `guard`).
- No module-level caches; slugger state is per call.

## Verification

- Run `npm run test:unit` from the repo root; `tests/unit/static-renderer.test.js` covers this
  folder.
- After changes here or in the `packages/rapidoc/src` code it renders, rebuild with
  `npm run build:prerender` from the root (or `npm run build` in `packages/rapidoc-prerender`).
