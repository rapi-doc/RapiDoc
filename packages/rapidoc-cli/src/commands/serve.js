import path from "node:path";
import { loadServer } from "../lib/engines.js";
import { ProblemError } from "../lib/errors.js";
import { icon, info, warn } from "../lib/output.js";
import { startOnFreePort } from "../lib/ports.js";

export default {
  name: "serve",
  usage: "serve [dist]",
  summary: "Serves a built portal; enforces sign-in and access rules (default: dist)",
  description:
    "Secrets come from the environment (RAPIDOC_SESSION_SECRET, RAPIDOC_AUTH_ISSUER, ...), never from options.",
  positionals: { name: "dist", max: 1 },
  options: {
    port: {
      type: "string",
      kind: "port",
      value: "number",
      description: "Port to listen on (default $PORT, else 8080)",
    },
    host: {
      type: "string",
      value: "host",
      description: "Address to listen on (default $HOST, else 0.0.0.0)",
    },
    "mount-path": {
      type: "string",
      value: "path",
      description:
        "Path requests arrive under, when a proxy strips part of the portal's path\n(default $RAPIDOC_MOUNT_PATH, else the path of site.url)",
    },
  },
  examples: ["rapidoc serve", "rapidoc serve dist --port 8080"],

  async run({ values, positionals }) {
    const distDir = path.resolve(positionals[0] || "dist");
    const { startServer } = await loadServer();
    // The server's defaults ($PORT, else 8080; $HOST), to offer another port when that one is taken.
    const host = values.host ?? process.env.HOST ?? "0.0.0.0";
    const port = values.port ?? Number(process.env.PORT || 8080);
    let server;
    try {
      server = await startOnFreePort(
        (portToUse) =>
          startServer({
            distDir,
            port: portToUse,
            host: values.host,
            mountPath: values["mount-path"],
          }),
        port,
        { host },
      );
    } catch (err) {
      if (err.exitCode) throw err; // a busy port without --port, or a cancelled question
      throw new ProblemError(
        err.name === "SettingsError" ? err.message : `Server failed: ${err.message}`,
      );
    }

    const { summary } = server;
    info(`\n${icon("🌐")}Serving ${distDir}`);
    info(`   • URL:      ${server.url}`);
    if (!summary.mcp.enabled) info(`   • MCP:      off (RAPIDOC_MCP=off)`);
    else if (summary.mcp.tools)
      info(`   • MCP:      ${server.url.replace(/\/$/, "")}/mcp  (${summary.mcp.tools} tools)`);
    if (summary.mountPath !== summary.basePath) {
      info(
        `   • Paths:    requests arrive under ${summary.mountPath || "/"}; links use ${summary.basePath || "/"}`,
      );
    }
    if (summary.mode === "static") {
      info("   • Access:   everything public (no sign-in configured)");
    } else {
      if (summary.issuer) info(`   • Sign-in:  ${summary.issuer}`);
      info(
        `   • Access:   ${summary.access.files} protected file(s) in ${summary.access.zones} zone(s)`,
      );
      if (summary.issuer && !summary.providerReady) {
        warn(
          "The sign-in provider can't be reached: public pages are served, and sign-in will work once it answers.",
          "   ",
        );
      }
      if (summary.issuer && !summary.publicUrl) {
        warn(
          "RAPIDOC_PUBLIC_URL is not set: the sign-in redirect URL is taken from each request.",
          "   ",
        );
      }
    }
    info("");

    const stop = async () => {
      await server.close();
      process.exit(0);
    };
    process.once("SIGINT", stop);
    process.once("SIGTERM", stop);
  },
};
