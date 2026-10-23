#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { buildPortal, startDevServer, migrateConfig } from '@rapidoc/portal';
import { validate } from '@scalar/openapi-parser';

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
  validate <spec>         Validates an OpenAPI 3.0 / 3.1 specification file
  migrate --from <src>    Migrates existing redocly or zudoku project to rapidoc.config.yaml
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
  rapidoc validate ./specs/orders-api.yaml
  rapidoc migrate --from redocly
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

async function handleValidate() {
  const specPath = args[1];
  if (!specPath) {
    console.error('Error: Please provide path to an OpenAPI specification file.');
    process.exit(1);
  }

  const resolved = path.resolve(specPath);
  if (!fs.existsSync(resolved)) {
    console.error(`Error: File not found: ${resolved}`);
    process.exit(1);
  }

  console.log(`\n🔍 Validating OpenAPI specification: ${specPath}...`);
  const content = fs.readFileSync(resolved, 'utf8');
  const result = await validate(content);

  if (result.valid) {
    console.log(`\n✅ Specification is valid OpenAPI! (${resolved})\n`);
  } else {
    console.error(`\n❌ Specification has validation errors:`);
    console.error(result.errors);
    process.exit(1);
  }
}

async function handleMigrate() {
  const fromIdx = args.indexOf('--from');
  const source = fromIdx !== -1 ? args[fromIdx + 1] : null;

  if (!source || !['redocly', 'zudoku'].includes(source.toLowerCase())) {
    console.error('Error: Please specify source framework using --from redocly or --from zudoku.');
    process.exit(1);
  }

  const targetDir = process.cwd();
  console.log(`\n🔄 Migrating ${source} project in ${targetDir} to rapidoc.config.yaml...`);

  try {
    const result = await migrateConfig(targetDir, { overwrite: true });
    console.log(`\n✅ Successfully generated rapidoc.config.yaml at: ${result.filePath}\n`);
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
