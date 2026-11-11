---
"@rapidoc/embed": minor
"@rapidoc/hono": patch
---

`@rapidoc/embed` adds `createResponder(options, { readAsset })`: it matches a request against the routes and returns the status, headers and body, so a server integration only passes the request in and the response out. `@rapidoc/hono` now runs on it, with no change in behaviour.
