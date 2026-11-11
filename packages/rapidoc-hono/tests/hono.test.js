import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { Hono } from "hono";
import { secureHeaders, NONCE } from "hono/secure-headers";
import { renderHostPage, renderOAuthReceiverPage, rapidocManifest } from "@rapidoc/embed";
import { rapidoc, rapidocVersion } from "../src/index.js";
import { rapidoc as edgeRapidoc } from "../src/edge.js";

/** An app with the middleware and a catch-all, so a request the middleware passes on is visible. */
function appWith(middleware) {
  const app = new Hono();
  app.use(middleware);
  app.all("*", (c) => c.text("passed on", 404));
  return app;
}

describe("@rapidoc/hono", () => {
  const options = { specUrl: "/openapi.json", options: { renderStyle: "focused" } };
  const app = appWith(rapidoc(options));

  it("serves the contract's host page at /docs, with and without a trailing slash", async () => {
    for (const path of ["/docs", "/docs/"]) {
      const res = await app.request(path);
      assert.equal(res.status, 200);
      assert.equal(res.headers.get("content-type"), "text/html; charset=utf-8");
      assert.equal(await res.text(), renderHostPage(options));
    }
  });

  it("serves the OAuth return page", async () => {
    const res = await app.request("/docs/oauth-receiver.html");
    assert.equal(res.status, 200);
    assert.equal(await res.text(), renderOAuthReceiverPage(options));
  });

  it("serves the installed bundle and its license file", async () => {
    const res = await app.request("/docs/rapidoc-min.js");
    assert.equal(res.status, 200);
    assert.equal(res.headers.get("content-type"), "text/javascript; charset=utf-8");
    const body = new Uint8Array(await res.arrayBuffer());
    assert.equal(body.length, rapidocManifest.files["rapidoc-min.js"].bytes);

    const license = await app.request("/docs/rapidoc-min.js.LICENSE.txt");
    assert.equal(license.status, 200);
    assert.match(await license.text(), /^Third-party software bundled in rapidoc-min\.js/);
  });

  it("answers 304 when the browser already has the bundle", async () => {
    const first = await app.request("/docs/rapidoc-min.js");
    const etag = first.headers.get("etag");
    assert.ok(etag.includes(rapidocManifest.files["rapidoc-min.js"].integrity));
    const again = await app.request("/docs/rapidoc-min.js", {
      headers: { "if-none-match": etag },
    });
    assert.equal(again.status, 304);
    assert.equal(await again.text(), "");
  });

  it("answers HEAD and passes on other methods and other paths", async () => {
    assert.equal((await app.request("/docs", { method: "HEAD" })).status, 200);
    assert.equal((await app.request("/docs", { method: "POST" })).status, 404);
    for (const path of ["/", "/docs/other.js", "/docsx", "/openapi.json"]) {
      const res = await app.request(path);
      assert.equal(await res.text(), "passed on", path);
    }
  });

  it("serves nothing when disabled", async () => {
    const res = await appWith(rapidoc({ ...options, enabled: false })).request("/docs");
    assert.equal(await res.text(), "passed on");
  });

  it("serves at another path, and at the site root", async () => {
    const custom = appWith(rapidoc({ ...options, uiPath: "/api/reference/" }));
    const page = await (await custom.request("/api/reference")).text();
    assert.match(page, /src="\/api\/reference\/rapidoc-min\.js"/);
    assert.equal((await custom.request("/api/reference/rapidoc-min.js")).status, 200);
    assert.equal(await (await custom.request("/docs")).text(), "passed on");

    const root = appWith(rapidoc({ ...options, uiPath: "/" }));
    assert.match(await (await root.request("/")).text(), /src="\/rapidoc-min\.js"/);
    assert.equal((await root.request("/oauth-receiver.html")).status, 200);
  });

  it("still takes the option names of version 0.1", async () => {
    const old = appWith(rapidoc({ ...options, path: "/ref", publicPath: "/gw/ref" }));
    assert.match(await (await old.request("/ref")).text(), /src="\/gw\/ref\/rapidoc-min\.js"/);
    assert.equal(await (await old.request("/docs")).text(), "passed on");
  });

  it("writes publicUiPath into the page when a proxy strips a prefix", async () => {
    const proxied = appWith(rapidoc({ ...options, publicUiPath: "/gateway/docs" }));
    const page = await (await proxied.request("/docs")).text();
    assert.match(page, /src="\/gateway\/docs\/rapidoc-min\.js"/);
    assert.match(page, /oauth-receiver="\/gateway\/docs\/oauth-receiver\.html"/);
    assert.equal((await proxied.request("/docs/rapidoc-min.js")).status, 200);
  });

  it("works in an app mounted under a base path", async () => {
    const mounted = new Hono().basePath("/v1");
    mounted.use(rapidoc({ ...options, uiPath: "/v1/docs" }));
    const res = await mounted.request("/v1/docs");
    assert.equal(res.status, 200);
    assert.match(await res.text(), /src="\/v1\/docs\/rapidoc-min\.js"/);
  });

  it("takes the nonce from the request, as Hono's secureHeaders sets it", async () => {
    const secured = new Hono();
    secured.use(
      secureHeaders({ contentSecurityPolicy: { scriptSrc: [NONCE], styleSrc: [NONCE] } }),
    );
    secured.use(rapidoc({ ...options, nonce: (c) => c.get("secureHeadersNonce") }));
    const res = await secured.request("/docs");
    const nonce = /'nonce-([^']+)'/.exec(res.headers.get("content-security-policy"))[1];
    const page = await res.text();
    assert.equal(
      page.match(new RegExp(`nonce="${nonce.replace(/[+/=]/g, "\\$&")}"`, "g")).length,
      2,
    );
  });

  it("serves the pinned version from the CDN when asked", async () => {
    const cdn = appWith(rapidoc({ ...options, assets: "cdn" }));
    const page = await (await cdn.request("/docs")).text();
    assert.ok(
      page.includes(`https://cdn.jsdelivr.net/npm/rapidoc@${rapidocVersion}/dist/rapidoc-min.js`),
    );
    assert.ok(page.includes(rapidocManifest.files["rapidoc-min.js"].integrity));
    assert.equal(await (await cdn.request("/docs/rapidoc-min.js")).text(), "passed on");
    assert.equal((await cdn.request("/docs/oauth-receiver.html")).status, 200, "same origin");
  });
});

describe("@rapidoc/hono/edge", () => {
  it("loads the bundle from the CDN by default and serves the two pages", async () => {
    const app = appWith(edgeRapidoc({ specUrl: "/openapi.json" }));
    const page = await (await app.request("/docs")).text();
    assert.equal(page, renderHostPage({ specUrl: "/openapi.json", assets: "cdn" }));
    assert.equal((await app.request("/docs/oauth-receiver.html")).status, 200);
    assert.equal(await (await app.request("/docs/rapidoc-min.js")).text(), "passed on");
  });

  it("refuses to serve the bundle, which needs a file system", () => {
    assert.throws(() => edgeRapidoc({ assets: "bundled" }), /cannot serve the bundle/);
  });

  it("does not import a Node module", async () => {
    const fs = await import("node:fs");
    const dir = new URL("../src/", import.meta.url);
    for (const file of ["edge.js", "middleware.js"]) {
      const source = fs.readFileSync(new URL(file, dir), "utf8");
      assert.doesNotMatch(source, /from "node:|embed\/node"/, file);
    }
  });
});
