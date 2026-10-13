import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createTestServer, launchTestBrowser, loadHarness } from '../helpers/test-harness.js';

describe('E2E: Schema Trees, Tables & Deep Nesting', () => {
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

  it('renders schemas in tree mode by default', async () => {
    await loadHarness(page, baseUrl, {
      spec: '/specs/03-schemas.yaml',
      'render-style': 'read',
      'schema-style': 'tree',
      'default-schema-tab': 'schema',
    });

    const hasSchemaTree = await page.evaluate(() => {
      const doc = document.getElementById('thedoc');
      const resp = doc.shadowRoot.querySelector('api-response');
      return !!(resp && resp.shadowRoot && resp.shadowRoot.querySelector('schema-tree'));
    });
    assert.equal(hasSchemaTree, true, 'schema-tree component should be rendered inside api-response');
  });

  it('renders schemas in table mode when schema-style="table"', async () => {
    await loadHarness(page, baseUrl, {
      spec: '/specs/03-schemas.yaml',
      'render-style': 'read',
      'schema-style': 'table',
      'default-schema-tab': 'schema',
    });

    const hasSchemaTable = await page.evaluate(() => {
      const doc = document.getElementById('thedoc');
      const resp = doc.shadowRoot.querySelector('api-response');
      return !!(resp && resp.shadowRoot && resp.shadowRoot.querySelector('schema-table'));
    });
    assert.equal(hasSchemaTable, true, 'schema-table component should be rendered inside api-response');
  });

  it('renders markdown tables inside schema property descriptions', async () => {
    await loadHarness(page, baseUrl, {
      spec: '/specs/03-schemas.yaml',
      'render-style': 'read',
      'schema-style': 'tree',
      'default-schema-tab': 'schema',
      'schema-expand-level': 'all',
      'schema-description-expanded': 'true',
    });

    const tableFound = await page.evaluate(() => {
      const doc = document.getElementById('thedoc');
      const resp = doc.shadowRoot.querySelector('api-response');
      const tree = resp && resp.shadowRoot ? resp.shadowRoot.querySelector('schema-tree') : null;
      return !!(tree && tree.shadowRoot && tree.shadowRoot.querySelector('table'));
    });
    assert.equal(tableFound, true, 'Markdown table should be rendered inside schema property description');
  });

  it('renders deprecated indicator on schema properties', async () => {
    await loadHarness(page, baseUrl, {
      spec: '/specs/03-schemas.yaml',
      'render-style': 'read',
      'schema-style': 'tree',
      'default-schema-tab': 'schema',
    });

    const hasDeprecated = await page.evaluate(() => {
      const doc = document.getElementById('thedoc');
      const resp = doc.shadowRoot.querySelector('api-response');
      const tree = resp && resp.shadowRoot ? resp.shadowRoot.querySelector('schema-tree') : null;
      return !!(
        tree &&
        tree.shadowRoot &&
        (tree.shadowRoot.querySelector('.deprecated, [class*="deprecated"]') ||
          tree.shadowRoot.textContent.toLowerCase().includes('deprecated'))
      );
    });
    assert.equal(hasDeprecated, true, 'Deprecated property should have visual indicator');
  });
});
