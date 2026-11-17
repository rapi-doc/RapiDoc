import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { renderTemplateToString } from "@rapidoc/prerender";
import {
  SLOW_AFTER_MS,
  countStreamItems,
  formatElapsed,
  networkErrorText,
  requestStatusText,
} from "../../packages/rapidoc/src/utils/request-status.js";
import { apiCallTemplate } from "../../packages/rapidoc/src/templates/api-response-template.js";

describe("Try request status wording", () => {
  it("formats durations", () => {
    assert.equal(formatElapsed(640.4), "640 ms");
    assert.equal(formatElapsed(3421), "3.4 s");
    assert.equal(formatElapsed(-5), "0 ms");
  });

  it("counts complete stream items only", () => {
    assert.equal(countStreamItems("data: 1\n\ndata: 2\n\nda", "text/event-stream"), 2);
    assert.equal(countStreamItems("data: 1\n\ndata: 2\n\n", "text/event-stream"), 2);
    assert.equal(countStreamItems('{"a":1}\n{"a":2}\n{"a"', "application/jsonl"), 2);
    assert.equal(countStreamItems('{"a":1}', "application/json"), 0);
  });

  it("says the request is waiting, then that the server is slow", () => {
    const url = "https://api.example.com/v1/events/export";
    assert.equal(
      requestStatusText({ phase: "waiting", elapsedMs: 3400, url }),
      `Waiting for ${url}… 3.4 s`,
    );
    assert.equal(
      requestStatusText({ phase: "waiting", elapsedMs: SLOW_AFTER_MS + 2100, url }),
      "The server is taking a while (12.1 s)",
    );
  });

  it("counts events while streaming and after a stop", () => {
    const sse = { responseText: "data: 1\n\ndata: 2\n\n", contentType: "text/event-stream" };
    assert.equal(
      requestStatusText({ phase: "streaming", elapsedMs: 1200, ...sse }),
      "Streaming… 2 events, 1.2 s",
    );
    assert.equal(
      requestStatusText({ phase: "stopped", elapsedMs: 1500, wasStreaming: true, ...sse }),
      "Stopped after 2 events, 1.5 s",
    );
    assert.equal(
      requestStatusText({
        phase: "streaming",
        elapsedMs: 300,
        responseText: '{"a":1}\n',
        contentType: "application/jsonl",
      }),
      "Streaming… 1 line, 300 ms",
    );
  });

  it("says a request cancelled while waiting was cancelled; done and failed have no status line", () => {
    assert.equal(requestStatusText({ phase: "stopped", elapsedMs: 5000 }), "Cancelled after 5.0 s");
    assert.equal(requestStatusText({ phase: "done", elapsedMs: 5000 }), "");
    assert.equal(requestStatusText({ phase: "failed", elapsedMs: 5000 }), "");
  });

  it("explains a failed fetch by host, and TRACE separately", () => {
    assert.equal(
      networkErrorText("https://api.example.com/v1/events/export", "GET"),
      "Couldn't reach api.example.com: the server doesn't exist, isn't reachable, or doesn't allow requests from this page (CORS).",
    );
    assert.match(networkErrorText("https://api.example.com/x", "TRACE"), /cURL/);
  });
});

describe("Try panel by request phase", () => {
  const base = {
    parameters: [],
    security: [],
    api_keys: [],
    responseHeaders: "",
    responseMessage: "",
    responseText: "",
    responseStatus: "success",
    responseIsBlob: false,
    activeResponseTab: "response",
    curlSyntax: "curl https://api.example.com/v1/events/export",
    showCurlBeforeTry: "false",
    requestTarget: "https://api.example.com/v1/events/export",
    requestElapsedMs: 0,
    responseContentType: "",
    stoppedWhileStreaming: false,
    loading: false,
    streaming: false,
    requestPhase: "idle",
  };
  const render = (state) => renderTemplateToString(apiCallTemplate.call({ ...base, ...state }));

  it("shows nothing before Try", () => {
    const out = render({});
    assert.doesNotMatch(out, /response-status-line|tab-panel/);
  });

  it("while waiting: the spinner, the status line and CANCEL, with the response area in place", () => {
    const out = render({ requestPhase: "waiting", loading: true, requestElapsedMs: 2500 });
    assert.match(out, /Waiting for https:\/\/api\.example\.com\/v1\/events\/export… 2\.5 s/);
    assert.match(out, /class="response-spinner "/);
    assert.match(out, /part="btn btn-outline btn-stop"[^>]*>\s*CANCEL/);
    assert.match(out, /TRYING\.\.\./);
    assert.match(
      out,
      /part="tab-panel"/,
      "the response area is already in place (no layout shift)",
    );
    assert.doesNotMatch(out, /⌛/);
  });

  it("after 10 s: says so and turns the spinner orange (class slow)", () => {
    const out = render({
      requestPhase: "waiting",
      loading: true,
      requestElapsedMs: SLOW_AFTER_MS + 500,
    });
    assert.match(out, /The server is taking a while \(10\.5 s\)/);
    assert.match(out, /class="response-spinner slow"/);
  });

  it("after a failed fetch: the error, no spinner, no button to stop, no hourglass", () => {
    const out = render({
      requestPhase: "failed",
      responseStatus: "error",
      responseMessage: networkErrorText(base.requestTarget, "GET"),
      requestElapsedMs: 180,
    });
    assert.match(
      out,
      /class="response-message error"[^>]*>Response Status: Couldn't reach api\.example\.com/,
    );
    assert.doesNotMatch(out, /response-spinner|btn-stop|⌛|TRYING/);
    assert.match(out, /part="tab-panel"/, "the cURL tab stays available");
  });

  it("while streaming: STOP and the event count", () => {
    const out = render({
      requestPhase: "streaming",
      loading: true,
      streaming: true,
      responseMessage: "OK:200",
      responseText: "data: 1\n\n",
      responseContentType: "text/event-stream",
      requestElapsedMs: 900,
    });
    assert.match(out, /part="btn btn-outline btn-stop"[^>]*>\s*STOP/);
    assert.match(out, /Streaming… 1 event, 900 ms/);
    assert.equal(
      (out.match(/class="row response-status-row"/g) || []).length,
      1,
      "status and status line share one row",
    );
  });
});
