/**
 * Single-file TypeScript MCP Server Generator
 * Uses official @modelcontextprotocol/sdk and zod.
 */
import { toSnakeCase, estimateTokenCost } from "../common.js";

export function generateTypeScriptMcpServer(metadata, tools, resources, workflows, options = {}) {
  const serverName = toSnakeCase(options.serverName || metadata.title || "rapidoc_mcp_server");
  const budget = estimateTokenCost(tools, resources, workflows);
  const defaultBaseUrl = metadata.servers?.[0]?.url || "http://localhost:3000";

  const toolDefinitions = tools
    .map((t) => {
      // Build Zod schema properties
      const zodProps = t.parameters
        .map((p) => {
          let zodType = "z.string()";
          if (p.type === "integer" || p.type === "number") zodType = "z.number()";
          else if (p.type === "boolean") zodType = "z.boolean()";
          else if (p.type === "array") zodType = "z.array(z.string())";
          else if (p.type === "object") zodType = "z.record(z.any())";

          if (p.description) {
            zodType += `.describe(${JSON.stringify(p.description)})`;
          }
          if (!p.required) {
            zodType += ".optional()";
          }
          return `    ${JSON.stringify(p.name)}: ${zodType},`;
        })
        .join("\n");

      const allZodProps = zodProps
        ? `${zodProps}\n    apiKey: z.string().optional().describe('Optional Bearer API key override for multi-tenant sessions'),`
        : `    apiKey: z.string().optional().describe('Optional Bearer API key override for multi-tenant sessions'),`;

      const pathSubstitution = t.path.replace(/\{([^}]+)\}/g, '${encodeURIComponent(args["$1"])}');

      const headerParams = t.parameters.filter((p) => p.in === "header");
      const headerAppends = headerParams
        .map(
          (p) =>
            `    if (args[${JSON.stringify(p.name)}]) {\n      headers[${JSON.stringify(p.name)}] = String(args[${JSON.stringify(p.name)}]);\n    }`,
        )
        .join("\n");

      return `
// Tool: ${t.name} (${t.method} ${t.path})
// ${t.isConsequential ? "⚠️ Consequential/Destructive action" : "Safe/Read-only action"}
server.tool(
  ${JSON.stringify(t.name)},
  ${JSON.stringify(t.description + (t.isConsequential ? " (Requires confirmation)" : ""))},
  {
${allZodProps}
  },
  async (args: any) => {
    const targetUrl = new URL(\`\${BASE_URL.replace(/\\/$/, '')}${pathSubstitution}\`);
    let url = targetUrl.toString();
    const queryParams = new URLSearchParams();
${t.parameters
  .filter((p) => p.in === "query")
  .map(
    (p) =>
      `    if (args[${JSON.stringify(p.name)}] !== undefined) queryParams.set(${JSON.stringify(p.name)}, String(args[${JSON.stringify(p.name)}]));`,
  )
  .join("\n")}
    const qs = queryParams.toString();
    if (qs) url += (url.includes('?') ? '&' : '?') + qs;

    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
${headerAppends ? "\n" + headerAppends + "\n" : ""}    const resolvedKey = args?.apiKey || API_KEY;
    if (resolvedKey) headers['Authorization'] = \`Bearer \${resolvedKey}\`;

    const fetchOptions: RequestInit = {
      method: ${JSON.stringify(t.method)},
      headers,
    };

${
  ["POST", "PUT", "PATCH"].includes(t.method)
    ? `    const bodyPayload: Record<string, any> = {};
${t.parameters
  .filter((p) => p.in === "body")
  .map(
    (p) =>
      `    if (args[${JSON.stringify(p.name)}] !== undefined) bodyPayload[${JSON.stringify(p.name)}] = args[${JSON.stringify(p.name)}];`,
  )
  .join("\n")}
    if (Object.keys(bodyPayload).length > 0) {
      fetchOptions.body = JSON.stringify(bodyPayload);
    }`
    : ""
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
    .join("\n");

  const resourceDefinitions = resources
    .map((r) => {
      return `
// Resource: ${r.name} (${r.uri})
server.resource(
  ${JSON.stringify(r.name)},
  ${JSON.stringify(r.uri)},
  async (uri) => {
    const targetUrl = new URL(\`\${BASE_URL.replace(/\\/$/, '')}${r.path}\`);
    const resolvedKey = uri.searchParams?.get('apiKey') || uri.searchParams?.get('api_key') || API_KEY;
    if (uri.searchParams) {
      uri.searchParams.forEach((val, key) => {
        if (!['apikey', 'api_key'].includes(key.toLowerCase())) {
          targetUrl.searchParams.set(key, val);
        }
      });
    }
    const headers: Record<string, string> = { 'Accept': ${JSON.stringify(r.mimeType)} };
    if (resolvedKey) headers['Authorization'] = \`Bearer \${resolvedKey}\`;

    const res = await fetch(targetUrl.toString(), { headers });
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
    .join("\n");

  const workflowDefinitions = workflows
    .map((w) => {
      const paramKeys = w.parameters ? Object.keys(w.parameters) : [];
      const zodProps = paramKeys
        .map(
          (k) =>
            `    ${JSON.stringify(k)}: z.string().describe(${JSON.stringify(w.parameters[k].description || "")}),`,
        )
        .concat([
          `    apiKey: z.string().optional().describe('Optional Bearer API key override for multi-tenant sessions'),`,
        ])
        .join("\n");
      const firstParam = paramKeys[0] || "id";

      return `
// Composite Workflow: ${w.name}
// Collapses multi-step atomic REST calls into 1 tool call
server.tool(
  ${JSON.stringify(w.name)},
  ${JSON.stringify(w.description || "Composite workflow")},
  {
${zodProps}
  },
  async (args: any) => {
    const results: Record<string, any> = {};
    const headers: Record<string, string> = { 'Accept': 'application/json' };
    const resolvedKey = args?.apiKey || API_KEY;
    if (resolvedKey) headers['Authorization'] = \`Bearer \${resolvedKey}\`;

    try {
${(w.steps || [])
  .map((s, idx) => {
    return `      // Step ${idx + 1}: ${s.call}
      const stepUrl_${idx} = \`\${BASE_URL.replace(/\\/$/, '')}/api/\${encodeURIComponent(args[${JSON.stringify(firstParam)}] || '')}\`;
      const resp_${idx} = await fetch(stepUrl_${idx}, { headers });
      results[${JSON.stringify(s.call)}] = await resp_${idx}.json();`;
  })
  .join("\n")}
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
    .join("\n");

  return `/**
 * Auto-generated by RapiDoc Curated MCP Generator
 * Spec: ${metadata.title} (v${metadata.version})
 *
 * [MULTI-TENANCY & AUTHENTICATION]
 * - Local Stdio Mode: Claude Desktop, Cursor, and local agents use API_KEY from environment.
 * - Multi-Tenant / Agent Mode: When running in a shared service, the calling AI agent can pass
 *   per-session credentials directly in the \`apiKey\` parameter of any tool.
 *
 * [TOKEN BUDGET DIAGNOSTIC]
 * - Total Tools: ${budget.totalTools}
 * - Total Resources: ${budget.totalResources}
 * - Total Workflows: ${budget.totalWorkflows}
 * - Estimated Prompt Context Overhead: ~${budget.estimatedTokens.toLocaleString()} tokens/turn
${budget.warnings.map((w) => ` * - ⚠️ ${w}`).join("\n")}
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

export function generateTypeScriptFiles(serverCode, metadata, options = {}) {
  const packageJson = {
    name: toSnakeCase(options.serverName || metadata.title || "rapidoc-mcp-server"),
    version: metadata.version || "1.0.0",
    type: "module",
    scripts: {
      start: "npx tsx server.ts",
    },
    dependencies: {
      "@modelcontextprotocol/sdk": "^1.6.0",
      zod: "^3.24.0",
    },
    devDependencies: {
      tsx: "^4.19.0",
      typescript: "^5.7.0",
    },
  };

  const readme = `# ${metadata.title} - MCP Server (TypeScript)

Auto-generated by RapiDoc Curated MCP Generator.

### Prerequisites
- Node.js 18+
- \`npm install\`

### Running the Server
\`\`\`bash
API_KEY="your-key" npm start
\`\`\`
`;

  return {
    "server.ts": serverCode,
    "package.json": JSON.stringify(packageJson, null, 2),
    "README.md": readme,
  };
}
