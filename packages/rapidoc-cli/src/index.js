#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { createInterface } from 'node:readline/promises';
import { load, validate } from '@scalar/openapi-parser';
import { readFiles } from '@scalar/openapi-parser/plugins/read-files';

const args = process.argv.slice(2);
const command = args[0] || '--help';

// The portal engine (Astro, Starlight, Markdoc) is an optional peer: only dev, build, migrate and portal-wide
// validate need it, so `rapidoc validate <spec>` and `rapidoc init` work without it.
// RAPIDOC_PORTAL_MODULE swaps the module name (tests use it to simulate a missing engine).
const PORTAL_MODULE = process.env.RAPIDOC_PORTAL_MODULE || '@rapidoc/portal';

async function tryLoadPortal() {
  try {
    return await import(PORTAL_MODULE);
  } catch (err) {
    if (err.code === 'ERR_MODULE_NOT_FOUND' && err.message.includes(PORTAL_MODULE)) return null;
    throw err;
  }
}

async function loadPortal() {
  const portal = await tryLoadPortal();
  if (!portal) {
    console.error(`\n❌ \`rapidoc ${command}\` needs the portal engine. Install it next to the CLI:`);
    console.error(`   npm install -D @rapidoc/portal\n`);
    process.exit(1);
  }
  return portal;
}

// The server behind `rapidoc serve` is an optional peer too: only serve needs it.
// RAPIDOC_SERVER_MODULE swaps the module name (tests use it to simulate a missing server).
const SERVER_MODULE = process.env.RAPIDOC_SERVER_MODULE || '@rapidoc/server';

async function loadServer() {
  try {
    return await import(SERVER_MODULE);
  } catch (err) {
    if (err.code !== 'ERR_MODULE_NOT_FOUND' || !err.message.includes(SERVER_MODULE)) throw err;
    console.error(`\n❌ \`rapidoc serve\` needs @rapidoc/server. Install it next to the CLI:`);
    console.error(`   npm install @rapidoc/server\n`);
    process.exit(1);
  }
}

// The mock server behind `rapidoc mock` is an optional peer as well.
// RAPIDOC_MOCK_MODULE swaps the module name (tests use it to simulate a missing mock server).
const MOCK_MODULE = process.env.RAPIDOC_MOCK_MODULE || '@rapidoc/mock';

async function loadMock() {
  try {
    return await import(MOCK_MODULE);
  } catch (err) {
    if (err.code !== 'ERR_MODULE_NOT_FOUND' || !err.message.includes(MOCK_MODULE)) throw err;
    console.error(`\n❌ \`rapidoc mock\` needs @rapidoc/mock. Install it next to the CLI:`);
    console.error(`   npm install -D @rapidoc/mock\n`);
    process.exit(1);
  }
}

const positional = (index) => (args[index] && !args[index].startsWith('-') ? args[index] : undefined);
const optionValue = (name) => {
  const idx = args.indexOf(name);
  return idx !== -1 ? args[idx + 1] : undefined;
};

function printHelp() {
  console.log(`
RapiDoc CLI (@rapidoc/cli) - OpenAPI & Developer Portal Toolkit

Usage:
  rapidoc <command> [options]

Commands:
  init [dir]              Scaffolds a developer portal (default: current folder); uses OpenAPI files already there
  dev [dir]               Launches local development server with HMR (Astro + Starlight)
  build [dir]             Pre-renders static developer portal into dist/ (SSG)
  serve [dist]            Serves a built portal; enforces sign-in and access rules (default: dist)
  mock [dir|spec...]      Mock server for a portal's APIs, a folder of specs or spec files, each under /<api id>
  validate [spec|dir]     Validates one OpenAPI 3.0 / 3.1 spec, or every spec in a portal's apis: (default: current folder)
  migrate --from <src>    Converts a Redocly or a Zudoku project to rapidoc.config.yaml (redocly, zudoku)
  --help, -h              Show this help message
  --version, -v           Show version information

Options:
  --outDir <path>         Output directory for static assets (default: dist)
  --port <number>         dev: server port (default 4321); serve: default $PORT or 8080; mock: default 4010
  --host <host>           serve, mock: address to listen on (serve: default $HOST; both default 0.0.0.0)
  --mount-path <path>     serve: path requests arrive under, when a proxy strips part of the portal's path
                          (default $RAPIDOC_MOUNT_PATH, else the path of site.url)
  --issuer <url>          mock: OpenID Connect issuer whose tokens are accepted (default $RAPIDOC_MOCK_ISSUER)
  --audience <id>         mock: audience tokens must be issued for (default $RAPIDOC_MOCK_AUDIENCE)
  --seed <number>         mock: seed for generated data (default 1)
  --debug                 Keep the temporary Astro workspace and print its path (for debugging the engine)
  --title <title>         init: site title (asked for when omitted in a terminal)
  --force, -f             init: overwrite existing files
  --yes, -y               init: accept defaults without asking
  --no-install            init: skip npm install

dev, build, migrate, folder-wide validate and mock of a portal folder need @rapidoc/portal installed next to the
CLI; serve needs @rapidoc/server; mock needs @rapidoc/mock. A folder without rapidoc.config.yaml is mocked file by
file (orders-api.yaml under /orders-api).

Examples:
  rapidoc init my-portal --title "Acme Developer Portal"
  rapidoc dev
  rapidoc build
  rapidoc build ./my-api-portal
  rapidoc serve dist --port 8080
  rapidoc mock --issuer https://example.us.auth0.com/ --audience https://api.example.com
  rapidoc mock ./specs --port 4011
  rapidoc mock orders-api.yaml billing-api.yaml
  rapidoc validate
  rapidoc validate ./specs/orders-api.yaml
  rapidoc migrate --from redocly
  rapidoc migrate --from zudoku
`);
}

async function handleDev() {
  const targetDir = args[1] && !args[1].startsWith('--') ? args[1] : process.cwd();
  console.log(`\n✨ Starting RapiDoc Portal Dev Server in: ${targetDir}`);
  console.log(`   Engine: Astro + Starlight\n`);

  const { startDevServer } = await loadPortal();
  try {
    const portIdx = args.indexOf('--port');
    const port = portIdx !== -1 ? parseInt(args[portIdx + 1], 10) : 4321;
    const keepWorkspace = args.includes('--debug');
    const devServer = await startDevServer(targetDir, { port, keepWorkspace });
    if (keepWorkspace) console.log(`   • Workspace (kept): ${devServer.workspaceDir}\n`);
  } catch (err) {
    console.error(`\n❌ Dev server failed: ${err.message}\n`);
    process.exit(1);
  }
}

async function handleBuild() {
  const targetDir = args[1] && !args[1].startsWith('--') ? args[1] : process.cwd();

  console.log(`\n🚀 Building RapiDoc Portal in: ${targetDir}`);
  console.log(`   Engine: Astro + Starlight`);

  const { buildPortal } = await loadPortal();
  try {
    const outDirIdx = args.indexOf('--outDir');
    const outDir = outDirIdx !== -1 ? args[outDirIdx + 1] : 'dist';

    const keepWorkspace = args.includes('--debug');

    const result = await buildPortal(targetDir, { outDir, keepWorkspace });
    console.log(`\n✨ Astro build completed successfully in ${result.durationMs}ms!`);
    console.log(`   • APIs compiled:   ${result.apisCount}`);
    console.log(`   • Output folder:   ${result.outDir}`);
    if (result.workspaceDir) console.log(`   • Workspace (kept): ${result.workspaceDir}`);
    if (result.access) {
      const { protectedPages, zones, warnings } = result.access;
      console.log(`   • Protected:       ${protectedPages} page(s) in ${zones.length} zone(s)`);
      for (const warning of warnings) console.warn(`   ⚠️  ${warning}`);
      const outRel = path.relative(process.cwd(), result.outDir) || '.';
      console.log(
        `\n   Serve it with \`rapidoc serve ${outRel}\`. ${outRel}/public alone is safe to host anywhere but has no protected content.`
      );
    }
    console.log('');
  } catch (err) {
    console.error(`\n❌ Build failed: ${err.message}\n`);
    process.exit(1);
  }
}

// rapidoc serve [dist]: the built portal, with sign-in and access rules when it has `auth`.
async function handleServe() {
  const distDir = path.resolve(positional(1) || 'dist');
  const portValue = optionValue('--port');
  const port = portValue !== undefined ? parseInt(portValue, 10) : undefined;
  if (portValue !== undefined && !Number.isInteger(port)) {
    console.error(`\n❌ --port needs a number, got "${portValue}"\n`);
    process.exit(1);
  }

  const { startServer } = await loadServer();
  let server;
  try {
    server = await startServer({ distDir, port, host: optionValue('--host'), mountPath: optionValue('--mount-path') });
  } catch (err) {
    console.error(`\n❌ ${err.name === 'SettingsError' ? err.message : `Server failed: ${err.message}`}\n`);
    process.exit(1);
  }

  const { settings } = server;
  console.log(`\n🌐 Serving ${distDir}`);
  console.log(`   • URL:      ${server.url}`);
  if (settings.mountPath !== settings.basePath) {
    console.log(`   • Paths:    requests arrive under ${settings.mountPath || '/'}; links use ${settings.basePath || '/'}`);
  }
  if (settings.mode === 'static') {
    console.log('   • Access:   everything public (no sign-in configured)');
  } else {
    if (settings.auth) console.log(`   • Sign-in:  ${settings.auth.issuer}`);
    const zones = Object.keys(settings.manifest.access.zones).filter((zone) => zone !== 'public');
    console.log(`   • Access:   ${Object.keys(settings.manifest.files).length} protected file(s) in ${zones.length} zone(s)`);
    if (settings.auth && !settings.publicUrl) {
      console.warn('   ⚠️  RAPIDOC_PUBLIC_URL is not set: the sign-in redirect URL is taken from each request.');
    }
  }
  console.log('');

  const stop = async () => {
    await server.close();
    process.exit(0);
  };
  process.once('SIGINT', stop);
  process.once('SIGTERM', stop);
}

// Options followed by a value, so `rapidoc mock a.yaml --port 4011 b.yaml` sees two spec files.
const VALUE_OPTIONS = new Set(['--port', '--host', '--mount-path', '--issuer', '--audience', '--seed', '--outDir', '--title', '--from']);

/** The positional arguments after the command. */
function positionals() {
  const found = [];
  for (let i = 1; i < args.length; i++) {
    if (!args[i].startsWith('-')) found.push(args[i]);
    else if (VALUE_OPTIONS.has(args[i])) i++;
  }
  return found;
}

// The portal's config file names (CONFIG_CANDIDATES in @rapidoc/portal), checked without loading the portal engine.
const hasPortalConfig = (dir) => fs.readdirSync(dir).some((name) => /^rapidoc\.config\.(ya?ml|json|m?js|ts)$/.test(name));

const slug = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'api';

/**
 * Mock ids for spec files: the file name without its extension (`specs/orders-api.yaml` → `orders-api`). Files that
 * would share an id get their parent folders in front until they differ (`billing-v2/openapi.yaml` →
 * `billing-v2-openapi`); the same input always gives the same ids.
 */
function mockApisFromFiles(files) {
  const fullPaths = [...new Set(files.map((file) => path.resolve(file)))];
  const segments = fullPaths.map((fullPath) => {
    const parts = fullPath.split(path.sep).filter(Boolean);
    parts[parts.length - 1] = parts.at(-1).replace(/\.(ya?ml|json)$/i, '');
    return parts;
  });
  const idOf = (parts, depth) => slug(parts.slice(-depth).join('-'));
  const ids = segments.map((parts) => idOf(parts, 1));
  const groups = new Map();
  ids.forEach((id, i) => groups.set(id, [...(groups.get(id) || []), i]));
  for (const indices of groups.values()) {
    if (indices.length < 2) continue;
    const longest = Math.max(...indices.map((i) => segments[i].length));
    let depth = 2;
    while (depth < longest && new Set(indices.map((i) => idOf(segments[i], depth))).size < indices.length) depth++;
    for (const i of indices) ids[i] = idOf(segments[i], depth);
  }
  const used = new Set();
  return fullPaths.map((fullPath, i) => {
    let id = ids[i];
    for (let n = 2; used.has(id); n++) id = `${ids[i]}-${n}`;
    used.add(id);
    return { id, fullPath };
  });
}

// rapidoc mock [dir | spec...]: the local specs in a portal's apis:, every OpenAPI file in a folder without a
// portal config, or the spec files given; all on one port, each under /<api id>.
async function handleMock() {
  const targets = positionals().map((target) => path.resolve(target));
  if (!targets.length) targets.push(process.cwd());
  for (const target of targets) {
    if (!fs.existsSync(target)) {
      console.error(`\n❌ Not found: ${target}\n`);
      process.exit(1);
    }
  }
  const numberOption = (name) => {
    const value = optionValue(name);
    if (value === undefined) return undefined;
    const number = Number(value);
    if (!Number.isInteger(number) || number < 0) {
      console.error(`\n❌ ${name} needs a whole number, got "${value}"\n`);
      process.exit(1);
    }
    return number;
  };
  const port = numberOption('--port');
  const seed = numberOption('--seed');

  let apis;
  const folder = targets.length === 1 && fs.statSync(targets[0]).isDirectory() ? targets[0] : null;
  if (folder && hasPortalConfig(folder)) {
    const portal = await loadPortal();
    let config;
    try {
      ({ config } = await portal.loadConfig(folder));
    } catch (err) {
      console.error(`\n❌ ${err.message}\n`);
      process.exit(1);
    }
    apis = [];
    for (const api of config.apis || []) {
      // The default version at /<id>, the others at /<id>/<version>. Those go first: the mock server tries
      // the APIs in order, and /<id>/* would also take /<id>/<version>/... requests.
      for (const version of [...api.versions.slice(1), api.versions[0]]) {
        const id = version.isDefault ? api.id : `${api.id}/${version.version}`;
        if (version.isRemote) console.log(`⏭️  ${id}: ${version.spec} (remote, not mocked)`);
        else apis.push({ id, title: api.title, fullPath: version.fullPath });
      }
    }
    if (!apis.length) {
      console.error(`\n❌ ${folder} has no local specs under apis: to mock.\n`);
      process.exit(1);
    }
  } else if (folder) {
    const { findOpenApiSpecs } = await import('create-rapidoc/scaffold');
    const files = findOpenApiSpecs(folder).map((file) => path.join(folder, file));
    if (!files.length) {
      console.error(`\n❌ ${folder} has no rapidoc.config.yaml and no OpenAPI files to mock.\n`);
      process.exit(1);
    }
    console.log(`\n📂 No rapidoc.config.yaml in ${folder}: mocking the ${files.length} OpenAPI file(s) found there.`);
    apis = mockApisFromFiles(files);
  } else {
    const dirs = targets.filter((target) => fs.statSync(target).isDirectory());
    if (dirs.length) {
      console.error(`\n❌ Pass one folder, or one or more spec files (not both): ${dirs.join(', ')}\n`);
      process.exit(1);
    }
    apis = mockApisFromFiles(targets);
  }

  const issuer = optionValue('--issuer') || process.env.RAPIDOC_MOCK_ISSUER || undefined;
  const audience = optionValue('--audience') || process.env.RAPIDOC_MOCK_AUDIENCE || undefined;
  const { startMockServer } = await loadMock();
  let server;
  try {
    server = await startMockServer({ apis, port, host: optionValue('--host'), issuer, audience, seed });
  } catch (err) {
    console.error(`\n❌ Mock server failed: ${err.message}\n`);
    process.exit(1);
  }

  console.log(`\n🧪 Mock server: ${server.url}`);
  const fileOf = new Map(apis.map((api) => [api.id, path.relative(process.cwd(), api.fullPath)]));
  for (const api of server.apis) {
    console.log(
      `   • ${server.url}/${api.id}  ${api.title ? `${api.title}, ` : ''}${api.operations} operation(s)  (${fileOf.get(api.id)})`
    );
  }
  for (const api of server.skipped) console.warn(`   ⚠️  ${api.id}: not served (${api.error.split('\n')[0]})`);
  if (issuer) {
    console.log(`   • Tokens:   verified against ${issuer}${audience ? ` for ${audience}` : ''}; scopes from scope, scp or permissions`);
    if (!audience) console.warn('   ⚠️  No audience set (--audience or RAPIDOC_MOCK_AUDIENCE): tokens for any API are accepted.');
  } else {
    console.log('   • Tokens:   not verified, any bearer token passes (set --issuer or RAPIDOC_MOCK_ISSUER to check them)');
  }
  console.log('   • Try:      Prefer: code=404 picks a documented response; Prefer: example=<name> an example\n');

  const stop = async () => {
    await server.close();
    process.exit(0);
  };
  process.once('SIGINT', stop);
  process.once('SIGTERM', stop);
}

/**
 * Validates one spec against the OpenAPI schema and, when the portal engine is installed, prints its link
 * warnings (see checkApiSpec). Returns false when the spec has errors.
 */
async function validateSpec(id, fullPath, portal) {
  console.log(`\n🔍 ${id}: ${fullPath}`);
  // Loading from the file (not its text) lets relative $refs to other files resolve.
  const { filesystem } = await load(fullPath, { plugins: [readFiles()] });
  const result = await validate(filesystem);
  if (!result.valid) {
    console.error(`   ❌ Specification has validation errors:`);
    console.error(result.errors);
    return false;
  }
  console.log('   ✅ Specification is valid OpenAPI!');
  for (const warning of portal?.checkApiSpec({ id, fullPath }) ?? []) console.warn(`   ⚠️  ${warning}`);
  return true;
}

// rapidoc validate <spec>: one spec file. rapidoc validate [dir]: every local spec in the portal's apis:.
async function handleValidate() {
  const target = path.resolve(args[1] && !args[1].startsWith('--') ? args[1] : process.cwd());
  if (!fs.existsSync(target)) {
    console.error(`Error: File not found: ${target}`);
    process.exit(1);
  }

  if (fs.statSync(target).isFile()) {
    console.log(`\nValidating OpenAPI specification...`);
    const valid = await validateSpec(path.basename(target), target, await tryLoadPortal());
    console.log('');
    if (!valid) process.exit(1);
    return;
  }

  const portal = await loadPortal();
  let config;
  try {
    ({ config } = await portal.loadConfig(target));
  } catch (err) {
    console.error(`\n❌ ${err.message}\n`);
    process.exit(1);
  }

  console.log(`\nValidating the specs in ${target}...`);
  let failed = 0;
  const versions = (config.apis || []).flatMap((api) =>
    api.versions.map((version) => ({ ...version, id: api.versioned ? `${api.id} ${version.version}` : api.id }))
  );
  for (const version of versions) {
    if (version.isRemote) {
      console.log(`\n⏭️  ${version.id}: ${version.spec} (remote, skipped)`);
    } else if (!(await validateSpec(version.id, version.fullPath, portal))) {
      failed += 1;
    }
  }
  const total = versions.length;
  console.log(failed ? `\n❌ ${failed} of ${total} specs have errors.\n` : `\n✅ ${total} specs checked, no errors.\n`);
  if (failed) process.exit(1);
}

async function handleMigrate() {
  const { migrateConfig, MIGRATION_SOURCES } = await loadPortal();
  const fromIdx = args.indexOf('--from');
  const source = fromIdx !== -1 ? args[fromIdx + 1]?.toLowerCase() : null;
  const sources = Object.keys(MIGRATION_SOURCES);

  if (!source || !sources.includes(source)) {
    console.error(`Error: Please specify the source with --from ${sources.join(' | ')}.`);
    process.exit(1);
  }

  const targetDir = process.cwd();
  console.log(`\n🔄 Migrating ${source} config in ${targetDir} to rapidoc.config.yaml...`);

  try {
    const result = await migrateConfig(targetDir, { from: source, overwrite: true });
    console.log(`\n✅ Successfully generated rapidoc.config.yaml at: ${result.filePath}`);
    if (result.warnings.length) {
      console.log(`\n⚠️  Not migrated:\n${result.warnings.map((w) => `   - ${w}`).join('\n')}`);
    }
    if (result.problems.length) {
      console.log(`\n⚠️  Fix these before building:\n${result.problems.map((p) => `   - ${p}`).join('\n')}`);
    }
    console.log('');
  } catch (err) {
    console.error(`\n❌ Migration failed: ${err.message}\n`);
    process.exit(1);
  }
}

// rapidoc init [dir]: the same scaffold as `npm create rapidoc`, built around any OpenAPI files already in dir.
async function handleInit() {
  const { scaffoldProject, findOpenApiSpecs } = await import('create-rapidoc/scaffold');
  const targetDir = path.resolve(positional(1) || '.');
  const specs = fs.existsSync(targetDir) ? findOpenApiSpecs(targetDir) : [];

  let title = optionValue('--title');
  if (!title && !args.includes('--yes') && !args.includes('-y') && process.stdin.isTTY) {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    title = (await rl.question('Site title (leave empty for a default): ')).trim() || undefined;
    rl.close();
  }

  console.log(`\n🚀 Scaffolding a RapiDoc Developer Portal in: ${targetDir}`);
  if (specs.length) console.log(`   Using ${specs.length} OpenAPI file(s) found there: ${specs.join(', ')}`);

  let result;
  try {
    result = scaffoldProject(targetDir, { title, overwrite: args.includes('--force') || args.includes('-f'), specs });
  } catch (err) {
    console.error(`\n❌ Failed to scaffold the portal: ${err.message}\n`);
    process.exit(1);
  }

  console.log(`\n✨ Created ${result.filesCreated.length} file(s) for "${result.siteTitle}"`);
  if (result.filesSkipped.length) {
    console.log(`   Kept ${result.filesSkipped.length} existing file(s) (use --force to overwrite):`);
    for (const file of result.filesSkipped) console.log(`   • ${path.relative(targetDir, file)}`);
  }

  const packageJsonPath = path.join(targetDir, 'package.json');
  const ownPackageJson = result.filesCreated.includes(packageJsonPath);
  const relDir = path.relative(process.cwd(), targetDir) || '.';
  if (!ownPackageJson) {
    console.log(`\nAdd the CLI and the portal engine to your existing package.json:`);
    console.log(`   npm install -D @rapidoc/cli @rapidoc/portal`);
  } else if (!args.includes('--no-install')) {
    console.log(`\n📦 Installing dependencies...`);
    const install = spawnSync('npm', ['install'], { cwd: targetDir, stdio: 'inherit', shell: process.platform === 'win32' });
    if (install.status !== 0) console.warn(`\n⚠️  npm install failed; run it yourself in ${relDir}.`);
  }

  console.log(`\nNext steps:`);
  if (relDir !== '.') console.log(`   cd ${relDir}`);
  if (ownPackageJson && args.includes('--no-install')) console.log(`   npm install`);
  console.log(`   ${ownPackageJson ? 'npm run dev' : 'npx rapidoc dev'}\n`);
}

switch (command) {
  case 'init':
    await handleInit();
    break;
  case 'dev':
    await handleDev();
    break;
  case 'build':
    await handleBuild();
    break;
  case 'serve':
    await handleServe();
    break;
  case 'mock':
    await handleMock();
    break;
  case 'validate':
    await handleValidate();
    break;
  case 'migrate':
    await handleMigrate();
    break;
  case '--version':
  case '-v':
    console.log('0.1.0');
    break;
  case '--help':
  case '-h':
  default:
    printHelp();
    break;
}
