import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createTestServer, launchTestBrowser } from '../helpers/test-harness.js';

async function openPage(page, baseUrl, params = {}) {
  await page.goto(`${baseUrl}/page-scroll-harness.html?${new URLSearchParams(params)}`, { waitUntil: 'load' });
  await page.waitForFunction(() => {
    const doc = document.getElementById('thedoc');
    return doc?.shadowRoot && !doc.loading && doc.shadowRoot.querySelector('.expanded-endpoint-body');
  });
}

const scheme = (page) => page.evaluate(() => document.getElementById('thedoc').getAttribute('color-scheme'));
const background = (page) =>
  page.evaluate(() => getComputedStyle(document.getElementById('thedoc')).getPropertyValue('--background').trim());

async function setPageTheme(page, theme) {
  await page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), theme);
  await page.waitForTimeout(100);
}

describe('E2E: color-scheme="auto"', () => {
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

  it("follows the page's CSS color-scheme, including when the page theme is toggled", async () => {
    await openPage(page, baseUrl, { 'color-scheme': 'auto' });
    assert.equal(await scheme(page), 'dark');
    const darkBackground = await background(page);

    await setPageTheme(page, 'light');
    assert.equal(await scheme(page), 'light');
    assert.notEqual(await background(page), darkBackground, 'light tokens should apply');

    await setPageTheme(page, 'dark');
    assert.equal(await scheme(page), 'dark');
  });

  it('falls back to the OS preference when the page declares no color-scheme', async () => {
    await page.emulateMedia({ colorScheme: 'light' });
    await openPage(page, baseUrl, { 'color-scheme': 'auto', 'page-scheme': 'false' });
    assert.equal(await scheme(page), 'light');

    await page.emulateMedia({ colorScheme: 'dark' });
    await page.waitForTimeout(100);
    assert.equal(await scheme(page), 'dark');
  });

  it('an explicit color-scheme set later turns auto mode off', async () => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await openPage(page, baseUrl, { 'color-scheme': 'auto' });
    await page.evaluate(() => document.getElementById('thedoc').setAttribute('color-scheme', 'light'));
    await setPageTheme(page, 'light');
    await setPageTheme(page, 'dark');
    assert.equal(await scheme(page), 'light');
  });

  it('can be switched on by setting the colorScheme property', async () => {
    await openPage(page, baseUrl, { 'color-scheme': 'light' });
    await page.evaluate(() => {
      document.getElementById('thedoc').colorScheme = 'auto';
    });
    await page.waitForTimeout(100);
    assert.equal(await scheme(page), 'dark');

    await setPageTheme(page, 'light');
    assert.equal(await scheme(page), 'light');
  });

  it('existing values keep working: dark, light and system', async () => {
    for (const value of ['dark', 'light', 'system']) {
      await openPage(page, baseUrl, { 'color-scheme': value });
      assert.equal(await scheme(page), value);
    }
  });

  it('<rapi-doc-mini> supports auto too', async () => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await openPage(page, baseUrl);
    const miniScheme = () => page.evaluate(() => document.getElementById('mini').getAttribute('color-scheme'));
    await page.evaluate(() => {
      const mini = document.createElement('rapi-doc-mini');
      mini.id = 'mini';
      mini.setAttribute('spec-url', '/specs/01-sections.yaml');
      mini.setAttribute('color-scheme', 'auto');
      document.body.append(mini);
    });
    await page.waitForTimeout(100);
    assert.equal(await miniScheme(), 'dark');

    await setPageTheme(page, 'light');
    assert.equal(await miniScheme(), 'light');
  });
});
