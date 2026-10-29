# RapiDoc Automated Test Suites

This directory contains the automated test suites, fixtures, benchmarks, and regression harnesses for RapiDoc.

---

## 1. Directory Structure

```
tests/
├── fixtures/
│   ├── html/
│   │   └── test-harness.html          # Standalone lightweight HTML runner hosting <rapi-doc>
│   └── specs/                         # 8 Modular domain OpenAPI 3.1 specifications
│       ├── 01-sections.yaml           # Sections, tags, layouts, and client-side routing
│       ├── 02-datatypes.yaml          # Primitives, constraints, deprecation & markdown tables
│       ├── 03-schemas.yaml            # Schema trees/tables, deep nesting & embedded tables
│       ├── 04-request-response.yaml   # Multipart/form-data, status tabs & headers
│       ├── 05-auth.yaml               # API keys, Bearer JWT, OAuth2 flows & security modal
│       ├── 06-examples.yaml           # Parameter examples & fill-request-fields-with-example
│       ├── 07-mock-try.yaml           # Try console, show-curl-before-try & mock endpoints
│       └── 08-oneof-polymorphism.yaml # Discriminators, oneOf variant pills & allOf inheritance
├── unit/                              # Unit tests for core parsers, AST, and utilities (*.test.js)
├── component/                         # Lit component tests (<api-request>, markdown links)
├── e2e/                               # Tier 1 Functional Shadow DOM E2E test suites
│   ├── sections-routing.test.js       # Layouts, nav visibility, sort-tags & route hash updates
│   ├── dynamic-attributes.test.js     # Runtime attribute reactivity (theme, render-style, layout)
│   ├── datatypes-constraints.test.js  # Constraints chips, deprecations & table parsing
│   ├── schemas.test.js                # Tree vs Table views, property descriptions & deprecations
│   ├── request-response.test.js       # Multipart uploads, status code tabs & response headers
│   ├── auth.test.js                   # Security schemes, modal and nav authentication visibility
│   ├── examples-try.test.js           # Example pre-population, cURL previews & try execution
│   └── polymorphism.test.js           # Variant selector tabs & allOf composition merging
├── visual/                            # Tier 2 Visual Regression Suite
│   ├── visual-regression.test.js      # Approach A (element capture) & Approach B (unclipped flow)
│   └── snapshots/                     # Golden baseline snapshots
├── perf/                              # Spec parsing & rendering benchmarks (Puppeteer / Playwright)
└── helpers/
    └── test-harness.js                # Test HTTP server, headless browser launcher & shadow helpers
```

---

## 2. Test Commands

Run the test suites from the repository root:

| Command                  | Scope     | Description                                                         |
| :----------------------- | :-------- | :------------------------------------------------------------------ |
| `npm run test:unit`      | Monorepo  | Runs Node.js native unit tests in `tests/unit/*.test.js`            |
| `npm run test:component` | Component | Runs Lit component tests in `tests/component/*.test.js`             |
| `npm run test:e2e`       | E2E       | Runs Tier 1 functional Shadow DOM tests across all 8 domain specs   |
| `npm run test:visual`    | Visual    | Runs Tier 2 visual regression snapshots and unclipped flow captures |
| `npm run test:all`       | All       | Executes unit, component, E2E, and visual tests sequentially        |
| `npm run test:parser`    | Benchmark | Measures spec parsing and circular reference resolution times       |
| `npm run test:perf`      | Benchmark | Measures headless browser rendering performance across modes        |
