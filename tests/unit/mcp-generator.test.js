import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse as parseYaml } from "yaml";
import {
  toSnakeCase,
  deriveToolName,
  sanitizeDescription,
  parseMcpEnabled,
  buildMcpManifest,
  toJsonSchema,
  estimateTokenCost,
  generateHostConfigs,
  envNameFor,
  buildRequest,
  createMcpRuntime,
  credentialsFromEnv,
  writeMcpProject,
  generateMcpServer,
  createZip,
} from "../../packages/rapidoc/src/utils/mcp-generator.js";
import runtimeSource from "../../packages/rapidoc/src/utils/mcp/runtime.js?raw";

const here = path.dirname(fileURLToPath(import.meta.url));
const petstore = parseYaml(
  fs.readFileSync(path.join(here, "../../docs/public/specs/petstore.yaml"), "utf8"),
);

/** A fetch stand-in that records the request and answers with it. */
function fakeFetch(status = 200, body) {
  const calls = [];
  const impl = async (url, init) => {
    calls.push({ url, ...init });
    const text = body === undefined ? JSON.stringify({ url, method: init.method }) : body;
    return {
      ok: status >= 200 && status < 300,
      status,
      statusText: status === 200 ? "OK" : "",
      text: async () => text,
    };
  };
  return { impl, calls };
}

describe("mcp: string utilities and the mcp attribute", () => {
  it("converts diverse casing to clean snake_case", () => {
    assert.equal(toSnakeCase("listCustomerInvoices"), "list_customer_invoices");
    assert.equal(toSnakeCase("Get-User-By-Id"), "get_user_by_id");
    assert.equal(toSnakeCase("API/v1/orders/{orderId}"), "api_v1_orders_order_id");
  });

  it("derives tool names from method and path", () => {
    assert.equal(
      deriveToolName("get", "/customers/{customerId}/orders"),
      "get_customers_by_customer_id_orders",
    );
    assert.equal(deriveToolName("delete", "/items/{id}"), "delete_items_by_id");
  });

  it("sanitizes markdown and HTML from descriptions", () => {
    assert.equal(
      sanitizeDescription("<b>Create an order</b> with [link](https://example.com) and `code`."),
      "Create an order with link and code.",
    );
  });

  it("reads the mcp attribute: on for true or a language, off for false, none, or a list with them", () => {
    assert.equal(parseMcpEnabled("true"), true);
    assert.equal(parseMcpEnabled("typescript"), true);
    assert.equal(parseMcpEnabled(["typescript", "python"]), true);
    for (const off of ["", "false", "none", false, undefined, "typescript, none", ["none"]]) {
      assert.equal(parseMcpEnabled(off), false, String(off));
    }
  });
});

describe("mcp: manifest from a raw OpenAPI document", () => {
  const manifest = buildMcpManifest(petstore);

  it("has one tool per operation, with server, source and security schemes", () => {
    assert.equal(manifest.manifestVersion, 1);
    assert.equal(manifest.server.name, "swagger_petstore_open_api_3_1");
    assert.equal(manifest.server.version, petstore.info.version);
    assert.deepEqual(Object.keys(manifest.sources), ["api"]);
    assert.equal(manifest.sources.api.baseUrl, "https://petstore3.swagger.io/api/v3");
    assert.deepEqual(manifest.sources.api.securitySchemes.api_key, {
      type: "apiKey",
      in: "header",
      name: "api_key",
    });
    assert.equal(manifest.sources.api.securitySchemes.petstore_auth.type, "oauth2");
    assert.equal(manifest.tools.length, 19);
    assert.deepEqual(manifest.workflows, {});
  });

  it("gives tools JSON Schema arguments: parameters by name and the request body as `body`", () => {
    const get = manifest.tools.find((t) => t.name === "get_pet_by_id");
    assert.deepEqual(get.inputSchema, {
      type: "object",
      properties: {
        petId: { type: "integer", format: "int64", description: "ID of pet to return" },
      },
      required: ["petId"],
    });
    assert.deepEqual(get.operation, {
      source: "api",
      method: "GET",
      path: "/pet/{petId}",
      params: [{ name: "petId", in: "path" }],
      security: [{ api_key: [] }, { petstore_auth: ["write:pets", "read:pets"] }],
    });
    const place = manifest.tools.find((t) => t.name === "place_order");
    const body = place.inputSchema.properties.body;
    assert.equal(body.type, "object");
    assert.deepEqual(body.properties.status.enum, ["placed", "approved", "delivered"]);
    assert.deepEqual(place.operation.params, [
      { name: "body", in: "body", contentType: "application/json" },
    ]);
    // the Pet schema's nested Category and Tag objects survive, as objects
    const add = manifest.tools.find((t) => t.name === "add_pet");
    assert.equal(add.inputSchema.properties.body.properties.category.type, "object");
    assert.equal(add.inputSchema.properties.body.properties.tags.items.type, "object");
    assert.deepEqual(add.inputSchema.required, ["body"]);
  });

  it("annotates tools with MCP hints by method", () => {
    const hints = (name) => manifest.tools.find((t) => t.name === name).annotations;
    assert.deepEqual(hints("get_pet_by_id"), {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
    });
    assert.deepEqual(hints("add_pet"), {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
    });
    assert.deepEqual(hints("delete_pet"), {
      readOnlyHint: false,
      destructiveHint: true,
      idempotentHint: true,
    });
  });

  it("never exposes the api_key header, other auth headers, or credential parameters as arguments", () => {
    // deletePet declares an api_key header parameter; it is the security scheme's, not an argument
    const del = manifest.tools.find((t) => t.name === "delete_pet");
    assert.deepEqual(Object.keys(del.inputSchema.properties), ["petId"]);
    const spec = {
      openapi: "3.0.3",
      info: { title: "T", version: "1" },
      components: {
        securitySchemes: { key: { type: "apiKey", in: "query", name: "token" } },
      },
      paths: {
        "/a": {
          get: {
            operationId: "a",
            parameters: [
              { name: "Authorization", in: "header", schema: { type: "string" } },
              { name: "X-API-Key", in: "header", schema: { type: "string" } },
              { name: "token", in: "query", schema: { type: "string" } },
              { name: "q", in: "query", schema: { type: "string" } },
            ],
          },
        },
      },
    };
    const { tools } = buildMcpManifest(spec);
    assert.deepEqual(Object.keys(tools[0].inputSchema.properties), ["q"]);
  });
});

describe("mcp: manifest rules", () => {
  const minimal = (paths, extra = {}) => ({
    openapi: "3.0.3",
    info: { title: "Store API", version: "1.2.0" },
    servers: [
      { url: "https://api.store.com/{version}", variables: { version: { default: "v1" } } },
    ],
    paths,
    ...extra,
  });

  it("merges path-level parameters, the operation's own winning on name and location", () => {
    const { tools } = buildMcpManifest(
      minimal({
        "/customers/{customerId}": {
          parameters: [
            { name: "customerId", in: "path", required: true, schema: { type: "string" } },
            { name: "verbose", in: "query", schema: { type: "boolean" } },
          ],
          get: {
            operationId: "getCustomer",
            parameters: [
              { name: "verbose", in: "query", schema: { type: "string", enum: ["yes"] } },
            ],
          },
        },
      }),
    );
    assert.deepEqual(tools[0].inputSchema.properties, {
      customerId: { type: "string" },
      verbose: { type: "string", enum: ["yes"] },
    });
    assert.deepEqual(tools[0].inputSchema.required, ["customerId"]);
    assert.equal(tools[0].operation.params.length, 2);
  });

  it("reads a raw spec that has a top-level tags array", () => {
    const { tools } = buildMcpManifest(
      minimal({ "/a": { get: { operationId: "a" } } }, { tags: [{ name: "x" }] }),
    );
    assert.equal(tools.length, 1);
  });

  it("skips internal, hidden, deprecated operations and webhooks unless asked to keep them", () => {
    const spec = minimal({
      "/health": { get: { operationId: "health", "x-internal": true } },
      "/hidden": { "x-hidden": true, get: { operationId: "hidden" } },
      "/old": { get: { operationId: "old", deprecated: true } },
      "/new": { get: { operationId: "fresh" } },
    });
    assert.deepEqual(
      buildMcpManifest(spec).tools.map((t) => t.name),
      ["fresh"],
    );
    assert.equal(
      buildMcpManifest(spec, { includeInternal: true, includeDeprecated: true }).tools.length,
      4,
    );
  });

  it("classifies a parameterless GET on a reference-data path as a resource", () => {
    const { tools, resources } = buildMcpManifest(
      minimal({
        "/currencies": { get: { summary: "Currency codes" } },
        "/orders": { get: { operationId: "listOrders" } },
      }),
    );
    assert.deepEqual(
      tools.map((t) => t.name),
      ["list_orders"],
    );
    assert.equal(resources[0].uri, "reference://currencies");
    assert.equal(resources[0].operation.path, "/currencies");
  });

  it("substitutes server variables and numbers duplicate tool names", () => {
    const m = buildMcpManifest(
      minimal({
        "/a": { get: { operationId: "same" } },
        "/b": { get: { operationId: "same" } },
      }),
    );
    assert.equal(m.sources.api.baseUrl, "https://api.store.com/v1");
    assert.deepEqual(
      m.tools.map((t) => t.name),
      ["same", "same_2"],
    );
  });

  it("accepts ProcessSpec's shape: tags[].paths[] with merged parameters and xInternal flags", () => {
    const processed = {
      specLoadError: false,
      info: { title: "Processed", version: "3" },
      servers: [{ url: "https://p.example.com" }],
      securitySchemes: [
        {
          securitySchemeId: "bearer",
          type: "http",
          scheme: "bearer",
          in: "header",
          name: "Authorization",
        },
        { securitySchemeId: "_rapidoc_api_key", type: "apiKey", in: "header", name: "x-key" },
      ],
      tags: [
        {
          name: "pets",
          paths: [
            {
              method: "post",
              path: "/pets",
              summary: "Add a pet",
              parameters: [{ name: "dryRun", in: "query", schema: { type: "boolean" } }],
              requestBody: {
                required: true,
                content: {
                  "application/json": {
                    schema: { type: "object", properties: { name: { type: "string" } } },
                  },
                },
              },
              security: [{ bearer: [] }],
              rawOperation: { operationId: "addPet" },
            },
            { method: "get", path: "/secret", xInternal: true, rawOperation: {} },
            { method: "post", path: "/hook", isWebhook: true, rawOperation: {} },
          ],
        },
      ],
    };
    const m = buildMcpManifest(processed, { serverName: "My Pets" });
    assert.equal(m.server.name, "my_pets");
    assert.deepEqual(Object.keys(m.sources.api.securitySchemes), ["bearer"]);
    assert.deepEqual(m.sources.api.securitySchemes.bearer, { type: "http", scheme: "bearer" });
    assert.deepEqual(
      m.tools.map((t) => t.name),
      ["add_pet"],
    );
    assert.deepEqual(Object.keys(m.tools[0].inputSchema.properties), ["dryRun", "body"]);
    assert.deepEqual(m.tools[0].operation.security, [{ bearer: [] }]);
  });
});

describe("mcp: OpenAPI schemas as JSON Schema", () => {
  it("inlines $refs, cuts cycles, folds nullable and drops read-only properties", () => {
    const root = {
      components: {
        schemas: {
          Node: {
            type: "object",
            required: ["id", "name"],
            properties: {
              id: { type: "integer", readOnly: true },
              name: { type: "string", nullable: true, example: "x", "x-note": 1 },
              parent: { $ref: "#/components/schemas/Node" },
              tags: { type: "array", items: { $ref: "#/components/schemas/Tag" } },
            },
          },
          Tag: { type: "string", minimum: 1, exclusiveMinimum: true },
        },
      },
    };
    const schema = toJsonSchema({ $ref: "#/components/schemas/Node" }, root);
    assert.deepEqual(Object.keys(schema.properties), ["name", "parent", "tags"]);
    assert.deepEqual(schema.required, ["name"]);
    assert.deepEqual(schema.properties.name, { type: ["string", "null"] });
    assert.deepEqual(schema.properties.parent, { type: "object" });
    assert.deepEqual(schema.properties.tags.items, { type: "string", exclusiveMinimum: 1 });
    assert.deepEqual(toJsonSchema({ $ref: "#/components/schemas/Missing" }, root), {
      description: "See #/components/schemas/Missing",
    });
  });
});

describe("mcp: the runtime builds and sends requests", () => {
  const manifest = buildMcpManifest(petstore);
  const op = (name) => manifest.tools.find((t) => t.name === name).operation;

  it("places arguments by location, encodes path parameters and applies the first known credential", () => {
    const req = buildRequest(
      manifest,
      op("get_pet_by_id"),
      { petId: "a/b" },
      { credentials: { api_key: "k1" } },
    );
    assert.equal(req.url, "https://petstore3.swagger.io/api/v3/pet/a%2Fb");
    assert.deepEqual(req.headers, { api_key: "k1", Accept: "application/json" });
    // only petstore_auth known: the second alternative, as a bearer token
    const bearer = buildRequest(
      manifest,
      op("get_pet_by_id"),
      { petId: 1 },
      { credentials: { petstore_auth: "tok" } },
    );
    assert.equal(bearer.headers.Authorization, "Bearer tok");
    const q = buildRequest(manifest, op("find_pets_by_status"), { status: "sold" }, {});
    assert.equal(q.url, "https://petstore3.swagger.io/api/v3/pet/findByStatus?status=sold");
    assert.equal(q.headers.Authorization, undefined);
  });

  it("sends JSON bodies, repeats array query values and overrides the base URL", () => {
    const req = buildRequest(
      manifest,
      op("place_order"),
      { body: { petId: 1, quantity: 2 } },
      { baseUrls: { api: "http://localhost:4010/" } },
    );
    assert.equal(req.url, "http://localhost:4010/store/order");
    assert.equal(req.method, "POST");
    assert.equal(req.headers["Content-Type"], "application/json");
    assert.equal(req.body, '{"petId":1,"quantity":2}');
    const tags = buildRequest(manifest, op("find_pets_by_tags"), { tags: ["a", "b"] });
    assert.ok(tags.url.endsWith("/pet/findByTags?tags=a&tags=b"));
    assert.throws(
      () => buildRequest(manifest, op("get_pet_by_id"), {}),
      /Missing path parameter \{petId\}/,
    );
  });

  it("supports API keys in query and cookie, HTTP Basic and form bodies", () => {
    const m = {
      sources: {
        api: {
          baseUrl: "https://x.test",
          securitySchemes: {
            qkey: { type: "apiKey", in: "query", name: "token" },
            ckey: { type: "apiKey", in: "cookie", name: "sid" },
            basic: { type: "http", scheme: "basic" },
          },
        },
      },
    };
    const operation = {
      source: "api",
      method: "POST",
      path: "/login",
      params: [
        { name: "X-Trace", in: "header", arg: "trace" },
        { name: "body", in: "body", contentType: "application/x-www-form-urlencoded" },
      ],
      security: [{ qkey: [], ckey: [], basic: [] }],
    };
    const req = buildRequest(
      m,
      operation,
      { trace: "t1", body: { user: "a b" } },
      {
        credentials: { qkey: "q", ckey: "c", basic: { username: "u", password: "p" } },
      },
    );
    assert.equal(req.url, "https://x.test/login?token=q");
    assert.equal(req.headers["X-Trace"], "t1");
    assert.equal(req.headers.Cookie, "sid=c");
    assert.equal(req.headers.Authorization, `Basic ${Buffer.from("u:p").toString("base64")}`);
    assert.equal(req.body, "user=a+b");
  });

  it("calls tools through fetch and turns responses into MCP results", async () => {
    const ok = fakeFetch(200, '{"id": 7, "name": "Rex"}');
    const runtime = createMcpRuntime(manifest, { fetch: ok.impl, credentials: { api_key: "k" } });
    const result = await runtime.callTool("get_pet_by_id", { petId: 7 });
    assert.deepEqual(result, {
      content: [{ type: "text", text: '{\n  "id": 7,\n  "name": "Rex"\n}' }],
      structuredContent: { id: 7, name: "Rex" },
    });
    assert.equal(ok.calls[0].url, "https://petstore3.swagger.io/api/v3/pet/7");
    assert.equal(ok.calls[0].headers.api_key, "k");

    const notFound = fakeFetch(404, "Pet not found");
    const failing = createMcpRuntime(manifest, { fetch: notFound.impl });
    const error = await failing.callTool("get_pet_by_id", { petId: 8 });
    assert.equal(error.isError, true);
    assert.equal(error.content[0].text, "HTTP 404\nPet not found");
    assert.equal((await failing.callTool("nope", {})).isError, true);
    assert.equal(
      (await failing.callTool("get_pet_by_id", {})).content[0].text,
      "Missing path parameter {petId}",
    );
    assert.equal(runtime.listTools().length, 19);
    assert.equal(runtime.listTools()[0].operation, undefined);
  });

  it("reads resources", async () => {
    const m = buildMcpManifest({
      openapi: "3.0.0",
      info: { title: "R", version: "1" },
      servers: [{ url: "https://r.test" }],
      paths: { "/currencies": { get: { summary: "Currencies" } } },
    });
    const f = fakeFetch(200, '["EUR"]');
    const runtime = createMcpRuntime(m, { fetch: f.impl });
    assert.deepEqual(runtime.listResources(), [
      {
        name: "get_currencies",
        uri: "reference://currencies",
        description: "Currencies",
        mimeType: "application/json",
      },
    ]);
    assert.deepEqual(await runtime.readResource("reference://currencies"), {
      contents: [{ uri: "reference://currencies", mimeType: "application/json", text: '["EUR"]' }],
    });
    await assert.rejects(runtime.readResource("reference://none"), /Unknown resource/);
  });

  it("reads credentials from the environment by scheme name, with API_KEY as the fallback", () => {
    assert.equal(envNameFor("petstore_auth"), "PETSTORE_AUTH");
    assert.equal(envNameFor("myApiKey"), "MY_API_KEY");
    assert.deepEqual(credentialsFromEnv(manifest, { PETSTORE_AUTH: "t", API_KEY: "k" }), {
      petstore_auth: "t",
      api_key: "k",
    });
    assert.deepEqual(credentialsFromEnv(manifest, { API_KEY: "k" }), {
      petstore_auth: "k",
      api_key: "k",
    });
    const basic = {
      sources: { api: { securitySchemes: { basic: { type: "http", scheme: "basic" } } } },
    };
    assert.deepEqual(credentialsFromEnv(basic, { BASIC_USERNAME: "u", BASIC_PASSWORD: "p" }), {
      basic: { username: "u", password: "p" },
    });
  });
});

describe("mcp: the exported project", () => {
  const { manifest, files, budget, hostConfig } = generateMcpServer(petstore, {
    serverName: "Pet Store",
  });

  it("writes the manifest as data and the runtime and server as fixed files", () => {
    assert.deepEqual(Object.keys(files), [
      "manifest.json",
      "server.ts",
      "runtime.js",
      "package.json",
      "README.md",
      "claude_desktop_config.json",
    ]);
    assert.deepEqual(JSON.parse(files["manifest.json"]), manifest);
    assert.equal(files["runtime.js"], runtimeSource);
    assert.ok(!/^import /m.test(files["runtime.js"]), "the runtime imports nothing");
    assert.ok(files["server.ts"].includes('from "./runtime.js"'));
    assert.ok(files["server.ts"].includes("setRequestHandler(CallToolRequestSchema"));
    const pkg = JSON.parse(files["package.json"]);
    assert.equal(pkg.name, "pet-store");
    assert.ok(pkg.dependencies["@modelcontextprotocol/sdk"]);
    assert.equal(pkg.dependencies.zod, undefined);
    assert.ok(files["README.md"].includes("`PETSTORE_AUTH`"));
    assert.ok(files["README.md"].includes("`API_KEY`: the API key sent as header `api_key`"));
  });

  it("writes host configuration with one env entry per security scheme", () => {
    const config = JSON.parse(hostConfig);
    assert.deepEqual(config.mcpServers.pet_store.args, ["-y", "tsx", "server.ts"]);
    assert.deepEqual(Object.keys(config.mcpServers.pet_store.env), ["PETSTORE_AUTH", "API_KEY"]);
    assert.deepEqual(JSON.parse(generateHostConfigs("x").claudeDesktopConfig).mcpServers.x.env, {
      API_KEY: "your-api-key-here",
    });
    assert.equal(files["claude_desktop_config.json"], hostConfig);
  });

  it("estimates the token budget from the manifest", () => {
    assert.equal(budget.totalTools, 19);
    assert.equal(budget.consequentialCount, 11);
    assert.ok(budget.estimatedTokens > 1000);
    const many = {
      tools: Array.from({ length: 35 }, (_, i) => ({
        name: `t${i}`,
        description: "d",
        inputSchema: {},
      })),
    };
    assert.ok(
      estimateTokenCost(many).warnings.some((w) => w.includes("recommended limit of 30 tools")),
    );
  });

  it("packs the files into a stored zip", () => {
    const zip = createZip({ "a.txt": "hello", "dir/b.json": "{}" });
    const view = new DataView(zip.buffer);
    assert.equal(view.getUint32(0, true), 0x04034b50);
    assert.equal(view.getUint32(zip.length - 22, true), 0x06054b50);
    assert.equal(view.getUint16(zip.length - 12, true), 2); // entries
    const text = new TextDecoder().decode(zip);
    assert.ok(text.includes("a.txt") && text.includes("hello") && text.includes("dir/b.json"));
    // the CRC of "hello"
    assert.equal(view.getUint32(14, true), 0x3610a686);
  });

  it("builds the whole project from <rapi-doc>'s processed spec shape too", () => {
    assert.equal(writeMcpProject(manifest)["package.json"].includes('"pet-store"'), true);
  });
});
