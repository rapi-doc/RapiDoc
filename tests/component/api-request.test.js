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
    '/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary',
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

  throw new Error('No Chrome/Chromium binary found.');
}

const TEST_SPEC = {
  openapi: '3.1.0',
  info: { title: 'Test API', version: '1.0.0' },
  paths: {
    '/users/{userId}': {
      get: {
        summary: 'Get single user',
        parameters: [
          {
            name: 'userId',
            in: 'path',
            required: true,
            schema: { type: 'integer', example: 123 },
          },
          {
            name: 'includeDetails',
            in: 'query',
            schema: { type: 'boolean', default: false },
          },
          {
            name: 'X-Custom-Header',
            in: 'header',
            schema: { type: 'string', example: 'test-header-val' },
          },
        ],
        responses: {
          200: {
            description: 'Success',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    id: { type: 'integer' },
                    name: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        summary: 'Create user with multiple examples',
        parameters: [
          {
            name: 'userId',
            in: 'path',
            required: true,
            schema: { type: 'integer', example: 123 },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  role: { type: 'string' },
                },
              },
              examples: {
                standardUser: {
                  summary: 'Standard User Example',
                  value: { name: 'Alice', role: 'developer' },
                },
                adminUser: {
                  summary: 'Admin User Example',
                  value: { name: 'Bob', role: 'admin' },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Created',
          },
        },
      },
    },
    '/upload': {
      post: {
        summary: 'Upload multiple files',
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  photos: {
                    type: 'array',
                    items: {
                      type: 'string',
                      format: 'binary',
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Uploaded',
          },
        },
      },
    },
  },
};

describe('api-request Lit Component Tests', () => {
  let server;
  let browser;
  let context;
  let page;
  let baseUrl;
  const pageErrors = [];

  before(async () => {
    // 1. Start test HTTP server
    server = http.createServer((req, res) => {
      const url = req.url.split('?')[0];

      if (url === '/rapidoc-min.js') {
        const bundle = fs.readFileSync(path.join(rootDir, 'packages/rapidoc/dist/rapidoc-min.js'));
        res.writeHead(200, { 'Content-Type': 'application/javascript; charset=utf-8' });
        return res.end(bundle);
      }

      if (url === '/spec.json') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(TEST_SPEC));
      }

      if (url === '/api/users/123') {
        res.writeHead(200, {
          'Content-Type': 'application/json',
          'X-Server-Time': '100ms',
        });
        return res.end(JSON.stringify({ id: 123, name: 'Alice', status: 'active' }));
      }

      if (url === '/' || url === '/index.html') {
        const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <script type="module" src="/rapidoc-min.js"></script>
</head>
<body style="margin:0; background:#090d16; color:#fff;">
  <rapi-doc
    id="thedoc"
    spec-url="/spec.json"
    render-style="read"
    show-header="false"
    allow-try="true"
  ></rapi-doc>
</body>
</html>`;
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        return res.end(html);
      }

      res.writeHead(404);
      res.end('Not Found');
    });

    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    const port = server.address().port;
    baseUrl = `http://127.0.0.1:${port}`;

    // Update spec server URL to point to this mock server
    TEST_SPEC.servers = [{ url: `${baseUrl}/api/` }];

    // 2. Launch browser with playwright-core
    const chromePath = findChromeExecutable();
    browser = await chromium.launch({
      executablePath: chromePath,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
    });

    context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    page = await context.newPage();

    page.on('pageerror', (err) => {
      pageErrors.push(err.message || String(err));
    });

    await page.goto(baseUrl, { waitUntil: 'networkidle' });
    await page.locator('rapi-doc api-request').first().waitFor({ state: 'attached', timeout: 5000 });
  });

  after(async () => {
    if (browser) await browser.close();
    if (server) server.close();
  });

  it('renders parameters with path, query, and header inputs', async () => {
    const getRequest = page.locator('api-request[method="get"]');
    await getRequest.waitFor({ state: 'visible' });

    // Verify parameter inputs exist via Playwright automatic Shadow DOM piercing
    const pathInput = getRequest.locator('input[data-ptype="path"]');
    const queryInput = getRequest.locator('input[data-ptype="query"]');
    const headerInput = getRequest.locator('input[data-ptype="header"]');

    assert.equal(await pathInput.inputValue(), '123');
    assert.equal(await queryInput.inputValue(), '');
    assert.equal(await headerInput.inputValue(), 'test-header-val');
  });

  it('handles CLEAR and FILL EXAMPLE buttons cleanly', async () => {
    const getRequest = page.locator('api-request[method="get"]');
    const pathInput = getRequest.locator('input[data-ptype="path"]');

    // Click CLEAR
    await getRequest.locator('button[part~="btn-clear"]').click();
    assert.equal(await pathInput.inputValue(), '');

    // Click FILL EXAMPLE
    await getRequest.locator('button[part~="btn-fill"]').click();
    assert.equal(await pathInput.inputValue(), '123');
  });

  it('executes TRY request and renders response without ChildPart errors', async () => {
    const getRequest = page.locator('api-request[method="get"]');
    const tryBtn = getRequest.locator('button[part~="btn-try"]');

    // First TRY click
    await tryBtn.click();

    // Wait for response status badge
    const responseMsg = getRequest.locator('.response-message');
    await responseMsg.waitFor({ state: 'visible' });
    const statusText = await responseMsg.textContent();
    assert.ok(statusText.includes('200') || statusText.includes('OK'), `Expected 200 response, got: ${statusText}`);

    // Verify response body rendered in code block
    const responseCode = getRequest.locator('.tab-panel code.language-json');
    await responseCode.waitFor({ state: 'visible' });
    const codeContent = await responseCode.textContent();
    assert.ok(codeContent.includes('"id": 123'), 'Expected response body to contain id: 123');
    assert.ok(codeContent.includes('"name": "Alice"'), 'Expected response body to contain name: Alice');

    // Verify zero page errors
    assert.equal(pageErrors.length, 0, `Encountered unexpected page errors: ${pageErrors.join(', ')}`);
  });

  it('switches between RESPONSE, RESPONSE HEADERS, and CURL tabs', async () => {
    const getRequest = page.locator('api-request[method="get"]');

    // Switch to RESPONSE HEADERS
    const headersTabBtn = getRequest.locator('button[data-tab="headers"]');
    await headersTabBtn.click();
    const headersCode = getRequest.locator('code.language-css');
    await headersCode.waitFor({ state: 'visible' });
    const headerText = await headersCode.textContent();
    assert.ok(headerText.includes('content-type'), 'Expected headers tab to contain content-type');

    // Switch to CURL
    const curlTabBtn = getRequest.locator('button[data-tab="curl"]');
    await curlTabBtn.click();
    const curlCode = getRequest.locator('code.language-shell');
    await curlCode.waitFor({ state: 'visible' });
    const curlText = await curlCode.textContent();
    assert.ok(curlText.includes('curl -X GET'), 'Expected curl tab to contain curl command');

    // Switch back to RESPONSE
    const responseTabBtn = getRequest.locator('button[data-tab="response"]');
    await responseTabBtn.click();
    const responseCode = getRequest.locator('code.language-json');
    assert.ok(await responseCode.isVisible());
  });

  it('handles CLEAR RESPONSE action and allows re-trying cleanly', async () => {
    const getRequest = page.locator('api-request[method="get"]');

    // Click CLEAR RESPONSE
    const clearRespBtn = getRequest.locator('button[part~="btn-clear-response"]');
    await clearRespBtn.click();

    // Response panel should be removed from DOM
    assert.equal(await getRequest.locator('.response-message').count(), 0);

    // Re-try (Second click)
    const tryBtn = getRequest.locator('button[part~="btn-try"]');
    await tryBtn.click();

    const responseMsg = getRequest.locator('.response-message');
    await responseMsg.waitFor({ state: 'visible' });
    assert.ok((await responseMsg.textContent()).includes('200'));
    assert.equal(pageErrors.length, 0);
  });

  it('supports request body example dropdown selection and editing', async () => {
    const postRequest = page.locator('api-request[path="/users/{userId}"][method="post"]');
    await postRequest.waitFor({ state: 'visible' });

    // Initial example is standardUser
    const standardTextarea = postRequest.locator('.example-selected textarea.request-body-param-user-input');
    await standardTextarea.waitFor({ state: 'visible' });

    const initialText = await standardTextarea.inputValue();
    assert.ok(initialText.includes('Alice'), 'Initial textarea should contain Alice');
    assert.ok(initialText.includes('developer'), 'Initial textarea should contain developer');

    // Switch to adminUser example
    const selectEl = postRequest.locator('select');
    await selectEl.selectOption('adminUser');

    const adminTextarea = postRequest.locator('.example-selected textarea.request-body-param-user-input');
    await adminTextarea.waitFor({ state: 'visible' });

    // Wait for the text to contain Bob
    await page.waitForFunction(() => {
      const ta = document
        .querySelector('rapi-doc')
        ?.shadowRoot?.querySelector('api-request[method="post"]')
        ?.shadowRoot?.querySelector('.example-selected textarea.request-body-param-user-input');
      return ta && ta.value.includes('Bob');
    });

    const textBeforeFill = await adminTextarea.inputValue();
    assert.ok(textBeforeFill.includes('Bob'), `Textarea should update to contain Bob, got: ${textBeforeFill}`);

    // User edits active textarea
    await adminTextarea.click();
    await adminTextarea.fill('{"name": "Charlie", "role": "manager"}');
    const textAfterFill = await adminTextarea.inputValue();
    assert.ok(textAfterFill.includes('Charlie'), `Expected textarea to contain Charlie, got: ${textAfterFill}`);

    // Zero page errors
    assert.equal(pageErrors.length, 0);
  });

  it('supports adding and removing dynamic file inputs for array of files', async () => {
    const uploadRequest = page.locator('api-request[path="/upload"]');
    await uploadRequest.waitFor({ state: 'visible' });

    // Initial file input count should be 1
    const fileInputs = uploadRequest.locator('.file-input-container input[type="file"]');
    assert.equal(await fileInputs.count(), 1);

    // Click ADD button to add a new file input row
    const addBtn = uploadRequest.locator('.file-input-add-btn');
    await addBtn.click();
    assert.equal(await fileInputs.count(), 2);

    // Click ADD button again
    await addBtn.click();
    assert.equal(await fileInputs.count(), 3);

    // Click the remove button on the second file input set
    const removeButtons = uploadRequest.locator('.file-input-remove-btn');
    assert.equal(await removeButtons.count(), 3);
    await removeButtons.nth(1).click();
    assert.equal(await fileInputs.count(), 2);

    // Zero page errors
    assert.equal(pageErrors.length, 0);
  });

  it('supports schema tree collapse and tab switching without ChildPart errors', async () => {
    const postRequest = page.locator('api-request[method="post"][path="/users/{userId}"]');
    await postRequest.waitFor({ state: 'visible' });

    // Switch to SCHEMA tab in request body
    const schemaTabBtn = postRequest.locator('.request-body-container button[data-tab="schema"]');
    await schemaTabBtn.click();

    // Verify schema-tree is visible
    const schemaTree = postRequest.locator('.request-body-container schema-tree');
    await schemaTree.waitFor({ state: 'visible' });

    // Click on open-bracket to collapse the schema tree object
    const openBracket = schemaTree.locator('.open-bracket.object').first();
    await openBracket.waitFor({ state: 'visible' });
    await openBracket.click();

    // Verify row is collapsed
    const rowEl = schemaTree.locator('.tr.object').first();
    const classAttrAfterCollapse = await rowEl.getAttribute('class');
    assert.ok(classAttrAfterCollapse.includes('collapsed'), 'Expected row to be collapsed');

    // Switch tab back to EXAMPLE
    const exampleTabBtn = postRequest.locator('.request-body-container button[data-tab="example"]');
    await exampleTabBtn.click();

    // Switch tab back to SCHEMA again
    await schemaTabBtn.click();

    // Click open-bracket to expand again
    await openBracket.click();
    const classAttrAfterExpand = await rowEl.getAttribute('class');
    assert.ok(classAttrAfterExpand.includes('expanded'), 'Expected row to be expanded');

    // Switch back to EXAMPLE tab once more
    await exampleTabBtn.click();

    // Ensure zero page errors occurred (specifically avoiding ChildPart marker ejection errors)
    assert.equal(pageErrors.length, 0);
  });
});
