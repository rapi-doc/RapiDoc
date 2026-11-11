import { describe, it } from "node:test";
import assert from "node:assert/strict";
import Fastify from "fastify";
import { renderHostPage, renderOAuthReceiverPage, rapidocManifest } from "@rapidoc/embed";
import rapidocDefault, { rapidoc, rapidocVersion } from "../src/index.js";

async function appWith(options, registerOptions = {}) {
  const fastify = Fastify();
  await fastify.register(rapidoc, { ...options, ...registerOptions });
  await fastify.ready();
  return fastify;
}

describe("@rapidoc/fastify", () => {
  const options = { specUrl: "/openapi.json", options: { renderStyle: "focused" } };

  it("serves the contract's host page at /docs", async () => {
    const app = await appWith(options);
    const res = await app.inject({ url: "/docs" });
    assert.equal(res.statusCode, 200);
    assert.equal(res.headers["content-type"], "text/html; charset=utf-8");
    assert.equal(res.body, renderHostPage(options));
    assert.equal(rapidocDefault, rapidoc, "also the default export");
  });

  it("serves the OAuth return page, the bundle and its license file", async () => {
    const app = await appWith(options);
    assert.equal(
      (await app.inject({ url: "/docs/oauth-receiver.html" })).body,
      renderOAuthReceiverPage(options),
    );
    const bundle = await app.inject({ url: "/docs/rapidoc-min.js" });
    assert.equal(bundle.headers["content-type"], "text/javascript; charset=utf-8");
    assert.equal(bundle.rawPayload.length, rapidocManifest.files["rapidoc-min.js"].bytes);
    assert.equal((await app.inject({ url: "/docs/rapidoc-min.js.LICENSE.txt" })).statusCode, 200);
  });

  it("answers 304 for a bundle the browser already has, and HEAD", async () => {
    const app = await appWith(options);
    const first = await app.inject({ url: "/docs/rapidoc-min.js" });
    const again = await app.inject({
      url: "/docs/rapidoc-min.js",
      headers: { "if-none-match": first.headers.etag },
    });
    assert.equal(again.statusCode, 304);
    assert.equal(again.body, "");
    assert.equal((await app.inject({ method: "HEAD", url: "/docs" })).statusCode, 200);
  });

  it("leaves other paths and methods to the app", async () => {
    const app = await appWith(options);
    assert.equal((await app.inject({ url: "/docs/other.js" })).statusCode, 404);
    assert.equal((await app.inject({ method: "POST", url: "/docs" })).statusCode, 404);
  });

  it("includes the plugin's prefix in the routes and in the page", async () => {
    const app = await appWith({ ...options, path: "/reference" }, { prefix: "/api" });
    const page = (await app.inject({ url: "/api/reference" })).body;
    assert.match(page, /src="\/api\/reference\/rapidoc-min\.js"/);
    assert.match(page, /oauth-receiver="\/api\/reference\/oauth-receiver\.html"/);
    assert.equal((await app.inject({ url: "/api/reference/rapidoc-min.js" })).statusCode, 200);
    assert.equal((await app.inject({ url: "/reference" })).statusCode, 404);
  });

  it("takes the nonce from the request, loads from the CDN when asked, and can be disabled", async () => {
    const app = await appWith({
      assets: "cdn",
      nonce: (request) => request.headers["x-nonce"],
    });
    const page = (await app.inject({ url: "/docs", headers: { "x-nonce": "abc" } })).body;
    assert.ok(page.includes(`rapidoc@${rapidocVersion}/dist/rapidoc-min.js`));
    assert.equal(page.match(/nonce="abc"/g).length, 2);
    assert.equal((await app.inject({ url: "/docs/rapidoc-min.js" })).statusCode, 404);

    const off = await appWith({ enabled: false });
    assert.equal((await off.inject({ url: "/docs" })).statusCode, 404);
  });

  it("marks its routes as hidden from an OpenAPI generator", async () => {
    const fastify = Fastify();
    const hidden = [];
    fastify.addHook("onRoute", (route) => hidden.push([route.url, route.schema?.hide]));
    await fastify.register(rapidoc, options);
    await fastify.ready();
    assert.ok(hidden.length >= 4);
    assert.ok(hidden.every(([, hide]) => hide === true));
  });
});
