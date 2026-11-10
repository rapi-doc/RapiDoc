import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import {
  updateOAuthKey,
  recoverPersistedApiKeys,
  onClearAllApiKeys,
} from "~/templates/security-scheme-template";

// persist-auth="true" keeps an OAuth access token across a reload, until it expires (issue #998)

function memoryStorage() {
  const data = new Map();
  return {
    getItem: (k) => (data.has(k) ? data.get(k) : null),
    setItem: (k, v) => data.set(k, String(v)),
    removeItem: (k) => data.delete(k),
  };
}

function fakeDoc(persistAuth = "true") {
  return {
    persistAuth,
    requestUpdate() {},
    resolvedSpec: {
      securitySchemes: [
        {
          securitySchemeId: "oauth",
          type: "oauth2",
          finalKeyValue: "",
          value: "",
          flows: { clientCredentials: { tokenUrl: "https://auth.example/token", scopes: {} } },
        },
        {
          securitySchemeId: "basic",
          type: "http",
          scheme: "basic",
          finalKeyValue: "",
          value: "",
        },
      ],
    },
  };
}

const scheme = (doc, id) => doc.resolvedSpec.securitySchemes.find((s) => s.securitySchemeId === id);
const saved = () => JSON.parse(globalThis.localStorage.getItem("rapidoc") || "{}");

describe("persist-auth with OAuth tokens", () => {
  let original;
  beforeEach(() => {
    original = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
    Object.defineProperty(globalThis, "localStorage", {
      value: memoryStorage(),
      configurable: true,
      writable: true,
    });
  });
  afterEach(() => {
    if (original) {
      Object.defineProperty(globalThis, "localStorage", original);
    } else {
      delete globalThis.localStorage;
    }
  });

  it("saves only the token, with its expiry, and restores it after a reload", () => {
    const before = Date.now();
    updateOAuthKey.call(fakeDoc(), "oauth", "tok123", "bearer", 3600);
    const entry = saved().oauth;
    assert.equal(entry.value, "Bearer tok123");
    assert.deepEqual(Object.keys(entry).sort(), ["expiresAt", "securitySchemeId", "value"]);
    assert.ok(entry.expiresAt >= before + 3600 * 1000);

    // a reload: a fresh document reads what was saved
    const reloaded = fakeDoc();
    recoverPersistedApiKeys.call(reloaded);
    assert.equal(scheme(reloaded, "oauth").finalKeyValue, "Bearer tok123");
  });

  it("saves a token without expires_in with no expiry", () => {
    updateOAuthKey.call(fakeDoc(), "oauth", "tok", "Bearer");
    assert.equal(saved().oauth.expiresAt, undefined);
  });

  it("drops an expired token on reload instead of applying it", () => {
    globalThis.localStorage.setItem(
      "rapidoc",
      JSON.stringify({
        oauth: { securitySchemeId: "oauth", value: "Bearer old", expiresAt: Date.now() - 1000 },
      }),
    );
    const doc = fakeDoc();
    recoverPersistedApiKeys.call(doc);
    assert.equal(scheme(doc, "oauth").finalKeyValue, "");
    assert.deepEqual(saved(), {});
  });

  it("saves nothing when persist-auth is off", () => {
    const doc = fakeDoc("false");
    updateOAuthKey.call(doc, "oauth", "tok", "Bearer", 60);
    assert.equal(scheme(doc, "oauth").finalKeyValue, "Bearer tok");
    assert.equal(globalThis.localStorage.getItem("rapidoc"), null);
  });

  it("CLEAR ALL forgets the saved token", () => {
    const doc = fakeDoc();
    updateOAuthKey.call(doc, "oauth", "tok", "Bearer", 60);
    onClearAllApiKeys.call(doc);
    assert.deepEqual(saved(), {});
  });
});
