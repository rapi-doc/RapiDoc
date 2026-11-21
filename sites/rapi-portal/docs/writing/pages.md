---
title: Your own pages
description: Add pages the portal has no page type for - a landing page, a pricing page, a full-screen demo - as Astro files in a pages/ folder.
---

Guides go in `docs/` and API references come from `apis:`. For anything else, such as a landing page, a pricing page or a full-screen demo, add an Astro file to a `pages/` folder next to `rapidoc.config.yaml`. Each `.astro` file there becomes a page of the portal.

:::note
This is an advanced feature. Most portals need only `docs/` and the config. Pages are written in [Astro](https://docs.astro.build/en/basics/astro-components/)'s component syntax, which the portal is built on; a new major version of Astro can need changes to your pages, and the portal's release notes say when.
:::

## Where a page is served

The file's path under `pages/` is its address:

| File | Address |
| :--- | :--- |
| `pages/pricing.astro` | `/pricing` |
| `pages/demo/index.astro` | `/demo` |
| `pages/index.astro` | `/`, the home page |
| `pages/items/[id].astro` | `/items/<id>`, one page per value its `getStaticPaths()` returns |
| `pages/404.astro` | The page shown for an address that has no page, in place of the portal's own |

Files and folders whose names start with `_` are not pages, so a page's helpers can sit beside it.

With `pages/index.astro` as the home page, `docs/index.*` is no longer the home page: it becomes the page at `/docs`, the front page of your documentation. List it in `navigation` as `{ slug: index }`.

The portal keeps `/docs`, `/apis`, `/catalog` and `/_rapidoc` for itself. A page at one of them, or at a path that `redirects:` already uses, stops the build with a message that names the file.

## A page inside the portal's frame

`PortalLayout` gives a page the portal's header, footer, theme and `head` tags:

```astro title="pages/pricing.astro"
---
import { PortalLayout } from '@rapidoc/portal/components';
---

<PortalLayout title="Pricing" description="Plans for every team.">
  <h1>Pricing</h1>
  <p>Free for open source.</p>
</PortalLayout>
```

The page can use the portal's other components (`Card`, `Tabs`, `Icon`, ...) and your own, like an [MDX page](/docs/writing/mdx/).

## A page with its own document

A page that writes its own `<html>` gets none of the portal's styles, which is what a full-screen demo wants. `PortalHead` adds what every page of the site should still have: the title from `site.titleTemplate`, the description, the favicon, the link-preview tags and the `head:` entries of the config, such as analytics.

```astro title="pages/demo.astro"
---
import PortalHead from '@rapidoc/portal/components/PortalHead.astro';
---

<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <PortalHead title="Live demo" />
    <script type="module" src="/assets/rapidoc-min.js"></script>
  </head>
  <body>
    <rapi-doc spec-url="/specs/bookstore.yaml"></rapi-doc>
  </body>
</html>
```

Import `PortalHead` by that path, not from `@rapidoc/portal/components`: importing from there brings the portal's styles to the page.

### With the portal's header

A page with its own document can still have the portal's header, so the whole site has one: the same links, menus and search, from `header` in the config.

```astro title="pages/landing.astro"
---
import PortalHead from '@rapidoc/portal/components/PortalHead.astro';
import PortalHeader from '@rapidoc/portal/components/PortalHeader.astro';
---

<html lang="en" data-theme="dark">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <PortalHead title="Welcome" />
  </head>
  <body>
    <PortalHeader />
    <main>...</main>
  </body>
</html>
```

The header brings the portal's colors and your `theme.css` with it, and nothing else: the rest of the page keeps the styles you give it. Set `data-theme` on `<html>` to `dark` or `light`, which is the theme the header draws in. A page with one theme only should hide the header's light/dark switcher in its own CSS (`.portal-theme-btn`).

If the page has no reason to differ from the portal's look, use `PortalLayout` instead: it does all of this, and follows the reader's theme.

## The 404 page

Every portal has a 404 page: the header, a short message, and ways back (the home page, the search and the navigation tabs). The build writes it as `404.html`, which GitHub Pages, Netlify, Cloudflare Pages and most static hosts show for an address that has no page; `rapidoc serve` shows it too.

To use your own, add `pages/404.astro`. It replaces the portal's, and can use `PortalLayout` or its own document like any other page. Write its links and assets from the root (`/docs/...`, not `docs/...`): the page is shown at whatever address was asked for.

## Reading your project's files

Code between the `---` lines runs when the site is built. To read a file of your project there, take the project's folder from the portal: the build does not run from it, so a path from `process.cwd()` would miss.

```astro title="pages/changelog.astro"
---
import fs from 'node:fs';
import path from 'node:path';
import { PortalLayout } from '@rapidoc/portal/components';
import { projectDir } from 'virtual:rapidoc-portal/project';

const releases = JSON.parse(fs.readFileSync(path.join(projectDir, 'data', 'releases.json'), 'utf8'));
---

<PortalLayout title="Changelog">
  <ul>
    {releases.map((release) => <li>{release.version}: {release.summary}</li>)}
  </ul>
</PortalLayout>
```

`projectDir` works the same way in a component that an MDX page imports.

## What pages don't get

- **Search and `llms.txt`**: your own pages are not indexed.
- **The sidebar**: link to a page from `header.links`, the footer or a guide.
- **With a base path** (`site.url` with a path): write links through the portal's components, or add the base yourself in plain `<a>` tags.

With [sign-in](/docs/access/overview/), `access:` rules apply to your pages by path, like every other page.

`rapidoc dev` reloads a page when you edit it, and restarts when you add or remove one.
