/**
 * Single-file Java / Spring AI MCP Server Generator
 * Uses Spring AI MCP annotations, strongly typed records, and RestClient.
 */
import { toPascalCase, toCamelCase, estimateTokenCost } from "../common.js";

/**
 * Helper to map OpenAPI / JSON schema parameter type to idiomatic Java type.
 */
function toJavaType(p) {
  if (p.type === "integer") return "Integer";
  if (p.type === "number") return "Double";
  if (p.type === "boolean") return "Boolean";
  if (p.type === "array") return "java.util.List<String>";
  if (p.type === "object") return "java.util.Map<String, Object>";
  return "String";
}

export function generateJavaMcpServer(metadata, tools, resources, workflows, options = {}) {
  const className = toPascalCase(options.serverName || "RapiDocMcpServer");
  const budget = estimateTokenCost(tools, resources, workflows);
  const defaultBaseUrl = metadata.servers?.[0]?.url || "http://localhost:3000";

  const toolRecords = [];
  const toolBeans = tools
    .map((t) => {
      const recordName = `${toPascalCase(t.name)}Request`;
      const pathParams = t.parameters.filter((p) => p.in === "path");
      const queryParams = t.parameters.filter((p) => p.in === "query");
      const headerParams = t.parameters.filter((p) => p.in === "header");
      const bodyParams = t.parameters.filter((p) => p.in === "body");

      // 1. Build typed request record
      const recordFields = t.parameters.map((p) => {
        const desc = `        @JsonPropertyDescription(${JSON.stringify(p.description || p.name)})\n`;
        const propAnno = p.required
          ? `        @JsonProperty(value = ${JSON.stringify(p.name)}, required = true)\n`
          : `        @JsonProperty(${JSON.stringify(p.name)})\n`;
        return `${desc}${propAnno}        ${toJavaType(p)} ${toCamelCase(p.name)}`;
      });
      // Always provide per-session dynamic auth override field for multi-tenancy
      recordFields.push(
        '        @JsonPropertyDescription("Optional Bearer API key override for multi-tenant sessions")\n        @JsonProperty("apiKey")\n        String apiKey',
      );

      toolRecords.push(`    @JsonClassDescription(${JSON.stringify(t.description || t.name)})
    public record ${recordName}(
${recordFields.join(",\n")}
    ) {}`);

      // 2. Build Bean function
      const pathReplacements = pathParams
        .map(
          (p) =>
            `                .replace("{${p.name}}", request.${toCamelCase(p.name)}() != null ? UriUtils.encodePath(String.valueOf(request.${toCamelCase(p.name)}()), StandardCharsets.UTF_8) : "")`,
        )
        .join("\n");

      const queryAppends = queryParams
        .map(
          (p) =>
            `            if (request.${toCamelCase(p.name)}() != null) uriBuilder.queryParam("${p.name}", request.${toCamelCase(p.name)}());`,
        )
        .join("\n");

      const headerAppends = headerParams
        .map(
          (p) =>
            `                if (request.${toCamelCase(p.name)}() != null && !String.valueOf(request.${toCamelCase(p.name)}()).isBlank()) {\n                    spec.header("${p.name}", String.valueOf(request.${toCamelCase(p.name)}()));\n                }`,
        )
        .join("\n");

      const hasBody = ["POST", "PUT", "PATCH"].includes(t.method) && bodyParams.length > 0;
      const bodyAppends = hasBody
        ? `            Map<String, Object> bodyPayload = new java.util.LinkedHashMap<>();
${bodyParams
  .map(
    (p) =>
      `            if (request.${toCamelCase(p.name)}() != null) bodyPayload.put("${p.name}", request.${toCamelCase(p.name)}());`,
  )
  .join("\n")}`
        : "";

      return `    // Tool: ${t.name} (${t.method} ${t.path})
    // ${t.isConsequential ? "⚠️ Consequential/Destructive action" : "Safe/Read-only action"}
    @Bean
    @Description(${JSON.stringify(t.description + (t.isConsequential ? " (Requires confirmation)" : ""))})
    public Function<${recordName}, String> ${toCamelCase(t.name)}() {
        return request -> {
            String resolvedKey = request.apiKey() != null && !request.apiKey().isBlank() ? request.apiKey() : this.apiKey;
            String resolvedPath = "${t.path}"${pathReplacements ? "\n" + pathReplacements : ""};
            // Spring's builder automatically normalizes matching slashes between baseUrl and paths
            UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromUriString(this.baseUrl);
            uriBuilder.path(resolvedPath);
${queryAppends ? queryAppends + "\n" : ""}${bodyAppends ? bodyAppends + "\n" : ""}            try {
                RestClient.RequestBodySpec spec = restClient.method(HttpMethod.${t.method})
                    .uri(uriBuilder.build().toUri())
                    .accept(MediaType.APPLICATION_JSON);
                if (resolvedKey != null && !resolvedKey.isBlank()) {
                    spec.header("Authorization", "Bearer " + resolvedKey);
                }
${headerAppends ? headerAppends + "\n" : ""}${
        hasBody
          ? `                if (!bodyPayload.isEmpty()) {
                    spec.contentType(MediaType.APPLICATION_JSON).body(bodyPayload);
                }\n`
          : ""
      }                return spec.retrieve().body(String.class);
            } catch (Exception e) {
                return "Error invoking ${t.name}: " + e.getMessage();
            }
        };
    }`;
    })
    .join("\n\n");

  const hasWorkflows = workflows.length > 0;

  const resourceBeans = resources
    .map((r) => {
      const uriTemplate = `${r.uri}{?apiKey,api_key}`;
      return `    // Resource: ${r.name} (${uriTemplate})
    @Bean
    @Description(${JSON.stringify(`Resource: ${r.name} (${uriTemplate})`)})
    public Function<Map<String, Object>, String> ${toCamelCase(r.name)}() {
        return args -> {
            String resolvedKey = this.apiKey;
            if (args != null && args.containsKey("apiKey") && args.get("apiKey") != null) {
                String passedKey = String.valueOf(args.get("apiKey"));
                if (!passedKey.isBlank()) {
                    resolvedKey = passedKey;
                }
            } else if (args != null && args.containsKey("api_key") && args.get("api_key") != null) {
                String passedKey = String.valueOf(args.get("api_key"));
                if (!passedKey.isBlank()) {
                    resolvedKey = passedKey;
                }
            }

            // Spring's builder automatically normalizes matching slashes between baseUrl and paths
            UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromUriString(this.baseUrl);
            uriBuilder.path("${r.path}");
            if (args != null) {
                args.forEach((key, value) -> {
                    if (!"apiKey".equalsIgnoreCase(key) && !"api_key".equalsIgnoreCase(key) && value != null) {
                        uriBuilder.queryParam(key, value);
                    }
                });
            }
            try {
                RestClient.RequestHeadersSpec<?> spec = restClient.get()
                    .uri(uriBuilder.build().toUri())
                    .accept(MediaType.parseMediaType("${r.mimeType || "application/json"}"));
                if (resolvedKey != null && !resolvedKey.isBlank()) {
                    spec.header("Authorization", "Bearer " + resolvedKey);
                }
                return spec.retrieve().body(String.class);
            } catch (Exception e) {
                return "Error loading resource: " + e.getMessage();
            }
        };
    }`;
    })
    .join("\n\n");

  const workflowBeans = workflows
    .map((w) => {
      const recordName = `${toPascalCase(w.name)}Request`;
      const paramKeys = w.parameters ? Object.keys(w.parameters) : [];
      const recordFields = paramKeys.map(
        (k) =>
          `        @JsonPropertyDescription(${JSON.stringify(w.parameters[k].description || "")})\n        @JsonProperty(required = true)\n        String ${toCamelCase(k)}`,
      );
      recordFields.push(
        '        @JsonPropertyDescription("Optional Bearer API key override for multi-tenant sessions")\n        String apiKey',
      );

      toolRecords.push(`    @JsonClassDescription(${JSON.stringify(w.description || "Composite workflow")})
    public record ${recordName}(
${recordFields.join(",\n")}
    ) {}`);

      const firstParam = paramKeys[0] || "id";

      return `    // Composite Workflow: ${w.name}
    @Bean
    @Description(${JSON.stringify(w.description || "Composite workflow")})
    public Function<${recordName}, String> ${toCamelCase(w.name)}() {
        return request -> {
            String resolvedKey = request.apiKey() != null && !request.apiKey().isBlank() ? request.apiKey() : this.apiKey;
            Map<String, Object> results = new java.util.LinkedHashMap<>();
            ObjectMapper mapper = new ObjectMapper();
            try {
${(w.steps || [])
  .map((s, idx) => {
    return `                // Step ${idx + 1}: ${s.call}
                UriComponentsBuilder stepUri_${idx} = UriComponentsBuilder.fromUriString(this.baseUrl);
                stepUri_${idx}.path("/api/" + UriUtils.encodePath(String.valueOf(request.${toCamelCase(firstParam)}()), StandardCharsets.UTF_8));
                RestClient.RequestHeadersSpec<?> stepSpec_${idx} = restClient.get().uri(stepUri_${idx}.build().toUri()).accept(MediaType.APPLICATION_JSON);
                if (resolvedKey != null && !resolvedKey.isBlank()) { stepSpec_${idx}.header("Authorization", "Bearer " + resolvedKey); }
                String stepBody_${idx} = stepSpec_${idx}.retrieve().body(String.class);
                try {
                    results.put("${s.call}", mapper.readValue(stepBody_${idx}, Object.class));
                } catch (Exception parseEx) {
                    results.put("${s.call}", stepBody_${idx});
                }`;
  })
  .join("\n")}
                return mapper.writerWithDefaultPrettyPrinter().writeValueAsString(results);
            } catch (Exception e) {
                return "Workflow ${w.name} failed: " + e.getMessage();
            }
        };
    }`;
    })
    .join("\n\n");

  return `/*
Auto-generated by RapiDoc Curated MCP Generator
Spec: ${metadata.title} (v${metadata.version})

[MULTI-TENANCY & AUTHENTICATION]
- Local Stdio Mode: Runs locally (e.g. Claude Desktop, Cursor). Uses \`API_KEY\` from environment.
- Multi-Tenant / Agent Mode: When running in a shared service, the calling AI agent can pass
  per-session credentials directly in the \`apiKey\` request field of any tool record.

[TOKEN BUDGET DIAGNOSTIC]
- Total Tools: ${budget.totalTools}
- Total Resources: ${budget.totalResources}
- Total Workflows: ${budget.totalWorkflows}
- Estimated Prompt Context Overhead: ~${budget.estimatedTokens.toLocaleString()} tokens/turn
${budget.warnings.map((w) => `- ${w}`).join("\n")}

[HOW TO RUN]
1. export API_KEY="your-api-key"
2. ./mvnw spring-boot:run
*/

package com.rapidoc.mcp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Description;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.web.util.UriUtils;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyDescription;
import com.fasterxml.jackson.annotation.JsonClassDescription;
${hasWorkflows ? "import com.fasterxml.jackson.databind.ObjectMapper;\n" : ""}
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.function.Function;

@SpringBootApplication
public class ${className} {

    private final String baseUrl = System.getenv().getOrDefault("API_BASE_URL", "${defaultBaseUrl}");
    private final String apiKey = System.getenv().getOrDefault("API_KEY", "");
    private final RestClient restClient = RestClient.builder().build();

    public static void main(String[] args) {
        SpringApplication.run(${className}.class, args);
    }

    // ==========================================
    // TOOL REQUEST RECORDS (Strongly Typed for Spring AI MCP)
    // ==========================================
${toolRecords.join("\n\n")}

    // ==========================================
    // MCP TOOLS (@Bean Function Callbacks)
    // ==========================================
${toolBeans}
${resourceBeans ? "\n    // ==========================================\n    // MCP RESOURCES\n    // ==========================================\n" + resourceBeans : ""}
${workflowBeans ? "\n    // ==========================================\n    // COMPOSITE WORKFLOWS\n    // ==========================================\n" + workflowBeans : ""}
}
`;
}

export function generateJavaFiles(serverCode, metadata) {
  const pomXml = `<?xml version="1.0" encoding="UTF-8"?>
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

  const readme = `# ${metadata.title} - MCP Server (Java Spring AI)

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

  return {
    "src/main/java/com/rapidoc/mcp/RapiDocMcpServer.java": serverCode,
    "pom.xml": pomXml,
    "README.md": readme,
  };
}
