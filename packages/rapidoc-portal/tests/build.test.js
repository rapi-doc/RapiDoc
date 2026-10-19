import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { generateShell, buildPortal } from '../src/index.js';

describe('RapiDoc Portal Shell & SSG Build Engine (Milestone 4)', () => {
  const DEMO_PORTAL_DIR = '/Users/mrin/work/demo-api-portal';

  it('should generate complete App-Shell HTML with 2-row header, announcement bar, and 3-column layout', () => {
    const mockConfig = {
      site: {
        title: 'Cosmo Cargo',
        logo: { light: '/logo.svg', alt: 'Cosmo' },
        announcement: {
          text: 'Inter-galactic shipping now live!',
          link: '/blog/shipping',
          bgColor: '#facc15',
          textColor: '#000',
        },
      },
      apis: [{ id: 'orders', title: 'Orders API', path: '/apis/orders' }],
      navigation: [
        {
          title: 'Getting Started',
          items: [{ label: 'Overview', path: '/docs/overview' }],
        },
      ],
      docs: { toc: true },
    };

    const html = generateShell({
      config: mockConfig,
      title: 'Overview',
      content: '<h1>Hello World</h1><p>Welcome to Cosmo Cargo.</p>',
      toc: [
        { id: 'section-1', title: 'Section 1', level: 2 },
        { id: 'section-2', title: 'Section 2', level: 3 },
      ],
      currentPath: '/docs/overview',
      layout: 'docs',
      baseAssetsPath: './assets',
    });

    // 1. Announcement Banner checks
    assert.ok(html.includes('portal-announcement'));
    assert.ok(html.includes('Inter-galactic shipping now live!'));
    assert.ok(html.includes('--portal-announcement-bg: #facc15'));
    assert.ok(html.includes('portal-announcement-close'));

    // 2. Row 1 Header checks
    assert.ok(html.includes('portal-header-top'));
    assert.ok(html.includes('portal-brand'));
    assert.ok(html.includes('Cosmo Cargo'));
    assert.ok(html.includes('portal-search-trigger'));
    assert.ok(html.includes('⌘K'));
    assert.ok(html.includes('portal-theme-toggle'));

    // 3. Row 2 Subnav Category Tabs checks
    assert.ok(html.includes('portal-header-subnav'));
    assert.ok(html.includes('portal-subnav-tab active'));
    assert.ok(html.includes('Documentation'));
    assert.ok(html.includes('Orders API'));

    // 4. 3-Column Layout checks
    assert.ok(html.includes('portal-container portal-layout-docs'));
    assert.ok(html.includes('portal-sidebar'));
    assert.ok(html.includes('portal-filter-input'));
    assert.ok(html.includes('Getting Started'));
    assert.ok(html.includes('portal-toc'));
    assert.ok(html.includes('On this page'));
    assert.ok(html.includes('href="#section-1"'));
    assert.ok(html.includes('level-3'));
  });

  it('should support layout presets: wide and landing', () => {
    const mockConfig = { site: { title: 'Test Portal' }, apis: [] };

    // Wide layout: TOC hidden
    const wideHtml = generateShell({
      config: mockConfig,
      title: 'Wide Page',
      content: '<p>Wide</p>',
      layout: 'wide',
      toc: [{ id: 'item', title: 'Item', level: 2 }],
    });
    assert.ok(wideHtml.includes('portal-layout-wide'));
    assert.ok(!wideHtml.includes('portal-toc'));

    // Landing layout: Sidebar & TOC hidden
    const landingHtml = generateShell({
      config: mockConfig,
      title: 'Landing Page',
      content: '<p>Landing</p>',
      layout: 'landing',
    });
    assert.ok(landingHtml.includes('portal-layout-landing'));
    assert.ok(!landingHtml.includes('portal-sidebar'));
  });

  it('should run buildPortal on demo-api-portal and compile static HTML files into dist/', async () => {
    const result = await buildPortal(DEMO_PORTAL_DIR);

    assert.equal(result.success, true);
    assert.ok(result.pagesCount >= 10);
    assert.equal(result.apisCount, 9);
    assert.ok(result.durationMs >= 0);

    const distDir = result.outDir;
    assert.ok(fs.existsSync(distDir));

    // Check assets
    assert.ok(fs.existsSync(path.join(distDir, 'assets/portal.css')));
    assert.ok(fs.existsSync(path.join(distDir, 'assets/portal.js')));
    assert.ok(fs.existsSync(path.join(distDir, 'assets/rapidoc-nav.css')));
    assert.ok(fs.existsSync(path.join(distDir, 'assets/rapidoc-min.js')));

    // Check specs
    assert.ok(fs.existsSync(path.join(distDir, 'specs/shipments.json')));
    assert.ok(fs.existsSync(path.join(distDir, 'specs/interplanetary.json')));

    // Check root index.html
    assert.ok(fs.existsSync(path.join(distDir, 'index.html')));
    const indexContent = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');
    assert.ok(indexContent.includes('Cosmo Cargo'));
    assert.ok(indexContent.includes('Ship anywhere in the'));

    // Check pre-rendered documentation pages
    const docHtml = path.join(distDir, 'docs/documentation/index.html');
    assert.ok(fs.existsSync(docHtml));

    // Check API Catalog page
    const catalogHtml = path.join(distDir, 'catalog/index.html');
    assert.ok(fs.existsSync(catalogHtml));
    const catalogContent = fs.readFileSync(catalogHtml, 'utf8');
    assert.ok(catalogContent.includes('portal-catalog-grid'));
    assert.ok(catalogContent.includes('Shipment API'));

    // Check pre-rendered API Reference page with contextual sidebar and API sidecar
    const shipmentsApiHtml = path.join(distDir, 'apis/shipments/index.html');
    assert.ok(fs.existsSync(shipmentsApiHtml));
    const shipmentsContent = fs.readFileSync(shipmentsApiHtml, 'utf8');
    assert.ok(shipmentsContent.includes('<rapi-doc'));
    assert.ok(shipmentsContent.includes('spec-url="/specs/shipments.json"'));
    assert.ok(shipmentsContent.includes('update-route="false"'));
    assert.ok(shipmentsContent.includes('portal-api-sidecar'));
    assert.ok(shipmentsContent.includes('portal-sidebar-op-item'));
    assert.ok(shipmentsContent.includes('href="/apis/shipments/shipment-management#track-shipment"'));

    // Check multi-page tag pre-rendered page: dist/apis/shipments/shipment-management/index.html
    const shipmentMgmtHtml = path.join(distDir, 'apis/shipments/shipment-management/index.html');
    assert.ok(fs.existsSync(shipmentMgmtHtml), 'Shipment Management tag page should exist in dist');
    const tagPageContent = fs.readFileSync(shipmentMgmtHtml, 'utf8');
    assert.ok(tagPageContent.includes('goto-path="tag--shipment-management"'));
    assert.ok(tagPageContent.includes('update-route="false"'));
    assert.ok(tagPageContent.includes('href="/apis/shipments/shipment-management#track-shipment"'));
  });
});
