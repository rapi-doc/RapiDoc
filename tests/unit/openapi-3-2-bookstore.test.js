import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ProcessSpec from '../../packages/rapidoc/src/utils/spec-parser.js';
import themeTokens from '../../packages/rapidoc/src/styles/theme-tokens.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test('OpenAPI 3.2 bookstore spec parsing', async (t) => {
  const bookstoreYamlPath = path.resolve(__dirname, '../../docs/public/specs/bookstore.yaml');
  const bookstoreYamlContent = fs.readFileSync(bookstoreYamlPath, 'utf8');

  const parsedSpec = await ProcessSpec.call(
    {},
    bookstoreYamlContent,
    false, // generateMissingTags
    false, // sortTags
    false, // sortSchemas
    'method' // sortEndpointsBy
  );

  await t.test('spec metadata parses cleanly without errors', () => {
    assert.equal(parsedSpec.specLoadError, false);
    assert.equal(parsedSpec.info.title, 'RapiDoc Bookstore API');
    assert.ok(parsedSpec.tags.length > 0, 'Should have tags');
  });

  await t.test('native QUERY method is parsed with requestBody under Books tag', () => {
    const booksTag = parsedSpec.tags.find((tag) => tag.name === 'Books');
    assert.ok(booksTag, 'Books tag should exist');

    const queryEndpoint = booksTag.paths.find((p) => p.method === 'query');
    assert.ok(queryEndpoint, 'QUERY /books endpoint should be registered');
    assert.equal(queryEndpoint.path, '/books');
    assert.equal(queryEndpoint.elementId, 'query-books');
    assert.equal(queryEndpoint.summary, 'Advanced catalog search');
    assert.ok(queryEndpoint.requestBody, 'QUERY method must support requestBody');
    assert.ok(queryEndpoint.requestBody.content['application/json'], 'QUERY should have application/json body');
  });

  await t.test('native TRACE method is parsed under System tag', () => {
    const systemTag = parsedSpec.tags.find((tag) => tag.name === 'System');
    assert.ok(systemTag, 'System tag should exist');

    const traceEndpoint = systemTag.paths.find((p) => p.method === 'trace');
    assert.ok(traceEndpoint, 'TRACE /diagnostics endpoint should be registered');
    assert.equal(traceEndpoint.path, '/diagnostics');
    assert.equal(traceEndpoint.elementId, 'trace-diagnostics');
    assert.equal(traceEndpoint.summary, 'Diagnostic loopback trace');
  });

  await t.test('OpenAPI 3.2 additionalOperations (COPY and PURGE) are parsed', () => {
    const booksTag = parsedSpec.tags.find((tag) => tag.name === 'Books');
    assert.ok(booksTag, 'Books tag should exist');

    const copyEndpoint = booksTag.paths.find((p) => p.method === 'copy');
    assert.ok(copyEndpoint, 'COPY /books/{bookId} endpoint should be parsed');
    assert.equal(copyEndpoint.path, '/books/{bookId}');
    assert.equal(copyEndpoint.summary, 'Duplicate book listing');
    assert.ok(copyEndpoint.requestBody, 'COPY method should have requestBody');

    const purgeEndpoint = booksTag.paths.find((p) => p.method === 'purge');
    assert.ok(purgeEndpoint, 'PURGE /books/{bookId} endpoint should be parsed');
    assert.equal(purgeEndpoint.path, '/books/{bookId}');
    assert.equal(purgeEndpoint.summary, 'Purge book cache from edge CDN');
  });

  await t.test('Callbacks are attached to POST /orders operation', () => {
    const ordersTag = parsedSpec.tags.find((tag) => tag.name === 'Orders');
    assert.ok(ordersTag, 'Orders tag should exist');

    const postOrder = ordersTag.paths.find((p) => p.method === 'post' && p.path === '/orders');
    assert.ok(postOrder, 'POST /orders endpoint should exist');
    assert.ok(postOrder.callbacks, 'POST /orders should have callbacks defined');
    assert.ok(postOrder.callbacks.onOrderStatusChange, 'onOrderStatusChange callback should exist');
  });

  await t.test('Webhooks are parsed and indexed', () => {
    const allPaths = parsedSpec.tags.flatMap((tag) => tag.paths);
    const webhooks = allPaths.filter((p) => p.isWebhook);
    assert.ok(webhooks.length >= 2, 'Should have at least 2 webhooks parsed');
    const newBookWebhook = webhooks.find((p) => p.path === 'newBookPublished');
    assert.ok(newBookWebhook, 'newBookPublished webhook should exist');
    const inventoryWebhook = webhooks.find((p) => p.path === 'inventoryAlert');
    assert.ok(inventoryWebhook, 'inventoryAlert webhook should exist');
  });

  await t.test('Endpoints are correctly ordered with sortEndpointsBy="method"', () => {
    const booksTag = parsedSpec.tags.find((tag) => tag.name === 'Books');
    const methods = booksTag.paths.map((p) => p.method);

    // Standard methods come in standard order: get, put, post, delete, ..., trace, query, followed by additional operations
    const getIndex = methods.indexOf('get');
    const putIndex = methods.indexOf('put');
    const postIndex = methods.indexOf('post');
    const deleteIndex = methods.indexOf('delete');
    const queryIndex = methods.indexOf('query');
    const copyIndex = methods.indexOf('copy');
    const purgeIndex = methods.indexOf('purge');

    assert.ok(getIndex < putIndex, 'GET should precede PUT');
    assert.ok(putIndex < postIndex, 'PUT should precede POST in supportedMethods');
    assert.ok(postIndex < deleteIndex, 'POST should precede DELETE');
    assert.ok(deleteIndex < queryIndex, 'DELETE should precede QUERY');
    assert.ok(queryIndex < copyIndex, 'QUERY should precede custom COPY');
    assert.ok(queryIndex < purgeIndex, 'QUERY should precede custom PURGE');
  });

  await t.test('Theme tokens include --method-query, --method-trace, and --method-default', () => {
    const cssText = themeTokens.cssText;
    assert.ok(cssText.includes('--method-query'), 'Theme tokens must define --method-query');
    assert.ok(cssText.includes('--method-trace'), 'Theme tokens must define --method-trace');
    assert.ok(cssText.includes('--method-default'), 'Theme tokens must define --method-default');
  });
});
