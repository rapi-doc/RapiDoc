---
name: rapidoc-static-navigation
description: Build an API reference layout with a static sidebar from rapidoc/static getNavBarHtml next to a headless <rapi-doc>, in a page-scrolling app shell with a sticky sidebar and sticky header.
when_to_use: Building or changing a portal/API-reference layout with a sidebar next to <rapi-doc>, wiring nav clicks or nav-active-change sync, fixing duplicate sidebars, headings hidden under a sticky header, or using getNavBarHtml/getNavCss from rapidoc/static.
---

# RapiDoc static navigation in a page-scrolling shell

The portal's API pages (`src/pages/api-reference.astro`, on `src/components/PortalLayout.astro`) use the same app shell as the documentation pages, like docs.cypress.io and Zudoku:

```text
┌──────────────────────────────────────────────────────┐
│ header (position: sticky; top: 0)                    │
├───────────────────────┬──────────────────────────────┤
│ sidebar               │ <rapi-doc auto-height>        │
│ position: sticky      │ (the page scrolls)            │
│ top: header height    │                               │
│ height: 100dvh - hdr  │                               │
│ its .nav-scroll       │                               │
│ scrolls on its own    │                               │
├───────────────────────┴──────────────────────────────┤
│ site footer (full width; pushes the sidebar up)       │
└──────────────────────────────────────────────────────┘
```

The page is the scroll container. Never lock the viewport (`html, body { overflow: hidden }`) or give the content its own scroll box: the site footer could not then be revealed below the sidebar.

## 1. Sidebar: static HTML from `getNavBarHtml`

```js
import { getNavBarHtml, getNavCss, getThemeTokensCss } from 'rapidoc/static';

const sidebarNavHtml = await getNavBarHtml(spec, {
  basePath: api.path,
  activeHref: currentPath,
  routingMode: 'tag-pages', // or 'single-page'
  includeSearch: true,
  itemClassName: 'portal-sidebar-op-item',
});
const navCss = getNavCss('.portal-sidebar'); // scoped to the element with this class
```

`getNavCss(scope)` also styles the scope element itself (`&.nav-bar, & { width: 0; height: 100%; position: relative; ... }`). Put the nav in its own element inside the layout's sidebar, so these rules never fight the sticky positioning:

```html
<aside id="portal-api-sidebar" class="portal-layout-sidebar" popover="auto" data-portal-region="sidebar">
  <div class="portal-api-nav portal-sidebar nav-bar"><!-- sidebarNavHtml --></div>
</aside>
```

```css
.portal-api-nav.portal-sidebar.nav-bar { display: flex; flex: 1 1 0%; min-height: 0; width: auto; height: auto; border-right: 0; }
.portal-sidebar .nav-scroll { flex: 1 1 0%; min-height: 0; overflow-y: auto; overscroll-behavior: contain; }
```

`PortalLayout.astro` makes `.portal-layout-sidebar` sticky from 50rem and a popover menu below that (opened by the header's menu button via `sidebarId`).

## 2. Content: headless `<rapi-doc>`

```html
<rapi-doc
  spec-url="/specs/shipments.json"
  show-side-nav="false"   <!-- the portal renders the nav -->
  show-header="false"
  auto-height="true"      <!-- the page scrolls, not RapiDoc -->
  color-scheme="auto"     <!-- follows the page's CSS color-scheme (Starlight's theme toggle) -->
  update-route="false"
></rapi-doc>
```

- **Sticky header offset**: with `auto-height`, RapiDoc scrolls a target to just below the page's `scroll-padding-top`, and its active-section tracking ignores sections hidden under it. `PortalLayout` sets `html { scroll-padding-top: calc(var(--sl-nav-height) + 1rem) }`; a page without it can pass `scroll-offset="<px>"`.
- **Theme**: `color-scheme="auto"` reads the page's CSS `color-scheme` (`:root[data-theme='light'] { color-scheme: light }`) and re-reads it when `<html>` attributes change. No theme-sync script is needed.

## 3. Sync: `bindNavBar`

```js
const nav = document.querySelector('.portal-api-nav');
const rapiDocEl = document.querySelector('rapi-doc');
const bind = () => rapiDocEl.bindNavBar(nav);
typeof rapiDocEl.bindNavBar === 'function' ? bind() : customElements.whenDefined('rapi-doc').then(bind);
```

`bindNavBar` (from `rapidoc/src/utils/bind-navbar.js`) handles nav clicks → `scrollToPath`, `nav-active-change` → active link, keeping the active link in view inside `.nav-scroll` only (it never scrolls the page), the filter box, and history/hash updates. On narrow screens, also close the popover sidebar after a link is chosen (`sidebar.hidePopover()`).

## 4. Checks

- `npm run test:portal` includes `tests/layout.test.js`: sticky sidebar fills the screen, footer revealed below it, no inner scroll box, no sideways scroll, no layout shift, sidebar hidden on narrow screens.
- After changes in `packages/rapidoc/src` (core or `static/`), run `npm run build:rapidoc`; `tests/e2e/scroll-offset.test.js` and `tests/e2e/color-scheme-auto.test.js` cover the two attributes this layout relies on.
