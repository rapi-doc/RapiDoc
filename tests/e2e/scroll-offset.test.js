import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createTestServer, launchTestBrowser } from '../helpers/test-harness.js';

// page-scroll-harness.html: a 120px sticky site header above <rapi-doc auto-height>.
const HEADER_HEIGHT = 120;

async function openPage(page, baseUrl, params = {}) {
  await page.goto(`${baseUrl}/page-scroll-harness.html?${new URLSearchParams(params)}`, { waitUntil: 'load' });
  await page.waitForFunction(
    () => {
      const doc = document.getElementById('thedoc');
      return doc?.shadowRoot && !doc.loading && doc.shadowRoot.querySelectorAll('.expanded-endpoint-body').length >= 3;
    },
    null,
    { timeout: 10000 }
  );
  await page.waitForTimeout(300);
}

/** Calls scrollToPath() for the n-th operation and returns its distance from the top of the viewport. */
async function scrollToOperation(page, index) {
  return page.evaluate(async (i) => {
    const doc = document.getElementById('thedoc');
    const target = doc.shadowRoot.querySelectorAll('.expanded-endpoint-body')[i];
    await doc.scrollToPath(target.id);
    await new Promise((resolve) => setTimeout(resolve, 200));
    return target.getBoundingClientRect().top;
  }, index);
}

/**
 * Scrolls the page so one observed section's top edge (an operation, tag or description heading) is
 * 20px above the bottom of the sticky header, with the next one in view below it, and returns both
 * ids and the active id reported afterwards.
 */
async function activeAfterHidingOperationUnderHeader(page) {
  return page.evaluate(async (headerHeight) => {
    const doc = document.getElementById('thedoc');
    const pageTop = (el) => el.getBoundingClientRect().top + window.scrollY;
    const observed = [...doc.shadowRoot.querySelectorAll('.observe-me')].sort((a, b) => pageTop(a) - pageTop(b));
    const readingZoneBottom = window.innerHeight / 2;
    // A pair whose second element starts inside the reading zone once the first sits at y = header - 20.
    const index = observed.findIndex((el, i) => {
      const next = observed[i + 1];
      if (!next) return false;
      const gap = pageTop(next) - pageTop(el);
      return gap > 40 && headerHeight - 20 + gap < readingZoneBottom - 20;
    });
    if (index === -1) return { error: 'no pair of observed sections fits in the reading zone' };
    const [hidden, next] = [observed[index], observed[index + 1]];
    // Start from the end of the page, so the active section changes (and the event fires) on the way back.
    window.scrollTo(0, document.documentElement.scrollHeight);
    await new Promise((resolve) => setTimeout(resolve, 500));
    window.__activeIds = [];
    window.scrollTo(0, pageTop(hidden) - (headerHeight - 20));
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { hidden: hidden.id, next: next.id, active: window.__activeIds.at(-1) };
  }, HEADER_HEIGHT);
}

describe('E2E: scroll offset for sticky page headers (auto-height)', () => {
  let serverInstance;
  let browser;
  let page;
  let baseUrl;

  before(async () => {
    serverInstance = await createTestServer();
    baseUrl = serverInstance.baseUrl;
    browser = await launchTestBrowser();
    page = await browser.newPage();
    await page.setViewportSize({ width: 1200, height: 1800 });
  });

  after(async () => {
    if (page) await page.close();
    if (browser) await browser.close();
    if (serverInstance?.server) serverInstance.server.close();
  });

  it('scrollToPath lands the target just below a header the page reserves with scroll-padding-top', async () => {
    await openPage(page, baseUrl, { padding: 'true' });
    const top = await scrollToOperation(page, 2);
    assert.ok(Math.abs(top - HEADER_HEIGHT) <= 2, `target top ${top}px, expected ${HEADER_HEIGHT}px`);
  });

  it('the scroll-offset attribute overrides scroll-padding-top', async () => {
    await openPage(page, baseUrl, { padding: 'true', 'scroll-offset': '60' });
    const top = await scrollToOperation(page, 2);
    assert.ok(Math.abs(top - 60) <= 2, `target top ${top}px, expected 60px`);
  });

  it('without scroll-padding-top or scroll-offset the target goes to the top of the viewport', async () => {
    await openPage(page, baseUrl);
    const top = await scrollToOperation(page, 2);
    assert.ok(Math.abs(top) <= 2, `target top ${top}px, expected 0px`);
  });

  it('nav-active-change skips an operation whose top is hidden under the header', async () => {
    await openPage(page, baseUrl, { padding: 'true' });
    const result = await activeAfterHidingOperationUnderHeader(page);
    assert.equal(result.error, undefined, result.error);
    assert.equal(result.active, result.next);
  });

  it('with scroll-offset="0" the operation under the header still counts as visible', async () => {
    await openPage(page, baseUrl, { padding: 'true', 'scroll-offset': '0' });
    const result = await activeAfterHidingOperationUnderHeader(page);
    assert.equal(result.error, undefined, result.error);
    assert.equal(result.active, result.hidden);
  });
});
