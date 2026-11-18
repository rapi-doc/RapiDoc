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
| `--host <host>`          |                         | Default `0.0.0.0`.                                                                                                     |
| `--seed <number>`        |                         | Seed for generated data; default `1`.                                                                                  |
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
- An `X-Mock-Session` header gives a caller its own copy of the data, so parallel tests don't see each other's changes.
- `Prefer: code=` and `Prefer: example=` return that response as written; nothing is stored.

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

`startMockServer({ apis, port, host, issuer, audience, seed, streamInterval, origin })` starts it on Node and returns `{ url, port, apis, skipped, close }`.

## Built on

[openapi-backend](https://github.com/openapistack/openapi-backend) (routing, request validation) and [json-schema-faker](https://github.com/json-schema-faker/json-schema-faker) (data), each behind one file in `src/engine/`.
