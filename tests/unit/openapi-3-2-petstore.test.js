import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ProcessSpec from "../../packages/rapidoc/src/utils/spec-parser.js";
import themeTokens from "../../packages/rapidoc/src/styles/theme-tokens.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

test("OpenAPI 3.2 Petstore spec parsing", async (t) => {
  const petstoreYaml = fs.readFileSync(
    path.resolve(__dirname, "../../docs/public/specs/petstore-3.2.yaml"),
    "utf8",
  );
  const parsedSpec = await ProcessSpec.call(
    {},
    petstoreYaml,
    false, // generateMissingTags
    false, // sortTags
    false, // sortSchemas
    "method", // sortEndpointsBy
  );
  const tag = (name) => parsedSpec.tags.find((one) => one.name === name);

  await t.test("spec metadata parses cleanly without errors", () => {
    assert.equal(parsedSpec.specLoadError, false);
    assert.equal(parsedSpec.info.title, "Swagger Petstore - OpenAPI 3.2");
    assert.deepEqual(
      parsedSpec.tags.map((one) => one.name),
      ["pet", "store", "user"],
      "the badge tags (beta, pending-implementation) are not sections",
    );
  });

  await t.test("native QUERY method is parsed with requestBody under the pet tag", () => {
    const queryEndpoint = tag("pet").paths.find((p) => p.method === "query");
    assert.ok(queryEndpoint, "QUERY /pet/search endpoint should be registered");
    assert.equal(queryEndpoint.path, "/pet/search");
    assert.equal(queryEndpoint.elementId, "search-pets");
    assert.equal(queryEndpoint.summary, "Search pets.");
    assert.ok(
      queryEndpoint.requestBody?.content["application/json"],
      "QUERY should have an application/json body",
    );
  });

  await t.test("OpenAPI 3.2 additionalOperations (COPY and PURGE) are parsed", () => {
    const copyEndpoint = tag("pet").paths.find((p) => p.method === "copy");
    assert.ok(copyEndpoint, "COPY /pet/{petId} endpoint should be parsed");
    assert.equal(copyEndpoint.path, "/pet/{petId}");
    assert.equal(copyEndpoint.summary, "Copy a pet.");
    assert.ok(copyEndpoint.requestBody, "COPY method should have requestBody");

    const purgeEndpoint = tag("store").paths.find((p) => p.method === "purge");
    assert.ok(purgeEndpoint, "PURGE /store/inventory endpoint should be parsed");
    assert.equal(purgeEndpoint.path, "/store/inventory");
    assert.equal(purgeEndpoint.summary, "Purge the cached inventory.");
  });

  await t.test("badge tags (kind: badge) label the new operations", () => {
    const badgesOf = (method) =>
      parsedSpec.tags
        .flatMap((one) => one.paths)
        .find((p) => p.method === method)
        ?.xBadges?.map((badge) => badge.label);
    assert.deepEqual(badgesOf("query"), ["Beta"]);
    assert.deepEqual(badgesOf("copy"), ["Pending implementation"]);
    assert.deepEqual(badgesOf("purge"), ["Pending implementation"]);
  });

  await t.test('Endpoints are correctly ordered with sortEndpointsBy="method"', () => {
    const methods = tag("pet").paths.map((p) => p.method);
    // Standard methods in supportedMethods order (get, put, post, delete, ..., query), then additional operations
    const index = (method) => methods.indexOf(method);
    assert.ok(index("get") < index("put"), "GET should precede PUT");
    assert.ok(index("put") < index("post"), "PUT should precede POST in supportedMethods");
    assert.ok(index("post") < index("delete"), "POST should precede DELETE");
    assert.ok(index("delete") < index("query"), "DELETE should precede QUERY");
    assert.ok(index("query") < index("copy"), "QUERY should precede custom COPY");
  });

  await t.test("Theme tokens include --method-query, --method-trace, and --method-default", () => {
    const cssText = themeTokens.cssText;
    assert.ok(cssText.includes("--method-query"), "Theme tokens must define --method-query");
    assert.ok(cssText.includes("--method-trace"), "Theme tokens must define --method-trace");
    assert.ok(cssText.includes("--method-default"), "Theme tokens must define --method-default");
  });
});

test("OpenAPI 3.2 TRACE, callbacks and webhooks", async (t) => {
  const parsedSpec = await ProcessSpec.call(
    {},
    {
      openapi: "3.2.0",
      info: { title: "Trace, callbacks and webhooks", version: "1.0.0" },
      tags: [{ name: "System" }, { name: "Orders" }],
      paths: {
        "/diagnostics": {
          trace: {
            tags: ["System"],
            operationId: "traceDiagnostics",
            summary: "Diagnostic loopback trace",
            responses: { 200: { description: "The request, echoed" } },
          },
        },
        "/orders": {
          post: {
            tags: ["Orders"],
            summary: "Place an order",
            responses: { 201: { description: "Placed" } },
            callbacks: {
              onOrderStatusChange: {
                "{$request.body#/callbackUrl}": {
                  post: { responses: { 200: { description: "Received" } } },
                },
              },
            },
          },
        },
      },
      webhooks: {
        newPetListed: { post: { responses: { 200: { description: "Received" } } } },
        inventoryAlert: { post: { responses: { 200: { description: "Received" } } } },
      },
    },
  );

  await t.test("native TRACE method is parsed under its tag", () => {
    const traceEndpoint = parsedSpec.tags
      .find((one) => one.name === "System")
      ?.paths.find((p) => p.method === "trace");
    assert.ok(traceEndpoint, "TRACE /diagnostics endpoint should be registered");
    assert.equal(traceEndpoint.path, "/diagnostics");
    assert.equal(traceEndpoint.elementId, "trace-diagnostics");
  });

  await t.test("Callbacks are attached to POST /orders", () => {
    const postOrder = parsedSpec.tags
      .find((one) => one.name === "Orders")
      ?.paths.find((p) => p.method === "post" && p.path === "/orders");
    assert.ok(
      postOrder?.callbacks?.onOrderStatusChange,
      "onOrderStatusChange callback should exist",
    );
  });

  await t.test("Webhooks are parsed and indexed", () => {
    const webhooks = parsedSpec.tags.flatMap((one) => one.paths).filter((p) => p.isWebhook);
    assert.deepEqual(webhooks.map((p) => p.path).sort(), ["inventoryAlert", "newPetListed"]);
  });
});
