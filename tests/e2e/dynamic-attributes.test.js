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
});
