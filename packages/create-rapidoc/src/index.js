#!/usr/bin/env node

import path from "node:path";
import fs from "node:fs";
import pkg from "../package.json" with { type: "json" };
import { findOpenApiSpecs, scaffoldProject } from "./scaffold.js";
import { askInitQuestions } from "./wizard.js";

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
  --yes, -y          Don't ask: use the defaults (in a terminal it asks for the title and which specs)
  --help, -h         Show this help message
  --version, -v      Show version information

Examples:
  npm create rapidoc@latest my-portal
  npx create-rapidoc ./company-docs --title "Stripe Alternative Docs"
`);
}

if (args.includes("--help") || args.includes("-h")) {
  printHelp();
  process.exit(0);
}

if (args.includes("--version") || args.includes("-v")) {
  console.log(pkg.version);
  process.exit(0);
}

let targetDir = args.find((a) => !a.startsWith("-")) || "my-developer-portal";
const titleIdx = args.indexOf("--title");
const customTitle = titleIdx !== -1 && args[titleIdx + 1] ? args[titleIdx + 1] : undefined;
const force = args.includes("--force") || args.includes("-f");
const yes = args.includes("--yes") || args.includes("-y");
const foundSpecs = fs.existsSync(targetDir) ? findOpenApiSpecs(targetDir) : [];

// In a terminal, the same questions as `rapidoc init` (installing is left to the next steps).
let answers = { title: customTitle };
if (!yes && process.stdin.isTTY && process.stdout.isTTY && !process.env.CI) {
  const clack = await import("@clack/prompts");
  const answer = (prompt) => async (options) => {
    const value = await prompt(options);
    if (clack.isCancel(value)) {
      clack.cancel("Cancelled.");
      process.exit(130);
    }
    return value;
  };
  clack.intro("Create a RapiDoc developer portal");
  answers = await askInitQuestions({
    ask: {
      text: answer(clack.text),
      multiselect: answer(clack.multiselect),
      confirm: answer(clack.confirm),
    },
    targetDir,
    foundSpecs,
    known: { title: customTitle },
    askInstall: false,
  });
}

console.log(`\n🚀 Scaffolding new RapiDoc Developer Portal into: ${targetDir}`);

try {
  const result = await scaffoldProject(targetDir, {
    title: answers.title || undefined,
    overwrite: force,
    specs: answers.specs ?? foundSpecs,
  });

  console.log(`\n✨ Successfully created ${result.projectName}!`);
  console.log(`   • Site Title:   ${result.siteTitle}`);
  console.log(`   • Location:     ${result.targetDir}`);
  console.log(`   • Files:        ${result.filesCreated.length} starter files generated`);

  console.log(`\nNext steps:`);
  console.log(`   1. cd ${path.relative(process.cwd(), result.targetDir) || "."}`);
  console.log(`   2. npm install`);
  console.log(`   3. npm run dev\n`);
} catch (err) {
  console.error(`\n❌ Failed to scaffold portal: ${err.message}\n`);
  process.exit(1);
}
