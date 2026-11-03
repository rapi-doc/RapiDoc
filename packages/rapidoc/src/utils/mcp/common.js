/**
 * MCP (Model Context Protocol) Common Utilities and Spec Extraction
 */

// Common authentication and transport headers to strip from LLM parameter schemas
export const AUTH_TRANSPORT_HEADERS = new Set([
  "authorization",
  "cookie",
  "set-cookie",
  "x-api-key",
  "api-key",
  "apikey",
  "user-agent",
  "host",
  "content-length",
  "accept",
  "accept-encoding",
  "connection",
]);

export const VALID_MCP_TARGETS = ["typescript", "python", "go", "csharp", "rust", "java"];
export const VALID_TARGET_SET = new Set(VALID_MCP_TARGETS);

export const MCP_TARGET_LABELS = {
  typescript: "TypeScript",
  python: "Python",
  go: "Go",
  csharp: "C#",
  rust: "Rust",
  java: "Java",
};

/**
 * Normalizes and parses the `mcp` attribute/property value.
 * Supports:
 *   - Comma-separated strings: "typescript, python"
 *   - Arrays of strings: ["typescript", "python"]
 *   - JSON string arrays: '["typescript", "python"]'
 * If 'none' or 'false' is included anywhere in the value (or if empty/falsy),
 * it acts as a complete kill-switch, returning [].
 * Wildcards like '*' or 'all' are intentionally NOT supported.
 *
 * @param {string|string[]|boolean} val
 * @returns {string[]} Array of normalized target names (e.g. ['typescript', 'python'])
 */
export function parseMcpTargets(val) {
  if (!val || val === false || val === "false") return [];
  let items = [];
  if (Array.isArray(val)) {
    items = val;
  } else if (typeof val === "string") {
    const trimmed = val.trim();
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        items = JSON.parse(trimmed);
      } catch {
        items = trimmed.slice(1, -1).split(",");
      }
    } else {
      items = trimmed.split(",");
    }
  }
  const normalized = items.map((s) => String(s).trim().toLowerCase()).filter(Boolean);
  if (normalized.includes("none") || normalized.includes("false")) {
    return [];
  }
  const validTargets = normalized
    .map((t) => (t === "c#" ? "csharp" : t))
    .filter((t) => VALID_TARGET_SET.has(t));
  return [...new Set(validTargets)];
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
 * Converts text into PascalCase (e.g. for C#, Java, Go types).
 */
export function toPascalCase(str) {
  if (!str) return "Tool";
  const snake = toSnakeCase(str);
  return snake
    .split("_")
    .filter(Boolean)
    .map((seg) => seg.charAt(0).toUpperCase() + seg.slice(1))
    .join("");
}

/**
 * Converts text into camelCase (e.g. for Go, Java, C# method arguments).
 */
export function toCamelCase(str) {
  const pascal = toPascalCase(str);
  if (!pascal) return "param";
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
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
 * Extracts and maps parameters from path parameters, query parameters, and requestBody.
 */
export function extractParameters(pathObj) {
  const params = [];
  const excludedNames = new Set(
    (pathObj["x-ignoredHeaderParameters"] || []).map((s) => s.toLowerCase()),
  );

  // 1. Process query, path, and header parameters
  if (Array.isArray(pathObj.parameters)) {
    for (const p of pathObj.parameters) {
      if (!p || !p.name) continue;
      const lowerName = p.name.toLowerCase();

      // Automatically strip auth & transport headers
      if (p.in === "header" && AUTH_TRANSPORT_HEADERS.has(lowerName)) {
        continue;
      }
      if (excludedNames.has(lowerName)) {
        continue;
      }

      const schema = p.schema || {};
      const type = schema.type || (schema.enum ? "string" : "string");
      params.push({
        name: p.name,
        in: p.in || "query",
        type,
        format: schema.format,
        enum: schema.enum,
        description: p.description || schema.description || "",
        required: Boolean(p.required || p.in === "path"),
        default: schema.default,
      });
    }
  }

  // 2. Process requestBody schema properties
  if (pathObj.requestBody && pathObj.requestBody.content) {
    const jsonContent =
      pathObj.requestBody.content["application/json"] ||
      pathObj.requestBody.content["application/x-www-form-urlencoded"] ||
      Object.values(pathObj.requestBody.content)[0];

    const bodySchema = jsonContent?.schema;
    if (bodySchema && bodySchema.properties) {
      const requiredProps = new Set(bodySchema.required || []);
      for (const [propName, propDef] of Object.entries(bodySchema.properties)) {
        if (excludedNames.has(propName.toLowerCase())) continue;

        params.push({
          name: propName,
          in: "body",
          type: propDef.type || "string",
          format: propDef.format,
          enum: propDef.enum,
          description: propDef.description || "",
          required: requiredProps.has(propName),
          default: propDef.default,
        });
      }
    } else if (bodySchema) {
      // Single object body without top-level exploded properties
      params.push({
        name: "payload",
        in: "body",
        type: bodySchema.type || "object",
        description: pathObj.requestBody.description || "Request payload",
        required: Boolean(pathObj.requestBody.required),
        default: undefined,
      });
    }
  }

  return params;
}

/**
 * Inspects an operation and extracts curated MCP tool/resource metadata.
 */
export function extractMcpOperations(parsedSpec, options = {}) {
  const tools = [];
  const resources = [];
  const { includeInternal = false, includeDeprecated = false } = options;

  const rawSpec = parsedSpec?.spec || parsedSpec || {};
  const tags = parsedSpec?.tags || [];

  // Collect all path operations across tags or direct spec.paths
  const operations = [];
  if (tags.length > 0) {
    for (const tag of tags) {
      if (Array.isArray(tag.paths)) {
        for (const p of tag.paths) {
          operations.push({ ...p, tagName: tag.name });
        }
      }
    }
  } else if (rawSpec.paths) {
    for (const [pathStr, pathItem] of Object.entries(rawSpec.paths)) {
      for (const [methodStr, opObj] of Object.entries(pathItem)) {
        if (["get", "post", "put", "delete", "patch"].includes(methodStr.toLowerCase())) {
          operations.push({
            ...opObj,
            method: methodStr.toLowerCase(),
            path: pathStr,
            rawOperation: opObj,
          });
        }
      }
    }
  }

  for (const op of operations) {
    const raw = op.rawOperation || op;

    // 1. Check exclusion rules
    if (!includeInternal && (raw["x-internal"] === true || raw["x-hidden"] === true)) {
      continue;
    }
    if (!includeDeprecated && op.deprecated === true) {
      continue;
    }
    if (op.isWebhook) {
      continue;
    }

    const method = (op.method || "get").toLowerCase();
    const path = op.path || "";
    const params = extractParameters(op);

    // 2. Classify as Tool vs Resource
    const isResource =
      method === "get" &&
      params.filter((p) => p.required).length === 0 &&
      (path.includes("/reference") ||
        path.includes("/currencies") ||
        path.includes("/countries") ||
        path.includes("/tiers") ||
        path.includes("/categories") ||
        path.includes("/status") ||
        path.includes("/schema"));

    // 3. Resolve Tool Name
    const toolName = toSnakeCase(op.operationId || deriveToolName(method, path));

    // 4. Resolve Description
    const description = sanitizeDescription(
      op.summary || op.description || `${method.toUpperCase()} ${path}`,
    );

    // 5. Write methods need confirmation
    const isConsequential = ["post", "put", "delete", "patch"].includes(method);

    const opItem = {
      name: toolName,
      method: method.toUpperCase(),
      path,
      description,
      parameters: params,
      isConsequential,
      readOnly: method === "get",
      tag: op.tagName || "",
    };

    if (isResource) {
      resources.push({
        ...opItem,
        uri: `reference://${toolName.replace(/^get_/, "").replace(/_/g, "-")}`,
        mimeType: "application/json",
      });
    } else {
      tools.push(opItem);
    }
  }

  const metadata = {
    title: rawSpec.info?.title || "OpenAPI MCP Server",
    description: sanitizeDescription(rawSpec.info?.description || ""),
    version: rawSpec.info?.version || "1.0.0",
    servers: rawSpec.servers || [{ url: "http://localhost:3000" }],
  };

  return { metadata, tools, resources };
}

/**
 * Calculates estimated token overhead for LLM tool definitions.
 */
export function estimateTokenCost(tools = [], resources = []) {
  let estimatedTokens = 0;
  let consequentialCount = 0;

  for (const t of tools) {
    // Tool name + description: ~4 chars per token
    estimatedTokens += Math.ceil((t.name.length + t.description.length) / 4);
    // Base JSON Schema overhead per function tool
    estimatedTokens += 25;
    if (t.isConsequential) consequentialCount++;

    for (const p of t.parameters) {
      estimatedTokens += Math.ceil((p.name.length + (p.description || "").length) / 4);
      estimatedTokens += 10; // type, required, structure tokens
      if (p.enum) estimatedTokens += p.enum.length * 3;
    }
  }

  for (const r of resources) {
    estimatedTokens += Math.ceil((r.name.length + r.description.length + r.uri.length) / 4) + 20;
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
 * Generates Claude Desktop and Cursor JSON configuration snippets.
 */
export function generateHostConfigs(serverName, options = {}) {
  const safeName = toSnakeCase(serverName || "api_mcp_server");
  const target = (options.target || "typescript").toLowerCase();

  let command = "npx";
  let args = ["-y", "tsx", "server.ts"];

  if (target === "python") {
    command = "fastmcp";
    args = ["run", "server.py"];
  } else if (target === "go") {
    command = `./${safeName}`;
    args = [];
  } else if (target === "csharp" || target === "c#") {
    command = "dotnet";
    args = ["run"];
  } else if (target === "rust") {
    command = `./target/release/${safeName}`;
    args = [];
  } else if (target === "java") {
    command = "java";
    args = ["-jar", "target/mcp-server.jar"];
  }

  const claudeConfig = {
    mcpServers: {
      [safeName]: {
        command,
        args,
        env: {
          API_KEY: "your-api-key-here",
        },
      },
    },
  };

  const cursorConfig = claudeConfig;

  return {
    claudeDesktopConfig: JSON.stringify(claudeConfig, null, 2),
    cursorConfig: JSON.stringify(cursorConfig, null, 2),
  };
}
