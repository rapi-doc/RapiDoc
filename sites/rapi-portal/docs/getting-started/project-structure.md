---
title: Project structure
description: Where the config, specs, guides and static files go, and how files become URLs.
---

A portal is a folder with one config file and three folders. This is the starter from the [Quickstart](/docs/getting-started/quickstart/), plus a `public/` folder, which you create when you need one:

```text
my-portal/
├── rapidoc.config.yaml        # site, header, navigation, theme, APIs
├── package.json               # dev, build, start, validate and preview scripts
├── specs/                     # OpenAPI 3.0, 3.1 or Swagger 2.0 files, YAML or JSON
│   └── api.yaml
├── docs/                      # guides: .md, .mdx or .markdoc
│   ├── index.markdoc          # the home page (optional)
│   ├── getting-started.md
│   └── guides/
│       └── overview.markdoc
└── public/                    # optional: logo, favicon, images
```

## `rapidoc.config.yaml`

The one config file: the site, the header, the navigation, the theme and the APIs. See [Configuration](/docs/configuration/overview/).

## `docs/`

Every file is a page. The path decides the URL:

| File | URL |
| :--- | :--- |
| `docs/index.markdoc` | `/` (the home page) |
| `docs/getting-started.md` | `/docs/getting-started` |
| `docs/guides/overview.markdoc` | `/docs/guides/overview` |

In the config's `navigation:`, a page is named by its path without the extension, its *slug*: `guides/overview`. Without a `docs/index.*`, `/` redirects to the first tab.

Change the folder with `docs.dir` in the config. If both `page.md` and `page.mdx` exist, the `.mdx` one is used.

## `specs/`

OpenAPI files, listed under `apis:` in the config ([APIs](/docs/configuration/apis/)). Relative `$ref`s to other files resolve. A spec can also be a URL. Each API is published at `/specs/<api id>.<ext>`, so readers can download it.

## `public/`

Copied to the site root as-is: `public/logo.svg` is `/logo.svg`. Put the logo, favicon and images for guides here. Don't use it as the build's output folder.

## What a build leaves behind

Only the output folder, `dist/`. While it runs, a build works in a temporary folder, `.rapidoc-temp/`, inside the project, and removes it at the end, even when the build fails. Keep both out of Git, together with `.env`, where the [sign-in secrets](/docs/access/setup/#3-test-on-your-computer) go for local testing. The starter's `.gitignore` lists them:

```text
node_modules/
dist/
.rapidoc-temp/
.DS_Store
.env
.env.*
```
