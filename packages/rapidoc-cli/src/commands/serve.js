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

    const { settings } = server;
    info(`\n${icon("🌐")}Serving ${distDir}`);
    info(`   • URL:      ${server.url}`);
    if (server.mcp?.off) info(`   • MCP:      off (RAPIDOC_MCP=off)`);
    else if (server.mcp?.count)
      info(`   • MCP:      ${server.url.replace(/\/$/, "")}/mcp  (${server.mcp.count} tools)`);
    if (settings.mountPath !== settings.basePath) {
      info(
        `   • Paths:    requests arrive under ${settings.mountPath || "/"}; links use ${settings.basePath || "/"}`,
      );
    }
    if (settings.mode === "static") {
      info("   • Access:   everything public (no sign-in configured)");
    } else {
      if (settings.auth) info(`   • Sign-in:  ${settings.auth.issuer}`);
      const zones = Object.keys(settings.manifest.access.zones).filter((zone) => zone !== "public");
      info(
        `   • Access:   ${Object.keys(settings.manifest.files).length} protected file(s) in ${zones.length} zone(s)`,
      );
      if (settings.auth && !settings.publicUrl) {
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
