/**
 * MCP (Model Context Protocol) helpers shared by the manifest builder and the project writer.
 */
import { baseUrlEnvNames, credentialEnvNames, envNameFor, shortHash } from "./runtime.js";

export { envNameFor };

/** MCP hosts accept tool names of up to 64 characters (letters, digits, `_`, `-`). */
export const MAX_TOOL_NAME_LENGTH = 64;

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
 * Reads `<rapi-doc>`'s `mcp` attribute: the Export MCP Server button is shown for `true` only.
 *
 * @param {string|boolean} val
 * @returns {boolean}
 */
export function parseMcpEnabled(val) {
  return (
    val === true ||
    String(val ?? "")
      .trim()
      .toLowerCase() === "true"
  );
}

/**
 * Converts camelCase, PascalCase, kebab-case, or arbitrary text into clean snake_case. Text with
 * no Latin letter or digit (an empty string, a title in another script) gives `fallback`.
 */
export function toSnakeCase(str, fallback = "tool") {
  return (
    String(str ?? "")
      .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
      .replace(/[^a-zA-Z0-9_]/g, "_")
      .replace(/_+/g, "_")
      .replace(/^_|_$/g, "")
      .toLowerCase() || fallback
  );
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
  const parts = String(path || "")
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
 * An operation's tool name before the length cap and the duplicate check: its operationId in
 * snake_case, or the method-and-path name when it has none or it has no Latin letter or digit.
 */
export function operationToolName(operationId, method, path) {
  return toSnakeCase(operationId, "") || deriveToolName(method, path);
}

/** `stem` cut so that `stem_<hash>` fits in a tool name. */
function withHash(stem, hash) {
  const room = MAX_TOOL_NAME_LENGTH - hash.length - 1;
  return `${stem.slice(0, room).replace(/_+$/, "")}_${hash}`;
}

/**
 * The final tool names of a manifest, valid and stable:
 *
 * - a name over 64 characters is cut and ends in a hash of the whole name, so two long names that
 *   differ only at the end stay distinct;
 * - when several tools would get the same name, each of them ends in a hash of its own `key`
 *   (`GET /pets`, `workflow <id>`), so the name depends on the operation, never on where it is in
 *   the document, and never equals another tool's name.
 *
 * @param {{ name: string, key: string }[]} entries `name` as wanted, `key` what the tool is
 * @param {string} [prefix] put in front of every name before the rules apply
 * @returns {string[]} the names, in the order of `entries`
 */
export function assignToolNames(entries, prefix = "") {
  const wanted = entries.map((e) => `${prefix}${e.name}`);
  const names = wanted.map((name) =>
    name.length > MAX_TOOL_NAME_LENGTH ? withHash(name, shortHash(name)) : name,
  );
  const count = new Map();
  for (const name of names) count.set(name, (count.get(name) || 0) + 1);
  const taken = new Set(names.filter((name) => count.get(name) === 1));
  const repeated = names
    .map((name, i) => i)
    .filter((i) => count.get(names[i]) > 1)
    .sort((a, b) =>
      entries[a].key < entries[b].key ? -1 : entries[a].key > entries[b].key ? 1 : 0,
    );
  for (const i of repeated) {
    let name;
    for (let salt = 0; name === undefined || taken.has(name); salt++) {
      name = withHash(wanted[i], shortHash(salt ? `${entries[i].key}#${salt}` : entries[i].key));
    }
    taken.add(name);
    names[i] = name;
  }
  return names;
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
 * The environment variables of an exported server, each with a placeholder value, for `mcp.json`:
 * one per credential (`MCP_AUTH_<SCHEME>`; `_USERNAME` and `_PASSWORD` for HTTP Basic), and the
 * base URL variable of every source whose base URL the manifest leaves unset, which is required.
 *
 * @param {object} manifest
 * @returns {Record<string, string>}
 */
export function hostEnvFor(manifest) {
  const env = {};
  for (const [id, names] of Object.entries(credentialEnvNames(manifest))) {
    const hint = toSnakeCase(id, "credential").replace(/_/g, "-");
    for (const name of names) {
      const part =
        names.length > 1 ? `-${name.slice(name.lastIndexOf("_") + 1).toLowerCase()}` : "";
      env[name] = `your-${hint}${part}`;
    }
  }
  const baseNames = baseUrlEnvNames(manifest);
  for (const [name, source] of Object.entries(manifest?.sources || {})) {
    if (!source?.baseUrl) env[baseNames[name]] = "https://api.example.com";
  }
  return env;
}

/**
 * Generates the `mcpServers` configuration entry for the exported project (`mcp.json`): the format
 * Claude Desktop, Cursor, Claude Code and most other MCP hosts read.
 *
 * @param {string} serverName
 * @param {object} [options]
 * @param {Record<string, string>} [options.env] the entry's environment variables with their
 *   placeholder values, from hostEnvFor(manifest); none by default
 * @param {string} [options.serverPath] absolute path of the project's `server.ts`. A host starts
 *   the server from its own working directory, so a relative path would not be found; without
 *   this, the entry carries a placeholder path the user replaces.
 */
export function generateHostConfigs(serverName, options = {}) {
  const safeName = toSnakeCase(serverName, "api_mcp_server");
  const env = { ...options.env };

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
