import path from "node:path";
import { loadPortal } from "../lib/engines.js";
import { ProblemError } from "../lib/errors.js";
import { icon, info, warn } from "../lib/output.js";

export default {
  name: "build",
  usage: "build [dir]",
  summary: "Pre-renders the static developer portal into dist/ (SSG)",
  description:
    "Builds the portal in dir (default: current folder). With sign-in configured, the output is split\ninto public/ and protected/; serve it with `rapidoc serve`.",
  positionals: { name: "dir", max: 1 },
  options: {
    "out-dir": {
      type: "string",
      value: "path",
      default: "dist",
      description: "Output folder, relative to the portal folder",
    },
    debug: {
      type: "boolean",
      description:
        "Keep the temporary Astro workspace and print its path (for debugging the engine)",
    },
  },
  examples: ["rapidoc build", "rapidoc build ./my-portal", "rapidoc build --out-dir public"],

  async run({ values, positionals }) {
    const targetDir = path.resolve(positionals[0] || ".");
    info(`\n${icon("🚀")}Building RapiDoc Portal in: ${targetDir}`);
    info(`   Engine: Astro + Starlight`);

    const { buildPortal } = await loadPortal("build");
    let result;
    try {
      result = await buildPortal(targetDir, {
        outDir: values["out-dir"],
        keepWorkspace: values.debug,
      });
    } catch (err) {
      throw new ProblemError(`Build failed: ${err.message}`);
    }

    info(`\n${icon("✨")}Astro build completed successfully in ${result.durationMs}ms!`);
    info(`   • APIs compiled:   ${result.apisCount}`);
    info(`   • Output folder:   ${result.outDir}`);
    if (result.workspaceDir) info(`   • Workspace (kept): ${result.workspaceDir}`);
    if (result.access) {
      const { protectedPages, zones, warnings } = result.access;
      info(`   • Protected:       ${protectedPages} page(s) in ${zones.length} zone(s)`);
      for (const warning of warnings) warn(warning, "   ");
      const outRel = path.relative(process.cwd(), result.outDir) || ".";
      info(
        `\n   Serve it with \`rapidoc serve ${outRel}\`. ${outRel}/public alone is safe to host anywhere but has no protected content.`,
      );
    }
    info("");
  },
};
