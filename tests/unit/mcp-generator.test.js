import { describe, it } from "node:test";
import assert from "node:assert";
import {
  toSnakeCase,
  deriveToolName,
  sanitizeDescription,
  extractMcpOperations,
  estimateTokenCost,
  generateHostConfigs,
  generateMcpServer,
  parseMcpTargets,
} from "../../packages/rapidoc/src/utils/mcp-generator.js";

describe("mcp-generator: string utilities", () => {
  it("converts diverse casing to clean snake_case", () => {
    assert.strictEqual(toSnakeCase("listCustomerInvoices"), "list_customer_invoices");
    assert.strictEqual(toSnakeCase("Get-User-By-Id"), "get_user_by_id");
    assert.strictEqual(toSnakeCase("orders_create_v2"), "orders_create_v2");
    assert.strictEqual(toSnakeCase("API/v1/orders/{orderId}"), "api_v1_orders_order_id");
  });

  it("derives semantic tool names from method and path", () => {
    assert.strictEqual(
      deriveToolName("get", "/customers/{customerId}/orders"),
      "get_customers_by_customer_id_orders",
    );
    assert.strictEqual(deriveToolName("post", "/orders"), "post_orders");
    assert.strictEqual(deriveToolName("delete", "/items/{id}"), "delete_items_by_id");
  });

  it("sanitizes markdown and HTML from prompt descriptions", () => {
    assert.strictEqual(
      sanitizeDescription("<b>Create an order</b> with [link](https://example.com) and `code`."),
      "Create an order with link and code.",
    );
  });
});

describe("mcp-generator: zero-config smart heuristics on raw OpenAPI specs", () => {
  const rawSpec = {
    openapi: "3.0.3",
    info: { title: "Store API", version: "1.2.0" },
    servers: [{ url: "https://api.store.com/v1" }],
    paths: {
      "/customers/{customerId}/orders": {
        get: {
          summary: "List customer orders",
          operationId: "listOrders",
          parameters: [
            { name: "customerId", in: "path", required: true, schema: { type: "string" } },
            {
              name: "status",
              in: "query",
              schema: { type: "string", enum: ["pending", "shipped"] },
            },
            { name: "Authorization", in: "header", required: true, schema: { type: "string" } },
            { name: "Cookie", in: "header", schema: { type: "string" } },
          ],
          responses: { 200: { description: "OK" } },
        },
      },
      "/currencies": {
        get: {
          summary: "Get supported currency codes",
          responses: { 200: { description: "List of currencies" } },
        },
      },
      "/deprecated-route": {
        get: {
          summary: "Old route",
          deprecated: true,
          responses: { 200: { description: "OK" } },
        },
      },
    },
  };

  it("strips transport/auth headers (Authorization, Cookie) from tool parameters", () => {
    const extracted = extractMcpOperations(rawSpec);
    const orderTool = extracted.tools.find((t) => t.name === "list_orders");
    assert.ok(orderTool, "Tool list_orders should exist");

    const paramNames = orderTool.parameters.map((p) => p.name.toLowerCase());
    assert.ok(paramNames.includes("customerid"));
    assert.ok(paramNames.includes("status"));
    assert.ok(!paramNames.includes("authorization"), "Authorization header must be stripped");
    assert.ok(!paramNames.includes("cookie"), "Cookie header must be stripped");
  });

  it("skips deprecated endpoints by default", () => {
    const extracted = extractMcpOperations(rawSpec);
    const oldTool = extracted.tools.find((t) => t.name.includes("deprecated"));
    assert.strictEqual(oldTool, undefined, "Deprecated endpoint must be excluded");
  });

  it("classifies static zero-parameter reference lookup as an MCP Resource", () => {
    const extracted = extractMcpOperations(rawSpec);
    const currencyResource = extracted.resources.find((r) => r.path === "/currencies");
    assert.ok(currencyResource, "Currency endpoint should be classified as a resource");
    assert.strictEqual(currencyResource.uri, "reference://currencies");
  });
});

describe("mcp-generator: vendor extensions & compatibility aliases", () => {
  const specWithExtensions = {
    openapi: "3.0.3",
    info: { title: "Enterprise Portal", version: "2.0.0" },
    paths: {
      "/orders": {
        post: {
          summary: "Create order",
          operationId: "createOrder",
          "x-mcp": {
            name: "place_customer_order",
            description: "Places a verified order for the customer.",
            requireConfirmation: true,
            parameters: {
              include: ["customerId", "items"],
              defaults: { priority: "standard" },
              descriptions: { customerId: "Target customer ID" },
            },
          },
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["customerId", "items"],
                  properties: {
                    customerId: { type: "string" },
                    items: { type: "array", items: { type: "string" } },
                    internalDebugToken: { type: "string" },
                  },
                },
              },
            },
          },
          responses: { 201: { description: "Created" } },
        },
      },
      "/admin/health": {
        get: {
          summary: "Internal health check",
          "x-internal": true,
          responses: { 200: { description: "OK" } },
        },
      },
      "/refunds": {
        post: {
          summary: "Process refund",
          "x-speakeasy-name-override": "issue_refund",
          "x-openai-isConsequential": true,
          responses: { 200: { description: "OK" } },
        },
      },
    },
    "x-mcp-workflows": [
      {
        name: "get_customer_summary",
        description: "Fetches customer and active orders",
        parameters: { customerId: { type: "string", description: "Customer UUID" } },
        steps: [
          { call: "getCustomer", args: { id: "$params.customerId" } },
          { call: "listOrders", args: { customerId: "$params.customerId" } },
        ],
      },
    ],
  };

  it("honors x-mcp parameter whitelisting and descriptions", () => {
    const extracted = extractMcpOperations(specWithExtensions);
    const orderTool = extracted.tools.find((t) => t.name === "place_customer_order");
    assert.ok(orderTool);
    assert.strictEqual(orderTool.description, "Places a verified order for the customer.");
    assert.strictEqual(orderTool.isConsequential, true);

    const paramNames = orderTool.parameters.map((p) => p.name);
    assert.deepStrictEqual(paramNames.sort(), ["customerId", "items"].sort());
    assert.ok(
      !paramNames.includes("internalDebugToken"),
      "internalDebugToken should be excluded by whitelist",
    );

    const customerIdParam = orderTool.parameters.find((p) => p.name === "customerId");
    assert.strictEqual(customerIdParam.description, "Target customer ID");
  });

  it("honors x-internal: true to exclude admin endpoints", () => {
    const extracted = extractMcpOperations(specWithExtensions);
    const adminTool = extracted.tools.find((t) => t.path === "/admin/health");
    assert.strictEqual(adminTool, undefined, "x-internal endpoint should be excluded");
  });

  it("honors x-speakeasy-name-override and x-openai-isConsequential aliases", () => {
    const extracted = extractMcpOperations(specWithExtensions);
    const refundTool = extracted.tools.find((t) => t.name === "issue_refund");
    assert.ok(refundTool, "Tool name override must be respected");
    assert.strictEqual(
      refundTool.isConsequential,
      true,
      "x-openai-isConsequential must set isConsequential",
    );
  });

  it("extracts root-level composite workflows", () => {
    const extracted = extractMcpOperations(specWithExtensions);
    assert.strictEqual(extracted.workflows.length, 1);
    assert.strictEqual(extracted.workflows[0].name, "get_customer_summary");
  });
});

describe("mcp-generator: token budget estimation", () => {
  it("calculates token budget and generates warnings for heavy tool counts", () => {
    const tools = [];
    for (let i = 0; i < 35; i++) {
      tools.push({
        name: `tool_${i}`,
        description: "A tool that performs some business operations in the system",
        parameters: [
          { name: "param1", description: "First parameter", type: "string" },
          { name: "param2", description: "Second parameter", type: "number" },
        ],
        isConsequential: i % 2 === 0,
      });
    }

    const budget = estimateTokenCost(tools, [], []);
    assert.strictEqual(budget.totalTools, 35);
    assert.ok(budget.estimatedTokens > 1000);
    assert.ok(budget.warnings.some((w) => w.includes("recommended limit of 30 tools")));
  });
});

describe("mcp-generator: TypeScript and Python code generation", () => {
  const spec = {
    openapi: "3.0.3",
    info: { title: "Order Service", version: "1.0.0" },
    servers: [{ url: "https://api.orders.example.com" }],
    paths: {
      "/orders/{id}": {
        get: {
          summary: "Get order by id",
          operationId: "getOrder",
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" } },
            { name: "includeDetails", in: "query", schema: { type: "boolean" } },
            { name: "tags", in: "query", schema: { type: "array" }, description: "Filter tags" },
            {
              name: "x-trace-id",
              in: "header",
              schema: { type: "string" },
              description: "Distributed tracing header",
            },
          ],
          responses: { 200: { description: "OK" } },
        },
      },
      "/orders": {
        post: {
          summary: "Create order",
          operationId: "createOrder",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["customerId"],
                  properties: {
                    customerId: { type: "string" },
                    amount: { type: "number" },
                  },
                },
              },
            },
          },
          responses: { 201: { description: "Created" } },
        },
      },
      "/shipping-tiers": {
        get: {
          summary: "Shipping tiers reference",
          "x-mcp": { type: "resource", uri: "reference://shipping-tiers" },
          responses: { 200: { description: "OK" } },
        },
      },
    },
    "x-mcp-workflows": [
      {
        name: "get_order_summary",
        description: "Fetches order and shipping in one call",
        parameters: { orderId: { type: "string", description: "Order ID" } },
        steps: [{ call: "getOrder" }],
      },
    ],
  };

  it("generates valid TypeScript server code with McpServer, Zod, query, body, and auth", () => {
    const pkg = generateMcpServer(spec, { target: "typescript" });
    assert.strictEqual(pkg.target, "typescript");
    assert.ok(pkg.serverCode.includes("@modelcontextprotocol/sdk/server/mcp.js"));
    assert.ok(pkg.serverCode.includes("import { z } from 'zod';"));
    assert.ok(pkg.serverCode.includes("server.tool("));
    assert.ok(pkg.serverCode.includes("get_order"));
    assert.ok(pkg.serverCode.includes("create_order"));
    assert.ok(pkg.serverCode.includes('queryParams.set("includeDetails"'));
    assert.ok(pkg.serverCode.includes('bodyPayload["customerId"] = args["customerId"]'));
    assert.ok(
      pkg.serverCode.includes('headers["x-trace-id"] = String(args["x-trace-id"])'),
      "Should forward x-trace-id header in TypeScript",
    );
    assert.ok(
      pkg.serverCode.includes("new URL(`${BASE_URL.replace(/\\/$/, '')}"),
      "Should safely build targetUrl using new URL and strip trailing slashes",
    );
    assert.ok(
      pkg.serverCode.includes('encodeURIComponent(args["id"])'),
      "Should safely encode path variables with encodeURIComponent in TypeScript",
    );
    assert.ok(pkg.serverCode.includes("const resolvedKey = args?.apiKey || API_KEY"));
    assert.ok(pkg.serverCode.includes("server.resource("));
    assert.ok(pkg.serverCode.includes("reference://shipping-tiers"));
    assert.ok(
      pkg.serverCode.includes("targetUrl.searchParams.set(key, val);"),
      "Should propagate query params in TS resource handler",
    );
    assert.ok(pkg.serverCode.includes("get_order_summary"));
    assert.ok(pkg.serverCode.includes("StdioServerTransport"));
    assert.ok(pkg.files["package.json"]);
    assert.ok(pkg.files["claude_desktop_config.json"]);
  });

  it("generates valid Python FastMCP server code with requirements.txt, zero-dependency HTTP, query, and body", () => {
    const pkg = generateMcpServer(spec, { target: "python" });
    assert.strictEqual(pkg.target, "python");
    assert.ok(pkg.serverCode.includes("from fastmcp import FastMCP"));
    assert.ok(pkg.serverCode.includes("import urllib.request"));
    assert.ok(
      !pkg.serverCode.includes("httpx"),
      "Should use built-in urllib instead of 3rd party httpx",
    );
    assert.ok(
      !pkg.serverCode.includes("requests"),
      "Should use built-in urllib instead of 3rd party requests",
    );
    assert.ok(pkg.serverCode.includes("@mcp.tool("));
    assert.ok(pkg.serverCode.includes("def get_order("));
    assert.ok(pkg.serverCode.includes("def create_order("));
    assert.ok(pkg.serverCode.includes('params["includeDetails"] = include_details'));
    assert.ok(pkg.serverCode.includes('body_payload["customerId"] = customer_id'));
    assert.ok(
      pkg.serverCode.includes('headers["x-trace-id"] = str(x_trace_id)'),
      "Should forward x-trace-id header in Python",
    );
    assert.ok(
      pkg.serverCode.includes("url = f\"{BASE_URL.rstrip('/')}"),
      "Should strip trailing slashes from BASE_URL in Python",
    );
    assert.ok(pkg.serverCode.includes("resolved_key = api_key or API_KEY"));
    assert.ok(
      pkg.serverCode.includes("safe_id = urllib.parse.quote(str(id))"),
      "Should sanitize path parameter with urllib.parse.quote",
    );
    assert.ok(pkg.serverCode.includes("{safe_id}"), "Should bind safe escaped path variable");
    assert.ok(pkg.serverCode.includes("@mcp.resource("));
    assert.ok(pkg.serverCode.includes("reference://shipping-tiers"));
    assert.ok(
      pkg.serverCode.includes('(uri: str = "") -> str:'),
      "Should accept uri string context in FastMCP resource callback",
    );
    assert.ok(
      pkg.serverCode.includes('parsed_query.get("apiKey") or parsed_query.get("api_key")'),
      "Should extract dynamic auth key from resource URI",
    );
    assert.ok(
      pkg.serverCode.includes('k.lower() not in ["apikey", "api_key"]'),
      "Should forward non-auth query parameters to downstream resource",
    );
    assert.ok(
      pkg.serverCode.includes("def get_order_summary("),
      "Should generate composite workflow function",
    );
    assert.ok(pkg.files["server.py"]);
    assert.ok(pkg.files["requirements.txt"]);
    assert.strictEqual(pkg.files["requirements.txt"].trim(), "fastmcp>=0.4.0");
    assert.ok(pkg.files["README.md"].includes("pip install -r requirements.txt"));
  });

  it("generates valid Go server code with mark3labs/mcp-go, query, body, and auth", () => {
    const pkg = generateMcpServer(spec, { target: "go" });
    assert.strictEqual(pkg.target, "go");
    assert.ok(pkg.serverCode.includes("github.com/mark3labs/mcp-go/mcp"));
    assert.ok(pkg.serverCode.includes('s.AddTool(mcp.NewTool("get_order"'));
    assert.ok(pkg.serverCode.includes('s.AddTool(mcp.NewTool("create_order"'));
    assert.ok(
      pkg.serverCode.includes(
        "func(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {",
      ),
      "Should generate valid, complete tool callback signature in Go",
    );
    assert.ok(
      pkg.serverCode.includes('url.PathEscape(fmt.Sprintf("%v", args["id"]))'),
      "Should escape path parameters using url.PathEscape in Go",
    );
    assert.ok(
      pkg.serverCode.includes('mcp.WithList("tags", mcp.Description("Filter tags"))'),
      "Should map array parameter to mcp.WithList in Go",
    );
    assert.ok(pkg.serverCode.includes("queryParams := url.Values{}"));
    assert.ok(pkg.serverCode.includes('queryParams.Set("includeDetails"'));
    assert.ok(pkg.serverCode.includes('bodyPayload["customerId"] = v'));
    assert.ok(
      pkg.serverCode.includes('req.Header.Set("x-trace-id", fmt.Sprintf("%v", v))'),
      "Should forward x-trace-id header in Go",
    );
    assert.ok(
      pkg.serverCode.includes('strings.TrimRight(baseURL, "/")'),
      "Should strip trailing slashes from baseURL in Go",
    );
    assert.ok(pkg.serverCode.includes("resolvedKey := apiKey"));
    assert.ok(
      pkg.serverCode.includes('s.AddResource(mcp.NewResource("reference://shipping-tiers"'),
    );
    assert.ok(
      pkg.serverCode.includes("if incomingURL, err := url.Parse(request.Params.URI); err == nil {"),
      "Should parse incoming request.Params.URI in Go resource callback",
    );
    assert.ok(
      pkg.serverCode.includes('passedKey := q.Get("apiKey")'),
      "Should extract dynamic apiKey from query params in Go resource",
    );
    assert.ok(
      pkg.serverCode.includes("targetQuery.Set(k, v[0])"),
      "Should forward non-auth query parameters downstream in Go resource",
    );
    assert.ok(pkg.serverCode.includes('s.AddTool(mcp.NewTool("get_order_summary"'));
    assert.ok(pkg.files["main.go"]);
    assert.ok(pkg.files["go.mod"]);
    assert.ok(pkg.files["go.mod"].includes("github.com/mark3labs/mcp-go"));
    assert.ok(pkg.files["README.md"].includes("go mod tidy"));
  });

  it("generates valid C# (.NET) server code with query, body, workflows, and multi-tenancy", () => {
    const pkg = generateMcpServer(spec, { target: "csharp" });
    assert.strictEqual(pkg.target, "csharp");
    assert.ok(pkg.serverCode.includes("ModelContextProtocol.NET.Server"));
    assert.ok(
      pkg.serverCode.includes("using System.Web;"),
      "Should include System.Web for query parsing",
    );
    assert.ok(pkg.serverCode.includes('[McpTool("get_order"'));
    assert.ok(pkg.serverCode.includes('[McpTool("create_order"'));
    assert.ok(
      pkg.serverCode.includes('var safeId = Uri.EscapeDataString(id?.ToString() ?? "");'),
      "Should sanitize path parameters with Uri.EscapeDataString in C#",
    );
    assert.ok(
      pkg.serverCode.includes("IEnumerable<string> tags = default"),
      "Should map array parameters to IEnumerable<string> in C#",
    );
    assert.ok(pkg.serverCode.includes("var queryParams = new List<string>();"));
    assert.ok(pkg.serverCode.includes("var bodyPayload = new Dictionary<string, object>();"));
    assert.ok(pkg.serverCode.includes("StringContent(JsonSerializer.Serialize(bodyPayload)"));
    assert.ok(
      pkg.serverCode.includes('request.Headers.TryAddWithoutValidation("x-trace-id", xTraceId)'),
      "Should forward x-trace-id header in C#",
    );
    assert.ok(
      pkg.serverCode.includes("BaseUrl.TrimEnd('/')"),
      "Should strip trailing slashes from BaseUrl in C#",
    );
    assert.ok(
      pkg.serverCode.includes("var resolvedKey = !string.IsNullOrEmpty(apiKey) ? apiKey : ApiKey;"),
    );
    assert.ok(pkg.serverCode.includes('[McpResource("reference://shipping-tiers"'));
    assert.ok(
      pkg.serverCode.includes('GetShippingTiers(string uri = "")'),
      "Should accept uri parameter in C# resource method",
    );
    assert.ok(
      pkg.serverCode.includes(
        'var dynamicKey = incomingParams["apiKey"] ?? incomingParams["api_key"]',
      ),
      "Should extract dynamic auth key from resource URI in C#",
    );
    assert.ok(
      pkg.serverCode.includes("outboundQuery[key] = incomingParams[key]"),
      "Should mirror non-auth parameters downstream in C# resource",
    );
    assert.ok(pkg.serverCode.includes('[McpTool("get_order_summary"'));
    assert.ok(pkg.files["Program.cs"]);
    assert.ok(pkg.files["Server.csproj"]);
    assert.ok(pkg.files["README.md"].includes("dotnet run"));
  });

  it("generates valid Rust server code with query, body, workflows, and multi-tenancy", () => {
    const pkg = generateMcpServer(spec, { target: "rust" });
    assert.strictEqual(pkg.target, "rust");
    assert.ok(pkg.serverCode.includes("mcp_sdk::server"));
    assert.ok(pkg.serverCode.includes('"get_order" => {'));
    assert.ok(pkg.serverCode.includes('"create_order" => {'));
    assert.ok(
      pkg.serverCode.includes("urlencoding::encode"),
      "Should escape path parameters with urlencoding::encode in Rust",
    );
    assert.ok(pkg.serverCode.includes("let mut query_params: Vec<(&str, String)> = Vec::new();"));
    assert.ok(pkg.serverCode.includes("req = req.query(&query_params);"));
    assert.ok(pkg.serverCode.includes("let mut body_map = serde_json::Map::new();"));
    assert.ok(pkg.serverCode.includes("req = req.json(&body_map);"));
    assert.ok(
      pkg.serverCode.includes('req = req.header("x-trace-id", h)'),
      "Should forward x-trace-id header in Rust",
    );
    assert.ok(
      pkg.serverCode.includes("base_url.trim_end_matches('/')"),
      "Should strip trailing slashes from base_url in Rust",
    );
    assert.ok(pkg.serverCode.includes('let resolved_key = args.get("api_key")'));
    assert.ok(pkg.serverCode.includes('"get_order_summary" => {'));
    assert.ok(pkg.serverCode.includes('"reference://shipping-tiers" => {'));
    assert.ok(
      pkg.serverCode.includes("uri.split_once('?')"),
      "Should split resource URI on query boundary in Rust",
    );
    assert.ok(
      pkg.serverCode.includes("resolved_key = Some(v.to_string())"),
      "Should dynamically extract auth key from resource URI in Rust",
    );
    assert.ok(
      pkg.serverCode.includes("server.add_tool("),
      "Should register tools with server.add_tool in Rust",
    );
    assert.ok(
      pkg.serverCode.includes('.property("tags", "array"'),
      "Should register array schema property in Rust",
    );
    assert.ok(
      pkg.serverCode.includes("ToolResponse::error("),
      "Should gracefully catch errors without crashing in Rust",
    );
    assert.ok(pkg.files["src/main.rs"]);
    assert.ok(pkg.files["Cargo.toml"]);
    assert.ok(
      pkg.files["Cargo.toml"].includes('urlencoding = "2.1"'),
      "Should declare urlencoding dependency in Cargo.toml",
    );
    assert.ok(pkg.files["README.md"].includes("cargo build --release"));
  });

  it("generates valid Java Spring AI server code with pom.xml, records, and zero broken String.format", () => {
    const pkg = generateMcpServer(spec, { target: "java" });
    assert.strictEqual(pkg.target, "java");
    assert.ok(pkg.serverCode.includes("org.springframework.boot"));
    assert.ok(pkg.serverCode.includes("@SpringBootApplication"));
    assert.ok(
      pkg.serverCode.includes("public record GetOrderRequest"),
      "Should generate typed Java record for tool arguments",
    );
    assert.ok(
      pkg.serverCode.includes("public record CreateOrderRequest"),
      "Should generate typed Java record for POST tool arguments",
    );
    assert.ok(
      pkg.serverCode.includes('@JsonPropertyDescription("id")'),
      "Should annotate record fields with @JsonPropertyDescription",
    );
    assert.ok(
      pkg.serverCode.includes('@JsonPropertyDescription("Distributed tracing header")'),
      "Should expose tracing header in record fields",
    );
    assert.ok(
      pkg.serverCode.includes("Function<GetOrderRequest, String> getOrder()"),
      "Should use strongly typed record in Function bean",
    );
    assert.ok(pkg.serverCode.includes("Function<CreateOrderRequest, String> createOrder()"));
    assert.ok(
      !pkg.serverCode.includes('String.format("%s/orders/%s", baseUrl)'),
      "Must not generate broken String.format missing path arguments",
    );
    assert.ok(
      pkg.serverCode.includes("UriUtils.encodePath"),
      "Should use UriUtils.encodePath for path parameter binding",
    );
    assert.ok(
      pkg.serverCode.includes("UriComponentsBuilder.fromUriString"),
      "Should build URIs using UriComponentsBuilder",
    );
    assert.ok(pkg.serverCode.includes('uriBuilder.queryParam("includeDetails"'));
    assert.ok(
      pkg.serverCode.includes('spec.header("x-trace-id", String.valueOf(request.xTraceId()))'),
      "Should forward x-trace-id header parameter to RestClient",
    );
    assert.ok(pkg.serverCode.includes(".body(bodyPayload)"));
    assert.ok(pkg.serverCode.includes("getOrderSummary()"));
    assert.ok(
      pkg.serverCode.includes("Function<Map<String, Object>, String> getShippingTiers()"),
      "Should use standard Map<String, Object> compatible with Spring AI resource routing",
    );
    assert.ok(
      pkg.serverCode.includes('@JsonProperty("x-trace-id")'),
      "Should annotate header parameter with explicit @JsonProperty wire name",
    );
    assert.ok(
      pkg.serverCode.includes('@JsonProperty(value = "id", required = true)'),
      "Should annotate required parameter with explicit @JsonProperty wire name",
    );
    assert.ok(
      pkg.serverCode.includes(
        'Description("Resource: get_shipping_tiers (reference://shipping-tiers{?apiKey,api_key})")',
      ),
      "Should expose RFC 6570 URI template in resource description",
    );
    assert.ok(
      pkg.serverCode.includes('args.containsKey("apiKey")'),
      "Should extract session apiKey from URI query parameters map",
    );
    assert.ok(
      pkg.serverCode.includes(
        "UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromUriString(this.baseUrl);",
      ),
      "Should use UriComponentsBuilder for resources",
    );
    assert.ok(
      pkg.serverCode.includes('uriBuilder.path("/shipping-tiers");'),
      "Should independently bind path to UriComponentsBuilder for safe normalization",
    );
    assert.ok(
      pkg.serverCode.includes("uriBuilder.queryParam(key, value);"),
      "Should forward client query variables to outbound resource URL",
    );
    assert.ok(
      !pkg.serverCode.includes('this.baseUrl + "/shipping-tiers"'),
      "Must not use direct string concatenation for resource URIs",
    );
    assert.ok(
      !pkg.serverCode.includes("private final ObjectMapper objectMapper = new ObjectMapper();"),
      "Class must not define dead ObjectMapper field",
    );
    assert.ok(pkg.files["src/main/java/com/rapidoc/mcp/RapiDocMcpServer.java"]);
    assert.ok(pkg.files["pom.xml"]);
    assert.ok(pkg.files["README.md"].includes("./mvnw spring-boot:run"));
  });

  it("omits ObjectMapper completely when no workflows exist in Java", () => {
    const specWithoutWorkflows = {
      openapi: "3.0.3",
      info: { title: "Simple API", version: "1.0.0" },
      paths: {
        "/items": {
          get: {
            summary: "List items",
            operationId: "listItems",
            responses: { 200: { description: "OK" } },
          },
        },
        "/info": {
          get: {
            summary: "App info",
            "x-mcp": { type: "resource", uri: "reference://info" },
            responses: { 200: { description: "OK" } },
          },
        },
      },
    };
    const pkg = generateMcpServer(specWithoutWorkflows, { target: "java" });
    assert.ok(
      !pkg.serverCode.includes("ObjectMapper"),
      "Must not import or instantiate ObjectMapper when there are no workflows",
    );
    assert.ok(
      pkg.serverCode.includes("Function<Map<String, Object>, String> getInfo()"),
      "Should use standard resource routing",
    );
    assert.ok(
      pkg.serverCode.includes('args.containsKey("apiKey")'),
      "Should support dynamic apiKey in resource via URI query params",
    );
  });

  it("generates host configuration snippets for Claude Desktop and Cursor", () => {
    const configs = generateHostConfigs("my_store_api", { target: "typescript" });
    const parsedClaude = JSON.parse(configs.claudeDesktopConfig);
    assert.ok(parsedClaude.mcpServers.my_store_api);
    assert.strictEqual(parsedClaude.mcpServers.my_store_api.command, "npx");

    const goConfigs = generateHostConfigs("my_store_api", { target: "go" });
    const parsedGo = JSON.parse(goConfigs.claudeDesktopConfig);
    assert.strictEqual(parsedGo.mcpServers.my_store_api.command, "./my_store_api");
  });
});

describe("mcp-generator: parseMcpTargets attribute normalization and kill-switch", () => {
  it("parses a single language string", () => {
    assert.deepStrictEqual(parseMcpTargets("python"), ["python"]);
    assert.deepStrictEqual(parseMcpTargets("typescript"), ["typescript"]);
  });

  it("parses comma-separated string with whitespace and mixed casing", () => {
    assert.deepStrictEqual(parseMcpTargets(" TypeScript , Python , GO "), [
      "typescript",
      "python",
      "go",
    ]);
  });

  it("parses JavaScript arrays and JSON string arrays", () => {
    assert.deepStrictEqual(parseMcpTargets(["go", "rust", "java"]), ["go", "rust", "java"]);
    assert.deepStrictEqual(parseMcpTargets('["typescript", "csharp"]'), ["typescript", "csharp"]);
  });

  it('maps "c#" alias to "csharp"', () => {
    assert.deepStrictEqual(parseMcpTargets("c#, rust"), ["csharp", "rust"]);
    assert.deepStrictEqual(parseMcpTargets(["c#"]), ["csharp"]);
  });

  it('kills all targets if "none" is specified alone or mixed in list/array', () => {
    assert.deepStrictEqual(parseMcpTargets("none"), []);
    assert.deepStrictEqual(parseMcpTargets("NONE"), []);
    assert.deepStrictEqual(parseMcpTargets("none, python, go"), []);
    assert.deepStrictEqual(parseMcpTargets("typescript, none"), []);
    assert.deepStrictEqual(parseMcpTargets(["none", "python"]), []);
    assert.deepStrictEqual(parseMcpTargets(["typescript", "none", "go"]), []);
  });

  it('kills all targets if boolean false or "false" is provided', () => {
    assert.deepStrictEqual(parseMcpTargets(false), []);
    assert.deepStrictEqual(parseMcpTargets("false"), []);
    assert.deepStrictEqual(parseMcpTargets("false, python"), []);
    assert.deepStrictEqual(parseMcpTargets(["false", "go"]), []);
  });

  it("returns empty array for falsy, empty or unconfigured inputs", () => {
    assert.deepStrictEqual(parseMcpTargets(""), []);
    assert.deepStrictEqual(parseMcpTargets("   "), []);
    assert.deepStrictEqual(parseMcpTargets(null), []);
    assert.deepStrictEqual(parseMcpTargets(undefined), []);
  });

  it("discards unknown targets and wildcards without throwing", () => {
    assert.deepStrictEqual(parseMcpTargets("typescript, php, ruby, *"), ["typescript"]);
    assert.deepStrictEqual(parseMcpTargets(["all", "python"]), ["python"]);
  });

  it("deduplicates targets in the returned array", () => {
    assert.deepStrictEqual(parseMcpTargets("python, python, go, python"), ["python", "go"]);
    assert.deepStrictEqual(parseMcpTargets(["go", "go", "rust"]), ["go", "rust"]);
  });
});
