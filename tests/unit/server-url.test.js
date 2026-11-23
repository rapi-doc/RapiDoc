import { describe, it, afterEach } from "node:test";
import assert from "node:assert/strict";
import { resolveServerUrl } from "~/utils/spec-parser";
import { renderTemplateToString } from "../../packages/rapidoc-prerender/src/internal.js";
import securitySchemeTemplate from "~/templates/security-scheme-template";

// Relative server URLs are relative to the spec's address (OpenAPI), not text appended to the page's origin

describe("relative server URLs", () => {
  const originalWindow = globalThis.window;
  const inPage = (href) => {
    globalThis.window = { location: { href } };
  };
  afterEach(() => {
    if (originalWindow === undefined) delete globalThis.window;
    else globalThis.window = originalWindow;
  });

  const SPEC = "https://api.example.com/docs/openapi.yaml";

  it("resolves a relative path against the spec's folder", () => {
    inPage("https://portal.example.com/reference/");
    assert.equal(resolveServerUrl("api/v1", SPEC), "https://api.example.com/docs/api/v1");
    assert.equal(resolveServerUrl("../v2", SPEC), "https://api.example.com/v2");
    assert.equal(resolveServerUrl("/v1", SPEC), "https://api.example.com/v1");
  });

  it("uses the page's address for a spec without one", () => {
    inPage("https://portal.example.com/reference/index.html");
    assert.equal(resolveServerUrl("api/v1"), "https://portal.example.com/reference/api/v1");
    assert.equal(resolveServerUrl("/v1"), "https://portal.example.com/v1");
  });

  it("keeps server variables", () => {
    inPage("https://portal.example.com/");
    assert.equal(resolveServerUrl("/{version}/api", SPEC), "https://api.example.com/{version}/api");
  });

  it("leaves absolute, protocol-relative and templated URLs alone", () => {
    inPage("https://portal.example.com/");
    for (const url of [
      "https://api.example.com/v1",
      "//api.example.com/v1",
      "{scheme}://api.example.com",
      "wss://stream.example.com",
    ]) {
      assert.equal(resolveServerUrl(url, SPEC), url);
    }
  });

  it("leaves every URL alone outside a browser, and on a page that is not on the web", () => {
    delete globalThis.window;
    assert.equal(resolveServerUrl("/v1", SPEC), "/v1");
    inPage("file:///home/me/index.html");
    assert.equal(resolveServerUrl("/v1"), "/v1");
  });
});

describe("the Authentication section with an unusual server URL", () => {
  const render = (computedUrl) =>
    renderTemplateToString(
      securitySchemeTemplate.call({
        allowAuthentication: "true",
        selectedServer: { url: computedUrl, computedUrl },
        resolvedSpec: {
          securitySchemes: [
            {
              securitySchemeId: "oauth",
              type: "oauth2",
              typeDisplay: "OAuth (oauth)",
              flows: {
                authorizationCode: {
                  authorizationUrl: "/authorize",
                  tokenUrl: "token",
                  scopes: {},
                },
              },
            },
          ],
        },
      }),
    );

  it("renders for a protocol-relative, a templated and a missing server URL", () => {
    for (const url of ["//api.example.com/v1", "{scheme}://api.example.com", "", undefined]) {
      assert.doesNotThrow(() => render(url), `server URL ${url}`);
    }
  });

  it("places relative OAuth URLs on the server", () => {
    const html = render("https://api.example.com/v1/");
    assert.ok(html.includes("https://api.example.com/authorize"));
    assert.ok(html.includes("https://api.example.com/v1/token"));
  });
});
