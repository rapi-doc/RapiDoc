import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import YAML from "yaml";
import { checkApiSpec, checkWorkflow, summaryAnchoredOperations } from "../src/index.js";

const SPEC = `openapi: 3.1.0
info: { title: Orders, version: 1.0.0 }
paths:
  /orders:
    get: { operationId: listOrders, summary: List orders, responses: { '200': { description: OK } } }
    post: { summary: Place an order, responses: { '201': { description: Created } } }
  /orders/{orderId}:
    parameters: [{ name: orderId, in: path, required: true, schema: { type: string } }]
    get: { operationId: operation1, description: Get one order, responses: { '200': { description: OK } } }
    delete: { responses: { '204': { description: Deleted } } }
`;

describe("spec checks (operation link stability)", () => {
  it("lists operations whose anchor comes from the summary, with their method + path anchor", () => {
    const ops = summaryAnchoredOperations(YAML.parse(SPEC));
    assert.deepEqual(ops, [
      { method: "post", path: "/orders", alias: "post-orders" },
      { method: "get", path: "/orders/{orderId}", alias: "get-orders-orderId" },
    ]);
  });

  it("checkWorkflow reports unmapped sources, unknown operations and unsupported features", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "rapidoc-workflow-checks-"));
    try {
      fs.writeFileSync(
        path.join(dir, "api.yaml"),
        "openapi: 3.1.0\ninfo: { title: A, version: '1' }\npaths:\n  /a:\n    get: { operationId: getA, responses: { '200': { description: ok } } }\n",
      );
      fs.writeFileSync(
        path.join(dir, "flow.yaml"),
        [
          "arazzo: 1.0.1",
          "info: { title: F, version: '1' }",
          "sourceDescriptions:",
          "  - { name: api, url: ./api.yaml, type: openapi }",
          "  - { name: other, url: ./other.yaml, type: openapi }",
          "workflows:",
          "  - workflowId: good",
          "    steps:",
          "      - { stepId: a, operationId: getA }",
          "  - workflowId: broken",
          "    steps:",
          "      - { stepId: a, operationId: nope }",
          "      - { stepId: b, operationId: getA, successCriteria: [{ condition: $.x, type: jsonpath, context: $response.body }] }",
        ].join("\n"),
      );
      const warnings = checkWorkflow(
        { id: "flow", fullPath: path.join(dir, "flow.yaml"), sources: { api: "a" } },
        [{ id: "a", fullPath: path.join(dir, "api.yaml") }],
      );
      assert.equal(warnings.length, 2, warnings.join("\n"));
      assert.match(warnings[0], /source "other" is not one of the portal's APIs/);
      assert.match(
        warnings[1],
        /workflow broken is left out.*operation nope was not found in api.*jsonpath is not supported/,
      );
      assert.deepEqual(
        checkWorkflow({ id: "gone", fullPath: path.join(dir, "missing.yaml"), sources: {} }),
        [],
      );
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  it("checkApiSpec warns once per API, and skips remote or missing specs", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "rapidoc-spec-checks-"));
    try {
      const fullPath = path.join(dir, "orders.yaml");
      fs.writeFileSync(fullPath, SPEC);
      const warnings = checkApiSpec({ id: "orders", fullPath });
      assert.equal(warnings.length, 1);
      assert.match(warnings[0], /^orders: 2 operations have no operationId/);
      assert.match(warnings[0], /POST \/orders, GET \/orders\/\{orderId\}/);

      assert.deepEqual(
        checkApiSpec({ id: "remote", fullPath: "https://example.com/spec.yaml", isRemote: true }),
        [],
      );
      assert.deepEqual(checkApiSpec({ id: "gone", fullPath: path.join(dir, "missing.yaml") }), []);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });
});
