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

| Variable                                                                 | Required             | Meaning                                                                                                                                                                   |
| :----------------------------------------------------------------------- | :------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `RAPIDOC_SESSION_SECRET`                                                 | with `auth`          | Encrypts the session cookie; 32+ characters; the same on every instance. Changing it signs everyone out.                                                                  |
| `RAPIDOC_AUTH_CLIENT_SECRET`                                             | confidential clients | Leave unset for a public client (PKCE only).                                                                                                                              |
| `RAPIDOC_AUTH_ISSUER`, `RAPIDOC_AUTH_CLIENT_ID`, `RAPIDOC_AUTH_AUDIENCE` | no                   | Override `auth.issuer` / `auth.clientId` / `auth.audience`, so one build can run against different providers.                                                             |
| `RAPIDOC_PUBLIC_URL`                                                     | recommended          | External URL: the redirect URL and whether cookies are `Secure`. Default `site.url`, else the request's host.                                                             |
| `RAPIDOC_MOUNT_PATH`                                                     | no                   | Path requests arrive under, when a proxy strips part of the portal's path (`--mount-path` wins). Default: the path of `site.url`. Links and redirects keep the full path. |
| `PORT`, `HOST`                                                           | no                   | Default `8080`, `0.0.0.0` (`--port`, `--host` win).                                                                                                                       |

The server refuses to start, with the reason, when a required value is missing or the provider can't be discovered. A build without sign-in is served as plain static files.

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
| `GET /_rapidoc/health`                    | `{ ok: true }`                                                                                                              |

The session cookie holds the user's id, name, email, picture and only the groups some access rule names. The ID and refresh tokens never leave the server. With `auth.tryIt`, the access token is kept in its own encrypted cookie (no longer than the token and the session last) and handed to same-origin page scripts through `/_rapidoc/auth/token`, so Try can call the API with it.

## Programmatic use

```js
import { createApp, startServer } from '@rapidoc/server';

const { app } = await createApp({ distDir: 'dist' }); // a Hono app: mount it or add middleware
const server = await startServer({ distDir: 'dist', port: 8080 });
await server.close();
```
