import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { createInterface } from "node:readline/promises";
import { ProblemError } from "../lib/errors.js";
import { icon, info, warn } from "../lib/output.js";

export default {
  name: "init",
  usage: "init [dir]",
  summary:
    "Scaffolds a developer portal (default: current folder); uses OpenAPI files already there",
  description:
    "The same scaffold as `npm create rapidoc`, built around any OpenAPI files already in dir.\nAsks for the site title in a terminal unless --title or --yes is given.",
  positionals: { name: "dir", max: 1 },
  options: {
    title: { type: "string", value: "title", description: "Site title" },
    force: { type: "boolean", short: "f", description: "Overwrite existing files" },
    yes: { type: "boolean", short: "y", description: "Accept defaults without asking" },
    install: {
      type: "boolean",
      negatable: true,
      default: true,
      description: "Skip npm install",
    },
  },
  examples: [
    "rapidoc init",
    'rapidoc init my-portal --title "Acme Developer Portal"',
    "rapidoc init --yes --no-install",
  ],

  async run({ values, positionals }) {
    const { scaffoldProject, findOpenApiSpecs } = await import("create-rapidoc/scaffold");
    const targetDir = path.resolve(positionals[0] || ".");
    const specs = fs.existsSync(targetDir) ? findOpenApiSpecs(targetDir) : [];

    let title = values.title;
    if (!title && !values.yes && process.stdin.isTTY) {
      const rl = createInterface({ input: process.stdin, output: process.stdout });
      title = (await rl.question("Site title (leave empty for a default): ")).trim() || undefined;
      rl.close();
    }

    info(`\n${icon("🚀")}Scaffolding a RapiDoc Developer Portal in: ${targetDir}`);
    if (specs.length)
      info(`   Using ${specs.length} OpenAPI file(s) found there: ${specs.join(", ")}`);

    let result;
    try {
      result = scaffoldProject(targetDir, { title, overwrite: values.force, specs });
    } catch (err) {
      throw new ProblemError(`Failed to scaffold the portal: ${err.message}`);
    }

    info(`\n${icon("✨")}Created ${result.filesCreated.length} file(s) for "${result.siteTitle}"`);
    if (result.filesSkipped.length) {
      info(`   Kept ${result.filesSkipped.length} existing file(s) (use --force to overwrite):`);
      for (const file of result.filesSkipped) info(`   • ${path.relative(targetDir, file)}`);
    }

    const packageJsonPath = path.join(targetDir, "package.json");
    const ownPackageJson = result.filesCreated.includes(packageJsonPath);
    const relDir = path.relative(process.cwd(), targetDir) || ".";
    if (!ownPackageJson) {
      info(`\nAdd the CLI and the portal engine to your existing package.json:`);
      info(`   npm install -D @rapidoc/cli @rapidoc/portal`);
    } else if (values.install) {
      info(`\n${icon("📦")}Installing dependencies...`);
      const install = spawnSync("npm", ["install"], {
        cwd: targetDir,
        stdio: "inherit",
        shell: process.platform === "win32",
      });
      if (install.status !== 0) warn(`npm install failed; run it yourself in ${relDir}.`, "\n");
    }

    info(`\nNext steps:`);
    if (relDir !== ".") info(`   cd ${relDir}`);
    if (ownPackageJson && !values.install) info(`   npm install`);
    info(`   ${ownPackageJson ? "npm run dev" : "npx rapidoc dev"}\n`);
  },
};
