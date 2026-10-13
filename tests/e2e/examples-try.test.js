import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createTestServer, launchTestBrowser, loadHarness } from '../helpers/test-harness.js';

describe('E2E: Example Values & Try-It-Out Console', () => {
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

  it('pre-populates form inputs when fill-request-fields-with-example="true"', async () => {
    await loadHarness(page, baseUrl, {
      spec: '/specs/06-examples.yaml',
      'render-style': 'read',
      'fill-request-fields-with-example': 'true',
    });

    const inputValue = await page.evaluate(() => {
      const doc = document.getElementById('thedoc');
      const req = doc.shadowRoot.querySelector('api-request');
      const input = req && req.shadowRoot ? req.shadowRoot.querySelector('input[type="text"]') : null;
      return input ? input.value : null;
    });
    assert.equal(inputValue, 'CUST-9876', 'Parameter input should be pre-filled with example value');
  });

  it('leaves form inputs empty when fill-request-fields-with-example="false"', async () => {
    await loadHarness(page, baseUrl, {
      spec: '/specs/06-examples.yaml',
      'render-style': 'read',
      'fill-request-fields-with-example': 'false',
    });

    const inputValue = await page.evaluate(() => {
      const doc = document.getElementById('thedoc');
      const req = doc.shadowRoot.querySelector('api-request');
      const input = req && req.shadowRoot ? req.shadowRoot.querySelector('input[type="text"]') : null;
      return input ? input.value : null;
    });
    assert.equal(inputValue, '', 'Parameter input should be blank when fill-request-fields-with-example is false');
  });

  it('displays cURL preview prior to request when show-curl-before-try="true"', async () => {
    await loadHarness(page, baseUrl, {
      spec: '/specs/07-mock-try.yaml',
      'render-style': 'read',
      'show-curl-before-try': 'true',
    });

    const hasCurl = await page.evaluate(() => {
      const doc = document.getElementById('thedoc');
      const req = doc.shadowRoot.querySelector('api-request');
      return req && req.shadowRoot ? req.shadowRoot.textContent.includes('curl') : false;
    });
    assert.equal(hasCurl, true, 'cURL command preview should be visible in request panel');
  });

  it('executes mock request via TRY button and displays live response', async () => {
    await loadHarness(page, baseUrl, {
      spec: '/specs/07-mock-try.yaml',
      'render-style': 'read',
      'allow-try': 'true',
    });

    // Click TRY button
    const tryExecuted = await page.evaluate(async () => {
      const doc = document.getElementById('thedoc');
      const req = doc.shadowRoot.querySelector('api-request');
      if (!req || !req.shadowRoot) return false;
      const tryBtn = req.shadowRoot.querySelector('button[part*="btn-try"], .btn-try, .primary');
      if (!tryBtn) return false;
      tryBtn.click();
      return true;
    });
    assert.equal(tryExecuted, true, 'TRY button should be found and clicked');

    await page.waitForTimeout(600);

    // Verify response status or text appears in request panel
    const hasResponse = await page.evaluate(() => {
      const doc = document.getElementById('thedoc');
      const req = doc.shadowRoot.querySelector('api-request');
      const text = req && req.shadowRoot ? req.shadowRoot.textContent : '';
      return text.includes('RESPONSE') || text.includes('200') || text.includes('Hello');
    });
    assert.equal(hasResponse, true, 'Response payload should be rendered after execution');
  });
});
