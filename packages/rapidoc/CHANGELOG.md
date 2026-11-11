# rapidoc

## 12.2.1

### Patch Changes

- e5cd554: `<rapi-doc-mini>` and `<rapi-flow>` are now in the published types and the Custom Elements Manifest: `RapiDocMiniElement` and `RapiDocMiniAttributes` from `rapidoc`, `RapiFlowElement` and `RapiFlowAttributes` from `rapidoc/flow`, and both elements in `rapidoc/react` and `rapidoc/vue`.

## 12.2.0

### Minor Changes

- 5a1e064: `rapidoc` now publishes metadata for tools and integrations in `dist/`: TypeScript types (`rapidoc`, `rapidoc/react`, `rapidoc/vue`), a JSON Schema of every attribute (`rapidoc/options.schema.json`), a Custom Elements Manifest, `oauth-receiver.html`, and `integration.json` with the SRI hash of each file. New package `@rapidoc/embed`: the shared core for RapiDoc plugins (frameworks, docs sites, tools), which renders the standard host page for `<rapi-doc>` and comes with conformance fixtures for ports in other languages.

## 12.1.2

### Patch Changes

- 7f698d8: After `loadSpec()`, the Download / View OpenAPI spec buttons and the header's spec URL box point at the spec just loaded, not the `spec-url` attribute. A spec loaded as an object hides the spec download buttons, and a `match-paths` change re-filters the spec loaded last instead of reloading `spec-url`.
- 5931b08: Try It sends object query parameters as their `style` and `explode` say: `pageNo=1&pageSize=20` for the default exploded `form`, `request=pageNo,1,pageSize,20` with `explode: false`, and `request[pageNo]=1` only for `style: deepObject` (before, every object was sent with brackets).
- 11e945c: `persist-auth="true"` keeps an OAuth access token across page reloads, until it expires (`expires_in`). Only the token is stored, never the client secret or Basic credentials.
- 2ddb480: With `default-schema-tab="schema"`, the tabs of request bodies, responses and object parameters read SCHEMA | EXAMPLE, the default tab first. Object parameters now also open on the `default-schema-tab` tab (before, they always opened on SCHEMA).
- 6283526: Parameters, form fields and schema trees and tables label a type the same way. A format that implies its type is shown in its place (`int64`, `date-time`). Any other format (`string` with `format: decimal`) keeps the type and is shown as **Format: decimal**. Types are colored by their declared type, so a string is never colored like a number.
- 0095bb9: Try It sends `application/x-www-form-urlencoded` bodies as the media type's `encoding` says, with the OpenAPI default (`style: form`, `explode: true`) when it says nothing: an array repeats its name (`tag=a&tag=b`, before `tag=a,b`), an object sends one field per property (`a=1`, before JSON), `explode: false` and the delimited and `deepObject` styles are followed, and `contentType: application/json` sends the field as JSON.

## 12.1.1

### Patch Changes

- 691aeff: Schemas with `allOf` show every field once: the schema's own `properties` and `required` next to `allOf` are no longer dropped (#1168), a property defined in several members is one row with the merged definition (#1169), and `allOf` wrapping a single composed schema keeps its fields (#1170).
- 9deb938: In the sidebar, a click on a tag's name goes to the tag and its description, and a click on its arrow expands or collapses it (#1166).
