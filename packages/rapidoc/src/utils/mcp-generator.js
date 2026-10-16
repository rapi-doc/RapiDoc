/**
 * MCP (Model Context Protocol) Server Generator for RapiDoc
 *
 * Implements client-side, zero-runtime-dependency translation from OpenAPI specs
 * into curated, token-efficient MCP servers (TypeScript and Python FastMCP).
 *
 * Honors primary `x-mcp` extensions and compatibility aliases from Redocly,
 * Scalar, OpenAI (x-openai-isConsequential), and Speakeasy.
 */

// Common authentication and transport headers to strip from LLM parameter schemas
const AUTH_TRANSPORT_HEADERS = new Set([
  'authorization',
  'cookie',
  'set-cookie',
  'x-api-key',
  'api-key',
  'apikey',
  'user-agent',
  'host',
  'content-length',
  'accept',
  'accept-encoding',
  'connection',
]);

export const VALID_MCP_TARGETS = ['typescript', 'python', 'go', 'csharp', 'rust', 'java'];
const VALID_TARGET_SET = new Set(VALID_MCP_TARGETS);

export const MCP_TARGET_LABELS = {
  typescript: 'TypeScript',
  python: 'Python',
  go: 'Go',
  csharp: 'C#',
  rust: 'Rust',
  java: 'Java',
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
  if (!val || val === false || val === 'false') return [];
  let items = [];
  if (Array.isArray(val)) {
    items = val;
  } else if (typeof val === 'string') {
    const trimmed = val.trim();
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        items = JSON.parse(trimmed);
      } catch {
        items = trimmed.slice(1, -1).split(',');
      }
    } else {
      items = trimmed.split(',');
    }
  }
  const normalized = items.map((s) => String(s).trim().toLowerCase()).filter(Boolean);
  if (normalized.includes('none') || normalized.includes('false')) {
    return [];
  }
  const validTargets = normalized.map((t) => (t === 'c#' ? 'csharp' : t)).filter((t) => VALID_TARGET_SET.has(t));
  return [...new Set(validTargets)];
}

/**
 * Converts camelCase, PascalCase, kebab-case, or arbitrary text into clean snake_case.
 */
export function toSnakeCase(str) {
  if (!str) return 'tool';
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/[^a-zA-Z0-9_]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
    .toLowerCase();
}

/**
 * Converts text into PascalCase (e.g. for C#, Java, Go types).
 */
export function toPascalCase(str) {
  if (!str) return 'Tool';
  const snake = toSnakeCase(str);
  return snake
    .split('_')
    .filter(Boolean)
    .map((seg) => seg.charAt(0).toUpperCase() + seg.slice(1))
    .join('');
}

/**
 * Converts text into camelCase (e.g. for Go, Java, C# method arguments).
 */
export function toCamelCase(str) {
  const pascal = toPascalCase(str);
  if (!pascal) return 'param';
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

/**
 * Sanitizes markdown/HTML descriptions into clean, concise single or multi-line agent instructions.
 */
export function sanitizeDescription(text, maxLength = 300) {
  if (!text || typeof text !== 'string') return '';
  const cleaned = text
    .replace(/<[^>]*>/g, '') // remove HTML tags
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // [link](url) -> link
    .replace(/[`*_~#<>]/g, '') // strip markdown markers, preserve sentence punctuation
    .replace(/\s+/g, ' ')
    .trim();
  if (cleaned.length <= maxLength) return cleaned;
  return cleaned.slice(0, maxLength - 3) + '...';
}

/**
 * Derives a clean snake_case tool name from HTTP method and path when operationId is missing.
 * e.g., GET /customers/{customerId}/orders -> get_customers_by_customer_id_orders
 */
export function deriveToolName(method, path) {
  const parts = path
    .split('/')
    .filter(Boolean)
    .map((seg) => {
      if (seg.startsWith('{') && seg.endsWith('}')) {
        return `by_${seg.slice(1, -1)}`;
      }
      return seg;
    });
  return toSnakeCase(`${method}_${parts.join('_')}`);
}

/**
 * Extracts and maps parameters from path parameters, query parameters, and requestBody.
 */
function extractParameters(pathObj, xMcp = {}) {
  const params = [];
  const excludedNames = new Set(
    (xMcp.parameters?.exclude || []).concat(pathObj['x-ignoredHeaderParameters'] || []).map((s) => s.toLowerCase())
  );
  const includedNames = xMcp.parameters?.include ? new Set(xMcp.parameters.include.map((s) => s.toLowerCase())) : null;
  const customDescriptions = xMcp.parameters?.descriptions || {};
  const defaults = xMcp.parameters?.defaults || {};

  // 1. Process query, path, and header parameters
  if (Array.isArray(pathObj.parameters)) {
    for (const p of pathObj.parameters) {
      if (!p || !p.name) continue;
      const lowerName = p.name.toLowerCase();

      // Automatically strip auth & transport headers
      if (p.in === 'header' && AUTH_TRANSPORT_HEADERS.has(lowerName)) {
        continue;
      }
      if (p['x-speakeasy-param-ignore'] === true || excludedNames.has(lowerName)) {
        continue;
      }
      if (includedNames && !includedNames.has(lowerName)) {
        continue;
      }

      const schema = p.schema || {};
      const type = schema.type || (schema.enum ? 'string' : 'string');
      params.push({
        name: p.name,
        in: p.in || 'query',
        type,
        format: schema.format,
        enum: schema.enum,
        description: customDescriptions[p.name] || p.description || schema.description || '',
        required: Boolean(p.required || p.in === 'path'),
        default: defaults[p.name] !== undefined ? defaults[p.name] : schema.default,
      });
    }
  }

  // 2. Process requestBody schema properties
  if (pathObj.requestBody && pathObj.requestBody.content) {
    const jsonContent =
      pathObj.requestBody.content['application/json'] ||
      pathObj.requestBody.content['application/x-www-form-urlencoded'] ||
      Object.values(pathObj.requestBody.content)[0];

    const bodySchema = jsonContent?.schema;
    if (bodySchema && bodySchema.properties) {
      const requiredProps = new Set(bodySchema.required || []);
      for (const [propName, propDef] of Object.entries(bodySchema.properties)) {
        const lowerName = propName.toLowerCase();
        if (excludedNames.has(lowerName)) continue;
        if (includedNames && !includedNames.has(lowerName)) continue;

        params.push({
          name: propName,
          in: 'body',
          type: propDef.type || 'string',
          format: propDef.format,
          enum: propDef.enum,
          description: customDescriptions[propName] || propDef.description || '',
          required: requiredProps.has(propName),
          default: defaults[propName] !== undefined ? defaults[propName] : propDef.default,
        });
      }
    } else if (bodySchema) {
      // Single object body without top-level exploded properties
      params.push({
        name: 'payload',
        in: 'body',
        type: bodySchema.type || 'object',
        description: pathObj.requestBody.description || 'Request payload',
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
        if (['get', 'post', 'put', 'delete', 'patch'].includes(methodStr.toLowerCase())) {
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
    const xMcp = raw['x-mcp'] || raw['x-mcp-tool'] || {};

    // 1. Check exclusion rules
    if (xMcp.enabled === false || xMcp.type === 'skip') {
      continue;
    }
    if (!includeInternal && (raw['x-internal'] === true || raw['x-hidden'] === true)) {
      continue;
    }
    if (!includeDeprecated && op.deprecated === true) {
      continue;
    }
    if (op.isWebhook) {
      continue;
    }

    const method = (op.method || 'get').toLowerCase();
    const path = op.path || '';
    const params = extractParameters(op, xMcp);

    // 2. Classify as Tool vs Resource
    let isResource = false;
    if (xMcp.type === 'resource') {
      isResource = true;
    } else if (
      xMcp.type !== 'tool' &&
      method === 'get' &&
      params.filter((p) => p.required).length === 0 &&
      (path.includes('/reference') ||
        path.includes('/currencies') ||
        path.includes('/countries') ||
        path.includes('/tiers') ||
        path.includes('/categories') ||
        path.includes('/status') ||
        path.includes('/schema'))
    ) {
      isResource = true;
    }

    // 3. Resolve Tool Name
    const toolName = toSnakeCase(xMcp.name || raw['x-speakeasy-name-override'] || op.operationId || deriveToolName(method, path));

    // 4. Resolve Description
    const rawDesc = xMcp.description || op.summary || op.description || `${method.toUpperCase()} ${path}`;
    const description = sanitizeDescription(rawDesc);

    // 5. Resolve Consequential/Safety Flag
    const isConsequential = Boolean(
      xMcp.requireConfirmation ?? raw['x-openai-isConsequential'] ?? ['post', 'put', 'delete', 'patch'].includes(method.toUpperCase())
    );

    // 6. Response Filter
    const responseFilter = xMcp.response?.filter || '';
    const responseMaxItems = xMcp.response?.maxItems || 0;

    const opItem = {
      name: toolName,
      method: method.toUpperCase(),
      path,
      description,
      parameters: params,
      isConsequential,
      readOnly: Boolean(xMcp.readOnly ?? method === 'get'),
      responseFilter,
      responseMaxItems,
      tag: op.tagName || '',
    };

    if (isResource) {
      resources.push({
        ...opItem,
        uri: xMcp.uri || `reference://${toolName.replace(/^get_/, '').replace(/_/g, '-')}`,
        mimeType: xMcp.mimeType || 'application/json',
      });
    } else {
      tools.push(opItem);
    }
  }

  // Extract root-level composite workflows
  const workflows = rawSpec['x-mcp-workflows'] || [];

  const metadata = {
    title: rawSpec.info?.title || 'OpenAPI MCP Server',
    description: sanitizeDescription(rawSpec.info?.description || ''),
    version: rawSpec.info?.version || '1.0.0',
    servers: rawSpec.servers || [{ url: 'http://localhost:3000' }],
  };

  return { metadata, tools, resources, workflows };
}

/**
 * Calculates estimated token overhead for LLM tool definitions.
 */
export function estimateTokenCost(tools = [], resources = [], workflows = []) {
  let estimatedTokens = 0;
  let consequentialCount = 0;

  for (const t of tools) {
    // Tool name + description: ~4 chars per token
    estimatedTokens += Math.ceil((t.name.length + t.description.length) / 4);
    // Base JSON Schema overhead per function tool
    estimatedTokens += 25;
    if (t.isConsequential) consequentialCount++;

    for (const p of t.parameters) {
      estimatedTokens += Math.ceil((p.name.length + (p.description || '').length) / 4);
      estimatedTokens += 10; // type, required, structure tokens
      if (p.enum) estimatedTokens += p.enum.length * 3;
    }
  }

  for (const r of resources) {
    estimatedTokens += Math.ceil((r.name.length + r.description.length + r.uri.length) / 4) + 20;
  }

  for (const w of workflows) {
    estimatedTokens += Math.ceil((w.name.length + (w.description || '').length) / 4) + 40;
    if (w.parameters) {
      estimatedTokens += Object.keys(w.parameters).length * 15;
    }
  }

  const warnings = [];
  if (estimatedTokens > 5000) {
    warnings.push(
      `Context overhead (~${estimatedTokens.toLocaleString()} tokens/turn) is high. Consider pruning unused tools with x-mcp.enabled: false.`
    );
  }
  if (tools.length > 30) {
    warnings.push(`${tools.length} tools exceeds the recommended limit of 30 tools per agent to prevent model paralysis.`);
  }

  return {
    totalTools: tools.length,
    totalResources: resources.length,
    totalWorkflows: workflows.length,
    estimatedTokens,
    consequentialCount,
    warnings,
  };
}

/**
 * Generates single-file TypeScript code using @modelcontextprotocol/sdk.
 */
export function generateTypeScriptMcpServer(metadata, tools, resources, workflows, options = {}) {
  const serverName = toSnakeCase(options.serverName || metadata.title || 'rapidoc_mcp_server');
  const budget = estimateTokenCost(tools, resources, workflows);
  const defaultBaseUrl = metadata.servers?.[0]?.url || 'http://localhost:3000';

  const toolDefinitions = tools
    .map((t) => {
      // Build Zod schema properties
      const zodProps = t.parameters
        .map((p) => {
          let zodType = 'z.string()';
          if (p.type === 'integer' || p.type === 'number') zodType = 'z.number()';
          else if (p.type === 'boolean') zodType = 'z.boolean()';
          else if (p.type === 'array') zodType = 'z.array(z.string())';
          else if (p.type === 'object') zodType = 'z.record(z.any())';

          if (p.description) {
            zodType += `.describe(${JSON.stringify(p.description)})`;
          }
          if (!p.required) {
            zodType += '.optional()';
          }
          return `    ${JSON.stringify(p.name)}: ${zodType},`;
        })
        .join('\n');

      const pathSubstitution = t.path.replace(/\{([^}]+)\}/g, '${encodeURIComponent(args["$1"])}');

      return `
// Tool: ${t.name} (${t.method} ${t.path})
// ${t.isConsequential ? '⚠️ Consequential/Destructive action' : 'Safe/Read-only action'}
server.tool(
  ${JSON.stringify(t.name)},
  ${JSON.stringify(t.description + (t.isConsequential ? ' (Requires confirmation)' : ''))},
  {
${zodProps}
  },
  async (args) => {
    let url = \`\${BASE_URL}${pathSubstitution}\`;
    const queryParams = new URLSearchParams();
${t.parameters
  .filter((p) => p.in === 'query')
  .map(
    (p) =>
      `    if (args[${JSON.stringify(p.name)}] !== undefined) queryParams.set(${JSON.stringify(p.name)}, String(args[${JSON.stringify(p.name)}]));`
  )
  .join('\n')}
    const qs = queryParams.toString();
    if (qs) url += (url.includes('?') ? '&' : '?') + qs;

    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    if (API_KEY) headers['Authorization'] = \`Bearer \${API_KEY}\`;

    const fetchOptions: RequestInit = {
      method: ${JSON.stringify(t.method)},
      headers,
    };

${
  ['POST', 'PUT', 'PATCH'].includes(t.method)
    ? `    const bodyPayload: Record<string, any> = {};
${t.parameters
  .filter((p) => p.in === 'body')
  .map(
    (p) =>
      `    if (args[${JSON.stringify(p.name)}] !== undefined) bodyPayload[${JSON.stringify(p.name)}] = args[${JSON.stringify(p.name)}];`
  )
  .join('\n')}
    if (Object.keys(bodyPayload).length > 0) {
      fetchOptions.body = JSON.stringify(bodyPayload);
    }`
    : ''
}

    try {
      const response = await fetch(url, fetchOptions);
      const text = await response.text();
      let data = text;
      try { data = JSON.parse(text); } catch {}
      return {
        content: [{ type: 'text', text: typeof data === 'string' ? data : JSON.stringify(data, null, 2) }],
      };
    } catch (err: any) {
      return {
        isError: true,
        content: [{ type: 'text', text: \`Error invoking ${t.name}: \${err.message}\` }],
      };
    }
  }
);`;
    })
    .join('\n');

  const resourceDefinitions = resources
    .map((r) => {
      return `
// Resource: ${r.name} (${r.uri})
server.resource(
  ${JSON.stringify(r.name)},
  ${JSON.stringify(r.uri)},
  async (uri) => {
    const url = \`\${BASE_URL}${r.path}\`;
    const headers: Record<string, string> = { 'Accept': ${JSON.stringify(r.mimeType)} };
    if (API_KEY) headers['Authorization'] = \`Bearer \${API_KEY}\`;

    const res = await fetch(url, { headers });
    const text = await res.text();
    return {
      contents: [{
        uri: uri.href,
        text,
        mimeType: ${JSON.stringify(r.mimeType)},
      }],
    };
  }
);`;
    })
    .join('\n');

  const workflowDefinitions = workflows
    .map((w) => {
      const paramKeys = w.parameters ? Object.keys(w.parameters) : [];
      const zodProps = paramKeys
        .map((k) => `    ${JSON.stringify(k)}: z.string().describe(${JSON.stringify(w.parameters[k].description || '')}),`)
        .join('\n');

      return `
// Composite Workflow: ${w.name}
// Collapses multi-step atomic REST calls into 1 tool call
server.tool(
  ${JSON.stringify(w.name)},
  ${JSON.stringify(w.description || 'Composite workflow')},
  {
${zodProps}
  },
  async (args) => {
    const results: Record<string, any> = {};
    const headers: Record<string, string> = { 'Accept': 'application/json' };
    if (API_KEY) headers['Authorization'] = \`Bearer \${API_KEY}\`;

    try {
${(w.steps || [])
  .map((s, idx) => {
    return `      // Step ${idx + 1}: ${s.call}
      const stepUrl_${idx} = \`\${BASE_URL}/api/\${encodeURIComponent(args['customerId'] || '')}\`;
      const resp_${idx} = await fetch(stepUrl_${idx}, { headers });
      results[${JSON.stringify(s.call)}] = await resp_${idx}.json();`;
  })
  .join('\n')}
      return {
        content: [{ type: 'text', text: JSON.stringify(results, null, 2) }],
      };
    } catch (err: any) {
      return {
        isError: true,
        content: [{ type: 'text', text: \`Workflow ${w.name} failed: \${err.message}\` }],
      };
    }
  }
);`;
    })
    .join('\n');

  return `/**
 * Auto-generated by RapiDoc Curated MCP Generator
 * Spec: ${metadata.title} (v${metadata.version})
 *
 * [TOKEN BUDGET DIAGNOSTIC]
 * - Total Tools: ${budget.totalTools}
 * - Total Resources: ${budget.totalResources}
 * - Total Workflows: ${budget.totalWorkflows}
 * - Estimated Prompt Context Overhead: ~${budget.estimatedTokens.toLocaleString()} tokens/turn
${budget.warnings.map((w) => ` * - ⚠️ ${w}`).join('\n')}
 *
 * [HOW TO RUN]
 * 1. npm install @modelcontextprotocol/sdk zod
 * 2. API_KEY="your-key" npx tsx server.ts
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

const API_KEY = process.env.API_KEY || '';
const BASE_URL = process.env.API_BASE_URL || ${JSON.stringify(defaultBaseUrl)};

const server = new McpServer({
  name: ${JSON.stringify(serverName)},
  version: ${JSON.stringify(metadata.version)},
});

${resourceDefinitions}
${toolDefinitions}
${workflowDefinitions}

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(\`[MCP] ${serverName} running on stdio\`);
}

main().catch((err) => {
  console.error('[MCP] Fatal error running server:', err);
  process.exit(1);
});
`;
}

/**
 * Generates single-file Python FastMCP code using Jeremiah Lowin's fastmcp library.
 */
export function generatePythonFastMcpServer(metadata, tools, resources, workflows, options = {}) {
  const serverName = toSnakeCase(options.serverName || metadata.title || 'rapidoc_mcp_server');
  const budget = estimateTokenCost(tools, resources, workflows);
  const defaultBaseUrl = metadata.servers?.[0]?.url || 'http://localhost:3000';

  const toolFunctions = tools
    .map((t) => {
      const pyArgs = t.parameters
        .map((p) => {
          let pyType = 'str';
          if (p.type === 'integer') pyType = 'int';
          else if (p.type === 'number') pyType = 'float';
          else if (p.type === 'boolean') pyType = 'bool';
          else if (p.type === 'array') pyType = 'list';
          else if (p.type === 'object') pyType = 'dict';

          if (!p.required) {
            return `${toSnakeCase(p.name)}: Optional[${pyType}] = None`;
          }
          return `${toSnakeCase(p.name)}: ${pyType}`;
        })
        .join(', ');

      const pathSub = t.path.replace(/\{([^}]+)\}/g, (match, p1) => `{${toSnakeCase(p1)}}`);

      return `
@mcp.tool(
    name="${t.name}",
    description="${t.description.replace(/"/g, '\\"')}"
)
def ${t.name}(${pyArgs}) -> str:
    """${t.description}${t.isConsequential ? ' (⚠️ Consequential action - requires confirmation)' : ''}"""
    url = f"{BASE_URL}${pathSub}"
    headers = {"Accept": "application/json"}
    if API_KEY:
        headers["Authorization"] = f"Bearer {API_KEY}"

    params = {}
${t.parameters
  .filter((p) => p.in === 'query')
  .map((p) => `    if ${toSnakeCase(p.name)} is not None:\n        params["${p.name}"] = ${toSnakeCase(p.name)}`)
  .join('\n')}
    if params:
        url += ("&" if "?" in url else "?") + urllib.parse.urlencode(params)

    body_bytes = None
${
  ['POST', 'PUT', 'PATCH'].includes(t.method)
    ? `    body_payload = {}
${t.parameters
  .filter((p) => p.in === 'body')
  .map((p) => `    if ${toSnakeCase(p.name)} is not None:\n        body_payload["${p.name}"] = ${toSnakeCase(p.name)}`)
  .join('\n')}
    if body_payload:
        headers["Content-Type"] = "application/json"
        body_bytes = json.dumps(body_payload).encode("utf-8")`
    : ''
}

    req = urllib.request.Request(url, data=body_bytes, headers=headers, method="${t.method}")
    try:
        with urllib.request.urlopen(req, timeout=30.0) as resp:
            return resp.read().decode("utf-8")
    except urllib.error.HTTPError as e:
        return e.read().decode("utf-8")
    except Exception as e:
        return f"Error invoking ${t.name}: {str(e)}"
`;
    })
    .join('\n');

  const resourceFunctions = resources
    .map((r) => {
      return `
@mcp.resource("${r.uri}")
def ${r.name}() -> str:
    """${r.description}"""
    url = f"{BASE_URL}${r.path}"
    headers = {"Accept": "${r.mimeType}"}
    if API_KEY:
        headers["Authorization"] = f"Bearer {API_KEY}"
    req = urllib.request.Request(url, headers=headers, method="GET")
    try:
        with urllib.request.urlopen(req, timeout=30.0) as resp:
            return resp.read().decode("utf-8")
    except Exception as e:
        return f"Error loading resource: {str(e)}"
`;
    })
    .join('\n');

  const workflowFunctions = workflows
    .map((w) => {
      const paramKeys = w.parameters ? Object.keys(w.parameters) : [];
      const pyArgs = paramKeys.map((k) => `${toSnakeCase(k)}: str`).join(', ');

      return `
@mcp.tool(
    name="${w.name}",
    description="${(w.description || 'Composite workflow').replace(/"/g, '\\"')}"
)
def ${toSnakeCase(w.name)}(${pyArgs}) -> str:
    """Composite workflow: ${(w.description || '').replace(/"/g, '\\"')}"""
    results = {}
    headers = {"Accept": "application/json"}
    if API_KEY:
        headers["Authorization"] = f"Bearer {API_KEY}"

    try:
${(w.steps || [])
  .map((s, idx) => {
    const argKey = paramKeys[0] || 'id';
    return `        # Step ${idx + 1}: ${s.call}
        step_url_${idx} = f"{BASE_URL}/api/{urllib.parse.quote(str(${toSnakeCase(argKey)}))}"
        req_${idx} = urllib.request.Request(step_url_${idx}, headers=headers, method="GET")
        with urllib.request.urlopen(req_${idx}, timeout=30.0) as resp_${idx}:
            results["${s.call}"] = json.loads(resp_${idx}.read().decode("utf-8"))`;
  })
  .join('\n')}
        return json.dumps(results, indent=2)
    except Exception as e:
        return f"Workflow ${w.name} failed: {str(e)}"
`;
    })
    .join('\n');

  return `"""
Auto-generated by RapiDoc Curated MCP Generator
Spec: ${metadata.title} (v${metadata.version})

[TOKEN BUDGET DIAGNOSTIC]
- Total Tools: ${budget.totalTools}
- Total Resources: ${budget.totalResources}
- Total Workflows: ${budget.totalWorkflows}
- Estimated Prompt Context Overhead: ~${budget.estimatedTokens.toLocaleString()} tokens/turn
${budget.warnings.map((w) => `- ${w}`).join('\n')}

[HOW TO RUN]
1. pip install fastmcp
2. fastmcp run server.py
"""

import os
import json
import urllib.request
import urllib.parse
import urllib.error
from typing import Optional, List, Dict, Any
from fastmcp import FastMCP

API_KEY = os.environ.get("API_KEY", "")
BASE_URL = os.environ.get("API_BASE_URL", "${defaultBaseUrl}")

mcp = FastMCP("${serverName}")

${resourceFunctions}
${toolFunctions}
${workflowFunctions}

if __name__ == "__main__":
    mcp.run()
`;
}

/**
 * Generates single-file Go MCP server code using mark3labs/mcp-go.
 */
export function generateGoMcpServer(metadata, tools, resources, workflows, options = {}) {
  const serverName = toSnakeCase(options.serverName || metadata.title || 'rapidoc_mcp_server');
  const budget = estimateTokenCost(tools, resources, workflows);
  const defaultBaseUrl = metadata.servers?.[0]?.url || 'http://localhost:3000';

  const toolRegistrations = tools
    .map((t) => {
      const paramModifiers = t.parameters
        .map((p) => {
          const isReq = p.required ? 'mcp.Required()' : '';
          const desc = p.description ? `mcp.Description(${JSON.stringify(p.description)})` : '';
          const mods = [isReq, desc].filter(Boolean).join(', ');
          if (p.type === 'integer' || p.type === 'number') {
            return `\t\tmcp.WithNumber("${toSnakeCase(p.name)}"${mods ? `, ${mods}` : ''}),`;
          }
          if (p.type === 'boolean') {
            return `\t\tmcp.WithBoolean("${toSnakeCase(p.name)}"${mods ? `, ${mods}` : ''}),`;
          }
          return `\t\tmcp.WithString("${toSnakeCase(p.name)}"${mods ? `, ${mods}` : ''}),`;
        })
        .join('\n');

      const pathSub = t.path.replace(/\{[^}]+\}/g, '%v');
      const pathParams = t.parameters
        .filter((p) => p.in === 'path')
        .map((p) => `args["${toSnakeCase(p.name)}"]`)
        .join(', ');

      return `
\t// Tool: ${t.name}
\ts.AddTool(mcp.NewTool("${t.name}",
\t\tmcp.WithDescription(${JSON.stringify(t.description)}),
${paramModifiers}
\t), func(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
\t\targs := request.Params.Arguments
\t\turlStr := fmt.Sprintf("%s${pathSub}", baseURL${pathParams ? `, ${pathParams}` : ''})
\t\treq, err := http.NewRequestWithContext(ctx, "${t.method}", urlStr, nil)
\t\tif err != nil {
\t\t\treturn mcp.NewToolResultError(fmt.Sprintf("Failed to create request: %v", err)), nil
\t\t}
\t\treq.Header.Set("Accept", "application/json")
\t\tif apiKey != "" {
\t\t\treq.Header.Set("Authorization", "Bearer "+apiKey)
\t\t}
\t\tresp, err := client.Do(req)
\t\tif err != nil {
\t\t\treturn mcp.NewToolResultError(fmt.Sprintf("API request failed: %v", err)), nil
\t\t}
\t\tdefer resp.Body.Close()
\t\tbody, _ := io.ReadAll(resp.Body)
\t\treturn mcp.NewToolResultText(string(body)), nil
\t})`;
    })
    .join('\n');

  const resourceRegistrations = resources
    .map((r) => {
      return `
\t// Resource: ${r.name} (${r.uri})
\ts.AddResource(mcp.NewResource("${r.uri}", "${r.name}", mcp.WithResourceDescription(${JSON.stringify(r.description)})),
\t\tfunc(ctx context.Context, request mcp.ReadResourceRequest) ([]mcp.ResourceContents, error) {
\t\t\treq, _ := http.NewRequestWithContext(ctx, "GET", baseURL+"${r.path}", nil)
\t\t\treq.Header.Set("Accept", "${r.mimeType}")
\t\t\tif apiKey != "" {
\t\t\t\treq.Header.Set("Authorization", "Bearer "+apiKey)
\t\t\t}
\t\t\tresp, err := client.Do(req)
\t\t\tif err != nil {
\t\t\t\treturn nil, err
\t\t\t}
\t\t\tdefer resp.Body.Close()
\t\t\tbody, _ := io.ReadAll(resp.Body)
\t\t\treturn []mcp.ResourceContents{mcp.TextResourceContents{URI: request.Params.URI, MIMEType: "${r.mimeType}", Text: string(body)}}, nil
\t\t})`;
    })
    .join('\n');

  const workflowRegistrations = workflows
    .map((w) => {
      const paramKeys = w.parameters ? Object.keys(w.parameters) : [];
      const paramMods = paramKeys
        .map(
          (k) =>
            `\t\tmcp.WithString("${toSnakeCase(k)}", mcp.Required(), mcp.Description(${JSON.stringify(w.parameters[k].description || '')})),`
        )
        .join('\n');

      return `
\t// Composite Workflow: ${w.name}
\ts.AddTool(mcp.NewTool("${w.name}",
\t\tmcp.WithDescription(${JSON.stringify(w.description || 'Composite workflow')}),
${paramMods}
\t), func(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
\t\tresults := make(map[string]any)
\t\tparamVal, _ := request.Params.Arguments["${toSnakeCase(paramKeys[0] || 'id')}"].(string)
${(w.steps || [])
  .map((s, idx) => {
    return `\t\t// Step ${idx + 1}: ${s.call}
\t\tstepReq_${idx}, _ := http.NewRequestWithContext(ctx, "GET", fmt.Sprintf("%s/api/%s", baseURL, url.QueryEscape(paramVal)), nil)
\t\tstepReq_${idx}.Header.Set("Accept", "application/json")
\t\tif apiKey != "" { stepReq_${idx}.Header.Set("Authorization", "Bearer "+apiKey) }
\t\tif resp_${idx}, err := client.Do(stepReq_${idx}); err == nil {
\t\t\tvar jsonRes any
\t\t\tjson.NewDecoder(resp_${idx}.Body).Decode(&jsonRes)
\t\t\tresults["${s.call}"] = jsonRes
\t\t\tresp_${idx}.Body.Close()
\t\t}`;
  })
  .join('\n')}
\t\toutBytes, _ := json.MarshalIndent(results, "", "  ")
\t\treturn mcp.NewToolResultText(string(outBytes)), nil
\t})`;
    })
    .join('\n');

  return `/*
Auto-generated by RapiDoc Curated MCP Generator
Spec: ${metadata.title} (v${metadata.version})

[TOKEN BUDGET DIAGNOSTIC]
- Total Tools: ${budget.totalTools}
- Total Resources: ${budget.totalResources}
- Total Workflows: ${budget.totalWorkflows}
- Estimated Prompt Context Overhead: ~${budget.estimatedTokens.toLocaleString()} tokens/turn
${budget.warnings.map((w) => `- ${w}`).join('\n')}

[HOW TO RUN]
1. go mod tidy
2. go run main.go
*/

package main

import (
\t"context"
\t"encoding/json"
\t"fmt"
\t"io"
\t"net/http"
\t"net/url"
\t"os"
\t"time"

\t"github.com/mark3labs/mcp-go/mcp"
\t"github.com/mark3labs/mcp-go/server"
)

var (
\tapiKey  = os.Getenv("API_KEY")
\tbaseURL = "${defaultBaseUrl}"
\tclient  = &http.Client{Timeout: 30 * time.Second}
)

func main() {
\tif envURL := os.Getenv("API_BASE_URL"); envURL != "" {
\t\tbaseURL = envURL
\t}

\ts := server.NewMCPServer("${serverName}", "${metadata.version || '1.0.0'}", server.WithResourceCapabilities(true, true))

${resourceRegistrations}
${toolRegistrations}
${workflowRegistrations}

\tif err := server.ServeStdio(s); err != nil {
\t\tfmt.Fprintf(os.Stderr, "Server error: %v\\n", err)
\t\tos.Exit(1)
\t}
}
`;
}

/**
 * Generates single-file C# (.NET) MCP server code using ModelContextProtocol.NET and Semantic Kernel conventions.
 */
export function generateCSharpMcpServer(metadata, tools, resources, workflows, options = {}) {
  const serverName = toPascalCase(options.serverName || metadata.title || 'RapiDocMcpServer');
  const budget = estimateTokenCost(tools, resources, workflows);
  const defaultBaseUrl = metadata.servers?.[0]?.url || 'http://localhost:3000';

  const toolMethods = tools
    .map((t) => {
      const csharpArgs = t.parameters
        .map((p) => {
          let csharpType = 'string';
          if (p.type === 'integer') csharpType = 'int';
          else if (p.type === 'number') csharpType = 'double';
          else if (p.type === 'boolean') csharpType = 'bool';
          const defaultVal = p.required ? '' : ' = default';
          return `[Description(${JSON.stringify(p.description || '')})] ${csharpType} ${toCamelCase(p.name)}${defaultVal}`;
        })
        .join(', ');

      const pathSub = t.path.replace(/\{([^}]+)\}/g, (match, p1) => `{${toCamelCase(p1)}}`);

      return `
    [McpTool("${t.name}", ${JSON.stringify(t.description)})]
    public static async Task<string> ${toPascalCase(t.name)}(${csharpArgs})
    {
        using var client = new HttpClient { BaseAddress = new Uri(BaseUrl) };
        if (!string.IsNullOrEmpty(ApiKey))
        {
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", ApiKey);
        }
        client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        var response = await client.SendAsync(new HttpRequestMessage(HttpMethod.${toPascalCase(t.method)}, $"${pathSub}"));
        return await response.Content.ReadAsStringAsync();
    }`;
    })
    .join('\n');

  const resourceMethods = resources
    .map((r) => {
      return `
    [McpResource("${r.uri}", "${r.name}", ${JSON.stringify(r.description)})]
    public static async Task<string> Get${toPascalCase(r.name)}()
    {
        using var client = new HttpClient { BaseAddress = new Uri(BaseUrl) };
        if (!string.IsNullOrEmpty(ApiKey)) client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", ApiKey);
        return await client.GetStringAsync("${r.path}");
    }`;
    })
    .join('\n');

  return `/*
Auto-generated by RapiDoc Curated MCP Generator
Spec: ${metadata.title} (v${metadata.version})

[TOKEN BUDGET DIAGNOSTIC]
- Total Tools: ${budget.totalTools}
- Total Resources: ${budget.totalResources}
- Total Workflows: ${budget.totalWorkflows}
- Estimated Prompt Context Overhead: ~${budget.estimatedTokens.toLocaleString()} tokens/turn
${budget.warnings.map((w) => `- ${w}`).join('\n')}

[HOW TO RUN]
1. dotnet restore
2. dotnet run
*/

using System;
using System.ComponentModel;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Threading.Tasks;
using ModelContextProtocol.NET.Server;

namespace ${serverName};

public class Program
{
    private static readonly string ApiKey = Environment.GetEnvironmentVariable("API_KEY") ?? "";
    private static readonly string BaseUrl = Environment.GetEnvironmentVariable("API_BASE_URL") ?? "${defaultBaseUrl}";

    public static async Task Main(string[] args)
    {
        var server = new McpServer(new McpServerOptions
        {
            ServerInfo = new() { Name = "${toSnakeCase(serverName)}", Version = "${metadata.version || '1.0.0'}" }
        });

        server.RegisterTools<Program>();
        server.RegisterResources<Program>();

        await server.StartAsync(Console.OpenStandardInput(), Console.OpenStandardOutput());
    }

${resourceMethods}
${toolMethods}
}
`;
}

/**
 * Generates single-file Rust MCP server code using mcp-sdk / rmcp.
 */
export function generateRustMcpServer(metadata, tools, resources, workflows, options = {}) {
  const serverName = toSnakeCase(options.serverName || metadata.title || 'rapidoc_mcp_server');
  const budget = estimateTokenCost(tools, resources, workflows);
  const defaultBaseUrl = metadata.servers?.[0]?.url || 'http://localhost:3000';

  const toolArms = tools
    .map((t) => {
      const pathSub = t.path.replace(/\{[^}]+\}/g, '{}');
      const pathArgs = t.parameters
        .filter((p) => p.in === 'path')
        .map((p) => `args.get("${toSnakeCase(p.name)}").and_then(|v| v.as_str()).unwrap_or("")`)
        .join(', ');

      return `            "${t.name}" => {
                let url = format!("{}${pathSub}", base_url${pathArgs ? `, ${pathArgs}` : ''});
                let mut req = client.request(reqwest::Method::from_bytes(b"${t.method}")?, &url)
                    .header("Accept", "application/json");
                if let Some(ref key) = api_key {
                    req = req.header("Authorization", format!("Bearer {}", key));
                }
                let resp = req.send().await?;
                let text = resp.text().await?;
                Ok(ToolResponse::text(text))
            }`;
    })
    .join('\n');

  return `/*
Auto-generated by RapiDoc Curated MCP Generator
Spec: ${metadata.title} (v${metadata.version})

[TOKEN BUDGET DIAGNOSTIC]
- Total Tools: ${budget.totalTools}
- Total Resources: ${budget.totalResources}
- Total Workflows: ${budget.totalWorkflows}
- Estimated Prompt Context Overhead: ~${budget.estimatedTokens.toLocaleString()} tokens/turn
${budget.warnings.map((w) => `- ${w}`).join('\n')}

[HOW TO RUN]
1. cargo build --release
2. cargo run
*/

use std::env;
use mcp_sdk::server::{Server, StdioTransport, ToolResponse};
use serde_json::Value;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let api_key = env::var("API_KEY").ok();
    let base_url = env::var("API_BASE_URL").unwrap_or_else(|_| "${defaultBaseUrl}".to_string());
    let client = reqwest::Client::new();

    let mut server = Server::new("${serverName}", "${metadata.version || '1.0.0'}");

    server.on_call_tool(move |name, args: Value| {
        let client = client.clone();
        let api_key = api_key.clone();
        let base_url = base_url.clone();
        async move {
            match name.as_str() {
${toolArms}
                _ => Err(format!("Unknown tool: {}", name).into()),
            }
        }
    });

    server.listen(StdioTransport::new()).await?;
    Ok(())
}
`;
}

/**
 * Generates single-file Java / Spring AI MCP server code using Spring AI MCP.
 */
export function generateJavaMcpServer(metadata, tools, resources, workflows, options = {}) {
  const className = toPascalCase(options.serverName || metadata.title || 'RapiDocMcpServer');
  const budget = estimateTokenCost(tools, resources, workflows);
  const defaultBaseUrl = metadata.servers?.[0]?.url || 'http://localhost:3000';

  const toolBeans = tools
    .map((t) => {
      const pathSub = t.path.replace(/\{[^}]+\}/g, '%s');
      return `
    @Bean
    @Description(${JSON.stringify(t.description)})
    public Function<Map<String, Object>, String> ${toCamelCase(t.name)}() {
        return args -> {
            String url = String.format("%s${pathSub}", baseUrl);
            return restClient.method(HttpMethod.${t.method})
                .uri(url)
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .body(String.class);
        };
    }`;
    })
    .join('\n');

  return `/*
Auto-generated by RapiDoc Curated MCP Generator
Spec: ${metadata.title} (v${metadata.version})

[TOKEN BUDGET DIAGNOSTIC]
- Total Tools: ${budget.totalTools}
- Total Resources: ${budget.totalResources}
- Total Workflows: ${budget.totalWorkflows}
- Estimated Prompt Context Overhead: ~${budget.estimatedTokens.toLocaleString()} tokens/turn
${budget.warnings.map((w) => `- ${w}`).join('\n')}

[HOW TO RUN]
1. ./mvnw spring-boot:run
*/

package com.rapidoc.mcp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Description;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.web.client.RestClient;

import java.util.Map;
import java.util.function.Function;

@SpringBootApplication
public class ${className} {

    private final String baseUrl = System.getenv().getOrDefault("API_BASE_URL", "${defaultBaseUrl}");
    private final String apiKey = System.getenv().getOrDefault("API_KEY", "");
    private final RestClient restClient = RestClient.builder()
        .defaultHeader("Authorization", apiKey.isEmpty() ? "" : "Bearer " + apiKey)
        .build();

    public static void main(String[] args) {
        SpringApplication.run(${className}.class, args);
    }

${toolBeans}
}
`;
}

/**
 * Generates Claude Desktop and Cursor JSON configuration snippets.
 */
export function generateHostConfigs(serverName, options = {}) {
  const safeName = toSnakeCase(serverName || 'api_mcp_server');
  const target = (options.target || 'typescript').toLowerCase();

  let command = 'npx';
  let args = ['-y', 'tsx', 'server.ts'];

  if (target === 'python') {
    command = 'fastmcp';
    args = ['run', 'server.py'];
  } else if (target === 'go') {
    command = `./${safeName}`;
    args = [];
  } else if (target === 'csharp' || target === 'c#') {
    command = 'dotnet';
    args = ['run'];
  } else if (target === 'rust') {
    command = `./target/release/${safeName}`;
    args = [];
  } else if (target === 'java') {
    command = 'java';
    args = ['-jar', 'target/mcp-server.jar'];
  }

  const claudeConfig = {
    mcpServers: {
      [safeName]: {
        command,
        args,
        env: {
          API_KEY: 'your-api-key-here',
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

/**
 * Main export orchestrator function.
 */
export function generateMcpServer(parsedSpec, options = {}) {
  const rawTarget = (options.target || 'typescript').toLowerCase();
  const target = rawTarget === 'c#' ? 'csharp' : rawTarget;
  const extracted = extractMcpOperations(parsedSpec, options);
  const budget = estimateTokenCost(extracted.tools, extracted.resources, extracted.workflows);
  const hostConfigs = generateHostConfigs(options.serverName || extracted.metadata.title, { target });

  let serverCode = '';
  const files = {
    'claude_desktop_config.json': hostConfigs.claudeDesktopConfig,
  };

  if (target === 'python') {
    serverCode = generatePythonFastMcpServer(extracted.metadata, extracted.tools, extracted.resources, extracted.workflows, options);
    files['server.py'] = serverCode;
    files['requirements.txt'] = 'fastmcp>=0.4.0\n';
    files['README.md'] = `# ${extracted.metadata.title} - MCP Server (Python FastMCP)

Auto-generated by RapiDoc Curated MCP Generator.

Zero external networking dependencies: uses Python standard library (\`urllib.request\`) + FastMCP.

### Prerequisites
- Python 3.10+
- \`pip install -r requirements.txt\`

### Running the Server
\`\`\`bash
export API_KEY="your-api-key"
fastmcp run server.py
\`\`\`
`;
  } else if (target === 'go') {
    serverCode = generateGoMcpServer(extracted.metadata, extracted.tools, extracted.resources, extracted.workflows, options);
    files['main.go'] = serverCode;
    files['go.mod'] =
      `module ${toSnakeCase(options.serverName || extracted.metadata.title || 'rapidoc_mcp')}\n\ngo 1.22\n\nrequire github.com/mark3labs/mcp-go v0.8.4\n`;
    files['README.md'] = `# ${extracted.metadata.title} - MCP Server (Go)

Auto-generated by RapiDoc Curated MCP Generator using mark3labs/mcp-go.

### Prerequisites
- Go 1.22+

### Building & Running
\`\`\`bash
go mod tidy
go build -o server main.go
export API_KEY="your-api-key"
./server
\`\`\`
`;
  } else if (target === 'csharp' || target === 'c#') {
    serverCode = generateCSharpMcpServer(extracted.metadata, extracted.tools, extracted.resources, extracted.workflows, options);
    files['Program.cs'] = serverCode;
    files['Server.csproj'] =
      `<Project Sdk="Microsoft.NET.Sdk">\n  <PropertyGroup>\n    <OutputType>Exe</OutputType>\n    <TargetFramework>net8.0</TargetFramework>\n    <ImplicitUsings>enable</ImplicitUsings>\n    <Nullable>enable</Nullable>\n  </PropertyGroup>\n  <ItemGroup>\n    <PackageReference Include="ModelContextProtocol.NET.Server" Version="1.0.0" />\n  </ItemGroup>\n</Project>\n`;
    files['README.md'] = `# ${extracted.metadata.title} - MCP Server (C# / .NET)

Auto-generated by RapiDoc Curated MCP Generator.

### Prerequisites
- .NET 8.0 SDK or newer

### Building & Running
\`\`\`bash
dotnet restore
export API_KEY="your-api-key"
dotnet run
\`\`\`
`;
  } else if (target === 'rust') {
    serverCode = generateRustMcpServer(extracted.metadata, extracted.tools, extracted.resources, extracted.workflows, options);
    files['src/main.rs'] = serverCode;
    files['Cargo.toml'] =
      `[package]\nname = "${toSnakeCase(options.serverName || extracted.metadata.title || 'rapidoc_mcp')}"\nversion = "0.1.0"\nedition = "2021"\n\n[dependencies]\nmcp-sdk = "0.1"\ntokio = { version = "1.0", features = ["full"] }\nreqwest = { version = "0.11", features = ["json"] }\nserde_json = "1.0"\n`;
    files['README.md'] = `# ${extracted.metadata.title} - MCP Server (Rust)

Auto-generated by RapiDoc Curated MCP Generator.

### Prerequisites
- Rust & Cargo (1.75+)

### Building & Running
\`\`\`bash
cargo build --release
export API_KEY="your-api-key"
./target/release/${toSnakeCase(options.serverName || extracted.metadata.title || 'rapidoc_mcp')}
\`\`\`
`;
  } else if (target === 'java') {
    serverCode = generateJavaMcpServer(extracted.metadata, extracted.tools, extracted.resources, extracted.workflows, options);
    files['src/main/java/com/rapidoc/mcp/RapiDocMcpServer.java'] = serverCode;
    files['pom.xml'] = `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.3.0</version>
        <relativePath/>
    </parent>
    <groupId>com.rapidoc</groupId>
    <artifactId>mcp-server</artifactId>
    <version>1.0.0</version>
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
    </dependencies>
</project>\n`;
    files['README.md'] = `# ${extracted.metadata.title} - MCP Server (Java Spring AI)

Auto-generated by RapiDoc Curated MCP Generator.

### Prerequisites
- Java 17+
- Maven 3.8+

### Building & Running
\`\`\`bash
export API_KEY="your-api-key"
./mvnw spring-boot:run
\`\`\`
`;
  } else {
    // Default: TypeScript
    serverCode = generateTypeScriptMcpServer(extracted.metadata, extracted.tools, extracted.resources, extracted.workflows, options);
    const packageJson = {
      name: toSnakeCase(options.serverName || extracted.metadata.title || 'rapidoc-mcp-server'),
      version: extracted.metadata.version || '1.0.0',
      type: 'module',
      scripts: {
        start: 'npx tsx server.ts',
      },
      dependencies: {
        '@modelcontextprotocol/sdk': '^1.6.0',
        zod: '^3.24.0',
      },
      devDependencies: {
        tsx: '^4.19.0',
        typescript: '^5.7.0',
      },
    };
    files['server.ts'] = serverCode;
    files['package.json'] = JSON.stringify(packageJson, null, 2);
    files['README.md'] = `# ${extracted.metadata.title} - MCP Server (TypeScript)

Auto-generated by RapiDoc Curated MCP Generator.

### Prerequisites
- Node.js 18+
- \`npm install\`

### Running the Server
\`\`\`bash
API_KEY="your-key" npm start
\`\`\`
`;
  }

  return {
    target,
    serverCode,
    hostConfig: hostConfigs.claudeDesktopConfig,
    budget,
    files,
    extracted,
  };
}
