import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { resolveSpecInput, getSpecNavigation, getNavBarHtml, renderRapiDoc } from "rapidoc/static";
import { isNavTagVisible } from "~/templates/navbar-template";

// Tags no operation uses can hold a guide or concepts section (#923)
const ok = { responses: { 200: { description: "ok" } } };
const spec = (extra = {}) => ({
  openapi: "3.1.0",
  info: { title: "Shop", version: "1" },
  tags: [
    { name: "Getting started", description: "## Sign up\n\nCreate an account first." },
    { name: "Orders" },
    { name: "Unused without description" },
  ],
  paths: { "/orders": { get: { tags: ["Orders"], summary: "List orders", ...ok } } },
  ...extra,
});
const tagNames = (resolved) =>
  resolved.tags.map((t) => `${t.name}${t.descriptionOnly ? " (description only)" : ""}`);

describe("show-unused-tags", () => {
  it("is off by default: tags without operations are left out", async () => {
    assert.deepEqual(tagNames(await resolveSpecInput(spec())), ["Orders"]);
  });

  it("keeps an unused tag that has a description, marked descriptionOnly", async () => {
    const resolved = await resolveSpecInput(spec(), { showUnusedTags: true });
    assert.deepEqual(tagNames(resolved), ["Getting started (description only)", "Orders"]);
    assert.deepEqual(resolved.tags[0].paths, []);
    // the kebab-case attribute name works too
    assert.deepEqual(
      tagNames(await resolveSpecInput(spec(), { "show-unused-tags": "true" })),
      tagNames(resolved),
    );
  });

  it("keeps an unused tag the spec lists in x-tagGroups, without the option", async () => {
    const resolved = await resolveSpecInput(
      spec({
        "x-tagGroups": [
          { name: "Guides", tags: ["Getting started", "Unused without description"] },
          { name: "API", tags: ["Orders"] },
        ],
      }),
    );
    assert.deepEqual(tagNames(resolved), ["Getting started (description only)", "Orders"]);
    assert.deepEqual(
      resolved.tagGroups.map((g) => `${g.name}: ${g.tags.map((t) => t.name).join(", ")}`),
      ["Guides: Getting started", "API: Orders"],
    );
  });

  it("static navigation keeps the tag, and the sidebar links to its section with nothing to expand", async () => {
    const nav = await getSpecNavigation(spec(), { showUnusedTags: true });
    assert.deepEqual(
      nav.tags.map((t) => [t.name, t.descriptionOnly === true, t.paths.length]),
      [
        ["Getting started", true, 0],
        ["Orders", false, 1],
      ],
    );

    const html = await getNavBarHtml(spec(), { showUnusedTags: true });
    const block =
      html.match(/<div class="nav-bar-tag-and-paths description-only">([\s\S]*?)<\/div>/)?.[1] ??
      "";
    assert.match(
      block,
      /<a\s[^>]*href="#tag--getting-started"[^>]*data-action="navigate"[^>]*data-content-id="tag--getting-started"/,
    );
    assert.match(block, /Getting started/);
    assert.doesNotMatch(block, /nav-bar-tag-icon|expand-collapse-tag/);
  });

  it("read mode renders the tag's section with its description", async () => {
    const html = await renderRapiDoc({
      spec: spec(),
      showUnusedTags: true,
      outputMode: "html",
      includeStyles: false,
      showSideNav: false,
    });
    assert.match(
      html,
      /<section id="tag--getting-started"[\s\S]*?Getting started[\s\S]*?Create an account first\./,
    );
    const sectionsAfterGuide = html
      .split('<section id="tag--getting-started"')[1]
      .split('<section id="tag--orders"')[0];
    assert.doesNotMatch(
      sectionsAfterGuide,
      /section-operations-in-tag/,
      "no empty operations section after it",
    );

    const dsd = await renderRapiDoc({ spec: spec(), showUnusedTags: true, includeStyles: false });
    assert.match(
      dsd,
      /<rapi-doc [^>]*show-unused-tags="true"/,
      "the option is reflected on the element for hydration",
    );
  });

  it("the <rapi-doc> sidebar hides a description-only tag while filtering", () => {
    const tag = { name: "Getting started", descriptionOnly: true, paths: [] };
    assert.equal(isNavTagVisible(tag, ""), true);
    assert.equal(isNavTagVisible(tag, "orders"), false);
  });
});
