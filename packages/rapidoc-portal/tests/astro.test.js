import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { buildStarlightSidebar, createStarlightConfig, prepareAstroWorkspace, loadConfig } from '../src/index.js';

describe('RapiDoc Portal Astro + Starlight Engine Bridge', () => {
  const DEMO_PORTAL_DIR = '/Users/mrin/work/demo-api-portal';

  it('should generate valid Starlight sidebar structure from portal config', () => {
    const mockNav = [
      {
        title: 'Space Operations',
        items: [
          { label: 'Shipping Process', path: '/docs/shipping-process' },
          { label: 'Tracking', path: '/docs/tracking' },
        ],
      },
    ];
    const mockApis = [
      { id: 'shipments', title: 'Shipment API', path: '/apis/shipments', category: 'Core' },
      { id: 'labels', title: 'Labels API', path: '/catalog/api-label', category: 'Printing' },
    ];

    const sidebar = buildStarlightSidebar(mockNav, mockApis);

    // Verify guides group
    assert.equal(sidebar.length, 2);
    assert.equal(sidebar[0].label, 'Space Operations');
    assert.equal(sidebar[0].items.length, 2);
    assert.equal(sidebar[0].items[0].link, '/docs/shipping-process');

    // Verify APIs group
    assert.equal(sidebar[1].label, 'API Reference');
    assert.equal(sidebar[1].items.length, 2);
    assert.equal(sidebar[1].items[0].label, 'Shipment API');
    assert.equal(sidebar[1].items[0].link, '/apis/shipments');
    assert.equal(sidebar[1].items[0].badge?.text, 'Core');
  });

  it('should create complete Starlight configuration object', async () => {
    const { config } = await loadConfig(DEMO_PORTAL_DIR);
    const { starlightConfig, customCssContent } = createStarlightConfig(config);

    assert.equal(starlightConfig.title, 'Cosmo Cargo Inc.');
    assert.ok(starlightConfig.sidebar.length > 0);
    assert.ok(customCssContent.includes('--sl-color-accent: #f76b39'));
    assert.ok(customCssContent.includes('.rapidoc-fullscreen-portal'));
  });

  it('should scaffold complete .rapidoc workspace for demo-api-portal', async () => {
    const { workspaceDir, config } = await prepareAstroWorkspace(DEMO_PORTAL_DIR);

    assert.ok(fs.existsSync(workspaceDir), '.rapidoc workspace directory should exist');
    assert.ok(fs.existsSync(path.join(workspaceDir, 'astro.config.mjs')), 'astro.config.mjs should exist');
    assert.ok(fs.existsSync(path.join(workspaceDir, 'src/content.config.ts')), 'content.config.ts should exist');
    assert.ok(fs.existsSync(path.join(workspaceDir, 'src/pages/[...apiRoute].astro')), '[...apiRoute].astro should exist');
    assert.ok(fs.existsSync(path.join(workspaceDir, 'src/pages/catalog.astro')), 'catalog.astro should exist');
    assert.ok(fs.existsSync(path.join(workspaceDir, 'src/pages/index.astro')), 'index.astro should exist');
    assert.ok(fs.existsSync(path.join(workspaceDir, 'src/styles/starlight-custom.css')), 'custom CSS should exist');
    assert.ok(fs.existsSync(path.join(workspaceDir, 'rapidoc.portal.json')), 'portal config JSON should exist');
    assert.ok(fs.existsSync(path.join(workspaceDir, 'public/assets/rapidoc-min.js')), 'rapidoc-min.js asset should exist');

    // Verify docs were copied and normalized
    const docsDir = path.join(workspaceDir, 'src/content/docs/docs');
    assert.ok(fs.existsSync(docsDir), 'Docs content directory should exist');
    const docFiles = fs.readdirSync(docsDir);
    assert.ok(docFiles.length > 5, 'Should contain documentation files');

    // Verify frontmatter normalization on getting-started.md
    const gettingStartedContent = fs.readFileSync(path.join(docsDir, 'getting-started.md'), 'utf8');
    assert.ok(gettingStartedContent.startsWith('---'), 'Should have frontmatter injected');
    assert.ok(
      gettingStartedContent.includes('title: "Welcome to the BrewCraft Developer Platform"'),
      'Should extract first heading as title'
    );
  });

  it('should compile demo-api-portal into static HTML with buildPortalWithAstro', async () => {
    const { buildPortalWithAstro } = await import('../src/index.js');
    const result = await buildPortalWithAstro(DEMO_PORTAL_DIR, { outDir: 'dist-test-astro' });

    assert.equal(result.success, true);
    assert.equal(result.apisCount, 9);
    assert.ok(fs.existsSync(result.outDir), 'Output directory should exist');
    assert.ok(fs.existsSync(path.join(result.outDir, 'catalog/index.html')), 'Catalog index.html should exist');
    assert.ok(fs.existsSync(path.join(result.outDir, 'apis/shipments/index.html')), 'RapiDoc DSD API index.html should exist');
    assert.ok(fs.existsSync(path.join(result.outDir, 'docs/documentation/index.html')), 'Starlight Docs index.html should exist');

    // Clean up test output dir
    fs.rmSync(result.outDir, { recursive: true, force: true });
  });
});
