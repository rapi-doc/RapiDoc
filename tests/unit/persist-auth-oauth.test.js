import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import {
  authStorageKey,
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

function fakeDoc(persistAuth = "true", specUrl = "https://example.com/orders.yaml") {
  return {
    persistAuth,
    specUrl,
    requestUpdate() {},
    resolvedSpec: {
      info: { title: "Orders" },
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
const KEY = "rapidoc-auth:https://example.com/orders.yaml";
const saved = (key = KEY) => JSON.parse(globalThis.localStorage.getItem(key) || "{}");

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
      KEY,
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
    assert.equal(globalThis.localStorage.getItem(KEY), null);
  });

  it("CLEAR ALL forgets the saved token", () => {
    const doc = fakeDoc();
    updateOAuthKey.call(doc, "oauth", "tok", "Bearer", 60);
    onClearAllApiKeys.call(doc);
    assert.equal(globalThis.localStorage.getItem(KEY), null);
  });

  it("keeps each API's keys apart: by spec URL, or by title for a spec object", () => {
    assert.equal(authStorageKey.call(fakeDoc()), KEY);
    assert.equal(authStorageKey.call(fakeDoc("true", "")), "rapidoc-auth:Orders");

    updateOAuthKey.call(fakeDoc(), "oauth", "orders-token", "Bearer");
    const other = fakeDoc("true", "https://example.com/billing.yaml");
    recoverPersistedApiKeys.call(other);
    assert.equal(scheme(other, "oauth").finalKeyValue, "", "same scheme name, another API");
    updateOAuthKey.call(other, "oauth", "billing-token", "Bearer");
    assert.equal(saved().oauth.value, "Bearer orders-token");
    assert.equal(
      saved("rapidoc-auth:https://example.com/billing.yaml").oauth.value,
      "Bearer billing-token",
    );
  });

  it("ignores the old shared entry and a value that is not JSON, without throwing", () => {
    globalThis.localStorage.setItem(
      "rapidoc",
      JSON.stringify({ oauth: { securitySchemeId: "oauth", value: "Bearer v14" } }),
    );
    globalThis.localStorage.setItem(KEY, "not json");
    const doc = fakeDoc();
    assert.doesNotThrow(() => recoverPersistedApiKeys.call(doc));
    assert.equal(scheme(doc, "oauth").finalKeyValue, "");
  });

  it("does not throw when storage is blocked", () => {
    Object.defineProperty(globalThis, "localStorage", {
      get() {
        throw new Error("SecurityError");
      },
      configurable: true,
    });
    const doc = fakeDoc();
    assert.doesNotThrow(() => recoverPersistedApiKeys.call(doc));
    assert.doesNotThrow(() => updateOAuthKey.call(doc, "oauth", "tok", "Bearer"));
    assert.equal(scheme(doc, "oauth").finalKeyValue, "Bearer tok");
  });
});
