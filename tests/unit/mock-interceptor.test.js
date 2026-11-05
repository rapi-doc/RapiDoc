import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert";
import {
  compileRoutes,
  enableMockServer,
  disableMockServer,
  updateMockConfig,
  isMockServerActive,
} from "../../packages/rapidoc/src/utils/mock-interceptor.js";

describe("mock-interceptor", () => {
  const originalFetch = async (url) => {
    return new Response(JSON.stringify({ realNetwork: true, url }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  };

  const testSpec = {
    servers: [{ url: "https://api.example.com/v1" }, { url: "/api/v1" }],
    tags: [
      {
        name: "Users",
        paths: [
          {
            method: "GET",
            path: "/users/{id}",
            responses: {
              200: {
                content: {
                  "application/json": {
                    example: { id: 1, name: "Alice" },
                  },
                },
              },
              404: {
                content: {
                  "application/json": {
                    example: { error: "User not found" },
                  },
                },
              },
            },
          },
          {
            method: "POST",
            path: "/users",
            responses: {
              201: {
                content: {
                  "application/json": {
                    example: { id: 2, name: "Bob" },
                  },
                },
              },
            },
          },
        ],
      },
    ],
  };

  beforeEach(() => {
    globalThis.window = globalThis;
    globalThis.fetch = originalFetch;
  });

  afterEach(() => {
    disableMockServer();
  });

  it("should compile routes and parameter regexes properly", () => {
    const routes = compileRoutes(testSpec);
    assert.strictEqual(routes.length, 2);
    assert.strictEqual(routes[0].routeKey, "GET /users/{id}");
    assert.strictEqual(routes[1].routeKey, "POST /users");
  });

  it("should intercept matching GET endpoint and return mock data", async () => {
    enableMockServer(testSpec, { log: "false" });
    assert.strictEqual(isMockServerActive(), true);

    const res = await fetch("https://api.example.com/v1/users/42");
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.headers.get("x-mock-server"), "RapiDoc");

    const data = await res.json();
    assert.deepStrictEqual(data, { id: 1, name: "Alice" });
  });

  it("should match relative paths", async () => {
    enableMockServer(testSpec, { log: "false" });

    const res = await fetch("/api/v1/users/99");
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.deepStrictEqual(data, { id: 1, name: "Alice" });
  });

  it("should cycle through multi-status codes in sequence", async () => {
    enableMockServer(testSpec, { log: "false" });
    updateMockConfig({ statusCode: "404, 200", statusStrategy: "cycle" });

    const first = await fetch("/api/v1/users/1");
    assert.strictEqual(first.status, 404);

    const second = await fetch("/api/v1/users/1");
    assert.strictEqual(second.status, 200);

    const third = await fetch("/api/v1/users/1");
    assert.strictEqual(third.status, 404);
  });

  it("should pass through non-matching URLs to original fetch", async () => {
    enableMockServer(testSpec, { log: "false" });

    const res = await fetch("https://other.com/unknown");
    const data = await res.json();
    assert.strictEqual(data.realNetwork, true);
  });

  it("takes status codes per operation from a map, with * as the default", async () => {
    enableMockServer(testSpec, {
      log: "false",
      statusCode: { "get /users/{id}": "404", "*": "201" },
      statusStrategy: "cycle",
    });
    assert.strictEqual((await fetch("https://api.example.com/v1/users/1")).status, 404);
    assert.strictEqual(
      (await fetch("https://api.example.com/v1/users", { method: "POST" })).status,
      201,
    );

    // The same map as JSON text, as an attribute carries it; a list cycles per operation
    updateMockConfig({ statusCode: '{ "GET /users/{id}": "503, 200" }' });
    assert.strictEqual((await fetch("https://api.example.com/v1/users/1")).status, 503);
    assert.strictEqual((await fetch("https://api.example.com/v1/users/1")).status, 200);
    assert.strictEqual(
      (await fetch("https://api.example.com/v1/users", { method: "POST" })).status,
      201,
      "an operation outside the map, with no *, answers the spec's success",
    );
  });

  describe("several mocks on one page", () => {
    const ordersSpec = {
      servers: [{ url: "http://localhost:4010/orders" }],
      tags: [
        {
          name: "Orders",
          paths: [
            {
              method: "GET",
              path: "/orders",
              responses: {
                200: { content: { "application/json": { example: [{ id: "o-1" }] } } },
              },
            },
            {
              method: "GET",
              path: "/users/{id}",
              responses: {
                200: { content: { "application/json": { example: { id: 9, from: "orders" } } } },
              },
            },
          ],
        },
      ],
    };
    const users = { id: "users-element" };
    const orders = { id: "orders-element" };

    afterEach(() => {
      disableMockServer(users);
      disableMockServer(orders);
    });

    it("answers each API's routes, whoever enabled its mock", async () => {
      enableMockServer(testSpec, { log: "false", owner: users });
      enableMockServer(ordersSpec, { log: "false", owner: orders });
      assert.strictEqual(isMockServerActive(), true);
      assert.strictEqual(isMockServerActive(users), true);
      assert.strictEqual(isMockServerActive(orders), true);

      assert.deepStrictEqual(await (await fetch("https://api.example.com/v1/users/1")).json(), {
        id: 1,
        name: "Alice",
      });
      assert.deepStrictEqual(await (await fetch("http://localhost:4010/orders/orders")).json(), [
        { id: "o-1" },
      ]);
    });

    it("prefers the route under the request's server over a bare path", async () => {
      enableMockServer(testSpec, { log: "false", owner: users });
      enableMockServer(ordersSpec, { log: "false", owner: orders });

      // Both APIs have GET /users/{id}; the server in the URL decides
      assert.deepStrictEqual(await (await fetch("http://localhost:4010/orders/users/9")).json(), {
        id: 9,
        from: "orders",
      });
      assert.deepStrictEqual(await (await fetch("https://api.example.com/v1/users/9")).json(), {
        id: 1,
        name: "Alice",
      });
      // A bare path matches the mock enabled first
      assert.deepStrictEqual(await (await fetch("/users/9")).json(), { id: 1, name: "Alice" });
    });

    it("keeps status codes and cycle positions per mock", async () => {
      enableMockServer(testSpec, { log: "false", owner: users, statusCode: "404" });
      enableMockServer(ordersSpec, { log: "false", owner: orders });
      updateMockConfig({ owner: orders, statusCode: "200, 404", statusStrategy: "cycle" });

      assert.strictEqual((await fetch("https://api.example.com/v1/users/1")).status, 404);
      assert.strictEqual((await fetch("http://localhost:4010/orders/orders")).status, 200);
      assert.strictEqual((await fetch("http://localhost:4010/orders/orders")).status, 404);
      assert.strictEqual((await fetch("https://api.example.com/v1/users/1")).status, 404);
    });

    it("disabling one mock leaves the others on; the last one restores fetch", async () => {
      enableMockServer(testSpec, { log: "false", owner: users });
      enableMockServer(ordersSpec, { log: "false", owner: orders });

      disableMockServer(users);
      assert.strictEqual(isMockServerActive(users), false);
      assert.strictEqual(isMockServerActive(), true);
      const posted = await (
        await fetch("https://api.example.com/v1/users", { method: "POST" })
      ).json();
      assert.strictEqual(posted.realNetwork, true, "the users API is no longer mocked");
      assert.strictEqual((await fetch("http://localhost:4010/orders/orders")).status, 200);

      disableMockServer(orders);
      assert.strictEqual(isMockServerActive(), false);
      assert.strictEqual(fetch, originalFetch);
    });

    it("re-enabling an owner replaces only its own routes", async () => {
      enableMockServer(testSpec, { log: "false", owner: users });
      enableMockServer(ordersSpec, { log: "false", owner: orders });
      enableMockServer(ordersSpec, { log: "false", owner: users });

      // POST /users was only in users' old routes
      const posted = await (
        await fetch("https://api.example.com/v1/users", { method: "POST" })
      ).json();
      assert.strictEqual(posted.realNetwork, true, "users' old routes are gone");
      assert.strictEqual((await fetch("http://localhost:4010/orders/orders")).status, 200);
    });
  });

  it("should restore original fetch when disabled", async () => {
    enableMockServer(testSpec, { log: "false" });
    disableMockServer();
    assert.strictEqual(isMockServerActive(), false);

    const res = await fetch("/api/v1/users/1");
    const data = await res.json();
    assert.strictEqual(data.realNetwork, true);
  });

  describe("no-example-provided edge cases", () => {
    const edgeCaseSpec = {
      servers: [],
      tags: [
        {
          name: "EdgeCases",
          paths: [
            {
              method: "GET",
              path: "/writeonly-only",
              responses: {
                200: {
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        properties: {
                          password: { type: "string", writeOnly: true },
                          adminSecret: { type: "string", writeOnly: true },
                        },
                      },
                    },
                  },
                },
              },
            },
            {
              method: "GET",
              path: "/allof-primitive",
              responses: {
                200: {
                  content: {
                    "application/json": {
                      schema: {
                        allOf: [
                          { type: "string", description: "Primitive in allOf without example" },
                        ],
                      },
                    },
                  },
                },
              },
            },
            {
              method: "GET",
              path: "/empty-schema",
              responses: {
                200: {
                  content: {
                    "application/json": {
                      schema: { type: "object" },
                    },
                  },
                },
              },
            },
            {
              method: "GET",
              path: "/binary-stream",
              responses: {
                200: {
                  content: {
                    "application/octet-stream": {
                      schema: { type: "string", format: "binary" },
                    },
                  },
                },
              },
            },
          ],
        },
      ],
    };

    it("should omit writeOnly fields in response and return valid empty JSON object {}", async () => {
      enableMockServer(edgeCaseSpec, { log: "false" });

      const res = await fetch("/writeonly-only");
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.headers.get("content-type"), "application/json");

      const data = await res.json();
      assert.deepStrictEqual(data, {}, "Should omit writeOnly fields, returning {}");
    });

    it("should provide fallback JSON response when allOf primitive has no example", async () => {
      enableMockServer(edgeCaseSpec, { log: "false" });

      const res = await fetch("/allof-primitive");
      assert.strictEqual(res.status, 200);

      const data = await res.json();
      assert.strictEqual(data.status, 200);
      assert.strictEqual(data.message, "OK");
    });

    it("should return empty JSON object {} for empty schema definition", async () => {
      enableMockServer(edgeCaseSpec, { log: "false" });

      const res = await fetch("/empty-schema");
      assert.strictEqual(res.status, 200);

      const data = await res.json();
      assert.deepStrictEqual(data, {});
    });

    it("should return valid status text for binary stream without example", async () => {
      enableMockServer(edgeCaseSpec, { log: "false" });

      const res = await fetch("/binary-stream");
      assert.strictEqual(res.status, 200);
      const text = await res.text();
      assert.strictEqual(text, "OK");
    });
  });
});
