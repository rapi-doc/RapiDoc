import { describe, it } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { docPageUrl, docSlug, docUrl, isDocFile, isHomeDocFile } from "../src/config/doc-paths.js";
import { splitFrontmatter } from "../src/config/doc-source.js";
import { externalAttrs, isExternal } from "../src/config/links.js";

describe("Docs files and their addresses", () => {
  it("knows which files are pages", () => {
    for (const name of ["a.md", "a.mdx", "a.markdoc", "A.MD"]) assert.equal(isDocFile(name), true);
    for (const name of ["a.astro", "a.png", "a.mdoc", "notes.txt"])
      assert.equal(isDocFile(name), false);
  });

  it("makes a slug from a file path or from a slug in the config", () => {
    assert.equal(docSlug("guides/first-shipment.md"), "guides/first-shipment");
    assert.equal(docSlug("/guides/first-shipment/"), "guides/first-shipment");
    assert.equal(docSlug(path.join("guides", "setup.mdx")), "guides/setup");
    // A folder's index page is the folder's page, with or without the extension
    assert.equal(docSlug("guides/index.md"), "guides");
    assert.equal(docSlug("guides/index"), "guides");
    assert.equal(docSlug("index.markdoc"), "");
    // Only a whole segment named index
    assert.equal(docSlug("guides/reindex.md"), "guides/reindex");
  });

  it("gives every page its address", () => {
    assert.equal(docUrl("guides"), "/docs/guides/");
    assert.equal(docUrl(""), "/docs/");
    assert.equal(docPageUrl("quickstart.md"), "/docs/quickstart/");
    assert.equal(docPageUrl(path.join("guides", "index.mdx")), "/docs/guides/");
  });

  it("puts docs/index.* at the home page, or at /docs/ when the project has its own", () => {
    assert.equal(isHomeDocFile("index.md"), true);
    assert.equal(isHomeDocFile(path.join("guides", "index.md")), false);
    assert.equal(docPageUrl("index.md"), "/");
    assert.equal(docPageUrl("index.md", { home: false }), "/docs/");
    assert.equal(docPageUrl(path.join("guides", "index.md"), { home: false }), "/docs/guides/");
  });
});

describe("A docs page's frontmatter", () => {
  it("splits the frontmatter from the text", () => {
    const { data, body } = splitFrontmatter(
      "---\ntitle: Hello\ndescription: A page\n---\n\n# Hi\n",
    );
    assert.deepEqual(data, { title: "Hello", description: "A page" });
    assert.equal(body, "\n# Hi\n");
  });

  it("reads files with Windows line endings", () => {
    const { data, body } = splitFrontmatter("---\r\ntitle: Hello\r\n---\r\nText\r\n");
    assert.equal(data.title, "Hello");
    assert.equal(body, "Text\r\n");
  });

  it("leaves a page without frontmatter as it is", () => {
    const source = "# Title\n\nText with a rule:\n\n---\n\nMore.\n";
    assert.deepEqual(splitFrontmatter(source), { data: {}, body: source });
  });

  it("keeps a horizontal rule in the text when the page has frontmatter", () => {
    const { body } = splitFrontmatter("---\ntitle: T\n---\nOne\n\n---\n\nTwo\n");
    assert.equal(body, "One\n\n---\n\nTwo\n");
  });

  it("gives no data for frontmatter it can't read, and still removes it", () => {
    const { data, body } = splitFrontmatter("---\ntitle: [unclosed\n---\nText\n");
    assert.deepEqual(data, {});
    assert.equal(body, "Text\n");
  });
});

describe("Links", () => {
  it("tells a link to another site from a path on this one", () => {
    for (const href of ["https://example.com", "mailto:a@example.com", "HTTP://EXAMPLE.COM"])
      assert.equal(isExternal(href), true);
    for (const href of ["/docs/intro", "docs/intro", "#top", "", undefined])
      assert.equal(isExternal(href), false);
  });

  it("opens only external links in a new tab", () => {
    assert.deepEqual(externalAttrs("https://example.com"), {
      target: "_blank",
      rel: "noopener noreferrer",
    });
    assert.deepEqual(externalAttrs("/docs/intro"), {});
  });
});
