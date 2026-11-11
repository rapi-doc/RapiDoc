import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { withRapidoc, rapidocSidebar, loadSpec, OAUTH_RECEIVER_PATH } from "../src/index.js";

const example = fileURLToPath(new URL("../example/", import.meta.url));

describe("rapidocSidebar", () => {
  const pets = { spec: "./openapi/pets.yaml", uiPath: "/api", root: example };

  it("lists an overview link and a group per tag with a link per operation", async () => {
    const items = await rapidocSidebar(pets);
    assert.deepEqual(items[0], { text: "Overview", link: "/api#overview" });
    assert.deepEqual(
      items.slice(1).map((group) => group.text),
      ["Pets", "Owners"],
    );
    assert.deepEqual(items[1].items[0], {
      text: '<span class="rapidoc-op rapidoc-op--get">GET</span>List pets',
      link: "/api#list-pets",
    });
    assert.equal(
      items[1].items[2].text,
      '<span class="rapidoc-op rapidoc-op--delete rapidoc-op--deprecated">DEL</span><span class="rapidoc-op-text--deprecated" title="Deprecated">Remove a pet</span>',
    );
    assert.equal(items[1].collapsed, undefined);
  });

  it("takes a document as an object, and a collapsed setting", async () => {
    const spec = {
      openapi: "3.1.0",
      info: { title: "Inline", version: "1" },
      paths: { "/ping": { get: { tags: ["Health <b>"], summary: "Ping <img>", responses: {} } } },
    };
    const items = await rapidocSidebar({ spec, uiPath: "/reference/", collapsed: true });
    // VitePress writes sidebar text as HTML, so text from the spec is escaped
    assert.equal(items[1].text, "Health &lt;b&gt;");
    assert.equal(items[1].collapsed, true);
    assert.match(items[1].items[0].text, /<\/span>Ping &lt;img&gt;$/);
    assert.equal(items[1].items[0].link, "/reference/#ping-img");
    assert.equal(await loadSpec(spec), spec);
    await assert.rejects(rapidocSidebar({ ...pets, spec: "./nope.yaml" }), /not found/);
    await assert.rejects(rapidocSidebar({ spec }), /needs `uiPath`/);
  });

  it("shows the method as asked, or not at all", async () => {
    const text = async (methods) => (await rapidocSidebar({ ...pets, methods }))[1].items[0].text;
    assert.equal(await text(false), "List pets");
    assert.equal(
      await text("as-colored-block"),
      '<span class="rapidoc-op rapidoc-op--get rapidoc-op--block">GET</span>List pets',
    );
    await assert.rejects(text("loud"), /"methods" is "false"/);
  });

  it("still takes (spec, link, options), the form of version 0.1", async () => {
    const named = await rapidocSidebar(pets);
    assert.deepEqual(await rapidocSidebar("./openapi/pets.yaml", "/api", { root: example }), named);
    const document = await loadSpec("./openapi/pets.yaml", example);
    assert.deepEqual(
      await rapidocSidebar(document, "/api"),
      named,
      "a document given positionally",
    );
  });
});

describe("withRapidoc", () => {
  it("keeps the site's config and adds its own to it", () => {
    const userPlugin = { name: "user" };
    const config = withRapidoc(
      {
        title: "Docs",
        vue: { template: { compilerOptions: { isCustomElement: (tag) => tag === "my-el" } } },
        vite: { plugins: [userPlugin], ssr: { noExternal: ["other"] } },
      },
      { apis: { pets: "./openapi/pets.yaml" }, root: example },
    );
    assert.equal(config.title, "Docs");
    assert.equal(config.head.at(-1)[0], "style");
    assert.match(
      config.head.at(-1)[2],
      /\.VPSidebar \.rapidoc-op--get\{--rapidoc-m:var\(--rapidoc-method-get\);color:var\(--rapidoc-m\)\}/,
    );
    const { isCustomElement } = config.vue.template.compilerOptions;
    assert.equal(isCustomElement("rapi-doc-mini"), true);
    assert.equal(isCustomElement("my-el"), true, "the site's own rule still applies");
    assert.equal(isCustomElement("div"), false);
    assert.equal(config.vite.plugins[0], userPlugin);
    assert.equal(config.vite.plugins[1].name, "rapidoc-vitepress");
    assert.deepEqual(config.vite.ssr.noExternal, ["other", "@rapidoc/vitepress"]);
  });

  it("provides the named specs to the client component", async () => {
    const config = withRapidoc({}, { apis: { pets: "./openapi/pets.yaml" }, root: example });
    const plugin = config.vite.plugins.at(-1);
    const id = plugin.resolveId("virtual:rapidoc-vitepress");
    const code = await plugin.load.call({ addWatchFile() {} }, id);
    assert.match(code, /export const specs = \{"pets":\{"openapi":"3\.1\.0"/);
    assert.ok(code.includes(JSON.stringify(OAUTH_RECEIVER_PATH)));
    assert.equal(plugin.resolveId("something-else"), undefined);
  });

  it("writes the OAuth return page after the site's own buildEnd", async () => {
    const outDir = fs.mkdtempSync(path.join(os.tmpdir(), "rapidoc-vitepress-"));
    try {
      const calls = [];
      const config = withRapidoc({ buildEnd: () => calls.push("user") });
      await config.buildEnd({ outDir });
      assert.deepEqual(calls, ["user"]);
      const html = fs.readFileSync(path.join(outDir, OAUTH_RECEIVER_PATH), "utf8");
      assert.match(html, /<oauth-receiver><\/oauth-receiver>/);
      assert.match(html, /cdn\.jsdelivr\.net\/npm\/rapidoc@.*integrity="sha384-/);
    } finally {
      fs.rmSync(outDir, { recursive: true, force: true });
    }
  });
});

describe("a VitePress site with @rapidoc/vitepress", () => {
  const vitepress = path.join(
    path.dirname(createRequire(import.meta.url).resolve("vitepress/package.json")),
    "bin/vitepress.js",
  );
  let outDir;
  const read = (file) => fs.readFileSync(path.join(outDir, file), "utf8");

  before(() => {
    outDir = fs.mkdtempSync(path.join(os.tmpdir(), "rapidoc-vitepress-site-"));
    execFileSync(process.execPath, [vitepress, "build", example, "--outDir", outDir], {
      stdio: "pipe",
    });
  });
  after(() => fs.rmSync(outDir, { recursive: true, force: true }));

  it("has the API page with <rapi-doc> set up for a docs layout", () => {
    const element = /<rapi-doc[^>]*>/.exec(read("api.html"))[0];
    for (const attribute of [
      'render-style="focused"',
      'show-side-nav="false"',
      'auto-height="true"',
      'color-scheme="auto"',
      'allow-try="false"',
      'oauth-receiver="/rapidoc/oauth-receiver.html"',
    ]) {
      assert.ok(element.includes(attribute), `${attribute} in ${element}`);
    }
  });

  it("lists the API's operations in the sidebar", () => {
    const html = read("index.html");
    assert.match(html, /href="\/api\.html#list-pets"/);
    assert.match(html, /Remove a pet/);
  });

  it("ships the spec and the bundle in the site's scripts, and the OAuth return page", () => {
    const assets = fs
      .readdirSync(path.join(outDir, "assets"), { recursive: true })
      .filter((file) => String(file).endsWith(".js"));
    const text = (file) => fs.readFileSync(path.join(outDir, "assets", String(file)), "utf8");
    assert.ok(
      assets.some((file) => text(file).includes("A small API for the")),
      "the spec",
    );
    assert.ok(
      assets.some((file) => text(file).includes("rapi-doc-mini")),
      "the bundle",
    );
    assert.match(read(OAUTH_RECEIVER_PATH), /<oauth-receiver>/);
  });
});
