/**
 * Single-file Rust MCP Server Generator
 * Uses mcp_sdk / rmcp conventions.
 */
import { toSnakeCase, estimateTokenCost } from '../common.js';

export function generateRustMcpServer(metadata, tools, resources, workflows, options = {}) {
  const serverName = toSnakeCase(options.serverName || metadata.title || 'rapidoc_mcp_server');
  const budget = estimateTokenCost(tools, resources, workflows);
  const defaultBaseUrl = metadata.servers?.[0]?.url || 'http://localhost:3000';

  const toolRegistrations = tools
    .map((t) => {
      const propCalls = t.parameters
        .map((p) => {
          let rustSchemaType = 'string';
          if (p.type === 'integer' || p.type === 'number') rustSchemaType = 'number';
          else if (p.type === 'boolean') rustSchemaType = 'boolean';
          else if (p.type === 'array') rustSchemaType = 'array';
          else if (p.type === 'object') rustSchemaType = 'object';
          return `\n            .property("${toSnakeCase(p.name)}", "${rustSchemaType}", ${Boolean(p.required)}, ${JSON.stringify(p.description || '')})`;
        })
        .join('');

      return `    server.add_tool(
        Tool::new("${t.name}", ${JSON.stringify(t.description)})
${propCalls ? propCalls + '\n' : ''}            .property("api_key", "string", false, "Optional Bearer API key override for multi-tenant sessions")
    );`;
    })
    .join('\n\n');

  const workflowRegistrations = workflows
    .map((w) => {
      const paramKeys = w.parameters ? Object.keys(w.parameters) : [];
      const propCalls = paramKeys
        .map((k) => `\n            .property("${toSnakeCase(k)}", "string", true, ${JSON.stringify(w.parameters[k].description || '')})`)
        .join('');

      return `    server.add_tool(
        Tool::new("${w.name}", ${JSON.stringify(w.description || 'Composite workflow')})
${propCalls ? propCalls + '\n' : ''}            .property("api_key", "string", false, "Optional Bearer API key override for multi-tenant sessions")
    );`;
    })
    .join('\n\n');

  const toolArms = tools
    .map((t) => {
      const pathSub = t.path.replace(/\{[^}]+\}/g, '{}');
      const pathParams = t.parameters.filter((p) => p.in === 'path');
      const queryParams = t.parameters.filter((p) => p.in === 'query');
      const bodyParams = t.parameters.filter((p) => p.in === 'body');
      const hasBody = ['POST', 'PUT', 'PATCH'].includes(t.method) && bodyParams.length > 0;

      const pathArgs = pathParams
        .map((p) => `urlencoding::encode(args.get("${toSnakeCase(p.name)}").and_then(|v| v.as_str()).unwrap_or("")).as_ref()`)
        .join(', ');

      const queryCode =
        queryParams.length > 0
          ? `                    let mut query_params: Vec<(&str, String)> = Vec::new();
${queryParams
  .map(
    (p) => `                    if let Some(val) = args.get("${toSnakeCase(p.name)}") {
                        let s = val.as_str().map(String::from).unwrap_or_else(|| val.to_string());
                        query_params.push(("${p.name}", s));
                    }`
  )
  .join('\n')}
                    if !query_params.is_empty() {
                        req = req.query(&query_params);
                    }\n`
          : '';

      const bodyCode = hasBody
        ? `                    let mut body_map = serde_json::Map::new();
${bodyParams
  .map(
    (p) => `                    if let Some(val) = args.get("${toSnakeCase(p.name)}") {
                        body_map.insert("${p.name}".to_string(), val.clone());
                    }`
  )
  .join('\n')}
                    if !body_map.is_empty() {
                        req = req.json(&body_map);
                    }\n`
        : '';

      return `                "${t.name}" => {
                    let url = format!("{}${pathSub}", base_url.trim_end_matches('/')${pathArgs ? `, ${pathArgs}` : ''});
                    let mut req = client.request(reqwest::Method::from_bytes(b"${t.method}")?, &url)
                        .header("Accept", "application/json");
${t.parameters
  .filter((p) => p.in === 'header')
  .map(
    (p) =>
      `                    if let Some(h) = args.get("${p.name}").or_else(|| args.get("${toSnakeCase(p.name)}")).and_then(|v| v.as_str()) {\n                        req = req.header("${p.name}", h);\n                    }`
  )
  .join('\n')}
                    let resolved_key = args.get("api_key").and_then(|v| v.as_str()).map(String::from).or_else(|| api_key.clone());
                    if let Some(ref key) = resolved_key {
                        req = req.header("Authorization", format!("Bearer {}", key));
                    }
${queryCode}${bodyCode}                    let resp = req.send().await?;
                    let text = resp.text().await?;
                    Ok(ToolResponse::text(text))
                }`;
    })
    .join('\n');

  const workflowArms = workflows
    .map((w) => {
      const paramKeys = w.parameters ? Object.keys(w.parameters) : [];
      const argKey = paramKeys[0] || 'id';

      return `                "${w.name}" => {
                    let resolved_key = args.get("api_key").and_then(|v| v.as_str()).map(String::from).or_else(|| api_key.clone());
                    let param_val = args.get("${toSnakeCase(argKey)}").and_then(|v| v.as_str()).unwrap_or("");
                    let mut results = serde_json::Map::new();
${(w.steps || [])
  .map(
    (s, idx) => `                    // Step ${idx + 1}: ${s.call}
                    let step_url_${idx} = format!("{}/api/{}", base_url.trim_end_matches('/'), urlencoding::encode(param_val));
                    let mut step_req_${idx} = client.get(&step_url_${idx}).header("Accept", "application/json");
                    if let Some(ref key) = resolved_key {
                        step_req_${idx} = step_req_${idx}.header("Authorization", format!("Bearer {}", key));
                    }
                    if let Ok(resp) = step_req_${idx}.send().await {
                        if let Ok(json_res) = resp.json::<serde_json::Value>().await {
                            results.insert("${s.call}".to_string(), json_res);
                        }
                    }`
  )
  .join('\n')}
                    Ok(ToolResponse::text(serde_json::to_string_pretty(&results)?))
                }`;
    })
    .join('\n');

  const resourceArms = resources
    .map((r) => {
      return `                "${r.uri}" => {
                    let mut req = client.get(format!("{}{}", base_url.trim_end_matches('/'), "${r.path}")).header("Accept", "${r.mimeType}");
                    if !query_params.is_empty() {
                        req = req.query(&query_params);
                    }
                    if let Some(ref key) = resolved_key {
                        req = req.header("Authorization", format!("Bearer {}", key));
                    }
                    let resp = req.send().await.map_err(|e| Box::new(e) as Box<dyn Error>)?;
                    let text = resp.text().await.map_err(|e| Box::new(e) as Box<dyn Error>)?;
                    Ok(vec![mcp_sdk::server::ResourceContents::text("${r.uri}", "${r.mimeType}", text)])
                }`;
    })
    .join('\n');

  const hasResources = resources.length > 0;
  const resourceRegistration = hasResources
    ? `
    server.on_read_resource(move |uri| {
        let client = client.clone();
        let api_key = api_key.clone();
        let base_url = base_url.clone();
        async move {
            let (base_uri, query_str) = uri.split_once('?').unwrap_or((uri.as_str(), ""));
            let mut resolved_key = api_key.clone();
            let mut query_params: Vec<(&str, &str)> = Vec::new();

            if !query_str.is_empty() {
                for pair in query_str.split('&') {
                    if let Some((k, v)) = pair.split_once('=') {
                        if k.eq_ignore_ascii_case("apikey") || k.eq_ignore_ascii_case("api_key") {
                            if !v.is_empty() {
                                resolved_key = Some(v.to_string());
                            }
                        } else if !k.is_empty() {
                            query_params.push((k, v));
                        }
                    }
                }
            }

            match base_uri {
${resourceArms}
                _ => Err(format!("Unknown resource: {}", uri).into()),
            }
        }
    });`
    : '';

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
1. cargo build --release
2. cargo run
*/

use std::env;
use std::error::Error;
use mcp_sdk::server::{Server, StdioTransport, Tool, ToolResponse};
use serde_json::Value;

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    let api_key = env::var("API_KEY").ok();
    let base_url = env::var("API_BASE_URL").unwrap_or_else(|_| "${defaultBaseUrl}".to_string());
    let client = reqwest::Client::new();

    let mut server = Server::new("${serverName}", "${metadata.version || '1.0.0'}");

${toolRegistrations}
${workflowRegistrations ? '\n' + workflowRegistrations : ''}

    server.on_call_tool(move |name, args: Value| {
        let client = client.clone();
        let api_key = api_key.clone();
        let base_url = base_url.clone();
        async move {
            let result: Result<ToolResponse, Box<dyn Error>> = async {
                match name.as_str() {
${toolArms}
${workflowArms}
                    _ => Err(format!("Unknown tool or workflow: {}", name).into()),
                }
            }.await;

            match result {
                Ok(resp) => Ok(resp),
                Err(e) => Ok(ToolResponse::error(format!("Execution failed: {}", e))),
            }
        }
    });${resourceRegistration}

    server.listen(StdioTransport::new()).await?;
    Ok(())
}
`;
}

export function generateRustFiles(serverCode, metadata, options = {}) {
  const cargoToml = `[package]\nname = "${toSnakeCase(options.serverName || metadata.title || 'rapidoc_mcp')}"\nversion = "0.1.0"\nedition = "2021"\n\n[dependencies]\nmcp-sdk = "0.1"\ntokio = { version = "1.0", features = ["full"] }\nreqwest = { version = "0.11", features = ["json"] }\nserde_json = "1.0"\nurlencoding = "2.1"\n`;
  const readme = `# ${metadata.title} - MCP Server (Rust)

Auto-generated by RapiDoc Curated MCP Generator.

### Prerequisites
- Rust & Cargo (1.75+)

### Building & Running
\`\`\`bash
cargo build --release
export API_KEY="your-api-key"
./target/release/${toSnakeCase(options.serverName || metadata.title || 'rapidoc_mcp')}
\`\`\`
`;

  return {
    'src/main.rs': serverCode,
    'Cargo.toml': cargoToml,
    'README.md': readme,
  };
}
