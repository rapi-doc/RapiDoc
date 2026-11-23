# RapiDoc integration contract, version 2

What every RapiDoc integration does, in any language: take the same options, serve the same routes and
send the same HTML. `../src/core.js` is the reference implementation (about 150 lines, no imports); a
port in another language passes when it reproduces every fixture in `fixtures/`.

## Three version numbers

Three numbers are near this contract. They are independent: none follows from another.

| Number                                  | Where                                                                          | What it counts                                                                                                                                                          |
| :-------------------------------------- | :----------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Contract version, now 2                 | `CONTRACT_VERSION` in `src/core.js` (and in each port), the title of this page | This document: the option names, the routes and the HTML the fixtures fix. It changes when the expected output of an existing fixture changes or an option is renamed.  |
| Package version                         | `package.json` of `@rapidoc/embed`, and each port's own package                | The npm package's semver: its JavaScript API, `createResponder`, types. A new contract version is a major of the package, but most package releases change no contract. |
| `contract` in `integration.json`, now 1 | `rapidoc`'s `dist/integration.json`, written by `scripts/rapidoc-metadata.js`  | The format of that file (`version`, `cdn`, `files`). A port reads it to know how to read the file; it says nothing about this contract.                                 |

## Options

| Option    | Default                              | Meaning                                                                                                                                                                                           |
| :-------- | :----------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `uiPath`  | `/docs`                              | URL path of the docs page within the app or mount the integration is registered in (see "Paths"). A trailing slash is removed and a missing leading slash added; `/` is the root.                 |
| `specUrl` | the framework's own OpenAPI endpoint | Becomes the `spec-url` attribute.                                                                                                                                                                 |
| `spec`    | none                                 | The OpenAPI document, written into the page. It wins over `specUrl`, which stays the download link.                                                                                               |
| `title`   | `API Reference`                      | Page title.                                                                                                                                                                                       |
| `assets`  | `bundled`                            | `bundled`: the integration serves the bundle under `uiPath`. `cdn`: the bundle loads from `cdn` in `integration.json`, with its SRI hash. `{ scriptUrl, integrity? }`: a URL the developer gives. |
| `options` | none                                 | Attributes of `<rapi-doc>`, in kebab-case or camelCase.                                                                                                                                           |
| `head`    | none                                 | HTML added at the end of `<head>`, as given.                                                                                                                                                      |
| `css`     | none                                 | CSS added in a `<style>` element, as given.                                                                                                                                                       |
| `lang`    | `en`                                 | `lang` of the page.                                                                                                                                                                               |
| `nonce`   | none                                 | Content-Security-Policy nonce, set on every `<script>` and `<style>` the page has.                                                                                                                |
| `enabled` | `true`                               | When false the integration registers no routes. (Not an input of the render functions.)                                                                                                           |

Use each language's naming style for the option names (`spec_url`, `SpecUrl`), not for the attribute names.
Each option has this one name: a port reads no other name for it.

**Empty values.** An option whose value is null, missing or an empty string is absent, and its default
applies: `lang: ""` is `en`, `assets: ""` is `bundled`, `title: ""` is `API Reference`, `uiPath: ""` is
`/docs` (the root is `/`), and an empty `specUrl`, `spec`, `head`, `css` or `nonce` writes nothing. The same
holds for `integrity` inside `assets`. It does not hold inside `options`: an attribute of `<rapi-doc>` with
an empty string is written (`heading-text=""`), and only null leaves it out.

## Paths

`uiPath` has one meaning for the user of an integration and one for the render functions:

- **An integration takes `uiPath` as the path within the app or mount it is registered in**, and registers
  the routes below there. Mounted under a prefix (an Express router at `/api`, a Fastify plugin with
  `prefix: "/api"`, a Hono app with `basePath("/api")`, an ASGI app with a `root_path`, an ASP.NET Core
  route group or `PathBase`), the page is at `/api/docs` with `uiPath` still `/docs`.
- **The render functions take the public path**, the one the browser requests, because they write it into
  the page (the bundle's URL, the `oauth-receiver` attribute). Before it renders, the integration puts the
  mount's prefix in front of the normalized `uiPath`. The fixtures call the render functions, so their
  `uiPath` is a public path.

A proxy in front of the app that strips a prefix the app cannot see is the one case the integration cannot
work out. Offer an option for it, named `publicUiPath`, that holds the page's whole public path and
replaces prefix and `uiPath` in the pages.

## Routes

| Route                                 | Served when           | Content                                                                                     |
| :------------------------------------ | :-------------------- | :------------------------------------------------------------------------------------------ |
| `{uiPath}` (and `{uiPath}/`)          | always                | the host page                                                                               |
| `{uiPath}/oauth-receiver.html`        | always                | the OAuth return page. Same origin as the host page, also when the bundle comes from a CDN. |
| `{uiPath}/rapidoc-min.js`             | `assets` is `bundled` | the file from rapidoc's `dist/`                                                             |
| `{uiPath}/rapidoc-min.js.LICENSE.txt` | `assets` is `bundled` | the third-party notices of the bundle, which must travel with it                            |

`{uiPath}` is the path within the mount; the route table of a fixture is for an integration at the top of
its app. Content types are in the `routes-*` fixtures. Take the bundle, its license file and `integration.json`
from one `rapidoc` release and embed them in the integration's package; `integration.json` gives the
version, the CDN base URL and each file's size and SRI hash.

**Caching.** The pages change with the options, so send them with `cache-control: no-cache`. The two
bundle files keep their URL from one RapiDoc release to the next, so send them with `cache-control: no-cache`
too and an `ETag` (the file's `integrity` from `integration.json`, in double quotes), and answer `304` when
the request's `If-None-Match` names that tag. `If-None-Match` may hold a list separated by commas, and a tag
may be weak (`W/"..."`): compare without the `W/`. The browser then asks on every visit and downloads the
bundle only after a deploy changed it. Send `x-content-type-options: nosniff` with every response.

## Rendering rules

1. **Attributes** of `<rapi-doc>`: start with `spec-url` (when `specUrl` is set) and `oauth-receiver`
   (`{uiPath}/oauth-receiver.html`), then apply `options`, which win. Convert camelCase names to kebab-case
   (`allowTry` → `allow-try`) and reject a name that is not, as a whole, `[a-z][a-z0-9-]*` (use a full
   match: in some languages `$` also matches before a final newline). Leave out null values. Write booleans
   as `true`/`false`, numbers in decimal with no fraction on a whole number (`2.0` is `2`, `1.5` is `1.5`)
   and objects as compact JSON. Sort by name (byte order) and write one attribute per line.
2. **Escaping**: in attribute values and the title, `&`, `<`, `>` and `"` become `&amp;`, `&lt;`, `&gt;`
   and `&quot;`. `head` and `css` are the developer's own markup and are not escaped, except that `</style`
   in `css` becomes `<\/style`. Non-ASCII characters are written as they are, in UTF-8.
3. **Inline spec**: compact JSON on one line (no whitespace between tokens), then `<`, `>`, `&`, U+2028 and
   U+2029 written as `\u003c`, `\u003e`, `\u0026`, `\u2028` and `\u2029`. Other non-ASCII
   characters are written as they are, not as `\u` escapes (in Python: `ensure_ascii=False`). The same
   holds for an object written as an attribute value. The order of an object's keys and the spelling of a
   number are the JSON writer's own and are not part of the contract: JavaScript writes integer-like keys
   first (`200`, `404`, `default`) and `1.0` as `1`, Python keeps the input order and writes `1.0`. Both
   are the same document to `<rapi-doc>`. (An attribute value is compared byte for byte, so the fixtures
   give an object there only string keys that no writer reorders.)
4. **Layout**: two-space indentation, `\n` line endings, a final newline, and the element order of the
   fixtures. `integrity` is followed by `crossorigin="anonymous"`; `nonce` comes last.

## Fixtures

Each folder of `fixtures/` has an `input.json` (`description`, `page`, `options`) and the expected output:

| `page`           | Function          | Expected                           |
| :--------------- | :---------------- | :--------------------------------- |
| `host`           | host page         | `expected.html`, compared as below |
| `oauth-receiver` | OAuth return page | `expected.html`, byte for byte     |
| `routes`         | route table       | `expected.json`, equal as JSON     |

**Comparing a host page.** The page's HTML is compared byte for byte, except the inline spec, which is
compared as parsed JSON. In the runner: cut the text between
`<script type="application/json" slot="rapidoc-spec">` and the next `</script>` out of both the output and
`expected.html`, compare what is left byte for byte, then parse the two cut texts as JSON and compare the
values (objects without regard to key order, numbers by value). Also check that the output's inline spec
holds none of `<`, `>`, `&`, U+2028, U+2029 or a line break. A page without an inline spec is compared
whole. `tests/conformance.test.js` of this package, `tests/test_conformance.py` of the Python port and
`ConformanceTests.cs` of the C# port all do exactly this.

`options.manifest`, where present, is the `integration.json` to use for that case. The fixtures are in the
npm package (`@rapidoc/embed/conformance/...`); copy them into the port's tests and update them when the
contract version changes. Language-specific behaviour (error types, how options are declared) is not
covered.

`integrations/rapidoc-python/src/rapidoc/contract.py` in the RapiDoc repository is a complete port
(Python, about 200 lines) that passes every fixture, with `tests/test_conformance.py` as its runner;
`integrations/rapidoc-dotnet/src/RapiDoc.AspNetCore/RapiDocContract.cs` is the same in C#.
