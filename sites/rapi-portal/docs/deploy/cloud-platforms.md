---
title: Render, DigitalOcean, Railway
description: Deploy a portal to Render, DigitalOcean App Platform or Railway, in one click from the starter or from your own repository.
---

Render, DigitalOcean App Platform and Railway build the portal from your Git repository and run it with `rapidoc serve`. Every push rebuilds it. Sign-in works by adding environment variables, and agents get the `/mcp` endpoint.

## Try it in one click

The [starter repository](https://github.com/rapi-doc/rapidoc-portal-starter) deploys a sample portal as it is:

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/rapi-doc/rapidoc-portal-starter)
[![Deploy to DO](https://www.deploytodo.com/do-btn-blue.svg)](https://cloud.digitalocean.com/apps/new?repo=https://github.com/rapi-doc/rapidoc-portal-starter/tree/main)
[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/deploy/eq5i1k?referralCode=tI_nkc)

To publish your own APIs, click **Use this template** on the starter's GitHub page, edit your copy, and deploy it as below.

## Your own repository

A portal made by `npm create rapidoc@latest` or `rapidoc init` is ready for all three. The hosts run the same scripts from `package.json`:

| Step | Command |
| :--- | :--- |
| Build | `npm run build` (`rapidoc build`) |
| Start | `npm start` (`rapidoc serve`, listening on `$PORT`, which the host sets) |
| Health check | `GET /_rapidoc/health` |
| Node.js | `engines.node` in `package.json` (22.12 or later) |

| Host | How |
| :--- | :--- |
| **Render** | Dashboard → New → Blueprint → your repository. It reads `render.yaml`. |
| **DigitalOcean App Platform** | Create App → GitHub → your repository. It detects the build and start scripts. Set the health check path to `/_rapidoc/health`. |
| **Railway** | New Project → Deploy from GitHub repo → your repository. It detects the build and start scripts. Set the health check path to `/_rapidoc/health`, and generate a domain under Networking. |

`@rapidoc/cli` and `@rapidoc/server` must be **dependencies**, not dev dependencies: DigitalOcean removes dev dependencies after the build, and `npm start` needs both. `@rapidoc/portal` is only needed for the build and stays a dev dependency. A portal made before this layout can be moved over with:

```bash
npm install @rapidoc/cli @rapidoc/server
npm pkg set scripts.start="rapidoc serve" engines.node=">=22.12.0"
```

and, for Render, this `render.yaml`:

```yaml title="render.yaml"
services:
  - type: web
    name: my-portal
    runtime: node
    plan: free
    buildCommand: npm install && npm run build
    startCommand: npm start
    healthCheckPath: /_rapidoc/health
```

## Sign-in

With [`auth`](/docs/access/overview/) in the config, set the secrets in the host's environment settings, never in the repository: `RAPIDOC_SESSION_SECRET` (32 or more random characters), `RAPIDOC_AUTH_CLIENT_SECRET` for a confidential client, and `RAPIDOC_PUBLIC_URL`, the portal's address, which must match the callback URL registered with your provider. All variables: [Deploy with rapidoc serve](/docs/deploy/rapidoc-serve/#environment-variables).

## Plans

- **Render**: a free web service sleeps after 15 minutes without visits, and the next visit waits up to a minute. A paid instance stays awake.
- **DigitalOcean**: web services run on paid instances; the starter's button uses the smallest one.
- **Railway**: billed by usage.

A portal without sign-in is also a plain static site, which these hosts (and others) serve for free without sleeping: see [Static hosting](/docs/deploy/static-hosting/).
