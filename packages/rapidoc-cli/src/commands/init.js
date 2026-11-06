import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { CancelledError, ProblemError } from "../lib/errors.js";
import { icon, info, warn } from "../lib/output.js";
import { canAsk, confirm, intro, multiselect, text } from "../lib/prompt.js";

const slash = (file) => file.split(path.sep).join("/");
const quote = (value) => (/^[\w./@:-]+$/.test(value) ? value : JSON.stringify(value));

/** `rapidoc init …` that does the same as this run without asking anything. */
function equivalentCommand({ targetDir, title, specs, starter, install }) {
  const parts = ["rapidoc init"];
  const relDir = slash(path.relative(process.cwd(), targetDir));
  if (relDir) parts.push(quote(relDir));
  if (title) parts.push(`--title ${quote(title)}`);
  if (starter) parts.push("--starter-spec");
  for (const spec of specs ?? [])
    parts.push(
      `--spec ${quote(slash(path.relative(process.cwd(), path.join(targetDir, spec))) || ".")}`,
    );
  if (install === false) parts.push("--no-install");
  return parts.join(" ");
}

export default {
  name: "init",
  usage: "init [dir]",
  summary:
    "Scaffolds a developer portal (default: current folder); uses OpenAPI files already there",
  description:
    "The same scaffold as `npm create rapidoc`, built around the OpenAPI files already in dir (all of\nthem unless --spec or --starter-spec says otherwise). In a terminal it asks for what the options\ndon't say: the title, which specs, whether to run npm install; then prints the command that does\nthe same without asking.",
  positionals: { name: "dir", max: 1 },
  options: {
    title: { type: "string", value: "title", description: "Site title" },
    spec: {
      type: "string",
      value: "file",
      multiple: true,
      description: "An OpenAPI file to include (repeat for more); default: every one found",
    },
    "starter-spec": {
      type: "boolean",
      description: "Use the starter spec, not the OpenAPI files found in dir",
    },
    force: {
      type: "boolean",
      short: "f",
      description: "Overwrite existing files (asks first in a terminal)",
    },
    install: { type: "boolean", negatable: true, description: "Skip npm install" },
  },
  examples: [
    "rapidoc init",
    'rapidoc init my-portal --title "Acme Developer Portal"',
    "rapidoc init --spec specs/orders.yaml --spec specs/billing.yaml",
    "rapidoc init --yes --no-install",
  ],

  async run({ values, positionals }) {
    const { scaffoldProject, planScaffold, findOpenApiSpecs } =
      await import("create-rapidoc/scaffold");
    const targetDir = path.resolve(positionals[0] || ".");
    const foundSpecs = fs.existsSync(targetDir) ? findOpenApiSpecs(targetDir) : [];

    if (values.spec && values["starter-spec"]) {
      throw new ProblemError("Pass --spec or --starter-spec, not both.");
    }
    let specsGiven;
    if (values["starter-spec"]) specsGiven = [];
    if (values.spec) {
      specsGiven = values.spec.map((file) => {
        const fullPath = path.resolve(file);
        if (!fs.existsSync(fullPath)) throw new ProblemError(`--spec ${file}: file not found`);
        return slash(path.relative(targetDir, fullPath));
      });
    }

    // Ask for what the options didn't say (in a terminal only; otherwise the defaults).
    const hasPackageJson = fs.existsSync(path.join(targetDir, "package.json"));
    const known = { title: values.title, specs: specsGiven, install: values.install };
    const open =
      known.title === undefined ||
      (known.specs === undefined && foundSpecs.length > 0) ||
      (known.install === undefined && !hasPackageJson);
    let answers = known;
    const asked = open && canAsk();
    if (asked) {
      const { askInitQuestions } = await import("create-rapidoc/wizard");
      await intro("Create a RapiDoc developer portal");
      answers = await askInitQuestions({
        ask: { text, multiselect, confirm },
        targetDir,
        foundSpecs,
        known,
        askInstall: !hasPackageJson,
      });
    }
    const title = answers.title || undefined;
    const specs = answers.specs ?? foundSpecs;
    const install = answers.install ?? true;

    // --force over existing files: list them and ask first (in a terminal).
    const plan = planScaffold(targetDir, { title, specs });
    const existing = plan.files.filter((file) => fs.existsSync(file.path));
    if (values.force && existing.length && canAsk()) {
      info(`\nThese ${existing.length} file(s) exist and would be replaced:`);
      for (const file of existing) info(`   • ${slash(path.relative(targetDir, file.path))}`);
      const ok = await confirm({ message: "Overwrite them?", initialValue: false });
      if (!ok) throw new CancelledError("Cancelled; nothing was written.");
    }

    info(`\n${icon("🚀")}Scaffolding a RapiDoc Developer Portal in: ${targetDir}`);
    if (specs.length) info(`   Using ${specs.length} OpenAPI file(s): ${specs.join(", ")}`);

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
    } else if (install) {
      info(`\n${icon("📦")}Installing dependencies...`);
      const npm = spawnSync("npm", ["install"], {
        cwd: targetDir,
        stdio: "inherit",
        shell: process.platform === "win32",
      });
      if (npm.status !== 0) warn(`npm install failed; run it yourself in ${relDir}.`, "\n");
    }

    if (asked) {
      const starter =
        answers.specs !== undefined && answers.specs.length === 0 && foundSpecs.length > 0;
      const chosen =
        answers.specs?.length && answers.specs.length !== foundSpecs.length
          ? answers.specs
          : undefined;
      info(`\nThe same without questions:`);
      info(
        `   ${equivalentCommand({ targetDir, title, specs: chosen, starter, install: ownPackageJson ? install : undefined })}`,
      );
    }

    info(`\nNext steps:`);
    if (relDir !== ".") info(`   cd ${relDir}`);
    if (ownPackageJson && !install) info(`   npm install`);
    info(`   ${ownPackageJson ? "npm run dev" : "npx rapidoc dev"}\n`);
  },
};
