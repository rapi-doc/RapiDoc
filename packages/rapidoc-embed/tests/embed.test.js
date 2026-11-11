import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import * as core from "../src/core.js";
import * as embed from "../src/index.js";
import { assetPath, readAsset, rapidocDistDir } from "../src/node.js";

describe("@rapidoc/embed/core", () => {
  it("normalizes the path", () => {
    assert.equal(core.normalizePath(), "/docs");
    assert.equal(core.normalizePath("reference/"), "/reference");
    assert.equal(core.normalizePath("/"), "");
    assert.equal(core.normalizePath("/a/b//"), "/a/b");
  });

  it("reads uiPath, and path as its older name", () => {
    assert.equal(core.uiPathOf({}), "/docs");
    assert.equal(core.uiPathOf({ uiPath: "/reference" }), "/reference");
    assert.equal(core.uiPathOf({ path: "/old" }), "/old");
    assert.equal(core.uiPathOf({ uiPath: "/new", path: "/old" }), "/new");
    assert.equal(
      core.renderHostPage({ path: "/old" }),
      core.renderHostPage({ uiPath: "/old" }),
      "a version 1 option still works",
    );
    assert.deepEqual(core.embedRoutes({ path: "/x" }), core.embedRoutes({ uiPath: "/x" }));
  });

  it("converts option names to attribute names", () => {
    assert.equal(core.attributeName("allowTry"), "allow-try");
    assert.equal(core.attributeName("render-style"), "render-style");
    assert.equal(core.attributeName("theme"), "theme");
  });

  it("rejects names that could break out of the tag", () => {
    for (const name of ['x" onload="alert(1)', "a b", "1abc", "", "a=b", "a>"]) {
      assert.throws(() => core.attributeName(name), /not a valid attribute name/, name);
    }
    assert.throws(() => core.renderHostPage({ options: { 'x"><script>': "1" } }), TypeError);
  });

  it("escapes attribute values and the title", () => {
    const html = core.renderHostPage({
      title: "</title><script>alert(1)</script>",
      specUrl: '"><script>alert(1)</script>',
    });
    assert.ok(!html.includes("<script>alert(1)"));
    assert.match(html, /spec-url="&quot;&gt;&lt;script&gt;alert\(1\)&lt;\/script&gt;"/);
  });

  it("keeps an inline spec inside its script element", () => {
    const spec = { info: { title: "</script><script>alert(1)</script>", note: "a\u2028b" } };
    const html = core.renderHostPage({ spec });
    assert.equal(html.match(/<\/script>/g).length, 2, "the bundle's and the spec's closing tags");
    const json = /slot="rapidoc-spec">(.*)<\/script>/.exec(html)[1];
    assert.deepEqual(JSON.parse(json), spec);
    assert.ok(!json.includes("\u2028"));
  });

  it("accepts an inline spec as JSON text", () => {
    const spec = { openapi: "3.1.0", paths: {} };
    assert.equal(
      core.renderHostPage({ spec: JSON.stringify(spec, null, 2) }),
      core.renderHostPage({ spec }),
    );
    assert.throws(() => core.renderHostPage({ spec: "openapi: 3.1.0" }), SyntaxError);
  });

  it("needs the manifest for the CDN, and a URL for custom assets", () => {
    assert.throws(() => core.renderHostPage({ assets: "cdn" }), /integration manifest/);
    assert.throws(() => core.renderHostPage({ assets: {} }), /scriptUrl is required/);
    assert.throws(() => core.renderHostPage({ assets: "local" }), /assets must be/);
  });
});

describe("@rapidoc/embed", () => {
  it("re-exports the contract", () => {
    assert.equal(embed.CONTRACT_VERSION, 2);
    assert.equal(
      embed.renderHostPage({ specUrl: "/a.json" }),
      core.renderHostPage({ specUrl: "/a.json" }),
    );
  });

  it("loads the installed rapidoc from the CDN with its hash", () => {
    const { version, files } = embed.rapidocManifest;
    assert.equal(embed.rapidocManifest.contract, 1, "the format of integration.json");
    const html = embed.renderHostPage({ assets: "cdn" });
    assert.ok(
      html.includes(
        `src="https://cdn.jsdelivr.net/npm/rapidoc@${version}/dist/rapidoc-min.js" integrity="${files["rapidoc-min.js"].integrity}" crossorigin="anonymous"`,
      ),
    );
    assert.equal(embed.embedRoutes({ assets: "cdn" }).length, 2);
    assert.match(embed.renderOAuthReceiverPage({ assets: "cdn" }), /cdn\.jsdelivr\.net/);
  });
});

describe("@rapidoc/embed/node", () => {
  it("finds every file the routes name in rapidoc's dist folder", () => {
    for (const route of embed.embedRoutes().filter((route) => route.kind === "file")) {
      assert.ok(fs.existsSync(assetPath(route.file)), route.file);
    }
    assert.equal(
      readAsset("rapidoc-min.js").length,
      embed.rapidocManifest.files["rapidoc-min.js"].bytes,
    );
    assert.ok(fs.existsSync(rapidocDistDir()));
  });

  it("serves the same OAuth return page as rapidoc ships", () => {
    const shipped = readAsset("oauth-receiver.html").toString();
    assert.equal(
      core
        .renderOAuthReceiverPage()
        .replace('src="/docs/rapidoc-min.js"', 'src="./rapidoc-min.js"'),
      shipped,
    );
  });

  it("refuses paths outside the dist folder", () => {
    assert.throws(() => assetPath("../package.json"), TypeError);
  });
});

describe("createResponder", () => {
  const respond = embed.createResponder({ specUrl: "/openapi.json" }, { readAsset });

  it("answers the page, the OAuth return page and the bundle, and nothing else", async () => {
    const page = await respond({ path: "/docs/" });
    assert.equal(page.status, 200);
    assert.equal(page.body, embed.renderHostPage({ specUrl: "/openapi.json" }));
    assert.equal((await respond({ path: "/docs/oauth-receiver.html" })).status, 200);
    const bundle = await respond({ path: "/docs/rapidoc-min.js" });
    assert.equal(bundle.body.length, embed.rapidocManifest.files["rapidoc-min.js"].bytes);
    assert.equal(await respond({ path: "/docs/other" }), null);
    assert.equal(await respond({ path: "/docs", method: "POST" }), null);
    assert.equal((await respond({ path: "/docs", method: "HEAD" })).status, 200);
  });

  it("answers 304 for a bundle the browser already has", async () => {
    const { headers } = await respond({ path: "/docs/rapidoc-min.js" });
    const again = await respond({ path: "/docs/rapidoc-min.js", ifNoneMatch: headers.etag });
    assert.equal(again.status, 304);
    assert.equal(again.body, null);
  });

  it("writes the public path and the nonce of the request into the page", async () => {
    const page = await respond({ path: "/docs", publicUiPath: "/api/docs", nonce: "n1" });
    assert.match(page.body, /src="\/api\/docs\/rapidoc-min\.js" nonce="n1"/);
    const fixed = embed.createResponder({ publicUiPath: "/gw/docs", nonce: "n0" }, { readAsset });
    assert.match(
      (await fixed({ path: "/docs" })).body,
      /src="\/gw\/docs\/rapidoc-min\.js" nonce="n0"/,
    );
    // the names before contract version 2
    const old = embed.createResponder({ path: "/ref", publicPath: "/gw/ref" }, { readAsset });
    assert.match((await old({ path: "/ref" })).body, /src="\/gw\/ref\/rapidoc-min\.js"/);
    assert.equal(await old({ path: "/docs" }), null);
  });

  it("loads from the CDN without a file reader, and refuses to serve the bundle", async () => {
    const cdn = embed.createResponder({ specUrl: "/openapi.json" });
    assert.match((await cdn({ path: "/docs" })).body, /cdn\.jsdelivr\.net/);
    assert.equal(await cdn({ path: "/docs/rapidoc-min.js" }), null);
    assert.throws(() => embed.createResponder({ assets: "bundled" }), /cannot serve the bundle/);
  });

  it("answers nothing when disabled", async () => {
    const off = embed.createResponder({ enabled: false }, { readAsset });
    assert.equal(await off({ path: "/docs" }), null);
  });
});

describe("sidebar helpers", () => {
  it("gives a short label and class names for an operation", () => {
    assert.equal(embed.methodLabel("DELETE"), "DEL");
    assert.equal(embed.methodLabel("get"), "GET");
    assert.equal(embed.methodLabel("purge"), "");
    assert.equal(embed.operationClass({ method: "post" }), "rapidoc-op rapidoc-op--post");
    assert.equal(
      embed.operationClass({ method: "GET", deprecated: true }),
      "rapidoc-op rapidoc-op--get rapidoc-op--deprecated",
    );
    assert.equal(embed.operationClass({ method: "purge" }), "rapidoc-op");
  });

  it("follows the methods option", () => {
    const op = { method: "get", deprecated: true };
    assert.equal(embed.operationClass(op, false), "rapidoc-op rapidoc-op--deprecated");
    assert.equal(embed.operationClass(op, "false"), "rapidoc-op rapidoc-op--deprecated");
    assert.equal(
      embed.operationClass(op, "as-plain-text"),
      "rapidoc-op rapidoc-op--get rapidoc-op--plain rapidoc-op--deprecated",
    );
    assert.equal(
      embed.operationClass({ method: "post" }, "as-colored-block"),
      "rapidoc-op rapidoc-op--post rapidoc-op--block",
    );
    assert.equal(embed.sidebarMethods(), "as-colored-text");
    assert.equal(embed.sidebarMethods(true), "as-colored-text");
    assert.throws(() => embed.sidebarMethods("loud"), /"methods" is "false"/);
  });

  it("writes the label as generated content, or styles an element that holds it", () => {
    const generated = embed.sidebarCss({
      label: (c) => `a.${c}::before`,
      text: (c) => `a.${c} > span`,
      dark: ".dark",
      active: "a.rapidoc-op[aria-current]::before",
    });
    assert.match(generated, /^:root\{--rapidoc-method-get:#2563eb;/);
    assert.match(generated, /\n\.dark\{--rapidoc-method-get:#5c98f9;/);
    assert.match(
      generated,
      /a\.rapidoc-op--patch::before\{content:"PATCH";--rapidoc-m:var\(--rapidoc-method-patch\);color:var\(--rapidoc-m\)\}/,
    );
    assert.match(generated, /a\.rapidoc-op\[aria-current\]::before\{color:inherit\}/);
    assert.match(generated, /a\.rapidoc-op--deprecated > span\{text-decoration:line-through/);

    const element = embed.sidebarCss({
      label: (c) => `.nav .${c}`,
      text: () => ".dep",
      dark: ".dark",
    });
    assert.match(
      element,
      /\.nav \.rapidoc-op--get\{--rapidoc-m:var\(--rapidoc-method-get\);color:var\(--rapidoc-m\)\}/,
    );
    assert.match(element, /\.nav \.rapidoc-op--plain\{color:inherit/);
    assert.match(element, /\.nav \.rapidoc-op--block\{background:var\(--rapidoc-m\)/);
    assert.doesNotMatch(element, /content:/);
    assert.equal(
      element.match(/color:inherit/g).length,
      1,
      "only the plain style, no rule for a current item",
    );
  });
});
