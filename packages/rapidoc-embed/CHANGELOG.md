# @rapidoc/embed

## 0.2.0

### Minor Changes

- 4aaf108: `@rapidoc/embed` adds `createResponder(options, { readAsset })`: it matches a request against the routes and returns the status, headers and body, so a server integration only passes the request in and the response out. `@rapidoc/hono` now runs on it, with no change in behaviour.

### Patch Changes

- Updated dependencies [e5cd554]
  - rapidoc@12.2.1

## 0.1.0

### Minor Changes

- 5a1e064: `rapidoc` now publishes metadata for tools and integrations in `dist/`: TypeScript types (`rapidoc`, `rapidoc/react`, `rapidoc/vue`), a JSON Schema of every attribute (`rapidoc/options.schema.json`), a Custom Elements Manifest, `oauth-receiver.html`, and `integration.json` with the SRI hash of each file. New package `@rapidoc/embed`: the shared core for RapiDoc plugins (frameworks, docs sites, tools), which renders the standard host page for `<rapi-doc>` and comes with conformance fixtures for ports in other languages.

### Patch Changes

- Updated dependencies [5a1e064]
  - rapidoc@12.2.0
