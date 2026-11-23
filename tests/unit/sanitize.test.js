import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { marked } from "marked";
import {
  safeUrl,
  sanitizeHTML,
  sanitizeMarkup,
} from "../../packages/rapidoc/src/utils/sanitize.js";
import { renderRapiDoc } from "@rapidoc/prerender";

describe("sanitizeHTML without a DOM (Node, and browsers without the Sanitizer API)", () => {
  it("keeps what markdown renders", () => {
    const html = marked(
      [
        "# Title",
        'Some **bold**, _em_, `code`, ~~gone~~ and a [link](https://example.com/a?b=1&c=2 "tip").',
        "",
        "- [x] done",
        "- [ ] open",
        "",
        "| a | b |",
        "| :-- | --: |",
        "| 1 | 2 |",
        "",
        "```js",
        "const a = 1 < 2;",
        "```",
        "",
        "> quote",
        "",
        "![logo](/img/logo.png)",
      ].join("\n"),
    );
    assert.equal(sanitizeHTML(html).replace(/\s+/g, " "), html.replace(/\s+/g, " "));
  });

  it("keeps harmless inline HTML and its attributes", () => {
    for (const html of [
      '<span class="mono yellow" style="color: red">x</span>',
      '<a id="top" href="#section">jump</a>',
      '<a href="mailto:a@b.c">mail</a>',
      '<img src="data:image/png;base64,AAAA" alt="x" width="10">',
      "<details open><summary>More</summary><p>text</p></details>",
      '<td colspan="2" align="right">x</td>',
      "<kbd>Ctrl</kbd> + <sub>a</sub><sup>b</sup>",
    ]) {
      assert.equal(sanitizeHTML(html), html);
    }
  });

  it("drops scripts, event handlers and script-like elements with their content", () => {
    const cases = {
      "a<script>alert(1)</script>b": "ab",
      "a<SCRIPT src=x></SCRIPT>b": "ab",
      "a<script>never closed": "a",
      "<img src=x onerror=alert(1)>": '<img src="x">',
      '<p onclick="alert(1)" ONMOUSEOVER=alert(1)>x</p>': "<p>x</p>",
      "<style>*{display:none}</style>x": "x",
      '<iframe srcdoc="<script>alert(1)</script>"></iframe>x': "x",
      "<svg><script>alert(1)</script></svg>x": "x",
      "<math><mi xlink:href=javascript:alert(1)>x</mi></math>y": "y",
      "<object data=x></object><embed src=x>y": "y",
      "<textarea></textarea><template><b>x</b></template>y": "y",
      "<!-- <script>alert(1)</script> -->x": "x",
    };
    for (const [input, expected] of Object.entries(cases))
      assert.equal(sanitizeHTML(input), expected, input);
  });

  it("drops tags it does not know and keeps their text", () => {
    assert.equal(sanitizeHTML("<form action=/x><button formaction=/y>go</button></form>"), "go");
    assert.equal(sanitizeHTML("<rapi-doc spec-url=x>t</rapi-doc>"), "t");
    assert.equal(sanitizeHTML("<base href=//evil.example><meta http-equiv=refresh>x"), "x");
    assert.equal(sanitizeHTML('<input type="text" value="x">y'), "y");
    assert.equal(sanitizeHTML("<input onfocus=alert(1) autofocus>y"), "y");
  });

  it("drops unsafe URLs however they are written", () => {
    for (const href of [
      "javascript:alert(1)",
      "JaVaScRiPt:alert(1)",
      " javascript:alert(1)",
      "java&#9;script:alert(1)",
      "java&#x0A;script:alert(1)",
      "&#106;avascript:alert(1)",
      "&#x6a;avascript:alert(1)",
      "javascript&colon;alert(1)",
      "java&Tab;script:alert(1)",
      "vbscript:msgbox(1)",
      "data:text/html,<script>alert(1)</script>",
      "file:///etc/passwd",
    ]) {
      assert.equal(sanitizeHTML(`<a href="${href}">x</a>`), "<a>x</a>", href);
    }
    assert.equal(sanitizeHTML('<img src="javascript:alert(1)">'), "<img>");
    assert.equal(sanitizeHTML('<img src="data:text/html,x">'), "<img>");
    assert.equal(sanitizeHTML('<a href="data:image/png;base64,AA">x</a>'), "<a>x</a>");
    assert.equal(
      sanitizeHTML('<a href="/a?x=1&amp;y=2#z">x</a>'),
      '<a href="/a?x=1&amp;y=2#z">x</a>',
    );
  });

  it("drops a style that loads a resource or runs code, and keeps a plain one", () => {
    assert.equal(sanitizeHTML('<p style="background:url(//evil.example/x)">x</p>'), "<p>x</p>");
    assert.equal(sanitizeHTML('<p style="width:expression(alert(1))">x</p>'), "<p>x</p>");
    assert.equal(sanitizeHTML('<p style="background:u\\rl(x)">x</p>'), "<p>x</p>");
    assert.equal(sanitizeHTML('<p style="color:#f00">x</p>'), '<p style="color:#f00">x</p>');
  });

  it("never lets the markup reach outside its container", () => {
    assert.equal(sanitizeHTML("</div></div><p>x"), "<p>x</p>");
    assert.equal(sanitizeHTML("<b><i>x</b>y"), "<b><i>x</i></b>y");
    assert.equal(sanitizeHTML("<ul><li>a<li>b"), "<ul><li>a<li>b</li></li></ul>");
    assert.equal(
      sanitizeHTML('<a href="x" target="_blank">x</a>'),
      '<a href="x" target="_blank" rel="noopener noreferrer">x</a>',
    );
    assert.equal(sanitizeHTML("a < b and <notatag"), "a &lt; b and &lt;notatag");
    assert.equal(
      sanitizeHTML('<img src=x alt="a"b">'),
      '&lt;img src=x alt="a"b"&gt;'.replace("&gt;", ">"),
    );
    assert.equal(sanitizeHTML(5), "");
    assert.equal(sanitizeMarkup("plain text & more"), "plain text & more");
  });
});

describe("safeUrl", () => {
  it("returns web, mail and relative addresses, and nothing for the rest", () => {
    for (const url of [
      "https://example.com/x",
      "HTTP://example.com",
      "mailto:a@b.c",
      "tel:+123",
      "/docs/x",
      "docs/x?y=z:1",
      "#frag",
      "//cdn.example.com/x",
      "",
    ])
      assert.equal(safeUrl(url), url, url);
    for (const url of [
      "javascript:alert(1)",
      "java\tscript:alert(1)",
      "\u0001javascript:alert(1)",
      "data:text/html,x",
      "data:image/png;base64,AA",
      "blob:https://x/y",
      "vbscript:x",
    ])
      assert.equal(safeUrl(url), "", url);
    assert.equal(safeUrl("data:image/png;base64,AA", { image: true }), "data:image/png;base64,AA");
    assert.equal(safeUrl("data:text/html,x", { image: true }), "");
    assert.equal(safeUrl(undefined), "");
    assert.equal(safeUrl({ toString: () => "javascript:alert(1)" }), "");
  });
});

describe("a pre-rendered <rapi-doc> of a hostile spec", () => {
  it("has none of its scripts, handlers or script links", async () => {
    const spec = {
      openapi: "3.0.0",
      info: {
        title: "T",
        version: "1",
        description:
          "hello <img src=x onerror=alert(1)> <script>alert(2)</script> [x](javascript:alert(3))",
        termsOfService: "javascript:alert(4)",
        contact: { url: "javascript:alert(5)" },
        license: { name: "L", url: "java\tscript:alert(6)" },
      },
      tags: [{ name: "pets", description: "<iframe srcdoc='<script>alert(7)</script>'></iframe>" }],
      paths: {
        "/pets": {
          get: {
            tags: ["pets"],
            summary: "List",
            description: "<a href='javascript:alert(8)'>x</a>",
            externalDocs: { url: "javascript:alert(9)", description: "docs" },
            responses: { 200: { description: "<svg onload=alert(10)></svg>ok" } },
          },
        },
      },
    };
    const html = await renderRapiDoc({ spec, inlineSpec: false });
    assert.doesNotMatch(html, /onerror=|onload=/);
    assert.doesNotMatch(html, /<script>alert/);
    assert.doesNotMatch(html, /href="java\s*script:/i);
    assert.doesNotMatch(html, /<iframe|srcdoc/);
    assert.match(html, /hello <img src="x">/);
  });
});

describe("the serializer reads only Lit's own objects as markup", () => {
  it("gives nothing for spec values shaped like a template, a stylesheet or a directive", async () => {
    const script = "<script>alert(1)</script>";
    for (const forged of [
      { strings: [script], values: [] },
      { strings: [script], values: [], _$litType$: 1 },
      { cssText: script },
      { cssText: script, _$cssResult$: true, strings: [script], values: [] },
      { _$litDirective$: { directiveName: "unsafeHTML" }, values: [script] },
    ]) {
      const spec = {
        openapi: "3.0.0",
        info: { title: "T", version: forged },
        paths: { "/x": { get: { summary: "X", responses: { 200: { description: "ok" } } } } },
      };
      const html = await renderRapiDoc({ spec, inlineSpec: false });
      assert.match(html, /label-overview-version/, "the spec was rendered");
      assert.ok(!html.includes(script), JSON.stringify(forged));
    }
  });
});
