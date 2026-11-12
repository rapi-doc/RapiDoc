# @rapidoc/prerender

## 0.1.7

### Patch Changes

- 53ac5d2: Links and clickable values follow one style. Links in descriptions use the theme's accent instead of blue, with a quiet underline that turns solid on hover and focus; other links (contact, license, external docs) are underlined on hover. Allowed values and examples that fill a parameter are compact accent links with a dotted underline, and plain text when Try is off. A new `--primary-text` token (`--primary-text-dark`, `--primary-text-light`) is the accent as readable text, computed for every theme and for a hex `primary-color`. In the portal, links in guides keep an underline, but a quiet one that turns solid on hover.

## 0.1.6

No changes in this release.

## 0.1.5

### Patch Changes

- 5931b08: Try It sends object query parameters as their `style` and `explode` say: `pageNo=1&pageSize=20` for the default exploded `form`, `request=pageNo,1,pageSize,20` with `explode: false`, and `request[pageNo]=1` only for `style: deepObject` (before, every object was sent with brackets).
- 11e945c: `persist-auth="true"` keeps an OAuth access token across page reloads, until it expires (`expires_in`). Only the token is stored, never the client secret or Basic credentials.
- 2ddb480: With `default-schema-tab="schema"`, the tabs of request bodies, responses and object parameters read SCHEMA | EXAMPLE, the default tab first. Object parameters now also open on the `default-schema-tab` tab (before, they always opened on SCHEMA).
- 6283526: Parameters, form fields and schema trees and tables label a type the same way. A format that implies its type is shown in its place (`int64`, `date-time`). Any other format (`string` with `format: decimal`) keeps the type and is shown as **Format: decimal**. Types are colored by their declared type, so a string is never colored like a number.
- 0095bb9: Try It sends `application/x-www-form-urlencoded` bodies as the media type's `encoding` says, with the OpenAPI default (`style: form`, `explode: true`) when it says nothing: an array repeats its name (`tag=a&tag=b`, before `tag=a,b`), an object sends one field per property (`a=1`, before JSON), `explode: false` and the delimited and `deepObject` styles are followed, and `contentType: application/json` sends the field as JSON.

## 0.1.4

No changes in this release.

## 0.1.3

### Patch Changes

- 691aeff: Schemas with `allOf` show every field once: the schema's own `properties` and `required` next to `allOf` are no longer dropped (#1168), a property defined in several members is one row with the merged definition (#1169), and `allOf` wrapping a single composed schema keeps its fields (#1170).
- 9deb938: In the sidebar, a click on a tag's name goes to the tag and its description, and a click on its arrow expands or collapses it (#1166).

## 0.1.2

No changes in this release.
