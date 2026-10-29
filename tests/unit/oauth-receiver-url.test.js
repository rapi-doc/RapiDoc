import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { oauthReceiverUrl } from "../../packages/rapidoc/src/utils/url-utils.js";

describe("oauthReceiverUrl (the oauth-receiver attribute)", () => {
  const at = (pathname) => ({ origin: "https://docs.example.com", pathname });

  it("resolves a relative receiver against the page folder, as before", () => {
    assert.equal(
      oauthReceiverUrl(at("/apis/shipments"), "oauth-receiver.html").href,
      "https://docs.example.com/apis/oauth-receiver.html",
    );
    assert.equal(
      oauthReceiverUrl(at("/docs/guide/"), "oauth-receiver.html").href,
      "https://docs.example.com/docs/guide/oauth-receiver.html",
    );
    assert.equal(
      oauthReceiverUrl(at("/index.html")).href,
      "https://docs.example.com/oauth-receiver.html",
      "default receiver",
    );
    assert.equal(
      oauthReceiverUrl(at("/a/b"), "auth/receiver.html").href,
      "https://docs.example.com/a/auth/receiver.html",
    );
  });

  it("treats a receiver starting with / as a path from the site root", () => {
    for (const page of [
      "/apis/shipments",
      "/apis/shipments/labels",
      "/docs/shipping/create-shipment/",
      "/",
    ]) {
      assert.equal(
        oauthReceiverUrl(at(page), "/oauth-receiver.html").href,
        "https://docs.example.com/oauth-receiver.html",
        page,
      );
    }
  });

  it("uses a full URL as is", () => {
    assert.equal(
      oauthReceiverUrl(at("/apis/x"), "https://auth.example.com/cb.html").href,
      "https://auth.example.com/cb.html",
    );
  });
});
