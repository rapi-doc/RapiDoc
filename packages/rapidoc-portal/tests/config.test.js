import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';
import { ConfigError, convertConfig, generateMigratedConfig, loadConfig, migrateConfig, resolveConfig } from '../src/index.js';
import { configJsonSchema } from '../src/config/json-schema.js';
import { plainSummary } from '../src/config/normalizer.js';

const DEMO_PORTAL_DIR = process.env.RAPIDOC_DEMO_PORTAL_DIR ?? fileURLToPath(new URL('../../../../demo-api-portal', import.meta.url));

async function withTempDir(files, fn) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rapidoc-config-test-'));
  try {
    for (const [name, content] of Object.entries(files)) {
      fs.mkdirSync(path.dirname(path.join(dir, name)), { recursive: true });
      fs.writeFileSync(path.join(dir, name), content);
    }
    return await fn(dir);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

/** The problems a config is rejected with. */
function problemsOf(raw) {
  try {
    resolveConfig(raw, '/tmp');
  } catch (err) {
    assert.ok(err instanceof ConfigError, err.message);
    return err.problems;
  }
  assert.fail('config should be rejected');
}

describe('rapidoc.config.yaml (v2)', () => {
  it('loads demo-api-portal', async () => {
    const { config, format, configPath } = await loadConfig(DEMO_PORTAL_DIR);
    assert.equal(format, 'yaml');
    assert.ok(configPath.endsWith('rapidoc.config.yaml'));

    assert.equal(config.site.title, 'Cosmo Cargo Inc.');
    assert.equal(config.site.logo.light, '/logo.svg');
    assert.equal(config.site.banner.dismissible, true);
    assert.deepEqual(config.theme, {
      primary: '#f76b39',
      mode: 'dark',
      fonts: {
        sans: { family: 'Inter', url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap' },
        mono: null,
      },
    });

    assert.deepEqual(
      config.tabs.map((t) => [t.label, t.kind, t.href]),
      [
        ['Documentation', 'docs', '/docs/documentation/'],
        ['Shipments', 'api', '/apis/shipments'],
        ['API Catalog', 'catalog', '/catalog'],
      ]
    );
    assert.deepEqual(
      config.header.links.map((l) => l.label),
      ['Solutions', 'Products', 'Login']
    );

    assert.equal(config.apis.length, 9);
    const shipments = config.apis.find((a) => a.id === 'shipments');
    assert.equal(shipments.path, '/apis/shipments');
    assert.equal(shipments.isRemote, false);
    assert.ok(fs.existsSync(shipments.fullPath));
    assert.ok(
      config.apis.every((a) => a.path === `/apis/${a.id}`),
      'every API is at /apis/<id>'
    );
    assert.deepEqual(config.redirects, [{ from: '/apis', to: '/catalog' }], '/apis redirects to the catalog');

    assert.ok(fs.existsSync(config.docs.fullPath));
    assert.equal(config.docs.home, true, 'docs/index.markdoc is the home page');
    assert.deepEqual(config.rapidoc, { 'render-style': 'read', 'schema-style': 'tree' });
    assert.equal(config.search, true);
  });

  it('fills defaults and reads API titles from the spec', async () => {
    await withTempDir(
      { 'specs/orders.yaml': 'openapi: 3.1.0\ninfo:\n  title: Orders API\n  version: 2.1.0\n  description: Place orders.\npaths: {}\n' },
      (dir) => {
        const config = resolveConfig({ site: { title: 'Acme' }, apis: [{ id: 'orders', spec: './specs/orders.yaml' }] }, dir);
        const [orders] = config.apis;
        assert.equal(orders.title, 'Orders API');
        assert.equal(orders.description, 'Place orders.');
        assert.equal(orders.summary, 'Place orders.');
        assert.equal(orders.version, '2.1.0');
        assert.equal(orders.path, '/apis/orders');
        assert.equal(orders.category, 'General');
        assert.equal(config.theme.mode, 'auto');
        assert.equal(config.site.logo.text, 'Acme', 'no logo image: the title is the wordmark');
        assert.equal(config.footer.branding, true);
        assert.deepEqual(config.tabs, []);
      }
    );
  });

  it('summarizes a Markdown API description as plain text for the catalog', () => {
    assert.equal(
      plainSummary('# Orders\n\nThe **Orders API** places [orders](https://x) for `snake_case` ids.\n\n## Start\n\n```sh\ncurl\n```'),
      'The Orders API places orders for snake_case ids.'
    );
    assert.equal(plainSummary(undefined), '');
  });

  it('loads a font from Google Fonts unless it has a url', () => {
    const { fonts } = resolveConfig(
      {
        site: { title: 'Acme' },
        theme: { fonts: { sans: { family: 'IBM Plex Sans' }, mono: { family: 'Mono', url: '/fonts/mono.css' } } },
      },
      '/tmp'
    ).theme;
    assert.equal(fonts.sans.url, 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&display=swap');
    assert.equal(fonts.mono.url, '/fonts/mono.css');
  });

  it('accepts a footer call to action and newsletter, and checks them', () => {
    const footer = {
      cta: {
        title: 'Ready?',
        links: [
          { label: 'Start', href: '/docs/intro' },
          { label: 'Sales', href: '/contact', style: 'button' },
        ],
      },
      newsletter: { action: 'https://example.com/subscribe', field: 'EMAIL' },
    };
    assert.deepEqual(resolveConfig({ site: { title: 'Acme' }, footer }, '/tmp').footer.cta, footer.cta);
    const problems = problemsOf({
      site: { title: 'Acme' },
      footer: { cta: { links: [{ label: 'Start', href: '/x', style: 'ghost' }] }, newsletter: { title: 'News' } },
    });
    assert.ok(
      problems.some((p) => p.startsWith('footer.cta.title')),
      problems.join('\n')
    );
    assert.ok(
      problems.some((p) => p.startsWith('footer.cta.links[0].style')),
      problems.join('\n')
    );
    assert.ok(
      problems.some((p) => p.startsWith('footer.newsletter.action')),
      problems.join('\n')
    );
  });

  it('rejects unknown keys with their path and the v2 name', () => {
    const problems = problemsOf({
      site: { title: 'Acme', tagline: 'Hi' },
      navigation: [
        {
          label: 'Docs',
          items: [
            { label: 'Intro', path: '/docs/intro' },
            { group: 'More', items: ['faq'] },
          ],
        },
      ],
      apis: [{ id: 'orders', root: './orders.yaml' }],
    });
    assert.ok(problems.includes('site: unknown key "tagline"'), problems.join('\n'));
    assert.ok(problems.includes('navigation[0].items[1]: unknown key "group" (use label)'), problems.join('\n'));
    assert.ok(problems.includes('navigation[0].items[0]: unknown key "path" (use href (links) or slug (doc pages))'), problems.join('\n'));
    assert.ok(problems.includes('apis[0]: unknown key "root" (use spec)'), problems.join('\n'));
  });

  it('has no apis[].path: every API is at /apis/<id>', () => {
    const problems = problemsOf({ site: { title: 'Acme' }, apis: [{ id: 'orders', spec: './o.yaml', path: '/catalog/orders' }] });
    assert.deepEqual(problems, ['apis[0]: unknown key "path" (every API is at /apis/<id>; add a `redirects` entry from the old URL)']);
    const { redirects } = resolveConfig(
      {
        site: { title: 'Acme' },
        apis: [{ id: 'orders', spec: 'https://example.com/o.yaml' }],
        redirects: [{ from: '/apis/', to: '/docs/apis' }],
      },
      '/tmp'
    );
    assert.deepEqual(redirects, [{ from: '/apis/', to: '/docs/apis' }], 'a configured /apis redirect wins');
  });

  it('tells navigation item kinds apart by their keys', () => {
    const problems = problemsOf({
      site: { title: 'Acme' },
      navigation: [{ label: 'Docs', items: [{ href: '/x' }] }, { label: 'Both', api: 'a', href: '/x' }, { label: 'None' }],
      apis: [{ id: 'a', spec: 'https://example.com/a.yaml' }],
    });
    assert.ok(problems.includes('navigation[0].items[0].label: A link, group or autogenerated group needs a label'), problems.join('\n'));
    assert.ok(
      problems.includes('navigation[1]: A navigation tab can have only one of: items, autogenerate, api, catalog, href (found api, href)')
    );
    assert.ok(problems.includes('navigation[2]: A navigation tab needs one of: items, autogenerate, api, catalog, href'));
  });

  it('checks references between sections and attributes the portal manages', () => {
    const problems = problemsOf({
      site: { title: 'Acme' },
      navigation: [{ label: 'Orders', api: 'order' }],
      apis: [
        { id: 'orders', spec: 'https://example.com/orders.yaml' },
        { id: 'orders', spec: 'https://example.com/orders-v2.yaml' },
      ],
      rapidoc: { 'show-header': false, 'primary-color': '#000', 'render-style': 'read' },
    });
    assert.deepEqual(problems, [
      'apis[1].id: "orders" is used by another API',
      'navigation[0].api: no API with id "order" in apis (ids: orders)',
      'rapidoc.show-header: set by the portal',
      'rapidoc.primary-color: set by the portal; use theme.primary',
    ]);
  });

  it('points Redocly and Zudoku projects to rapidoc migrate', async () => {
    await withTempDir({ 'redocly.yaml': 'apis: {}\n' }, (dir) =>
      assert.rejects(loadConfig(dir), /Found redocly\.yaml.*rapidoc migrate --from redocly/s)
    );
  });

  it('ships an up-to-date schema.json (npm run schema)', () => {
    const committed = JSON.parse(fs.readFileSync(new URL('../schema.json', import.meta.url), 'utf8'));
    assert.deepEqual(committed, configJsonSchema());
    assert.equal(committed.additionalProperties, false);
  });
});

describe('rapidoc migrate', () => {
  it('converts a v1 config: header links become tabs and header links, old keys get v2 names', () => {
    const { config, problems } = convertConfig(
      {
        site: {
          title: 'Acme',
          logo: { text: 'ACME', icon: '🚀' },
          announcement: { text: 'New!', link: '/docs/new', bgColor: '#f00' },
          headerLinks: [
            { label: 'Docs', href: '/docs/intro' },
            { label: 'Orders', href: '/apis/orders' },
            { label: 'Catalog', href: '/catalog' },
            { label: 'Products', items: [{ label: 'Boxes', href: '/docs/boxes', features: [{ label: 'Sizes', path: '/docs/sizes' }] }] },
            { label: 'Login', href: '/login' },
          ],
          footer: { copyright: '© Acme', branding: 'powered by RapiDoc' },
        },
        docs: { path: './docs', toc: true },
        apis: [{ id: 'orders', root: './orders.yaml', path: '/apis/orders', featured: true }],
        navigation: [
          {
            title: 'Start',
            icon: 'rocket',
            items: [
              { label: 'Intro', path: '/docs/intro' },
              { label: 'Orders API', api: 'orders' },
            ],
          },
        ],
        rapidoc: { 'render-style': 'read', 'show-header': 'false', 'color-scheme': 'dark', 'primary-color': '#f76b39' },
        theme: { font: { name: 'Inter', url: 'https://fonts.example/inter.css' } },
      },
      'v1'
    );
    assert.deepEqual(problems, []);
    assert.deepEqual(config, {
      site: { title: 'Acme', logo: { text: 'ACME' }, banner: { message: 'New!', href: '/docs/new', background: '#f00' } },
      theme: { primary: '#f76b39', mode: 'dark', fonts: { sans: { family: 'Inter', url: 'https://fonts.example/inter.css' } } },
      header: {
        links: [
          { label: 'Products', items: [{ label: 'Boxes', href: '/docs/boxes', items: [{ label: 'Sizes', href: '/docs/sizes' }] }] },
          { label: 'Login', href: '/login' },
        ],
      },
      navigation: [
        {
          label: 'Docs',
          icon: 'book',
          items: [
            {
              label: 'Start',
              items: [
                { label: 'Intro', slug: 'intro' },
                { label: 'Orders API', api: 'orders' },
              ],
            },
          ],
        },
        { label: 'Orders', icon: 'code', api: 'orders' },
        { label: 'Catalog', icon: 'grid', catalog: true },
      ],
      apis: [{ id: 'orders', spec: './orders.yaml' }],
      footer: { copyright: '© Acme' },
      rapidoc: { 'render-style': 'read' },
    });
  });

  it('converts a Redocly project with sidebars.yaml', async () => {
    await withTempDir(
      {
        'redocly.yaml':
          'apis:\n  inventory:\n    root: ./inventory.yaml\n    title: Inventory API\ntheme:\n  openapi:\n    primaryColor: "#6366f1"\n',
        'sidebars.yaml': '- group: Getting Started\n  items:\n    - label: Welcome\n      page: welcome.md\n',
      },
      async (dir) => {
        const { content, problems } = await generateMigratedConfig(dir, 'redocly');
        assert.deepEqual(problems, []);
        assert.ok(content.startsWith('# yaml-language-server: $schema='));
        const config = YAML.parse(content);
        assert.deepEqual(config.apis, [{ id: 'inventory', spec: './inventory.yaml', title: 'Inventory API' }]);
        assert.equal(config.theme.primary, '#6366f1');
        assert.deepEqual(config.navigation[0].items, [{ label: 'Getting Started', items: [{ label: 'Welcome', slug: 'welcome' }] }]);
        assert.ok(config.navigation.some((tab) => tab.catalog));
      }
    );
  });

  it('converts a Zudoku config: its top-level navigation items are the tabs', () => {
    const { config, problems } = convertConfig(
      {
        site: { title: 'Zudoku Portal', logo: { src: { light: '/light.svg', dark: '/dark.svg' } } },
        apis: { type: 'file', input: './openapi.yaml', path: '/api' },
        docs: { files: '/pages/**/*.{md,mdx}' },
        navigation: [
          { type: 'category', label: 'Docs', icon: 'book', items: ['introduction', { type: 'doc', file: 'guides/auth', label: 'Auth' }] },
          { type: 'link', to: '/api', label: 'API Reference' },
        ],
      },
      'zudoku'
    );
    assert.deepEqual(problems, []);
    assert.deepEqual(config.navigation, [
      { label: 'Docs', icon: 'book', items: ['introduction', { label: 'Auth', slug: 'guides/auth' }] },
      { label: 'API Reference', api: 'openapi' },
    ]);
    assert.deepEqual(config.apis, [{ id: 'openapi', spec: './openapi.yaml' }]);
    assert.deepEqual(config.redirects, [{ from: '/api', to: '/apis/openapi' }], 'the old API URL redirects to /apis/<id>');
    assert.deepEqual(config.docs, { dir: './pages' });
    assert.deepEqual(config.site.logo, { src: { light: '/light.svg', dark: '/dark.svg' } });
  });

  it('writes rapidoc.config.yaml next to the source config, and replaces one only with overwrite', async () => {
    await withTempDir(
      { 'redocly.yaml': 'seo:\n  title: Inventory\napis:\n  inventory: https://example.com/inventory.yaml\n' },
      async (dir) => {
        const result = await migrateConfig(dir, { from: 'redocly' });
        assert.equal(result.filePath, path.join(dir, 'rapidoc.config.yaml'));
        const { config } = await loadConfig(dir);
        assert.equal(config.site.title, 'Inventory');
        assert.deepEqual(
          config.tabs.map((t) => t.kind),
          ['catalog']
        );
        await assert.rejects(migrateConfig(dir, { from: 'redocly' }), /File already exists/);
        await migrateConfig(dir, { from: 'redocly', overwrite: true });
      }
    );
  });

  it('migrates only Redocly and Zudoku configs', () => {
    assert.throws(() => convertConfig({}, 'v1'), /Unknown migration source "v1". Use one of: redocly, zudoku/);
  });
});
