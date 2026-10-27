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
    assert.ok(output.includes('init [dir]'));
    assert.ok(output.includes('serve [dist]'));
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

  await t.test('init scaffolds a portal with the CLI and the portal engine as dev dependencies', () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'rapidoc-cli-init-'));
    const projectDir = path.join(tempDir, 'acme-portal');
    try {
      const result = spawnSync('node', [CLI_PATH, 'init', projectDir, '--title', 'Acme Docs', '--yes', '--no-install'], {
        encoding: 'utf8',
      });
      assert.equal(result.status, 0, result.stderr);
      const pkg = JSON.parse(fs.readFileSync(path.join(projectDir, 'package.json'), 'utf8'));
      assert.deepEqual(Object.keys(pkg.devDependencies).sort(), ['@rapidoc/cli', '@rapidoc/portal']);
      assert.equal(pkg.scripts.dev, 'rapidoc dev');
      const config = fs.readFileSync(path.join(projectDir, 'rapidoc.config.yaml'), 'utf8');
      assert.ok(config.includes('title: "Acme Docs"'));
      assert.ok(config.includes('spec: "./specs/api.yaml"'));
      assert.ok(result.stdout.includes('npm run dev'));
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  await t.test('init in an existing repo uses its OpenAPI files and keeps its package.json', () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'rapidoc-cli-init-existing-'));
    try {
      fs.mkdirSync(path.join(tempDir, 'openapi'));
      fs.writeFileSync(
        path.join(tempDir, 'openapi/orders-api.yaml'),
        'openapi: 3.1.0\ninfo: { title: Orders, version: 1.0.0 }\npaths: {}\n'
      );
      fs.writeFileSync(path.join(tempDir, 'package.json'), '{ "name": "orders-service" }\n');

      const result = spawnSync('node', [CLI_PATH, 'init', '--yes', '--no-install'], { cwd: tempDir, encoding: 'utf8' });
      assert.equal(result.status, 0, result.stderr);
      const config = fs.readFileSync(path.join(tempDir, 'rapidoc.config.yaml'), 'utf8');
      assert.ok(config.includes('id: orders-api'));
      assert.ok(config.includes('spec: "./openapi/orders-api.yaml"'));
      assert.ok(config.includes('label: "Orders API"'));
      assert.ok(!fs.existsSync(path.join(tempDir, 'specs/api.yaml')), 'no starter spec when the repo has its own');
      assert.equal(fs.readFileSync(path.join(tempDir, 'package.json'), 'utf8'), '{ "name": "orders-service" }\n');
      assert.ok(result.stdout.includes('npm install -D @rapidoc/cli @rapidoc/portal'));
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  await t.test('without @rapidoc/portal: build asks for it, single-spec validate still works', () => {
    const env = { ...process.env, RAPIDOC_PORTAL_MODULE: '@rapidoc/portal-not-installed' };
    const build = spawnSync('node', [CLI_PATH, 'build', DEMO_PORTAL_DIR], { encoding: 'utf8', env });
    assert.equal(build.status, 1);
    assert.ok(build.stderr.includes('npm install -D @rapidoc/portal'), build.stderr);

    const specPath = path.join(DEMO_PORTAL_DIR, 'specs/orders-api.yaml');
    const validateSpec = spawnSync('node', [CLI_PATH, 'validate', specPath], { encoding: 'utf8', env });
    assert.equal(validateSpec.status, 0, validateSpec.stderr);
    assert.ok(validateSpec.stdout.includes('Specification is valid OpenAPI!'));
  });

  await t.test('serve: asks for @rapidoc/server when it is missing, and explains what it needs to start', () => {
    const missing = spawnSync('node', [CLI_PATH, 'serve', DEMO_PORTAL_DIR], {
      encoding: 'utf8',
      env: { ...process.env, RAPIDOC_SERVER_MODULE: '@rapidoc/server-not-installed' },
    });
    assert.equal(missing.status, 1);
    assert.ok(missing.stderr.includes('npm install @rapidoc/server'), missing.stderr);

    const noBuild = spawnSync('node', [CLI_PATH, 'serve', path.join(os.tmpdir(), 'rapidoc-no-such-dist')], { encoding: 'utf8' });
    assert.equal(noBuild.status, 1);
    assert.ok(noBuild.stderr.includes('run rapidoc build first'), noBuild.stderr);

    const distDir = fs.mkdtempSync(path.join(os.tmpdir(), 'rapidoc-cli-serve-'));
    try {
      fs.mkdirSync(path.join(distDir, 'public'));
      fs.mkdirSync(path.join(distDir, 'protected'));
      const auth = { issuer: null, clientId: 'portal-web', scopes: ['openid'], claims: { groups: 'groups' }, session: { maxAge: '8h' } };
      const access = { defaultZone: 'signed-in', zones: { 'signed-in': { kind: 'signed-in' } }, groups: [] };
      fs.writeFileSync(path.join(distDir, 'rapidoc-server.json'), JSON.stringify({ version: 1, site: {}, auth, access, files: {} }));
      const env = { ...process.env, RAPIDOC_SESSION_SECRET: '', RAPIDOC_AUTH_ISSUER: '' };
      const noSecrets = spawnSync('node', [CLI_PATH, 'serve', distDir, '--port', '0'], { encoding: 'utf8', env });
      assert.equal(noSecrets.status, 1);
      assert.ok(noSecrets.stderr.includes('RAPIDOC_SESSION_SECRET'), noSecrets.stderr);
      assert.ok(noSecrets.stderr.includes('RAPIDOC_AUTH_ISSUER'), noSecrets.stderr);
    } finally {
      fs.rmSync(distDir, { recursive: true, force: true });
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
