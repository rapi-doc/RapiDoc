import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createTestServer, launchTestBrowser, loadHarness, unclipShadowContainer } from '../helpers/test-harness.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const snapshotsDir = path.join(__dirname, 'snapshots');

describe('Visual: Regression Snapshots & Unclipped Flow Captures', () => {
  let serverInstance;
  let browser;
  let page;
  let baseUrl;

  before(async () => {
    if (!fs.existsSync(snapshotsDir)) {
      fs.mkdirSync(snapshotsDir, { recursive: true });
    }
    serverInstance = await createTestServer();
    baseUrl = serverInstance.baseUrl;
    browser = await launchTestBrowser();
    page = await browser.newPage({
      viewport: { width: 1280, height: 800 },
      deviceScaleFactor: 1,
    });
  });

  after(async () => {
    if (page) await page.close();
    if (browser) await browser.close();
    if (serverInstance?.server) serverInstance.server.close();
  });

  it('captures targeted component baseline for theme presets (Approach A)', async () => {
    await loadHarness(page, baseUrl, {
      spec: '/specs/01-sections.yaml',
      theme: 'amber',
      'color-scheme': 'dark',
      'render-style': 'read',
    });

    const amberSnapshotPath = path.join(snapshotsDir, 'theme-amber-dark.png');
    const screenshotBuffer = await page.screenshot({ path: amberSnapshotPath });
    assert.ok(screenshotBuffer.length > 5000, 'Screenshot buffer should contain valid image bytes');
    assert.ok(fs.existsSync(amberSnapshotPath), 'Snapshot file should be written to disk');
  });

  it('captures targeted element baseline for schema tree vs table (Approach A)', async () => {
    await loadHarness(page, baseUrl, {
      spec: '/specs/03-schemas.yaml',
      'render-style': 'read',
      'schema-style': 'tree',
      'default-schema-tab': 'schema',
      'schema-expand-level': 'all',
      'schema-description-expanded': 'true',
    });

    const schemaTreeSnapshotPath = path.join(snapshotsDir, 'schema-tree-expanded.png');
    const treeBuffer = await page.screenshot({ path: schemaTreeSnapshotPath });
    assert.ok(treeBuffer.length > 5000, 'Schema tree snapshot should be captured');

    // Switch to table
    await loadHarness(page, baseUrl, {
      spec: '/specs/03-schemas.yaml',
      'render-style': 'read',
      'schema-style': 'table',
      'default-schema-tab': 'schema',
    });

    const schemaTableSnapshotPath = path.join(snapshotsDir, 'schema-table.png');
    const tableBuffer = await page.screenshot({ path: schemaTableSnapshotPath });
    assert.ok(tableBuffer.length > 5000, 'Schema table snapshot should be captured');
  });

  it('captures unclipped full-document flow without height clipping (Approach B)', async () => {
    await loadHarness(page, baseUrl, {
      spec: '/specs/01-sections.yaml',
      'render-style': 'read',
      'show-info': 'true',
    });

    // Unclip shadow DOM scroll container
    await unclipShadowContainer(page);

    const fullDocSnapshotPath = path.join(snapshotsDir, 'sections-unclipped-read-mode.png');
    const fullBuffer = await page.screenshot({
      path: fullDocSnapshotPath,
      fullPage: true,
    });

    assert.ok(fullBuffer.length > 10000, 'Full page unclipped snapshot should capture rendered content');
    assert.ok(fs.existsSync(fullDocSnapshotPath), 'Full document snapshot file should exist');
  });
});
