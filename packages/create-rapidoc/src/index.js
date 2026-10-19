#!/usr/bin/env node

import path from 'node:path';
import { scaffoldProject } from './scaffold.js';

const args = process.argv.slice(2);

function printHelp() {
  console.log(`
create-rapidoc - Scaffold a modern RapiDoc Developer Portal

Usage:
  npm create rapidoc@latest [directory] [options]
  npx create-rapidoc [directory] [options]

Options:
  --title <title>    Human-readable site title (e.g. "Acme Developer Portal")
  --force, -f        Overwrite existing files in target directory
  --help, -h         Show this help message
  --version, -v      Show version information

Examples:
  npm create rapidoc@latest my-portal
  npx create-rapidoc ./company-docs --title "Stripe Alternative Docs"
`);
}

if (args.includes('--help') || args.includes('-h')) {
  printHelp();
  process.exit(0);
}

if (args.includes('--version') || args.includes('-v')) {
  console.log('0.1.0');
  process.exit(0);
}

let targetDir = args.find((a) => !a.startsWith('-')) || 'my-developer-portal';
const titleIdx = args.indexOf('--title');
const customTitle = titleIdx !== -1 && args[titleIdx + 1] ? args[titleIdx + 1] : undefined;
const force = args.includes('--force') || args.includes('-f');

console.log(`\n🚀 Scaffolding new RapiDoc Developer Portal into: ${targetDir}`);

try {
  const result = await scaffoldProject(targetDir, {
    title: customTitle,
    overwrite: force,
  });

  console.log(`\n✨ Successfully created ${result.projectName}!`);
  console.log(`   • Site Title:   ${result.siteTitle}`);
  console.log(`   • Location:     ${result.targetDir}`);
  console.log(`   • Files:        ${result.filesCreated.length} starter files generated`);

  console.log(`\nNext steps:`);
  console.log(`   1. cd ${path.relative(process.cwd(), result.targetDir) || '.'}`);
  console.log(`   2. npm install`);
  console.log(`   3. npx rapidoc build\n`);
} catch (err) {
  console.error(`\n❌ Failed to scaffold portal: ${err.message}\n`);
  process.exit(1);
}
