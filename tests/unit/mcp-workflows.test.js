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
} from "rapidoc/mcp";
import { indexOperations } from "../../packages/rapidoc/src/utils/arazzo/operations.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const read = (name) => fs.readFileSync(path.join(here, "../../docs/public/specs", name), "utf8");
const petstore = parseYaml(read("petstore.yaml"));
const arazzo = parseYaml(read("petstore.arazzo.yaml"));

/** A non-2xx answer for apiStub. */
const fail = (status, body) => ({ __status: status, body });

/** A fetch stand-in answering by path; `init` holds the request, `calls` what was sent. */
function apiStub(answers) {
  const calls = [];
  const impl = async (url, init) => {
    calls.push({ url, method: init.method, body: init.body && JSON.parse(init.body) });
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
      ["adopt_pet", "order_or_reserve"],
    );
    assert.equal(problems.length, 1);
    assert.equal(problems[0].path, "workflows[2]");
    assert.match(problems[0].message, /registerUser.*jsonpath is not supported/);
    assert.deepEqual(Object.keys(manifest.workflows), ["adoptPet", "orderOrReserve"]);
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
      destructiveHint: false,
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
    assert.deepEqual(Object.keys(written.workflows), ["adoptPet", "orderOrReserve"]);
    assert.ok(files["README.md"].includes("21 tools (2 of them workflows)"));
    assert.equal(problems.length, 1);
  });
});
