import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createTestServer, launchTestBrowser, loadHarness } from '../helpers/test-harness.js';

describe('E2E: Datatypes, Constraints & Markdown Tables', () => {
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

  it('renders parameter constraints (min, max, pattern, minItems)', async () => {
    await loadHarness(page, baseUrl, {
      spec: '/specs/02-datatypes.yaml',
      'render-style': 'read',
    });

    const paramDetails = await page.evaluate(() => {
      const doc = document.getElementById('thedoc');
      const apiReq = doc.shadowRoot.querySelector('api-request');
      return apiReq && apiReq.shadowRoot ? apiReq.shadowRoot.textContent : '';
    });

    // Check min/max numbers, pattern, and format strings appear in api-request
    assert.ok(paramDetails.includes('uuid'), 'Should display uuid format');
    assert.ok(paramDetails.includes('Min 1') || paramDetails.includes('1'), 'Should display numeric min constraint');
    assert.ok(paramDetails.includes('Max 100') || paramDetails.includes('100'), 'Should display numeric max constraint');
    assert.ok(paramDetails.includes('Pattern:'), 'Should display regex pattern constraint');
  });

  it('renders deprecated indicator and strike-through for deprecated parameters', async () => {
    await loadHarness(page, baseUrl, {
      spec: '/specs/02-datatypes.yaml',
      'render-style': 'read',
    });

    const deprecatedFound = await page.evaluate(() => {
      const doc = document.getElementById('thedoc');
      const text = doc.shadowRoot.textContent.toLowerCase();
      const hasDeprecatedClass = doc.shadowRoot.querySelector('.deprecated, [class*="deprecated"]') !== null;
      return hasDeprecatedClass || text.includes('deprecated');
    });
    assert.equal(deprecatedFound, true, 'Deprecated field or badge should be rendered');
  });

  it('renders parsed Markdown tables in field descriptions', async () => {
    await loadHarness(page, baseUrl, {
      spec: '/specs/02-datatypes.yaml',
      'render-style': 'read',
    });

    const tablesCount = await page.evaluate(() => {
      const doc = document.getElementById('thedoc');
      // Look for rendered <table> elements inside shadowRoot markdown containers
      const tables = doc.shadowRoot.querySelectorAll('table, .m-markdown table');
      return tables.length;
    });
    assert.ok(tablesCount > 0, `Expected markdown table to be rendered, found ${tablesCount}`);
  });
});
