import fs from "node:fs";
import path from "node:path";
import pkg from "../../package.json" with { type: "json" };
import { loadMcpSdk } from "../lib/engines.js";
import { CancelledError, ProblemError, UsageError } from "../lib/errors.js";
import { icon, info, setQuiet, warn } from "../lib/output.js";
import { canAsk, confirm } from "../lib/prompt.js";

/*
 * rapidoc mcp export <spec>: writes the MCP server project for a spec (the same files as <rapi-doc>'s
 * Export MCP Server button: manifest.json, server.ts, runtime.js, package.json, README.md,
 * claude_desktop_config.json). rapidoc mcp serve <spec>: runs that server over stdio right away, for an
 * AI agent's config, without writing files. Both use @rapidoc/mcp; serve also needs the MCP SDK.
 */

const isUrl = (target) => /^https?:\/\//i.test(target);
const relative = (file) => path.relative(process.cwd(), file) || ".";

/** The manifest (and the rest of generateMcpServer's result) for a spec file or URL. */
async function generate(specTarget, values) {
  const { bundleSpec } = await import("../validate/bundle.js");
  const { generateMcpServer, parseArazzo } = await import("@rapidoc/mcp");
  const location = isUrl(specTarget) ? specTarget : path.resolve(specTarget);
  if (!isUrl(location) && !fs.existsSync(location))
    throw new ProblemError(`File not found: ${location}`);
  let spec;
  try {
    spec = (await bundleSpec(location, { remote: values.remote })).value;
  } catch (err) {
    throw new ProblemError(`Can't read ${specTarget}: ${err.message}`);
  }

  let arazzo;
  if (values.arazzo) {
    const file = path.resolve(values.arazzo);
    if (!fs.existsSync(file)) throw new ProblemError(`--arazzo ${values.arazzo}: file not found`);
    try {
      arazzo = parseArazzo(fs.readFileSync(file, "utf8"));
    } catch (err) {
      throw new ProblemError(`--arazzo ${values.arazzo}: ${err.message}`);
    }
  }
  try {
    return generateMcpServer(spec, {
      ...(values["server-name"] && { serverName: values["server-name"] }),
      ...(arazzo && { arazzo }),
    });
  } catch (err) {
    throw new ProblemError(`Can't build MCP tools from ${specTarget}: ${err.message}`);
  }
}

async function exportProject(specTarget, values) {
  const outDir = path.resolve(values["out-dir"]);
  if (fs.existsSync(outDir) && fs.readdirSync(outDir).length) {
    if (!values.force) {
      if (!canAsk())
        throw new ProblemError(
          `${relative(outDir)} is not empty: pass --force to overwrite, or another --out-dir.`,
        );
      const ok = await confirm({
        message: `${relative(outDir)} is not empty. Overwrite its files?`,
        initialValue: false,
      });
      if (!ok) throw new CancelledError("Cancelled; nothing was written.");
    }
  }

  const result = await generate(specTarget, values);
  for (const [file, content] of Object.entries(result.files)) {
    const target = path.join(outDir, file);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, content, "utf8");
  }

  const { budget, manifest, problems } = result;
  info(`\n${icon("🤖")}MCP server "${manifest.server.name}" written to ${relative(outDir)}`);
  info(
    `   • Tools:    ${budget.totalTools} (${budget.consequentialCount} not read-only), ${budget.totalResources} resource(s)`,
  );
  info(`   • Context:  ~${budget.estimatedTokens} tokens per turn for the tool list`);
  info(`   • Files:    ${Object.keys(result.files).join(", ")}`);
  for (const warning of budget.warnings) warn(warning, "   ");
  for (const problem of problems) warn(`workflow left out: ${problem.message}`, "   ");
  info(`\nNext steps:`);
  info(`   cd ${relative(outDir)}`);
  info(`   npm install`);
  info(`   npm start          # or add claude_desktop_config.json's entry to your agent\n`);
}

async function serve(specTarget, values) {
  // stdout carries the MCP protocol: nothing else may go there.
  setQuiet(true);
  const sdk = await loadMcpSdk();
  const { createMcpRuntime, credentialsFromEnv } = await import("@rapidoc/mcp");
  const { manifest, problems } = await generate(specTarget, values);
  const baseUrls = values["base-url"]
    ? Object.fromEntries(Object.keys(manifest.sources).map((name) => [name, values["base-url"]]))
    : undefined;
  const runtime = createMcpRuntime(manifest, {
    credentials: credentialsFromEnv(manifest, process.env),
    ...(baseUrls && { baseUrls }),
  });

  const server = new sdk.Server(
    { name: manifest.server.name, version: manifest.server.version || pkg.version },
    { capabilities: { tools: {}, resources: {} } },
  );
  server.setRequestHandler(sdk.ListToolsRequestSchema, async () => ({
    tools: runtime.listTools(),
  }));
  server.setRequestHandler(sdk.CallToolRequestSchema, async (request) =>
    runtime.callTool(request.params.name, request.params.arguments ?? {}),
  );
  server.setRequestHandler(sdk.ListResourcesRequestSchema, async () => ({
    resources: runtime.listResources(),
  }));
  server.setRequestHandler(sdk.ReadResourceRequestSchema, async (request) =>
    runtime.readResource(request.params.uri),
  );
  await server.connect(new sdk.StdioServerTransport());

  const where = values["base-url"] ? ` against ${values["base-url"]}` : "";
  process.stderr.write(
    `rapidoc mcp serve: "${manifest.server.name}", ${manifest.tools.length} tool(s)${where}, over stdio\n`,
  );
  for (const problem of problems)
    process.stderr.write(`rapidoc mcp serve: workflow left out: ${problem.message}\n`);
}

export default {
  name: "mcp",
  usage: "mcp <export|serve> <spec>",
  summary: "Turns an OpenAPI spec into MCP tools: export a server project, or serve it over stdio",
  description:
    "export writes the MCP server project (the same files as <rapi-doc>'s Export MCP Server button).\nserve runs it over stdio for an AI agent, without files; it needs @modelcontextprotocol/sdk.\nCredentials come from the environment, one variable per security scheme (see the project's README).",
  positionals: { name: "export|serve> <spec", max: 2 },
  options: {
    "out-dir": {
      type: "string",
      value: "path",
      default: "mcp-server",
      description: "export: the folder to write the project to",
    },
    force: {
      type: "boolean",
      short: "f",
      description: "export: overwrite files in a non-empty folder",
    },
    arazzo: {
      type: "string",
      value: "file",
      description: "An Arazzo file whose workflows become tools too",
    },
    "server-name": {
      type: "string",
      value: "name",
      description: "The MCP server's name (default: the API title)",
    },
    "base-url": {
      type: "string",
      value: "url",
      description:
        "serve: call the API here instead of the spec's server (for example rapidoc mock)",
    },
    remote: { type: "boolean", description: "Also fetch remote $refs" },
  },
  examples: [
    "rapidoc mcp export openapi.yaml",
    "rapidoc mcp export openapi.yaml --out-dir petstore-mcp --arazzo flows.arazzo.yaml",
    "rapidoc mcp serve openapi.yaml",
    "rapidoc mcp serve openapi.yaml --base-url http://localhost:4010/openapi",
  ],

  async run({ values, positionals }) {
    const [action, specTarget] = positionals;
    if (!["export", "serve"].includes(action)) {
      const what = action ? `Unknown action "${action}"` : "Missing action";
      throw new UsageError(`${what}: rapidoc mcp export <spec> or rapidoc mcp serve <spec>`, {
        command: "mcp",
      });
    }
    if (!specTarget)
      throw new UsageError(`rapidoc mcp ${action} needs a spec: rapidoc mcp ${action} <spec>`, {
        command: "mcp",
      });
    if (action === "export") await exportProject(specTarget, values);
    else await serve(specTarget, values);
  },
};
