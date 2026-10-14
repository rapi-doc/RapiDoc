import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createTestServer, launchTestBrowser, loadHarness } from '../helpers/test-harness.js';

describe('E2E: Request Payloads & Response Status Tabs', () => {
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

  it('renders file input for multipart/form-data payload', async () => {
    await loadHarness(page, baseUrl, {
      spec: '/specs/04-request-response.yaml',
      'render-style': 'read',
    });

    const hasFileInput = await page.evaluate(() => {
      const doc = document.getElementById('thedoc');
      const apiReq = doc.shadowRoot.querySelector('api-request');
      if (!apiReq || !apiReq.shadowRoot) return false;
      const fileInput = apiReq.shadowRoot.querySelector('input[type="file"]');
      return fileInput !== null;
    });
    assert.equal(hasFileInput, true, 'File input should be rendered for multipart binary property');
  });

  it('renders multiple response status code tabs', async () => {
    await loadHarness(page, baseUrl, {
      spec: '/specs/04-request-response.yaml',
      'render-style': 'read',
    });

    const statusTabs = await page.evaluate(() => {
      const doc = document.getElementById('thedoc');
      const apiResp = doc.shadowRoot.querySelector('api-response');
      if (!apiResp || !apiResp.shadowRoot) return [];
      const tabs = Array.from(apiResp.shadowRoot.querySelectorAll('[part*="btn-response-status"]'));
      return tabs.map((t) => t.textContent.trim()).filter(Boolean);
    });

    // Check that 201 or other status codes are rendered
    assert.ok(statusTabs.length >= 2, `Expected multiple response status buttons, found: ${statusTabs.join(', ')}`);
    assert.ok(
      statusTabs.some((t) => t.includes('201')),
      'Expected 201 status code tab'
    );
  });

  it('renders response headers when specified in spec', async () => {
    await loadHarness(page, baseUrl, {
      spec: '/specs/04-request-response.yaml',
      'render-style': 'read',
    });

    const headersRendered = await page.evaluate(() => {
      const doc = document.getElementById('thedoc');
      const apiResp = doc.shadowRoot.querySelector('api-response');
      if (!apiResp || !apiResp.shadowRoot) return false;
      const text = apiResp.shadowRoot.textContent;
      return text.includes('X-Upload-Id') || text.includes('RESPONSE HEADERS');
    });
    assert.equal(headersRendered, true, 'Response headers should be rendered in api-response');
  });

  it('preserves response schema and example display in focused mode after navigation or selection reset', async () => {
    await loadHarness(page, baseUrl, {
      spec: '/specs/04-request-response.yaml',
      'render-style': 'focused',
      'show-info': 'false',
    });

    const isSchemaVisible = await page.evaluate(async () => {
      const doc = document.getElementById('thedoc');
      await doc.scrollToPath('post-/files/upload');
      const apiResp = doc.shadowRoot.querySelector('api-response');
      if (!apiResp || !apiResp.shadowRoot) return false;
      const tabPanels = Array.from(apiResp.shadowRoot.querySelectorAll('[part="tab-panel"]'));
      return tabPanels.some((panel) => {
        const style = window.getComputedStyle(panel.closest('div[style*="display"]'));
        return style.display !== 'none';
      });
    });
    assert.equal(isSchemaVisible, true, 'Response schema tabs should remain visible after scrollToPath in focused mode');
  });
});
