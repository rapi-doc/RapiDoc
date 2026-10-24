#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { buildPortal, startDevServer, migrateConfig, MIGRATION_SOURCES, loadConfig, checkApiSpec } from '@rapidoc/portal';
import { load, validate } from '@scalar/openapi-parser';
import { readFiles } from '@scalar/openapi-parser/plugins/read-files';

const args = process.argv.slice(2);
const command = args[0] || '--help';

function printHelp() {
  console.log(`
RapiDoc CLI (@rapidoc/cli) - OpenAPI & Developer Portal Toolkit

Usage:
  rapidoc <command> [options]

Commands:
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

Examples:
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
 * Validates one spec against the OpenAPI schema and prints link warnings (see checkApiSpec).
 * Returns false when the spec has errors.
 */
async function validateSpec(id, fullPath) {
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
  for (const warning of checkApiSpec({ id, fullPath })) console.warn(`   ⚠️  ${warning}`);
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
    const valid = await validateSpec(path.basename(target), target);
    console.log('');
    if (!valid) process.exit(1);
    return;
  }

  let config;
  try {
    ({ config } = await loadConfig(target));
  } catch (err) {
    console.error(`\n❌ ${err.message}\n`);
    process.exit(1);
  }

  console.log(`\nValidating the specs in ${target}...`);
  let failed = 0;
  for (const api of config.apis || []) {
    if (api.isRemote) {
      console.log(`\n⏭️  ${api.id}: ${api.spec} (remote, skipped)`);
    } else if (!(await validateSpec(api.id, api.fullPath))) {
      failed += 1;
    }
  }
  const total = (config.apis || []).length;
  console.log(failed ? `\n❌ ${failed} of ${total} specs have errors.\n` : `\n✅ ${total} specs checked, no errors.\n`);
  if (failed) process.exit(1);
}

async function handleMigrate() {
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

switch (command) {
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
