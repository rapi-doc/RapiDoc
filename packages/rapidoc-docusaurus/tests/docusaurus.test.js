// Docusaurus itself is not installed in the monorepo (it is large, and an optional peer here), so these
// tests cover the plugin's own logic. The component (src/client.js) is checked by hand in a real site:
// see AGENTS.md.
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import rapidocDocusaurus, {
  rapidocSidebar,
  rapidocSidebarSync,
  loadSpec,
  OAUTH_RECEIVER_PATH,
  PLUGIN_NAME,
} from "../src/index.js";

const fixtures = fileURLToPath(new URL("./fixtures/", import.meta.url));
const src = fileURLToPath(new URL("../src/", import.meta.url));

describe("rapidocSidebar", () => {
  const pets = { spec: "./pets.yaml", uiPath: "/docs/api", root: fixtures };

  it("lists the page's doc, then a category per tag with a link per operation", async () => {
    const items = await rapidocSidebar({ ...pets, docId: "api" });
    assert.deepEqual(items[0], { type: "doc", id: "api", label: "Overview" });
    assert.deepEqual(
      items.slice(1).map((item) => [item.type, item.label, item.collapsed]),
      [
        ["category", "Pets", false],
        ["category", "Owners", false],
      ],
    );
    assert.deepEqual(items[1].items[0], {
      type: "link",
      label: "List pets",
      href: "/docs/api#list-pets",
      className: "rapidoc-op rapidoc-op--get",
    });
    assert.equal(
      items[1].items[2].className,
      "rapidoc-op rapidoc-op--delete rapidoc-op--deprecated",
    );
  });

  it("uses a plain overview link without a doc id, and takes a collapsed setting", async () => {
    const items = await rapidocSidebar({ ...pets, uiPath: "/api", collapsed: true });
    assert.deepEqual(items[0], { type: "link", label: "Overview", href: "/api#overview" });
    assert.equal(items[1].collapsed, true);
    await assert.rejects(rapidocSidebar({ ...pets, spec: "./nope.yaml" }), /not found/);
    await assert.rejects(rapidocSidebar({ spec: "./pets.yaml", root: fixtures }), /needs `uiPath`/);
  });

  it("shows the method as asked, or not at all", async () => {
    const className = async (methods) =>
      (await rapidocSidebar({ ...pets, methods }))[1].items[2].className;
    assert.equal(await className(false), "rapidoc-op rapidoc-op--deprecated");
    assert.equal(
      await className("as-plain-text"),
      "rapidoc-op rapidoc-op--delete rapidoc-op--plain rapidoc-op--deprecated",
    );
    await assert.rejects(className("loud"), /"methods" is "false"/);
  });

  it("returns the same items synchronously, for sidebars.js", async () => {
    const options = { ...pets, docId: "api", methods: "as-colored-block" };
    assert.deepEqual(rapidocSidebarSync(options), await rapidocSidebar(options));
    const spec = await loadSpec("./pets.yaml", fixtures);
    assert.equal(
      rapidocSidebarSync({ spec, uiPath: "/api" })[1].label,
      "Pets",
      "a document as an object",
    );
  });
});

describe("the plugin", () => {
  const context = { siteDir: fixtures, baseUrl: "/site/" };
  const plugin = rapidocDocusaurus(context, {
    apis: { pets: "./pets.yaml", "my api": "./pets.yaml" },
  });

  it("reads the named documents", async () => {
    assert.equal(plugin.name, PLUGIN_NAME);
    const content = await plugin.loadContent();
    assert.deepEqual(Object.keys(content), ["pets", "my api"]);
    assert.equal(content.pets.info.title, "Pets API");
  });

  it("writes one data file per document, an index of loaders, and the OAuth return route", async () => {
    const data = {};
    const routes = [];
    await plugin.contentLoaded({
      content: await plugin.loadContent(),
      actions: {
        createData: async (name, text) => {
          data[name] = text;
          return `/generated/${name}`;
        },
        addRoute: (route) => routes.push(route),
      },
    });
    assert.deepEqual(Object.keys(data), ["spec-pets.json", "spec-my_api.json", "specs.js"]);
    assert.equal(JSON.parse(data["spec-pets.json"]).info.title, "Pets API");
    assert.match(data["specs.js"], /"pets": \(\) => import\("\.\/spec-pets\.json"\),/);
    assert.match(data["specs.js"], /"my api": \(\) => import\("\.\/spec-my_api\.json"\),/);
    assert.ok(data["specs.js"].includes(JSON.stringify(OAUTH_RECEIVER_PATH)));
    assert.deepEqual(routes, [
      {
        path: `/site/${OAUTH_RECEIVER_PATH}`,
        component: "@rapidoc/docusaurus/oauth-receiver",
        exact: true,
      },
    ]);
  });

  it("adds the styles of the sidebar's method labels to every page", () => {
    const [style] = plugin.injectHtmlTags().headTags;
    assert.equal(style.tagName, "style");
    assert.match(style.innerHTML, /\.rapidoc-op--post > \.menu__link::before\{content:"POST";/);
    assert.match(style.innerHTML, /\[data-theme='dark'\]\{--rapidoc-method-get:/);
  });

  it("watches the spec files, not URLs or objects", () => {
    const watching = rapidocDocusaurus(context, {
      apis: { a: "./pets.yaml", b: "https://example.com/openapi.json", c: { openapi: "3.1.0" } },
    }).getPathsToWatch();
    assert.deepEqual(watching, [path.join(fixtures, "pets.yaml")]);
  });
});

describe("the files a site compiles", () => {
  // Docusaurus compiles packages with loose array spread: [...nodeList] becomes [].concat(nodeList),
  // one item instead of many. It also loads the plugin with require(), which cannot load
  // @rapidoc/prerender at the top of a file.
  it("spread no DOM list, set or map in the client files", () => {
    for (const file of ["client.js", "oauth-receiver.js"]) {
      const code = fs.readFileSync(path.join(src, file), "utf8").replace(/^\s*\/\/.*$/gm, "");
      assert.doesNotMatch(code, /\[\s*\.\.\./, `${file} uses an array spread; use Array.from`);
    }
  });

  it("import @rapidoc/prerender only inside a function in the plugin file", () => {
    const source = fs.readFileSync(path.join(src, "index.js"), "utf8");
    assert.doesNotMatch(source, /^import .*@rapidoc\/prerender/m);
    assert.doesNotMatch(
      source,
      /from "@rapidoc\/embed"/,
      "the package root cannot be loaded with require()",
    );
    assert.match(source, /await import\("@rapidoc\/prerender"\)/);
  });
});
