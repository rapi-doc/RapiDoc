import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { resolveApis, loadSpec, pageUrl, PAGE_ATTRIBUTES } from "../src/apis.js";

const root = fileURLToPath(new URL("../example/", import.meta.url));
const site = { root, base: "/", trailingSlash: "ignore" };
const pets = { path: "/api", spec: "./openapi/pets.yaml" };

describe("@rapidoc/starlight options", () => {
  it("reads a YAML spec from the project root and writes it into the page data", async () => {
    const { apis } = await resolveApis(pets, site);
    assert.equal(apis.length, 1);
    assert.equal(apis[0].path, "/api");
    assert.equal(apis[0].title, "Pets API", "the document's title");
    const spec = JSON.parse(apis[0].specJson);
    assert.equal(spec.info.title, "Pets API");
    assert.ok(spec.components.schemas.Pet, "the document as written, references unresolved");
  });

  it("sets the attributes that fit <rapi-doc> into a Starlight page", async () => {
    const { apis } = await resolveApis(pets, site);
    assert.deepEqual(apis[0].attributes, {
      ...PAGE_ATTRIBUTES,
      "oauth-receiver": "/api/oauth-receiver/",
    });
    assert.deepEqual(Object.keys(apis[0].attributes), Object.keys(apis[0].attributes).toSorted());
  });

  it("lets options override them, in camelCase or kebab-case", async () => {
    const { apis } = await resolveApis(
      { ...pets, options: { renderStyle: "read", "allow-try": false, theme: "jade" } },
      site,
    );
    assert.equal(apis[0].attributes["render-style"], "read");
    assert.equal(apis[0].attributes["allow-try"], "false");
    assert.equal(apis[0].attributes.theme, "jade");
    assert.equal(apis[0].attributes["show-side-nav"], "false", "the others stay");
  });

  it("builds a sidebar group with a link per operation", async () => {
    const { sidebar } = await resolveApis(pets, site);
    assert.equal(sidebar.length, 1);
    const [group] = sidebar;
    assert.equal(group.label, "Pets API");
    assert.deepEqual(group.items[0], {
      label: "Overview",
      link: "/api/",
      attrs: { "data-rapidoc-op": "overview" },
    });
    assert.deepEqual(
      group.items.slice(1).map((tag) => tag.label),
      ["Pets", "Owners"],
    );
    assert.deepEqual(group.items[1].items[0], {
      label: "List pets",
      link: "/api/#list-pets",
      attrs: { "data-rapidoc-op": "list-pets", "data-method": "get" },
    });
    assert.deepEqual(group.items[1].items[2].badge, { text: "deprecated", variant: "caution" });
  });

  it("takes label, title and sidebar settings", async () => {
    const titled = await resolveApis({ ...pets, title: "Reference", label: "API" }, site);
    assert.equal(titled.apis[0].title, "Reference");
    assert.equal(titled.sidebar[0].label, "API");

    const collapsed = await resolveApis({ ...pets, sidebar: { collapsed: true } }, site);
    assert.equal(collapsed.sidebar[0].items[1].collapsed, true);

    const none = await resolveApis({ ...pets, sidebar: false }, site);
    assert.deepEqual(none.sidebar, []);
    assert.equal(none.apis.length, 1, "the page is still built");
  });

  it("puts the site's base and trailing-slash setting into the links", async () => {
    const { apis, sidebar } = await resolveApis(pets, {
      root,
      base: "/docs/",
      trailingSlash: "never",
    });
    assert.equal(sidebar[0].items[0].link, "/docs/api");
    assert.equal(sidebar[0].items[1].items[0].link, "/docs/api#list-pets");
    assert.equal(apis[0].attributes["oauth-receiver"], "/docs/api/oauth-receiver");
    assert.equal(apis[0].path, "/api", "routes are relative to the base");
    assert.equal(pageUrl("/", "/api", "always"), "/api/");
  });

  it("takes several APIs, and a spec given as an object", async () => {
    const spec = {
      openapi: "3.1.0",
      info: { title: "Inline", version: "1" },
      paths: { "/ping": { get: { summary: "Ping", responses: { 200: { description: "ok" } } } } },
    };
    const { apis, sidebar } = await resolveApis(
      { apis: [pets, { path: "internal/api/", spec }] },
      site,
    );
    assert.deepEqual(
      apis.map((api) => api.path),
      ["/api", "/internal/api"],
    );
    assert.equal(sidebar[1].label, "Inline");
    assert.equal(await loadSpec(spec, root), spec);
  });

  it("explains what is wrong with the options", async () => {
    await assert.rejects(resolveApis(undefined, site), /at least one API/);
    await assert.rejects(resolveApis({ spec: "./openapi/pets.yaml" }, site), /needs `path`/);
    await assert.rejects(
      resolveApis({ path: "/", spec: "./openapi/pets.yaml" }, site),
      /needs `path`/,
    );
    await assert.rejects(resolveApis({ path: "/api" }, site), /needs `spec`/);
    await assert.rejects(resolveApis({ path: "/api", spec: "./nope.yaml" }, site), /not found/);
    await assert.rejects(resolveApis({ apis: [pets, pets] }, site), /two APIs use the path \/api/);
  });
});
