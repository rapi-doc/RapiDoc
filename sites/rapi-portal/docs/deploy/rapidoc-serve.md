---
title: Deploy with rapidoc serve
description: Run a portal with sign-in and access rules on Node or in Docker.
---

A portal with `auth` is served by `rapidoc serve` (`@rapidoc/server`). It serves the build, signs readers in through your provider, and enforces the [access rules](/docs/access/access-rules/) on every page, spec, file and search result.

```bash
npm install -D @rapidoc/cli @rapidoc/portal @rapidoc/server
npx rapidoc build
npx rapidoc serve dist   # port 8080, or $PORT
```

Set its [environment variables](#environment-variables) (`RAPIDOC_SESSION_SECRET`, `RAPIDOC_PUBLIC_URL`, and `RAPIDOC_AUTH_CLIENT_SECRET` for a confidential client) in the host's secret or environment settings, not on the command line, where they would end up in the shell history. To run it on your computer, see [Set up sign-in](/docs/access/setup/#3-test-on-your-computer).

- **Stateless**: the session is an encrypted cookie, so any number of instances can run behind a load balancer. No database.
- **Small**: it needs only Node, the CLI, `@rapidoc/server` and the build. Not `@rapidoc/portal`.
- **Agents too**: the APIs and workflows are MCP tools at `/mcp`, under the same rules. See [MCP server for agents](/docs/tools/mcp-server/).

You need it only for per-page or per-group access rules. A public portal, or one that is private as a whole behind your SSO proxy, is plain static files: see [Static hosting](/docs/deploy/static-hosting/#need-sign-in-sso).

## Availability and scaling

The server is a small Node process that reads the build from disk. It keeps nothing in memory between requests that another instance would need, so run it like any stateless web service:

- **Two or more instances** behind a load balancer, with the same `RAPIDOC_SESSION_SECRET`. Readers stay signed in whichever instance answers, and through restarts and deploys.
- **Health check**: `GET /_rapidoc/health` for the load balancer, Kubernetes or ECS.
- **Rolling deploys**: on `SIGTERM` the server stops taking new connections and exits, so the orchestrator can replace instances one at a time.
- **A CDN in front**: build assets (`_rapidoc/assets/`) are sent as `immutable` for a year and public pages revalidate, while anything that depends on the session is `private, no-store` and never cached.

A new release of the portal is a new build: build it in CI, ship `dist/` in the image, and roll the instances. There is no database to migrate.

## Environment variables

| Variable | Required | Meaning |
| :--- | :--- | :--- |
| `RAPIDOC_SESSION_SECRET` | with `auth` | Encrypts the session cookie. 32 or more characters, the same on every instance. Changing it signs everyone out. |
| `RAPIDOC_AUTH_CLIENT_SECRET` | confidential clients | Leave unset for a public client (PKCE only). |
| `RAPIDOC_PUBLIC_URL` | recommended | The portal's external URL: the redirect URL, and whether cookies are `Secure`. Default `site.url`, else the request's host. |
| `RAPIDOC_AUTH_ISSUER`, `RAPIDOC_AUTH_CLIENT_ID`, `RAPIDOC_AUTH_AUDIENCE` | no | Override `auth.issuer`, `auth.clientId`, `auth.audience`. |
| `RAPIDOC_MOUNT_PATH` | no | Path requests arrive under, when a proxy strips part of the portal's path. `--mount-path` wins. Default: the path of `site.url`. |
| `RAPIDOC_MCP` | no | `off` turns off the [MCP endpoint](/docs/tools/mcp-server/): no `/mcp`, no agent tokens, and no "connect an AI agent" section in the user menu. Default `on`. Any other value stops the server. |
| `PORT`, `HOST` | no | Default `8080` and `0.0.0.0`. `--port` and `--host` win. |
| `<SCHEME>`, `API_KEY` | no | API keys and HTTP Basic credentials for `/mcp` tool calls, named by the spec's security scheme id. See [MCP server for agents](/docs/tools/mcp-server/#credentials-of-other-kinds). |
| `EXTERNAL_HOSTS` | no | Hosts, comma-separated (`*` for any), that a workflow step's `x-operation` URL computed at run time may call from `/mcp`, besides the hosts the workflow names (its APIs' servers and URLs written out in its steps). |

The server refuses to start, with the reason, when a required value is missing or the provider can't be discovered.

## Behind a proxy that strips part of the path

A portal with `site.url: https://acme.com/sales/developers` is built and served under `/sales/developers`. When a gateway or ingress routes `/sales/*` to the server and strips `/sales`, requests arrive as `/developers/...`. Tell the server:

```bash
npx rapidoc serve dist --mount-path /developers
```

Links, redirects and the sign-in callback keep the full path the browser sees, `/sales/developers/...`. Without a proxy, the server answers under the path of `site.url` by itself.

## Docker

```dockerfile title="Dockerfile"
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

## The build output

With `auth`, `rapidoc build` writes:

| Path | Holds |
| :--- | :--- |
| `dist/public/` | Everything anyone may read. Contains no protected content, so it can sit on a CDN. |
| `dist/protected/` | Pages and files behind a rule. |
| `dist/rapidoc-server.json` | The rules and zones the server enforces. |

Responses that depend on the session are `Cache-Control: private, no-store` with `Vary: Cookie`, so a CDN in front never caches a protected page for the wrong reader.

## Without `auth`

`rapidoc serve` also serves a plain static build, which is handy for a local check of the production build:

```bash
npx rapidoc build && npx rapidoc serve dist
```
