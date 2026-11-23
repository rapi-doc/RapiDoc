# @rapidoc/server

Serves a built RapiDoc portal with sign-in and access rules. It is what `rapidoc serve` runs.

- Sign-in through any OpenID Connect provider: Okta, Microsoft Entra ID, Google Workspace, Keycloak, Authentik, Zitadel, Auth0, Ping, AWS Cognito. SAML-only providers work through an OIDC broker (Keycloak, Authentik, Zitadel, Ory Polis).
- Access rules from `rapidoc.config.yaml` (`access:`) are enforced on every page, spec, file and search result.
- Stateless: the session is an encrypted cookie, so any number of instances can run behind a load balancer. No database.
- Doesn't need Astro or `@rapidoc/portal` at runtime: a production image is Node, the CLI, this package and the build.

## Use

```bash
npm install -D @rapidoc/cli @rapidoc/portal @rapidoc/server
npx rapidoc build
RAPIDOC_SESSION_SECRET=… RAPIDOC_AUTH_CLIENT_SECRET=… RAPIDOC_PUBLIC_URL=https://developers.example.com \
  npx rapidoc serve dist --port 8080
```

Configure `auth` and `access` in `rapidoc.config.yaml` (see the `@rapidoc/portal` README, "Sign-in and access rules"). At the provider, create a web application with the redirect URL `<RAPIDOC_PUBLIC_URL>/_rapidoc/auth/callback` (for a portal served under a path, `<site.url>/_rapidoc/auth/callback`, e.g. `https://acme.com/developers/_rapidoc/auth/callback`).

| Variable                                                                 | Required                              | Meaning                                                                                                                                                                   |
| :----------------------------------------------------------------------- | :------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `RAPIDOC_SESSION_SECRET`                                                 | with `auth`                           | Encrypts the session cookie; 32+ characters; the same on every instance. Changing it signs everyone out.                                                                  |
| `RAPIDOC_AUTH_CLIENT_SECRET`                                             | confidential clients                  | Leave unset for a public client (PKCE only).                                                                                                                              |
| `RAPIDOC_AUTH_ISSUER`, `RAPIDOC_AUTH_CLIENT_ID`, `RAPIDOC_AUTH_AUDIENCE` | no                                    | Override `auth.issuer` / `auth.clientId` / `auth.audience`, so one build can run against different providers.                                                             |
| `RAPIDOC_PUBLIC_URL`                                                     | with `auth`, unless `site.url` is set | External URL: the redirect URL and whether cookies are `Secure`. Default `site.url`. With sign-in and neither, only requests to `localhost` are answered.                 |
| `RAPIDOC_FRAME_ANCESTORS`                                                | no                                    | Sites that may frame the portal (CSP `frame-ancestors` sources, or `*` for any). Default `'self'` with sign-in, any site without.                                         |
| `RAPIDOC_MOUNT_PATH`                                                     | no                                    | Path requests arrive under, when a proxy strips part of the portal's path (`--mount-path` wins). Default: the path of `site.url`. Links and redirects keep the full path. |
| `RAPIDOC_MCP`                                                            | no                                    | `off` serves no `/mcp` and no agent tokens, and the user menu hides its agent section. Default `on`; any other value stops the server.                                    |
| `MCP_AUTH_<SCHEME>`                                                      | no                                    | API keys for `/mcp` tool calls: `<SCHEME>` is the security scheme id in UPPER_SNAKE (`_USERNAME` and `_PASSWORD` added for HTTP Basic). See MCP below.                    |
| `MCP_BASE_URL_<API ID>`                                                  | no                                    | An API's base URL for `/mcp` tool calls, instead of its spec's server (`MCP_BASE_URL` when the portal has one API). Needed when the spec names no absolute server.        |
| `MCP_EXTERNAL_HOSTS`                                                     | no                                    | Hosts, comma-separated (`*` for any), that a workflow step's `x-operation` URL computed at run time may call from `/mcp`, besides those the workflow names.               |
| `PORT`, `HOST`                                                           | no                                    | Default `8080`, `0.0.0.0` (`--port`, `--host` win).                                                                                                                       |

The server refuses to start, with the reason, when a required value is missing or the sign-in settings are wrong: the issuer answers with a 4xx status, or its discovery document is another issuer's.

A provider that is down does not stop the portal. When the provider can't be reached at start-up (no connection, a timeout, a 5xx answer), the server logs it and starts: public pages are served, and protected pages still send readers to sign-in. The server asks the provider again when a reader signs in, at most once every 5 seconds at first and once a minute after repeated failures. Until the provider answers, sign-in ends on the sign-in error page. Readers who are already signed in keep their session.

A build without sign-in is served as plain static files.

### Docker

```dockerfile
FROM node:22-alpine AS build
WORKDIR /portal
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx rapidoc build

FROM node:22-alpine
WORKDIR /portal
COPY package*.json ./
RUN npm ci --omit=dev && npm install --no-save @rapidoc/cli @rapidoc/server
COPY --from=build /portal/dist ./dist
ENV PORT=8080
EXPOSE 8080
CMD ["npx", "rapidoc", "serve", "dist"]
```

Health check for load balancers and Kubernetes: `GET /_rapidoc/health`.

## What readers get

| Request              | May see the zone                                            | Signed out                | Signed in, not allowed    |
| :------------------- | :---------------------------------------------------------- | :------------------------ | :------------------------ |
| Page                 | 200                                                         | 302 to sign-in, then back | 403, "access denied" page |
| Spec or other file   | 200                                                         | 401                       | 403                       |
| `/search-index.json` | public + allowed zones                                      | public                    | public + allowed zones    |
| Unknown path         | 404 when the reader may see `access.default`, else as above |                           |                           |

`POST /_rapidoc/access/check` follows the last row: for a reader who may not see `access.default`, a path with no file is reported as locked, like a protected one, so the answer does not say which paths exist.

Responses that depend on the session are `Cache-Control: private, no-store` with `Vary: Cookie`.

## Routes

| Route                                     |                                                                                                                             |
| :---------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------- |
| `GET /_rapidoc/auth/login?returnTo=/path` | Authorization code flow with PKCE, state and nonce                                                                          |
| `GET /_rapidoc/auth/callback`             | Verifies the ID token, sets the session cookie, returns to `returnTo` (same site only)                                      |
| `POST /_rapidoc/auth/logout`              | Same-origin only; with `logout: idp` also ends the session at the provider                                                  |
| `GET /_rapidoc/auth/me`                   | `{ user, zones }` or 401                                                                                                    |
| `GET /_rapidoc/auth/token`                | With `auth.tryIt`: `{ access_token, expires_at }` for Try, same-origin only; 401 signed out or expired, 404 without `tryIt` |
| `POST /_rapidoc/access/check`             | `{ paths }` → `{ locked }`, for lock icons on links                                                                         |
| `POST /mcp`                               | The portal's APIs and workflows as MCP tools (Streamable HTTP, stateless); see below                                        |
| `POST /_rapidoc/mcp/token`                | Signed in, same-origin only: `{ token, expires_at, url }`, a bearer token for the reader's agents                           |
| `GET /_rapidoc/health`                    | `{ ok: true }`                                                                                                              |

The session cookie holds the user's id, name, email, picture and only the groups some access rule names. The ID and refresh tokens never leave the server. With `auth.tryIt`, the access token is kept in its own encrypted cookie (no longer than the token and the session last) and handed to same-origin page scripts through `/_rapidoc/auth/token`, so Try can call the API with it.

## MCP: the APIs as tools for agents

`rapidoc build` writes one MCP manifest per API to `dist/mcp/<api id>.json` (tools named `<api id>_<tool>`) and one per Arazzo workflow file to `dist/mcp/workflows/<id>.json`, and records them in `rapidoc-server.json` with each API's zone. `rapidoc serve` hosts them at `POST /mcp` with the [MCP Streamable HTTP transport](https://modelcontextprotocol.io/specification/latest/basic/transports), stateless with JSON answers, so any instance can answer any request. The tools are run by `@rapidoc/mcp`, the same runtime as RapiDoc's exported MCP servers.

- **Without a token** an agent sees the public tools, and the API is called without credentials.
- **With a token** (`Authorization: Bearer …`, from **Connect an AI agent** in the user menu, i.e. `POST /_rapidoc/mcp/token`) it sees the tools of every zone the reader may see. The token is the reader's session sealed like the cookies, plus, with `auth.tryIt`, their API access token: operations secured with `oauth2`, `openIdConnect` or an HTTP `bearer` scheme are called with it. It lasts as long as the session.
- **API keys and HTTP Basic** come from the server's environment, named like the exported project's: `MCP_AUTH_<SCHEME>` (the scheme id in UPPER_SNAKE: `api_key` or `apiKey` reads `MCP_AUTH_API_KEY`), and `MCP_AUTH_<SCHEME>_USERNAME` / `MCP_AUTH_<SCHEME>_PASSWORD` for HTTP Basic. No variable outside the `MCP_AUTH_` prefix is ever sent to an API, whatever a spec calls its schemes.
- **Base URLs** are each spec's first server. A spec with a relative server URL (`/api/v1`) or none gives a manifest without a base URL: that API's tools are left out of `/mcp`, with a log line at start, until `MCP_BASE_URL_<API ID>` (the API id in UPPER_SNAKE; `MCP_BASE_URL` when the portal has one API) says where the API is. The same variables override a spec's server.
- **Workflow steps with `x-operation`** call the URL they name. A URL computed at run time (from the agent's input or a response) goes only to a host the workflow names (its APIs' servers, or a URL written out in another step), or to one listed in `MCP_EXTERNAL_HOSTS` (comma-separated, `*` for any), so an agent can't send the server to an internal address.
- A build without `auth` serves every manifest in `dist/mcp/` as public.

A client that speaks stdio only (Claude Desktop) connects through [mcp-remote](https://www.npmjs.com/package/mcp-remote):

```bash
npx mcp-remote https://developers.acme.com/mcp --header "Authorization: Bearer <token>"
```

## Programmatic use

```js
import { createApp, startServer } from '@rapidoc/server';

const { app, summary } = await createApp({ distDir: 'dist' }); // a Hono app: mount it or add middleware
const server = await startServer({ distDir: 'dist', port: 8080 }); // { url, port, summary, close }
await server.close();
```

`summary` says how the build is served, in values that are safe to print. It never holds a secret or the build's manifest:

| Field           | Value                                                                                                              |
| :-------------- | :----------------------------------------------------------------------------------------------------------------- |
| `mode`          | `portal`, or `static` for a build without sign-in                                                                  |
| `basePath`      | Path of the portal in the addresses a browser sees (`''` at the root)                                              |
| `mountPath`     | Path requests arrive under                                                                                         |
| `publicUrl`     | The portal's public origin, or `null`                                                                              |
| `issuer`        | The sign-in provider, or `null` without sign-in                                                                    |
| `clientId`      | The client ID, or `null` without sign-in                                                                           |
| `providerReady` | `true` when the provider was discovered at start-up; `false` without sign-in or when it could not be reached then  |
| `access`        | `{ files, zones }`: protected files and the zones they are in (the public zone not counted); `null` in static mode |
| `mcp`           | `{ enabled, tools }`: `enabled` is `false` with `RAPIDOC_MCP=off`; `tools` counts the tools served at `/mcp`       |

`createApp`, `startServer` and `SettingsError` (thrown by both when the build or the environment can't be served; `err.problems` lists every reason) are the package's public API.

---

Part of the [RapiDoc family](https://rapidocui.com) of open-source tools for OpenAPI and Arazzo: [RapiDoc](https://rapidocui.com/rapidoc/) (`<rapi-doc>`), [RapiFlow](https://flow.rapidocui.com/), [RapiDoc Portal](https://portal.rapidocui.com/), [RapiMock](https://mock.rapidocui.com/), [RapiPdf](https://rapidocui.com/rapipdf/), the [RapiDoc CLI](https://rapidocui.com/cli/) and [integrations](https://rapidocui.com/integrations/) for Express, Fastify, Hono, FastAPI, ASP.NET Core, Go, Starlight, VitePress and Docusaurus.
