import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');

function findChromeExecutable() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  if (process.env.PLAYWRIGHT_CHROME_PATH) return process.env.PLAYWRIGHT_CHROME_PATH;
  const candidates = [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate;
  }
  throw new Error('No Chrome/Chromium binary found. Set CHROME_PATH.');
}

const TEST_SPEC = {
  openapi: '3.1.0',
  info: {
    title: 'Anchor Test API',
    version: '1.0.0',
    description: '# Overview\n\nSee the [status codes](#api-status-codes).\n\n## API status codes\n\nSome codes.',
  },
  paths: {
    '/ping': { get: { summary: 'Ping', responses: { 200: { description: 'See [the overview](#overview) for details.' } } } },
  },
};

// When the host page has a <base> tag, a bare `#anchor` link resolves against the base URL and leaves the page.
describe('markdown in-page anchor links on a page with a <base> tag', () => {
  let server;
  let browser;
  let baseUrl;

  before(async () => {
    server = http.createServer((req, res) => {
      const url = req.url.split('?')[0];
      if (url === '/rapidoc-min.js') {
        res.writeHead(200, { 'Content-Type': 'application/javascript; charset=utf-8' });
        return res.end(fs.readFileSync(path.join(rootDir, 'packages/rapidoc/dist/rapidoc-min.js')));
      }
      if (url === '/spec.json') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(TEST_SPEC));
      }
      const variant = /^\/(default|headings)\.html$/.exec(url)?.[1];
      if (variant) {
        const extra = variant === 'headings' ? 'info-description-headings-in-navbar="true"' : '';
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        return res.end(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <base href="${baseUrl}/somewhere-else/">
  <script type="module" src="/rapidoc-min.js"></script>
</head>
<body>
  <rapi-doc spec-url="/spec.json" render-style="read" show-header="false" ${extra}></rapi-doc>
</body>
</html>`);
      }
      res.writeHead(404);
      res.end('Not Found');
    });
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    baseUrl = `http://127.0.0.1:${server.address().port}`;
    browser = await chromium.launch({
      executablePath: findChromeExecutable(),
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
    });
  });

  after(async () => {
    if (browser) await browser.close();
    if (server) server.close();
  });

  for (const variant of ['default', 'headings']) {
    it(`keeps links of the info description on the current page (${variant} renderer)`, async () => {
      const page = await browser.newPage();
      await page.goto(`${baseUrl}/${variant}.html`, { waitUntil: 'networkidle' });
      const link = page.locator('rapi-doc a.anchor-link', { hasText: 'status codes' }).first();
      await link.waitFor({ state: 'attached', timeout: 5000 });
      assert.equal(await link.getAttribute('href'), `${baseUrl}/${variant}.html#api-status-codes`);
      await page.close();
    });
  }

  it('also fixes links in response descriptions', async () => {
    const page = await browser.newPage();
    await page.goto(`${baseUrl}/default.html`, { waitUntil: 'networkidle' });
    const link = page.locator('rapi-doc a.anchor-link', { hasText: 'the overview' }).first();
    await link.waitFor({ state: 'attached', timeout: 5000 });
    assert.equal(await link.getAttribute('href'), `${baseUrl}/default.html#overview`);
    await page.close();
  });
});
