import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createTestServer, launchTestBrowser, loadHarness } from '../helpers/test-harness.js';

describe('E2E: Dynamic Attribute Reactivity', () => {
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

  it('reactively updates theme preset and color-scheme attributes', async () => {
    await loadHarness(page, baseUrl, {
      spec: '/specs/01-sections.yaml',
      theme: 'amber',
      'color-scheme': 'dark',
    });

    const initialTheme = await page.evaluate(() => {
      const doc = document.getElementById('thedoc');
      return doc.getAttribute('theme');
    });
    assert.equal(initialTheme, 'amber');

    // Dynamically change theme to graphite
    await page.evaluate(() => {
      const doc = document.getElementById('thedoc');
      doc.setAttribute('theme', 'graphite');
      doc.setAttribute('color-scheme', 'light');
    });
    await page.waitForTimeout(200);

    const updatedState = await page.evaluate(() => {
      const doc = document.getElementById('thedoc');
      return {
        theme: doc.getAttribute('theme'),
        colorScheme: doc.getAttribute('color-scheme'),
      };
    });
    assert.equal(updatedState.theme, 'graphite');
    assert.equal(updatedState.colorScheme, 'light');
  });

  it('reactively toggles show-header at runtime', async () => {
    await loadHarness(page, baseUrl, {
      spec: '/specs/01-sections.yaml',
      'show-header': 'false',
    });

    let headerExists = await page.evaluate(() => {
      const doc = document.getElementById('thedoc');
      return doc.shadowRoot.querySelector('.main-header') !== null;
    });
    assert.equal(headerExists, false, 'Header should initially not exist');

    // Toggle header to true
    await page.evaluate(() => {
      const doc = document.getElementById('thedoc');
      doc.setAttribute('show-header', 'true');
    });
    await page.waitForTimeout(200);

    headerExists = await page.evaluate(() => {
      const doc = document.getElementById('thedoc');
      const h = doc.shadowRoot.querySelector('.main-header');
      return h !== null && getComputedStyle(h).display !== 'none';
    });
    assert.equal(headerExists, true, 'Header should be rendered after setAttribute');
  });

  it('reactively switches render-style from read to view', async () => {
    await loadHarness(page, baseUrl, {
      spec: '/specs/01-sections.yaml',
      'render-style': 'read',
    });

    let style = await page.evaluate(() => {
      const doc = document.getElementById('thedoc');
      return doc.getAttribute('render-style');
    });
    assert.equal(style, 'read');

    // Switch render-style to view
    await page.evaluate(() => {
      const doc = document.getElementById('thedoc');
      doc.setAttribute('render-style', 'view');
    });
    await page.waitForTimeout(200);

    style = await page.evaluate(() => {
      const doc = document.getElementById('thedoc');
      return doc.getAttribute('render-style');
    });
    assert.equal(style, 'view');
  });

  it('reactively switches layout from row to column', async () => {
    await loadHarness(page, baseUrl, {
      spec: '/specs/01-sections.yaml',
      'render-style': 'read',
      layout: 'row',
    });

    let layout = await page.evaluate(() => {
      const doc = document.getElementById('thedoc');
      return doc.getAttribute('layout');
    });
    assert.equal(layout, 'row');

    await page.evaluate(() => {
      const doc = document.getElementById('thedoc');
      doc.setAttribute('layout', 'column');
    });
    await page.waitForTimeout(200);

    layout = await page.evaluate(() => {
      const doc = document.getElementById('thedoc');
      return doc.getAttribute('layout');
    });
    assert.equal(layout, 'column');
  });

  it('reactively toggles schema-style between tree and table in request and response schemas', async () => {
    await loadHarness(page, baseUrl, {
      spec: '/specs/06-examples.yaml',
      'render-style': 'read',
      'schema-style': 'tree',
      'default-schema-tab': 'schema',
    });

    // Check request body initial schema style is schema-tree
    let hasSchemaTree = await page.evaluate(() => {
      const doc = document.getElementById('thedoc');
      const req = doc.shadowRoot.querySelector('api-request');
      return req?.shadowRoot.querySelector('schema-tree') !== null;
    });
    let hasSchemaTable = await page.evaluate(() => {
      const doc = document.getElementById('thedoc');
      const req = doc.shadowRoot.querySelector('api-request');
      return req?.shadowRoot.querySelector('schema-table') !== null;
    });
    assert.equal(hasSchemaTree, true, 'Request should initially render <schema-tree>');
    assert.equal(hasSchemaTable, false, 'Request should not render <schema-table>');

    // Dynamically switch schema-style to table
    await page.evaluate(() => {
      const doc = document.getElementById('thedoc');
      doc.setAttribute('schema-style', 'table');
    });
    await page.waitForTimeout(200);

    hasSchemaTree = await page.evaluate(() => {
      const doc = document.getElementById('thedoc');
      const req = doc.shadowRoot.querySelector('api-request');
      return req?.shadowRoot.querySelector('schema-tree') !== null;
    });
    hasSchemaTable = await page.evaluate(() => {
      const doc = document.getElementById('thedoc');
      const req = doc.shadowRoot.querySelector('api-request');
      return req?.shadowRoot.querySelector('schema-table') !== null;
    });
    assert.equal(hasSchemaTable, true, 'Request should reactively re-render to <schema-table>');
    assert.equal(hasSchemaTree, false, 'Request should no longer render <schema-tree>');

    // Switch back to tree
    await page.evaluate(() => {
      const doc = document.getElementById('thedoc');
      doc.setAttribute('schema-style', 'tree');
    });
    await page.waitForTimeout(200);

    hasSchemaTree = await page.evaluate(() => {
      const doc = document.getElementById('thedoc');
      const req = doc.shadowRoot.querySelector('api-request');
      return req?.shadowRoot.querySelector('schema-tree') !== null;
    });
    assert.equal(hasSchemaTree, true, 'Request should reactively switch back to <schema-tree>');
  });

  it('reactively toggles fill-request-fields-with-example for query parameters and body', async () => {
    await loadHarness(page, baseUrl, {
      spec: '/specs/06-examples.yaml',
      'render-style': 'read',
      'fill-request-fields-with-example': 'false',
    });

    let paramValue = await page.evaluate(() => {
      const doc = document.getElementById('thedoc');
      const req = doc.shadowRoot.querySelector('api-request');
      const input = req?.shadowRoot.querySelector('input.request-param');
      return input ? input.value : null;
    });
    assert.equal(paramValue, '', 'Parameter input should initially be empty');

    // Dynamically enable filling examples
    await page.evaluate(() => {
      const doc = document.getElementById('thedoc');
      doc.setAttribute('fill-request-fields-with-example', 'true');
    });
    await page.waitForTimeout(200);

    paramValue = await page.evaluate(() => {
      const doc = document.getElementById('thedoc');
      const req = doc.shadowRoot.querySelector('api-request');
      const input = req?.shadowRoot.querySelector('input.request-param');
      return input ? input.value : null;
    });
    assert.equal(paramValue, 'CUST-9876', 'Parameter input should reactively populate with example');
  });

  it('reactively toggles show-info and allow-try sections at runtime', async () => {
    await loadHarness(page, baseUrl, {
      spec: '/specs/01-sections.yaml',
      'render-style': 'read',
      'show-info': 'true',
      'allow-try': 'true',
    });

    let infoVisible = await page.evaluate(() => {
      const doc = document.getElementById('thedoc');
      return doc.shadowRoot.querySelector('#overview') !== null;
    });
    let tryBtnVisible = await page.evaluate(() => {
      const doc = document.getElementById('thedoc');
      const req = doc.shadowRoot.querySelector('api-request');
      return req?.shadowRoot.querySelector('button[part*="btn-try"]') !== null;
    });
    assert.equal(infoVisible, true, 'Overview should initially exist');
    assert.equal(tryBtnVisible, true, 'Try button should initially exist');

    // Dynamically hide info and disable try
    await page.evaluate(() => {
      const doc = document.getElementById('thedoc');
      doc.setAttribute('show-info', 'false');
      doc.setAttribute('allow-try', 'false');
    });
    await page.waitForTimeout(200);

    infoVisible = await page.evaluate(() => {
      const doc = document.getElementById('thedoc');
      return doc.shadowRoot.querySelector('#overview') !== null;
    });
    tryBtnVisible = await page.evaluate(() => {
      const doc = document.getElementById('thedoc');
      const req = doc.shadowRoot.querySelector('api-request');
      return req?.shadowRoot.querySelector('button[part*="btn-try"]') !== null;
    });
    assert.equal(infoVisible, false, 'Overview should be removed when show-info is false');
    assert.equal(tryBtnVisible, false, 'Try button should be removed when allow-try is false');
  });
});
