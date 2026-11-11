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
    assert.equal(embed.CONTRACT_VERSION, 1);
    assert.equal(
      embed.renderHostPage({ specUrl: "/a.json" }),
      core.renderHostPage({ specUrl: "/a.json" }),
    );
  });

  it("loads the installed rapidoc from the CDN with its hash", () => {
    const { version, files } = embed.rapidocManifest;
    assert.equal(embed.rapidocManifest.contract, core.CONTRACT_VERSION);
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
