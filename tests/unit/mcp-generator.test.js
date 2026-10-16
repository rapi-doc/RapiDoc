import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  toSnakeCase,
  deriveToolName,
  sanitizeDescription,
  extractMcpOperations,
  estimateTokenCost,
  generateTypeScriptMcpServer,
  generatePythonFastMcpServer,
  generateHostConfigs,
  generateMcpServer,
  parseMcpTargets,
  VALID_MCP_TARGETS,
  MCP_TARGET_LABELS,
} from '../../packages/rapidoc/src/utils/mcp-generator.js';

describe('mcp-generator: string utilities', () => {
  it('converts diverse casing to clean snake_case', () => {
    assert.strictEqual(toSnakeCase('listCustomerInvoices'), 'list_customer_invoices');
    assert.strictEqual(toSnakeCase('Get-User-By-Id'), 'get_user_by_id');
    assert.strictEqual(toSnakeCase('orders_create_v2'), 'orders_create_v2');
    assert.strictEqual(toSnakeCase('API/v1/orders/{orderId}'), 'api_v1_orders_order_id');
  });

  it('derives semantic tool names from method and path', () => {
    assert.strictEqual(deriveToolName('get', '/customers/{customerId}/orders'), 'get_customers_by_customer_id_orders');
    assert.strictEqual(deriveToolName('post', '/orders'), 'post_orders');
    assert.strictEqual(deriveToolName('delete', '/items/{id}'), 'delete_items_by_id');
  });

  it('sanitizes markdown and HTML from prompt descriptions', () => {
    assert.strictEqual(
      sanitizeDescription('<b>Create an order</b> with [link](https://example.com) and `code`.'),
      'Create an order with link and code.'
    );
  });
});

describe('mcp-generator: zero-config smart heuristics on raw OpenAPI specs', () => {
  const rawSpec = {
    openapi: '3.0.3',
    info: { title: 'Store API', version: '1.2.0' },
    servers: [{ url: 'https://api.store.com/v1' }],
    paths: {
      '/customers/{customerId}/orders': {
        get: {
          summary: 'List customer orders',
          operationId: 'listOrders',
          parameters: [
            { name: 'customerId', in: 'path', required: true, schema: { type: 'string' } },
            { name: 'status', in: 'query', schema: { type: 'string', enum: ['pending', 'shipped'] } },
            { name: 'Authorization', in: 'header', required: true, schema: { type: 'string' } },
            { name: 'Cookie', in: 'header', schema: { type: 'string' } },
          ],
          responses: { 200: { description: 'OK' } },
        },
      },
      '/currencies': {
        get: {
          summary: 'Get supported currency codes',
          responses: { 200: { description: 'List of currencies' } },
        },
      },
      '/deprecated-route': {
        get: {
          summary: 'Old route',
          deprecated: true,
          responses: { 200: { description: 'OK' } },
        },
      },
    },
  };

  it('strips transport/auth headers (Authorization, Cookie) from tool parameters', () => {
    const extracted = extractMcpOperations(rawSpec);
    const orderTool = extracted.tools.find((t) => t.name === 'list_orders');
    assert.ok(orderTool, 'Tool list_orders should exist');

    const paramNames = orderTool.parameters.map((p) => p.name.toLowerCase());
    assert.ok(paramNames.includes('customerid'));
    assert.ok(paramNames.includes('status'));
    assert.ok(!paramNames.includes('authorization'), 'Authorization header must be stripped');
    assert.ok(!paramNames.includes('cookie'), 'Cookie header must be stripped');
  });

  it('skips deprecated endpoints by default', () => {
    const extracted = extractMcpOperations(rawSpec);
    const oldTool = extracted.tools.find((t) => t.name.includes('deprecated'));
    assert.strictEqual(oldTool, undefined, 'Deprecated endpoint must be excluded');
  });

  it('classifies static zero-parameter reference lookup as an MCP Resource', () => {
    const extracted = extractMcpOperations(rawSpec);
    const currencyResource = extracted.resources.find((r) => r.path === '/currencies');
    assert.ok(currencyResource, 'Currency endpoint should be classified as a resource');
    assert.strictEqual(currencyResource.uri, 'reference://currencies');
  });
});

describe('mcp-generator: vendor extensions & compatibility aliases', () => {
  const specWithExtensions = {
    openapi: '3.0.3',
    info: { title: 'Enterprise Portal', version: '2.0.0' },
    paths: {
      '/orders': {
        post: {
          summary: 'Create order',
          operationId: 'createOrder',
          'x-mcp': {
            name: 'place_customer_order',
            description: 'Places a verified order for the customer.',
            requireConfirmation: true,
            parameters: {
              include: ['customerId', 'items'],
              defaults: { priority: 'standard' },
              descriptions: { customerId: 'Target customer ID' },
            },
          },
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['customerId', 'items'],
                  properties: {
                    customerId: { type: 'string' },
                    items: { type: 'array', items: { type: 'string' } },
                    internalDebugToken: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: { 201: { description: 'Created' } },
        },
      },
      '/admin/health': {
        get: {
          summary: 'Internal health check',
          'x-internal': true,
          responses: { 200: { description: 'OK' } },
        },
      },
      '/refunds': {
        post: {
          summary: 'Process refund',
          'x-speakeasy-name-override': 'issue_refund',
          'x-openai-isConsequential': true,
          responses: { 200: { description: 'OK' } },
        },
      },
    },
    'x-mcp-workflows': [
      {
        name: 'get_customer_summary',
        description: 'Fetches customer and active orders',
        parameters: { customerId: { type: 'string', description: 'Customer UUID' } },
        steps: [
          { call: 'getCustomer', args: { id: '$params.customerId' } },
          { call: 'listOrders', args: { customerId: '$params.customerId' } },
        ],
      },
    ],
  };

  it('honors x-mcp parameter whitelisting and descriptions', () => {
    const extracted = extractMcpOperations(specWithExtensions);
    const orderTool = extracted.tools.find((t) => t.name === 'place_customer_order');
    assert.ok(orderTool);
    assert.strictEqual(orderTool.description, 'Places a verified order for the customer.');
    assert.strictEqual(orderTool.isConsequential, true);

    const paramNames = orderTool.parameters.map((p) => p.name);
    assert.deepStrictEqual(paramNames.sort(), ['customerId', 'items'].sort());
    assert.ok(!paramNames.includes('internalDebugToken'), 'internalDebugToken should be excluded by whitelist');

    const customerIdParam = orderTool.parameters.find((p) => p.name === 'customerId');
    assert.strictEqual(customerIdParam.description, 'Target customer ID');
  });

  it('honors x-internal: true to exclude admin endpoints', () => {
    const extracted = extractMcpOperations(specWithExtensions);
    const adminTool = extracted.tools.find((t) => t.path === '/admin/health');
    assert.strictEqual(adminTool, undefined, 'x-internal endpoint should be excluded');
  });

  it('honors x-speakeasy-name-override and x-openai-isConsequential aliases', () => {
    const extracted = extractMcpOperations(specWithExtensions);
    const refundTool = extracted.tools.find((t) => t.name === 'issue_refund');
    assert.ok(refundTool, 'Tool name override must be respected');
    assert.strictEqual(refundTool.isConsequential, true, 'x-openai-isConsequential must set isConsequential');
  });

  it('extracts root-level composite workflows', () => {
    const extracted = extractMcpOperations(specWithExtensions);
    assert.strictEqual(extracted.workflows.length, 1);
    assert.strictEqual(extracted.workflows[0].name, 'get_customer_summary');
  });
});

describe('mcp-generator: token budget estimation', () => {
  it('calculates token budget and generates warnings for heavy tool counts', () => {
    const tools = [];
    for (let i = 0; i < 35; i++) {
      tools.push({
        name: `tool_${i}`,
        description: 'A tool that performs some business operations in the system',
        parameters: [
          { name: 'param1', description: 'First parameter', type: 'string' },
          { name: 'param2', description: 'Second parameter', type: 'number' },
        ],
        isConsequential: i % 2 === 0,
      });
    }

    const budget = estimateTokenCost(tools, [], []);
    assert.strictEqual(budget.totalTools, 35);
    assert.ok(budget.estimatedTokens > 1000);
    assert.ok(budget.warnings.some((w) => w.includes('recommended limit of 30 tools')));
  });
});

describe('mcp-generator: TypeScript and Python code generation', () => {
  const spec = {
    openapi: '3.0.3',
    info: { title: 'Order Service', version: '1.0.0' },
    servers: [{ url: 'https://api.orders.example.com' }],
    paths: {
      '/orders/{id}': {
        get: {
          summary: 'Get order by id',
          operationId: 'getOrder',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'OK' } },
        },
      },
      '/shipping-tiers': {
        get: {
          summary: 'Shipping tiers reference',
          'x-mcp': { type: 'resource', uri: 'reference://shipping-tiers' },
          responses: { 200: { description: 'OK' } },
        },
      },
    },
  };

  it('generates valid TypeScript server code with McpServer and Zod schemas', () => {
    const pkg = generateMcpServer(spec, { target: 'typescript' });
    assert.strictEqual(pkg.target, 'typescript');
    assert.ok(pkg.serverCode.includes('@modelcontextprotocol/sdk/server/mcp.js'));
    assert.ok(pkg.serverCode.includes("import { z } from 'zod';"));
    assert.ok(pkg.serverCode.includes('server.tool('));
    assert.ok(pkg.serverCode.includes('get_order'));
    assert.ok(pkg.serverCode.includes('server.resource('));
    assert.ok(pkg.serverCode.includes('reference://shipping-tiers'));
    assert.ok(pkg.serverCode.includes('StdioServerTransport'));
    assert.ok(pkg.files['package.json']);
    assert.ok(pkg.files['claude_desktop_config.json']);
  });

  it('generates valid Python FastMCP server code with requirements.txt and zero-dependency HTTP', () => {
    const specWithWorkflow = {
      ...spec,
      'x-mcp-workflows': [
        {
          name: 'get_order_summary',
          description: 'Fetches order and shipping in one call',
          parameters: { orderId: { type: 'string', description: 'Order ID' } },
          steps: [{ call: 'getOrder' }],
        },
      ],
    };
    const pkg = generateMcpServer(specWithWorkflow, { target: 'python' });
    assert.strictEqual(pkg.target, 'python');
    assert.ok(pkg.serverCode.includes('from fastmcp import FastMCP'));
    assert.ok(pkg.serverCode.includes('import urllib.request'));
    assert.ok(!pkg.serverCode.includes('httpx'), 'Should use built-in urllib instead of 3rd party httpx');
    assert.ok(!pkg.serverCode.includes('requests'), 'Should use built-in urllib instead of 3rd party requests');
    assert.ok(pkg.serverCode.includes('@mcp.tool('));
    assert.ok(pkg.serverCode.includes('def get_order('));
    assert.ok(pkg.serverCode.includes('@mcp.resource('));
    assert.ok(pkg.serverCode.includes('reference://shipping-tiers'));
    assert.ok(pkg.serverCode.includes('def get_order_summary('), 'Should generate composite workflow function');
    assert.ok(pkg.files['server.py']);
    assert.ok(pkg.files['requirements.txt']);
    assert.strictEqual(pkg.files['requirements.txt'].trim(), 'fastmcp>=0.4.0');
    assert.ok(pkg.files['README.md'].includes('pip install -r requirements.txt'));
  });

  it('generates valid Go server code with mark3labs/mcp-go and go.mod', () => {
    const pkg = generateMcpServer(spec, { target: 'go' });
    assert.strictEqual(pkg.target, 'go');
    assert.ok(pkg.serverCode.includes('github.com/mark3labs/mcp-go/mcp'));
    assert.ok(pkg.serverCode.includes('s.AddTool(mcp.NewTool("get_order"'));
    assert.ok(pkg.serverCode.includes('s.AddResource(mcp.NewResource("reference://shipping-tiers"'));
    assert.ok(pkg.files['main.go']);
    assert.ok(pkg.files['go.mod']);
    assert.ok(pkg.files['go.mod'].includes('github.com/mark3labs/mcp-go'));
    assert.ok(pkg.files['README.md'].includes('go mod tidy'));
  });

  it('generates valid C# (.NET) server code with Server.csproj', () => {
    const pkg = generateMcpServer(spec, { target: 'csharp' });
    assert.strictEqual(pkg.target, 'csharp');
    assert.ok(pkg.serverCode.includes('ModelContextProtocol.NET.Server'));
    assert.ok(pkg.serverCode.includes('[McpTool("get_order"'));
    assert.ok(pkg.serverCode.includes('[McpResource("reference://shipping-tiers"'));
    assert.ok(pkg.files['Program.cs']);
    assert.ok(pkg.files['Server.csproj']);
    assert.ok(pkg.files['README.md'].includes('dotnet run'));
  });

  it('generates valid Rust server code with Cargo.toml', () => {
    const pkg = generateMcpServer(spec, { target: 'rust' });
    assert.strictEqual(pkg.target, 'rust');
    assert.ok(pkg.serverCode.includes('mcp_sdk::server'));
    assert.ok(pkg.serverCode.includes('"get_order" => {'));
    assert.ok(pkg.files['src/main.rs']);
    assert.ok(pkg.files['Cargo.toml']);
    assert.ok(pkg.files['README.md'].includes('cargo build --release'));
  });

  it('generates valid Java Spring AI server code with pom.xml', () => {
    const pkg = generateMcpServer(spec, { target: 'java' });
    assert.strictEqual(pkg.target, 'java');
    assert.ok(pkg.serverCode.includes('org.springframework.boot'));
    assert.ok(pkg.serverCode.includes('@SpringBootApplication'));
    assert.ok(pkg.files['src/main/java/com/rapidoc/mcp/RapiDocMcpServer.java']);
    assert.ok(pkg.files['pom.xml']);
    assert.ok(pkg.files['README.md'].includes('./mvnw spring-boot:run'));
  });

  it('generates host configuration snippets for Claude Desktop and Cursor', () => {
    const configs = generateHostConfigs('my_store_api', { target: 'typescript' });
    const parsedClaude = JSON.parse(configs.claudeDesktopConfig);
    assert.ok(parsedClaude.mcpServers.my_store_api);
    assert.strictEqual(parsedClaude.mcpServers.my_store_api.command, 'npx');

    const goConfigs = generateHostConfigs('my_store_api', { target: 'go' });
    const parsedGo = JSON.parse(goConfigs.claudeDesktopConfig);
    assert.strictEqual(parsedGo.mcpServers.my_store_api.command, './my_store_api');
  });
});

describe('mcp-generator: parseMcpTargets attribute normalization and kill-switch', () => {
  it('parses a single language string', () => {
    assert.deepStrictEqual(parseMcpTargets('python'), ['python']);
    assert.deepStrictEqual(parseMcpTargets('typescript'), ['typescript']);
  });

  it('parses comma-separated string with whitespace and mixed casing', () => {
    assert.deepStrictEqual(
      parseMcpTargets(' TypeScript , Python , GO '),
      ['typescript', 'python', 'go']
    );
  });

  it('parses JavaScript arrays and JSON string arrays', () => {
    assert.deepStrictEqual(parseMcpTargets(['go', 'rust', 'java']), ['go', 'rust', 'java']);
    assert.deepStrictEqual(parseMcpTargets('["typescript", "csharp"]'), ['typescript', 'csharp']);
  });

  it('maps "c#" alias to "csharp"', () => {
    assert.deepStrictEqual(parseMcpTargets('c#, rust'), ['csharp', 'rust']);
    assert.deepStrictEqual(parseMcpTargets(['c#']), ['csharp']);
  });

  it('kills all targets if "none" is specified alone or mixed in list/array', () => {
    assert.deepStrictEqual(parseMcpTargets('none'), []);
    assert.deepStrictEqual(parseMcpTargets('NONE'), []);
    assert.deepStrictEqual(parseMcpTargets('none, python, go'), []);
    assert.deepStrictEqual(parseMcpTargets('typescript, none'), []);
    assert.deepStrictEqual(parseMcpTargets(['none', 'python']), []);
    assert.deepStrictEqual(parseMcpTargets(['typescript', 'none', 'go']), []);
  });

  it('kills all targets if boolean false or "false" is provided', () => {
    assert.deepStrictEqual(parseMcpTargets(false), []);
    assert.deepStrictEqual(parseMcpTargets('false'), []);
    assert.deepStrictEqual(parseMcpTargets('false, python'), []);
    assert.deepStrictEqual(parseMcpTargets(['false', 'go']), []);
  });

  it('returns empty array for falsy, empty or unconfigured inputs', () => {
    assert.deepStrictEqual(parseMcpTargets(''), []);
    assert.deepStrictEqual(parseMcpTargets('   '), []);
    assert.deepStrictEqual(parseMcpTargets(null), []);
    assert.deepStrictEqual(parseMcpTargets(undefined), []);
  });

  it('discards unknown targets and wildcards without throwing', () => {
    assert.deepStrictEqual(parseMcpTargets('typescript, php, ruby, *'), ['typescript']);
    assert.deepStrictEqual(parseMcpTargets(['all', 'python']), ['python']);
  });

  it('deduplicates targets in the returned array', () => {
    assert.deepStrictEqual(
      parseMcpTargets('python, python, go, python'),
      ['python', 'go']
    );
    assert.deepStrictEqual(
      parseMcpTargets(['go', 'go', 'rust']),
      ['go', 'rust']
    );
  });
});

