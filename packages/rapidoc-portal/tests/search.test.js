import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

import { stripMarkup, extractDocSections, indexOpenApiSpec, buildSearchIndex, searchRecords } from '../src/search/indexer.js';
import { loadConfig } from '../src/config/loader.js';
import { buildPortal } from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DEMO_PORTAL_DIR = process.env.RAPIDOC_DEMO_PORTAL_DIR ?? path.resolve(__dirname, '../../../../demo-api-portal/fixtures/zudoku-cosmo-cargo');

test('RapiDoc Portal Full-Text Search Engine (Milestone 5)', async (t) => {
  await t.test('stripMarkup should strip frontmatter, markdoc tags, code blocks and formatting', () => {
    const raw = `---
title: Test Page
---
# Heading
{% callout type="info" %}Alert message{% /callout %}
Some paragraph with **bold** and \`inline code\`.
\`\`\`javascript
const secret = 42;
\`\`\`
Visit [Our Docs](https://example.com) for details.`;

    const cleaned = stripMarkup(raw);
    assert.strictEqual(cleaned.includes('title: Test Page'), false);
    assert.strictEqual(cleaned.includes('{% callout'), false);
    assert.strictEqual(cleaned.includes('const secret'), false);
    assert.strictEqual(cleaned.includes('Some paragraph with bold and inline code.'), true);
    assert.strictEqual(cleaned.includes('Visit Our Docs for details.'), true);
  });

  await t.test('extractDocSections should extract headings and section anchors', () => {
    const markdown = `# Main Title
First intro paragraph.

## Section One
Content under section one.

### Sub Section
Content under subsection.`;

    const sections = extractDocSections(markdown, '/docs/test', 'Test Page');
    assert.strictEqual(sections.length, 3);
    assert.strictEqual(sections[0].title, 'Main Title');
    assert.strictEqual(sections[0].url, '/docs/test#main-title');
    assert.strictEqual(sections[1].title, 'Section One');
    assert.strictEqual(sections[1].url, '/docs/test#section-one');
    assert.strictEqual(sections[2].title, 'Sub Section');
    assert.strictEqual(sections[2].url, '/docs/test#sub-section');
  });

  await t.test('indexOpenApiSpec should index operations from OpenAPI YAML spec', () => {
    const apiConfig = {
      id: 'orders',
      title: 'BrewCraft Orders API',
      path: '/apis/orders',
      fullPath: path.join(DEMO_PORTAL_DIR, 'specs/orders-api.yaml'),
    };

    const records = indexOpenApiSpec(apiConfig);
    assert.ok(records.length >= 3, 'Orders API should have multiple operations');

    const createOrder = records.find((r) => r.method === 'POST' && r.endpoint === '/orders');
    assert.ok(createOrder, 'POST /orders operation should be found');
    assert.strictEqual(createOrder.type, 'api');
    assert.strictEqual(createOrder.title, 'Create an order');
    assert.strictEqual(createOrder.category, 'BrewCraft Orders API');
    assert.strictEqual(createOrder.url, '/apis/orders#createOrder');
  });

  await t.test('buildSearchIndex should build unified index across demo-api-portal docs & specs', async () => {
    const { config } = await loadConfig(DEMO_PORTAL_DIR);
    const docFiles = [
      path.join(DEMO_PORTAL_DIR, 'docs/getting-started.md'),
      path.join(DEMO_PORTAL_DIR, 'docs/guides/order-fulfillment.markdoc'),
      path.join(DEMO_PORTAL_DIR, 'docs/tutorials/table-reservation-flow.mdx'),
    ];

    const index = buildSearchIndex(config, DEMO_PORTAL_DIR, docFiles);
    assert.ok(index.totalRecords > 15, 'Index should contain doc and API records');

    // Test in-memory search
    const orderResults = searchRecords(index.records, 'orders');
    assert.ok(orderResults.length > 0, 'Searching for "orders" should yield results');

    // Test filter 'doc'
    const docResults = searchRecords(index.records, 'order', { filter: 'doc' });
    assert.ok(
      docResults.every((r) => r.type === 'doc'),
      'All results should be type doc'
    );

    // Test filter 'api'
    const apiResults = searchRecords(index.records, 'orders', { filter: 'api' });
    assert.ok(
      apiResults.every((r) => r.type === 'api'),
      'All results should be type api'
    );
  });

  await t.test('buildPortal should generate dist/search-index.json during SSG build', async () => {
    const tempOutDir = fs.mkdtempSync(path.join(os.tmpdir(), 'rapidoc-search-test-'));
    try {
      const result = await buildPortal(DEMO_PORTAL_DIR, { outDir: tempOutDir });
      assert.strictEqual(result.success, true);
      assert.ok(result.apisCount > 0, 'APIs should be compiled');

      const searchIndexPath = path.join(result.outDir, 'search-index.json');
      assert.strictEqual(fs.existsSync(searchIndexPath), true);

      const parsedJson = JSON.parse(fs.readFileSync(searchIndexPath, 'utf8'));
      assert.strictEqual(parsedJson.version, 1);
      assert.ok(Array.isArray(parsedJson.records));
      assert.ok(parsedJson.records.length > 0);
    } finally {
      if (fs.existsSync(tempOutDir)) {
        try {
          fs.rmSync(tempOutDir, { recursive: true, force: true, maxRetries: 3 });
        } catch {
          // Cleanup
        }
      }
    }
  });
});
