/**
 * Single-file Python FastMCP Server Generator
 * Uses fastmcp with zero external networking dependencies (urllib.request).
 */
import { toSnakeCase, estimateTokenCost } from '../common.js';

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
          else if (p.type === 'array') {
            const itemType = p.items?.type;
            if (itemType === 'integer') pyType = 'List[int]';
            else if (itemType === 'number') pyType = 'List[float]';
            else if (itemType === 'boolean') pyType = 'List[bool]';
            else if (itemType === 'object') pyType = 'List[Dict[str, Any]]';
            else pyType = 'List[str]';
          } else if (p.type === 'object') pyType = 'Dict[str, Any]';

          if (!p.required) {
            return `${toSnakeCase(p.name)}: Optional[${pyType}] = None`;
          }
          return `${toSnakeCase(p.name)}: ${pyType}`;
        })
        .join(', ');

      const allPyArgs = [pyArgs, 'api_key: Optional[str] = None'].filter(Boolean).join(', ');
      const pathParams = t.parameters.filter((p) => p.in === 'path');
      const safePathCode = pathParams
        .map((p) => `    safe_${toSnakeCase(p.name)} = urllib.parse.quote(str(${toSnakeCase(p.name)}))`)
        .join('\n');
      const pathSub = t.path.replace(/\{([^}]+)\}/g, (match, p1) => `{safe_${toSnakeCase(p1)}}`);

      return `
@mcp.tool(
    name="${t.name}",
    description="${t.description.replace(/"/g, '\\"')}"
)
def ${t.name}(${allPyArgs}) -> str:
    """${t.description}${t.isConsequential ? ' (⚠️ Consequential action - requires confirmation)' : ''}"""
${safePathCode ? safePathCode + '\n' : ''}    url = f"{BASE_URL.rstrip('/')}${pathSub}"
    headers = {"Accept": "application/json"}
${t.parameters
  .filter((p) => p.in === 'header')
  .map((p) => `    if ${toSnakeCase(p.name)} is not None:\n        headers["${p.name}"] = str(${toSnakeCase(p.name)})`)
  .join('\n')}
    resolved_key = api_key or API_KEY
    if resolved_key:
        headers["Authorization"] = f"Bearer {resolved_key}"

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
def ${toSnakeCase(r.name)}(uri: str = "") -> str:
    """${r.description}"""
    url = f"{BASE_URL.rstrip('/')}${r.path}"
    headers = {"Accept": "${r.mimeType || 'application/json'}"}

    resolved_key = API_KEY
    if uri and "?" in uri:
        parsed_query = urllib.parse.parse_qs(urllib.parse.urlparse(uri).query)
        passed_key = parsed_query.get("apiKey") or parsed_query.get("api_key")
        if passed_key and passed_key[0].strip():
            resolved_key = passed_key[0].strip()

    if resolved_key:
        headers["Authorization"] = f"Bearer {resolved_key}"

    if uri and "?" in uri:
        parsed_query = urllib.parse.parse_qs(urllib.parse.urlparse(uri).query)
        params = {k: v[0] for k, v in parsed_query.items() if k.lower() not in ["apikey", "api_key"]}
        if params:
            url += ("&" if "?" in url else "?") + urllib.parse.urlencode(params)

    req = urllib.request.Request(url, headers=headers, method="GET")
    try:
        with urllib.request.urlopen(req, timeout=30.0) as resp:
            return resp.read().decode("utf-8")
    except urllib.error.HTTPError as e:
        return e.read().decode("utf-8")
    except Exception as e:
        return f"Error loading resource: {str(e)}"
`;
    })
    .join('\n');

  const workflowFunctions = workflows
    .map((w) => {
      const paramKeys = w.parameters ? Object.keys(w.parameters) : [];
      const pyArgs = paramKeys
        .map((k) => `${toSnakeCase(k)}: str`)
        .concat(['api_key: Optional[str] = None'])
        .join(', ');

      return `
@mcp.tool(
    name="${w.name}",
    description="${(w.description || 'Composite workflow').replace(/"/g, '\\"')}"
)
def ${toSnakeCase(w.name)}(${pyArgs}) -> str:
    """Composite workflow: ${(w.description || '').replace(/"/g, '\\"')}"""
    results = {}
    headers = {"Accept": "application/json"}
    resolved_key = api_key or API_KEY
    if resolved_key:
        headers["Authorization"] = f"Bearer {resolved_key}"

    try:
${(w.steps || [])
  .map((s, idx) => {
    const argKey = paramKeys[0] || 'id';
    return `        # Step ${idx + 1}: ${s.call}
        step_url_${idx} = f"{BASE_URL.rstrip('/')}/api/{urllib.parse.quote(str(${toSnakeCase(argKey)}))}"
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

[MULTI-TENANCY & AUTHENTICATION]
- Local Stdio Mode: Claude Desktop, Cursor, and local agents use API_KEY from environment.
- Multi-Tenant / Agent Mode: When running in a shared service, the calling AI agent can pass
  per-session credentials directly in the \`api_key\` parameter of any tool.

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

export function generatePythonFiles(serverCode, metadata) {
  const readme = `# ${metadata.title} - MCP Server (Python FastMCP)

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

  return {
    'server.py': serverCode,
    'requirements.txt': 'fastmcp>=0.4.0\n',
    'README.md': readme,
  };
}
