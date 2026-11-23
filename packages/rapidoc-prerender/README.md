# @rapidoc/prerender

Renders RapiDoc API documentation to HTML at build time, in Node, Bun or any framework's build (Astro, Next.js, Nuxt, 11ty, VitePress):

- **`renderRapiDoc({ spec, ...options })`**: a pre-rendered `<rapi-doc>`, as Declarative Shadow DOM (the element hydrates over it) or as plain light-DOM HTML. Also `renderEndpoint` and `renderSchema` for single pieces.
- **`getNavBarHtml(spec, options)`**, **`getNavCss()`**, **`getThemeTokensCss()`**: a static sidebar to place beside a headless `<rapi-doc>`, as `@rapidoc/portal` does.
- **`renderArazzoWorkflow(arazzo, options)`** and **`getFlowCss()`**: an Arazzo workflow as an SVG diagram.
- **`methodPathSlug`**, **`operationAnchorSource`**, **`toKebabCase`**: the anchors `<rapi-doc>` uses, for links into it.

It renders the same templates as the `rapidoc` web component, so the HTML matches what the element shows.

## Use

```bash
npm install @rapidoc/prerender
```

```javascript
import { renderRapiDoc } from "@rapidoc/prerender";

const html = await renderRapiDoc({ spec: "./openapi.yaml", outputMode: "dsd" });
```

Options are camelCase, named as `<rapi-doc>`'s properties (the attribute's kebab-case name works too); an unknown option name throws, and so does a spec that cannot be loaded. `@rapidoc/prerender/internal` is for the other RapiDoc packages and is not covered by semver.

Load `rapidoc` in the page for the interactive element. Types are in `src/index.d.ts`. The guide: [rapidocui.com/docs/prerender/](https://rapidocui.com/docs/prerender/).

## Development

The renderer is in `src/` (its contract: `src/README.md`); the templates, components and styles it renders are in `packages/rapidoc/src`. `npm run build` bundles both into `dist/index.js`, with the third-party packages left external.
