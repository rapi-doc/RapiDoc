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
  it("lists an overview link and a group per tag with a link per operation", async () => {
    const items = await rapidocSidebar("./openapi/pets.yaml", "/api", { root: example });
    assert.deepEqual(items[0], { text: "Overview", link: "/api#overview" });
    assert.deepEqual(
      items.slice(1).map((group) => group.text),
      ["Pets", "Owners"],
    );
    assert.deepEqual(items[1].items[0], { text: "List pets", link: "/api#list-pets" });
    assert.equal(items[1].collapsed, undefined);
  });

  it("takes a document as an object, and a collapsed setting", async () => {
    const spec = {
      openapi: "3.1.0",
      info: { title: "Inline", version: "1" },
      paths: { "/ping": { get: { tags: ["Health"], summary: "Ping", responses: {} } } },
    };
    const items = await rapidocSidebar(spec, "/reference/", { collapsed: true });
    assert.deepEqual(items[1], {
      text: "Health",
      collapsed: true,
      items: [{ text: "Ping", link: "/reference/#ping" }],
    });
    assert.equal(await loadSpec(spec), spec);
    await assert.rejects(rapidocSidebar("./nope.yaml", "/api", { root: example }), /not found/);
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
