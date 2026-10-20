import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { loadConfig, normalizeConfig, RapidocConfigSchema, generateMigratedConfig, findConfigFile } from '../src/index.js';

describe('RapiDoc Portal Configuration Engine (Milestone 2)', () => {
  const DEMO_PORTAL_DIR = '/Users/mrin/work/demo-api-portal';

  it('should load and normalize rapidoc.config.yaml from demo-api-portal', async () => {
    const loaded = await loadConfig(DEMO_PORTAL_DIR);

    assert.equal(loaded.isFallback, false);
    assert.equal(loaded.format, 'yaml');
    assert.ok(loaded.configPath.endsWith('rapidoc.config.yaml'));

    const { config } = loaded;

    // Site checks
    assert.equal(config.site.title, 'Cosmo Cargo Inc.');

    // APIs checks (9 specs)
    assert.equal(config.apis.length, 9);
    const shipmentsApi = config.apis.find((a) => a.id === 'shipments');
    assert.ok(shipmentsApi);
    assert.equal(shipmentsApi.title, 'Shipment API');
    assert.equal(shipmentsApi.path, '/apis/shipments');
    assert.equal(shipmentsApi.isRemote, false);
    assert.ok(fs.existsSync(shipmentsApi.fullPath));

    const interplanetaryApi = config.apis.find((a) => a.id === 'interplanetary');
    assert.ok(interplanetaryApi);

    // Docs checks
    assert.ok(fs.existsSync(config.docs.fullPath));

    // Navigation checks
    // Navigation checks
    assert.ok(config.navigation.length >= 4);
    assert.equal(config.navigation[0].title, 'General Information');

    // RapiDoc options checks
    assert.equal(config.rapidoc['render-style'], 'read');
    assert.equal(config.rapidoc['schema-style'], 'tree');
    assert.equal(config.rapidoc['primary-color'], '#f76b39');
    assert.equal(config.rapidoc['show-header'], 'false');
    assert.equal(config.rapidoc['show-side-nav'], 'false');

    // Search checks
    assert.equal(config.search.enabled, true);
    assert.equal(config.search.provider, 'pagefind');
  });

  it('should tolerantly accept Redocly-style config (root, sidebars, theme.openapi)', () => {
    const redoclyRaw = {
      site: { title: 'Redocly Ported Portal' },
      apis: {
        billing: {
          root: './specs/billing.yaml',
          path: '/billing',
        },
      },
      sidebars: [
        {
          group: 'Guides',
          items: ['intro.md', { label: 'Billing API', api: 'billing' }],
        },
      ],
      theme: {
        openapi: {
          renderStyle: 'focused',
          primaryColor: '#6366f1',
        },
      },
    };

    const validated = RapidocConfigSchema.parse(redoclyRaw);
    const normalized = normalizeConfig(validated, '/tmp');

    assert.equal(normalized.apis.length, 1);
    assert.equal(normalized.apis[0].id, 'billing');
    assert.equal(normalized.apis[0].root, './specs/billing.yaml');
    assert.equal(normalized.navigation.length, 1);
    assert.equal(normalized.navigation[0].title, 'Guides');
    assert.equal(normalized.navigation[0].items[1].type, 'api');
    assert.equal(normalized.rapidoc['render-style'], 'focused');
    assert.equal(normalized.rapidoc['primary-color'], '#6366f1');
  });

  it('should tolerantly accept Zudoku-style config (input, navigation array, docs.files)', () => {
    const zudokuRaw = {
      site: { title: 'Zudoku Ported Portal' },
      apis: [
        {
          input: 'https://example.com/petstore.yaml',
          path: '/petstore',
          title: 'Petstore API',
        },
      ],
      docs: {
        files: './pages',
        engine: 'mdx',
      },
      navigation: [
        {
          title: 'Documentation',
          items: ['introduction', { label: 'Petstore', to: '/petstore' }],
        },
      ],
      rapidoc: {
        renderStyle: 'read',
      },
    };

    const validated = RapidocConfigSchema.parse(zudokuRaw);
    const normalized = normalizeConfig(validated, '/tmp');

    assert.equal(normalized.apis.length, 1);
    assert.equal(normalized.apis[0].isRemote, true);
    assert.equal(normalized.apis[0].root, 'https://example.com/petstore.yaml');
    assert.equal(normalized.docs.engine, 'mdx');
    assert.equal(normalized.rapidoc['render-style'], 'read');
  });

  it('should auto-detect and parse fallback redocly.yaml and sidebars.yaml', async () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'rapidoc-fallback-test-'));

    try {
      // Create redocly.yaml
      fs.writeFileSync(
        path.join(tmpDir, 'redocly.yaml'),
        `
apis:
  v1:
    root: ./openapi.yaml
    path: /api/v1
theme:
  openapi:
    theme: dark
`
      );

      // Create sidebars.yaml
      fs.writeFileSync(
        path.join(tmpDir, 'sidebars.yaml'),
        `
- group: Getting Started
  items:
    - label: Welcome
      page: welcome.md
`
      );

      const loaded = await loadConfig(tmpDir);
      assert.equal(loaded.isFallback, true);
      assert.equal(loaded.config.apis.length, 1);
      assert.equal(loaded.config.apis[0].id, 'v1');
      assert.equal(loaded.config.navigation.length, 1);
      assert.equal(loaded.config.navigation[0].title, 'Getting Started');
      assert.equal(loaded.config.navigation[0].items[0].label, 'Welcome');
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  it('should generate migrated rapidoc.config.yaml from redocly project', async () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'rapidoc-migrator-test-'));

    try {
      fs.writeFileSync(
        path.join(tmpDir, 'redocly.yaml'),
        `
apis:
  inventory:
    root: ./inventory.yaml
    title: Inventory API
`
      );

      const migratedYaml = await generateMigratedConfig(tmpDir);
      assert.ok(migratedYaml.includes('Inventory API'));
      assert.ok(migratedYaml.includes('render-style: focused'));
      assert.ok(migratedYaml.includes('inventory.yaml'));
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  it('should throw validation error when an API item has no root, input, or spec', () => {
    const invalidConfig = {
      apis: {
        badApi: {
          title: 'Missing Spec Path',
        },
      },
    };

    assert.throws(() => {
      RapidocConfigSchema.parse(invalidConfig);
    });
  });
});
