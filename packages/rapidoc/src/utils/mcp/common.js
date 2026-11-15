/**
 * MCP (Model Context Protocol) helpers shared by the manifest builder and the project writer.
 */
import { envNameFor } from "./runtime.js";

export { envNameFor };

// Auth and transport headers never exposed as tool arguments
export const AUTH_TRANSPORT_HEADERS = new Set([
  "authorization",
  "cookie",
  "set-cookie",
  "x-api-key",
  "api-key",
  "apikey",
  "api_key",
  "user-agent",
  "host",
  "content-length",
  "accept",
  "accept-encoding",
  "connection",
]);

/**
 * Reads the `mcp` attribute: export is off for an empty value, `false`, `none` or a list that
 * contains one of them (the old kill-switch), and on for anything else, including the old
 * language names.
 *
 * @param {string|string[]|boolean} val
 * @returns {boolean}
 */
export function parseMcpEnabled(val) {
  if (!val || val === "false") return false;
  const items = Array.isArray(val) ? val : String(val).split(",");
  const normalized = items.map((s) => String(s).trim().toLowerCase()).filter(Boolean);
  if (!normalized.length) return false;
  return !normalized.some((s) => s === "none" || s === "false");
}

/**
 * Converts camelCase, PascalCase, kebab-case, or arbitrary text into clean snake_case.
 */
export function toSnakeCase(str) {
  if (!str) return "tool";
  return str
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/[^a-zA-Z0-9_]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "")
    .toLowerCase();
}

/**
 * Sanitizes markdown/HTML descriptions into clean, concise single or multi-line agent instructions.
 */
export function sanitizeDescription(text, maxLength = 300) {
  if (!text || typeof text !== "string") return "";
  const cleaned = text
    .replace(/<[^>]*>/g, "") // remove HTML tags
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // [link](url) -> link
    .replace(/[`*_~#<>]/g, "") // strip markdown markers, preserve sentence punctuation
    .replace(/\s+/g, " ")
    .trim();
  if (cleaned.length <= maxLength) return cleaned;
  return cleaned.slice(0, maxLength - 3) + "...";
}

/**
 * Derives a clean snake_case tool name from HTTP method and path when operationId is missing.
 * e.g., GET /customers/{customerId}/orders -> get_customers_by_customer_id_orders
 */
export function deriveToolName(method, path) {
  const parts = path
    .split("/")
    .filter(Boolean)
    .map((seg) => {
      if (seg.startsWith("{") && seg.endsWith("}")) {
        return `by_${seg.slice(1, -1)}`;
      }
      return seg;
    });
  return toSnakeCase(`${method}_${parts.join("_")}`);
}

/**
 * Estimates the prompt context a manifest's tool definitions cost an agent on every turn.
 *
 * @param {object} manifest from buildMcpManifest()
 * @returns {{ totalTools: number, totalResources: number, estimatedTokens: number,
 *   consequentialCount: number, warnings: string[] }} `consequentialCount` is the number of
 *   tools that are not read-only
 */
export function estimateTokenCost(manifest) {
  const tools = manifest?.tools || [];
  const resources = manifest?.resources || [];
  let estimatedTokens = 0;
  let consequentialCount = 0;

  for (const t of tools) {
    // Name, description and the JSON Schema: ~4 chars per token, plus the envelope
    estimatedTokens += Math.ceil(
      (t.name.length + (t.description || "").length + JSON.stringify(t.inputSchema || {}).length) /
        4,
    );
    estimatedTokens += 25;
    if (!t.annotations?.readOnlyHint) consequentialCount++;
  }

  for (const r of resources) {
    estimatedTokens +=
      Math.ceil((r.name.length + (r.description || "").length + r.uri.length) / 4) + 20;
  }

  const warnings = [];
  if (estimatedTokens > 5000) {
    warnings.push(
      `Context overhead (~${estimatedTokens.toLocaleString()} tokens/turn) is high. Consider hiding unused operations with x-internal: true.`,
    );
  }
  if (tools.length > 30) {
    warnings.push(
      `${tools.length} tools exceeds the recommended limit of 30 tools per agent to prevent model paralysis.`,
    );
  }

  return {
    totalTools: tools.length,
    totalResources: resources.length,
    estimatedTokens,
    consequentialCount,
    warnings,
  };
}

/**
 * `destructiveHint` for a tool that makes requests with these methods: true with a PUT, PATCH or
 * DELETE, false when every request is a read. Left out with a POST (or another write) and nothing
 * more: a POST may add (`POST /orders`) or undo (`POST /orders/{id}/cancel`), and without the hint
 * MCP hosts assume the tool may be destructive, so they can ask first.
 */
export function destructiveHintFor(methods) {
  const all = methods.map((m) => String(m).toLowerCase());
  if (all.some((m) => ["put", "patch", "delete"].includes(m))) return { destructiveHint: true };
  if (all.every((m) => ["get", "head", "options"].includes(m))) return { destructiveHint: false };
  return {};
}

/**
 * Generates the `mcpServers` configuration entry for the exported project (`mcp.json`): the format
 * Claude Desktop, Cursor, Claude Code and most other MCP hosts read.
 *
 * @param {string} serverName
 * @param {object} [options]
 * @param {string[]} [options.schemes] security scheme ids; one `env` entry each (`API_KEY` when none)
 * @param {string} [options.serverPath] absolute path of the project's `server.ts`. A host starts
 *   the server from its own working directory, so a relative path would not be found; without
 *   this, the entry carries a placeholder path the user replaces.
 */
export function generateHostConfigs(serverName, options = {}) {
  const safeName = toSnakeCase(serverName || "api_mcp_server");
  const schemes = options.schemes?.length ? options.schemes : [];
  const env = {};
  for (const id of schemes) env[envNameFor(id)] = `your-${toSnakeCase(id).replace(/_/g, "-")}`;
  if (!schemes.length) env.API_KEY = "your-api-key-here";

  const claudeConfig = {
    mcpServers: {
      [safeName]: {
        command: "npx",
        args: [
          "-y",
          "tsx",
          options.serverPath || `/absolute/path/to/${safeName.replace(/_/g, "-")}/server.ts`,
        ],
        env,
      },
    },
  };

  const cursorConfig = claudeConfig;

  return {
    claudeDesktopConfig: JSON.stringify(claudeConfig, null, 2),
    cursorConfig: JSON.stringify(cursorConfig, null, 2),
  };
}
