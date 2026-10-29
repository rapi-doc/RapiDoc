import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildPortal, loadConfig, resolveConfig } from '../src/index.js';
import { buildStarlightSidebar, createStarlightOptions } from '../src/engine/starlight-options.js';
import { renderThemeCss } from '../src/engine/theme-css.js';
import { createPortalWorkspace, removePortalWorkspace, resolveDependencyRoot, WORKSPACE_DIRNAME } from '../src/engine/temp-workspace.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEMO_PORTAL_DIR =
  process.env.RAPIDOC_DEMO_PORTAL_DIR ?? path.resolve(__dirname, '../../../../rapi-portal-demo/fixtures/zudoku-cosmo-cargo');

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
  it('should build one Starlight sidebar group per documentation tab', () => {
    const config = resolveConfig(
      {
        site: { title: 'Acme' },
        navigation: [
          {
            label: 'Guides',
            items: ['intro', { label: 'Space', items: [{ slug: 'shipping', label: 'Shipping' }] }, { label: 'API', api: 'orders' }],
          },
          { label: 'Orders', api: 'orders' },
          { label: 'Help', autogenerate: 'support' },
        ],
        apis: [{ id: 'orders', spec: 'https://example.com/orders.yaml', title: 'Orders API' }],
      },
      '/tmp'
    );
    assert.deepEqual(buildStarlightSidebar(config.tabs), [
      {
        label: 'Guides',
        items: [
          { slug: 'docs/intro' },
          { label: 'Space', items: [{ slug: 'docs/shipping', label: 'Shipping' }] },
          { label: 'API', link: '/apis/orders' },
        ],
      },
      { label: 'Help', items: [{ autogenerate: { directory: 'docs/support' } }] },
    ]);
    assert.deepEqual(buildStarlightSidebar([]), [{ label: 'Documentation', autogenerate: { directory: 'docs' } }], 'no tabs: every doc');
  });

  it('should keep sidebar icons in the portal config and out of Starlight (its schema is strict)', () => {
    const config = resolveConfig(
      {
        site: { title: 'Acme' },
        navigation: [
          {
            label: 'Guides',
            items: [
              { label: 'Start', icon: 'rocket', items: [{ slug: 'intro', icon: 'book-open' }, 'setup'] },
              { label: 'Help', icon: 'lifebuoy', autogenerate: 'support' },
            ],
          },
        ],
      },
      '/tmp'
    );
    const [start, help] = config.tabs[0].sidebar;
    assert.equal(start.icon, 'rocket');
    assert.equal(start.items[0].icon, 'book-open');
    assert.equal(start.items[1].icon, undefined);
    assert.equal(help.icon, 'lifebuoy');
    assert.deepEqual(buildStarlightSidebar(config.tabs)[0].items, [
      { label: 'Start', items: [{ slug: 'docs/intro' }, { slug: 'docs/setup' }] },
      { label: 'Help', items: [{ autogenerate: { directory: 'docs/support' } }] },
    ]);
  });

  it('should create Starlight options and theme CSS from the portal config', async () => {
    const { config } = await loadConfig(DEMO_PORTAL_DIR);
    const options = createStarlightOptions(config);
    const themeCss = renderThemeCss(config);

    assert.equal(options.title, 'Cosmo Cargo Inc.');
    assert.ok(options.sidebar.length > 0);
    assert.ok(path.isAbsolute(options.components.Header), 'component overrides should be absolute paths');
    assert.ok(path.isAbsolute(options.routeMiddleware[0]), 'route middleware should be an absolute path');
    assert.deepEqual(options.tableOfContents, { minHeadingLevel: 2, maxHeadingLevel: 3 });
    assert.ok(themeCss.includes('--sl-color-accent: #f76b39'));
    assert.ok(themeCss.includes('.rapidoc-fullscreen-portal'));
    assert.ok(!themeCss.includes('__PORTAL_PRIMARY_COLOR__'), 'all theme tokens should be replaced');
  });

  it('should create and remove the temp workspace for rapi-portal-demo', async () => {
    const workspace = await createPortalWorkspace(DEMO_PORTAL_DIR);
    try {
      assert.equal(path.dirname(workspace.root), path.join(DEMO_PORTAL_DIR, WORKSPACE_DIRNAME));
      assert.match(path.basename(workspace.root), new RegExp(`^build-${process.pid}-\\d+$`), 'one folder per run, named after the process');
      for (const file of [
        'package.json',
        'markdoc.config.mjs',
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

      // .markdoc docs become .mdoc, the extension @astrojs/markdoc loads, without MDX imports
      const guidesDir = path.join(workspace.docsContentDir, 'guides');
      assert.ok(fs.existsSync(path.join(guidesDir, 'order-fulfillment.mdoc')), '.markdoc should be synced as .mdoc');
      assert.ok(!fs.existsSync(path.join(guidesDir, 'order-fulfillment.markdoc')));
      const markdocDoc = fs.readFileSync(path.join(guidesDir, 'order-fulfillment.mdoc'), 'utf8');
      assert.ok(markdocDoc.startsWith('---\ntitle:'), 'Markdoc docs get a title too');
      assert.ok(!markdocDoc.includes('import {'), 'Markdoc docs get no component imports');
    } finally {
      removePortalWorkspace(workspace);
    }
    assert.ok(!fs.existsSync(workspace.root), 'workspace should be deleted');
    assert.ok(fs.existsSync(path.join(resolveDependencyRoot(), 'astro', 'package.json')), 'symlinked node_modules must survive removal');
  });

  it('should give every run its own workspace and remove only the folders of dead runs', async () => {
    const projectDir = fs.mkdtempSync(path.join(os.tmpdir(), 'rapidoc-ws-test-'));
    try {
      fs.writeFileSync(path.join(projectDir, 'rapidoc.config.yaml'), 'site: { title: Acme }\n');
      const parentDir = path.join(projectDir, WORKSPACE_DIRNAME);
      fs.mkdirSync(path.join(parentDir, 'dev-999999999-1'), { recursive: true }); // a run that no longer exists
      fs.writeFileSync(path.join(parentDir, 'package.json'), '{}'); // the layout before per-run folders

      const dev = await createPortalWorkspace(projectDir, { kind: 'dev' });
      assert.deepEqual(fs.readdirSync(parentDir), [path.basename(dev.root)], 'leftovers of dead runs are removed');
      const build = await createPortalWorkspace(projectDir, { kind: 'build' });
      assert.ok(fs.existsSync(dev.root), "a new run leaves a live run's workspace alone");
      assert.notEqual(build.root, dev.root);

      removePortalWorkspace(build);
      assert.ok(fs.existsSync(dev.root) && !fs.existsSync(build.root));
      removePortalWorkspace(dev);
      assert.ok(!fs.existsSync(parentDir), `${WORKSPACE_DIRNAME}/ goes once the last run is removed`);
    } finally {
      fs.rmSync(projectDir, { recursive: true, force: true });
    }
  });

  it('should build rapi-portal-demo into static HTML and leave no files behind', async () => {
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
      assert.ok(fs.existsSync(path.join(outDir, 'logo.svg')), "the project's public/ folder is copied");
      // One OAuth return page for the whole portal, which every RapiDoc element uses
      assert.match(fs.readFileSync(path.join(outDir, 'oauth-receiver.html'), 'utf8'), /<oauth-receiver>/);

      // Markdoc guides render with Starlight components
      const read = (page) => fs.readFileSync(path.join(outDir, page, 'index.html'), 'utf8');

      // docs/index.markdoc is the home page; the header tabs mark the current section
      const home = read('');
      assert.ok(home.includes('Cosmo Cargo Developer Platform'), 'docs/index.* renders at /');
      assert.ok(!home.includes('sl-sidebar-pane'), 'the splash home page has no sidebar');
      const activeTab = (html) =>
        html.match(/<a[^>]*class="portal-tab[^"]*"[^>]*aria-current="page"[^>]*>[\s\S]*?<span>([^<]+)<\/span>/)?.[1];
      assert.equal(activeTab(read('docs/shipping-process')), 'Documentation');
      assert.equal(activeTab(read('apis/shipments')), 'Shipments');
      assert.equal(activeTab(read('apis/labels')), 'API Catalog', 'an API without a tab belongs to the catalog tab');

      // A versioned API: the default version at /apis/labels, the others under /apis/labels/<version>, a picker
      const labels = read('apis/labels');
      assert.ok(labels.includes('spec-url="/specs/labels.json"'));
      assert.match(labels, /<select id="portal-api-version-select" data-active-tag>/, 'the overview has no active tag');
      assert.deepEqual(
        [...labels.matchAll(/<option value="([^"]+)"[^>]*>([^<]+)<\/option>/g)].map((m) => [m[1], m[2]]),
        [
          ['/apis/labels', '3.0.0'],
          ['/apis/labels/v2', '2.0.0'],
          ['/apis/labels/v1', '1.0.0'],
        ],
        'one option per version, labelled with info.version'
      );
      assert.ok(!labels.includes('class="portal-api-version-note"'), 'no note on the default version');
      const labelsV2 = read('apis/labels/v2/analytics');
      assert.ok(labelsV2.includes('spec-url="/specs/labels/v2.json"'));
      assert.ok(labelsV2.includes('href="/apis/labels/v2/stamps"'), 'sidebar links stay in the version');
      assert.match(labelsV2, /portal-api-version-note[\s\S]*You.re viewing 2\.0\.0[\s\S]*href="\/apis\/labels"/);
      assert.equal(activeTab(labelsV2), 'API Catalog');
      assert.match(read('apis/labels/v3/stamps'), /location\.replace\(redirectTo \+ location\.hash\)/);
      assert.ok(read('apis/labels/v3/stamps').includes('"/apis/labels/stamps"'), 'the pinned default version redirects');
      for (const spec of ['labels.json', 'labels/v3.json', 'labels/v2.json', 'labels/v1.json']) {
        assert.ok(fs.existsSync(path.join(outDir, 'specs', spec)), `specs/${spec} is published`);
      }
      assert.ok(read('catalog').includes('3 versions'));
      assert.ok(read('apis').includes('/catalog'), '/apis redirects to the catalog');
      assert.equal(activeTab(home), undefined);

      // The documentation tab's sidebar, with an autogenerated group
      const shippingProcess = read('docs/shipping-process');
      assert.ok(shippingProcess.includes('Space Operations'));
      assert.ok(shippingProcess.includes('href="/docs/support/faq/"'), 'autogenerate: support lists the folder');
      const fulfillment = read('docs/guides/order-fulfillment');
      assert.ok(fulfillment.includes('class="portal-callout" role="note" data-type="info"'), '{% callout %} renders as a portal callout');
      assert.ok(!fulfillment.includes('<aside class="starlight-aside'), 'no Starlight asides');
      assert.ok(read('docs/global').includes('data-type="tip"'), 'a :::tip block in MDX renders as a portal callout');
      const auth = read('docs/authentication');
      assert.ok(auth.includes('data-type="lock"') && auth.includes('Keep live keys secret'), "Zudoku's :::lock{title} in Markdown too");
      assert.ok(fulfillment.includes('<starlight-tabs'), '{% tabs %} renders as Starlight tabs');
      assert.ok(fulfillment.includes('sl-steps'), '{% steps %} renders as Starlight steps');
      assert.ok(!fulfillment.includes('{%'), 'no unrendered Markdoc tags');
      assert.ok(read('docs/guides/loyalty-and-rewards').includes('Bloom Tier'));

      // {% api-operation %}: a <rapi-doc-mini> showing one operation, and the bundle only where it is used
      const firstShipment = read('docs/guides/first-shipment');
      assert.equal(firstShipment.match(/<rapi-doc-mini/g)?.length, 2);
      assert.ok(firstShipment.includes('spec-url="/specs/shipments.json"'));
      assert.ok(firstShipment.includes('oauth-receiver="/oauth-receiver.html"'), 'embeds return to the one OAuth page');
      assert.ok(read('apis/shipments').includes('oauth-receiver="/oauth-receiver.html"'), 'API pages too');
      assert.ok(firstShipment.includes('match-paths="^post /shipments$"'));
      assert.ok(firstShipment.includes('/assets/rapidoc-min.js'), 'pages with an embed load RapiDoc');
      assert.ok(fulfillment.includes('API operation not found'), 'an unknown spec id shows a notice');
      assert.ok(!fulfillment.includes('/assets/rapidoc-min.js'), 'pages without a working embed do not load RapiDoc');

      // Pages do not name the tooling they are built with
      assert.ok(fs.readdirSync(path.join(outDir, '_rapidoc/assets')).length > 0, 'build assets are under /_rapidoc/assets/');
      for (const page of ['', 'docs/shipping-process', 'catalog', 'apis/shipments']) {
        const html = read(page);
        assert.ok(!/<meta[^>]*name="generator"/.test(html), `no generator meta tag on /${page}`);
        assert.ok(!html.includes('/_astro/'), `no /_astro/ paths on /${page}`);
      }

      assert.deepEqual(listTree(DEMO_PORTAL_DIR), projectBefore, 'build must not add or remove files in the project');
    } finally {
      fs.rmSync(outDir, { recursive: true, force: true });
    }
  });
});
