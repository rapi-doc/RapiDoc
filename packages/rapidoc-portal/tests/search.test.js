import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import fs from "node:fs";
import os from "node:os";
import { fileURLToPath } from "node:url";

import {
  stripMarkup,
  extractDocSections,
  extractPageRecords,
  indexOpenApiSpec,
  buildSearchIndex,
  searchRecords,
} from "../src/search/indexer.js";
import { loadConfig } from "../src/config/loader.js";
import { buildPortal } from "../src/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DEMO_PORTAL_DIR =
  process.env.RAPIDOC_DEMO_PORTAL_DIR ??
  path.resolve(__dirname, "../../../../rapi-portal-demo/cosmo-cargo");

test("RapiDoc Portal Full-Text Search Engine (Milestone 5)", async (t) => {
  await t.test(
    "stripMarkup should strip frontmatter, markdoc tags, code blocks and formatting",
    () => {
      const raw = `---
title: Test Page
---
# Heading
{% callout type="info" %}Alert message{% /callout %}
Some paragraph with **bold** and \`inline code\`.
\`\`\`javascript
const secret = 42;
\`\`\`
Visit [Our Docs](https://example.com) for details.`;

      const cleaned = stripMarkup(raw);
      assert.strictEqual(cleaned.includes("title: Test Page"), false);
      assert.strictEqual(cleaned.includes("{% callout"), false);
      assert.strictEqual(cleaned.includes("const secret"), false);
      assert.strictEqual(cleaned.includes("Some paragraph with bold and inline code."), true);
      assert.strictEqual(cleaned.includes("Visit Our Docs for details."), true);
    },
  );

  await t.test("extractDocSections should extract headings and section anchors", () => {
    const markdown = `# Main Title
First intro paragraph.

## Section One
Content under section one.

### Sub Section
Content under subsection.`;

    const sections = extractDocSections(markdown, "/docs/test", "Test Page");
    assert.strictEqual(sections.length, 3);
    assert.strictEqual(sections[0].title, "Main Title");
    assert.strictEqual(sections[0].url, "/docs/test#main-title");
    assert.strictEqual(sections[1].title, "Section One");
    assert.strictEqual(sections[1].url, "/docs/test#section-one");
    assert.strictEqual(sections[2].title, "Sub Section");
    assert.strictEqual(sections[2].url, "/docs/test#sub-section");
  });

  await t.test("indexOpenApiSpec should index operations from OpenAPI YAML spec", () => {
    const apiConfig = {
      id: "orders",
      title: "BrewCraft Orders API",
      path: "/apis/orders",
      fullPath: path.join(DEMO_PORTAL_DIR, "specs/orders-api.yaml"),
    };

    const records = indexOpenApiSpec(apiConfig);
    assert.ok(records.length >= 3, "Orders API should have multiple operations");

    const createOrder = records.find((r) => r.method === "POST" && r.endpoint === "/orders");
    assert.ok(createOrder, "POST /orders operation should be found");
    assert.strictEqual(createOrder.type, "api");
    assert.strictEqual(createOrder.title, "Create an order");
    assert.strictEqual(createOrder.category, "BrewCraft Orders API");
    assert.strictEqual(createOrder.url, "/apis/orders#createOrder");
  });

  await t.test(
    "buildSearchIndex should build unified index across rapi-portal-demo docs & specs",
    async () => {
      const { config } = await loadConfig(DEMO_PORTAL_DIR);
      const docFiles = [
        path.join(DEMO_PORTAL_DIR, "docs/getting-started.md"),
        path.join(DEMO_PORTAL_DIR, "docs/guides/order-fulfillment.markdoc"),
        path.join(DEMO_PORTAL_DIR, "docs/tutorials/cargo-bay-reservation.mdx"),
      ];

      const index = buildSearchIndex(config, DEMO_PORTAL_DIR, docFiles);
      assert.ok(index.totalRecords > 15, "Index should contain doc and API records");

      // Test in-memory search
      const bookingResults = searchRecords(index.records, "booking");
      assert.ok(bookingResults.length > 0, 'Searching for "booking" should yield results');

      // Test filter 'doc'
      const docResults = searchRecords(index.records, "container", { filter: "doc" });
      assert.ok(
        docResults.every((r) => r.type === "doc"),
        "All results should be type doc",
      );

      // Test filter 'api'
      const apiResults = searchRecords(index.records, "containers", { filter: "api" });
      assert.ok(
        apiResults.every((r) => r.type === "api"),
        "All results should be type api",
      );
    },
  );

  await t.test("buildPortal should generate dist/search-index.json during SSG build", async () => {
    const tempOutDir = fs.mkdtempSync(path.join(os.tmpdir(), "rapidoc-search-test-"));
    try {
      const result = await buildPortal(DEMO_PORTAL_DIR, { outDir: tempOutDir });
      assert.strictEqual(result.success, true);
      assert.ok(result.apisCount > 0, "APIs should be compiled");

      const searchIndexPath = path.join(result.outDir, "search-index.json");
      assert.strictEqual(fs.existsSync(searchIndexPath), true);

      const parsedJson = JSON.parse(fs.readFileSync(searchIndexPath, "utf8"));
      assert.strictEqual(parsedJson.version, 1);
      assert.ok(Array.isArray(parsedJson.records));
      assert.ok(parsedJson.records.length > 0);
    } finally {
      if (fs.existsSync(tempOutDir)) {
        try {
          fs.rmSync(tempOutDir, { recursive: true, force: true, maxRetries: 3 });
        } catch {
          // Cleanup
        }
      }
    }
  });

  await t.test("indexes MDX and inline code as the reader sees them", () => {
    const text = stripMarkup(
      [
        "import { Tabs, TabItem } from '@rapidoc/portal/components';",
        "import Demo from '../components/Demo.astro';",
        "",
        "`<rapi-doc>` is a standard <b>custom</b> element.",
        "<Tabs><TabItem label='npm'>Install it</TabItem></Tabs>",
        "We import the bundle from a CDN.",
      ].join("\n"),
    );
    assert.equal(
      text,
      "<rapi-doc> is a standard custom element. Install it We import the bundle from a CDN.",
    );
  });

  await t.test("titles a section as its heading reads, without Markdown", () => {
    const [section] = extractDocSections(
      "## `<rapi-doc>` or [`<rapi-doc-mini>`](/docs/mini)?\n\nWhich one.\n",
      "/docs/pick",
      "Pick",
    );
    assert.equal(section.title, "<rapi-doc> or <rapi-doc-mini>?");
    assert.equal(section.url, "/docs/pick#rapi-doc-or-rapi-doc-mini");
  });

  await t.test(
    "makes records from a built page: the page, then its headings that have an id",
    () => {
      const html = [
        "<html><head><title>Pricing | Acme</title>",
        '<meta name="description" content="Plans &amp; prices"></head>',
        "<body><header>Menu</header><main><h1>Our &lt;plans&gt;</h1><p>Free for open source.</p>",
        '<h2 id="teams">Teams</h2><p>Ten seats.</p><h2>No id</h2><p>Skipped as a section.</p>',
        "<script>var hidden = 1;</script></main><footer>Legal</footer></body></html>",
      ].join("");
      const [page, section, ...rest] = extractPageRecords(html, "/pricing", { siteTitle: "Acme" });
      assert.equal(rest.length, 0);
      assert.deepEqual(
        { type: page.type, title: page.title, subtitle: page.subtitle, url: page.url },
        { type: "page", title: "Our <plans>", subtitle: "Plans & prices", url: "/pricing" },
      );
      assert.doesNotMatch(page.content, /Menu|Legal|hidden/);
      assert.deepEqual(
        { title: section.title, url: section.url, content: section.content },
        { title: "Teams", url: "/pricing#teams", content: "Ten seats." },
      );
      // Without an <h1>: the <title>, less the site's name
      const untitled = extractPageRecords(
        "<title>Pricing | Acme</title><body><p>x</p></body>",
        "/p",
        {
          siteTitle: "Acme",
        },
      );
      assert.equal(untitled[0].title, "Pricing");
    },
  );

  await t.test("leaves a page out of the search when the page asks", () => {
    const html =
      '<head><meta name="portal-search" content="off"></head><body><h1>Hidden</h1></body>';
    assert.deepEqual(extractPageRecords(html, "/hidden"), []);
  });

  await t.test("finds a hyphenated name by its plain spelling, and the other way round", () => {
    const records = [
      {
        type: "page",
        title: "<rapi-doc-mini> API Reference",
        url: "/api/rapi-doc-mini",
        content: "",
      },
      { type: "doc", title: "RapiDoc Mini", url: "/docs/rapidoc-mini", content: "Embed endpoints" },
      { type: "doc", title: "Theming", url: "/docs/theming", content: "Colors and fonts" },
    ];
    const urls = (query) => searchRecords(records, query).map((record) => record.url);
    // Every word of the query must be found, in any order and any field
    assert.deepEqual(urls("rapidoc mini reference"), ["/api/rapi-doc-mini"]);
    assert.deepEqual(urls("mini rapidoc").sort(), ["/api/rapi-doc-mini", "/docs/rapidoc-mini"]);
    assert.deepEqual(urls("rapi-doc").sort(), ["/api/rapi-doc-mini", "/docs/rapidoc-mini"]);
    assert.deepEqual(urls("rapidoc theming"), []);
  });
});
