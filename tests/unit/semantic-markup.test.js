import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { renderRapiDoc, renderTemplateToString } from "rapidoc/static";
import { renderLongFormatExamples } from "~/templates/request-params-template";
import { apiCallTemplate } from "~/templates/api-response-template";

const spec = {
  openapi: "3.1.0",
  info: {
    title: "Cosmo Cargo API",
    version: "2.4.0",
    description: "## Getting started\n\nUse the **sandbox** server first.",
  },
  servers: [
    {
      url: "https://{region}.cosmocargo.dev/v1",
      variables: { region: { default: "eu", enum: ["eu", "us"] } },
    },
  ],
  "x-tagGroups": [{ name: "Logistics", tags: ["Shipments"] }],
  tags: [{ name: "Shipments", description: "Create and list shipments" }],
  components: {
    securitySchemes: {
      oauth: {
        type: "oauth2",
        flows: {
          clientCredentials: {
            tokenUrl: "https://auth.cosmocargo.dev/token",
            scopes: { read: "Read access" },
          },
        },
      },
    },
    schemas: { Shipment: { type: "object", properties: { id: { type: "string" } } } },
  },
  paths: {
    "/shipments": {
      get: {
        summary: "List shipments",
        tags: ["Shipments"],
        externalDocs: { url: "https://cosmocargo.dev/docs", description: "Shipment guide" },
        "x-codeSamples": [{ lang: "curl", source: "curl https://eu.cosmocargo.dev/v1/shipments" }],
        parameters: [
          {
            name: "status",
            in: "query",
            schema: { type: "string" },
            examples: {
              transit: {
                value: "in_transit",
                summary: "In transit",
                description: "Shipments **on the way**",
              },
              delivered: {
                value: "delivered",
                summary: "Delivered",
                description: "Completed shipments",
              },
            },
          },
        ],
        callbacks: {
          onDelivered: {
            "{$request.body#/callbackUrl}": {
              post: { responses: { 200: { description: "Acknowledged" } } },
            },
          },
        },
        responses: { 200: { description: "A list of shipments" } },
      },
    },
  },
};

const render = (options) =>
  renderRapiDoc({
    spec,
    outputMode: "html",
    includeStyles: false,
    showComponents: true,
    showSideNav: false,
    ...options,
  });

// [{ level, attrs, text }] for every <h1>..<h6> in document order
function headingsOf(html) {
  return [...html.matchAll(/<h([1-6])\b([^>]*)>([\s\S]*?)<\/h\1>/g)].map((m) => ({
    level: Number(m[1]),
    attrs: m[2],
    text: m[3]
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
  }));
}

function partsOf(html) {
  return new Set(
    [...html.matchAll(/\spart="([^"]*)"/g)].flatMap((m) => m[1].split(/\s+/).filter(Boolean)),
  );
}

describe("Semantic heading markup", () => {
  it("read mode: h1 API title, h2 sections and tags, h3 operations, without skipping levels", async () => {
    const html = await render({ renderStyle: "read" });
    const headings = headingsOf(html);
    const own = headings.filter((h) => h.attrs.includes("rapidoc-heading"));

    assert.equal(headings.filter((h) => h.level === 1).length, 1, "exactly one h1");
    assert.match(own[0].attrs, /id="api-title"/);
    assert.equal(own[0].text, "Cosmo Cargo API 2.4.0");

    const find = (text) => own.find((h) => h.text === text);
    assert.equal(find("API Server")?.level, 2);
    assert.equal(find("Server variables")?.level, 3);
    assert.equal(find("Authentication")?.level, 2);
    assert.equal(find("Logistics")?.level, 2, "tag group");
    assert.equal(find("Shipments")?.level, 2, "tag");
    assert.equal(find("List shipments")?.level, 3, "operation summary");
    assert.equal(find("Code samples")?.level, 4);
    assert.equal(find("Callbacks")?.level, 4);
    assert.equal(find("onDelivered")?.level, 5);

    for (let i = 1; i < own.length; i++) {
      assert.ok(
        own[i].level <= own[i - 1].level + 1,
        `"${own[i].text}" (h${own[i].level}) skips a level after h${own[i - 1].level}`,
      );
    }
  });

  it("focused mode: same outline as read mode (tag h2, operation h3)", async () => {
    const readHtml = await render({ renderStyle: "read" });
    const operationId = readHtml.match(/part="section-operation ([^"]+)"/)[1];
    const headings = headingsOf(
      await render({ renderStyle: "focused", focusedElementId: operationId }),
    );
    assert.deepEqual(
      headings.map((h) => `h${h.level} ${h.text}`),
      ["h2 Shipments", "h3 List shipments", "h4 Code samples", "h4 Callbacks", "h5 onDelivered"],
    );
  });

  it("view mode: tags are h2", async () => {
    const html = await render({ renderStyle: "view" });
    assert.equal(headingsOf(html).find((h) => h.text === "Shipments")?.level, 2);
  });

  it("keeps every existing CSS part and adds heading parts", async () => {
    const parts = partsOf(await render({ renderStyle: "read" }));
    for (const name of [
      "section-overview",
      "section-overview-title",
      "section-servers-title",
      "section-tag-group-title",
      "section-tag-title",
      "label-tag-title",
      "section-operation-summary",
      "section-auth",
      "label-overview-version",
      "section-auth-title",
      "heading",
      "heading-1",
      "heading-2",
      "heading-3",
    ]) {
      assert.ok(parts.has(name), `missing part "${name}"`);
    }
  });

  it("exports every parameter-list part from <api-request> and <api-response>", async () => {
    const html = await render({ renderStyle: "read" });
    const exported = [...html.matchAll(/<api-(request|response)\b[^>]*exportparts="([^"]*)"/g)].map(
      (m) => m[2],
    );
    assert.ok(exported.length > 1, "api-request and api-response have exportparts");
    for (const name of [
      "param-list",
      "param",
      "param-label",
      "param-name",
      "param-type",
      "param-constraint",
      "param-details",
    ]) {
      for (const list of exported)
        assert.match(
          list,
          new RegExp(`(^|[\\s,])${name}:${name}(,|\\s|$)`),
          `exportparts lacks "${name}"`,
        );
    }
  });

  // FILL EXAMPLE has a part of its own, so it can be hidden without the other btn-fill buttons (#1073)
  it("exports btn-fill-example wherever btn-clear is exported", async () => {
    const tryBar = renderTemplateToString(
      apiCallTemplate.call({
        parameters: [{ name: "q" }],
        security: [],
        api_keys: [],
        loading: false,
        responseHeaders: "",
        responseMessage: "",
      }),
    );
    assert.match(
      tryBar,
      /<button[^>]*part="btn btn-outline btn-fill btn-fill-example"[^>]*>\s*FILL EXAMPLE/,
    );
    const html = await render({ renderStyle: "read" });
    const lists = [...html.matchAll(/exportparts="([^"]*)"/g)]
      .map((m) => m[1])
      .filter((list) => /(^|[\s,])btn-clear:btn-clear(,|\s|$)/.test(list));
    assert.ok(lists.length > 0, "some element exports btn-clear");
    for (const list of lists)
      assert.match(list, /(^|[\s,])btn-fill-example:btn-fill-example(,|\s|$)/);
  });

  it("renders authentication and server variables as lists, not tables", async () => {
    const html = await render({ renderStyle: "read" });
    assert.doesNotMatch(html, /class="[^"]*\bm-table\b/);
    assert.match(html, /<ul class="auth-list"[^>]*role="list"/);
    assert.match(html, /<ul class="param-list server-vars"[^>]*role="list"/);
    const parts = partsOf(html);
    for (const name of [
      "auth-list",
      "auth-scheme",
      "auth-flows",
      "param-list",
      "param",
      "param-name",
      "param-input",
    ]) {
      assert.ok(parts.has(name), `missing part "${name}"`);
    }
  });

  it("never nests a block inside <p> or <a>", async () => {
    for (const renderStyle of ["read", "focused"]) {
      const html = await render({ renderStyle, focusedElementId: "get-/shipments" });
      assert.doesNotMatch(
        html,
        /<p\b[^>]*>(?:(?!<\/p>)[\s\S])*?<(?:p|div|h[1-6]|ul|table)\b/,
        `${renderStyle}: block inside <p>`,
      );
      assert.doesNotMatch(
        html,
        /<a\b[^>]*>(?:(?!<\/a>)[\s\S])*?<div\b/,
        `${renderStyle}: <div> inside <a>`,
      );
    }
  });

  it("parameter example descriptions are not wrapped in <p> (marked already emits one)", () => {
    const html = renderTemplateToString(
      renderLongFormatExamples.call(
        { allowTry: "true" },
        [{ value: "x", summary: "X", description: "On **the way**" }],
        "string",
        "status",
      ),
    );
    assert.match(html, /<div class="m-markdown-small"><p>On <strong>the way<\/strong><\/p>/);
    assert.doesNotMatch(html, /<p>\s*<p>/);
  });
});
