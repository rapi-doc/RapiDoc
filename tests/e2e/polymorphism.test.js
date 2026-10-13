import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createTestServer, launchTestBrowser, loadHarness } from '../helpers/test-harness.js';

describe('E2E: Polymorphism, oneOf Variants & allOf Composition', () => {
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

  it('renders oneOf variant selector tabs when no discriminator is specified', async () => {
    await loadHarness(page, baseUrl, {
      spec: '/specs/08-oneof-polymorphism.yaml',
      'render-style': 'read',
    });

    const hasVariantTabs = await page.evaluate(() => {
      const doc = document.getElementById('thedoc');
      const requests = Array.from(doc.shadowRoot.querySelectorAll('api-request'));
      const notifReq = requests[1];
      if (!notifReq || !notifReq.shadowRoot) return false;
      const text = notifReq.shadowRoot.textContent;
      return text.includes('Email') && text.includes('SMS') && text.includes('Push');
    });

    assert.equal(hasVariantTabs, true, 'Variant selector tabs (Email, SMS, Push) should be rendered');
  });

  it('merges allOf inheritance properties into a unified schema view', async () => {
    await loadHarness(page, baseUrl, {
      spec: '/specs/08-oneof-polymorphism.yaml',
      'render-style': 'read',
      'default-schema-tab': 'schema',
    });

    const hasMergedProperties = await page.evaluate(() => {
      const doc = document.getElementById('thedoc');
      const responses = Array.from(doc.shadowRoot.querySelectorAll('api-response'));
      const profileResp = responses[2];
      const tree = profileResp && profileResp.shadowRoot ? profileResp.shadowRoot.querySelector('schema-tree') : null;
      const treeText = tree && tree.shadowRoot ? tree.shadowRoot.textContent : '';
      return treeText.includes('username') && treeText.includes('createdAt') && treeText.includes('permissions');
    });

    assert.equal(hasMergedProperties, true, 'allOf properties from BaseEntity, UserCredentials, and child should be merged');
  });
});
