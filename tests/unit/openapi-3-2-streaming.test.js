import { describe, it, after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ProcessSpec from "../../packages/rapidoc/src/utils/spec-parser.js";
import {
  streamKind,
  streamItemLabel,
  serializeStreamItems,
  isStreamingResponse,
  readStreamText,
} from "../../packages/rapidoc/src/utils/stream-utils.js";
import { prepareResponseDefinitions } from "../../packages/rapidoc/src/utils/response-utils.js";
import { generateExample } from "../../packages/rapidoc/src/utils/schema-utils.js";
import {
  enableMockServer,
  disableMockServer,
  mockStreamChunks,
} from "../../packages/rapidoc/src/utils/mock-interceptor.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const specText = fs.readFileSync(
  path.resolve(__dirname, "../../docs/public/specs/streaming.yaml"),
  "utf8",
);

describe("stream-utils", () => {
  it("recognizes the sequential media types", () => {
    assert.equal(streamKind("text/event-stream; charset=utf-8"), "sse");
    assert.equal(streamKind("application/jsonl"), "jsonl");
    assert.equal(streamKind("application/x-ndjson"), "jsonl");
    assert.equal(streamKind("application/json-seq"), "json-seq");
    assert.equal(streamKind("multipart/mixed"), "multipart");
    assert.equal(streamKind("application/json"), "");
    assert.equal(streamItemLabel("text/event-stream"), "Each event");
    assert.equal(streamItemLabel("application/jsonl"), "Each line");
    assert.equal(isStreamingResponse("text/event-stream"), true);
    assert.equal(isStreamingResponse("multipart/mixed"), false);
    assert.equal(isStreamingResponse(null), false);
  });

  it("serializes items as SSE events, JSON lines and JSON text sequences", () => {
    assert.equal(
      serializeStreamItems(
        [{ event: "delta", id: "1", data: { content: "Hi" } }, { data: "line one\nline two" }],
        "text/event-stream",
      ),
      'event: delta\nid: 1\ndata: {"content":"Hi"}\n\ndata: line one\ndata: line two\n',
    );
    assert.equal(
      serializeStreamItems([{ a: 1 }, { a: 2 }], "application/jsonl"),
      '{"a":1}\n{"a":2}',
    );
    assert.equal(serializeStreamItems([{ a: 1 }], "application/json-seq"), '\u001e{"a":1}');
  });

  it("reads a body chunk by chunk", async () => {
    const encoder = new TextEncoder();
    const body = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode("data: 1\n\n"));
        controller.enqueue(encoder.encode("data: 2\n\n"));
        controller.close();
      },
    });
    const seen = [];
    const text = await readStreamText(new Response(body), (t) => seen.push(t));
    assert.equal(text, "data: 1\n\ndata: 2\n\n");
    assert.ok(seen.includes("data: 1\n\n"), "the first chunk is shown before the stream ends");
  });
});

describe("OpenAPI 3.2 itemSchema in responses and request bodies", async () => {
  const spec = await ProcessSpec.call({}, specText);
  const ops = spec.tags.flatMap((t) => t.paths);
  const byId = (id) => ops.find((p) => p.operationId === id);

  it("describes one item and shows the spec's example as the stream", () => {
    const defs = prepareResponseDefinitions(byId("createChatCompletion").responses);
    const sse = defs.mimeResponsesForEachStatus["200"]["text/event-stream"];
    assert.equal(sse.streamItemLabel, "Each event");
    assert.ok(sse.schemaTree, "the item schema is shown");
    assert.equal(sse.examples[0].exampleFormat, "text");
    assert.match(sse.examples[0].exampleValue, /^event: delta\nid: 1\ndata: \{"index":0/);
    assert.match(sse.examples[0].exampleValue, /event: done\nid: 3\n/);
  });

  it("generates an item from the item schema when there is no example", () => {
    const defs = prepareResponseDefinitions(byId("exportEvents").responses);
    const jsonl = defs.mimeResponsesForEachStatus["200"]["application/jsonl"];
    assert.equal(jsonl.streamItemLabel, "Each line");
    const line = JSON.parse(jsonl.examples[0].exampleValue);
    assert.deepEqual(line, { id: "evt_1", type: "signup", at: "2026-11-17T09:00:00Z" });
  });

  it("leaves media types with a schema as they were", () => {
    const defs = prepareResponseDefinitions(byId("getDailyReport").responses);
    assert.equal(defs.mimeResponsesForEachStatus["200"]["application/xml"].streamItemLabel, "");
  });

  it("the mock answers a stream with its text and Content-Type", async () => {
    globalThis.window = globalThis;
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async () => new Response("not mocked");
    after(() => {
      disableMockServer();
      globalThis.fetch = originalFetch;
    });
    enableMockServer(spec, { log: "false" });
    const res = await fetch("https://api.example.com/v1/chat/completions", {
      method: "POST",
      body: "{}",
    });
    assert.equal(res.headers.get("content-type"), "text/event-stream");
    assert.match(await res.text(), /^event: delta\n/);
  });
});

describe("the mock streams itemSchema responses item by item", async () => {
  const spec = await ProcessSpec.call({}, specText);
  const ops = spec.tags.flatMap((t) => t.paths);
  const content = (id) =>
    Object.entries(ops.find((p) => p.operationId === id).responses["200"].content)[0];

  it("sends the example's items, one SSE event per chunk", () => {
    const [type, media] = content("createChatCompletion");
    const chunks = mockStreamChunks(type, media);
    assert.equal(chunks.length, 3);
    assert.equal(chunks[0], 'event: delta\nid: 1\ndata: {"index":0,"content":"Hel"}\n\n');
    assert.match(chunks[2], /^event: done\n/);
  });

  it("repeats a generated item five times, numbering its id", () => {
    const [type, media] = content("exportEvents");
    const chunks = mockStreamChunks(type, media);
    assert.equal(chunks.length, 5);
    assert.deepEqual(
      chunks.map((c) => JSON.parse(c).id),
      ["1", "2", "3", "4", "5"],
    );
    assert.ok(chunks.every((c) => c.endsWith("}\n")));
  });

  it("splits an example written as text into its events", () => {
    const chunks = mockStreamChunks("text/event-stream", {
      itemSchema: { type: "object" },
      examples: { a: { value: "data: 1\n\ndata: 2\n\n" } },
    });
    assert.deepEqual(chunks, ["data: 1\n\n", "data: 2\n\n"]);
  });

  it("fetch returns the items over time, and stops when the request is aborted", async () => {
    globalThis.window = globalThis;
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async () => new Response("not mocked");
    after(() => {
      disableMockServer();
      globalThis.fetch = originalFetch;
    });
    enableMockServer(spec, { log: "false", delay: 40 });

    const started = Date.now();
    const res = await fetch("https://api.example.com/v1/events/export");
    assert.ok(Date.now() - started < 40, "a stream answers at once");
    assert.equal(res.headers.get("content-type"), "application/jsonl");
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    const first = decoder.decode((await reader.read()).value);
    assert.equal(first.trim().split("\n").length, 1, "the first read is one item");
    let rest = "";
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      rest += decoder.decode(value);
    }
    assert.equal((first + rest).trim().split("\n").length, 5);
    assert.ok(Date.now() - started >= 4 * 40, "the items are 40 ms apart");

    const controller = new AbortController();
    const aborted = await fetch("https://api.example.com/v1/events/export", {
      signal: controller.signal,
    });
    const abortedReader = aborted.body.getReader();
    await abortedReader.read();
    controller.abort();
    await assert.rejects(abortedReader.read(), { name: "AbortError" });
  });
});

describe("XML arrays: nodeType, wrapped and item names", () => {
  const xmlOf = (types) =>
    generateExample(
      { type: "object", xml: { name: "report" }, properties: { types } },
      "application/xml",
      null,
      null,
      true,
      false,
      "text",
    )[0].exampleValue;
  const items = { type: "string", xml: { name: "type" } };

  it("wraps the items for nodeType: element, as for wrapped: true", () => {
    const viaNodeType = xmlOf({
      type: "array",
      xml: { name: "types", nodeType: "element" },
      items,
    });
    const viaWrapped = xmlOf({ type: "array", xml: { name: "types", wrapped: true }, items });
    assert.equal(viaNodeType, viaWrapped);
    assert.match(viaNodeType, /<types>\n {4}<type>string<\/type>\n {2}<\/types>/);
  });

  it("puts unwrapped item elements directly in the parent", () => {
    const xml = xmlOf({ type: "array", xml: { name: "types" }, items });
    assert.match(xml, /<report>\n {2}<type>string<\/type>\n<\/report>/);
  });

  it("names items by the property when the items have no xml name", () => {
    const xml = xmlOf({ type: "array", xml: { nodeType: "element" }, items: { type: "string" } });
    assert.match(xml, /<types>\n {4}<types>string<\/types>\n {2}<\/types>/);
  });

  it("names items with an example by their element, not their index", () => {
    const withItemExample = xmlOf({
      type: "array",
      xml: { name: "types", nodeType: "element" },
      items: { ...items, examples: ["signup"] },
    });
    assert.match(withItemExample, /<types>\n {4}<type>signup<\/type>\n {2}<\/types>/);
    const withArrayExample = xmlOf({
      type: "array",
      xml: { name: "types", wrapped: true },
      items,
      examples: [["signup", "purchase"]],
    });
    assert.match(withArrayExample, /<type>signup<\/type>\n {4}<type>purchase<\/type>/);
    assert.doesNotMatch(withArrayExample, /<0>|<1>/);
  });

  it("writes object items as elements with their fields", () => {
    const xml = xmlOf({
      type: "array",
      xml: { wrapped: true },
      items: {
        type: "object",
        xml: { name: "tag" },
        properties: { id: { type: "integer", examples: [7] } },
      },
    });
    assert.match(xml, /<types>\n {4}<tag>\n {6}<id>7<\/id>\n {4}<\/tag>\n {2}<\/types>/);
  });
});
