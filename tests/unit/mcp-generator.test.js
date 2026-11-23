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
  hostEnvFor,
  envNameFor,
  operationToolName,
  assignToolNames,
  buildRequest,
  createMcpRuntime,
  credentialsFromEnv,
  credentialEnvNames,
  baseUrlsFromEnv,
  baseUrlEnvNames,
  sourcesWithoutBaseUrl,
  MANIFEST_VERSION,
  writeMcpProject,
  generateMcpServer,
  createZip,
} from "../../packages/rapidoc/src/utils/mcp-generator.js";
import runtimeSource from "../../packages/rapidoc/src/utils/mcp/runtime.js?raw";

const here = path.dirname(fileURLToPath(import.meta.url));
const petstore = parseYaml(
  fs.readFileSync(path.join(here, "../../sites/rapidoc/public/specs/petstore.yaml"), "utf8"),
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

  it("reads the mcp attribute: on for true only", () => {
    assert.equal(parseMcpEnabled("true"), true);
    assert.equal(parseMcpEnabled(" True "), true);
    assert.equal(parseMcpEnabled(true), true);
    for (const off of ["", "false", "none", false, undefined, null, "typescript", "true,none"]) {
      assert.equal(parseMcpEnabled(off), false, String(off));
    }
  });
});

describe("mcp: manifest from a raw OpenAPI document", () => {
  it("follows $refs to parameters and request bodies in a raw spec (path item and operation)", () => {
    const spec = {
      openapi: "3.1.0",
      info: { title: "Items", version: "1.0.0" },
      paths: {
        "/items/{id}": {
          parameters: [{ $ref: "#/components/parameters/Id" }],
          put: {
            operationId: "updateItem",
            parameters: [{ $ref: "#/components/parameters/Dry" }],
            requestBody: { $ref: "#/components/requestBodies/Item" },
            responses: { 200: { description: "OK" } },
          },
        },
      },
      components: {
        parameters: {
          Id: { name: "id", in: "path", required: true, schema: { type: "string" } },
          Dry: { name: "dryRun", in: "query", schema: { type: "boolean" } },
        },
        requestBodies: {
          Item: {
            required: true,
            content: { "application/json": { schema: { type: "object" } } },
          },
        },
      },
    };
    const [tool] = buildMcpManifest(spec).tools;
    assert.deepEqual(Object.keys(tool.inputSchema.properties).sort(), ["body", "dryRun", "id"]);
    assert.deepEqual(tool.inputSchema.required.sort(), ["body", "id"]);
  });

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
    // A POST may add or undo: no destructiveHint, so hosts assume it may be destructive
    assert.deepEqual(hints("add_pet"), {
      readOnlyHint: false,
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

  it("makes every operation a tool: a path never makes a GET a resource", () => {
    const { tools, resources } = buildMcpManifest(
      minimal({
        "/currencies": {
          get: {
            summary: "Currency codes",
            parameters: [{ name: "region", in: "query", schema: { type: "string" } }],
          },
        },
        "/schemas": { get: { operationId: "listSchemas" } },
        "/orders": { get: { operationId: "listOrders" } },
      }),
    );
    assert.deepEqual(
      tools.map((t) => t.name),
      ["get_currencies", "list_schemas", "list_orders"],
    );
    // The optional parameter is still an argument
    assert.deepEqual(Object.keys(tools[0].inputSchema.properties), ["region"]);
    assert.deepEqual(resources, []);
  });

  it("makes a GET a resource only with x-mcp-resource: true, and keeps it a tool too", () => {
    const { tools, resources } = buildMcpManifest(
      minimal({
        "/currencies": { get: { operationId: "getCurrencies", "x-mcp-resource": false } },
        "/plans": {
          get: {
            operationId: "getPlans",
            "x-mcp-resource": true,
            parameters: [{ name: "tier", in: "query", schema: { type: "string" } }],
          },
        },
        "/status": { get: { operationId: "getStatus" } },
        // A resource is read without arguments, and only a GET is a read
        "/plans/{id}": {
          get: {
            operationId: "getPlan",
            "x-mcp-resource": true,
            parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          },
        },
        "/reports": { post: { operationId: "makeReport", "x-mcp-resource": true } },
      }),
    );
    assert.deepEqual(
      tools.map((t) => t.name),
      ["get_currencies", "get_plans", "get_status", "get_plan", "make_report"],
    );
    assert.deepEqual(Object.keys(tools[1].inputSchema.properties), ["tier"]);
    assert.deepEqual(
      resources.map((r) => [r.name, r.uri]),
      [["get_plans", "reference://plans"]],
    );
  });

  it("substitutes server variables", () => {
    const m = buildMcpManifest(minimal({ "/a": { get: { operationId: "a" } } }));
    assert.equal(m.sources.api.baseUrl, "https://api.store.com/v1");
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
    // "." and ".." would be resolved as dot segments ("/pet/.." is "/"): rejected
    for (const petId of [".", ".."]) {
      assert.throws(
        () => buildRequest(manifest, op("get_pet_by_id"), { petId }, {}),
        /Path parameter petId can't be/,
      );
    }
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
      paths: { "/currencies": { get: { summary: "Currencies", "x-mcp-resource": true } } },
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

  it("reads credentials only from MCP_AUTH_<SCHEME> variables", () => {
    assert.equal(envNameFor("petstore_auth"), "MCP_AUTH_PETSTORE_AUTH");
    assert.equal(envNameFor("myApiKey"), "MCP_AUTH_MY_API_KEY");
    assert.match(envNameFor("認証"), /^MCP_AUTH_SCHEME_[0-9A-F]{8}$/);
    assert.deepEqual(
      credentialsFromEnv(manifest, { MCP_AUTH_PETSTORE_AUTH: "t", MCP_AUTH_API_KEY: "k" }),
      { petstore_auth: "t", api_key: "k" },
    );
    // The old names, and the API_KEY shortcut, are not read
    assert.deepEqual(credentialsFromEnv(manifest, { PETSTORE_AUTH: "t", API_KEY: "k" }), {});
    const one = {
      sources: { api: { securitySchemes: { token: { type: "http", scheme: "bearer" } } } },
    };
    assert.deepEqual(credentialsFromEnv(one, { API_KEY: "k", TOKEN: "t" }), {});
    assert.deepEqual(credentialsFromEnv(one, { MCP_AUTH_TOKEN: "t" }), { token: "t" });
    const basic = {
      sources: { api: { securitySchemes: { basic: { type: "http", scheme: "basic" } } } },
    };
    assert.deepEqual(credentialEnvNames(basic), {
      basic: ["MCP_AUTH_BASIC_USERNAME", "MCP_AUTH_BASIC_PASSWORD"],
    });
    assert.deepEqual(
      credentialsFromEnv(basic, { MCP_AUTH_BASIC_USERNAME: "u", MCP_AUTH_BASIC_PASSWORD: "p" }),
      { basic: { username: "u", password: "p" } },
    );
    assert.deepEqual(credentialsFromEnv(basic, { MCP_AUTH_BASIC: "u:p", BASIC_USERNAME: "u" }), {});
  });

  it("never reads a variable outside the MCP_ prefix, whatever the schemes are called", () => {
    const hostile = {
      sources: {
        api: {
          securitySchemes: {
            path: { type: "apiKey", in: "header", name: "X-Key" },
            token: { type: "http", scheme: "bearer" },
            user: { type: "http", scheme: "basic" },
            rapidoc_session_secret: { type: "apiKey", in: "query", name: "s" },
            "": { type: "http", scheme: "bearer" },
          },
        },
      },
    };
    const read = [];
    const env = new Proxy(
      {},
      {
        get(_, name) {
          read.push(String(name));
          return "secret";
        },
      },
    );
    credentialsFromEnv(hostile, env);
    baseUrlsFromEnv(hostile, env);
    assert.ok(read.length > 5);
    for (const name of read) assert.match(name, /^MCP_(AUTH|BASE_URL)/, name);
    assert.ok(!read.includes("PATH") && !read.includes("RAPIDOC_SESSION_SECRET"));
  });

  it("reads MCP_BASE_URL for one source and MCP_BASE_URL_<SOURCE> for several", () => {
    assert.deepEqual(baseUrlEnvNames(manifest), { api: "MCP_BASE_URL" });
    assert.deepEqual(baseUrlsFromEnv(manifest, { MCP_BASE_URL: "http://m.test" }), {
      api: "http://m.test",
    });
    assert.deepEqual(baseUrlsFromEnv(manifest, { API_BASE_URL: "http://m.test" }), {});
    const two = { sources: { petstore: {}, "billing-api": {} } };
    assert.deepEqual(baseUrlEnvNames(two), {
      petstore: "MCP_BASE_URL_PETSTORE",
      "billing-api": "MCP_BASE_URL_BILLING_API",
    });
    assert.deepEqual(baseUrlsFromEnv(two, { MCP_BASE_URL_BILLING_API: "http://b.test" }), {
      "billing-api": "http://b.test",
    });
    assert.throws(
      () => baseUrlsFromEnv(two, { MCP_BASE_URL: "http://m.test" }),
      /MCP_BASE_URL is for a server with one API.*MCP_BASE_URL_PETSTORE, MCP_BASE_URL_BILLING_API/,
    );
  });

  it("refuses a manifest version it does not know", () => {
    assert.equal(manifest.manifestVersion, MANIFEST_VERSION);
    assert.throws(
      () => createMcpRuntime({ ...manifest, manifestVersion: 2 }),
      /reads manifest version 1, and the manifest is version 2/,
    );
    assert.throws(() => createMcpRuntime({ sources: {}, tools: [] }), /not versioned/);
  });
});

describe("mcp: tool names", () => {
  const spec = (paths, extra = {}) => ({
    openapi: "3.0.3",
    info: { title: "Names", version: "1" },
    servers: [{ url: "https://n.test" }],
    paths,
    ...extra,
  });
  const names = (m) => m.tools.map((t) => t.name);
  const VALID = /^[a-zA-Z0-9_-]{1,64}$/;

  it("falls back to method and path when the operationId has no Latin letter or digit", () => {
    assert.equal(operationToolName("顧客一覧", "get", "/customers"), "get_customers");
    assert.equal(operationToolName("listPets", "get", "/pets"), "list_pets");
    const m = buildMcpManifest(
      spec({
        "/customers": { get: { operationId: "顧客一覧" } },
        "/顧客": { get: { operationId: "顧客" }, post: { operationId: "作成" } },
        "/注文": { get: {} },
      }),
    );
    for (const name of names(m)) assert.match(name, VALID);
    assert.equal(names(m)[0], "get_customers");
    assert.equal(names(m)[2], "post");
    // GET /顧客 and GET /注文 would both be "get": each ends in a hash of its own method and path
    assert.match(names(m)[1], /^get_[0-9a-f]{8}$/);
    assert.match(names(m)[3], /^get_[0-9a-f]{8}$/);
    assert.equal(new Set(names(m)).size, 4);
  });

  it("gives the server a name when the title has no Latin letter or digit", () => {
    assert.equal(
      buildMcpManifest(spec({}, { info: { title: "ペット" } })).server.name,
      "api_mcp_server",
    );
    assert.equal(toSnakeCase("ペット"), "tool");
    assert.ok(
      JSON.parse(generateHostConfigs("ペット").claudeDesktopConfig).mcpServers.api_mcp_server,
    );
  });

  it("cuts names to 64 characters with a hash, keeping two long names distinct", () => {
    const long = "getTheVeryLongNameOfAnOperationThatSomeGeneratorWroteFromItsControllerAndMethod";
    const m = buildMcpManifest(
      spec({
        "/a": { get: { operationId: `${long}One` } },
        "/b": { get: { operationId: `${long}Two` } },
        "/c": { get: { operationId: "short" } },
      }),
    );
    const [one, two, short] = names(m);
    assert.equal(short, "short");
    for (const name of [one, two]) {
      assert.match(name, VALID);
      assert.ok(name.length <= 64, name);
      assert.match(name, /^get_the_very_long_name_.*_[0-9a-f]{8}$/);
    }
    assert.notEqual(one, two);
    // The same again: the name depends on nothing but the operation
    assert.deepEqual(
      names(buildMcpManifest(spec({ "/z": { get: { operationId: `${long}One` } } }))),
      [one],
    );
  });

  it("names clashing operations by their method and path, not by document order", () => {
    const a = { "/a": { get: { operationId: "same" } } };
    const b = { "/b": { get: { operationId: "same" }, post: { operationId: "Same" } } };
    const other = { "/c": { get: { operationId: "other" } } };
    const first = buildMcpManifest(spec({ ...a, ...b, ...other }));
    const second = buildMcpManifest(spec({ ...other, ...b, ...a }));
    const byKey = (m) =>
      Object.fromEntries(m.tools.map((t) => [`${t.operation.method} ${t.operation.path}`, t.name]));
    assert.deepEqual(byKey(first), byKey(second));
    const named = byKey(first);
    assert.equal(named["GET /c"], "other");
    assert.equal(new Set(Object.values(named)).size, 4);
    for (const key of ["GET /a", "GET /b", "POST /b"])
      assert.match(named[key], /^same_[0-9a-f]{8}$/);
    // Adding an unrelated operation renames nothing
    const third = byKey(buildMcpManifest(spec({ "/new": { get: {} }, ...a, ...b, ...other })));
    for (const key of Object.keys(named)) assert.equal(third[key], named[key]);
  });

  it("never gives a suffixed name that another tool really has", () => {
    const [taken] = assignToolNames([
      { name: "same", key: "GET /a" },
      { name: "same", key: "GET /b" },
    ]);
    const result = assignToolNames([
      { name: "same", key: "GET /a" },
      { name: "same", key: "GET /b" },
      { name: taken, key: "GET /real" },
    ]);
    assert.equal(result[2], taken);
    assert.equal(new Set(result).size, 3);
    assert.match(result[0], /^same_[0-9a-f]{8}$/);
    assert.notEqual(result[0], taken);
  });

  it("puts a prefix in front before cutting and comparing", () => {
    const m = buildMcpManifest(
      spec({
        "/a": { get: { operationId: "listThings" } },
        "/b": { get: { operationId: "x".repeat(60) } },
      }),
      { toolNamePrefix: "billing_" },
    );
    assert.equal(names(m)[0], "billing_list_things");
    assert.equal(names(m)[1].length, 64);
    assert.match(names(m)[1], /^billing_x+_[0-9a-f]{8}$/);
  });

  it("lists an operation once when a processed spec repeats it under two tags", () => {
    const op = { method: "get", path: "/pets", rawOperation: { operationId: "listPets" } };
    const m = buildMcpManifest({
      info: { title: "P" },
      servers: [{ url: "https://p.test" }],
      tags: [
        { name: "a", paths: [op] },
        { name: "b", paths: [op] },
      ],
    });
    assert.deepEqual(names(m), ["list_pets"]);
  });
});

describe("mcp: security scheme variables that would clash", () => {
  const withSchemes = (securitySchemes) => ({
    openapi: "3.0.3",
    info: { title: "S", version: "1" },
    servers: [{ url: "https://s.test" }],
    paths: {},
    components: { securitySchemes },
  });

  it("reports two schemes whose ids give the same variable", () => {
    assert.throws(
      () =>
        buildMcpManifest(
          withSchemes({
            "api-key": { type: "apiKey", in: "header", name: "X-A" },
            apiKey: { type: "apiKey", in: "header", name: "X-B" },
          }),
        ),
      /security scheme "api-key" and security scheme "apiKey" would both read the environment variable MCP_AUTH_API_KEY/,
    );
    assert.throws(
      () =>
        buildMcpManifest(
          withSchemes({
            login: { type: "http", scheme: "basic" },
            login_username: { type: "apiKey", in: "header", name: "X-U" },
          }),
        ),
      /MCP_AUTH_LOGIN_USERNAME/,
    );
    assert.doesNotThrow(() =>
      buildMcpManifest(
        withSchemes({
          api_key: { type: "apiKey", in: "header", name: "X-A" },
          apiKey2: { type: "apiKey", in: "header", name: "X-B" },
        }),
      ),
    );
  });
});

describe("mcp: Swagger 2.0 documents", () => {
  const swagger = {
    swagger: "2.0",
    info: { title: "Legacy", version: "1" },
    host: "legacy.test",
    basePath: "/v2",
    schemes: ["https"],
    consumes: ["application/json"],
    securityDefinitions: {
      login: { type: "basic" },
      oauth: {
        type: "oauth2",
        flow: "accessCode",
        authorizationUrl: "https://legacy.test/auth",
        tokenUrl: "https://legacy.test/token",
        scopes: { read: "Read" },
      },
    },
    security: [{ login: [] }],
    paths: {
      "/pets/{id}": {
        post: {
          operationId: "updatePetWithForm",
          consumes: ["application/x-www-form-urlencoded"],
          parameters: [
            { name: "id", in: "path", required: true, type: "integer" },
            {
              name: "name",
              in: "formData",
              required: true,
              type: "string",
              description: "New name",
            },
            { name: "status", in: "formData", type: "string", enum: ["available", "sold"] },
          ],
        },
      },
      "/pets/{id}/image": {
        post: {
          operationId: "uploadFile",
          consumes: ["multipart/form-data"],
          parameters: [
            { name: "id", in: "path", required: true, type: "integer" },
            { name: "file", in: "formData", type: "file" },
          ],
        },
      },
    },
  };
  const manifest = buildMcpManifest(swagger);
  const tool = (name) => manifest.tools.find((t) => t.name === name);

  it("treats `type: basic` as HTTP Basic, never as a bearer token", () => {
    assert.deepEqual(manifest.sources.api.securitySchemes.login, { type: "http", scheme: "basic" });
    assert.deepEqual(manifest.sources.api.securitySchemes.oauth.flows, {
      authorizationCode: {
        authorizationUrl: "https://legacy.test/auth",
        tokenUrl: "https://legacy.test/token",
        scopes: { read: "Read" },
      },
    });
    assert.deepEqual(credentialEnvNames(manifest).login, [
      "MCP_AUTH_LOGIN_USERNAME",
      "MCP_AUTH_LOGIN_PASSWORD",
    ]);
    const credentials = credentialsFromEnv(manifest, {
      MCP_AUTH_LOGIN_USERNAME: "ann",
      MCP_AUTH_LOGIN_PASSWORD: "pw",
    });
    const request = buildRequest(
      manifest,
      tool("update_pet_with_form").operation,
      { id: 1, body: { name: "Rex" } },
      { credentials },
    );
    assert.equal(request.headers.Authorization, `Basic ${btoa("ann:pw")}`);
  });

  it("sends formData parameters as a form body", () => {
    const t = tool("update_pet_with_form");
    assert.deepEqual(t.inputSchema.properties.body, {
      type: "object",
      properties: {
        name: { type: "string", description: "New name" },
        status: { type: "string", enum: ["available", "sold"] },
      },
      required: ["name"],
    });
    assert.deepEqual(t.inputSchema.required, ["id", "body"]);
    const request = buildRequest(manifest, t.operation, {
      id: 7,
      body: { name: "Rex & co", status: "sold" },
    });
    assert.equal(request.url, "https://legacy.test/v2/pets/7");
    assert.equal(request.headers["Content-Type"], "application/x-www-form-urlencoded");
    assert.equal(request.body, "name=Rex+%26+co&status=sold");
    const upload = tool("upload_file");
    assert.deepEqual(upload.inputSchema.properties.body.properties, { file: { type: "string" } });
    assert.equal(upload.operation.params.at(-1).contentType, "multipart/form-data");
  });
});

describe("mcp: the API's base URL", () => {
  const doc = (servers, extra = {}) => ({
    openapi: "3.0.3",
    info: { title: "Base", version: "1" },
    ...(servers && { servers }),
    paths: { "/pets": { get: { operationId: "listPets" } } },
    ...extra,
  });

  it("resolves a relative server URL, or none, against the address the spec came from", () => {
    const from = { specUrl: "https://docs.example.com/specs/v3/openapi.yaml" };
    const base = (servers, options = from) =>
      buildMcpManifest(doc(servers), options).sources.api.baseUrl;
    assert.equal(base([{ url: "/api/v1" }]), "https://docs.example.com/api/v1");
    assert.equal(base([{ url: "../api" }]), "https://docs.example.com/specs/api");
    assert.equal(base([{ url: "//api.example.com/v1" }]), "https://api.example.com/v1");
    assert.equal(base(null), "https://docs.example.com");
    assert.equal(base([{ url: "https://api.example.com/v1" }]), "https://api.example.com/v1");
    // A file path is not an address
    assert.equal(base([{ url: "/api/v1" }], { specUrl: "/home/me/openapi.yaml" }), undefined);
  });

  it("leaves the base URL unset when nothing says where the API is", () => {
    for (const servers of [[{ url: "/api/v1" }], null, []]) {
      const source = buildMcpManifest(doc(servers)).sources.api;
      assert.ok(!("baseUrl" in source), JSON.stringify(servers));
    }
    const swagger = buildMcpManifest({
      swagger: "2.0",
      info: { title: "S" },
      basePath: "/v2",
      paths: {},
    });
    assert.ok(!("baseUrl" in swagger.sources.api));
    assert.equal(
      buildMcpManifest(
        { swagger: "2.0", info: { title: "S" }, basePath: "/v2", paths: {} },
        { specUrl: "http://old.test/swagger.json" },
      ).sources.api.baseUrl,
      "http://old.test/v2",
    );
  });

  it("fails a call without a base URL with a message, and never calls localhost", async () => {
    const manifest = buildMcpManifest(doc([{ url: "/api/v1" }]));
    assert.deepEqual(sourcesWithoutBaseUrl(manifest), ["api"]);
    assert.deepEqual(sourcesWithoutBaseUrl(manifest, { api: "http://m.test" }), []);
    const f = fakeFetch();
    const result = await createMcpRuntime(manifest, { fetch: f.impl }).callTool("list_pets");
    assert.equal(result.isError, true);
    assert.match(result.content[0].text, /No base URL for the API "api".*Set MCP_BASE_URL/);
    assert.equal(f.calls.length, 0);
    const withBase = createMcpRuntime(manifest, {
      fetch: f.impl,
      baseUrls: { api: "http://m.test/" },
    });
    assert.equal((await withBase.callTool("list_pets")).isError, undefined);
    assert.equal(f.calls[0].url, "http://m.test/pets");
  });

  it("names the base URL as required in the exported project", () => {
    const { files, hostConfig, manifest } = generateMcpServer(doc(null));
    assert.ok(files["README.md"].includes("`MCP_BASE_URL`: **required**"));
    assert.ok(files["README.md"].includes('MCP_BASE_URL="https://api.example.com" npm start'));
    assert.deepEqual(hostEnvFor(manifest), { MCP_BASE_URL: "https://api.example.com" });
    assert.deepEqual(Object.values(JSON.parse(hostConfig).mcpServers)[0].env, hostEnvFor(manifest));
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
      "mcp.json",
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
    assert.ok(files["README.md"].includes("`MCP_AUTH_PETSTORE_AUTH`: the bearer token"));
    assert.ok(
      files["README.md"].includes("`MCP_AUTH_API_KEY`: the API key sent as header `api_key`"),
    );
    assert.ok(
      files["README.md"].includes("`MCP_BASE_URL`: overrides the base URL in the manifest"),
    );
    for (const file of ["README.md", "server.ts", "mcp.json"]) {
      assert.ok(!/API_BASE_URL|[^_]EXTERNAL_HOSTS|`API_KEY`|"API_KEY"/.test(files[file]), file);
    }
    assert.ok(files["server.ts"].includes("baseUrlsFromEnv(manifest, process.env)"));
  });

  it("writes host configuration with one env entry per security scheme", () => {
    const config = JSON.parse(hostConfig);
    // A host starts the server from its own directory: the path is absolute (a placeholder here)
    assert.deepEqual(config.mcpServers.pet_store.args, [
      "-y",
      "tsx",
      "/absolute/path/to/pet-store/server.ts",
    ]);
    assert.ok(files["README.md"].includes("replace the path in `args`"));
    const placed = generateMcpServer(petstore, { serverPath: "/srv/pets/server.ts" });
    assert.equal(
      Object.values(JSON.parse(placed.hostConfig).mcpServers)[0].args[2],
      "/srv/pets/server.ts",
    );
    assert.equal(placed.files["mcp.json"], placed.hostConfig);
    assert.ok(!placed.files["README.md"].includes("replace the path in `args`"));
    assert.deepEqual(config.mcpServers.pet_store.env, {
      MCP_AUTH_PETSTORE_AUTH: "your-petstore-auth",
      MCP_AUTH_API_KEY: "your-api-key",
    });
    // No scheme, no variable: there is no API_KEY shortcut
    assert.deepEqual(JSON.parse(generateHostConfigs("x").claudeDesktopConfig).mcpServers.x.env, {});
    const basic = {
      sources: {
        api: {
          baseUrl: "https://b.test",
          securitySchemes: { login: { type: "http", scheme: "basic" } },
        },
      },
    };
    assert.deepEqual(hostEnvFor(basic), {
      MCP_AUTH_LOGIN_USERNAME: "your-login-username",
      MCP_AUTH_LOGIN_PASSWORD: "your-login-password",
    });
    assert.equal(files["mcp.json"], hostConfig);
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
