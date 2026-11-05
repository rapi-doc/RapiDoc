import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { renderTemplateToString } from "@rapidoc/static";
import serverTemplate from "~/templates/server-template";

// The API Server section for a spec whose server descriptions use markdown.
function render(servers) {
  const doc = {
    renderStyle: "read",
    mockServer: "false",
    resolvedSpec: { servers },
    selectedServer: { ...servers[0], computedUrl: servers[0].url },
  };
  return renderTemplateToString(serverTemplate.call(doc));
}

// The label next to each server's radio button
const labels = (html) =>
  [...html.matchAll(/<label for="srvr-opt-\d+">([\s\S]*?)<\/label>/g)].map((m) => m[1]);

describe("server descriptions", () => {
  // CommonMark may be used in a Server Object's description (#1101)
  it("render inline markdown", () => {
    const [label] = labels(
      render([
        {
          url: "https://api.example.com",
          description: "**Production**, see [status](https://status.example.com) and `v2`",
        },
      ]),
    );
    assert.match(label, /<strong>Production<\/strong>/);
    assert.match(label, /<a href="https:\/\/status\.example\.com">status<\/a>/);
    assert.match(label, /<code>v2<\/code>/);
  });

  it("stay on the line beside the URL", () => {
    const [label] = labels(
      render([{ url: "https://api.example.com", description: "Production server" }]),
    );
    assert.doesNotMatch(label, /<p>/);
  });

  it("recompute the URL when a server variable is edited", () => {
    const server = {
      url: "https://{region}.example.com/{version}",
      variables: { region: { default: "eu" }, version: { default: "v1" } },
    };
    const doc = {
      renderStyle: "read",
      mockServer: "false",
      resolvedSpec: { servers: [server] },
      selectedServer: { ...server, computedUrl: "https://eu.example.com/v1" },
      requestUpdate() {},
    };
    // The @input handlers sit in the template's values; the serializer drops them, so call them directly
    const handlers = [];
    const walk = (v) => {
      if (typeof v === "function") handlers.push(v);
      else if (Array.isArray(v)) v.forEach(walk);
      else if (v && typeof v === "object" && Array.isArray(v.values)) v.values.forEach(walk);
    };
    walk(serverTemplate.call(doc));
    assert.ok(
      handlers.some((h) => String(h).includes("onApiServerVarChange")),
      "the variable inputs have handlers",
    );

    const inputs = [
      { dataset: { var: "region" }, value: "us" },
      { dataset: { var: "version" }, value: "v2" },
    ];
    const list = { querySelectorAll: () => inputs };
    // The variables render in <ul class="server-vars">, not a table
    const currentTarget = { closest: (sel) => (sel === ".server-vars" ? list : null) };
    const onVarInput = handlers.find((h) => String(h).includes("onApiServerVarChange"));
    onVarInput({ currentTarget });
    assert.equal(doc.selectedServer.computedUrl, "https://us.example.com/v2");
  });
});
