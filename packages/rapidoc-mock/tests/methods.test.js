import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { createMockApp, startMockServer } from "../src/index.js";
import { client, FIXTURES, quiet } from "./helpers.js";

const methods = { id: "methods", fullPath: path.join(FIXTURES, "methods.yaml") };

describe("rapidoc mock: OpenAPI 3.2 QUERY and additionalOperations", () => {
  let call;
  const warnings = [];
  before(async () => {
    const { app } = await createMockApp({
      apis: [methods],
      log: () => {},
      warn: (line) => warnings.push(line),
    });
    call = client(app);
  });

  it("answers QUERY with the operation's example", async () => {
    const res = await call("QUERY", "/methods/books", { json: { title: "Dune" } });
    assert.equal(res.status, 200);
    assert.deepEqual(res.data, [{ id: 1, title: "Dune" }]);
  });

  it("validates a QUERY request body", async () => {
    const res = await call("QUERY", "/methods/books", { json: { author: "Herbert" } });
    assert.equal(res.status, 400);
    assert.match(JSON.stringify(res.data.errors), /missing title/);
  });

  it("answers a method from additionalOperations, with the path's parameters checked", async () => {
    const ok = await call("PURGE", "/methods/books/7");
    assert.equal(ok.status, 204);
    const bad = await call("PURGE", "/methods/books/seven");
    assert.equal(bad.status, 400);
  });

  it("lists QUERY and additional methods in Allow on a 405", async () => {
    const onBooks = await call("DELETE", "/methods/books");
    assert.equal(onBooks.status, 405);
    assert.equal(onBooks.headers.get("allow"), "QUERY");
    const onBook = await call("DELETE", "/methods/books/7");
    assert.equal(onBook.status, 405);
    assert.deepEqual(onBook.headers.get("allow").split(", ").sort(), ["DIAGNOSE", "GET", "PURGE"]);
  });

  it("does not expose the internal route of other methods", async () => {
    const res = await call("POST", "/methods/__rapidoc_method__/QUERY/books", { json: {} });
    assert.equal(res.status, 404);
  });

  it("lets QUERY and PURGE through CORS preflight", async () => {
    const res = await call("OPTIONS", "/methods/books", {
      headers: { "access-control-request-method": "QUERY" },
    });
    const allowed = res.headers.get("access-control-allow-methods").split(",");
    assert.ok(allowed.includes("QUERY") && allowed.includes("PURGE"), allowed.join(","));
  });

  it("warns about a method Node's HTTP server cannot receive", () => {
    assert.ok(
      warnings.some((line) => /DIAGNOSE \/books\/\{id\} can't be called/.test(line)),
      warnings.join("\n"),
    );
  });
});

describe("rapidoc mock: QUERY over HTTP", () => {
  let server;
  before(async () => {
    server = await startMockServer({ apis: [methods], port: 0, host: "127.0.0.1", ...quiet });
  });
  after(() => server.close());

  it("serves QUERY through Node's HTTP server", async () => {
    const res = await fetch(`${server.url}/methods/books`, {
      method: "QUERY",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ title: "Dune" }),
    });
    assert.equal(res.status, 200);
    assert.deepEqual(await res.json(), [{ id: 1, title: "Dune" }]);
  });
});
