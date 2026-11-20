import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildPortal } from "../src/index.js";
import { listProjectPages, routePattern } from "../src/engine/project-pages.js";

const here = path.dirname(fileURLToPath(import.meta.url));

function writeFiles(dir, files) {
  for (const [file, content] of Object.entries(files)) {
    const full = path.join(dir, file);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, content);
  }
}

describe("A project's pages/ folder", () => {
  const config = (overrides = {}) => ({ docs: { home: null }, redirects: [], ...overrides });
  let dir;

  before(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), "rapidoc-pages-"));
  });
  after(() => fs.rmSync(dir, { recursive: true, force: true }));

  const project = (name, files) => {
    const projectDir = path.join(dir, name);
    writeFiles(projectDir, files);
    return projectDir;
  };

  it("names a route after the file's path, as Astro does", () => {
    assert.equal(routePattern("pricing.astro"), "/pricing");
    assert.equal(routePattern("index.astro"), "/");
    assert.equal(routePattern(path.join("demo", "index.astro")), "/demo");
    assert.equal(routePattern(path.join("api", "[...element].astro")), "/api/[...element]");
  });

  it("lists .astro files only, and skips files and folders that start with _ or .", () => {
    const projectDir = project("list", {
      "pages/sandbox.astro": "",
      "pages/examples/auth.astro": "",
      "pages/examples/_table.astro": "",
      "pages/_parts/header.astro": "",
      "pages/.DS_Store": "",
      "pages/notes.md": "",
    });
    const pages = listProjectPages(projectDir, config());
    assert.deepEqual(
      pages.map((page) => page.pattern),
      ["/examples/auth", "/sandbox"],
    );
    assert.equal(pages[1].file, path.join(projectDir, "pages", "sandbox.astro"));
    assert.equal(pages[1].entrypoint.protocol, "file:");
  });

  it("has no pages without a pages/ folder", () => {
    assert.deepEqual(listProjectPages(project("none", { "docs/a.md": "" }), config()), []);
  });

  it("stops on a page that takes one of the portal's routes, naming each", () => {
    const projectDir = project("reserved", {
      "pages/catalog.astro": "",
      "pages/apis/orders.astro": "",
      "pages/docs/extra.astro": "",
      "pages/old.astro": "",
      "pages/fine.astro": "",
    });
    assert.throws(
      () => listProjectPages(projectDir, config({ redirects: [{ from: "/old", to: "/fine" }] })),
      (err) => {
        for (const file of ["catalog", "apis/orders", "docs/extra", "old"])
          assert.match(err.message, new RegExp(`pages/${file}\\.astro: `));
        assert.doesNotMatch(err.message, /fine\.astro/);
        return true;
      },
    );
  });

  it("lets pages/index.astro be the home page", () => {
    const projectDir = project("home", { "pages/index.astro": "" });
    assert.equal(listProjectPages(projectDir, config())[0].pattern, "/");
  });

  it("stops on two files for the same page", () => {
    const projectDir = project("twice", { "pages/demo.astro": "", "pages/demo/index.astro": "" });
    assert.throws(() => listProjectPages(projectDir, config()), /is the same page \(\/demo\)/);
  });
});

describe("Building a project with pages/", () => {
  // Inside the package, so the pages' import of @rapidoc/portal/components resolves as in a real project.
  const projectDir = path.join(here, `.pages-project-${process.pid}`);
  const outDir = path.join(projectDir, "dist");
  const page = (file) => fs.readFileSync(path.join(outDir, file, "index.html"), "utf8");

  before(async () => {
    writeFiles(projectDir, {
      "rapidoc.config.yaml": [
        "site:",
        "  title: Pages Test",
        "  titleTemplate: '%s · Pages Test'",
        "head:",
        "  - meta: { name: pages-test-marker, content: from-config }",
        "navigation:",
        "  - label: Documentation",
        "    items:",
        "      - { slug: index }",
        "      - { slug: intro }",
        "",
      ].join("\n"),
      "docs/intro.md": "---\ntitle: Intro\n---\n\nHello.\n",
      // With pages/index.astro as the home page, docs/index.* is the page at /docs
      "docs/index.md": "---\ntitle: Documentation\n---\n\nThe docs start here.\n",
      "pages/index.astro": [
        "---",
        "import { PortalLayout } from '@rapidoc/portal/components';",
        "---",
        "<PortalLayout title='Pages Test'><h1 id='own-home'>Our own home page</h1></PortalLayout>",
        "",
      ].join("\n"),
      "data/greeting.txt": "read from the project folder",
      // The portal's frame around the page's content
      "pages/framed.astro": [
        "---",
        "import { PortalLayout } from '@rapidoc/portal/components';",
        "---",
        "<PortalLayout title='Framed'><h1 id='framed-content'>Framed page</h1></PortalLayout>",
        "",
      ].join("\n"),
      // A page with its own document, the portal's head tags, and a file read at build time
      "pages/bare.astro": [
        "---",
        "import fs from 'node:fs';",
        "import path from 'node:path';",
        "import PortalHead from '@rapidoc/portal/components/PortalHead.astro';",
        "import { projectDir } from 'virtual:rapidoc-portal/project';",
        "const greeting = fs.readFileSync(path.join(projectDir, 'data', 'greeting.txt'), 'utf8');",
        "---",
        "<html lang='en'><head><meta charset='utf-8' /><PortalHead title='Bare' /></head>",
        "<body><p id='greeting'>{greeting}</p></body></html>",
        "",
      ].join("\n"),
      "pages/items/[id].astro": [
        "---",
        "export const getStaticPaths = () => ['one', 'two'].map((id) => ({ params: { id } }));",
        "const { id } = Astro.params;",
        "---",
        "<html lang='en'><head><title>{id}</title></head><body><p>Item {id}</p></body></html>",
        "",
      ].join("\n"),
      "pages/_draft.astro": "<p>not a page</p>\n",
    });
    await buildPortal(projectDir, { outDir });
  });

  after(() => fs.rmSync(projectDir, { recursive: true, force: true }));

  it("builds a page inside the portal's frame", () => {
    const html = page("framed");
    assert.match(html, /<title>Framed · Pages Test<\/title>/);
    assert.match(html, /id="framed-content"/);
    assert.match(html, /class="portal-layout"/);
    assert.match(html, /name="pages-test-marker"/);
  });

  it("builds a page with its own document, the portal's head tags and the project's files", () => {
    const html = page("bare");
    assert.match(html, /<title>Bare · Pages Test<\/title>/);
    assert.match(html, /name="pages-test-marker"/);
    assert.match(html, /read from the project folder/);
    // Only what the page wrote and the head tags: none of the portal's styles (the one script is the
    // link prefetching that every page of the site gets)
    assert.doesNotMatch(html, /portal-layout|<link rel="stylesheet"|<style/);
  });

  it("builds every page of a dynamic route", () => {
    assert.match(page("items/one"), /Item one/);
    assert.match(page("items/two"), /Item two/);
  });

  it("builds no page from a file that starts with _, and still builds the docs", () => {
    assert.equal(fs.existsSync(path.join(outDir, "_draft")), false);
    assert.match(page("docs/intro"), /Hello\./);
  });

  it("makes pages/index.astro the home page, and docs/index.* the page at /docs", () => {
    assert.match(fs.readFileSync(path.join(outDir, "index.html"), "utf8"), /id="own-home"/);
    const docsHome = page("docs");
    assert.match(docsHome, /The docs start here\./);
    assert.match(docsHome, /<title>Documentation · Pages Test<\/title>/);
    // The sidebar, the search index and llms.txt agree on its address
    assert.match(page("docs/intro"), /href="\/docs\/"/);
    const { records } = JSON.parse(fs.readFileSync(path.join(outDir, "search-index.json"), "utf8"));
    assert.ok(records.some((record) => record.url === "/docs" && record.title === "Documentation"));
    assert.match(fs.readFileSync(path.join(outDir, "llms.txt"), "utf8"), /\/docs\.md/);
  });

  it("leaves nothing in the project but the output", () => {
    assert.equal(fs.existsSync(path.join(projectDir, ".rapidoc-temp")), false);
  });
});
