/**
 * Writes the exported MCP server project: the manifest as data, plus fixed files that are the
 * same for every API (the runtime and a stdio server that reads the manifest).
 */
import runtimeSource from "./runtime.js?raw";
import serverSource from "./project/server.ts?raw";
import { envNameFor, generateHostConfigs, toSnakeCase } from "./common.js";

/**
 * @param {object} manifest from buildMcpManifest()
 * @param {object} [options]
 * @param {string} [options.serverName] the package name; defaults to the manifest's server name
 * @param {string} [options.workflowRuntime] the text of workflow-runtime.js, written as
 *   `workflow-runtime.js` when the manifest has workflows (@rapidoc/mcp and <rapi-flow> supply it;
 *   dist/rapidoc-min.js does not carry it)
 * @returns {Record<string, string>} file path → content
 */
export function writeMcpProject(manifest, options = {}) {
  const name = manifest.server.name || "api_mcp_server";
  const hasWorkflows = Object.keys(manifest.workflows || {}).length > 0;
  const schemeIds = Object.values(manifest.sources || {}).flatMap((s) =>
    Object.keys(s.securitySchemes || {}),
  );
  const hostConfigs = generateHostConfigs(options.serverName || name, { schemes: schemeIds });
  const packageJson = {
    name: toSnakeCase(options.serverName || name).replace(/_/g, "-"),
    version: manifest.server.version || "1.0.0",
    private: true,
    type: "module",
    scripts: { start: "tsx server.ts" },
    dependencies: { "@modelcontextprotocol/sdk": "^1.12.0" },
    devDependencies: { tsx: "^4.19.0" },
  };
  const envLines = schemeIds.length
    ? schemeIds.map((id) => {
        const scheme = Object.values(manifest.sources)
          .map((s) => s.securitySchemes?.[id])
          .find(Boolean);
        const what =
          scheme?.type === "apiKey"
            ? `the API key sent as ${scheme.in || "header"} \`${scheme.name}\``
            : scheme?.type === "http" && String(scheme.scheme).toLowerCase() === "basic"
              ? "`user:password` for HTTP Basic"
              : "the bearer token";
        return `- \`${envNameFor(id)}\`: ${what} (security scheme \`${id}\`)`;
      })
    : ["- `API_KEY`: not needed; this API declares no security scheme"];
  const readme = `# ${manifest.server.name} MCP server

Exported by RapiDoc from the API's OpenAPI document. \`manifest.json\` lists ${manifest.tools.length} tools${
    hasWorkflows ? ` (${Object.keys(manifest.workflows).length} of them workflows)` : ""
  }${manifest.resources.length ? ` and ${manifest.resources.length} resources` : ""}; \`server.ts\` serves them over stdio and \`runtime.js\` makes the requests${
    hasWorkflows && options.workflowRuntime
      ? ", with workflow-runtime.js running the workflows"
      : ""
  }.

## Run

\`\`\`bash
npm install
${schemeIds.map((id) => `${envNameFor(id)}="..." `).join("")}npm start
\`\`\`

Environment variables:

${envLines.join("\n")}
- \`API_BASE_URL\`: overrides the base URL in the manifest (${
    Object.values(manifest.sources)[0]?.baseUrl || ""
  })

## Use with Claude Desktop or Cursor

Copy the \`mcpServers\` entry from \`claude_desktop_config.json\` into your host's configuration
and fill in the credentials.
`;
  return {
    "manifest.json": JSON.stringify(manifest, null, 2),
    "server.ts": serverSource,
    "runtime.js": runtimeSource,
    ...(hasWorkflows && options.workflowRuntime
      ? { "workflow-runtime.js": options.workflowRuntime }
      : {}),
    "package.json": JSON.stringify(packageJson, null, 2),
    "README.md": readme,
    "claude_desktop_config.json": hostConfigs.claudeDesktopConfig,
  };
}
