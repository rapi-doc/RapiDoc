import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createTestServer, launchTestBrowser, loadHarness } from '../helpers/test-harness.js';

describe('E2E: Sections, Navigation & Client Routing', () => {
  let serverInstance;
  let browser;
  let page;
  let baseUrl;

  before(async () => {
    serverInstance = await createTestServer();
    baseUrl = serverInstance.baseUrl;
    browser = await launchTestBrowser();
    page = await browser.newPage();
  });

  after(async () => {
    if (page) await page.close();
    if (browser) await browser.close();
    if (serverInstance?.server) serverInstance.server.close();
  });

  it('renders correctly in read mode with navigation bar', async () => {
    await loadHarness(page, baseUrl, {
      spec: '/specs/01-sections.yaml',
      'render-style': 'read',
      'show-info': 'true',
      'show-header': 'false',
    });

    const isReadMode = await page.evaluate(() => {
      const doc = document.getElementById('thedoc');
      return doc.getAttribute('render-style') === 'read';
    });
    assert.equal(isReadMode, true);

    // Verify endpoints or tag sections exist in shadow DOM
    const endpointCount = await page.evaluate(() => {
      const doc = document.getElementById('thedoc');
      return doc.shadowRoot.querySelectorAll('.m-endpoint, .section-tag, .nav-bar-path').length;
    });
    assert.ok(endpointCount >= 3, `Expected at least 3 endpoints or nav paths, found ${endpointCount}`);
  });

  it('toggles header and info visibility', async () => {
    await loadHarness(page, baseUrl, {
      spec: '/specs/01-sections.yaml',
      'show-header': 'true',
      'show-info': 'false',
    });

    const headerVisible = await page.evaluate(() => {
      const doc = document.getElementById('thedoc');
      const header = doc.shadowRoot.querySelector('.main-header');
      return header !== null && getComputedStyle(header).display !== 'none';
    });
    assert.equal(headerVisible, true, 'Header should be visible');

    const infoVisible = await page.evaluate(() => {
      const doc = document.getElementById('thedoc');
      const info = doc.shadowRoot.querySelector('.section-info');
      return info !== null && getComputedStyle(info).display !== 'none';
    });
    assert.equal(infoVisible, false, 'Info section should be hidden');
  });

  it('respects alphabetical sort-tags attribute', async () => {
    await loadHarness(page, baseUrl, {
      spec: '/specs/01-sections.yaml',
      'render-style': 'read',
      'sort-tags': 'true',
    });

    const tagOrder = await page.evaluate(() => {
      const doc = document.getElementById('thedoc');
      const tags = Array.from(doc.shadowRoot.querySelectorAll('.nav-bar-section-title, .nav-bar-tag, .sub-title.tag'));
      return tags.map((t) => t.textContent.trim()).filter(Boolean);
    });

    // Check that Animals appears before Zebra when sorted
    const animalsIndex = tagOrder.findIndex((t) => t.includes('Animals'));
    const zebraIndex = tagOrder.findIndex((t) => t.includes('Zebra'));
    if (animalsIndex !== -1 && zebraIndex !== -1) {
      assert.ok(animalsIndex < zebraIndex, 'Animals should precede Zebra when sort-tags is true');
    }
  });

  it('updates route hash on endpoint navigation when update-route is true', async () => {
    await loadHarness(page, baseUrl, {
      spec: '/specs/01-sections.yaml',
      'render-style': 'read',
      'update-route': 'true',
      'route-prefix': '#test/',
    });

    // Click on nav item
    const clicked = await page.evaluate(() => {
      const doc = document.getElementById('thedoc');
      const navItem = doc.shadowRoot.querySelector('.nav-bar-tag[data-action="navigate"], .nav-bar-path[data-action="navigate"]');
      if (navItem) {
        navItem.click();
        return true;
      }
      return false;
    });
    assert.equal(clicked, true, 'Nav item should be found and clicked');

    await page.waitForTimeout(400);
    const hash = await page.evaluate(() => window.location.hash);
    assert.ok(hash.startsWith('#test/'), `Hash should start with #test/, got: ${hash}`);
  });
});
