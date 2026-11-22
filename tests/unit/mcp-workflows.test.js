import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse as parseYaml } from "yaml";
import {
  buildMcpManifest,
  compileWorkflows,
  createMcpRuntime,
  evaluateCondition,
  evaluateExpression,
  resolveValue,
  generateMcpServer,
  externalHostsFromEnv,
} from "@rapidoc/mcp";
import { indexOperations } from "../../packages/rapidoc/src/utils/arazzo/operations.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const read = (name) =>
  fs.readFileSync(path.join(here, "../../sites/rapidoc/public/specs", name), "utf8");
const petstore = parseYaml(read("petstore.yaml"));
const arazzo = parseYaml(read("petstore.arazzo.yaml"));

/** A non-2xx answer for apiStub. */
const fail = (status, body) => ({ __status: status, body });

/** A fetch stand-in answering by path; `init` holds the request, `calls` what was sent. */
function apiStub(answers) {
  const calls = [];
  const impl = async (url, init) => {
    calls.push({
      url,
      method: init.method,
      headers: init.headers,
      body: init.body && JSON.parse(init.body),
    });
    const key = `${init.method} ${new URL(url).pathname.replace("/api/v3", "")}`;
    const answer = typeof answers[key] === "function" ? answers[key](calls.length) : answers[key];
    const status = answer?.__status ?? 200;
    const body = answer?.__status ? answer.body : (answer ?? {});
    return {
      ok: status < 300,
      status,
      headers: new Map([["content-type", "application/json"]]),
      text: async () => JSON.stringify(body),
    };
  };
  return { impl, calls };
}

describe("mcp: workflows compiled into the manifest", () => {
  const problems = [];
  const manifest = buildMcpManifest(petstore, { arazzo, onProblem: (p) => problems.push(p) });

  it("adds one tool per runnable workflow and leaves out unsupported ones with a reason", () => {
    const wf = manifest.tools.filter((t) => t.workflow);
    assert.deepEqual(
      wf.map((t) => t.name),
      ["adopt_pet", "order_or_reserve", "authenticate_and_order_pet"],
    );
    assert.equal(problems.length, 1);
    assert.equal(problems[0].path, "workflows[2]");
    assert.match(problems[0].message, /registerUser.*jsonpath is not supported/);
    assert.deepEqual(Object.keys(manifest.workflows), [
      "adoptPet",
      "orderOrReserve",
      "authenticateAndOrderPet",
    ]);
    // the manifest's source is named after the Arazzo source, so steps resolve
    assert.deepEqual(Object.keys(manifest.sources), ["petstore"]);
    assert.equal(
      manifest.tools.find((t) => t.name === "get_pet_by_id").operation.source,
      "petstore",
    );
  });

  it("gives a workflow tool its inputs as JSON Schema and annotations from its steps", () => {
    const adopt = manifest.tools.find((t) => t.name === "adopt_pet");
    assert.equal(adopt.description, "Adopt an available pet");
    assert.deepEqual(adopt.inputSchema, {
      type: "object",
      properties: {
        quantity: { type: "integer", default: 1 },
        shipDate: { type: "string", format: "date-time" },
      },
    });
    assert.deepEqual(adopt.annotations, {
      readOnlyHint: false,
      idempotentHint: false,
    });
    assert.equal(adopt.operation, undefined);
  });

  it("resolves every step to a source, method and path, with the operation's security", () => {
    const steps = manifest.workflows.adoptPet.steps;
    assert.deepEqual(
      steps.map((s) => `${s.operation.method} ${s.operation.path}`),
      [
        "GET /pet/findByStatus",
        "GET /pet/{petId}",
        "POST /store/order",
        "GET /store/order/{orderId}",
      ],
    );
    const check = steps[1];
    assert.deepEqual(check.operation.params, [{ name: "petId", in: "path" }]);
    assert.deepEqual(check.parameters, [
      { name: "petId", in: "path", value: "$steps.findAvailable.outputs.petId" },
    ]);
    assert.deepEqual(check.operation.security, [
      { api_key: [] },
      { petstore_auth: ["write:pets", "read:pets"] },
    ]);
    assert.deepEqual(check.onFailure, [
      { name: "pickAnother", type: "goto", criteria: [], stepId: "findAvailable" },
    ]);
    const place = steps[2];
    assert.deepEqual(place.operation.params, [
      { name: "body", in: "body", contentType: "application/json" },
    ]);
    assert.equal(place.requestBody.payload.petId, "$steps.findAvailable.outputs.petId");
    assert.deepEqual(place.onFailure[0], {
      name: "storeBusy",
      type: "retry",
      criteria: [{ condition: "$statusCode == 503" }],
      retryLimit: 3,
      retryAfter: 2,
    });
    // confirmOrder uses an operationPath
    assert.equal(steps[3].operation.path, "/store/order/{orderId}");
    assert.deepEqual(manifest.workflows.adoptPet.outputs, {
      petName: "$steps.checkPet.outputs.name",
      orderId: "$steps.placeOrder.outputs.orderId",
      orderStatus: "$steps.confirmOrder.outputs.status",
    });
  });

  it("merges workflow-level actions into each step and reports steps it cannot run", () => {
    const doc = {
      arazzo: "1.0.1",
      info: { title: "t", version: "1" },
      sourceDescriptions: [{ name: "api", url: "x", type: "openapi" }],
      workflows: [
        {
          workflowId: "w",
          failureActions: [
            { name: "stop", type: "end", criteria: [{ condition: "$statusCode == 500" }] },
          ],
          steps: [
            {
              stepId: "a",
              operationId: "getA",
              onFailure: [{ name: "again", type: "retry", retryLimit: 2 }],
            },
            { stepId: "b", operationId: "missing" },
          ],
        },
        { workflowId: "sub", steps: [{ stepId: "s", workflowId: "w" }] },
        {
          workflowId: "ok",
          steps: [{ stepId: "a", operationId: "getA", outputs: { x: "$workflows.w.outputs.y" } }],
        },
      ],
    };
    const sources = new Map([
      ["api", indexOperations({ paths: { "/a": { get: { operationId: "getA" } } } })],
    ]);
    const problems = [];
    const { tools, workflows } = compileWorkflows(doc, {
      sources,
      onProblem: (p) => problems.push(p),
    });
    assert.deepEqual(tools, []);
    assert.deepEqual(workflows, {});
    assert.deepEqual(
      problems.map((p) => p.message.replace(/^workflow \w+ is left out of the MCP export: /, "")),
      [
        "steps.b: operation missing was not found in api",
        'steps.s: calls workflow "w", which is not supported; has no runnable step',
        "steps.a.outputs.x: $workflows.w.outputs.y refers to another workflow, which is not supported",
      ],
    );
    // with the broken step removed, a's own retry comes first and the workflow's end after it
    doc.workflows[0].steps.pop();
    const compiled = compileWorkflows(doc, { sources });
    assert.deepEqual(
      compiled.workflows.w.steps[0].onFailure.map((a) => [a.name, a.type]),
      [
        ["again", "retry"],
        ["stop", "end"],
      ],
    );
  });

  it("resolves steps on other sources passed as OpenAPI documents, each a manifest source", () => {
    const other = {
      openapi: "3.0.3",
      info: { title: "Tracking", version: "1" },
      servers: [{ url: "https://track.test" }],
      components: { securitySchemes: { key: { type: "apiKey", in: "header", name: "X-Key" } } },
      paths: { "/subscriptions": { post: { operationId: "subscribe", security: [{ key: [] }] } } },
    };
    const doc = {
      ...arazzo,
      sourceDescriptions: [
        { name: "petstore", url: "x", type: "openapi" },
        { name: "tracking", url: "y", type: "openapi" },
      ],
      workflows: [
        {
          workflowId: "twoApis",
          steps: [
            { stepId: "a", operationId: "$sourceDescriptions.petstore.getInventory" },
            { stepId: "b", operationId: "$sourceDescriptions.tracking.subscribe" },
          ],
        },
      ],
    };
    const problems = [];
    const m = buildMcpManifest(petstore, {
      arazzo: doc,
      sources: { tracking: other },
      onProblem: (p) => problems.push(p),
    });
    assert.deepEqual(problems, []);
    assert.deepEqual(Object.keys(m.sources), ["petstore", "tracking"]);
    assert.equal(m.sources.tracking.baseUrl, "https://track.test");
    assert.deepEqual(m.sources.tracking.securitySchemes.key.name, "X-Key");
    const steps = m.workflows.twoApis.steps;
    assert.deepEqual(
      steps.map((st) => [st.operation.source, st.operation.path]),
      [
        ["petstore", "/store/inventory"],
        ["tracking", "/subscriptions"],
      ],
    );
    assert.deepEqual(steps[1].operation.security, [{ key: [] }]);
  });

  it("numbers a workflow tool whose name clashes with an operation's", () => {
    const doc = {
      ...arazzo,
      workflows: [
        { workflowId: "getPetById", steps: [{ stepId: "a", operationId: "getPetById" }] },
      ],
    };
    const { tools } = buildMcpManifest(petstore, { arazzo: doc });
    assert.deepEqual(
      tools.filter((t) => t.name.startsWith("get_pet_by_id")).map((t) => t.name),
      ["get_pet_by_id", "get_pet_by_id_2"],
    );
  });

  it("builds a manifest of the workflows alone with includeOperations: false", () => {
    const doc = {
      ...arazzo,
      workflows: [
        { workflowId: "getPetById", steps: [{ stepId: "a", operationId: "getPetById" }] },
      ],
    };
    const manifest = buildMcpManifest(petstore, { arazzo: doc, includeOperations: false });
    assert.deepEqual(
      manifest.tools.map((t) => t.name),
      ["get_pet_by_id"],
      "no operation tools, so no numbering either",
    );
    assert.ok(manifest.tools[0].workflow);
    assert.deepEqual(manifest.resources, []);
    assert.ok(
      Object.keys(manifest.sources).length,
      "the sources stay: the runtime resolves steps through them",
    );
  });
});

describe("mcp: runtime expressions and conditions", () => {
  const ctx = {
    inputs: { quantity: 2, who: { name: "Ann" } },
    steps: { find: { outputs: { petId: 7 } } },
    request: { url: "http://x/pets?status=a", method: "GET", headers: { "X-Trace": "t1" } },
    response: {
      status: 200,
      headers: { "Content-Type": "application/json" },
      body: { id: 7, status: "placed", tags: [{ name: "a/b" }] },
    },
  };

  it("reads inputs, step outputs, the status code, bodies by pointer and headers by name", () => {
    assert.equal(evaluateExpression("$inputs.quantity", ctx), 2);
    assert.equal(evaluateExpression("$inputs.who.name", ctx), "Ann");
    assert.equal(evaluateExpression("$steps.find.outputs.petId", ctx), 7);
    assert.equal(evaluateExpression("$statusCode", ctx), 200);
    assert.deepEqual(evaluateExpression("$response.body", ctx), ctx.response.body);
    assert.equal(evaluateExpression("$response.body#/tags/0/name", ctx), "a/b");
    assert.equal(evaluateExpression("$response.header.content-type", ctx), "application/json");
    assert.equal(evaluateExpression("$request.header.x-trace", ctx), "t1");
    assert.equal(evaluateExpression("$url", ctx), "http://x/pets?status=a");
    assert.equal(evaluateExpression("$inputs.missing", ctx), undefined);
    assert.equal(evaluateExpression("plain", ctx), undefined);
  });

  it("fills expressions into values and interpolates {$expr} in text", () => {
    assert.deepEqual(
      resolveValue(
        {
          petId: "$steps.find.outputs.petId",
          note: "pet {$steps.find.outputs.petId} x{$inputs.quantity}",
          list: ["$inputs.quantity", "fixed"],
        },
        ctx,
      ),
      { petId: 7, note: "pet 7 x2", list: [2, "fixed"] },
    );
  });

  it("evaluates simple conditions with comparisons, logic and literals", () => {
    const t = (c) => evaluateCondition(c, ctx);
    assert.equal(t("$statusCode == 200"), true);
    assert.equal(t("$statusCode == '200'"), true);
    assert.equal(t("$response.body#/status == 'placed'"), true);
    assert.equal(t('$response.body#/status != "placed"'), false);
    assert.equal(t("$response.body#/id > 5 && $inputs.quantity <= 2"), true);
    assert.equal(t("$statusCode == 500 || $response.body#/missing == null"), true);
    assert.equal(t("!($statusCode >= 300)"), true);
    assert.equal(t("$response.body#/tags != null"), true);
    assert.throws(() => t("$statusCode === 200"), /Cannot parse|Unexpected/);
  });
});

describe("mcp: the runtime runs workflows", () => {
  const manifest = buildMcpManifest(petstore, { arazzo });
  const run = (answers, name, args, options = {}) => {
    const stub = apiStub(answers);
    const steps = [];
    const runtime = createMcpRuntime(manifest, {
      fetch: stub.impl,
      credentials: { api_key: "k" },
      sleep: async (ms) => steps.push(`sleep ${ms}`),
      ...options,
    });
    return runtime
      .callTool(name, args, { onStep: (s) => steps.push(`${s.stepId}#${s.attempt} ${s.outcome}`) })
      .then((result) => ({ result, steps, calls: stub.calls }));
  };

  it("adds the headers requestHeaders returns to that step's request", async () => {
    const stub = apiStub({
      "GET /pet/findByStatus": [{ id: 7, name: "Rex" }],
      "GET /pet/7": { id: 7, name: "Rex" },
      "POST /store/order": { id: 99 },
      "GET /store/order/99": { id: 99, status: "placed" },
    });
    const runtime = createMcpRuntime(manifest, { fetch: stub.impl });
    const seen = [];
    await runtime.callTool(
      "adopt_pet",
      {},
      {
        requestHeaders: (e) => {
          seen.push(`${e.stepId}#${e.attempt} ${e.operation.method}`);
          return e.stepId === "placeOrder" ? { Prefer: "code=503" } : undefined;
        },
      },
    );
    assert.deepEqual(seen, [
      "findAvailable#1 GET",
      "checkPet#1 GET",
      "placeOrder#1 POST",
      "confirmOrder#1 GET",
    ]);
    const order = stub.calls.find((c) => c.method === "POST");
    assert.equal(order.headers?.Prefer, "code=503");
    assert.ok(!stub.calls.find((c) => c.url.includes("findByStatus")).headers?.Prefer);
  });

  it("passes outputs between steps and returns the workflow outputs", async () => {
    const { result, steps, calls } = await run(
      {
        "GET /pet/findByStatus": [{ id: 7, name: "Rex" }],
        "GET /pet/7": { id: 7, name: "Rex" },
        "POST /store/order": { id: 99 },
        "GET /store/order/99": { id: 99, status: "placed" },
      },
      "adopt_pet",
      { quantity: 2 },
    );
    assert.deepEqual(result.structuredContent, {
      petName: "Rex",
      orderId: 99,
      orderStatus: "placed",
    });
    assert.deepEqual(steps, [
      "findAvailable#1 success",
      "checkPet#1 success",
      "placeOrder#1 success",
      "confirmOrder#1 success",
    ]);
    assert.equal(
      calls[0].url,
      "https://petstore3.swagger.io/api/v3/pet/findByStatus?status=available",
    );
    assert.deepEqual(calls[2].body, { petId: 7, quantity: 2, status: "placed" });
  });

  it("retries on a matching failure action, then gives up with the step's response", async () => {
    let orders = 0;
    const answers = {
      "GET /pet/findByStatus": [{ id: 7 }],
      "GET /pet/7": { name: "Rex" },
      "POST /store/order": () => (++orders < 3 ? fail(503, { error: "busy" }) : { id: 5 }),
      "GET /store/order/5": { status: "placed" },
    };
    const { result, steps } = await run(answers, "adopt_pet", {});
    assert.equal(result.isError, undefined);
    assert.deepEqual(steps.slice(2), [
      "placeOrder#1 failure",
      "sleep 2000",
      "placeOrder#2 failure",
      "sleep 2000",
      "placeOrder#3 success",
      "confirmOrder#1 success",
    ]);

    const { result: failed } = await run(
      { ...answers, "POST /store/order": fail(503, { error: "busy" }) },
      "adopt_pet",
      {},
    );
    assert.equal(failed.isError, true);
    assert.match(
      failed.content[0].text,
      /failed at step placeOrder: \$statusCode == 200 \(after 3 retries\)\nHTTP 503/,
    );
  });

  it("follows goto on success and ends where the workflow says", async () => {
    const inStock = await run(
      {
        "GET /store/inventory": { available: 3 },
        "GET /pet/4": { name: "Tom" },
        "POST /store/order": { id: 8 },
      },
      "order_or_reserve",
      { petId: 4 },
    );
    assert.deepEqual(inStock.steps, [
      "checkInventory#1 success",
      "readPet#1 success",
      "placeOrder#1 success",
    ]);
    assert.deepEqual(inStock.result.structuredContent, {
      petName: "Tom",
      orderId: 8,
      reservedPetId: undefined,
    });

    const soldOut = await run(
      {
        "GET /store/inventory": { available: 0 },
        "GET /pet/findByStatus": [{ id: 11 }],
        "POST /pet/11": {},
      },
      "order_or_reserve",
      { petId: 4 },
    );
    assert.deepEqual(soldOut.steps, [
      "checkInventory#1 success",
      "findPending#1 success",
      "markWanted#1 success",
    ]);
    assert.equal(soldOut.result.structuredContent.reservedPetId, 11);
    assert.ok(soldOut.calls[2].url.endsWith("/pet/11?status=wanted"));
  });

  it("stops a goto loop after maxStepRuns, naming the jump back, and stops on a signal", async () => {
    // checkPet always fails, and its pickAnother goes back to findAvailable: a loop with no end
    const answers = {
      "GET /pet/findByStatus": [{ id: 7 }],
      "GET /pet/7": fail(404, { error: "gone" }),
    };
    const steps = [];
    const runtime = createMcpRuntime(manifest, {
      fetch: apiStub(answers).impl,
      credentials: { api_key: "k" },
    });
    const looped = await runtime.callTool(
      "adopt_pet",
      {},
      { maxStepRuns: 6, onStep: (e) => steps.push(e.stepId) },
    );
    assert.equal(looped.isError, true);
    assert.equal(
      looped.content[0].text,
      "Workflow adoptPet stopped after 6 steps: it kept going back from checkPet to findAvailable (pickAnother)",
    );
    assert.deepEqual(steps, [
      "findAvailable",
      "checkPet",
      "findAvailable",
      "checkPet",
      "findAvailable",
      "checkPet",
    ]);

    // a signal stops the run before its next step
    const abort = new AbortController();
    const stopped = await runtime.callTool(
      "adopt_pet",
      {},
      { signal: abort.signal, onStep: () => abort.abort() },
    );
    assert.equal(stopped.content[0].text, "Workflow adoptPet was stopped before step checkPet");
  });

  it("treats a non-2xx response as a failure when a step has no criteria", async () => {
    const { result, steps } = await run(
      { "GET /store/inventory": { available: 3 }, "GET /pet/4": fail(404, { message: "no pet" }) },
      "order_or_reserve",
      { petId: 4 },
    );
    assert.deepEqual(steps, ["checkInventory#1 success", "readPet#1 failure"]);
    assert.match(result.content[0].text, /failed at step readPet: HTTP 404\nHTTP 404/);
  });

  it("fills in inputs the caller left out from their defaults", async () => {
    const answers = {
      "GET /pet/findByStatus": [{ id: 7 }],
      "GET /pet/7": { name: "Rex" },
      "POST /store/order": { id: 5 },
      "GET /store/order/5": { status: "placed" },
    };
    // adoptPet's quantity defaults to 1; an explicit value still wins
    const left = await run(answers, "adopt_pet", {});
    assert.equal(left.calls.find((c) => c.method === "POST").body.quantity, 1);
    const given = await run(answers, "adopt_pet", { quantity: 3 });
    assert.equal(given.calls.find((c) => c.method === "POST").body.quantity, 3);
  });

  it("ends the workflow on a failure action and checks required inputs", async () => {
    const { result, steps } = await run({ "GET /pet/findByStatus": [] }, "adopt_pet", {});
    assert.equal(result.isError, true);
    assert.deepEqual(steps, ["findAvailable#1 failure"]);
    assert.match(
      result.content[0].text,
      /failed at step findAvailable: \$response.body#\/0 != null/,
    );
    const required = {
      ...manifest,
      workflows: {
        ...manifest.workflows,
        adoptPet: {
          ...manifest.workflows.adoptPet,
          inputs: { type: "object", required: ["quantity"] },
        },
      },
    };
    const runtime = createMcpRuntime(required, { fetch: apiStub({}).impl });
    assert.equal(
      (await runtime.callTool("adopt_pet", {})).content[0].text,
      "Missing input quantity",
    );
  });

  it("writes the workflows into the exported manifest", () => {
    const { files, problems } = generateMcpServer(petstore, { arazzo, serverName: "petstore" });
    const written = JSON.parse(files["manifest.json"]);
    assert.deepEqual(Object.keys(written.workflows), [
      "adoptPet",
      "orderOrReserve",
      "authenticateAndOrderPet",
    ]);
    assert.ok(files["README.md"].includes("22 tools (3 of them workflows)"));
    assert.equal(problems.length, 1);
  });
});

describe("mcp: x-security credentials of workflows and steps", () => {
  /** An Arazzo document with one workflow of two steps on the petstore source. */
  const doc = (workflowSecurity, stepSecurity, extraStep = {}) => ({
    arazzo: "1.0.1",
    info: { title: "Secure", version: "1" },
    sourceDescriptions: [{ name: "petstore", url: "./petstore.yaml", type: "openapi" }],
    workflows: [
      {
        workflowId: "secure",
        inputs: {
          type: "object",
          properties: { key: { type: "string", format: "password" }, token: { type: "string" } },
        },
        ...(workflowSecurity && { "x-security": workflowSecurity }),
        steps: [
          {
            stepId: "getPet",
            operationId: "getPetById",
            parameters: [{ name: "petId", in: "path", value: 1 }],
            ...(stepSecurity && { "x-security": stepSecurity }),
            outputs: { name: "$response.body#/name" },
          },
          { stepId: "inventory", operationId: "getInventory", ...extraStep },
        ],
      },
    ],
  });
  const runDoc = async (arazzoDoc, args = {}, credentials = {}) => {
    const problems = [];
    const manifest = buildMcpManifest(petstore, {
      arazzo: arazzoDoc,
      onProblem: (p) => problems.push(p.message),
    });
    const stub = apiStub({ "GET /pet/1": { name: "Rex" }, "GET /store/inventory": {} });
    const runtime = createMcpRuntime(manifest, { fetch: stub.impl, credentials });
    const result = manifest.workflows.secure ? await runtime.callTool("secure", args) : null;
    return { manifest, problems, result, calls: stub.calls };
  };

  it("compiles a named scheme and an inline one, the workflow's first, values kept as written", () => {
    const { manifest, problems } = buildMcpManifestWithProblems(
      doc(
        [{ scheme: { type: "http", scheme: "bearer" }, values: { token: "$inputs.token" } }],
        [{ schemeName: "api_key", values: { apiKey: "$inputs.key" } }],
      ),
    );
    assert.deepEqual(problems, []);
    assert.deepEqual(manifest.workflows.secure.steps[0].security, [
      { scheme: { type: "http", scheme: "bearer" }, values: { token: "$inputs.token" } },
      {
        scheme: { type: "apiKey", in: "header", name: "api_key" },
        values: { apiKey: "$inputs.key" },
      },
    ]);
    assert.deepEqual(manifest.workflows.secure.steps[1].security, [
      { scheme: { type: "http", scheme: "bearer" }, values: { token: "$inputs.token" } },
    ]);
  });

  it("sends each scheme's credential, filled in from the inputs, on every step it applies to", async () => {
    const { calls } = await runDoc(
      doc(
        [{ scheme: { type: "http", scheme: "bearer" }, values: { token: "$inputs.token" } }],
        [{ schemeName: "api_key", values: { apiKey: "$inputs.key" } }],
      ),
      { key: "k-1", token: "t-1" },
    );
    assert.equal(calls[0].headers.api_key, "k-1");
    assert.equal(calls[0].headers.Authorization, "Bearer t-1");
    assert.equal(calls[1].headers.api_key, undefined);
    assert.equal(calls[1].headers.Authorization, "Bearer t-1");
  });

  it("sends HTTP Basic, an API key in the query and in a cookie", async () => {
    const { calls } = await runDoc(
      doc(null, [
        {
          scheme: { type: "http", scheme: "basic" },
          values: { username: "ann", password: "$inputs.key" },
        },
        { scheme: { type: "apiKey", in: "query", name: "key" }, values: { apiKey: "q:1" } },
        { scheme: { type: "apiKey", in: "cookie", name: "sid" }, values: { apiKey: "c 1" } },
      ]),
      { key: "secret" },
    );
    assert.equal(calls[0].headers.Authorization, `Basic ${btoa("ann:secret")}`);
    assert.ok(calls[0].url.endsWith("/pet/1?key=q%3A1"), calls[0].url);
    assert.equal(calls[0].headers.Cookie, "sid=c%201");
  });

  it("lets the step's credential win over the workflow's and the typed credentials", async () => {
    const { calls } = await runDoc(
      doc(
        [{ schemeName: "api_key", values: { apiKey: "from-workflow" } }],
        [{ scheme: { type: "apiKey", in: "header", name: "API_KEY" }, values: { apiKey: "step" } }],
      ),
      {},
      { api_key: "typed" },
    );
    const keys = Object.entries(calls[0].headers).filter(([h]) => h.toLowerCase() === "api_key");
    assert.deepEqual(keys, [["API_KEY", "step"]]);
    assert.equal(calls[1].headers.api_key, "from-workflow");
  });

  it("sends nothing for an input that was not given, keeping the typed credential", async () => {
    const { calls } = await runDoc(
      doc(null, [{ schemeName: "api_key", values: { apiKey: "$inputs.key" } }]),
      {},
      { api_key: "typed" },
    );
    assert.equal(calls[0].headers.api_key, "typed");
  });

  it("leaves out a workflow whose x-security cannot be sent, saying why", async () => {
    const cases = [
      [[{ schemeName: "nope", values: { apiKey: "x" } }], 'no security scheme "nope" in petstore'],
      [
        [{ scheme: { type: "http", scheme: "digest" }, values: { username: "a", password: "b" } }],
        "digest security is not supported",
      ],
      [[{ schemeName: "api_key", values: { token: "x" } }], "values needs apiKey"],
      [
        [{ schemeName: "api_key", scheme: { type: "http", scheme: "bearer" }, values: {} }],
        "needs exactly one of schemeName or scheme",
      ],
    ];
    for (const [security, why] of cases) {
      const { manifest, problems } = await runDoc(doc(null, security));
      assert.equal(manifest.workflows.secure, undefined);
      assert.ok(problems[0].includes(`steps.getPet.x-security[0]: ${why}`), problems[0]);
    }
  });
});

function buildMcpManifestWithProblems(arazzoDoc) {
  const problems = [];
  const manifest = buildMcpManifest(petstore, {
    arazzo: arazzoDoc,
    onProblem: (p) => problems.push(p.message),
  });
  return { manifest, problems };
}

describe("mcp: allowReserved and x-allowReserved query parameters", () => {
  const VALUE = "https://example.com/path/to;x,y(z)a*b.c[1]@v";
  /** The petstore with allowReserved on findPetsByStatus's status, through a component $ref. */
  const reservedPetstore = () => {
    const spec = structuredClone(petstore);
    const op = spec.paths["/pet/findByStatus"].get;
    spec.components.parameters = { Status: { ...op.parameters[0], allowReserved: true } };
    op.parameters = [{ $ref: "#/components/parameters/Status" }];
    return spec;
  };
  const workflowDoc = (param) => ({
    arazzo: "1.0.1",
    info: { title: "Reserved", version: "1" },
    sourceDescriptions: [{ name: "petstore", url: "./petstore.yaml", type: "openapi" }],
    workflows: [
      {
        workflowId: "filter",
        steps: [
          {
            stepId: "find",
            operationId: "findPetsByStatus",
            parameters: [{ name: "status", in: "query", value: VALUE, ...param }],
          },
        ],
      },
    ],
  });
  const firstUrl = async (spec, doc) => {
    const manifest = buildMcpManifest(spec, { arazzo: doc, includeOperations: false });
    const stub = apiStub({ "GET /pet/findByStatus": [] });
    await createMcpRuntime(manifest, { fetch: stub.impl }).callTool("filter", {});
    return stub.calls[0].url;
  };

  it("percent-encodes reserved characters by default", async () => {
    const url = await firstUrl(petstore, workflowDoc({}));
    assert.ok(url.includes("status=https%3A%2F%2Fexample.com"), url);
  });

  it("keeps them with x-allowReserved: true on the step's parameter, all but #", async () => {
    assert.ok(
      (await firstUrl(petstore, workflowDoc({ "x-allowReserved": true }))).endsWith(
        `?status=${VALUE}`,
      ),
    );
    const doc = workflowDoc({ "x-allowReserved": true });
    doc.workflows[0].steps[0].parameters[0].value = "a b#c&d=e";
    assert.ok((await firstUrl(petstore, doc)).endsWith("?status=a%20b%23c&d=e"));
  });

  it("follows the OpenAPI parameter's allowReserved, which x-allowReserved: false turns off", async () => {
    assert.ok((await firstUrl(reservedPetstore(), workflowDoc({}))).endsWith(`?status=${VALUE}`));
    const url = await firstUrl(reservedPetstore(), workflowDoc({ "x-allowReserved": false }));
    assert.ok(url.includes("status=https%3A%2F%2F"), url);
  });

  it("honors allowReserved in operation tools too", async () => {
    const manifest = buildMcpManifest(reservedPetstore());
    const tool = manifest.tools.find((t) => t.name === "find_pets_by_status");
    assert.deepEqual(tool.operation.params[0], {
      name: "status",
      in: "query",
      allowReserved: true,
    });
    const stub = apiStub({ "GET /pet/findByStatus": [] });
    await createMcpRuntime(manifest, { fetch: stub.impl }).callTool(tool.name, { status: VALUE });
    assert.ok(stub.calls[0].url.endsWith(`?status=${VALUE}`), stub.calls[0].url);
  });
});

describe("mcp: x-operation steps", () => {
  /** getPet on the petstore, then a call to a URL outside it; `ext` is the second step. */
  const doc = (ext, first = {}) => ({
    arazzo: "1.0.1",
    info: { title: "External", version: "1" },
    sourceDescriptions: [{ name: "petstore", url: "./petstore.yaml", type: "openapi" }],
    workflows: [
      {
        workflowId: "ext",
        inputs: { type: "object", properties: { token: { type: "string" } } },
        steps: [
          {
            stepId: "getPet",
            operationId: "getPetById",
            parameters: [{ name: "petId", in: "path", value: 1 }],
            outputs: { photo: "$response.body#/photoUrls/0" },
            ...first,
          },
          { stepId: "fetchPhoto", ...ext, outputs: { size: "$response.body#/size" } },
        ],
        outputs: { size: "$steps.fetchPhoto.outputs.size" },
      },
    ],
  });
  const compile = (d) => {
    const problems = [];
    const manifest = buildMcpManifest(petstore, {
      arazzo: d,
      includeOperations: false,
      onProblem: (p) => problems.push(p.message),
    });
    return { manifest, problems };
  };
  /** Runs the workflow; getPet answers with a photo at `photo`, anything else with `{ size: 9 }`. */
  const run = async (d, photo, runtimeOptions = {}, args = {}) => {
    const { manifest, problems } = compile(d);
    const calls = [];
    const fetchImpl = async (url, init) => {
      calls.push({ url, method: init.method, headers: init.headers });
      const body = url.includes("/api/v3/pet/1") ? { photoUrls: [photo] } : { size: 9 };
      return {
        ok: true,
        status: 200,
        headers: new Map([["content-type", "application/json"]]),
        text: async () => JSON.stringify(body),
      };
    };
    const runtime = createMcpRuntime(manifest, { fetch: fetchImpl, ...runtimeOptions });
    const result = manifest.workflows.ext ? await runtime.callTool("ext", args) : null;
    return { manifest, problems, result, calls };
  };

  it("compiles the step to its URL and method, with no source or path", () => {
    const { manifest, problems } = compile(
      doc({
        "x-operation": { url: "https://cdn.example.com/photos/{id}", method: "get" },
        parameters: [
          { name: "id", in: "path", value: "$steps.getPet.outputs.photo" },
          { name: "q", in: "query", value: "a:b", "x-allowReserved": true },
        ],
      }),
    );
    assert.deepEqual(problems, []);
    assert.deepEqual(manifest.workflows.ext.steps[1].operation, {
      source: "",
      method: "GET",
      url: "https://cdn.example.com/photos/{id}",
      params: [
        { name: "id", in: "path" },
        { name: "q", in: "query", allowReserved: true },
      ],
      security: [],
    });
  });

  it("calls a written-out URL with its parameters and inline x-security, no source credentials", async () => {
    const { result, calls } = await run(
      doc({
        "x-operation": { url: "https://cdn.example.com/photos/{id}?v=2", method: "POST" },
        parameters: [
          { name: "id", in: "path", value: "a b" },
          { name: "size", in: "query", value: "large" },
        ],
        "x-security": [
          { scheme: { type: "http", scheme: "bearer" }, values: { token: "$inputs.token" } },
        ],
      }),
      "",
      { credentials: { api_key: "k" } },
      { token: "t" },
    );
    assert.equal(result.isError, undefined, result.content[0].text);
    assert.deepEqual(result.structuredContent, { size: 9 });
    assert.equal(calls[1].method, "POST");
    assert.equal(calls[1].url, "https://cdn.example.com/photos/a%20b?v=2&size=large");
    assert.equal(calls[1].headers.Authorization, "Bearer t");
    assert.equal(calls[1].headers.api_key, undefined);
  });

  it("calls a URL an earlier step returned, on a host the workflow names", async () => {
    const ext = doc({ "x-operation": { url: "$steps.getPet.outputs.photo", method: "get" } });
    const { result, calls } = await run(ext, "https://petstore3.swagger.io/photos/1.png");
    assert.equal(result.isError, undefined, result.content[0].text);
    assert.equal(calls[1].url, "https://petstore3.swagger.io/photos/1.png");
  });

  it("refuses a URL computed at run time on another host, unless externalHosts allows it", async () => {
    const ext = doc({ "x-operation": { url: "$steps.getPet.outputs.photo", method: "get" } });
    const photo = "http://169.254.169.254/latest/meta-data";
    const refused = await run(ext, photo);
    assert.equal(refused.calls.length, 1);
    assert.ok(
      refused.result.content[0].text.includes(
        "x-operation URL host 169.254.169.254 is not allowed",
      ),
      refused.result.content[0].text,
    );
    const listed = await run(ext, "https://cdn.example.com/1.png", {
      externalHosts: ["cdn.example.com"],
    });
    assert.equal(listed.calls[1].url, "https://cdn.example.com/1.png");
    const any = await run(ext, photo, { externalHosts: ["*"] });
    assert.equal(any.calls[1].url, photo);
    // A written-out URL's host makes it known, for URLs computed later
    const known = await run(
      doc(
        { "x-operation": { url: "$steps.getPet.outputs.photo", method: "get" } },
        { "x-operation": { url: "https://cdn.example.com/pet/1", method: "get" }, parameters: [] },
      ),
      "",
    );
    assert.equal(known.calls[0].url, "https://cdn.example.com/pet/1");
  });

  it("fails the step on a URL that is not absolute once filled in", async () => {
    const ext = doc({ "x-operation": { url: "$steps.getPet.outputs.photo", method: "get" } });
    const { result, calls } = await run(ext, "/relative.png", { externalHosts: ["*"] });
    assert.equal(calls.length, 1);
    assert.ok(
      result.content[0].text.includes('x-operation URL "/relative.png" is not an absolute'),
    );
  });

  it("leaves out a workflow whose x-operation cannot run, saying why", () => {
    const cases = [
      [
        { "x-operation": { url: "/relative", method: "get" } },
        "must be an absolute http or https URL",
      ],
      [
        { "x-operation": { url: "https://a.example", method: "fetch" } },
        '"fetch" is not an HTTP method',
      ],
      [
        {
          "x-operation": { url: "https://a.example", method: "get" },
          parameters: [{ name: "id", in: "path", value: 1 }],
        },
        "the x-operation URL has no {id}",
      ],
      [
        {
          "x-operation": { url: "https://a.example", method: "get" },
          "x-security": [{ schemeName: "api_key", values: { apiKey: "k" } }],
        },
        "schemeName can't be used with x-operation",
      ],
    ];
    for (const [ext, why] of cases) {
      const { manifest, problems } = compile(doc(ext));
      assert.equal(manifest.workflows.ext, undefined);
      assert.ok(problems[0].includes(why), problems[0]);
    }
  });

  it("documents EXTERNAL_HOSTS in the export when a URL is computed at run time", () => {
    const dynamic = doc({ "x-operation": { url: "$steps.getPet.outputs.photo", method: "get" } });
    const fixed = doc({ "x-operation": { url: "https://cdn.example.com/x", method: "get" } });
    const readme = (d) => generateMcpServer(petstore, { arazzo: d }).files["README.md"];
    assert.ok(readme(dynamic).includes("`EXTERNAL_HOSTS`"));
    assert.ok(!readme(fixed).includes("EXTERNAL_HOSTS"));
    assert.ok(
      generateMcpServer(petstore, { arazzo: dynamic }).files["server.ts"].includes(
        "externalHosts: externalHostsFromEnv(process.env)",
      ),
    );
  });
});

describe("mcp: EXTERNAL_HOSTS", () => {
  it("reads the comma-separated hosts, blanks dropped", () => {
    assert.deepEqual(externalHostsFromEnv({}), []);
    assert.deepEqual(externalHostsFromEnv({ EXTERNAL_HOSTS: " cdn.example.com, ,a.test:8443 " }), [
      "cdn.example.com",
      "a.test:8443",
    ]);
    assert.deepEqual(externalHostsFromEnv({ EXTERNAL_HOSTS: "*" }), ["*"]);
  });
});
