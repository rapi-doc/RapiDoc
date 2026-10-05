# AGENTS.md — `packages/rapidoc` (Core Library)

## 1. Package Scope & Identity
`packages/rapidoc` contains the core RapiDoc custom elements library. It produces the zero-runtime-dependency web component `<rapi-doc>` as well as companion components `<rapi-doc-mini>`, `<json-schema-viewer>`, and `<oauth-receiver>`.

- **Package Name**: `rapidoc`
- **Output Target**: Standalone ES Module bundle at `dist/rapidoc-min.js`
- **Component Entry**: `src/index.js`
- **Main Element**: `src/rapidoc.js` (`<rapi-doc>`)

---

## 2. Technology Stack & Build Pipeline

- **Framework**: [Lit 3](https://lit.dev/) (`LitElement`, `html`, `css`)
- **Bundler**: [Vite 6](https://vitejs.dev/) in Library Mode (`vite.config.mjs`)
- **Spec Parser**: `@scalar/openapi-parser` for OpenAPI 3.0, OpenAPI 3.1, and Swagger 2.0 dereferencing and parsing
- **Markdown & Highlight**: `marked`, `microlighter`, `github-slugger`
- **Rollup / Vite Plugins**:
  - `@lit-labs/rollup-plugin-minify-html-literals` (template minification)
  - `vite-plugin-banner` (license & version header injection)
  - Custom esbuild transformer (strips `console.*` and `debugger` calls in production)
  - `rollup-plugin-visualizer` (activated via `ANALYZE=true` for bundle treemap)
  - `scripts/capture-build-info.js` (records build size and metadata on bundle completion)
- **Path Aliases**:
  - `~` -> `./src`
  - `~/rapidoc` -> `./src/rapidoc.js`

---

## 3. Local Commands

Run these commands from `packages/rapidoc` (or from the monorepo root using `--workspace=rapidoc`):

| Command | Purpose |
| :--- | :--- |
| `npm run build` | Builds the production bundle to `dist/rapidoc-min.js` |
| `npm run build:size` | Builds with `ANALYZE=true` and generates `dist/stats.html` treemap |
| `npm run lint` | Runs ESLint against `src/**/*.js` |
| `npm run format` | Checks Prettier formatting for `src/**/*.{js,html,css}` |
| `npm run format-fix` | Formats `src/**/*.{js,html,css}` according to `.prettierrc` |
| `npm run analyze` | Runs `lit-analyzer src` for type/template safety |
| `npm test` | Runs Node.js native unit tests (`node --test ../../tests/unit/*.test.js`) |

---

## 4. Key Subsystems & Architecture

```text
packages/rapidoc/src/
├── components/          # Reusable Lit UI components (nav, headers, inputs, buttons)
├── templates/           # Sub-templates (endpoint details, request/response bodies, security)
├── styles/              # Scoped CSS stylesheets and theming tokens
├── utils/
│   ├── spec-parser.js       # Core OpenAPI spec parser & dereferencing pipeline
│   ├── schema-ast.js        # Schema abstract syntax tree for recursive JSON-Schema rendering
│   ├── schema-utils.js      # Type resolver, constraints, and sample generation
│   ├── mock-interceptor.js  # Client-side mock server fetch interceptor
│   └── common-utils.js      # General helpers (slugs, sanitization, copy)
├── rapidoc.js           # Main <rapi-doc> custom element implementation
├── rapidoc-mini.js      # Embedded mini widget (<rapi-doc-mini>)
├── json-schema-viewer.js# Standalone schema viewer component (<json-schema-viewer>)
└── oauth-receiver.js    # OAuth 2 redirect receiver element
```

---

## 5. Coding & Contribution Rules

1. **Zero External Runtime Dependencies**:
   - Consumers should only ever need `<script type="module" src="rapidoc-min.js"></script>`.
   - Never add dependencies that require external polyfills or runtime node modules unless bundled.
2. **Bundle Size Discipline**:
   - Every byte matters. Run `npm run build:size` before adding any library.
   - Prefer native browser APIs or lightweight algorithms over heavy NPM dependencies.
3. **Lit Guidelines**:
   - Use standard Lit properties declaration `static get properties() { return { ... } }`.
   - Ensure clean template rendering with the `html` tag.
   - Do not query the DOM directly when a reactive property or template binding suffices.
   - Isolate styling using Lit's `css` tagged template literals and expose custom CSS properties (`--bg`, `--fg`, etc.) and CSS parts (`::part(...)`).
4. **OpenAPI Spec & Parser Compatibility**:
   - Maintain robust support for both OpenAPI 3.0 and OpenAPI 3.1 specifications.
   - Ensure schema recursion depth is guarded (see `schema-ast.js` recursion limit) to avoid stack overflows on circular references.
   - Run `npm test` after modifying any parser or schema rendering utility.
5. **No Direct `console.log` in Production**:
   - Strip debug logging before finalizing changes; `vite.config.mjs` removes `console` in production bundles, but keeping the source clean avoids unintended warning noise.
