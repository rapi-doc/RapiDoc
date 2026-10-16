/**
 * Single-file Go MCP Server Generator
 * Uses mark3labs/mcp-go framework.
 */
import { toSnakeCase, estimateTokenCost } from '../common.js';

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
          if (p.type === 'array') {
            return `\t\tmcp.WithList("${toSnakeCase(p.name)}"${mods ? `, ${mods}` : ''}),`;
          }
          if (p.type === 'object') {
            return `\t\tmcp.WithObject("${toSnakeCase(p.name)}"${mods ? `, ${mods}` : ''}),`;
          }
          return `\t\tmcp.WithString("${toSnakeCase(p.name)}"${mods ? `, ${mods}` : ''}),`;
        })
        .join('\n');

      const queryParams = t.parameters.filter((p) => p.in === 'query');
      const bodyParams = t.parameters.filter((p) => p.in === 'body');
      const hasBody = ['POST', 'PUT', 'PATCH'].includes(t.method) && bodyParams.length > 0;

      const allParamModifiers = paramModifiers
        ? `${paramModifiers}\n\t\tmcp.WithString("api_key", mcp.Description("Optional Bearer API key override for multi-tenant sessions")),`
        : `\t\tmcp.WithString("api_key", mcp.Description("Optional Bearer API key override for multi-tenant sessions")),`;

      const pathSub = t.path.replace(/\{[^}]+\}/g, '%s');
      const pathParams = t.parameters
        .filter((p) => p.in === 'path')
        .map((p) => `url.PathEscape(fmt.Sprintf("%v", args["${toSnakeCase(p.name)}"]))`)
        .join(', ');

      const queryCode =
        queryParams.length > 0
          ? `\t\tqueryParams := url.Values{}
${queryParams.map((p) => `\t\tif v, ok := args["${toSnakeCase(p.name)}"]; ok && v != nil {\n\t\t\tqueryParams.Set("${p.name}", fmt.Sprintf("%v", v))\n\t\t}`).join('\n')}
\t\tif len(queryParams) > 0 {
\t\t\tif strings.Contains(urlStr, "?") {
\t\t\t\turlStr += "&" + queryParams.Encode()
\t\t\t} else {
\t\t\t\turlStr += "?" + queryParams.Encode()
\t\t\t}
\t\t}\n`
          : '';

      const bodyCode = hasBody
        ? `\t\tvar bodyReader io.Reader
\t\tbodyPayload := make(map[string]any)
${bodyParams.map((p) => `\t\tif v, ok := args["${toSnakeCase(p.name)}"]; ok && v != nil {\n\t\t\tbodyPayload["${p.name}"] = v\n\t\t}`).join('\n')}
\t\tif len(bodyPayload) > 0 {
\t\t\tb, _ := json.Marshal(bodyPayload)
\t\t\tbodyReader = bytes.NewBuffer(b)
\t\t}
\t\treq, err := http.NewRequestWithContext(ctx, "${t.method}", urlStr, bodyReader)
\t\tif err != nil {
\t\t\treturn mcp.NewToolResultError(fmt.Sprintf("Failed to create request: %v", err)), nil
\t\t}
\t\tif bodyReader != nil {
\t\t\treq.Header.Set("Content-Type", "application/json")
\t\t}\n`
        : `\t\treq, err := http.NewRequestWithContext(ctx, "${t.method}", urlStr, nil)
\t\tif err != nil {
\t\t\treturn mcp.NewToolResultError(fmt.Sprintf("Failed to create request: %v", err)), nil
\t\t}\n`;

      return `
\t// Tool: ${t.name} (${t.method} ${t.path})
\ts.AddTool(mcp.NewTool("${t.name}",
\t\tmcp.WithDescription(${JSON.stringify(t.description)}),
${allParamModifiers}
\t), func(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
\t\targs := request.Params.Arguments
\t\turlStr := fmt.Sprintf("%s${pathSub}", strings.TrimRight(baseURL, "/")${pathParams ? `, ${pathParams}` : ''})
${queryCode}${bodyCode}\t\treq.Header.Set("Accept", "application/json")
${t.parameters
  .filter((p) => p.in === 'header')
  .map(
    (p) =>
      `\t\tif v, ok := args["${toSnakeCase(p.name)}"]; ok && v != nil {\n\t\t\treq.Header.Set("${p.name}", fmt.Sprintf("%v", v))\n\t\t}`
  )
  .join('\n')}
\t\tresolvedKey := apiKey
\t\tif keyVal, ok := args["api_key"].(string); ok && keyVal != "" {
\t\t\tresolvedKey = keyVal
\t\t}
\t\tif resolvedKey != "" {
\t\t\treq.Header.Set("Authorization", "Bearer "+resolvedKey)
\t\t}
\t\tresp, err := client.Do(req)
\t\tif err != nil {
\t\t\treturn mcp.NewToolResultError(fmt.Sprintf("API request failed: %v", err)), nil
\t\t}
\t\tdefer resp.Body.Close()
\t\tbody, _ := io.ReadAll(resp.Body)
\t\treturn mcp.NewToolResultText(string(body)), nil
\t})
`;
    })
    .join('\n');

  const resourceRegistrations = resources
    .map((r) => {
      return `
\t// Resource: ${r.name} (${r.uri})
\ts.AddResource(mcp.NewResource("${r.uri}", "${toSnakeCase(r.name)}", mcp.WithResourceDescription(${JSON.stringify(r.description)})),
\t\tfunc(ctx context.Context, request mcp.ReadResourceRequest) ([]mcp.ResourceContents, error) {
\t\t\ttargetURL, err := url.Parse(strings.TrimRight(baseURL, "/") + "${r.path}")
\t\t\tif err != nil {
\t\t\t\treturn nil, err
\t\t\t}

\t\t\tresolvedKey := apiKey
\t\t\tif incomingURL, err := url.Parse(request.Params.URI); err == nil {
\t\t\t\tq := incomingURL.Query()
\t\t\t\tif passedKey := q.Get("apiKey"); passedKey != "" {
\t\t\t\t\tresolvedKey = passedKey
\t\t\t\t} else if passedKey := q.Get("api_key"); passedKey != "" {
\t\t\t\t\tresolvedKey = passedKey
\t\t\t\t}

\t\t\t\ttargetQuery := targetURL.Query()
\t\t\t\tfor k, v := range q {
\t\t\t\t\tif strings.ToLower(k) != "apikey" && strings.ToLower(k) != "api_key" && len(v) > 0 {
\t\t\t\t\t\ttargetQuery.Set(k, v[0])
\t\t\t\t\t}
\t\t\t\t}
\t\t\t\ttargetURL.RawQuery = targetQuery.Encode()
\t\t\t}

\t\t\treq, err := http.NewRequestWithContext(ctx, "GET", targetURL.String(), nil)
\t\t\tif err != nil {
\t\t\t\treturn nil, err
\t\t\t}
\t\t\treq.Header.Set("Accept", "${r.mimeType || 'application/json'}")
\t\t\tif resolvedKey != "" {
\t\t\t\treq.Header.Set("Authorization", "Bearer "+resolvedKey)
\t\t\t}
\t\t\tresp, err := client.Do(req)
\t\t\tif err != nil {
\t\t\t\treturn nil, err
\t\t\t}
\t\t\tdefer resp.Body.Close()
\t\tbody, _ := io.ReadAll(resp.Body)
\t\treturn []mcp.ResourceContents{mcp.TextResourceContents{URI: request.Params.URI, MIMEType: "${r.mimeType || 'application/json'}", Text: string(body)}}, nil
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
        .concat([`\t\tmcp.WithString("api_key", mcp.Description("Optional Bearer API key override for multi-tenant sessions")),`])
        .join('\n');

      return `
\t// Composite Workflow: ${w.name}
\ts.AddTool(mcp.NewTool("${w.name}",
\t\tmcp.WithDescription(${JSON.stringify(w.description || 'Composite workflow')}),
${paramMods}
\t), func(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
\t\tresults := make(map[string]any)
\t\tparamVal, _ := request.Params.Arguments["${toSnakeCase(paramKeys[0] || 'id')}"].(string)
\t\tresolvedKey := apiKey
\t\tif keyVal, ok := request.Params.Arguments["api_key"].(string); ok && keyVal != "" {
\t\t\tresolvedKey = keyVal
\t\t}
${(w.steps || [])
  .map((s, idx) => {
    return `\t\t// Step ${idx + 1}: ${s.call}
\t\tstepReq_${idx}, _ := http.NewRequestWithContext(ctx, "GET", fmt.Sprintf("%s/api/%s", strings.TrimRight(baseURL, "/"), url.QueryEscape(paramVal)), nil)
\t\tstepReq_${idx}.Header.Set("Accept", "application/json")
\t\tif resolvedKey != "" { stepReq_${idx}.Header.Set("Authorization", "Bearer "+resolvedKey) }
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
1. go mod tidy
2. go run main.go
*/

package main

import (
\t"bytes"
\t"context"
\t"encoding/json"
\t"fmt"
\t"io"
\t"net/http"
\t"net/url"
\t"os"
\t"strings"
\t"time"

\t"github.com/mark3labs/mcp-go/mcp"
\t"github.com/mark3labs/mcp-go/server"
)

var (
\tapiKey  = os.Getenv("API_KEY")
\tbaseURL = strings.TrimRight("${defaultBaseUrl}", "/")
\tclient  = &http.Client{Timeout: 30 * time.Second}
)

func main() {
\tif envURL := os.Getenv("API_BASE_URL"); envURL != "" {
\t\tbaseURL = strings.TrimRight(envURL, "/")
\t}
\tbaseURL = strings.TrimRight(baseURL, "/")

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

export function generateGoFiles(serverCode, metadata, options = {}) {
  const modFile = `module ${toSnakeCase(options.serverName || metadata.title || 'rapidoc_mcp')}\n\ngo 1.22\n\nrequire github.com/mark3labs/mcp-go v0.8.4\n`;
  const readme = `# ${metadata.title} - MCP Server (Go)

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

  return {
    'main.go': serverCode,
    'go.mod': modFile,
    'README.md': readme,
  };
}
