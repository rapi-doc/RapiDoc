import fs from "node:fs";
import path from "node:path";
import { loadPortal } from "../lib/engines.js";
import { CancelledError, ProblemError, UsageError } from "../lib/errors.js";
import { icon, info, success } from "../lib/output.js";
import { assumingYes, canAsk, confirm, select } from "../lib/prompt.js";

const LABELS = { redocly: "Redocly", zudoku: "Zudoku" };

/**
 * The source to migrate from: --from, else the project found in the folder (MIGRATION_SOURCES lists
 * each tool's config file names). In a terminal it asks to confirm (or to pick, when there are two);
 * with --yes it takes the one found; otherwise it fails naming --from.
 */
async function chooseSource(targetDir, from, sources) {
  if (from) return from;
  const found = Object.entries(sources).flatMap(([source, files]) => {
    const file = files.find((name) => fs.existsSync(path.join(targetDir, name)));
    return file ? [{ source, file }] : [];
  });
  const fromOption = `--from ${Object.keys(sources).join("|")}`;
  if (!found.length) {
    throw new UsageError(
      `No Redocly (redocly.yaml) or Zudoku (zudoku.config.*) project in ${targetDir}. Run it in the project's folder, or pass ${fromOption}.`,
      { command: "migrate" },
    );
  }
  if (canAsk()) {
    if (found.length === 1) {
      const [{ source, file }] = found;
      const ok = await confirm({
        message: `Found ${file}. Migrate this ${LABELS[source] ?? source} project?`,
        initialValue: true,
      });
      if (!ok) throw new CancelledError();
      return source;
    }
    return select({
      message: "Which project do you want to migrate?",
      options: found.map(({ source, file }) => ({
        value: source,
        label: LABELS[source] ?? source,
        hint: file,
      })),
    });
  }
  if (assumingYes() && found.length === 1) return found[0].source;
  if (found.length === 1) {
    const [{ source, file }] = found;
    throw new UsageError(`Found ${file}: pass --from ${source} (or --yes) to migrate it.`, {
      command: "migrate",
    });
  }
  const list = found.map(({ file }) => file).join(" and ");
  throw new UsageError(`Found ${list}: pass ${fromOption} to say which to migrate.`, {
    command: "migrate",
  });
}

export default {
  name: "migrate",
  usage: "migrate [dir] [--from <src>]",
  summary: "Converts a Redocly or a Zudoku project to rapidoc.config.yaml (redocly, zudoku)",
  description:
    "Reads the project in dir (default: current folder) and writes rapidoc.config.yaml next to it,\nlisting what wasn't migrated and what to fix before building. Without --from it looks for\nredocly.yaml or zudoku.config.* and, in a terminal, asks to confirm. An existing\nrapidoc.config.yaml is replaced only with --force, or after asking in a terminal.",
  positionals: { name: "dir", max: 1 },
  options: {
    from: {
      type: "string",
      value: "src",
      choices: ["redocly", "zudoku"],
      description: "The tool the project comes from (default: the one found in the folder)",
    },
    force: {
      type: "boolean",
      short: "f",
      description: "Replace an existing rapidoc.config.yaml without asking",
    },
  },
  examples: [
    "rapidoc migrate",
    "rapidoc migrate ./my-docs --from redocly",
    "rapidoc migrate --from zudoku --yes",
    "rapidoc migrate --from zudoku --force",
  ],

  async run({ values, positionals }) {
    const { migrateConfig, MIGRATION_SOURCES } = await loadPortal("migrate");
    const targetDir = path.resolve(positionals[0] || ".");
    if (!fs.existsSync(targetDir) || !fs.statSync(targetDir).isDirectory())
      throw new UsageError(`${targetDir} is not a folder.`, { command: "migrate" });
    const from = await chooseSource(targetDir, values.from, MIGRATION_SOURCES);

    if (fs.existsSync(path.join(targetDir, "rapidoc.config.yaml")) && !values.force) {
      if (!canAsk())
        throw new ProblemError("rapidoc.config.yaml exists: pass --force to replace it.");
      const ok = await confirm({
        message: "rapidoc.config.yaml exists. Replace it?",
        initialValue: false,
      });
      if (!ok) throw new CancelledError("Cancelled; rapidoc.config.yaml was left as it was.");
    }

    info(`\n${icon("🔄")}Migrating ${from} config in ${targetDir} to rapidoc.config.yaml...`);
    let result;
    try {
      result = await migrateConfig(targetDir, { from, overwrite: true });
    } catch (err) {
      throw new ProblemError(`Migration failed: ${err.message}`);
    }
    success(`Successfully generated rapidoc.config.yaml at: ${result.filePath}`, "\n");
    if (result.warnings.length) {
      info(`\n${icon("⚠️ ")}Not migrated:\n${result.warnings.map((w) => `   - ${w}`).join("\n")}`);
    }
    if (result.problems.length) {
      info(
        `\n${icon("⚠️ ")}Fix these before building:\n${result.problems.map((p) => `   - ${p}`).join("\n")}`,
      );
    }
    info("");
  },
};
