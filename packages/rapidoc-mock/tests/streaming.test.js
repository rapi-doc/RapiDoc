import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { createMockApp, startMockServer } from "../src/index.js";
import { client, FIXTURES, quiet } from "./helpers.js";

const streaming = { id: "streaming", fullPath: path.join(FIXTURES, "streaming.yaml") };

/** Reads a fetch body chunk by chunk: each chunk's text and when it arrived (ms after the start) */
async function readChunks(response, started) {
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  const chunks = [];
  for (;;) {
    const { done, value } = await reader.read();
    if (done) return chunks;
    chunks.push({ text: decoder.decode(value), at: Date.now() - started });
  }
}

describe("rapidoc mock: OpenAPI 3.2 streams (itemSchema)", () => {
  let call;
  before(async () => {
    const { app } = await createMockApp({ apis: [streaming], streamInterval: 5, ...quiet });
    call = client(app);
  });

  it("loads an OpenAPI 3.2 spec", async () => {
    const res = await call("GET", "/");
    assert.equal(res.status, 200);
    assert.equal(res.data.apis[0].id, "streaming");
  });

  it("answers SSE with the first example's items as events", async () => {
    const res = await call("POST", "/streaming/chat", { json: {} });
    assert.equal(res.status, 200);
    assert.equal(res.headers.get("content-type"), "text/event-stream");
    assert.equal(res.headers.get("cache-control"), "no-cache");
    assert.equal(
      res.data,
      'event: delta\nid: 1\ndata: {"content":"Hel"}\n\nevent: delta\nid: 2\ndata: {"content":"lo"}\n\nevent: done\nid: 3\ndata: {}\n\n',
    );
  });

  it("splits a named example given as text (serializedValue) into events", async () => {
    const res = await call("POST", "/streaming/chat", {
      json: {},
      headers: { prefer: "example=raw" },
    });
    assert.equal(res.data, "data: one\n\ndata: two\n\n");
    assert.equal(res.headers.get("preference-applied"), "example=raw");
  });

  it("generates five JSON lines from the item schema, ids numbered", async () => {
    const res = await call("GET", "/streaming/events");
    assert.equal(res.headers.get("content-type"), "application/jsonl");
    const lines = res.data
      .trim()
      .split("\n")
      .map((line) => JSON.parse(line));
    assert.equal(lines.length, 5);
    assert.deepEqual(
      lines.map((line) => line.id),
      ["1", "2", "3", "4", "5"],
    );
    assert.ok(lines.every((line) => ["signup", "purchase"].includes(line.type)));
  });

  it("sends no body for HEAD", async () => {
    const res = await call("HEAD", "/streaming/events");
    assert.equal(res.status, 200);
    assert.ok(!res.data, "no body");
  });

  it("checks a JSON Lines request body line by line against the item schema", async () => {
    const ok = await call("POST", "/streaming/events", {
      headers: { "content-type": "application/jsonl" },
      body: '{"id":"a","type":"signup"}\n{"id":"b","type":"purchase"}\n',
    });
    assert.equal(ok.status, 202);

    const notJson = await call("POST", "/streaming/events", {
      headers: { "content-type": "application/jsonl" },
      body: '{"id":"a","type":"signup"}\nnot json\n',
    });
    assert.equal(notJson.status, 400);
    assert.match(JSON.stringify(notJson.data.errors), /line 2 is not valid JSON/);

    const wrong = await call("POST", "/streaming/events", {
      headers: { "content-type": "application/jsonl" },
      body: '{"id":"a","type":"signup"}\n{"type":"refund"}\n',
    });
    assert.equal(wrong.status, 400);
    const messages = wrong.data.errors.map((error) => error.message).join("; ");
    assert.match(messages, /item 2: missing id/);
    assert.match(messages, /item 2: must be equal to one of the allowed values/);
  });
});

describe("rapidoc mock: streams arrive over time", () => {
  let server;
  before(async () => {
    server = await startMockServer({
      apis: [streaming],
      port: 0,
      host: "127.0.0.1",
      streamInterval: 60,
      ...quiet,
    });
  });
  after(() => server.close());

  it("sends one item per chunk, streamInterval ms apart", async () => {
    const started = Date.now();
    const res = await fetch(`${server.url}/streaming/events`);
    assert.ok(Date.now() - started < 60, "the response starts at once");
    const chunks = await readChunks(res, started);
    assert.equal(chunks.length, 5);
    assert.equal(chunks[0].text.split("\n").filter(Boolean).length, 1, "one line per chunk");
    assert.ok(chunks[4].at >= 4 * 60 - 10, `the last item comes after 4 gaps (${chunks[4].at} ms)`);
  });

  it("stops when the client goes away", async () => {
    const controller = new AbortController();
    const res = await fetch(`${server.url}/streaming/events`, { signal: controller.signal });
    const reader = res.body.getReader();
    await reader.read();
    controller.abort();
    await assert.rejects(reader.read(), { name: "AbortError" });
  });
});
