import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import express from "express";
import { renderHostPage, renderOAuthReceiverPage, rapidocManifest } from "@rapidoc/embed";
import { rapidoc, rapidocVersion } from "../src/index.js";

/** Starts a server for `handler` on a free port; returns its base URL and a close function. */
function serve(handler) {
  return new Promise((resolve) => {
    const server = http.createServer(handler).listen(0, "127.0.0.1", () => {
      const url = `http://127.0.0.1:${server.address().port}`;
      resolve({ url, close: () => new Promise((done) => server.close(done)) });
    });
  });
}

describe("@rapidoc/express", () => {
  const options = { specUrl: "/openapi.json", options: { renderStyle: "focused" } };
  let site;

  before(async () => {
    const app = express();
    app.use(rapidoc(options));
    app.use("/api", rapidoc({ ...options, path: "/reference" }));
    app.use((req, res) => res.status(404).send("passed on"));
    site = await serve(app);
  });
  after(() => site.close());

  it("serves the contract's host page at /docs, with and without a trailing slash", async () => {
    for (const path of ["/docs", "/docs/"]) {
      const res = await fetch(site.url + path);
      assert.equal(res.status, 200);
      assert.equal(res.headers.get("content-type"), "text/html; charset=utf-8");
      assert.equal(await res.text(), renderHostPage(options));
    }
  });

  it("serves the OAuth return page, the bundle and its license file", async () => {
    const receiver = await fetch(`${site.url}/docs/oauth-receiver.html`);
    assert.equal(await receiver.text(), renderOAuthReceiverPage(options));
    const bundle = await fetch(`${site.url}/docs/rapidoc-min.js`);
    assert.equal(bundle.headers.get("content-type"), "text/javascript; charset=utf-8");
    assert.equal(
      (await bundle.arrayBuffer()).byteLength,
      rapidocManifest.files["rapidoc-min.js"].bytes,
    );
    assert.equal((await fetch(`${site.url}/docs/rapidoc-min.js.LICENSE.txt`)).status, 200);
  });

  it("answers 304 for a bundle the browser already has, and HEAD without a body", async () => {
    const first = await fetch(`${site.url}/docs/rapidoc-min.js`);
    const again = await fetch(`${site.url}/docs/rapidoc-min.js`, {
      headers: { "if-none-match": first.headers.get("etag") },
    });
    assert.equal(again.status, 304);
    const head = await fetch(`${site.url}/docs`, { method: "HEAD" });
    assert.equal(head.status, 200);
    assert.equal(await head.text(), "");
  });

  it("passes on other methods and other paths", async () => {
    assert.equal(await (await fetch(`${site.url}/docs`, { method: "POST" })).text(), "passed on");
    for (const path of ["/", "/docs/other.js", "/docsx"]) {
      assert.equal(await (await fetch(site.url + path)).text(), "passed on", path);
    }
  });

  it("includes the mount point in the page when mounted under a prefix", async () => {
    const page = await (await fetch(`${site.url}/api/reference`)).text();
    assert.match(page, /src="\/api\/reference\/rapidoc-min\.js"/);
    assert.match(page, /oauth-receiver="\/api\/reference\/oauth-receiver\.html"/);
    assert.equal((await fetch(`${site.url}/api/reference/rapidoc-min.js`)).status, 200);
  });

  it("takes the nonce from the request, loads from the CDN when asked, and can be disabled", async () => {
    const app = express();
    app.use((req, res, next) => {
      res.locals.cspNonce = "abc";
      next();
    });
    app.use(rapidoc({ assets: "cdn", nonce: (req, res) => res.locals.cspNonce }));
    app.use("/off", rapidoc({ enabled: false }));
    app.use((req, res) => res.status(404).send("passed on"));
    const other = await serve(app);
    try {
      const page = await (await fetch(`${other.url}/docs`)).text();
      assert.ok(page.includes(`rapidoc@${rapidocVersion}/dist/rapidoc-min.js`));
      assert.equal(page.match(/nonce="abc"/g).length, 2);
      assert.equal(await (await fetch(`${other.url}/docs/rapidoc-min.js`)).text(), "passed on");
      assert.equal(await (await fetch(`${other.url}/off/docs`)).text(), "passed on");
    } finally {
      await other.close();
    }
  });

  it("runs on a plain node:http server", async () => {
    const middleware = rapidoc(options);
    const plain = await serve((req, res) =>
      middleware(req, res, () => {
        res.statusCode = 404;
        res.end("passed on");
      }),
    );
    try {
      assert.equal(await (await fetch(`${plain.url}/docs?x=1`)).text(), renderHostPage(options));
      assert.equal(await (await fetch(`${plain.url}/nope`)).text(), "passed on");
    } finally {
      await plain.close();
    }
  });
});
