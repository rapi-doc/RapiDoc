import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { parseStatusCodes, pickStatusCode } from "../../packages/rapidoc/src/utils/status-codes.js";
import {
  enableMockServer,
  disableMockServer,
  updateMockConfig,
} from "../../packages/rapidoc/src/utils/mock-interceptor.js";
import { buildFlowGraph } from "../../packages/rapidoc/src/utils/arazzo/graph.js";

describe("mock status codes with a strategy prefix", () => {
  it("parses codes, with or without a prefix", () => {
    assert.deepEqual(parseStatusCodes("503, 503, 200"), {
      strategy: "cycle",
      codes: ["503", "503", "200"],
    });
    assert.deepEqual(parseStatusCodes("random:200,500"), {
      strategy: "random",
      codes: ["200", "500"],
    });
    assert.deepEqual(parseStatusCodes(" CYCLE : 404 "), { strategy: "cycle", codes: ["404"] });
    assert.deepEqual(parseStatusCodes("200, 404", "first"), {
      strategy: "first",
      codes: ["200", "404"],
    });
    assert.deepEqual(parseStatusCodes(""), { strategy: "cycle", codes: [] });
    assert.deepEqual(parseStatusCodes([503, 200]).codes, ["503", "200"]);
  });

  it("picks in turn by default, starting again after the last", () => {
    const picks = [0, 1, 2, 3].map((i) => pickStatusCode("503,503,200", i));
    assert.deepEqual(picks, ["503", "503", "200", "503"]);
    assert.equal(pickStatusCode("first:200,404", 3), "200");
    assert.ok(["200", "500"].includes(pickStatusCode("random:200,500", 0)));
    assert.equal(pickStatusCode("", 0), "");
  });
});

describe("the in-browser mock reads the prefix", () => {
  const spec = {
    servers: [{ url: "https://api.example.com" }],
    tags: [
      {
        name: "t",
        paths: [
          {
            method: "GET",
            path: "/a",
            responses: { 200: {}, 404: {}, 503: {} },
          },
          {
            method: "GET",
            path: "/b",
            responses: { 200: {}, 500: {} },
          },
        ],
      },
    ],
  };
  const status = async (path) => (await fetch(`https://api.example.com${path}`)).status;

  beforeEach(() => {
    globalThis.window = globalThis;
    globalThis.fetch = async () => new Response("real");
  });
  afterEach(() => disableMockServer());

  it("cycles codes without a prefix by default (no strategy set)", async () => {
    enableMockServer(spec, { log: "false", statusCode: "503, 503, 200" });
    const got = [];
    for (let i = 0; i < 4; i++) got.push(await status("/a"));
    assert.deepEqual(got, [503, 503, 200, 503]);
  });

  it("takes a strategy per operation from the map", async () => {
    enableMockServer(spec, {
      log: "false",
      statusCode: { "GET /a": "cycle:404,200", "GET /b": "first:500,200" },
    });
    assert.deepEqual([await status("/a"), await status("/a")], [404, 200]);
    assert.deepEqual([await status("/b"), await status("/b")], [500, 500]);
  });

  it("starts each cycle again when the codes change", async () => {
    enableMockServer(spec, { log: "false", statusCode: "404, 200" });
    assert.equal(await status("/a"), 404);
    updateMockConfig({ statusCode: "503, 200" });
    assert.equal(await status("/a"), 503, "the new codes start from their first");
  });
});

describe("x-mock-server-status-code on an Arazzo step", () => {
  it("is the step's mockStatusCode in the flow graph", () => {
    const doc = {
      arazzo: "1.0.1",
      info: { title: "t", version: "1" },
      sourceDescriptions: [{ name: "api", url: "./api.yaml", type: "openapi" }],
      workflows: [
        {
          workflowId: "w",
          steps: [
            { stepId: "a", operationId: "getA", "x-mock-server-status-code": "cycle:503,503,200" },
            { stepId: "b", operationId: "getB", "x-mock-server-status-code": 404 },
            { stepId: "c", operationId: "getC", "x-mock-server-status-code": [503, 200] },
            { stepId: "d", operationId: "getD" },
          ],
        },
      ],
    };
    const graph = buildFlowGraph(doc, "w");
    assert.deepEqual(
      graph.steps.map((s) => [s.stepId, s.mockStatusCode]),
      [
        ["a", "cycle:503,503,200"],
        ["b", "404"],
        ["c", "503,200"],
        ["d", ""],
      ],
    );
  });
});
