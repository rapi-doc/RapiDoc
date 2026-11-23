# Contributing to RapiDoc

This repository is an npm workspaces monorepo: every package of the RapiDoc family, the four websites built from them, and their tests. [`AGENTS.md`](AGENTS.md) is the full guide, for people and coding agents alike: package boundaries, every command, conventions and the release process. Each package has its own `AGENTS.md` too.

## Set up

Node.js 22.12 or later.

```bash
git clone https://github.com/rapi-doc/RapiDoc.git
cd RapiDoc
npm install
```

## Where things are

```text
packages/        every npm package: rapidoc (the web components), the CLI, portal, server, mock,
                 prerender, mcp, rapipdf, create-rapidoc, @rapidoc/embed and the integrations
integrations/    RapiDoc for Python (FastAPI, Starlette) and ASP.NET Core, each with its own toolchain
sites/           rapidocui.com (sites/rapidoc) and the RapiFlow, RapiMock and RapiDoc Portal sites,
                 each built with RapiDoc Portal from this repository
tests/           unit, component, end-to-end and performance tests of the core
brand/           logos and product names
```

## Work on it

| Command | What it does |
| :-- | :-- |
| `npm run dev` | The four sites' dev servers (rapidocui.com on http://localhost:4329) |
| `npm run build:rapidoc` | Builds `rapidoc-min.js` and `rapidoc-flow-min.js`; the sites and the portal load these |
| `npm run build:prerender`, `npm run build:mcp` | Rebuild `@rapidoc/prerender` and `@rapidoc/mcp` after changing the core's templates or MCP code |
| `npm run test:unit` | Unit tests of the core |
| `npm run test:portal` | Portal, CLI, server, mock, `create-rapidoc`, embed and integration tests |
| `npm run test:all` | Unit, component and end-to-end tests |
| `npm run lint`, `npm run format-fix` | oxlint and oxfmt, with their defaults |

The full tables are in [`AGENTS.md`](AGENTS.md#3-build-dev-and-test-commands).

## Pull requests

- Work in a fork of this repository; don't create branches here. Rebase on `master` before you open the pull request.
- A new or changed attribute, method or event starts with an issue: its name, allowed values and default. Its documentation is the doc comment in the element's source (see [`packages/rapidoc/AGENTS.md`](packages/rapidoc/AGENTS.md)). Mind the bundle size: everything is bundled into `rapidoc-min.js`.
- Run `npm run test:unit`, `npm run lint` and `npm run format-fix` before you open one, and `npm run test:portal` after changing the portal, CLI, server or mock.
- A change to a published package adds a changeset: `npm run changeset`, with one changelog line in the user's terms.
- Don't commit build output (`dist/` folders).
- Name the products as [`brand/README.md`](brand/README.md) sets out: RapiDoc, RapiDoc Mini, RapiFlow, RapiPdf, RapiMock, RapiDoc Portal, RapiDoc CLI.

Releases go through Changesets and the release workflow, never `npm publish` by hand: [`AGENTS.md` §6](AGENTS.md#6-releasing-changesets).
