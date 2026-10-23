---
name: rapidoc-static-navigation
description: Implement independent scrolling and navigation synchronization for RapiDoc using RapiDoc Static getNavBarHtml and headless rapi-doc.
when_to_use: Building or changing a portal/API-reference layout with a sidebar next to <rapi-doc>, wiring nav clicks or nav-active-change scroll sync, fixing duplicate sidebars or scroll bleed, or using getNavBarHtml/getNavCss from rapidoc/static.
---

# RapiDoc Static Navigation & Independent Scrolling Pattern

This skill guides you through implementing decoupled, dual-pane or multi-column documentation layouts where the navigation sidebar and the main API content scroll independently, without duplicated DOM or hydration drift.

---

## 1. Core Architecture Overview

In developer portals, embedding `<rapi-doc show-side-nav="true">` inside a documentation page layout causes nested sidebars, layout conflicts, and hydration duplication.

The battle-tested **`release_12_0_0`** pattern separates navigation from content:

```text
┌────────────────────────────────────────────────────────┐
│ Fixed Top Bar / Header (e.g. 54px)                     │
├──────────────────────────┬─────────────────────────────┤
│ .portal-sidebar          │ .portal-main                │
│ (Static HTML via         │ (Headless <rapi-doc         │
│  getNavBarHtml)          │  show-side-nav="false">)    │
│                          │                             │
│ overflow-y: auto         │ overflow-y: auto            │
│ overscroll-behavior:     │ overscroll-behavior:        │
│ contain                  │ contain                     │
└──────────────────────────┴─────────────────────────────┘
```

---

## 2. Step 1: Pre-Render Navigation via `getNavBarHtml`

Use `getNavBarHtml` from `rapidoc/static` at build time to generate the semantic HTML sidebar:

```javascript
import { getNavBarHtml, getNavCss } from 'rapidoc/static';

const sidebarHtml = await getNavBarHtml(specData, {
  basePath: '/apis/shipments',
  activeHref: '/apis/shipments',
  routingMode: 'single-page', // or 'tag-pages'
  includeSearch: true,
  searchPlaceholder: 'Filter endpoints...',
  itemClassName: 'portal-sidebar-op-item',
});

// Navigation styles scoped to the sidebar container
const navCss = getNavCss('.portal-sidebar');
```

---

## 3. Step 2: Render Headless `<rapi-doc>` in Main Content

Configure `<rapi-doc>` as a pure content reader without its internal header or sidebar:

```html
<main class="portal-main">
  <rapi-doc
    spec-url="/specs/shipment.yaml"
    show-side-nav="false"
    show-header="false"
    render-style="read"
    auto-height="true"
    schema-style="table"
    allow-try="true"
    allow-authentication="true"
    allow-server-selection="false"
    nav-item-spacing="compact"
  ></rapi-doc>
</main>
```

---

## 4. Step 3: CSS Layout for Independent Scrolling

Enforce viewport locking and isolated scroll containers:

```css
/* 1. Lock root document viewport */
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  max-height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* 2. Top Bar */
.portal-header {
  height: 54px;
  flex-shrink: 0;
}

/* 3. 2-Column Split Body Grid */
.portal-container {
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  flex: 1 1 0%;
  min-height: 0;
  height: calc(100vh - 54px);
  overflow: hidden;
}

/* 4. Left Sidebar with Independent Scroll */
.portal-sidebar {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--border-color, #363636);
}

.portal-sidebar .nav-scroll {
  flex: 1 1 0%;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: thin;
}

/* 5. Main Content with Independent Scroll */
.portal-main {
  flex: 1;
  height: 100%;
  overflow-y: auto;
  overscroll-behavior: contain;
  scroll-behavior: smooth;
  scrollbar-width: thin;
}

rapi-doc {
  display: block;
  width: 100%;
}
```

---

## 5. Step 4: Bi-Directional Scroll & Click Synchronization

Add the client-side event sync script:

```javascript
function initApiScrollSync() {
  const sidebar = document.querySelector('.portal-sidebar');
  const rapiDocEl = document.querySelector('rapi-doc');
  if (!sidebar || !rapiDocEl) return;

  // A. Nav Click -> Smooth Scroll Main Content
  sidebar.addEventListener('click', (e) => {
    const link = e.target.closest('.nav-bar-path, .nav-bar-info, .nav-bar-tag');
    if (!link) return;

    const href = link.getAttribute('href') || link.getAttribute('data-tag-href');
    if (!href) return;

    const hashIdx = href.indexOf('#');
    const elementId = hashIdx !== -1 ? href.substring(hashIdx + 1) : '';
    if (!elementId) return;

    const targetEl = rapiDocEl.shadowRoot?.getElementById(elementId) ||
                     rapiDocEl.shadowRoot?.querySelector(`[data-op-slug="${CSS.escape(elementId)}"]`);

    if (targetEl || elementId === 'overview') {
      e.preventDefault();
      window.history.pushState(null, '', href);

      sidebar.querySelectorAll('.active').forEach((el) => el.classList.remove('active'));
      link.classList.add('active');

      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (typeof rapiDocEl.scrollToPath === 'function') {
        rapiDocEl.scrollToPath(elementId);
      }
    }
  });

  // B. Main Content Scroll -> Update Sidebar Selection & Gentle Scroll
  rapiDocEl.addEventListener('nav-active-change', (e) => {
    const targetId = e.detail?.id || e.detail?.elementId;
    if (!targetId) return;

    sidebar.querySelectorAll('.active').forEach((el) => el.classList.remove('active'));

    const matchingLink = document.getElementById(`link-${targetId}`) ||
      sidebar.querySelector(`.nav-bar-path[data-content-id="${CSS.escape(targetId)}"]`) ||
      sidebar.querySelector(`.nav-bar-path[data-op-slug="${CSS.escape(targetId)}"]`);

    if (matchingLink) {
      matchingLink.classList.add('active');

      // Auto-scroll sidebar if item is out of view
      const navScroll = sidebar.querySelector('.nav-scroll');
      if (navScroll) {
        const itemRect = matchingLink.getBoundingClientRect();
        const scrollRect = navScroll.getBoundingClientRect();
        if (itemRect.top < scrollRect.top + 20 || itemRect.bottom > scrollRect.bottom - 40) {
          const targetTop = itemRect.top - scrollRect.top + navScroll.scrollTop - 40;
          navScroll.scrollTo({ top: targetTop, behavior: 'smooth' });
        }
      }
    }
  });
}
```

---

## 6. DSD Hydration Hygiene Checklist

- [ ] Rebuild bundles whenever core or static code changes: `npm run build:rapidoc`.
- [ ] If using DSD pre-rendering (`outputMode: 'dsd'`), ensure `_clearDsdIfNeeded()` runs `this.shadowRoot.replaceChildren()` before Lit reconciliation.
- [ ] For portal layouts, favor `getNavBarHtml()` + `<rapi-doc show-side-nav="false">` to eliminate any possibility of duplicate navbars.
