import { test } from 'node:test';
import assert from 'node:assert/strict';
import { activeTab } from '../src/components/header-nav.js';
import { resolveConfig } from '../src/config/loader.js';

const config = resolveConfig(
  {
    site: { title: 'Acme' },
    header: { links: [{ label: 'Login', href: '/login' }] },
    navigation: [
      { label: 'Guides', items: ['intro', { label: 'Advanced', autogenerate: 'advanced' }] },
      { label: 'Reference', items: ['reference/errors'] },
      { label: 'Orders', api: 'orders' },
      { label: 'API Catalog', catalog: true },
      { label: 'Blog', href: 'https://example.com/blog' },
    ],
    apis: [
      { id: 'orders', spec: 'https://example.com/orders.yaml', title: 'Orders API' },
      { id: 'labels', spec: 'https://example.com/labels.yaml' },
    ],
  },
  '/tmp'
);

test('tabs link to their first page, API page or catalog', () => {
  assert.deepEqual(
    config.tabs.map((t) => [t.label, t.kind, t.href]),
    [
      ['Guides', 'docs', '/docs/intro/'],
      ['Reference', 'docs', '/docs/reference/errors/'],
      ['Orders', 'api', '/apis/orders'],
      ['API Catalog', 'catalog', '/catalog'],
      ['Blog', 'link', 'https://example.com/blog'],
    ]
  );
});

test('activeTab picks the longest matching prefix', () => {
  const tab = (path) => activeTab(config.tabs, path)?.label;
  assert.equal(tab('/docs/intro/'), 'Guides');
  assert.equal(tab('/docs/advanced/retries/'), 'Guides');
  assert.equal(tab('/docs/reference/errors/'), 'Reference');
  assert.equal(tab('/docs/unlisted/'), 'Guides', 'pages in no tab belong to the first documentation tab');
  assert.equal(tab('/apis/orders/shipping/'), 'Orders');
  assert.equal(tab('/catalog/'), 'API Catalog');
  assert.equal(tab('/apis/labels/'), 'API Catalog', 'APIs without a tab belong to the catalog tab');
  assert.equal(tab('/apis/orders-v2/'), undefined);
  assert.equal(tab('/'), undefined);
});
