---
title: Introduction
description: What RapiDoc Portal is, what it builds, and which package does what.
---

RapiDoc Portal is a docs-as-code developer portal framework. You keep your OpenAPI specs and your guides in a repository, describe the site in one `rapidoc.config.yaml`, and the `rapidoc` command builds a static portal from them.

A portal has:

- **A home page** from `docs/index.md`, `.mdx` or `.markdoc`.
- **Guides** under `/docs/...`, written in Markdown, MDX or [Markdoc](https://markdoc.dev) (Markdown with tags, made by Stripe).
- **An interactive API reference** for each spec at `/apis/<id>`, rendered by the [RapiDoc](https://rapidocui.com) web component. Each operation has a **Try** button that sends a real request to your API from the browser.
- **An API catalog** at `/catalog`, with every API grouped by category.
- **Full-text search** across guides and API operations.
- **A header with tabs.** A documentation tab has its own sidebar of guides; an API tab opens an API's reference.
- **A footer, a banner, and light and dark themes**, styled with your brand ([Customizing the portal](/docs/configuration/customizing/)).

And, when you need them:

- **API versions**, each with its own URLs and a version picker ([Versions](/docs/api-reference/versions/)).
- **Arazzo workflows**: multi-step API journeys, in the OpenAPI Initiative's Arazzo format, drawn as diagrams you can run step by step ([Workflows](/docs/configuration/workflows/)).
- **Single sign-on (SSO) and access rules**: Okta, Microsoft Entra ID, Google or any OpenID Connect provider, with pages and APIs per group ([Single sign-on (SSO)](/docs/access/overview/)). **Try** can call your API with the reader's own token.
- **A mock server** that answers from your specs' examples and checks OAuth tokens and scopes, so you can use Try before your API is deployed ([Mock server](/docs/tools/mock-server/)).
- **MCP tools for AI agents** (Model Context Protocol): your APIs and workflows as tools, exported or hosted at `/mcp` under the same access rules ([MCP server](/docs/tools/mcp-server/)).
- **`llms.txt`**, an index of the site for AI assistants, and **Markdown copies** of every page ([LLM output](/docs/configuration/llms/)).
- **Spec checks in CI**: [validate](/docs/tools/validate/), [lint](/docs/tools/lint/) and [bundle](/docs/tools/bundle/) your OpenAPI files.
- **Migration** from Zudoku or Redocly with one command ([Migrate](/docs/tools/migrate/)).

The output is plain HTML, CSS and JavaScript. Host it on GitHub Pages, Netlify, Vercel, Cloudflare Pages, S3 or any web server ([Static hosting](/docs/deploy/static-hosting/)).

## The packages

| Package | What it does |
| :--- | :--- |
| `@rapidoc/cli` | The `rapidoc` command you run, directly or through the `npm run` scripts: `init`, `dev`, `build`, `serve`, `mock`, `validate`, `lint`, `migrate` and [more](/docs/reference/cli/). |
| `@rapidoc/portal` | The engine behind `rapidoc dev` and `rapidoc build`: config, layout, Markdoc tags, search. |
| `@rapidoc/server` | Behind `rapidoc serve`: serves a built portal with single sign-on (OpenID Connect) and access rules. Optional. |
| `@rapidoc/mock` | Behind `rapidoc mock`: a mock server for the portal's APIs, with request validation and token checks. Optional. |
| `create-rapidoc` | `npm create rapidoc` scaffolds a new portal project. |
| `rapidoc` | The `<rapi-doc>` web component that renders each API reference. |

The CLI loads `@rapidoc/portal`, `@rapidoc/server` and `@rapidoc/mock` only for the commands that need them. `rapidoc init` and `rapidoc validate <spec>` work without `@rapidoc/portal` installed: run them as `npx @rapidoc/cli init` before anything is installed.

## Why another portal framework?

- **Docs as code.** Everything is a file in your repository: review it in pull requests, build it in CI.
- **Static by default.** No database and no runtime to operate. Per-page sign-in is the one feature that needs a server, and it's opt-in. A portal that is private as a whole can sit behind your SSO proxy as static files ([Static hosting](/docs/deploy/static-hosting/#need-sign-in-sso)).
- **Strict config.** An unknown key fails the build with its path and a hint, so a typo never disappears silently.
- **Accessible.** The layout is tested against WCAG 2.1 AA in both themes and at phone width, and accent text colors are derived from your brand color so they keep 4.5:1 contrast.

Next: [build your first portal](/docs/getting-started/quickstart/).
