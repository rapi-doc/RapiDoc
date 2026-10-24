import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CLI_PATH = path.resolve(__dirname, '../src/index.js');
const DEMO_PORTAL_DIR = process.env.RAPIDOC_DEMO_PORTAL_DIR ?? path.resolve(__dirname, '../../../../demo-api-portal');

test('@rapidoc/cli Command-Line Tool (Milestone 6)', async (t) => {
  await t.test('--help should print usage and commands', () => {
    const output = execFileSync('node', [CLI_PATH, '--help'], { encoding: 'utf8' });
    assert.ok(output.includes('RapiDoc CLI (@rapidoc/cli)'));
    assert.ok(output.includes('build [dir]'));
    assert.ok(output.includes('validate [spec|dir]'));
    assert.ok(output.includes('migrate --from <src>'));
  });

  await t.test('--version should print version string', () => {
    const output = execFileSync('node', [CLI_PATH, '--version'], { encoding: 'utf8' });
    assert.ok(output.includes('0.1.0'));
  });

  await t.test('validate should verify a valid OpenAPI 3.1 specification', () => {
    const specPath = path.join(DEMO_PORTAL_DIR, 'specs/orders-api.yaml');
    const output = execFileSync('node', [CLI_PATH, 'validate', specPath], { encoding: 'utf8' });
    assert.ok(output.includes('Specification is valid OpenAPI!'));
  });

  await t.test('validate with a folder checks every spec in apis: and warns about missing operationIds', () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'rapidoc-cli-validate-'));
    const spec = (op) =>
      `openapi: 3.1.0\ninfo: { title: Orders, version: 1.0.0 }\npaths:\n  /orders:\n    get: { ${op}, responses: { '200': { description: OK } } }\n`;
    try {
      fs.mkdirSync(path.join(tempDir, 'specs'));
      fs.writeFileSync(path.join(tempDir, 'specs/orders.yaml'), spec('summary: List orders'));
      fs.writeFileSync(
        path.join(tempDir, 'rapidoc.config.yaml'),
        'site: { title: Acme }\napis:\n  - { id: orders, spec: ./specs/orders.yaml }\n'
      );
      const result = spawnSync('node', [CLI_PATH, 'validate', tempDir], { encoding: 'utf8' });
      assert.equal(result.status, 0, result.stderr);
      assert.ok(result.stdout.includes('1 specs checked, no errors.'));
      assert.ok(result.stderr.includes('orders: 1 operation has no operationId'));

      fs.writeFileSync(path.join(tempDir, 'specs/orders.yaml'), spec('operationId: listOrders, summary: 42'));
      const invalid = spawnSync('node', [CLI_PATH, 'validate'], { cwd: tempDir, encoding: 'utf8' });
      assert.equal(invalid.status, 1);
      assert.ok(invalid.stdout.includes('1 of 1 specs have errors.'));
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  await t.test('migrate --from redocly should generate rapidoc.config.yaml from redocly.yaml', () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'rapidoc-cli-migrate-'));
    try {
      const redoclyYaml = `apis:
  main:
    root: ./openapi.yaml
theme:
  openapi:
    theme: dark
    primaryColor: '#6366f1'
`;
      fs.writeFileSync(path.join(tempDir, 'redocly.yaml'), redoclyYaml, 'utf8');

      const output = execFileSync('node', [CLI_PATH, 'migrate', '--from', 'redocly'], {
        cwd: tempDir,
        encoding: 'utf8',
      });

      assert.ok(output.includes('Successfully generated rapidoc.config.yaml'));
      assert.ok(fs.existsSync(path.join(tempDir, 'rapidoc.config.yaml')));

      const generatedContent = fs.readFileSync(path.join(tempDir, 'rapidoc.config.yaml'), 'utf8');
      assert.ok(generatedContent.includes('primary: "#6366f1"'));
    } finally {
      if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    }
  });
});
