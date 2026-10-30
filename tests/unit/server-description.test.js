import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { renderTemplateToString } from "rapidoc/static";
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
});
