import { loadPortal } from "../lib/engines.js";
import { ProblemError } from "../lib/errors.js";
import { icon, info, success } from "../lib/output.js";

export default {
  name: "migrate",
  usage: "migrate --from <src>",
  summary: "Converts a Redocly or a Zudoku project to rapidoc.config.yaml (redocly, zudoku)",
  description:
    "Reads the project in the current folder and writes rapidoc.config.yaml next to it, listing what\nwasn't migrated and what to fix before building.",
  positionals: { name: "", max: 0 },
  options: {
    from: {
      type: "string",
      value: "src",
      choices: ["redocly", "zudoku"],
      required: true,
      description: "The tool the project comes from",
    },
  },
  examples: ["rapidoc migrate --from redocly", "rapidoc migrate --from zudoku"],

  async run({ values }) {
    const { migrateConfig } = await loadPortal("migrate");
    const targetDir = process.cwd();
    info(
      `\n${icon("🔄")}Migrating ${values.from} config in ${targetDir} to rapidoc.config.yaml...`,
    );

    let result;
    try {
      result = await migrateConfig(targetDir, { from: values.from, overwrite: true });
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
