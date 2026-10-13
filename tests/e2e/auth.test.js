import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createTestServer, launchTestBrowser, loadHarness } from '../helpers/test-harness.js';

describe('E2E: Authentication & Security Schemes', () => {
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

  it('renders authentication link in navigation when allow-authentication is true', async () => {
    await loadHarness(page, baseUrl, {
      spec: '/specs/05-auth.yaml',
      'render-style': 'read',
      'allow-authentication': 'true',
    });

    const hasAuthLink = await page.evaluate(() => {
      const doc = document.getElementById('thedoc');
      return doc.shadowRoot.querySelector('#link-auth') !== null;
    });
    assert.equal(hasAuthLink, true, 'Authentication navigation link should be visible');
  });

  it('hides authentication link when allow-authentication is false', async () => {
    await loadHarness(page, baseUrl, {
      spec: '/specs/05-auth.yaml',
      'render-style': 'read',
      'allow-authentication': 'false',
    });

    const hasAuthLink = await page.evaluate(() => {
      const doc = document.getElementById('thedoc');
      return doc.shadowRoot.querySelector('#link-auth') !== null;
    });
    assert.equal(hasAuthLink, false, 'Authentication link should be hidden when allow-authentication is false');
  });

  it('renders multiple security schemes (API Key, Bearer JWT, OAuth2)', async () => {
    await loadHarness(page, baseUrl, {
      spec: '/specs/05-auth.yaml',
      'render-style': 'read',
      'allow-authentication': 'true',
    });

    const schemesDetected = await page.evaluate(() => {
      const doc = document.getElementById('thedoc');
      const text = doc.shadowRoot.textContent;
      return {
        apiKey: text.includes('HeaderApiKey') || text.includes('X-API-KEY'),
        bearer: text.includes('BearerAuth') || text.includes('bearer') || text.includes('JWT'),
        oauth2: text.includes('OAuth2Auth') || text.includes('oauth2'),
      };
    });

    assert.equal(schemesDetected.apiKey, true, 'Header API Key scheme should be displayed');
    assert.equal(schemesDetected.bearer, true, 'Bearer JWT scheme should be displayed');
    assert.equal(schemesDetected.oauth2, true, 'OAuth2 scheme should be displayed');
  });
});
