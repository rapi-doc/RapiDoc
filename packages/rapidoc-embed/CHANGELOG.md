# @rapidoc/embed

## 0.1.0

### Minor Changes

- 5a1e064: `rapidoc` now publishes metadata for tools and integrations in `dist/`: TypeScript types (`rapidoc`, `rapidoc/react`, `rapidoc/vue`), a JSON Schema of every attribute (`rapidoc/options.schema.json`), a Custom Elements Manifest, `oauth-receiver.html`, and `integration.json` with the SRI hash of each file. New package `@rapidoc/embed`: the shared core for RapiDoc plugins (frameworks, docs sites, tools), which renders the standard host page for `<rapi-doc>` and comes with conformance fixtures for ports in other languages.

### Patch Changes

- Updated dependencies [5a1e064]
  - rapidoc@12.2.0
