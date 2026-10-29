import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { renderTemplateToString } from "rapidoc/static";
import securitySchemeTemplate, {
  applyApiKey,
  onClearAllApiKeys,
} from "~/templates/security-scheme-template";

// The Authentication section for a key the host page applied with setApiKey(id, value, { note }).
function fakeDoc() {
  return {
    renderStyle: "read",
    persistAuth: "false",
    selectedServer: { computedUrl: "https://api.example" },
    requestUpdate() {},
    resolvedSpec: {
      securitySchemes: [
        {
          securitySchemeId: "oauth2",
          type: "oauth2",
          typeDisplay: "OAuth (oauth2)",
          in: "header",
          name: "Authorization",
          finalKeyValue: "",
          value: "",
          flows: {
            authorizationCode: {
              authorizationUrl: "https://auth.example/authorize",
              tokenUrl: "https://auth.example/token",
              scopes: { "shipments:read": "Read shipments" },
            },
          },
        },
        {
          securitySchemeId: "bearerAuth",
          type: "http",
          scheme: "bearer",
          typeDisplay: "HTTP Bearer",
          in: "header",
          name: "Authorization",
          finalKeyValue: "",
          value: "",
        },
      ],
    },
  };
}

const render = (doc, allowTry = "true") =>
  renderTemplateToString(securitySchemeTemplate.call(doc, allowTry));
const scheme = (doc, id) => doc.resolvedSpec.securitySchemes.find((s) => s.securitySchemeId === id);
const NOTE = "Using your sign-in (ship@rapidocui.com). Try sends your access token.";

// Every value bound in a Lit template tree, with whether it came wrapped in a directive (unsafeHTML)
function boundValues(result, inDirective = false, out = []) {
  if (Array.isArray(result)) result.forEach((r) => boundValues(r, inDirective, out));
  else if (result && typeof result === "object" && result._$litDirective$)
    (result.values || []).forEach((v) => boundValues(v, true, out));
  else if (result && typeof result === "object" && "strings" in result)
    result.values.forEach((v) => boundValues(v, inDirective, out));
  else out.push({ value: result, inDirective });
  return out;
}

describe("setApiKey note (host-provided key)", () => {
  it("without a note, the Authentication section is unchanged", () => {
    const doc = fakeDoc();
    const before = render(doc);
    assert.match(before, /No API key applied/);
    assert.match(before, /part="auth-flows"/);

    applyApiKey.call(doc, "oauth2", "", "", "Bearer abc");
    const after = render(doc);
    assert.equal(scheme(doc, "oauth2").finalKeyValue, "Bearer abc");
    assert.match(after, /1 API key applied/);
    assert.match(after, /part="auth-flows"/);
    assert.doesNotMatch(after, /auth-host-note/);
  });

  it("with a note, the scheme shows the note in place of its form, and only that scheme", () => {
    const doc = fakeDoc();
    assert.equal(applyApiKey.call(doc, "oauth2", "", "", "Bearer abc", NOTE), true);
    const html = render(doc);
    assert.match(html, /1 API key applied/);
    assert.ok(html.includes(NOTE));
    assert.match(html, /part="auth-host-note"/);
    assert.match(html, /aria-expanded="false"[^>]*>\s*Use a different token/);
    assert.doesNotMatch(html, /part="auth-flows"/);
    // bearerAuth keeps its input
    assert.match(html, /id="http-bearerAuth-api-key-input"/);
  });

  it('"Use a different token" opens the form under the note', () => {
    const doc = fakeDoc();
    applyApiKey.call(doc, "oauth2", "", "", "Bearer abc", NOTE);
    scheme(doc, "oauth2").hostFormOpen = true;
    const html = render(doc);
    assert.ok(html.includes(NOTE));
    assert.match(html, /aria-expanded="true"[^>]*>\s*Hide token form/);
    assert.match(html, /part="auth-flows"/);
  });

  it("folds a bearer scheme the same way", () => {
    const doc = fakeDoc();
    applyApiKey.call(doc, "bearerAuth", "", "", "abc", NOTE);
    assert.equal(scheme(doc, "bearerAuth").finalKeyValue, "Bearer abc");
    const html = render(doc);
    assert.doesNotMatch(html, /id="http-bearerAuth-api-key-input"/);
    assert.match(html, /part="auth-flows"/);
  });

  it("binds the note as text, never as markup", () => {
    // Lit escapes a plain text binding in the browser; unsafeHTML would not
    const doc = fakeDoc();
    const markup = "<img src=x onerror=alert(1)>";
    applyApiKey.call(doc, "oauth2", "", "", "Bearer abc", markup);
    const bindings = boundValues(securitySchemeTemplate.call(doc, "true")).filter(
      (b) => b.value === markup,
    );
    assert.equal(bindings.length, 1);
    assert.equal(bindings[0].inDirective, false);
  });

  it("drops the note when the key changes or is cleared", () => {
    const doc = fakeDoc();
    applyApiKey.call(doc, "oauth2", "", "", "Bearer abc", NOTE);
    applyApiKey.call(doc, "oauth2", "", "", "Bearer typed-by-reader");
    assert.equal(scheme(doc, "oauth2").hostNote, "");

    applyApiKey.call(doc, "oauth2", "", "", "Bearer abc", NOTE);
    onClearAllApiKeys.call(doc);
    assert.equal(scheme(doc, "oauth2").hostNote, "");
    assert.equal(scheme(doc, "oauth2").finalKeyValue, "");
    assert.doesNotMatch(render(doc), /auth-host-note/);
  });

  it("a new note folds the form again", () => {
    const doc = fakeDoc();
    applyApiKey.call(doc, "oauth2", "", "", "Bearer abc", NOTE);
    scheme(doc, "oauth2").hostFormOpen = true;
    applyApiKey.call(doc, "oauth2", "", "", "Bearer refreshed", NOTE);
    assert.doesNotMatch(render(doc), /part="auth-flows"/);
  });

  it("hides the note when Try is off", () => {
    const doc = fakeDoc();
    applyApiKey.call(doc, "oauth2", "", "", "Bearer abc", NOTE);
    const html = render(doc, "false");
    assert.doesNotMatch(html, /auth-host-note/);
    assert.match(html, /part="auth-flows"/);
  });
});
