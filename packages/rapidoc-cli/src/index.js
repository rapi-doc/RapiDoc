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
  validate [spec|dir]     Validates one OpenAPI 3.0 / 3.1 spec, or every spec in a portal's apis: (default: current folder)
  migrate --from <src>    Converts a Redocly or a Zudoku project to rapidoc.config.yaml (redocly, zudoku)
  --help, -h              Show this help message
  --version, -v           Show version information

Options:
  --outDir <path>         Output directory for static assets (default: dist)
  --port <number>         Development server port (default: 4321)
  --debug                 Keep the temporary Astro workspace and print its path (for debugging the engine)
  --title <title>         init: site title (asked for when omitted in a terminal)
  --force, -f             init: overwrite existing files
  --yes, -y               init: accept defaults without asking
  --no-install            init: skip npm install

dev, build, migrate and folder-wide validate need @rapidoc/portal installed next to the CLI.

Examples:
  rapidoc init my-portal --title "Acme Developer Portal"
  rapidoc dev
  rapidoc build
  rapidoc build ./my-api-portal
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
    console.log('');
  } catch (err) {
    console.error(`\n❌ Build failed: ${err.message}\n`);
    process.exit(1);
  }
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
  for (const api of config.apis || []) {
    if (api.isRemote) {
      console.log(`\n⏭️  ${api.id}: ${api.spec} (remote, skipped)`);
    } else if (!(await validateSpec(api.id, api.fullPath, portal))) {
      failed += 1;
    }
  }
  const total = (config.apis || []).length;
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
