import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  parseDocument,
  validateArazzo,
  collectRefs,
  indexOperations,
  indexResolvedSpec,
  resolveOperation,
  buildFlowGraph,
  renderArazzoWorkflow,
  describeAction,
} from "../../packages/rapidoc/src/utils/arazzo/index.js";
import {
  readCriteria,
  readActions,
  mergeActions,
} from "../../packages/rapidoc/src/utils/arazzo/actions.js";
import { getFlowCss } from "@rapidoc/prerender";

const specsDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../docs/public/specs",
);
const arazzoText = fs.readFileSync(path.join(specsDir, "petstore.arazzo.yaml"), "utf8");
const petstoreText = fs.readFileSync(path.join(specsDir, "petstore.yaml"), "utf8");
const orderText = fs.readFileSync(path.join(specsDir, "petstore-order.arazzo.yaml"), "utf8");
// The outputs box of a rendered diagram
const outputsBox = (svg) => svg.slice(svg.indexOf('class="rf-node rf-io rf-outputs"'));

function minimal(overrides = {}) {
  return {
    arazzo: "1.0.1",
    info: { title: "T", version: "1" },
    sourceDescriptions: [{ name: "api", url: "./api.yaml", type: "openapi" }],
    workflows: [{ workflowId: "w", steps: [{ stepId: "a", operationId: "getA" }] }],
    ...overrides,
  };
}

describe("arazzo: parsing and validation", () => {
  it("parses YAML and JSON text", () => {
    assert.equal(parseDocument("arazzo: 1.0.1\n").arazzo, "1.0.1");
    assert.equal(parseDocument('{"arazzo":"1.1.0"}').arazzo, "1.1.0");
    assert.throws(() => parseDocument("   "), /empty/);
  });

  it("accepts the sample petstore workflows", () => {
    assert.deepEqual(validateArazzo(parseDocument(arazzoText)), []);
  });

  it("reports missing fields, duplicates and bad step targets", () => {
    const doc = minimal({
      arazzo: "2.0",
      workflows: [
        {
          workflowId: "w",
          steps: [
            { stepId: "a", operationId: "getA", operationPath: "{$sourceDescriptions.api.url}#/x" },
            { stepId: "a" },
          ],
        },
      ],
    });
    const messages = validateArazzo(doc).map((p) => `${p.path} ${p.message}`);
    assert.ok(messages.includes("arazzo must be an Arazzo 1.x version string"));
    assert.ok(messages.includes("workflows[0].steps[1].stepId is a duplicate"));
    assert.equal(
      messages.filter((m) =>
        m.endsWith("needs exactly one of operationId, operationPath or workflowId"),
      ).length,
      2,
    );
  });

  it("checks goto targets, retry on success and step references", () => {
    const doc = minimal({
      workflows: [
        {
          workflowId: "w",
          steps: [
            {
              stepId: "a",
              operationId: "getA",
              onSuccess: [{ name: "r", type: "retry" }],
              onFailure: [{ name: "g", type: "goto", stepId: "nowhere" }],
            },
            {
              stepId: "b",
              operationId: "getB",
              parameters: [{ name: "id", in: "path", value: "$steps.zzz.outputs.id" }],
            },
          ],
        },
      ],
    });
    const messages = validateArazzo(doc).map((p) => p.message);
    assert.ok(messages.includes("retry is only allowed on failure"));
    assert.ok(messages.includes('no step "nowhere"'));
    assert.ok(messages.includes('refers to unknown step "zzz"'));
  });

  it("resolves reusable actions from components", () => {
    const doc = minimal({
      components: { failureActions: { again: { name: "again", type: "retry", retryLimit: 2 } } },
      workflows: [
        {
          workflowId: "w",
          steps: [
            {
              stepId: "a",
              operationId: "getA",
              onFailure: [{ reference: "$components.failureActions.again" }],
            },
          ],
        },
      ],
    });
    assert.deepEqual(validateArazzo(doc), []);
    const graph = buildFlowGraph(doc);
    assert.equal(graph.steps[0].actions[0].type, "retry");
    assert.equal(graph.steps[0].actions[0].retryLimit, 2);
  });
});

describe("arazzo: criteria and actions as written", () => {
  const doc = {
    components: {
      failureActions: { again: { name: "again", type: "retry", retryLimit: 4 } },
    },
  };
  it("reads criteria with a condition, keeping each one's position", () => {
    assert.deepEqual(
      readCriteria([
        { condition: "$statusCode == 200" },
        null,
        { nope: 1 },
        { condition: "$.ok", context: "$response.body", type: { type: "jsonpath" } },
      ]),
      [
        { index: 0, condition: "$statusCode == 200", context: "", type: "simple" },
        { index: 3, condition: "$.ok", context: "$response.body", type: "jsonpath" },
      ],
    );
    assert.deepEqual(readCriteria(undefined), []);
  });
  it("resolves references and leaves out unknown types and unresolved references", () => {
    const read = readActions(
      doc,
      [
        { reference: "$components.failureActions.again" },
        { name: "odd", type: "explode" },
        { reference: "$components.failureActions.missing" },
        { type: "goto", stepId: "b", criteria: [{ condition: "$statusCode == 404" }] },
      ],
      "failureActions",
    );
    assert.deepEqual(
      read.map((a) => [a.index, a.type, a.name, a.stepId, a.retryLimit, a.retryAfter]),
      [
        [0, "retry", "again", "", 4, undefined],
        [3, "goto", "", "b", undefined, undefined],
      ],
    );
    assert.equal(read[1].criteria[0].condition, "$statusCode == 404");
  });
  it("merges the workflow's actions after the step's own, minus those overridden by name", () => {
    const own = [{ name: "again" }, { name: "" }];
    const inherited = [{ name: "again", from: "workflow" }, { name: "stop" }, { name: "" }];
    assert.deepEqual(mergeActions(own, inherited), [
      { name: "again" },
      { name: "" },
      { name: "stop" },
      { name: "" },
    ]);
  });
});

describe("arazzo: references and operations", () => {
  it("collects input, step and workflow references once each", () => {
    const refs = collectRefs({
      a: "$inputs.user",
      b: ["$steps.login.outputs.token", "Bearer {$steps.login.outputs.token}"],
      c: "$workflows.other.outputs.id",
    });
    assert.deepEqual(
      refs.map((r) => [r.kind, r.stepId || r.workflowId || "", r.name]),
      [
        ["input", "", "user"],
        ["step", "login", "token"],
        ["workflow", "other", "id"],
      ],
    );
  });

  it("finds operations by operationId, qualified operationId and operationPath", () => {
    const sources = new Map([["petstore", indexOperations(parseDocument(petstoreText))]]);
    assert.equal(resolveOperation({ operationId: "getPetById" }, sources).path, "/pet/{petId}");
    assert.equal(
      resolveOperation({ operationId: "$sourceDescriptions.petstore.placeOrder" }, sources).method,
      "post",
    );
    const op = resolveOperation(
      { operationPath: "{$sourceDescriptions.petstore.url}#/paths/~1store~1order~1{orderId}/get" },
      sources,
    );
    assert.equal(op.operationId, "getOrderById");
    assert.equal(resolveOperation({ operationId: "nope" }, sources), null);
  });
});

describe("arazzo: operations from <rapi-doc>'s resolved spec", () => {
  it("indexes tags[].paths[] like a raw document, skipping webhooks", () => {
    const index = indexResolvedSpec({
      tags: [
        {
          paths: [
            { method: "get", path: "/pet/{petId}", operationId: "getPetById", summary: "Find pet" },
            { method: "post", path: "/hook", operationId: "onEvent", isWebhook: true },
          ],
        },
        { paths: [{ method: "GET", path: "/pet/{petId}", operationId: "getPetById" }] },
      ],
    });
    assert.deepEqual(index.byId.get("getPetById"), {
      operationId: "getPetById",
      method: "get",
      path: "/pet/{petId}",
      summary: "Find pet",
    });
    assert.equal(index.byId.has("onEvent"), false);
    const sources = new Map([["petstore", index]]);
    assert.equal(resolveOperation({ operationId: "getPetById" }, sources).path, "/pet/{petId}");
    assert.equal(
      resolveOperation(
        { operationPath: "{$sourceDescriptions.petstore.url}#/paths/~1pet~1{petId}/get" },
        sources,
      ).operationId,
      "getPetById",
    );
  });
});

describe("arazzo: flow graph", () => {
  const doc = parseDocument(arazzoText);
  const sources = new Map([["petstore", indexOperations(parseDocument(petstoreText))]]);

  it("builds steps, values passed between them and actions", () => {
    const graph = buildFlowGraph(doc, "adoptPet", { sources });
    assert.deepEqual(
      graph.steps.map((s) => s.stepId),
      ["findAvailable", "checkPet", "placeOrder", "confirmOrder"],
    );
    assert.deepEqual(graph.inputs, ["quantity", "shipDate"]);
    assert.deepEqual(graph.steps[2].inputs, ["quantity", "shipDate"]);
    assert.ok(graph.dataEdges.some((e) => e.from === "findAvailable" && e.to === "placeOrder"));
    assert.ok(graph.dataEdges.some((e) => e.from === "placeOrder" && e.to === "outputs"));
    const retry = graph.steps[2].actions[0];
    assert.equal(retry.type, "retry");
    assert.equal(retry.conditional, true);
    assert.equal(graph.steps[1].actions[0].stepId, "findAvailable");
  });

  it("defaults to the first workflow and returns null for an unknown id", () => {
    assert.equal(buildFlowGraph(doc).workflowId, "adoptPet");
    assert.equal(buildFlowGraph(doc, "missing"), null);
  });

  it("falls back to workflow-level actions for steps without their own", () => {
    const graph = buildFlowGraph(
      minimal({
        workflows: [
          {
            workflowId: "w",
            failureActions: [{ name: "stop", type: "end" }],
            steps: [{ stepId: "a", operationId: "getA" }],
          },
        ],
      }),
    );
    assert.equal(graph.steps[0].actions[0].inherited, true);
  });

  it("merges workflow-level actions with a step's own, which override them by name", () => {
    const graph = buildFlowGraph(
      minimal({
        workflows: [
          {
            workflowId: "w",
            failureActions: [
              { name: "stop", type: "end", criteria: [{ condition: "$statusCode == 500" }] },
              { name: "again", type: "retry", retryLimit: 3 },
            ],
            steps: [
              {
                stepId: "a",
                operationId: "getA",
                onFailure: [{ name: "again", type: "retry", retryLimit: 1 }],
              },
            ],
          },
        ],
      }),
    );
    assert.deepEqual(
      graph.steps[0].actions.map((x) => [x.name, x.inherited, x.retryLimit]),
      [
        ["again", false, 1],
        ["stop", true, undefined],
      ],
    );
    assert.equal(graph.workflowActions.length, 2);
    assert.equal(graph.workflowActions[0].criteria[0].condition, "$statusCode == 500");
  });

  it("describes inputs, step parameters, criteria and outputs for the docs", () => {
    const order = parseDocument(orderText);
    const graph = buildFlowGraph(order);
    assert.deepEqual(
      graph.inputDetails.map((i) => [i.name, i.type, i.required, i.default]),
      [
        ["username", "string", true, undefined],
        ["password", "string", true, undefined],
        ["preferredPetStatus", "string", false, "available"],
        ["orderQuantity", "integer", false, 1],
      ],
    );
    assert.deepEqual(graph.inputDetails[2].enum, ["available", "pending", "sold"]);
    const [login, find, place] = graph.steps;
    assert.deepEqual(login.parameters[0], {
      name: "username",
      in: "query",
      value: "$inputs.username",
    });
    assert.equal(place.requestBody.payload.status, "placed");
    assert.deepEqual(
      find.criteria.map((c) => c.condition),
      ["$statusCode == 200", "$response.body#/0 != null"],
    );
    assert.equal(login.outputExprs[0].expr, "$response.body");
    assert.equal(
      graph.outputs.find((o) => o.name === "sessionToken").expr,
      "$steps.loginUser.outputs.sessionToken",
    );
    // findAvailablePets has its own end, plus both workflow actions
    assert.deepEqual(
      find.actions.map((x) => x.name),
      ["noPetsAvailable", "orderFailed", "retryOnServiceUnavailable"],
    );
  });

  it("resolves an inputs $ref to components and parameter references", () => {
    const graph = buildFlowGraph(
      minimal({
        components: {
          inputs: {
            creds: { type: "object", required: ["user"], properties: { user: { type: "string" } } },
          },
          parameters: { page: { name: "page", in: "query", value: 1 } },
        },
        workflows: [
          {
            workflowId: "w",
            inputs: { $ref: "#/components/inputs/creds" },
            steps: [
              {
                stepId: "a",
                operationId: "getA",
                parameters: [{ reference: "$components.parameters.page", value: 2 }],
              },
            ],
          },
        ],
      }),
    );
    assert.deepEqual(
      graph.inputDetails.map((i) => [i.name, i.required]),
      [["user", true]],
    );
    assert.deepEqual(graph.steps[0].parameters, [{ name: "page", in: "query", value: 2 }]);
  });
});

describe("arazzo: SVG rendering", () => {
  it("draws every step with its method and path (compact)", () => {
    const { svg, problems, workflowIds } = renderArazzoWorkflow(arazzoText, {
      view: "compact",
      sources: { petstore: petstoreText },
    });
    assert.deepEqual(problems, []);
    assert.deepEqual(workflowIds, ["adoptPet", "orderOrReserve", "registerUser"]);
    assert.ok(svg.startsWith("<svg"));
    for (const id of ["findAvailable", "checkPet", "placeOrder", "confirmOrder"]) {
      assert.ok(svg.includes(`data-step-id="${id}"`), id);
    }
    assert.ok(svg.includes('class="rf-method rf-method-post"'));
    assert.ok(svg.includes("/store/order/{orderId}"));
    // no action pills, but checkPet's own goto still draws its line
    assert.ok(!svg.includes("rf-action"));
    assert.equal((svg.match(/class="rf-goto rf-failure"/g) || []).length, 1);
    assert.ok(outputsBox(svg).includes('<tspan class="rf-step-name" x="'));
    assert.ok(svg.includes(">orderId</tspan>"));
  });

  it("draws branches as goto lines and no next-step arrow after an end or a goto", () => {
    const { svg, graph } = renderArazzoWorkflow(arazzoText, {
      workflowId: "orderOrReserve",
      sources: { petstore: petstoreText },
    });
    const [check, readPet, placeOrder] = graph.steps;
    assert.deepEqual(
      check.actions.map((a) => [a.type, a.stepId, a.conditional]),
      [
        ["goto", "readPet", true],
        ["goto", "findPending", false],
      ],
    );
    assert.equal(placeOrder.actions[0].type, "end");
    assert.equal((svg.match(/class="rf-goto rf-success"/g) || []).length, 2);
    // inputs → checkInventory, readPet → placeOrder, findPending → markWanted, markWanted → outputs
    assert.equal((svg.match(/class="rf-seq"/g) || []).length, 4);
    assert.ok(readPet.operation.path === "/pet/{petId}");
  });

  it("lists each step's values, and draws no value lines (compact)", () => {
    const { svg, graph, legend } = renderArazzoWorkflow(orderText, {
      view: "compact",
      sources: { petstoreAPI: petstoreText },
    });
    assert.ok(svg.includes(">required</tspan>"));
    assert.ok(!svg.includes(">From step</text>"));
    assert.ok(svg.includes(">.confirmedOrderStatus</tspan>"));
    assert.ok(!svg.includes("…"));
    // no lines for values passed between steps or to the outputs: the values name their step
    assert.ok(!svg.includes('class="rf-data'));
    assert.ok(!svg.includes("rf-data-label"));
    assert.deepEqual(legend, ["seq", "retry"]);
    // the values a step sends, under the same headings as in the expanded view
    const place = svg.slice(
      svg.indexOf('data-step-id="placeOrder"'),
      svg.indexOf('data-step-id="retrieveOrderedPetDetails"'),
    );
    assert.ok(place.includes(">Request body</tspan>"));
    assert.ok(
      place.includes(
        '>findAvailablePets</tspan><tspan class="rf-bind-val">.bestMatchPetId</tspan>',
      ),
    );
    // still no checks, actions or outputs in a compact box
    assert.ok(!place.includes(">Checks</tspan>") && !place.includes(">On failure"));
    assert.ok(!place.includes(">Outputs</tspan>"));
    assert.ok(place.includes("2 checks"));
    assert.equal(graph.steps.length, 5);
  });

  it("lists step bindings, actions and typed inputs in the expanded view", () => {
    const { svg, graph, legend } = renderArazzoWorkflow(orderText, {
      sources: { petstoreAPI: petstoreText },
    });
    assert.ok(svg.includes('class="rf-svg rf-expanded"'));
    const place = graph.steps.find((s) => s.stepId === "placeOrder");
    assert.deepEqual(
      place.bindings.map((b) => [b.name, b.source.kind, b.source.text]),
      [
        ["body.petId", "step", "findAvailablePets.bestMatchPetId"],
        ["body.quantity", "input", "orderQuantity"],
        ["body.status", "value", "placed"],
        ["body.complete", "value", "false"],
      ],
    );
    assert.deepEqual(place.bindings[0].fromSteps, ["findAvailablePets"]);
    // every value has a keyword: input, step, fixed or expr
    // a step's output reads "← from <step>.<output>", the arrow in a column of its own
    assert.ok(svg.includes('<tspan class="rf-kw rf-kw-step" x="'));
    assert.ok(
      /<tspan class="rf-from-arrow" x="[\d.]+">←<\/tspan><tspan class="rf-kw rf-kw-step" x="[\d.]+">from<\/tspan>/.test(
        svg,
      ),
    );
    assert.ok(!/class="rf-kw rf-kw-step" x="[\d.]+">step</.test(svg));
    assert.ok(
      svg.includes('>findAvailablePets</tspan><tspan class="rf-bind-val">.bestMatchPetId</tspan>'),
    );
    assert.ok(svg.includes('rf-kw rf-kw-value"'));
    assert.ok(svg.includes(">placed</tspan>"));
    assert.ok(svg.includes(">required</tspan>"));
    assert.ok(svg.includes("available | pending | sold"));
    // a string enum is labelled "enum", as <rapi-doc> does; the other inputs keep their type
    assert.equal((svg.match(/class="rf-in-type"[^>]*>enum<\/tspan>/g) || []).length, 1);
    assert.equal((svg.match(/class="rf-in-type"[^>]*>string<\/tspan>/g) || []).length, 2);
    // actions read "condition → what happens", tagged with their name or "Inherited"
    // the heading says when the section applies (a step succeeds only when all its checks pass),
    // and "first match runs" only where there is a choice: findAvailablePets' own end shadows the
    // workflow's actions, so it has one failure action
    assert.equal((svg.match(/>On failure<\/tspan>/g) || []).length, 5);
    assert.equal((svg.match(/ · first match runs<\/tspan>/g) || []).length, 4);
    assert.ok(
      svg.includes(
        '>On failure</tspan><tspan class="rf-sec-note" dx="6">· if any check fails</tspan>',
      ),
    );
    assert.ok(
      svg.includes(
        '<tspan class="rf-sec-note" dx="6">· if the check fails · first match runs</tspan>',
      ),
    );
    assert.ok(
      svg.includes(
        '<tspan class="rf-sec-note" dx="6">· if any check fails · first match runs</tspan>',
      ),
    );
    // an action without criteria that comes first has no condition: the heading says it
    assert.ok(!svg.includes(">checks fail</tspan>"));
    assert.ok(svg.includes('>status 500</tspan><tspan class="rf-act-then" x="'));
    // the checks, numbered, in place of the count in the header
    assert.equal((svg.match(/>Checks<\/tspan>/g) || []).length, 5);
    assert.ok(svg.includes(">$response.body#/0 != null</tspan>"));
    assert.ok(!svg.includes("2 checks"));
    assert.ok(!svg.includes("rf-check-num"));
    // an end is a red END pill, not words
    assert.ok(!svg.includes("stop the workflow</tspan>"));
    assert.ok(svg.includes('<tspan class="rf-end rf-failure" x="'));
    assert.ok(
      /<rect class="rf-end-pill rf-failure" x="[\d.]+" y="[\d.]+" width="[\d.]+" height="16" rx="3"\/>/.test(
        svg,
      ),
    );
    // a retry is an action line under "On failure" (condition, what it does, its name) and a
    // line from there back into the step, labelled with how many times and how far apart
    assert.ok(svg.includes('>status 503</tspan><tspan class="rf-act-then"'));
    assert.ok(svg.includes(">→ retry 3×, 1s apart</tspan>"));
    assert.ok(svg.includes(">(retryOnServiceUnavailable)</tspan>"));
    assert.ok(svg.includes('class="rf-goto rf-retry"'));
    assert.ok(svg.includes("<title>status 503 → retry 3×, 1s apart (retryOnServiceUnavailable)"));
    assert.ok(svg.includes('text-anchor="middle">retry 3× @ 1s</text>'));
    // the retry line leaves the box at the height of its action line
    const retryRowY = Number(
      svg.match(/<text class="rf-row" y="([\d.]+)">(?:(?!<\/text>).)*→ retry 3×/)[1],
    );
    const retryLineYs = [...svg.matchAll(/class="rf-goto rf-retry"[^>]*d="M[\d.]+ ([\d.]+)L/g)].map(
      (m) => Number(m[1]),
    );
    assert.ok(retryLineYs.includes(retryRowY - 4));
    // every action shows its name beside it; only inherited ones carry the "Inherited" tag
    assert.ok(svg.includes('<tspan class="rf-act-name" dx="13">(noPetsAvailable)</tspan>'));
    assert.ok(!svg.includes(">noPetsAvailable</text>"));
    // findAvailablePets' own end has no criteria, so the workflow's two actions never run there
    const find = graph.steps.find((s) => s.stepId === "findAvailablePets");
    assert.deepEqual(
      find.actions.map((a) => a.shadowed),
      [false, true, true],
    );
    // they are left out of the box and named once in the graph's warnings
    const findBox = svg.slice(
      svg.indexOf('data-step-id="findAvailablePets"'),
      svg.indexOf('data-step-id="placeOrder"'),
    );
    assert.ok(!findBox.includes("orderFailed") && !findBox.includes(">Inherited</text>"));
    // the inherited end and retry are listed in four steps each, tagged "Inherited"
    assert.equal(
      (svg.match(/<text class="rf-tag rf-inherited"[^>]*>Inherited<\/text>/g) || []).length,
      8,
    );
    // the compact view draws the inherited retry loops too, one per step that inherits it
    const compact = renderArazzoWorkflow(orderText, { view: "compact" }).svg;
    assert.equal(
      (compact.match(/<path class="rf-goto rf-retry"/g) || []).length,
      (svg.match(/<path class="rf-goto rf-retry"/g) || []).length,
    );
    assert.ok(compact.includes("inherited from the workflow</title>"));
    assert.deepEqual(graph.warnings, [
      {
        level: "warning",
        path: "workflows[0].steps[1].onFailure",
        message:
          "findAvailablePets: the workflow's orderFailed and retryOnServiceUnavailable never run, because noPetsAvailable has no criteria and always matches first",
      },
    ]);
    // outputs grouped by step, each row as a step's value lines read: "<name> ← <step>.<output>",
    // the step in the step color, with no step column
    const outBox = outputsBox(svg);
    assert.ok(!outBox.includes(">From step</text>") && !outBox.includes("rf-tag"));
    assert.ok(
      /<text class="rf-row" y="[\d.]+" data-from-step="verifyOrderConfirmation"><tspan class="rf-out-name" x="[\d.]+">\w+<\/tspan><tspan class="rf-from-arrow" x="[\d.]+">←<\/tspan><tspan class="rf-step-name" x="[\d.]+">verifyOrderConfirmation<\/tspan><tspan class="rf-bind-val">\.confirmedOrderStatus<\/tspan><\/text>/.test(
        outBox,
      ),
    );
    assert.ok(svg.includes('<tspan class="rf-step-name" x="'));
    assert.ok(svg.includes('data-from-step="placeOrder" d="M'));
    // with interactive, step names in the outputs box and value lines link to the step
    const live = renderArazzoWorkflow(orderText, { interactive: true }).svg;
    // output rows are focusable links; value lines in step boxes are not
    assert.ok(
      /<text class="rf-row rf-jump" y="[\d.]+" data-from-step="loginUser" tabindex="0" role="link" aria-label="Go to step loginUser">/.test(
        outputsBox(live),
      ),
    );
    assert.ok(
      !live.slice(0, live.indexOf('class="rf-node rf-io rf-outputs"')).includes('role="link"'),
    );
    assert.ok(live.includes('class="rf-row rf-jump" y="'));
    assert.ok(!svg.includes("rf-jump"));
    // the step output's own name always shows: "← <step>.<output>"
    assert.ok(outBox.includes('<tspan class="rf-bind-val">.petName</tspan>'));
    // no value lines in the expanded view: each value names the step it comes from
    assert.ok(!svg.includes('class="rf-data'));
    // lines between boxes have rounded corners
    assert.ok(/class="rf-goto rf-retry"[^>]*d="M[\d.]+ [\d.]+L[\d.]+ [\d.]+Q/.test(svg));
    // each step lists the outputs something reads, and the lines start there
    assert.deepEqual(
      graph.steps.map((st) => st.usedOutputs.map((o) => o.name)),
      [
        ["sessionToken"],
        ["bestMatchPetId"],
        ["orderId", "orderQuantity", "orderShipDate"],
        ["petName", "petCategory", "petId"],
        ["confirmedOrderStatus"],
      ],
    );
    assert.equal(place.bindings[0].fromOutputs[0].name, "bestMatchPetId");
    assert.ok(svg.includes(">response body /0/id</tspan>"));
    assert.ok(svg.includes(">+3 unused</tspan>"));
    assert.ok(svg.includes("<title>$response.body#/status</title>"));
    // input descriptions as tooltips
    assert.ok(svg.includes("<title>User login identifier</title>"));
    assert.deepEqual(legend, ["seq", "retry"]);
    // values are grouped by where they go, body fields without their "body." prefix
    const placeBox = svg.slice(
      svg.indexOf('data-step-id="placeOrder"'),
      svg.indexOf("</g>", svg.indexOf('data-step-id="placeOrder"')),
    );
    assert.ok(
      placeBox.includes(
        '>Request body</tspan><tspan class="rf-sec-note" dx="6">(application/json)</tspan>',
      ),
    );
    assert.ok(placeBox.includes('class="rf-bind-name" x="'));
    assert.ok(placeBox.includes(">petId</tspan>") && !placeBox.includes(">body.petId</tspan>"));
  });

  it("words catch-all actions after the step's checks and shows typed checks", () => {
    const base = { type: "end", outcome: "failure", criteria: [] };
    assert.equal(describeAction(base, 2).when, "checks fail");
    assert.equal(describeAction(base, 1).when, "check fails");
    assert.equal(describeAction(base, 0).when, "request fails");
    assert.equal(describeAction({ ...base, outcome: "success" }, 1).when, "check passes");
    assert.equal(describeAction(base, 2, 1).when, "otherwise");
    assert.deepEqual(
      [
        describeAction({ ...base, name: "stop" }).name,
        describeAction({ ...base, name: "stop" }).tag,
      ],
      ["stop", ""],
    );
    assert.equal(describeAction({ ...base, inherited: true }).tag, "Inherited");
    const { svg } = renderArazzoWorkflow(arazzoText, {
      workflowId: "registerUser",
      sources: { petstore: petstoreText },
    });
    assert.ok(svg.includes(">jsonpath on $response.body:</tspan>"));
  });

  it("starts goto lines at their action line, labelled with the action's name (expanded)", () => {
    const { svg, legend, legendHtml } = renderArazzoWorkflow(arazzoText, {
      workflowId: "orderOrReserve",
      sources: { petstore: petstoreText },
    });
    assert.equal((svg.match(/class="rf-goto rf-success"/g) || []).length, 2);
    // each goto has its line in the box, "→ goto <step>" with the step in the step color, and
    // its line starts there, labelled with the action's name (not repeated in the box)
    assert.ok(svg.includes(">$response.body#/available &gt; 0</tspan>"));
    assert.ok(svg.includes('>→ goto </tspan><tspan class="rf-step-name">readPet</tspan></text>'));
    assert.ok(!svg.includes("(inStock)</tspan>"));
    assert.ok(
      svg.includes("<title>$response.body#/available &gt; 0 → goto readPet (inStock)</title>"),
    );
    assert.ok(svg.includes('text-anchor="middle">inStock</text>'));
    // the line leaves the box at the height of its action line
    const rowY = Number(
      svg.match(
        /<text class="rf-row" y="([\d.]+)">(?:(?!<\/text>).)*goto <\/tspan><tspan class="rf-step-name">readPet/,
      )[1],
    );
    const lineY = Number(svg.match(/class="rf-goto rf-success"[^>]*d="M[\d.]+ ([\d.]+)L/)[1]);
    assert.equal(lineY, rowY - 4);
    assert.ok(legend.includes("success") && !legend.includes("failure"));
    // one legend for <rapi-flow> and build-time pages: an entry per kind drawn, retry included,
    // each line in the classes the flow CSS colors and dashes
    assert.deepEqual(legend, ["seq", "success", "retry"]);
    assert.equal((legendHtml.match(/<li>/g) || []).length, 3);
    assert.ok(legendHtml.startsWith('<ul class="flow-legend" part="legend" aria-label="Legend">'));
    assert.ok(legendHtml.includes('<path class="rf-goto rf-retry" d="M1 5H23"/>'));
    assert.ok(
      legendHtml.includes('<path class="rf-head rf-retry" d="M22 1L28 5L22 9z"/></svg>retry</li>'),
    );
    assert.ok(!legendHtml.includes("stroke-dasharray"));
    assert.ok(getFlowCss().includes(".flow-legend"));
    // arrowheads take their kind's color from the same class as the line
    assert.ok(svg.includes('<path d="M0 0L10 5L0 10z" class="rf-head rf-retry"/>'));
    assert.ok(getFlowCss().includes("--rf-kind") && !getFlowCss().includes("rf-head-success"));
    // a caller adds classes to step boxes (<rapi-flow>: the selected step, the running one)
    const marked = renderArazzoWorkflow(arazzoText, {
      workflowId: "orderOrReserve",
      stepClasses: { placeOrder: ["rf-selected", "rf-running"] },
    }).svg;
    assert.ok(
      marked.includes('class="rf-node rf-step rf-selected rf-running" data-step-id="placeOrder"'),
    );
    assert.equal((marked.match(/rf-selected/g) || []).length, 1);
    // an end on success is a green END pill
    assert.ok(svg.includes('<rect class="rf-end-pill rf-success"'));
    assert.ok(svg.includes('<tspan class="rf-end rf-success" x="'));
    // a step with no failure action shows Arazzo's default, an outlined END pill: the workflow
    // ends; placeOrder has its own failure action, so only the other four steps get one
    assert.equal((svg.match(/<rect class="rf-end-pill rf-failure rf-default"/g) || []).length, 4);
    const mark = svg.slice(svg.indexOf('data-step-id="markWanted"'));
    assert.ok(
      mark.includes(
        '>On failure</tspan><tspan class="rf-sec-note" dx="6">· if the check fails</tspan>',
      ),
    );
    assert.ok(mark.includes("<title>No failure action: the workflow ends</title>"));
    assert.ok(mark.includes('>END</tspan><tspan class="rf-act-name" dx="13">(default)</tspan>'));
    // no success action draws no section: the next-step arrow says it
    assert.ok(!mark.includes(">On success</tspan>"));
    // the compact view lists no actions, default or not
    const compact = renderArazzoWorkflow(arazzoText, {
      workflowId: "orderOrReserve",
      view: "compact",
    });
    assert.ok(!compact.svg.includes("rf-default"));
  });

  it("marks steps whose operation is missing only when sources were loaded", () => {
    const without = renderArazzoWorkflow(arazzoText).svg;
    assert.ok(!without.includes("(not found)"));
    const doc = minimal();
    const withSources = renderArazzoWorkflow(doc, { sources: { api: { paths: {} } } }).svg;
    assert.ok(withSources.includes("getA (not found)"));
  });

  it("escapes text and makes steps focusable only when interactive", () => {
    const doc = minimal({
      workflows: [{ workflowId: "w", steps: [{ stepId: "a<b>", operationId: "getA" }] }],
    });
    const sources = { api: { paths: { "/a": { get: { operationId: "getA" } } } } };
    const plain = renderArazzoWorkflow(doc, { sources }).svg;
    assert.ok(plain.includes("a&lt;b&gt;"));
    assert.ok(!plain.includes("tabindex"));
    assert.ok(
      renderArazzoWorkflow(doc, { sources, interactive: true }).svg.includes('tabindex="0"'),
    );
  });

  it("uses the id prefix for markers and exports the diagram CSS", () => {
    const { svg } = renderArazzoWorkflow(arazzoText, { idPrefix: "x9" });
    assert.ok(svg.includes('id="x9-seq"'));
    assert.ok(!svg.includes('id="rf-seq"'));
    assert.ok(getFlowCss().includes(".rf-goto"));
    assert.ok(!getFlowCss().includes(".rf-data"));
  });
});
