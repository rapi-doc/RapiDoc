import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createMockApp, startMockServer, tokenScopes } from "../src/index.js";
import { parsePrefer } from "../src/responses.js";
import { AUDIENCE, client, FIXTURES, quiet, startIssuer } from "./helpers.js";

const orders = { id: "orders", fullPath: path.join(FIXTURES, "orders.yaml"), title: "Orders API" };
const legacy = { id: "legacy", fullPath: path.join(FIXTURES, "legacy.json") };

describe("rapidoc mock", () => {
  let issuer;
  let call;
  let tokens;

  before(async () => {
    issuer = await startIssuer();
    const { app } = await createMockApp({
      apis: [orders, legacy],
      issuer: issuer.issuer,
      audience: AUDIENCE,
      ...quiet,
    });
    call = client(app);
    tokens = {
      reader: await issuer.sign({ permissions: ["orders:read"] }), // Auth0 RBAC
      writer: await issuer.sign({ scope: "openid orders:read orders:write" }), // OAuth scope string
      scp: await issuer.sign({ scp: ["orders:read"] }), // Okta / Entra ID
      none: await issuer.sign({ permissions: [] }),
      expired: await issuer.sign({ permissions: ["orders:read"] }, { expiresIn: "-1m" }),
      otherAudience: await issuer.sign(
        { permissions: ["orders:read"] },
        { audience: "https://other.test" },
      ),
      otherIssuer: await issuer.sign(
        { permissions: ["orders:read"] },
        { iss: "https://evil.test/" },
      ),
      forged: await issuer.signWithOtherKey({ permissions: ["orders:read"] }),
    };
  });
  after(() => issuer.close());

  describe("security", () => {
    it("serves operations with `security: []` to anyone", async () => {
      const res = await call("GET", "/orders/health");
      assert.equal(res.status, 200);
      assert.deepEqual(res.data, { ok: true });
    });

    it("answers 401 with a Bearer challenge when the token is missing", async () => {
      const res = await call("GET", "/orders/orders");
      assert.equal(res.status, 401);
      assert.equal(res.headers.get("www-authenticate"), 'Bearer realm="rapidoc-mock"');
      assert.equal(res.headers.get("content-type"), "application/problem+json");
      assert.equal(
        res.headers.get("access-control-allow-origin"),
        "*",
        "errors carry CORS headers so Try can show them",
      );
    });

    for (const name of ["expired", "otherAudience", "otherIssuer", "forged"]) {
      it(`answers 401 invalid_token for a token that is ${name}`, async () => {
        const res = await call("GET", "/orders/orders", { token: tokens[name] });
        assert.equal(res.status, 401);
        assert.match(res.headers.get("www-authenticate"), /error="invalid_token"/);
      });
    }

    it("answers 401 for a token that is not a JWT", async () => {
      assert.equal((await call("GET", "/orders/orders", { token: "not-a-jwt" })).status, 401);
    });

    it("accepts the scope from permissions, scope or scp", async () => {
      for (const name of ["reader", "writer", "scp"]) {
        const res = await call("GET", "/orders/orders", { token: tokens[name] });
        assert.equal(res.status, 200, name);
      }
    });

    it("answers 403 insufficient_scope when the token lacks the operation scope", async () => {
      const res = await call("GET", "/orders/orders", { token: tokens.none });
      assert.equal(res.status, 403);
      assert.equal(
        res.headers.get("www-authenticate"),
        'Bearer error="insufficient_scope", scope="orders:read"',
      );
      assert.deepEqual(res.data.required, ["orders:read"]);
      assert.match(res.data.detail, /needs the orders:read permission; the token has none/);
    });

    it("requires the oauth2 scope for the plain bearer alternative too", async () => {
      const read = await call("POST", "/orders/orders", {
        token: tokens.reader,
        json: { sku: "ABC", quantity: 1 },
      });
      assert.equal(read.status, 403);
      assert.deepEqual(read.data.required, ["orders:write"]);
      const write = await call("POST", "/orders/orders", {
        token: tokens.writer,
        json: { sku: "ABC", quantity: 1 },
      });
      assert.equal(write.status, 201);
    });

    it("checks that an API key is present", async () => {
      assert.equal((await call("GET", "/orders/lookup?code=A")).status, 401);
      const res = await call("GET", "/orders/lookup?code=A", {
        headers: { "x-api-key": "anything" },
      });
      assert.equal(res.status, 200);
      assert.deepEqual(res.data, { code: "ABC", found: true });
    });

    it("checks that Basic credentials are present", async () => {
      assert.equal((await call("GET", "/legacy/accounts/1")).status, 401);
      assert.equal(
        (
          await call("GET", "/legacy/accounts/1", {
            headers: { authorization: `Basic ${btoa("a:b")}` },
          })
        ).status,
        200,
      );
    });

    it("reads scopes from every claim tokens use", () => {
      const scopes = tokenScopes({ scope: "a b", scp: ["c"], permissions: ["d", 7] });
      assert.deepEqual([...scopes].sort(), ["a", "b", "c", "d"]);
    });
  });

  describe("without an issuer", () => {
    it("accepts any bearer token and still asks for one", async () => {
      const { app, verifier } = await createMockApp({ apis: [orders], ...quiet });
      const open = client(app);
      assert.equal(verifier, null);
      assert.equal((await open("GET", "/orders/orders")).status, 401);
      assert.equal((await open("GET", "/orders/orders", { token: "anything" })).status, 200);
    });

    it("fails to start when the issuer cannot be discovered", async () => {
      await assert.rejects(
        createMockApp({ apis: [orders], issuer: "http://127.0.0.1:9/", ...quiet }),
        /could not be discovered/,
      );
    });
  });

  describe("responses", () => {
    it("uses the first example, a named example with Prefer, and says so in Preference-Applied", async () => {
      const first = await call("GET", "/orders/orders", { token: tokens.reader });
      assert.equal(first.data.data.length, 2);
      const named = await call("GET", "/orders/orders", {
        token: tokens.reader,
        headers: { prefer: "example=empty" },
      });
      assert.deepEqual(named.data, { data: [] });
      assert.equal(named.headers.get("preference-applied"), "example=empty");
    });

    it("returns a documented error with Prefer: code=, generated from a schema in another file", async () => {
      const res = await call("GET", "/orders/orders", {
        token: tokens.reader,
        headers: { prefer: "code=503" },
      });
      assert.equal(res.status, 503);
      assert.equal(res.headers.get("content-type"), "application/problem+json");
      assert.equal(typeof res.data.title, "string");
      assert.ok(res.data.status >= 400 && res.data.status <= 599);
      assert.equal(res.headers.get("preference-applied"), "code=503");
    });

    it("ignores Prefer: code= for an undocumented status", async () => {
      const res = await call("GET", "/orders/orders", {
        token: tokens.reader,
        headers: { prefer: "code=418" },
      });
      assert.equal(res.status, 200);
      assert.equal(res.headers.get("preference-applied"), null);
    });

    it("generates schema-valid data when there is no example, the same every time", async () => {
      const a = await call("GET", "/orders/orders/ord_abc", { token: tokens.reader });
      const b = await call("GET", "/orders/orders/ord_xyz", { token: tokens.reader });
      assert.equal(a.status, 200);
      assert.deepEqual(a.data, b.data);
      assert.match(a.data.id, /^ord_[a-z0-9]{6}$/);
      assert.match(a.data.total.amount, /^\d{1,7}\.\d{2}$/);
      for (const line of a.data.lines) {
        assert.match(line.sku, /^[A-Z]{3}-\d{3}$/);
        assert.match(line.price.amount, /^\d{1,7}\.\d{2}$/);
      }
      assert.ok(["open", "shipped", "cancelled"].includes(a.data.status));
      assert.ok(!("secret" in a.data), "writeOnly properties stay out of responses");
      assert.ok(Date.parse(a.data.created_at) >= Date.parse("2025-01-01"));
    });

    it("generates other data with another seed", async () => {
      const { app } = await createMockApp({ apis: [orders], seed: 2, ...quiet });
      const other = await client(app)("GET", "/orders/orders/ord_abc", { token: "t" });
      const usual = await call("GET", "/orders/orders/ord_abc", { token: tokens.reader });
      assert.notDeepEqual(other.data, usual.data);
    });

    it("generates documented headers and a 201 body", async () => {
      const res = await call("POST", "/orders/orders", {
        token: tokens.writer,
        json: { sku: "ABC", quantity: 2 },
      });
      assert.equal(res.status, 201);
      assert.equal(res.headers.get("location"), "/orders/ord_9");
      assert.match(res.data.id, /^ord_/);
    });

    it("stops recursive schemas after one level", async () => {
      const res = await call("GET", "/orders/categories", { token: tokens.reader });
      assert.equal(res.status, 200);
      assert.equal(typeof res.data.name, "string");
      for (const child of res.data.children ?? []) assert.deepEqual(child.children ?? [], []);
    });

    it("fills the oneOf branch next to an allOf", async () => {
      const res = await call("GET", "/orders/payments/p1", { token: tokens.reader });
      assert.equal(res.status, 200);
      assert.equal(typeof res.data.amount, "number");
      assert.equal(res.data.method, "sepa");
      assert.match(res.data.iban, /^[A-Z]{2}\d{20}$/);
    });

    it("reads OpenAPI 3.0 nullable and exclusiveMinimum, and operations without an operationId", async () => {
      const res = await call("GET", "/legacy/accounts/7", {
        headers: { authorization: `Basic ${btoa("a:b")}` },
      });
      assert.equal(res.status, 200);
      assert.ok(res.data.balance > 0 && res.data.balance <= 1000);
      assert.ok(
        res.data.closed_on === null || /^202[56]-\d\d-\d\d$/.test(res.data.closed_on),
        res.data.closed_on,
      );
    });

    it("answers HEAD with headers only", async () => {
      const res = await call("HEAD", "/orders/health");
      assert.equal(res.status, 200);
      assert.equal(res.text, "");
    });
  });

  describe("request validation", () => {
    it("rejects a body that misses required properties, naming them", async () => {
      const res = await call("POST", "/orders/orders", {
        token: tokens.writer,
        json: { sku: "ABC" },
      });
      assert.equal(res.status, 400);
      assert.deepEqual(res.data.errors, [{ in: "body", message: "missing quantity" }]);
    });

    it("rejects malformed JSON", async () => {
      const res = await call("POST", "/orders/orders", { token: tokens.writer, json: '{"sku":' });
      assert.equal(res.status, 400);
      assert.match(res.data.detail, /not valid JSON/);
    });

    it("rejects bad query and path parameters", async () => {
      assert.equal(
        (await call("GET", "/orders/orders?limit=0", { token: tokens.reader })).status,
        400,
      );
      assert.equal((await call("GET", "/orders/orders/BAD", { token: tokens.reader })).status, 400);
      assert.equal(
        (await call("GET", "/orders/lookup", { headers: { "x-api-key": "k" } })).status,
        400,
        "required query parameter",
      );
    });

    it("checks auth before the request: no token on a bad request is still 401", async () => {
      assert.equal((await call("POST", "/orders/orders", { json: {} })).status, 401);
    });

    it("validates merge-patch+json bodies against their schema", async () => {
      const headers = { "content-type": "application/merge-patch+json" };
      const bad = await call("PATCH", "/orders/orders/ord_abc", {
        token: tokens.writer,
        headers,
        json: { status: "lost" },
      });
      assert.equal(bad.status, 400);
      const good = await call("PATCH", "/orders/orders/ord_abc", {
        token: tokens.writer,
        headers,
        json: { status: "shipped" },
      });
      assert.equal(good.status, 200);
    });

    it("validates multipart uploads", async () => {
      const form = () => {
        const data = new FormData();
        data.append("file", new Blob(["%PDF-1.7"], { type: "application/pdf" }), "label.pdf");
        return data;
      };
      const missing = await call("POST", "/orders/orders/ord_1/attachments", {
        token: tokens.reader,
        body: form(),
      });
      assert.equal(missing.status, 400);
      assert.deepEqual(missing.data.errors, [{ in: "body", message: "missing kind" }]);
      const data = form();
      data.append("kind", "invoice");
      const ok = await call("POST", "/orders/orders/ord_1/attachments", {
        token: tokens.reader,
        body: data,
      });
      assert.equal(ok.status, 201);
      assert.deepEqual(ok.data, { id: "att_1" });
    });
  });

  describe("routing", () => {
    it("lists the APIs at /", async () => {
      const res = await call("GET", "/");
      assert.deepEqual(res.data.apis, [
        { id: "orders", title: "Orders API", url: "/orders", operations: 9 },
        { id: "legacy", title: "Legacy API", url: "/legacy", operations: 1 },
      ]);
    });

    it("answers 404 for unknown paths and APIs, 405 with Allow for other methods", async () => {
      assert.equal((await call("GET", "/orders/nope")).status, 404);
      assert.match((await call("GET", "/nope")).data.detail, /APIs: \/orders, \/legacy/);
      const res = await call("DELETE", "/orders/orders");
      assert.equal(res.status, 405);
      assert.equal(res.headers.get("allow"), "GET, POST");
    });

    it("answers CORS preflights for the portal", async () => {
      const res = await call("OPTIONS", "/orders/orders", {
        headers: {
          "access-control-request-method": "POST",
          "access-control-request-headers": "authorization, content-type, prefer",
        },
      });
      assert.equal(res.status, 204);
      assert.equal(res.headers.get("access-control-allow-origin"), "*");
      assert.match(res.headers.get("access-control-allow-headers"), /authorization/);
    });

    it("can restrict CORS to the portal origin", async () => {
      const { app } = await createMockApp({
        apis: [orders],
        origin: "http://portal.test",
        ...quiet,
      });
      const res = await client(app)("GET", "/orders/health");
      assert.equal(res.headers.get("access-control-allow-origin"), "http://portal.test");
    });
  });

  describe("loading", () => {
    it("skips a spec it cannot load and serves the others", async () => {
      const dir = fs.mkdtempSync(path.join(os.tmpdir(), "rapidoc-mock-"));
      try {
        const swagger = path.join(dir, "old.json");
        fs.writeFileSync(
          swagger,
          JSON.stringify({ swagger: "2.0", info: { title: "x", version: "1" }, paths: {} }),
        );
        const warnings = [];
        const { apis, skipped } = await createMockApp({
          apis: [orders, { id: "old", fullPath: swagger }],
          log: () => {},
          warn: (l) => warnings.push(l),
        });
        assert.deepEqual(
          apis.map((api) => api.id),
          ["orders"],
        );
        assert.match(skipped[0].error, /not OpenAPI 3\.0 or 3\.1 \(Swagger 2\.0\)/);
        assert.match(warnings[0], /old: not served/);
        await assert.rejects(
          createMockApp({ apis: [{ id: "old", fullPath: swagger }], ...quiet }),
          /No API could be loaded/,
        );
      } finally {
        fs.rmSync(dir, { recursive: true, force: true });
      }
    });

    it("starts on a port and stops", async () => {
      const server = await startMockServer({
        apis: [orders],
        port: 0,
        host: "127.0.0.1",
        ...quiet,
      });
      try {
        const res = await fetch(`${server.url}/orders/health`);
        assert.equal(res.status, 200);
      } finally {
        await server.close();
      }
    });
  });

  it("parses Prefer headers", () => {
    assert.deepEqual(parsePrefer('code=404, example="empty"; dynamic=true'), {
      code: "404",
      example: "empty",
      dynamic: "true",
    });
    assert.deepEqual(parsePrefer(undefined), {});
  });
});
