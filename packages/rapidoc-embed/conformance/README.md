# RapiDoc integration contract, version 1

What every RapiDoc integration does, in any language: take the same options, serve the same routes and
send the same HTML. `../src/core.js` is the reference implementation (about 150 lines, no imports); a
port in another language passes when it reproduces every fixture in `fixtures/`.

## Options

| Option    | Default                              | Meaning                                                                                                                                                                                         |
| :-------- | :----------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `path`    | `/docs`                              | Public URL path of the docs page, including any prefix the app is mounted under. A trailing slash is removed; `/` is the site root.                                                             |
| `specUrl` | the framework's own OpenAPI endpoint | Becomes the `spec-url` attribute.                                                                                                                                                               |
| `spec`    | none                                 | The OpenAPI document, written into the page. It wins over `specUrl`, which stays the download link.                                                                                             |
| `title`   | `API Reference`                      | Page title.                                                                                                                                                                                     |
| `assets`  | `bundled`                            | `bundled`: the integration serves the bundle under `path`. `cdn`: the bundle loads from `cdn` in `integration.json`, with its SRI hash. `{ scriptUrl, integrity? }`: a URL the developer gives. |
| `options` | none                                 | Attributes of `<rapi-doc>`, in kebab-case or camelCase.                                                                                                                                         |
| `head`    | none                                 | HTML added at the end of `<head>`, as given.                                                                                                                                                    |
| `css`     | none                                 | CSS added in a `<style>` element, as given.                                                                                                                                                     |
| `lang`    | `en`                                 | `lang` of the page.                                                                                                                                                                             |
| `nonce`   | none                                 | Content-Security-Policy nonce, set on every `<script>` and `<style>` the page has.                                                                                                              |
| `enabled` | `true`                               | When false the integration registers no routes. (Not an input of the render functions.)                                                                                                         |

Use each language's naming style for the option names (`spec_url`, `SpecUrl`), not for the attribute names.

## Routes

| Route                               | Served when           | Content                                                                                     |
| :---------------------------------- | :-------------------- | :------------------------------------------------------------------------------------------ |
| `{path}` (and `{path}/`)            | always                | the host page                                                                               |
| `{path}/oauth-receiver.html`        | always                | the OAuth return page. Same origin as the host page, also when the bundle comes from a CDN. |
| `{path}/rapidoc-min.js`             | `assets` is `bundled` | the file from rapidoc's `dist/`                                                             |
| `{path}/rapidoc-min.js.LICENSE.txt` | `assets` is `bundled` | the third-party notices of the bundle, which must travel with it                            |

Content types are in the `routes-*` fixtures. Take the bundle, its license file and `integration.json`
from one `rapidoc` release and embed them in the integration's package; `integration.json` gives the
version, the CDN base URL and each file's size and SRI hash.

## Rendering rules

1. **Attributes** of `<rapi-doc>`: start with `spec-url` (when `specUrl` is set) and `oauth-receiver`
   (`{path}/oauth-receiver.html`), then apply `options`, which win. Convert camelCase names to kebab-case
   (`allowTry` → `allow-try`) and reject a name that does not match `^[a-z][a-z0-9-]*$`. Leave out null
   values. Write booleans as `true`/`false`, numbers in decimal and objects as compact JSON. Sort by name
   (byte order) and write one attribute per line.
2. **Escaping**: in attribute values and the title, `&`, `<`, `>` and `"` become `&amp;`, `&lt;`, `&gt;`
   and `&quot;`. `head` and `css` are the developer's own markup and are not escaped, except that `</style`
   in `css` becomes `<\/style`.
3. **Inline spec**: compact JSON (no whitespace, keys in input order), then `<`, `>`, `&`, U+2028 and
   U+2029 written as `\u003c`, `\u003e`, `\u0026`, `\u2028` and `\u2029`. Other non-ASCII
   characters are written as they are, not as `\u` escapes (in Python: `ensure_ascii=False`). The same
   holds for an object written as an attribute value.
4. **Layout**: two-space indentation, `\n` line endings, a final newline, and the element order of the
   fixtures. `integrity` is followed by `crossorigin="anonymous"`; `nonce` comes last.

## Fixtures

Each folder of `fixtures/` has an `input.json` (`description`, `page`, `options`) and the expected output:

| `page`           | Function          | Expected                       |
| :--------------- | :---------------- | :----------------------------- |
| `host`           | host page         | `expected.html`, byte for byte |
| `oauth-receiver` | OAuth return page | `expected.html`, byte for byte |
| `routes`         | route table       | `expected.json`, equal as JSON |

`options.manifest`, where present, is the `integration.json` to use for that case. The fixtures are in the
npm package (`@rapidoc/embed/conformance/...`); copy them into the port's tests and update them when the
contract version changes. Language-specific behaviour (error types, how options are declared) is not
covered.

`integrations/rapidoc-python/src/rapidoc/contract.py` in the RapiDoc repository is a complete port
(Python, about 200 lines) that passes every fixture, with `tests/test_conformance.py` as its runner.
