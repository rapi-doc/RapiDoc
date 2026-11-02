import { describe, it } from "node:test";
import assert from "node:assert/strict";
import ProcessSpec from "../../packages/rapidoc/src/utils/spec-parser.js";

const base = () => ({
  openapi: "3.1.0",
  info: { title: "Hooks", version: "1.0.0" },
  paths: {
    "/orders": {
      get: {
        operationId: "listOrders",
        summary: "List orders",
        responses: { 200: { description: "OK" } },
      },
    },
  },
});

describe("ProcessSpec: webhooks and never-throws contract", () => {
  it("keeps a path and a webhook that share a key, and leaves the spec's paths alone", async () => {
    const spec = base();
    spec.webhooks = {
      "/orders": {
        post: {
          operationId: "orderCreated",
          summary: "Order created",
          responses: { 200: { description: "OK" } },
        },
      },
    };
    const parsed = await ProcessSpec(spec, false);
    assert.equal(parsed.specLoadError, false);
    const ops = parsed.tags.flatMap((t) => t.paths);
    assert.deepEqual(
      ops.map((p) => [p.method, p.path, p.isWebhook]),
      [
        ["get", "/orders", false],
        ["post", "/orders", true],
      ],
    );
    assert.deepEqual(Object.keys(spec.paths), ["/orders"], "webhooks are not written into paths");
    assert.equal(spec.webhooks["/orders"]._type, undefined, "the webhook object is not tagged");
  });

  it("returns a specLoadError result instead of rejecting on a server without url", async () => {
    const spec = base();
    spec.servers = [{ description: "no url" }];
    const parsed = await ProcessSpec(spec, false);
    assert.equal(parsed.specLoadError, false, "a missing url is tolerated");
    assert.equal(parsed.servers[0].computedUrl, "");
  });

  it("returns a specLoadError result instead of rejecting on a nameless tag", async () => {
    const spec = base();
    spec.tags = [{ description: "no name" }];
    spec.paths["/orders"].get.tags = ["Orders"];
    const parsed = await ProcessSpec(spec, false);
    assert.equal(parsed.specLoadError, false, "a nameless tag is tolerated");
    assert.equal(parsed.tags[0].name, "Orders");
  });

  it("never rejects: a processing failure becomes a specLoadError result", async () => {
    const spec = base();
    // `servers` is read with Array.isArray, so a poisoned entry gets past loading and trips processing
    spec.servers = [{ url: { toString: null } }];
    Object.defineProperty(spec.servers[0], "url", {
      get() {
        throw new Error("boom");
      },
    });
    const parsed = await ProcessSpec(spec, false);
    assert.equal(parsed.specLoadError, true);
    assert.match(parsed.info.description, /boom/);
  });
});
