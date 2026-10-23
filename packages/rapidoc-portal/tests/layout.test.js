/**
 * App-shell layout rules for a built portal, measured in headless Chrome against demo-api-portal.
 *
 * Each rule is checked on every page kind it applies to, at three viewport sizes and four
 * scroll positions (top, middle, footer half revealed, end). The shell they describe: a sticky
 * header, a sticky full-height sidebar, and a full-width site footer revealed at the end of the
 * page, which itself scrolls. A rule for a target not met yet can be tagged `todo`: it is reported
 * but not enforced until the tag is removed.
 *
 * Set RAPIDOC_LAYOUT_OUT=<dir> to also write measurements.json and screenshots to <dir>
 * (`npm run layout:baseline` writes them to tests/layout/).
 */

import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildPortal } from '../src/index.js';
import { findChromeExecutable, launchTestBrowser } from '../../../tests/helpers/test-harness.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEMO_PORTAL_DIR = process.env.RAPIDOC_DEMO_PORTAL_DIR ?? path.resolve(__dirname, '../../../../demo-api-portal');
const OUTPUT_DIR = process.env.RAPIDOC_LAYOUT_OUT ? path.resolve(process.env.RAPIDOC_LAYOUT_OUT) : null;

const PAGES = [
  { id: 'home', path: '/', kind: 'landing' },
  { id: 'catalog', path: '/catalog/', kind: 'landing' },
  { id: 'docs', path: '/docs/shipping-process/', kind: 'docs' },
  { id: 'api', path: '/apis/shipments/', kind: 'api' },
  { id: 'api-tag', path: '/apis/shipments/tracking-notifications/', kind: 'api' },
];

const VIEWPORTS = [
  { id: 'desktop', width: 1440, height: 900 },
  { id: 'laptop', width: 1024, height: 768 },
  { id: 'mobile', width: 375, height: 812 },
];

const KINDS = ['landing', 'docs', 'api'];

// The first selector that matches wins. `data-portal-region` hooks are the stable contract the
// app shell should expose; the class names after them match today's markup.
const REGIONS = {
  header: ['[data-portal-region="header"]', 'header.header', '.portal-header-root'],
  headerInner: ['[data-portal-region="header-inner"]', '.portal-navbar'],
  sidebar: ['[data-portal-region="sidebar"]', '.sidebar-pane', '.portal-sidebar'],
  toc: ['[data-portal-region="toc"]', '.right-sidebar'],
  footer: ['[data-portal-region="footer"]', 'footer.portal-footer-root', 'footer.portal-content-footer'],
  footerInner: ['[data-portal-region="footer-inner"]', '.portal-footer-container', '.portal-content-footer-container'],
};

const TOLERANCE = 1;
const near = (a, b) => Math.abs(a - b) <= TOLERANCE;

/** While the footer scrolls into view, a side column must show itself above the footer's top edge and the footer below it. */
function revealCheck(c, region) {
  for (const state of ['reveal', 'end']) {
    const seen = c[state].seen[region];
    if (!seen) return `${region} not found when scrolled to the ${state}`;
    if (!seen.aboveFooter) return `footer is not in view when scrolled to the ${state}`;
    if (seen.aboveFooter !== 'self') return `${state}: just above the footer, the ${region} column shows ${seen.aboveFooter}`;
    if (seen.belowFooter !== 'footer') return `${state}: just below the footer's top edge, the ${region} column shows ${seen.belowFooter}`;
  }
}

/**
 * Layout rules. `kinds` lists the page kinds a rule applies to; an optional `todo` maps a page kind
 * to a note on the work that will make the rule pass there. `check` returns a failure message or nothing.
 */
const RULES = [
  {
    name: 'header stays pinned to the top while the page scrolls',
    kinds: KINDS,
    check: ({ middle }) => {
      if (!middle.header) return 'header not found';
      if (!near(middle.header.top, 0)) return `header top is ${middle.header.top}px after scrolling`;
    },
  },
  {
    name: 'header content fits inside the header bar',
    kinds: KINDS,
    check: ({ top }) => {
      if (!top.header) return 'header not found';
      if (top.headerContentBottom > top.header.bottom + TOLERANCE) {
        return `header content reaches y=${top.headerContentBottom}px, below the header's bottom edge at ${top.header.bottom}px`;
      }
    },
  },
  {
    name: 'page never scrolls horizontally',
    kinds: KINDS,
    check: ({ top, viewport }) => {
      if (top.scrollWidth > viewport.width) return `document is ${top.scrollWidth}px wide in a ${viewport.width}px viewport`;
    },
  },
  {
    name: 'renders exactly one site footer',
    kinds: KINDS,
    check: ({ top }) => {
      if (top.footerCount !== 1) return `found ${top.footerCount} site footers`;
    },
  },
  {
    name: 'sidebar fills the height from the header to the bottom of the screen while the content scrolls',
    kinds: ['docs', 'api'],
    applies: ({ viewport }) => viewport.width >= 800,
    check: ({ middle }) => {
      const seen = middle.seen.sidebar;
      if (!seen) return 'sidebar not found';
      if (seen.belowHeader !== 'self') return `just below the header the page shows ${seen.belowHeader}, not the sidebar`;
      if (seen.screenBottom !== 'self') return `at the bottom of the screen the page shows ${seen.screenBottom}, not the sidebar`;
    },
  },
  {
    // The target shell has one site footer; the sidebar keeps no footer bar of its own.
    name: 'sidebar has no docked footer bar',
    kinds: ['docs', 'api'],
    check: ({ top }) => {
      if (top.hasSidebarDockedBar) return 'sidebar has a docked footer bar';
    },
  },
  {
    name: 'sidebar is hidden behind the menu button on narrow screens',
    kinds: ['docs', 'api'],
    applies: ({ viewport }) => viewport.width < 800,
    check: ({ top }) => {
      if (top.sidebar) return `sidebar is visible and ${top.sidebar.width}px wide`;
    },
  },
  {
    name: 'table of contents stays in view below the header while the content scrolls',
    kinds: ['docs'],
    applies: ({ middle }) => Boolean(middle.toc),
    check: ({ middle }) => {
      if (!near(middle.toc.top, middle.header.bottom)) return `TOC top ${middle.toc.top}px, header bottom ${middle.header.bottom}px`;
    },
  },
  {
    name: 'footer spans the full viewport width at the end of the page',
    kinds: KINDS,
    check: ({ end, viewport }) => {
      if (!end.footer) return 'footer not found';
      if (!near(end.footer.left, 0) || !near(end.footer.width, viewport.width)) {
        return `footer spans x=${end.footer.left}..${end.footer.right}px of ${viewport.width}px`;
      }
    },
  },
  {
    name: 'footer sits at the bottom of the scrolled page',
    kinds: KINDS,
    check: ({ end, viewport }) => {
      if (!end.footer) return 'footer not found';
      if (!near(end.footer.bottom, viewport.height)) return `footer bottom ${end.footer.bottom}px, viewport ${viewport.height}px`;
      if (end.contentScroller) return `footer was reached by scrolling ${end.contentScroller}, not the page`;
    },
  },
  {
    // docs.cypress.io pushes the sticky sidebar up; developer.frame.io paints the footer over it.
    // Either way, what you see is the sidebar down to the footer's top edge and the footer below it.
    name: 'footer is revealed below the sidebar as the page reaches its end',
    kinds: ['docs', 'api'],
    applies: ({ viewport }) => viewport.width >= 800,
    check: (c) => revealCheck(c, 'sidebar'),
  },
  {
    name: 'footer is revealed below the table of contents as the page reaches its end',
    kinds: ['docs'],
    applies: ({ middle }) => Boolean(middle.toc),
    check: (c) => revealCheck(c, 'toc'),
  },
  {
    name: 'footer content lines up with the header content',
    kinds: KINDS,
    check: ({ end }) => {
      if (!end.headerInner || !end.footerInner) return 'header or footer container not found';
      if (!near(end.headerInner.contentLeft, end.footerInner.contentLeft)) {
        return `header content starts at x=${end.headerInner.contentLeft}px, footer content at x=${end.footerInner.contentLeft}px`;
      }
    },
  },
  {
    name: 'nothing shifts while the page loads',
    kinds: KINDS,
    check: ({ layoutShift }) => {
      if (layoutShift >= 0.01) return `cumulative layout shift ${layoutShift}`;
    },
  },
  {
    name: 'docs pages link to the previous and next page',
    kinds: ['docs'],
    check: ({ top }) => {
      if (!top.hasPagination) return 'no prev/next links';
    },
  },
  {
    name: 'content scrolls with the page, not in an inner scroll box',
    kinds: KINDS,
    check: ({ end }) => {
      if (end.contentScroller) return `content scrolls inside ${end.contentScroller}`;
    },
  },
  {
    name: 'RapiDoc bundle loads only on API pages',
    kinds: KINDS,
    check: ({ page, top }) => {
      const expected = page.kind === 'api';
      if (top.loadsRapidoc !== expected) return expected ? 'rapidoc-min.js is not loaded' : 'rapidoc-min.js is loaded';
    },
  },
];

const CONTENT_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.yaml': 'text/yaml; charset=utf-8',
  '.yml': 'text/yaml; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.wasm': 'application/wasm',
};

/** Serves a built portal folder the way a static host would (`/docs/x/` -> `docs/x/index.html`). */
async function serveStatic(rootDir) {
  const server = http.createServer((req, res) => {
    const urlPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    let filePath = path.join(rootDir, urlPath);
    if (!filePath.startsWith(rootDir)) {
      res.writeHead(403);
      return res.end();
    }
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) filePath = path.join(filePath, 'index.html');
    if (!fs.existsSync(filePath)) {
      res.writeHead(404);
      return res.end('Not Found');
    }
    res.writeHead(200, { 'Content-Type': CONTENT_TYPES[path.extname(filePath)] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  return { server, baseUrl: `http://127.0.0.1:${server.address().port}` };
}

/** Runs in the page: positions of the shell regions plus page-level facts. */
function measureInPage(regions) {
  const pick = (selectors) => {
    for (const selector of selectors) {
      const el = document.querySelector(selector);
      if (el) return el;
    }
    return null;
  };
  const box = (el) => {
    if (!el) return null;
    const style = getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    if (style.display === 'none' || style.visibility === 'hidden' || rect.width === 0 || rect.height === 0) return null;
    return {
      top: rect.top,
      bottom: rect.bottom,
      left: rect.left,
      right: rect.right,
      width: rect.width,
      height: rect.height,
      position: style.position,
      contentLeft: rect.left + parseFloat(style.paddingLeft),
    };
  };

  const result = {};
  for (const [name, selectors] of Object.entries(regions)) result[name] = box(pick(selectors));

  // What is painted at sample points down the middle of a side column: the column itself ('self'),
  // the site footer, the header, or something else.
  const headerEl = pick(regions.header);
  const footerEl = pick(regions.footer);

  // Lowest painted edge of anything inside the header (wrapped nav links, a tall logo, ...).
  result.headerContentBottom = headerEl
    ? Math.max(
        result.header?.bottom ?? 0,
        ...[...headerEl.querySelectorAll('*')]
          .filter((el) => el.checkVisibility({ opacityProperty: true, visibilityProperty: true }))
          .map((el) => el.getBoundingClientRect())
          .filter((r) => r.width > 0 && r.height > 0)
          .map((r) => r.bottom)
      )
    : null;

  const seenDown = (el, rect) => {
    if (!rect) return null;
    // Middle of the part of the column that is on screen (Starlight's TOC box extends past the viewport).
    const x = (Math.max(rect.left, 0) + Math.min(rect.right, window.innerWidth)) / 2;
    const at = (y) => {
      const hit = document.elementFromPoint(x, y);
      if (!hit) return null;
      if (footerEl?.contains(hit)) return 'footer';
      if (el.contains(hit)) return 'self';
      if (headerEl?.contains(hit)) return 'header';
      return `${hit.tagName.toLowerCase()}.${[...hit.classList].join('.')}`;
    };
    const headerBottom = result.headerContentBottom ?? 0;
    const seen = { belowHeader: at(headerBottom + 2), screenBottom: at(window.innerHeight - 2) };
    const footerTop = result.footer?.top;
    if (footerTop > headerBottom + 4 && footerTop < window.innerHeight - 2) {
      seen.aboveFooter = at(footerTop - 2);
      seen.belowFooter = at(footerTop + 2);
    }
    return seen;
  };
  result.seen = {
    sidebar: seenDown(pick(regions.sidebar), result.sidebar),
    toc: seenDown(pick(regions.toc), result.toc),
  };

  const scroller = window.__portalContentScroller();
  result.contentScroller = scroller ? `${scroller.tagName.toLowerCase()}.${[...scroller.classList].join('.')}` : null;
  result.scrollY = window.scrollY;
  result.scrollWidth = document.documentElement.scrollWidth;
  result.scrollHeight = document.documentElement.scrollHeight;
  result.footerCount = document.querySelectorAll(regions.footer.join(',')).length;
  result.hasPagination = Boolean(document.querySelector('.pagination-links'));
  result.loadsRapidoc = Boolean(document.querySelector('script[src*="rapidoc-min.js"]'));
  result.hasSidebarDockedBar = Boolean(document.querySelector('.portal-sidebar-docked-footer'));
  return result;
}

/** Init script: collects layout shifts and exposes a helper that finds an inner content scroller. */
function installPageHelpers() {
  window.__portalLayoutShift = 0;
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (!entry.hadRecentInput) window.__portalLayoutShift += entry.value;
    }
  }).observe({ type: 'layout-shift', buffered: true });

  // Nearest scrolling ancestor of the main content, below <body>. null means the page itself scrolls.
  window.__portalContentScroller = () => {
    let el = document.querySelector('rapi-doc') || document.querySelector('main');
    while (el && el !== document.body && el !== document.documentElement) {
      const { overflowY } = getComputedStyle(el);
      if ((overflowY === 'auto' || overflowY === 'scroll') && el.scrollHeight > el.clientHeight + 1) return el;
      el = el.parentElement;
    }
    return null;
  };
}

/**
 * Scrolls the page (and an inner content scroller, if any) to a fraction of its scroll range, or,
 * for 'reveal', to where the bottom half of the site footer is still below the screen.
 */
async function scrollTo(page, position, footerSelectors) {
  await page.evaluate(
    async ([pos, selector]) => {
      const footerHeight = document.querySelector(selector)?.getBoundingClientRect().height ?? 0;
      const targets = [document.scrollingElement, window.__portalContentScroller()].filter(Boolean);
      const nextFrame = () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      // Content that renders lazily (<rapi-doc>) changes the scroll range as it comes into view, so
      // repeat until the target position holds.
      for (let attempt = 0; attempt < 60; attempt++) {
        let moved = false;
        for (const el of targets) {
          const max = el.scrollHeight - el.clientHeight;
          const target = Math.max(0, Math.round(pos === 'reveal' ? max - footerHeight / 2 : max * pos));
          if (Math.abs(el.scrollTop - target) > 1) {
            el.scrollTop = target;
            moved = true;
          }
        }
        await nextFrame();
        await new Promise((resolve) => setTimeout(resolve, 50));
        if (!moved) break;
      }
    },
    [position, footerSelectors.join(',')]
  );
}

function round(value) {
  if (Array.isArray(value)) return value.map(round);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, round(v)]));
  return typeof value === 'number' ? Math.round(value * 1000) / 1000 : value;
}

async function measureCase(context, baseUrl, pageDef, viewport) {
  const page = await context.newPage();
  try {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto(`${baseUrl}${pageDef.path}`, { waitUntil: 'load' });
    if (pageDef.kind === 'api') {
      await page.waitForFunction(
        () => {
          const doc = document.querySelector('rapi-doc');
          return doc?.shadowRoot && !doc.loading && doc.shadowRoot.querySelector('.section-tag, .m-endpoint, .main-content');
        },
        null,
        { timeout: 20000 }
      );
    }
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(300);

    const layoutShift = await page.evaluate(() => window.__portalLayoutShift);
    const states = {};
    for (const [name, position] of [
      ['top', 0],
      ['middle', 0.5],
      ['reveal', 'reveal'],
      ['end', 1],
    ]) {
      await scrollTo(page, position, REGIONS.footer);
      states[name] = round(await page.evaluate(measureInPage, REGIONS));
      if (OUTPUT_DIR && name !== 'middle') {
        await page.screenshot({ path: path.join(OUTPUT_DIR, 'screenshots', `${pageDef.id}-${viewport.id}-${name}.png`) });
      }
    }
    return { page: pageDef, viewport, layoutShift: round(layoutShift), ...states };
  } finally {
    await page.close();
  }
}

let chromeAvailable = true;
try {
  findChromeExecutable();
} catch {
  chromeAvailable = false;
}

describe('Portal app-shell layout (demo-api-portal)', { skip: chromeAvailable ? false : 'Chrome/Chromium not found' }, () => {
  const cases = [];
  let outDir;
  let server;
  let browser;

  before(async () => {
    outDir = fs.mkdtempSync(path.join(os.tmpdir(), 'rapidoc-portal-layout-'));
    await buildPortal(DEMO_PORTAL_DIR, { outDir });
    const served = await serveStatic(outDir);
    server = served.server;

    browser = await launchTestBrowser();
    const context = await browser.newContext();
    await context.addInitScript(installPageHelpers);
    // Only the built portal is loaded: web fonts and other remote requests are blocked so
    // measurements do not depend on the network.
    await context.route('**/*', (route) => (route.request().url().startsWith(served.baseUrl) ? route.continue() : route.abort()));

    if (OUTPUT_DIR) fs.mkdirSync(path.join(OUTPUT_DIR, 'screenshots'), { recursive: true });
    for (const pageDef of PAGES) {
      for (const viewport of VIEWPORTS) cases.push(await measureCase(context, served.baseUrl, pageDef, viewport));
    }

    if (OUTPUT_DIR) {
      const measurements = Object.fromEntries(
        cases.map(({ page, viewport, ...state }) => [`${page.id}@${viewport.id}`, { path: page.path, viewport, ...state }])
      );
      fs.writeFileSync(path.join(OUTPUT_DIR, 'measurements.json'), `${JSON.stringify(measurements, null, 2)}\n`);
    }
  });

  after(async () => {
    await browser?.close();
    server?.close();
    if (outDir) fs.rmSync(outDir, { recursive: true, force: true });
  });

  for (const kind of KINDS) {
    describe(`${kind} pages`, () => {
      for (const rule of RULES.filter((r) => r.kinds.includes(kind))) {
        const todo = rule.todo?.[kind];
        it(rule.name, todo ? { todo } : {}, () => {
          const applicable = cases.filter((c) => c.page.kind === kind && (!rule.applies || rule.applies(c)));
          const failures = applicable
            .map((c) => [c, rule.check(c)])
            .filter(([, message]) => message)
            .map(([c, message]) => `${c.page.id} @ ${c.viewport.id} (${c.viewport.width}x${c.viewport.height}): ${message}`);
          assert.equal(failures.length, 0, `\n${failures.join('\n')}`);
        });
      }
    });
  }
});
