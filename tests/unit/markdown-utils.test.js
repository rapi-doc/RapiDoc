import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { marked } from "marked";
import {
  blockSummary,
  firstLineHtml,
  fixRenderedAnchorLinks,
} from "../../packages/rapidoc/src/utils/markdown-utils.js";

describe("markdown in-page anchor links", () => {
  let originalLocation;
  beforeEach(() => {
    originalLocation = globalThis.location;
    globalThis.location = { href: "https://example.com/docs/page?x=1#old-hash" };
  });
  afterEach(() => {
    if (originalLocation === undefined) {
      delete globalThis.location;
    } else {
      globalThis.location = originalLocation;
    }
  });

  it("renders #anchors as absolute URLs of the current page with the anchor-link class", () => {
    const html = marked.parse("[go](#section-1)");
    assert.match(
      html,
      /<a class="anchor-link" href="https:\/\/example\.com\/docs\/page\?x=1#section-1">go<\/a>/,
    );
  });

  it("keeps the link title only when present", () => {
    assert.match(marked.parse('[go](#a "Title")'), /title="Title"/);
    assert.doesNotMatch(marked.parse("[go](#a)"), /title=/);
  });

  it("renders inline markdown inside the link text", () => {
    assert.match(
      marked.parse("[**bold**](#a)"),
      /<a class="anchor-link" [^>]*><strong>bold<\/strong><\/a>/,
    );
  });

  it("leaves external and relative links to the default renderer", () => {
    const html = marked.parse("[ext](https://other.org/a) [rel](./b)");
    assert.match(html, /<a href="https:\/\/other\.org\/a">ext<\/a>/);
    assert.match(html, /<a href="\.\/b">rel<\/a>/);
    assert.doesNotMatch(html, /anchor-link/);
  });

  it("also fixes links when a custom renderer replaces the global one (e.g. headings in the nav bar)", () => {
    const renderer = new marked.Renderer();
    fixRenderedAnchorLinks(renderer);
    const html = marked.parse("[go](#a) and [ext](https://other.org/a)", { renderer });
    assert.match(
      html,
      /<a class="anchor-link" href="https:\/\/example\.com\/docs\/page\?x=1#a">go<\/a>/,
    );
    assert.match(html, /<a href="https:\/\/other\.org\/a">ext<\/a>/);
  });

  it("does not fix links of a custom renderer that was not opted in", () => {
    const html = marked.parse("[go](#a)", { renderer: new marked.Renderer() });
    assert.doesNotMatch(html, /anchor-link/);
  });
});

describe("blockSummary: one-line stand-in for blocks in collapsed schema descriptions", () => {
  const summary = (md) => blockSummary(marked.lexer(md).find((t) => t.type !== "space"));

  it("describes a table by its row count", () => {
    assert.equal(
      summary("| A | B |\n| - | - |\n| 1 | 2 |\n| 3 | 4 |\n| 5 | 6 |"),
      '<span class="descr-placeholder">Table · 3 rows</span>',
    );
    assert.equal(
      summary("| A |\n| - |\n| 1 |"),
      '<span class="descr-placeholder">Table · 1 row</span>',
    );
  });

  it("describes a code block, with its language when given", () => {
    assert.equal(
      summary("```json\n{}\n```"),
      '<span class="descr-placeholder">Code block · json</span>',
    );
    assert.equal(summary("    indented code"), '<span class="descr-placeholder">Code block</span>');
  });

  it("flattens an HTML block to its text", () => {
    assert.equal(
      summary("<div>\n  <p>First <em>line</em></p>\n  <p>Second</p>\n</div>"),
      "First line Second",
    );
    assert.equal(
      summary("<div><script>alert(1)</script></div>"),
      '<span class="descr-placeholder">HTML content</span>',
    );
  });

  it("uses the first line of a blockquote, keeping inline markdown", () => {
    assert.equal(
      summary("> **Note:** read\n> this\n>\n> More"),
      "<strong>Note:</strong> read this",
    );
    assert.equal(
      summary("> | A |\n> | - |\n> | 1 |"),
      '<span class="descr-placeholder">Table · 1 row</span>',
    );
  });

  it("returns nothing for blocks that fit on one line", () => {
    assert.equal(summary("A paragraph"), "");
    assert.equal(summary("- a\n- b"), "");
    assert.equal(summary("## Heading"), "");
  });
});

describe("firstLineHtml: first line of a paragraph, heading or list", () => {
  const first = (md) => firstLineHtml(marked.lexer(md).find((t) => t.type !== "space"));

  it("joins a paragraph onto one line, keeping inline markdown", () => {
    assert.equal(first("Line **one**\nline two"), "Line <strong>one</strong> line two");
  });

  it("uses the heading text", () => {
    assert.equal(first("#### Eligibility\nBody"), "Eligibility");
  });

  it("uses the first list item, without its nested list", () => {
    assert.equal(first("* `a`: first\n  * nested\n* second"), "<code>a</code>: first");
  });
});
