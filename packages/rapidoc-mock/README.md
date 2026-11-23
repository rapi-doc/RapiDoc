# @rapidoc/mock

A mock server for the APIs of a RapiDoc portal. It is what `rapidoc mock` runs.

- Every local spec under `apis:` in `rapidoc.config.yaml` on one port (default `4010`), each under `/<api id>`: list `http://localhost:4010/<api id>` as a server in the spec and the portal's Try calls the mock. No portal? Point it at a folder of specs or at spec files.
- Responses from the spec's examples first, then data generated from the schemas (patterns, formats, enums, ranges), the same on every run for a given seed.
- OpenAPI 3.0, 3.1 and 3.2: 3.2's `QUERY` and `additionalOperations` methods (`PURGE`, `COPY`, ...) are served, validated and allowed by CORS; a method Node's HTTP server can't receive gets a warning at start. A 3.2 stream (`itemSchema` on Server-Sent Events, JSON Lines or `application/json-seq`) is sent one item at a time, `--stream-interval` apart: the example's items, else five generated items with `id` numbered.
- Requests are validated against the spec: parameters and JSON, form and multipart bodies, and JSON Lines bodies line by line against their `itemSchema`. A bad request gets `400` with the list of problems.
- Each operation's `security` is enforced with real token checks, so you can show who may call what:
  - **OAuth2 / OpenID Connect / HTTP bearer:** the token must be a JWT signed by your issuer (its JWKS), unexpired and for your audience, else `401`. It must grant the operation's scopes in its `scope`, `scp` or `permissions` claim (Auth0 RBAC), else `403` with `WWW-Authenticate: Bearer error="insufficient_scope"`.
  - A bearer requirement without scopes (`- bearerAuth: []` next to `- oauth2: ['orders:write']`) needs the operation's OAuth scopes: they name the permission the operation needs, whichever scheme carries the token.
  - **API key:** the header, query parameter or cookie must be present. **Basic:** credentials must be present.
  - `security: []` (or none): open.
  - A requirement that names a scheme the spec does not define can't be met: the operation answers `401` unless another requirement is met, and the mock names the scheme when it starts.
  - Not checked: `mutualTLS`, HTTP schemes other than `basic` and `bearer`, and the expiry of a token without `exp`.
- CORS for any origin by default (tokens travel in the `Authorization` header, never in cookies).

## Use

```bash
npm install -D @rapidoc/cli @rapidoc/portal @rapidoc/mock
npx rapidoc mock --issuer https://example.us.auth0.com/ --audience https://api.example.com
```

| Command                                           | Mocks                                                                                  | Ids                                                                  |
| :------------------------------------------------ | :------------------------------------------------------------------------------------- | :------------------------------------------------------------------- |
| `rapidoc mock [dir]` with a `rapidoc.config.yaml` | The local specs under `apis:` (remote ones are skipped)                                | Each API's `id`                                                      |
| `rapidoc mock [dir]` without one                  | Every OpenAPI file in the folder (up to 3 levels deep; `node_modules`, `dist` skipped) | File name without extension: `specs/orders-api.yaml` → `/orders-api` |
| `rapidoc mock a.yaml b.json …`                    | Those files                                                                            | Same as above                                                        |

Ids are lower-case letters, digits and dashes. Files that would share an id get their parent folders in front until they differ: `billing-v1/openapi.yaml` and `billing-v2/openapi.yaml` → `/billing-v1-openapi`, `/billing-v2-openapi`. The mapping is printed at start. Only a portal folder needs `@rapidoc/portal` (Astro); folders of specs and spec files need just the CLI and this package.

| Option                   | Variable                | Meaning                                                                                                                |
| :----------------------- | :---------------------- | :--------------------------------------------------------------------------------------------------------------------- |
| `--issuer <url>`         | `RAPIDOC_MOCK_ISSUER`   | OpenID Connect issuer whose access tokens are accepted. Without it, any bearer token passes and scopes aren't checked. |
| `--audience <id>`        | `RAPIDOC_MOCK_AUDIENCE` | `aud` the tokens must have (the API identifier at your provider).                                                      |
| `--port <number>`        |                         | Default `4010`.                                                                                                        |
| `--host <host>`          |                         | Default `localhost`. `0.0.0.0` opens the mock and its control API to your network (a container, a shared test server). |
| `--seed <number>`        |                         | Seed for generated data; default `1`.                                                                                  |
| `--mock-config <file>`   |                         | With `--stateful`: corrections to what the mock worked out; default `mock.config.yaml` beside the spec.                |
| `--delay <ms>`           |                         | Wait this long before every API response; default `0`.                                                                 |
| `--stream-interval <ms>` |                         | Gap between the items of a streamed response (OpenAPI 3.2 `itemSchema`); default `300`.                                |
| `--stateful`             |                         | Keep state (below).                                                                                                    |
| `--rows <number>`        |                         | With `--stateful`: seed records per resource; default `10`.                                                            |

The mock refuses to start when the issuer can't be discovered. A spec it can't load is skipped with the reason; the others are served.

### Choosing a response

| Request header          | Effect                                                                                       |
| :---------------------- | :------------------------------------------------------------------------------------------- |
| `Prefer: code=404`      | The documented `404` response (else `4XX`, else `default`). An undocumented code is ignored. |
| `Prefer: example=empty` | The media type's example named `empty`.                                                      |
| `Prefer: dynamic=true`  | Data generated from the schema even when there is an example.                                |

Applied preferences come back in `Preference-Applied`. `GET /` lists the APIs served.

### Keeping state

`rapidoc mock --stateful` keeps data, like the real server would. It works out the resources, their keys and their links from the spec (`/pets` and `/pets/{petId}` sharing a schema are one resource), seeds each with 10 records (`--rows`) whose references point at records that exist, and then:

- A create stores a record; an update or delete changes it; reads and lists return what is stored. Lists apply the query parameters that match a field, and `limit`, `offset` and `page`.
- A record created under a parent (`/articles/{slug}/comments`) is listed and found under that parent only, whether or not it has a field for it.
- A record goes where the response schema puts it (inside `data` next to a `request_id`, say).
- An operation that fits no resource (a login, a search) answers as without `--stateful`. The start-up output counts the operations in each group.
- An `X-Mock-Session` header gives a caller its own copy of the data, so parallel tests don't see each other's changes. The mock keeps 1000 sessions per API; one more, and the session used longest ago reads the seed data again.
- `Prefer: code=` and `Prefer: example=` return that response as written; nothing is stored.

`/__mock/ui` is the Mock UI: a dashboard per API, its resources with their records, every operation with its label (stateful, needs review, static) grouped by path or by resource, and a settings page (new seed data, response delay). A resource's About tab lists its fields with how each is seeded, and an operation's Details page says what the mock does for it. `GET /__mock/model` (and `/model/<api>/resources/<Resource>`, `/model/<api>/operations/<id>`) and `GET /__mock/settings` return what it shows as JSON; `PATCH /__mock/settings` with `{ "delay": 250 }` changes the delay, and `POST /__mock/reset` with `{ "rows": 25, "seed": 7 }` makes new seed data.

The mock's own endpoints are under `/__mock`: `GET /__mock/health` (ready check), `POST /__mock/reset` (back to the seed data; `?api=<id>` for one API), `GET /__mock/state[/<api>[/<Resource>[/<key>]]]` (the stored records), `POST /__mock/snapshot` and `POST /__mock/restore` (the records as one document, `{ "<api id>": { "<Resource>": [records] } }`, out and back in). With an `X-Mock-Session` header they work on that session's data. An API can't have the id `__mock`.

Where the spec doesn't show the data model the way the mock reads it, state it in `mock.config.yaml` beside the spec: `resources.<Name>.key` (a dotted path such as `metadata.name` reaches inside the record) and `operations.<id>` with `resource`, `action` and `key` (`path.x`, `query.x` or `body.x`), or `action: none`. With several APIs, under `apis.<api id>`; `version: 1` at the top names the format (optional). An entry that no longer fits the spec is skipped and named at start. As a library: `stateful: { config }`, the parsed object.

Data is in memory and starts fresh on every run; the same spec and `--seed` give the same records. As a library: `createMockApp({ apis, stateful: true })` or `stateful: { rows: 25 }`.

## Use as a library

```js
import { createMockApp, startMockServer } from '@rapidoc/mock';

const { app } = await createMockApp({
  apis: [{ id: 'orders', fullPath: '/abs/path/orders.yaml' }],
  issuer: 'https://example.us.auth0.com/',
  audience: 'https://api.example.com',
});
// app is a Hono app: app.fetch(request), or mount it in your own server.
```

`createMockApp(options)` returns `{ app, apis, skipped }`: `apis` is what is served (`{ id, title, operations }` each, with `stateful: { resources, confident, needsReview, plainMock, review }` in the stateful mode) and `skipped` the APIs whose spec could not be loaded (`{ id, error }`).

`startMockServer({ apis, port, host, issuer, audience, seed, stateful, delay, streamInterval, origin })` starts it on Node and returns `{ url, port, apis, skipped, close }`.

These two functions and `DEFAULT_PORT` (`4010`) are the package's public API, covered by semver. `@rapidoc/mock/internal` is what `rapidoc lint` takes from the mock (`exampleError`, `configFor`, `statefulFindings`, `statefulReport`). It is not public API and not covered by semver: it can change or go in any release, and only `@rapidoc/cli` of the same version should import it.

## Built on

[openapi-backend](https://github.com/openapistack/openapi-backend) (routing, request validation) and [json-schema-faker](https://github.com/json-schema-faker/json-schema-faker) (data), each behind one file in `src/engine/`.

---

Part of the [RapiDoc family](https://rapidocui.com) of open-source tools for OpenAPI and Arazzo: [RapiDoc](https://rapidocui.com/rapidoc/) (`<rapi-doc>`), [RapiFlow](https://flow.rapidocui.com/), [RapiDoc Portal](https://portal.rapidocui.com/), [RapiMock](https://mock.rapidocui.com/), [RapiPdf](https://rapidocui.com/rapipdf/), the [RapiDoc CLI](https://rapidocui.com/cli/) and [integrations](https://rapidocui.com/integrations/) for Express, Fastify, Hono, FastAPI, ASP.NET Core, Go, Starlight, VitePress and Docusaurus.
