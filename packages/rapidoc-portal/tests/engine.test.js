import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildPortal, buildStarlightSidebar, loadConfig } from '../src/index.js';
import { createStarlightOptions } from '../src/engine/starlight-options.js';
import { renderThemeCss } from '../src/engine/theme-css.js';
import { createPortalWorkspace, removePortalWorkspace, resolveDependencyRoot, WORKSPACE_DIRNAME } from '../src/engine/temp-workspace.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEMO_PORTAL_DIR = process.env.RAPIDOC_DEMO_PORTAL_DIR ?? path.resolve(__dirname, '../../../../demo-api-portal');

/** Relative paths of every entry under dir, skipping .git and never following symlinks. */
function listTree(dir, base = dir) {
  const entries = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '.git') continue;
    const fullPath = path.join(dir, entry.name);
    entries.push(path.relative(base, fullPath));
    if (entry.isDirectory()) entries.push(...listTree(fullPath, base));
  }
  return entries.sort();
}

describe('RapiDoc Portal build engine', () => {
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

    // Verify docs sidebar only contains narrative docs by default
    assert.equal(sidebar.length, 1);
    assert.equal(sidebar[0].label, 'Space Operations');
    assert.equal(sidebar[0].items.length, 2);
    assert.equal(sidebar[0].items[0].link, '/docs/shipping-process');

    // Verify APIs group can be included if explicitly requested via options
    const sidebarWithApis = buildStarlightSidebar(mockNav, mockApis, { includeApis: true });
    assert.equal(sidebarWithApis.length, 2);
    assert.equal(sidebarWithApis[1].label, 'API Reference');
    assert.equal(sidebarWithApis[1].items.length, 2);
    assert.equal(sidebarWithApis[1].items[0].label, 'Shipment API');
    assert.equal(sidebarWithApis[1].items[0].link, '/apis/shipments');
    assert.equal(sidebarWithApis[1].items[0].badge?.text, 'Core');
  });

  it('should create Starlight options and theme CSS from the portal config', async () => {
    const { config } = await loadConfig(DEMO_PORTAL_DIR);
    const options = createStarlightOptions(config);
    const themeCss = renderThemeCss(config);

    assert.equal(options.title, 'Cosmo Cargo Inc.');
    assert.ok(options.sidebar.length > 0);
    assert.ok(path.isAbsolute(options.components.Header), 'component overrides should be absolute paths');
    assert.ok(themeCss.includes('--sl-color-accent: #f76b39'));
    assert.ok(themeCss.includes('.rapidoc-fullscreen-portal'));
    assert.ok(!themeCss.includes('__PORTAL_PRIMARY_COLOR__'), 'all theme tokens should be replaced');
  });

  it('should create and remove the temp workspace for demo-api-portal', async () => {
    const workspace = await createPortalWorkspace(DEMO_PORTAL_DIR);
    try {
      assert.equal(workspace.root, path.join(DEMO_PORTAL_DIR, WORKSPACE_DIRNAME));
      for (const file of [
        'package.json',
        'src/content.config.ts',
        'public/assets/rapidoc-min.js',
        'public/search-index.json',
        'public/specs/shipments.json',
      ]) {
        assert.ok(fs.existsSync(path.join(workspace.root, file)), `${file} should exist`);
      }
      assert.ok(fs.lstatSync(path.join(workspace.root, 'node_modules')).isSymbolicLink(), 'node_modules should be a symlink');

      // Verify docs were copied and normalized
      const docFiles = fs.readdirSync(workspace.docsContentDir);
      assert.ok(docFiles.length > 5, 'Should contain documentation files');
      assert.ok(!docFiles.includes('.DS_Store'), 'Should skip .DS_Store files');

      const gettingStartedContent = fs.readFileSync(path.join(workspace.docsContentDir, 'getting-started.md'), 'utf8');
      assert.ok(gettingStartedContent.startsWith('---'), 'Should have frontmatter injected');
      assert.ok(
        gettingStartedContent.includes('title: "Welcome to the BrewCraft Developer Platform"'),
        'Should extract first heading as title'
      );
    } finally {
      removePortalWorkspace(workspace);
    }
    assert.ok(!fs.existsSync(workspace.root), 'workspace should be deleted');
    assert.ok(fs.existsSync(path.join(resolveDependencyRoot(), 'astro', 'package.json')), 'symlinked node_modules must survive removal');
  });

  it('should build demo-api-portal into static HTML and leave no files behind', async () => {
    const outDir = fs.mkdtempSync(path.join(os.tmpdir(), 'rapidoc-portal-build-'));
    const projectBefore = listTree(DEMO_PORTAL_DIR);
    try {
      const result = await buildPortal(DEMO_PORTAL_DIR, { outDir });

      assert.equal(result.success, true);
      assert.equal(result.apisCount, 9);
      assert.equal(result.outDir, outDir);
      assert.ok(fs.existsSync(path.join(outDir, 'catalog/index.html')), 'Catalog index.html should exist');
      assert.ok(fs.existsSync(path.join(outDir, 'apis/shipments/index.html')), 'API reference index.html should exist');
      assert.ok(fs.existsSync(path.join(outDir, 'docs/documentation/index.html')), 'Starlight Docs index.html should exist');
      assert.ok(fs.existsSync(path.join(outDir, 'search-index.json')), 'Search index should exist');

      assert.deepEqual(listTree(DEMO_PORTAL_DIR), projectBefore, 'build must not add or remove files in the project');
    } finally {
      fs.rmSync(outDir, { recursive: true, force: true });
    }
  });
});
