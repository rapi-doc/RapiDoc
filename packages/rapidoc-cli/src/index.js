#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { buildPortal, migrateConfig } from '@rapidoc/portal';
import { validate } from '@scalar/openapi-parser';

const args = process.argv.slice(2);
const command = args[0] || '--help';

function printHelp() {
  console.log(`
RapiDoc CLI (@rapidoc/cli) - OpenAPI & Developer Portal Toolkit

Usage:
  rapidoc <command> [options]

Commands:
  build [dir]             Pre-renders static developer portal into dist/ (SSG)
  validate <spec>         Validates an OpenAPI 3.0 / 3.1 specification file
  migrate --from <src>    Migrates existing redocly or zudoku project to rapidoc.config.yaml
  --help, -h              Show this help message
  --version, -v           Show version information

Examples:
  rapidoc build
  rapidoc build ./my-api-portal --outDir dist
  rapidoc validate ./specs/orders-api.yaml
  rapidoc migrate --from redocly
`);
}

async function handleBuild() {
  const targetDir = args[1] && !args[1].startsWith('--') ? args[1] : process.cwd();
  console.log(`\n🚀 Building RapiDoc Portal in: ${targetDir}`);

  try {
    const result = await buildPortal(targetDir);
    console.log(`\n✨ Build completed successfully in ${result.durationMs}ms!`);
    console.log(`   • Pages generated: ${result.pagesCount}`);
    console.log(`   • APIs compiled:   ${result.apisCount}`);
    console.log(`   • Output folder:   ${result.outDir}\n`);
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
