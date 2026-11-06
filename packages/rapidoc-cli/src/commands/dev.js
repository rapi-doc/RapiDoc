import path from "node:path";
import { loadPortal } from "../lib/engines.js";
import { ProblemError } from "../lib/errors.js";
import { icon, info } from "../lib/output.js";

export default {
  name: "dev",
  usage: "dev [dir]",
  summary: "Launches the local development server with HMR (Astro + Starlight)",
  description:
    "Serves the portal in dir (default: current folder) and rebuilds it as files change.",
  positionals: { name: "dir", max: 1 },
  options: {
    port: {
      type: "string",
      kind: "port",
      value: "number",
      default: 4321,
      description: "Server port",
    },
    debug: {
      type: "boolean",
      description:
        "Keep the temporary Astro workspace and print its path (for debugging the engine)",
    },
  },
  examples: ["rapidoc dev", "rapidoc dev ./my-portal --port 3000"],

  async run({ values, positionals }) {
    const targetDir = path.resolve(positionals[0] || ".");
    info(`\n${icon("✨")}Starting RapiDoc Portal Dev Server in: ${targetDir}`);
    info(`   Engine: Astro + Starlight\n`);

    const { startDevServer } = await loadPortal("dev");
    let devServer;
    try {
      devServer = await startDevServer(targetDir, {
        port: values.port,
        keepWorkspace: values.debug,
      });
    } catch (err) {
      throw new ProblemError(`Dev server failed: ${err.message}`);
    }
    if (values.debug) info(`   • Workspace (kept): ${devServer.workspaceDir}\n`);
  },
};
