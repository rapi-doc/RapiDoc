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
 * mcp.json). rapidoc mcp serve <spec>: runs that server over stdio right away, for an
 * AI agent's config, without writing files. Both use @rapidoc/mcp; serve also needs the MCP SDK.
 *
 * Every variable the server reads starts with MCP_: MCP_AUTH_<SCHEME> (credentials), MCP_BASE_URL
 * (MCP_BASE_URL_<SOURCE> with several APIs) and MCP_EXTERNAL_HOSTS. A spec without an absolute server
 * URL gives no base URL (a spec read from an address resolves a relative one against it): export says
 * so and the project's README marks the variable as required; serve stops unless --base-url or the
 * variable gives one.
 */

const isUrl = (target) => /^https?:\/\//i.test(target);
const relative = (file) => path.relative(process.cwd(), file) || ".";

/** The manifest (and the rest of generateMcpServer's result) for a spec file or URL. */
async function generate(specTarget, values, extra = {}) {
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
      // A relative server URL (or none) is resolved against the address the spec came from
      ...(isUrl(location) && { specUrl: location }),
      ...(values["server-name"] && { serverName: values["server-name"] }),
      ...(arazzo && { arazzo }),
      ...extra,
    });
  } catch (err) {
    throw new ProblemError(`Can't build MCP tools from ${specTarget}: ${err.message}`);
  }
}

async function exportProject(specTarget, values) {
  if (values["base-url"])
    throw new UsageError(
      "--base-url is for rapidoc mcp serve. An exported server takes its base URL from MCP_BASE_URL.",
      { command: "mcp" },
    );
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

  const result = await generate(specTarget, values, {
    serverPath: path.join(outDir, "server.ts"),
  });
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
  const { baseUrlEnvNames, sourcesWithoutBaseUrl } = await import("@rapidoc/mcp");
  const unset = sourcesWithoutBaseUrl(manifest);
  const variables = unset.map((source) => baseUrlEnvNames(manifest)[source]);
  if (unset.length)
    warn(
      `A base URL is required: ${specTarget} names no absolute server URL, so the manifest has none. Set ${variables.join(", ")} when you start the server (mcp.json and README.md list ${unset.length > 1 ? "them" : "it"}); until then tool calls answer with an error.`,
      "   ",
    );
  info(`\nNext steps:`);
  info(`   cd ${relative(outDir)}`);
  info(`   npm install`);
  info(
    `   ${variables.map((v) => `${v}=https://api.example.com `).join("")}npm start          # or add mcp.json's entry to your AI app\n`,
  );
}

async function serve(specTarget, values) {
  // stdout carries the MCP protocol: nothing else may go there.
  setQuiet(true);
  const sdk = await loadMcpSdk();
  const {
    baseUrlEnvNames,
    baseUrlsFromEnv,
    createMcpRuntime,
    credentialsFromEnv,
    externalHostsFromEnv,
    sourcesWithoutBaseUrl,
  } = await import("@rapidoc/mcp");
  const { manifest, problems } = await generate(specTarget, values);
  const names = baseUrlEnvNames(manifest);
  const sources = Object.keys(manifest.sources);
  let baseUrls;
  try {
    baseUrls = baseUrlsFromEnv(manifest, process.env);
  } catch (err) {
    throw new ProblemError(err.message);
  }
  if (values["base-url"]) {
    // One URL for several APIs would send each API's credentials to the same host
    if (sources.length > 1)
      throw new UsageError(
        `--base-url is for one API, and these workflows use ${sources.length}: set ${Object.values(names).join(", ")} instead.`,
        { command: "mcp" },
      );
    if (!isUrl(values["base-url"]))
      throw new UsageError(`--base-url must be an http(s) URL, got "${values["base-url"]}".`, {
        command: "mcp",
      });
    baseUrls[sources[0]] = values["base-url"];
  }
  const unset = sourcesWithoutBaseUrl(manifest, baseUrls);
  if (unset.length) {
    const flag = sources.length === 1 ? "pass --base-url <url> or " : "";
    throw new ProblemError(
      `A base URL is required: ${specTarget} names no absolute server URL${sources.length > 1 ? ` for ${unset.join(", ")}` : ""}. To say where the API is, ${flag}set ${unset.map((source) => names[source]).join(", ")}.`,
    );
  }
  const runtime = createMcpRuntime(manifest, {
    credentials: credentialsFromEnv(manifest, process.env),
    externalHosts: externalHostsFromEnv(process.env),
    baseUrls,
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

  const urls = sources.map((source) => baseUrls[source] || manifest.sources[source].baseUrl);
  const where = ` against ${[...new Set(urls)].join(", ")}`;
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
    "export writes the MCP server project (the same files as <rapi-doc>'s Export MCP Server button).\nserve runs it over stdio for an AI agent, without files; it needs @modelcontextprotocol/sdk.\nEvery variable the server reads starts with MCP_ (the project's README and mcp.json name the exact ones):\n  MCP_AUTH_<SCHEME>   a security scheme's credential, <SCHEME> its id in UPPER_SNAKE (HTTP Basic: MCP_AUTH_<SCHEME>_USERNAME and _PASSWORD)\n  MCP_BASE_URL        the API's base URL (with several APIs, MCP_BASE_URL_<SOURCE> each); required when the spec names no absolute server URL\n  MCP_EXTERNAL_HOSTS  hosts (comma-separated, * for any) a workflow's x-operation URL computed at run time may go to, besides those the workflow names",
  positionals: { name: "action", max: 2, choices: ["export", "serve"] },
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
        "serve: call the API here instead of the spec's server (for example rapidoc mock); same as MCP_BASE_URL, for one API only",
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
