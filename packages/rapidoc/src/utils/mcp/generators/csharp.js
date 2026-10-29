/**
 * Single-file C# (.NET) MCP Server Generator
 * Uses ModelContextProtocol.NET and Semantic Kernel conventions.
 */
import { toPascalCase, toCamelCase, toSnakeCase, estimateTokenCost } from "../common.js";

export function generateCSharpMcpServer(metadata, tools, resources, workflows, options = {}) {
  const serverName = toPascalCase(options.serverName || metadata.title || "RapiDocMcpServer");
  const budget = estimateTokenCost(tools, resources, workflows);
  const defaultBaseUrl = metadata.servers?.[0]?.url || "http://localhost:3000";

  const toolMethods = tools
    .map((t) => {
      const csharpArgs = t.parameters.map((p) => {
        let csharpType = "string";
        if (p.type === "integer") csharpType = "int";
        else if (p.type === "number") csharpType = "double";
        else if (p.type === "boolean") csharpType = "bool";
        else if (p.type === "array") csharpType = "IEnumerable<string>";
        else if (p.type === "object") csharpType = "Dictionary<string, object>";
        const defaultVal = p.required ? "" : " = default";
        return `[Description(${JSON.stringify(p.description || "")})] ${csharpType} ${toCamelCase(p.name)}${defaultVal}`;
      });

      csharpArgs.push(
        '[Description("Optional Bearer API key override for multi-tenant sessions")] string apiKey = default',
      );

      const pathParams = t.parameters.filter((p) => p.in === "path");
      const safePathCode =
        pathParams.length > 0
          ? pathParams
              .map(
                (p) =>
                  `        var safe${toPascalCase(p.name)} = Uri.EscapeDataString(${toCamelCase(p.name)}?.ToString() ?? "");`,
              )
              .join("\n") + "\n"
          : "";

      const pathSub = t.path.replace(/\{([^}]+)\}/g, (match, p1) => `{safe${toPascalCase(p1)}}`);
      const queryParams = t.parameters.filter((p) => p.in === "query");
      const bodyParams = t.parameters.filter((p) => p.in === "body");
      const hasBody = ["POST", "PUT", "PATCH"].includes(t.method) && bodyParams.length > 0;

      const queryCode =
        queryParams.length > 0
          ? `        var queryParams = new List<string>();
${queryParams.map((p) => `        if (${toCamelCase(p.name)} != default) queryParams.Add("${p.name}=" + Uri.EscapeDataString(${toCamelCase(p.name)}.ToString()));`).join("\n")}
        var queryString = queryParams.Count > 0 ? "?" + string.Join("&", queryParams) : "";\n`
          : "";

      const urlExpr = queryParams.length > 0 ? `$"${pathSub}" + queryString` : `$"${pathSub}"`;

      const bodyCode = hasBody
        ? `        var bodyPayload = new Dictionary<string, object>();
${bodyParams.map((p) => `        if (${toCamelCase(p.name)} != default) bodyPayload["${p.name}"] = ${toCamelCase(p.name)};`).join("\n")}
        if (bodyPayload.Count > 0)
        {
            request.Content = new StringContent(JsonSerializer.Serialize(bodyPayload), System.Text.Encoding.UTF8, "application/json");
        }\n`
        : "";

      return `
    [McpTool("${t.name}", ${JSON.stringify(t.description)})]
    public static async Task<string> ${toPascalCase(t.name)}(${csharpArgs.join(", ")})
    {
        using var client = new HttpClient { BaseAddress = new Uri(BaseUrl.TrimEnd('/') + "/") };
        var resolvedKey = !string.IsNullOrEmpty(apiKey) ? apiKey : ApiKey;
        if (!string.IsNullOrEmpty(resolvedKey))
        {
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", resolvedKey);
        }
        client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
${safePathCode}${queryCode}        var request = new HttpRequestMessage(HttpMethod.${toPascalCase(t.method)}, ${urlExpr});
${t.parameters
  .filter((p) => p.in === "header")
  .map(
    (p) =>
      `        if (!string.IsNullOrEmpty(${toCamelCase(p.name)})) request.Headers.TryAddWithoutValidation("${p.name}", ${toCamelCase(p.name)});`,
  )
  .join("\n")}
${bodyCode}        var response = await client.SendAsync(request);
        return await response.Content.ReadAsStringAsync();
    }`;
    })
    .join("\n");

  const resourceMethods = resources
    .map((r) => {
      return `
    [McpResource("${r.uri}", "${r.name}", ${JSON.stringify(r.description)})]
    public static async Task<string> Get${toPascalCase(r.name)}(string uri = "")
    {
        using var client = new HttpClient { BaseAddress = new Uri(BaseUrl.TrimEnd('/') + "/") };
        var resolvedKey = ApiKey;
        var outboundQuery = HttpUtility.ParseQueryString(string.Empty);

        if (!string.IsNullOrEmpty(uri) && uri.Contains("?"))
        {
            var parsedUri = new Uri(uri);
            var incomingParams = HttpUtility.ParseQueryString(parsedUri.Query);

            var dynamicKey = incomingParams["apiKey"] ?? incomingParams["api_key"];
            if (!string.IsNullOrEmpty(dynamicKey)) resolvedKey = dynamicKey;

            foreach (string key in incomingParams)
            {
                if (key != null && !key.Equals("apikey", StringComparison.OrdinalIgnoreCase) && !key.Equals("api_key", StringComparison.OrdinalIgnoreCase))
                {
                    outboundQuery[key] = incomingParams[key];
                }
            }
        }

        if (!string.IsNullOrEmpty(resolvedKey)) client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", resolvedKey);
        client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("${r.mimeType || "application/json"}"));

        var targetPath = "${r.path}" + (outboundQuery.Count > 0 ? "?" + outboundQuery.ToString() : "");
        return await client.GetStringAsync(targetPath.TrimStart('/'));
    }`;
    })
    .join("\n");

  const workflowMethods = workflows
    .map((w) => {
      const paramKeys = w.parameters ? Object.keys(w.parameters) : [];
      const args = paramKeys
        .map(
          (k) =>
            `[Description(${JSON.stringify(w.parameters[k].description || "")})] string ${toCamelCase(k)}`,
        )
        .concat([
          '[Description("Optional Bearer API key override for multi-tenant sessions")] string apiKey = default',
        ])
        .join(", ");
      const argKey = paramKeys[0] || "id";

      return `
    [McpTool("${w.name}", ${JSON.stringify(w.description || "Composite workflow")})]
    public static async Task<string> ${toPascalCase(w.name)}(${args})
    {
        using var client = new HttpClient { BaseAddress = new Uri(BaseUrl.TrimEnd('/') + "/") };
        var resolvedKey = !string.IsNullOrEmpty(apiKey) ? apiKey : ApiKey;
        if (!string.IsNullOrEmpty(resolvedKey)) client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", resolvedKey);
        client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

        var results = new Dictionary<string, object>();
${(w.steps || [])
  .map(
    (s, idx) => `        // Step ${idx + 1}: ${s.call}
        var resp_${idx} = await client.GetStringAsync($"api/{Uri.EscapeDataString(${toCamelCase(argKey)} ?? "")}");
        results["${s.call}"] = JsonSerializer.Deserialize<object>(resp_${idx});`,
  )
  .join("\n")}

        return JsonSerializer.Serialize(results, new JsonSerializerOptions { WriteIndented = true });
    }`;
    })
    .join("\n");

  return `/*
Auto-generated by RapiDoc Curated MCP Generator
Spec: ${metadata.title} (v${metadata.version})

[MULTI-TENANCY & AUTHENTICATION]
- Local Stdio Mode: Claude Desktop, Cursor, and local agents use API_KEY from environment.
- Multi-Tenant / Agent Mode: When running in a shared service, the calling AI agent can pass
  per-session credentials directly in the \`apiKey\` parameter of any tool.

[TOKEN BUDGET DIAGNOSTIC]
- Total Tools: ${budget.totalTools}
- Total Resources: ${budget.totalResources}
- Total Workflows: ${budget.totalWorkflows}
- Estimated Prompt Context Overhead: ~${budget.estimatedTokens.toLocaleString()} tokens/turn
${budget.warnings.map((w) => `- ${w}`).join("\n")}

[HOW TO RUN]
1. dotnet restore
2. dotnet run
*/

using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Threading.Tasks;
using System.Web;
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
            ServerInfo = new() { Name = "${toSnakeCase(serverName)}", Version = "${metadata.version || "1.0.0"}" }
        });

        server.RegisterTools<Program>();
        server.RegisterResources<Program>();

        await server.StartAsync(Console.OpenStandardInput(), Console.OpenStandardOutput());
    }

${resourceMethods}
${toolMethods}
${workflowMethods}
}
`;
}

export function generateCSharpFiles(serverCode, metadata) {
  const csproj = `<Project Sdk="Microsoft.NET.Sdk">\n  <PropertyGroup>\n    <OutputType>Exe</OutputType>\n    <TargetFramework>net8.0</TargetFramework>\n    <ImplicitUsings>enable</ImplicitUsings>\n    <Nullable>enable</Nullable>\n  </PropertyGroup>\n  <ItemGroup>\n    <PackageReference Include="ModelContextProtocol.NET.Server" Version="1.0.0" />\n  </ItemGroup>\n</Project>\n`;
  const readme = `# ${metadata.title} - MCP Server (C# / .NET)

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

  return {
    "Program.cs": serverCode,
    "Server.csproj": csproj,
    "README.md": readme,
  };
}
