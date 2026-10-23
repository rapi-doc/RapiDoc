import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

import { scaffoldProject } from '../src/scaffold.js';
import { buildPortal } from '../../rapidoc-portal/src/index.js';
import { validate } from '@scalar/openapi-parser';

// The scaffolded project must share a parent folder with the monorepo's node_modules (Astro only
// compiles .astro files that do), so it is created in <repo>/.test-tmp/ rather than the OS temp folder.
const TEST_TMP_ROOT = fileURLToPath(new URL('../../../.test-tmp', import.meta.url));

test('create-rapidoc Scaffolding CLI (Milestone 6)', async (t) => {
  fs.mkdirSync(TEST_TMP_ROOT, { recursive: true });
  const tempDir = fs.mkdtempSync(path.join(TEST_TMP_ROOT, 'create-rapidoc-test-'));

  t.after(() => {
    fs.rmSync(tempDir, { recursive: true, force: true, maxRetries: 3 });
    if (fs.readdirSync(TEST_TMP_ROOT).length === 0) fs.rmdirSync(TEST_TMP_ROOT);
  });

  await t.test('scaffoldProject should generate a complete starter portal repository', () => {
    const projectDir = path.join(tempDir, 'sample-portal');
    const result = scaffoldProject(projectDir, {
      title: 'Galaxy Logistics Docs',
      name: 'galaxy-docs',
    });

    assert.strictEqual(result.projectName, 'galaxy-docs');
    assert.strictEqual(result.siteTitle, 'Galaxy Logistics Docs');
    assert.ok(result.filesCreated.length >= 7);

    // Verify key files exist
    assert.ok(fs.existsSync(path.join(projectDir, 'rapidoc.config.yaml')));
    assert.ok(fs.existsSync(path.join(projectDir, 'package.json')));
    assert.ok(fs.existsSync(path.join(projectDir, '.gitignore')));
    assert.ok(fs.existsSync(path.join(projectDir, 'README.md')));
    assert.ok(fs.existsSync(path.join(projectDir, 'specs/api.yaml')));
    assert.ok(fs.existsSync(path.join(projectDir, 'docs/getting-started.md')));
    assert.ok(fs.existsSync(path.join(projectDir, 'docs/guides/overview.markdoc')));

    // Verify package.json structure
    const pkg = JSON.parse(fs.readFileSync(path.join(projectDir, 'package.json'), 'utf8'));
    assert.strictEqual(pkg.name, 'galaxy-docs');
    assert.strictEqual(pkg.scripts.build, 'rapidoc build');
  });

  await t.test('scaffolded OpenAPI specification should be valid OpenAPI 3.1', async () => {
    const specPath = path.join(tempDir, 'sample-portal/specs/api.yaml');
    const specContent = fs.readFileSync(specPath, 'utf8');

    const result = await validate(specContent);
    assert.strictEqual(result.valid, true, 'Scaffolded OpenAPI specification must be 100% valid');
  });

  await t.test('scaffolded project should compile cleanly with buildPortal (end-to-end SSG)', async () => {
    const projectDir = path.join(tempDir, 'sample-portal');
    const buildResult = await buildPortal(projectDir);

    assert.strictEqual(buildResult.success, true);
    assert.strictEqual(buildResult.apisCount, 1);

    // Verify dist artifacts
    const distDir = path.join(projectDir, 'dist');
    assert.ok(fs.existsSync(path.join(distDir, 'index.html')));
    assert.ok(fs.existsSync(path.join(distDir, 'search-index.json')));
    assert.ok(fs.existsSync(path.join(distDir, 'apis/core/index.html')));
    assert.ok(fs.existsSync(path.join(distDir, 'docs/getting-started/index.html')));
  });
});
