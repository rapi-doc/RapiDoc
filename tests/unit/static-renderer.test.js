import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { html, css, nothing } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { guard } from "lit/directives/guard.js";

import {
  renderRapiDoc,
  renderEndpoint,
  renderSchema,
  getSpecNavigation,
  getNavBarHtml,
  getNavFilterHtml,
  bindNavBar,
  getBundledCss,
  getNavCss,
  getThemeTokensCss,
} from "@rapidoc/prerender";
import * as prerender from "@rapidoc/prerender";
import {
  renderTemplateToString,
  escapeHtml,
  resolveSpecInput,
} from "../../packages/rapidoc-prerender/src/internal.js";
import { getMethodBadge } from "../../packages/rapidoc-prerender/src/navigation.js";
import { isInternalOrHidden } from "~/utils/common-utils";

const sampleSpec = {
  openapi: "3.1.0",
  info: {
    title: "Cosmo Cargo API",
    version: "2.4.0",
    description: "Logistics, shipment rates, tracking, and label management.",
    termsOfService: "https://example.com/terms",
    contact: {
      name: "Cosmo Support",
      email: "support@cosmocargo.dev",
      url: "https://cosmocargo.dev",
    },
  },
  servers: [{ url: "https://api.cosmocargo.dev/v1" }],
  "x-tagGroups": [
    {
      name: "Shipment Logistics",
      description: "Shipment operations",
      tags: ["Shipments", "Tracking"],
    },
    {
      name: "Finance",
      tags: ["Billing"],
    },
  ],
  tags: [
    { name: "Shipments", description: "Create and list shipments" },
    { name: "Tracking", description: "Real-time shipment tracking" },
    { name: "Billing", description: "Invoices and payments" },
  ],
  paths: {
    "/v1/shipments": {
      get: {
        summary: "List shipments",
        description: "Returns all registered shipments.",
        operationId: "listShipments",
        tags: ["Shipments"],
        parameters: [
          {
            name: "status",
            in: "query",
            description: "Filter by delivery status",
            schema: { type: "string", enum: ["in_transit", "delivered"] },
          },
        ],
        responses: {
          200: {
            description: "A list of shipments",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Shipment" },
                },
              },
            },
          },
        },
      },
      post: {
        summary: "Create shipment",
        description: "Creates a new shipment order.",
        operationId: "createShipment",
        tags: ["Shipments"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Shipment" },
            },
          },
        },
        responses: {
          201: {
            description: "Shipment created successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Shipment" },
              },
            },
          },
        },
      },
    },
    "/v1/tracking/{trackingNumber}": {
      get: {
        summary: "Get tracking events",
        operationId: "getTracking",
        tags: ["Tracking"],
        parameters: [
          {
            name: "trackingNumber",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Unique tracking identifier",
          },
        ],
        responses: {
          200: {
            description: "Tracking status details",
          },
        },
      },
    },
    "/v1/invoices": {
      get: {
        summary: "List billing invoices",
        operationId: "listInvoices",
        tags: ["Billing"],
        responses: {
          200: {
            description: "List of invoices",
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Shipment: {
        type: "object",
        properties: {
          id: { type: "string", description: "Unique shipment identifier" },
          destination: { type: "string", description: "Destination city or airport" },
          weightKg: { type: "number", minimum: 0, description: "Weight in kilograms" },
          status: { type: "string", enum: ["draft", "booked", "in_transit", "delivered"] },
        },
        required: ["id", "destination"],
      },
    },
  },
};

describe("Isomorphic Template Serializer (renderTemplateToString)", () => {
  it("should serialize simple strings, numbers, and nullish values", () => {
    assert.equal(renderTemplateToString("hello"), "hello");
    assert.equal(renderTemplateToString(42), "42");
    assert.equal(renderTemplateToString(null), "");
    assert.equal(renderTemplateToString(undefined), "");
    assert.equal(renderTemplateToString(false), "");
  });

  it("should strip event listener expressions (@click, @change, @input)", () => {
    const t = html`<button @click="${() => {}}" @mouseenter="${() => {}}" class="btn">Click Me</button>`;
    const output = renderTemplateToString(t);
    assert.ok(!output.includes("@click"), "Should not contain @click");
    assert.ok(!output.includes("@mouseenter"), "Should not contain @mouseenter");
    assert.ok(output.includes('class="btn"'), "Should retain standard attributes");
    assert.ok(output.includes("Click Me"), "Should retain text content");
  });

  it("should strip property bindings (.config, .data)", () => {
    const t = html`<div .config="${{ a: 1 }}" .customData="${"test"}" id="main">Content</div>`;
    const output = renderTemplateToString(t);
    assert.ok(!output.includes(".config"), "Should not contain .config");
    assert.ok(!output.includes(".customData"), "Should not contain .customData");
    assert.ok(output.includes('id="main"'), "Should retain id");
    assert.ok(output.includes("Content"), "Should retain inner text");
  });

  it("should properly handle boolean attributes (?disabled, ?hidden)", () => {
    const t1 = html`<input ?disabled="${true}" ?required="${"true"}" type="text" />`;
    const output1 = renderTemplateToString(t1);
    assert.ok(output1.includes("disabled"), "Should include disabled attribute when truthy");
    assert.ok(output1.includes("required"), "Should include required attribute when truthy");
    assert.ok(!output1.includes("?disabled"), "Should not have leading ?");

    const t2 = html`<input ?disabled="${false}" ?readonly="${null}" type="text" />`;
    const output2 = renderTemplateToString(t2);
    assert.ok(!output2.includes("disabled"), "Should omit disabled attribute when falsy");
    assert.ok(!output2.includes("readonly"), "Should omit readonly attribute when null");
  });

  it("should resolve unsafeHTML directive without escaping", () => {
    const t = html`<div>${unsafeHTML("<strong>Raw <em>Markup</em></strong>")}</div>`;
    const output = renderTemplateToString(t);
    assert.ok(output.includes("<strong>Raw <em>Markup</em></strong>"));
  });

  it("should handle ifDefined and guard directives", () => {
    const t = html`
      <div>
        <span class="${ifDefined("active")}">Defined</span>
        <span id="${ifDefined(undefined)}">Undefined</span>
        ${guard([1], () => html`<p>Guarded Content</p>`)}
      </div>
    `;
    const output = renderTemplateToString(t);
    assert.ok(output.includes('class="active"'));
    assert.ok(
      output.includes("<span>Undefined</span>"),
      "ifDefined(undefined) should omit the attribute",
    );
    assert.ok(output.includes("<p>Guarded Content</p>"));
  });

  it("should omit attributes whose whole value is nothing, as Lit does", () => {
    // prettier-ignore
    const t = html`<img src="${ifDefined(undefined)}" alt='${nothing}' title=${nothing} class="c">`;
    assert.equal(renderTemplateToString(t), '<img class="c">');
  });

  it("should resolve CSSResult objects to cssText", () => {
    const styles = css`
      .card {
        padding: 12px;
        color: red;
      }
    `;
    const output = renderTemplateToString(styles);
    assert.ok(output.includes(".card"));
    assert.ok(output.includes("padding: 12px;"));
  });

  it("escapeHtml should properly escape HTML special characters", () => {
    assert.equal(
      escapeHtml('<script>alert("xss")&\'</script>'),
      "&lt;script&gt;alert(&quot;xss&quot;)&amp;&#39;&lt;/script&gt;",
    );
  });

  it("should escape strings bound in text nodes, like Lit does in the browser", () => {
    const t = html`<p>${"<img src=x onerror=alert(1)> & \"quoted\" 'single'"}</p>`;
    assert.equal(
      renderTemplateToString(t),
      "<p>&lt;img src=x onerror=alert(1)&gt; &amp; \"quoted\" 'single'</p>",
    );
  });

  it("should escape top-level strings and strings inside arrays", () => {
    assert.equal(renderTemplateToString("<b>bold</b>"), "&lt;b&gt;bold&lt;/b&gt;");
    // prettier-ignore
    const t = html`<ul>${['<li>a</li>', html`<li>${'b & c'}</li>`]}</ul>`;
    assert.equal(renderTemplateToString(t), "<ul>&lt;li&gt;a&lt;/li&gt;<li>b &amp; c</li></ul>");
  });

  it("should escape quotes and markup in quoted attribute values", () => {
    // prettier-ignore
    const t = html`<span title="${'a" onmouseover="alert(1)'}" data-x='${"b' onclick='alert(1)"}' class="tag ${'<x> & y'}">ok</span>`;
    assert.equal(
      renderTemplateToString(t),
      '<span title="a&quot; onmouseover=&quot;alert(1)" data-x=\'b&#39; onclick=&#39;alert(1)\' class="tag &lt;x&gt; &amp; y">ok</span>',
    );
  });

  it("should quote unquoted attribute bindings so values cannot add attributes", () => {
    const value = "x onmouseover=alert(1)";
    const t = html`<option label=${value} value=${value}></option>`;
    assert.equal(
      renderTemplateToString(t),
      '<option label="x onmouseover=alert(1)" value="x onmouseover=alert(1)"></option>',
    );
  });

  it("should leave unsafeHTML markup unescaped", () => {
    const t = html`<div title="${"<t>"}">${unsafeHTML('<a href="#x">link & more</a>')}${"<b>"}</div>`;
    assert.equal(
      renderTemplateToString(t),
      '<div title="&lt;t&gt;"><a href="#x">link & more</a>&lt;b&gt;</div>',
    );
  });

  it("should leave nested templates unescaped while escaping their own bindings", () => {
    const inner = html`<em class="${'"q"'}">${"1 < 2"}</em>`;
    const t = html`<p>${inner}<span>${html`<strong>${"&"}</strong>`}</span></p>`;
    assert.equal(
      renderTemplateToString(t),
      '<p><em class="&quot;q&quot;">1 &lt; 2</em><span><strong>&amp;</strong></span></p>',
    );
  });

  it("should escape values returned from guard directives", () => {
    const t = html`<div>${guard([1], () => "<script>x</script>")}</div>`;
    assert.equal(renderTemplateToString(t), "<div>&lt;script&gt;x&lt;/script&gt;</div>");
  });

  it("should not escape CSSResult text", () => {
    const styles = css`
      .a > .b::after {
        content: '&';
      }
    `;
    const output = renderTemplateToString(
      html`<style>
        ${styles}
      </style>`,
    );
    assert.ok(output.includes(".a > .b::after"));
    assert.ok(output.includes("content: '&';"));
  });
});

describe("Static Document Pre-Rendering (renderRapiDoc)", () => {
  it("should render Declarative Shadow DOM (DSD) format by default", async () => {
    const htmlOutput = await renderRapiDoc({
      spec: sampleSpec,
      renderStyle: "read",
      theme: "ember",
      colorScheme: "dark",
    });

    assert.ok(htmlOutput.startsWith("<rapi-doc"), "Must wrap in <rapi-doc>");
    assert.ok(
      htmlOutput.includes('<template shadowrootmode="open">'),
      'Must declare shadowrootmode="open"',
    );
    assert.ok(htmlOutput.includes("<style>"), "Must include <style> block");
    assert.ok(htmlOutput.includes("Cosmo Cargo API"), "Must include API title");
    assert.ok(htmlOutput.includes("Shipment Logistics"), "Must render 3-tier tagGroup heading");
    assert.ok(htmlOutput.includes("</template>"), "Must close template");
    assert.ok(htmlOutput.endsWith("</rapi-doc>"), "Must close <rapi-doc>");
  });

  it('should render Light DOM format when outputMode is "html" or "light"', async () => {
    const htmlOutput = await renderRapiDoc({
      spec: sampleSpec,
      renderStyle: "view",
      theme: "cobalt",
      colorScheme: "light",
      outputMode: "html",
    });

    assert.ok(!htmlOutput.includes("<rapi-doc"), "Should not use <rapi-doc> in Light DOM mode");
    assert.ok(
      !htmlOutput.includes("shadowrootmode"),
      "Should not use shadowrootmode in Light DOM mode",
    );
    assert.ok(
      htmlOutput.includes('class="rapidoc-prerender-container"'),
      "Should wrap in rapidoc-prerender-container",
    );
    assert.ok(htmlOutput.includes('data-theme="cobalt"'), "Should preserve theme attribute");
    assert.ok(htmlOutput.includes("Cosmo Cargo API"), "Should render title");
  });

  it("should load and render spec from a local file path", async () => {
    const htmlOutput = await renderRapiDoc({
      spec: "./sites/rapidoc/public/specs/petstore.json",
      renderStyle: "read",
      theme: "jade",
    });

    assert.ok(htmlOutput.includes("Swagger Petstore"), "Should load and render local JSON spec");
    assert.ok(htmlOutput.includes('shadowrootmode="open"'));
  });

  it("writes only the options the caller passed as attributes, and renders the rest with <rapi-doc>'s defaults", async () => {
    const byDefault = await renderRapiDoc({ spec: sampleSpec });
    assert.ok(
      byDefault.startsWith("<rapi-doc>"),
      "no attribute without an option: the element's own defaults apply",
    );
    // ...and the HTML is rendered with those defaults, so the element changes nothing on taking over
    assert.ok(byDefault.includes('schema-style="tree"'), "schemas as trees, as the element");
    assert.ok(!byDefault.includes('schema-style="table"'));
    assert.ok(byDefault.includes("advanced-search-dialog"), "advanced search on, as the element");

    const withOptions = await renderRapiDoc({
      spec: sampleSpec,
      schemaStyle: "table",
      layout: "column",
      allowAdvancedSearch: false,
      includeStyles: false,
      inlineSpec: false,
    });
    assert.ok(
      withOptions.startsWith(
        '<rapi-doc schema-style="table" layout="column" allow-advanced-search="false">',
      ),
      "the options passed, and not includeStyles or inlineSpec, which are not attributes",
    );
    assert.ok(!withOptions.includes('schema-style="tree"'));
    assert.ok(!withOptions.includes("advanced-search-dialog"));

    const light = await renderRapiDoc({ spec: sampleSpec, outputMode: "light" });
    assert.ok(light.includes('data-layout="row"') && light.includes('data-schema-style="tree"'));
  });

  it("should serialize customized options onto <rapi-doc> tag and reflect them in static shadow DOM", async () => {
    const htmlOutput = await renderRapiDoc({
      spec: sampleSpec,
      schemaStyle: "tree",
      allowTry: false,
      showHeader: false,
      showSideNav: false,
      allowSearch: false,
      theme: "indigo",
      colorScheme: "light",
    });

    const openingTagMatch = htmlOutput.match(/<rapi-doc\s+([^>]+)>/);
    assert.ok(openingTagMatch);
    const attrs = openingTagMatch[1];

    assert.ok(attrs.includes('schema-style="tree"'), "Must serialize customized schema-style");
    assert.ok(attrs.includes('allow-try="false"'), 'Must serialize customized allow-try="false"');
    assert.ok(attrs.includes('show-header="false"'), 'Must serialize show-header="false"');
    assert.ok(attrs.includes('show-side-nav="false"'), 'Must serialize show-side-nav="false"');
    assert.ok(attrs.includes('allow-search="false"'), 'Must serialize allow-search="false"');
    assert.ok(attrs.includes('theme="indigo"'), 'Must serialize theme="indigo"');
    assert.ok(attrs.includes('color-scheme="light"'), 'Must serialize color-scheme="light"');

    // Also verify that the static shadow DOM reflects these disabled features
    assert.ok(
      !htmlOutput.includes('class="header"'),
      "Header markup must be omitted when showHeader is false",
    );
    assert.ok(
      !htmlOutput.includes('class="nav-bar'),
      "Navbar markup must be omitted when showSideNav is false",
    );
  });

  it('keeps the navbar markup with showSideNav "floating" and marks the body for it', async () => {
    const htmlOutput = await renderRapiDoc({
      spec: sampleSpec,
      renderStyle: "focused",
      showSideNav: "floating",
    });
    const attrs = htmlOutput.match(/<rapi-doc\s+([^>]+)>/)[1];
    assert.ok(
      attrs.includes('show-side-nav="floating"'),
      'Must serialize show-side-nav="floating"',
    );
    assert.ok(htmlOutput.includes('id="nav-bar-btn"'), "The menu button is rendered");
    assert.ok(htmlOutput.includes('class="nav-bar '), "The navbar is rendered");
    assert.ok(
      /id="the-main-body" class="body nav-floating /.test(htmlOutput),
      "The body is marked",
    );
  });

  it("should support both camelCase and kebab-case options and forward custom RapiDoc attributes", async () => {
    const specWithComponents = {
      ...sampleSpec,
      components: {
        schemas: {
          ShipmentRecord: {
            type: "object",
            properties: {
              id: { type: "string" },
            },
          },
        },
      },
    };

    const htmlOutput = await renderRapiDoc({
      spec: specWithComponents,
      "schema-style": "tree",
      "allow-try": false,
      showMethodInNavBar: "as-colored-block",
      usePathInNavBar: true,
      "nav-item-spacing": "relaxed",
      showComponents: true,
      headingText: "Logistics API Gateway",
    });

    const openingTagMatch = htmlOutput.match(/<rapi-doc\s+([^>]+)>/);
    assert.ok(openingTagMatch);
    const attrs = openingTagMatch[1];

    assert.ok(attrs.includes('schema-style="tree"'), "Supports kebab-case schema-style");
    assert.ok(attrs.includes('allow-try="false"'), "Supports kebab-case allow-try");
    assert.ok(
      attrs.includes('show-method-in-nav-bar="as-colored-block"'),
      "Forwards showMethodInNavBar to kebab-case",
    );
    assert.ok(attrs.includes('use-path-in-nav-bar="true"'), "Forwards usePathInNavBar");
    assert.ok(attrs.includes('nav-item-spacing="relaxed"'), "Forwards nav-item-spacing");
    assert.ok(
      attrs.includes('show-components="true"'),
      "Forwards showComponents as string boolean",
    );
    assert.ok(attrs.includes('heading-text="Logistics API Gateway"'), "Forwards headingText");

    // Verify template context picked up custom properties during SSR
    assert.ok(
      htmlOutput.includes("nav-method as-colored-block"),
      "Template rendered with custom navbar method style",
    );
    assert.ok(
      htmlOutput.includes("Logistics API Gateway"),
      "Template rendered headingText in header-title",
    );
    assert.ok(
      htmlOutput.includes("ShipmentRecord"),
      "Template rendered components section when showComponents: true",
    );
  });

  it("should serialize spec-url and spec processing options onto <rapi-doc> tag", async () => {
    const remoteUrl = "https://api.cosmocargo.dev/v2/openapi.json";
    const htmlOutput = await renderRapiDoc({
      spec: sampleSpec,
      specUrl: remoteUrl,
      sortEndpointsBy: "method",
      serverUrl: "https://staging.cosmocargo.dev",
      filterOperations: "/v1/shipments/**",
    });

    const openingTagMatch = htmlOutput.match(/<rapi-doc\s+([^>]+)>/);
    assert.ok(openingTagMatch);
    const attrs = openingTagMatch[1];

    assert.ok(attrs.includes(`spec-url="${remoteUrl}"`), "Must serialize spec-url");
    assert.ok(attrs.includes('sort-endpoints-by="method"'), "Must serialize sort-endpoints-by");
    assert.ok(
      attrs.includes('server-url="https://staging.cosmocargo.dev"'),
      "Must serialize server-url",
    );
    assert.ok(
      attrs.includes('filter-operations="/v1/shipments/**"'),
      "Must serialize filter-operations",
    );
  });
});

describe("Static rendering of untrusted spec text", () => {
  const payload = "<img src=x onerror=alert(1)>";
  const xssSpec = {
    openapi: "3.1.0",
    info: { title: `Title ${payload}`, version: "1.0.0" },
    servers: [
      {
        url: "https://{env}.example.com",
        variables: { env: { default: "api", enum: ["api", "x onmouseover=alert(1)"] } },
      },
    ],
    paths: {
      "/items": {
        get: {
          summary: payload,
          operationId: "listItems",
          tags: ["Items"],
          parameters: [
            { name: `q${payload}`, in: "query", schema: { type: "string", enum: [payload] } },
          ],
          responses: { 200: { description: "OK" } },
        },
      },
    },
  };

  for (const outputMode of ["dsd", "html"]) {
    for (const renderStyle of ["read", "view", "focused"]) {
      it(`should escape an HTML summary in ${renderStyle} mode (${outputMode})`, async () => {
        const rendered = await renderRapiDoc({
          spec: xssSpec,
          renderStyle,
          outputMode,
          includeStyles: false,
        });
        // The DSD output inlines the raw spec as JSON in a non-executable <script type="application/json">; check only the markup
        const htmlOutput = rendered.replace(
          /<script type="application\/json"[^>]*>[\s\S]*?<\/script>/g,
          "",
        );
        assert.ok(
          !htmlOutput.includes("<img src=x"),
          "Raw <img> from the spec must not reach the output",
        );
        assert.ok(
          htmlOutput.includes("&lt;img src=x onerror=alert(1)&gt;"),
          "Summary text should be HTML-escaped",
        );
        for (const option of htmlOutput.match(/<option[^>]*>/g) || []) {
          assert.match(
            option,
            /^<option( selected)? label="[^"]*" value="[^"]*">$/,
            "Server variable enum must stay inside quoted attributes",
          );
        }
      });
    }
  }

  it("should inline the DSD spec JSON with every < escaped, so it cannot end or alter the script block", async () => {
    const tricky = "</script><!--<script>alert(1)</script>-->";
    const spec = { ...xssSpec, info: { ...xssSpec.info, description: tricky } };
    const rendered = await renderRapiDoc({ spec, includeStyles: false });
    const match = rendered.match(
      /<script type="application\/json" slot="rapidoc-spec">([\s\S]*?)<\/script>/,
    );
    assert.ok(match, "Inline spec script should be present");
    assert.ok(!match[1].includes("<"), "Inline JSON must not contain a raw <");
    assert.deepEqual(
      JSON.parse(match[1]),
      spec,
      "Inline JSON should parse back to the original spec",
    );
  });

  it("should escape an HTML summary in renderEndpoint output", async () => {
    const htmlOutput = await renderEndpoint({
      spec: xssSpec,
      method: "get",
      path: "/items",
      includeStyles: false,
    });
    assert.ok(!htmlOutput.includes("<img src=x"));
    assert.ok(htmlOutput.includes("&lt;img src=x onerror=alert(1)&gt;"));
  });
});

describe("Static Isolated Endpoint Pre-Rendering (renderEndpoint)", () => {
  it("should render an isolated endpoint card with parameters and path", async () => {
    const htmlOutput = await renderEndpoint({
      spec: sampleSpec,
      path: "/v1/shipments",
      method: "get",
      theme: "indigo",
    });

    assert.ok(
      htmlOutput.includes("rapidoc-endpoint-container"),
      "Should wrap in endpoint container",
    );
    assert.ok(htmlOutput.includes("/v1/shipments"), "Should display path");
    assert.ok(htmlOutput.includes("List shipments"), "Should display summary");
    assert.ok(htmlOutput.includes("status"), "Should display query parameter name");
  });

  it("should be case-insensitive for HTTP methods", async () => {
    const htmlOutput = await renderEndpoint({
      spec: sampleSpec,
      path: "/v1/tracking/{trackingNumber}",
      method: "GET",
    });

    assert.ok(htmlOutput.includes("/v1/tracking/{trackingNumber}"));
    assert.ok(htmlOutput.includes("Get tracking events"));
    assert.ok(htmlOutput.includes("trackingNumber"));
  });

  it("should throw descriptive error when endpoint is not found in spec", async () => {
    await assert.rejects(async () => {
      await renderEndpoint({
        spec: sampleSpec,
        path: "/nonexistent/path",
        method: "delete",
      });
    }, /Endpoint not found in spec/);
  });
});

describe("Static Schema Pre-Rendering (renderSchema)", () => {
  it("should render schema in table format with column headers and fields", async () => {
    const htmlOutput = await renderSchema({
      schema: sampleSpec.components.schemas.Shipment,
      schemaStyle: "table",
      theme: "carbon",
    });

    assert.ok(htmlOutput.includes("rapidoc-schema-container"));
    assert.ok(htmlOutput.includes("Field"));
    assert.ok(htmlOutput.includes("Type"));
    assert.ok(htmlOutput.includes("Description"));
    assert.ok(htmlOutput.includes("destination"));
    assert.ok(htmlOutput.includes("weightKg"));
  });

  it("should render schema in tree format", async () => {
    const htmlOutput = await renderSchema({
      schema: sampleSpec.components.schemas.Shipment,
      schemaStyle: "tree",
      theme: "ember",
    });

    assert.ok(htmlOutput.includes("rapidoc-schema-container"));
    assert.ok(htmlOutput.includes("destination"));
    assert.ok(htmlOutput.includes("weightKg"));
  });

  it("should resolve named schema from spec.components.schemas", async () => {
    const htmlOutput = await renderSchema({
      spec: sampleSpec,
      schema: "Shipment",
      "schema-style": "table",
    });

    assert.ok(htmlOutput.includes("destination"));
    assert.ok(htmlOutput.includes("Unique shipment identifier"));
  });
});

describe("Navigation & Styling Helpers (getSpecNavigation, getBundledCss)", () => {
  it("getSpecNavigation should extract 3-level navigation hierarchy when x-tagGroups is defined", async () => {
    const nav = await getSpecNavigation(sampleSpec);

    assert.equal(nav.title, "Cosmo Cargo API");
    assert.equal(nav.version, "2.4.0");
    assert.equal(nav.tagGroups.length, 2, "Should have 2 tag groups");

    const shipmentGroup = nav.tagGroups.find((g) => g.name === "Shipment Logistics");
    assert.ok(shipmentGroup, "Should find Shipment Logistics group");
    assert.equal(shipmentGroup.tags.length, 2, "Should have 2 tags under Shipment Logistics");

    const shipmentsTag = shipmentGroup.tags.find((t) => t.name === "Shipments");
    assert.ok(shipmentsTag, "Should have Shipments tag");
    assert.equal(shipmentsTag.paths.length, 2, "Should have 2 operations under Shipments");
    assert.equal(shipmentsTag.paths[0].method, "get");
    assert.equal(shipmentsTag.paths[0].path, "/v1/shipments");
  });

  it("getBundledCss should return valid CSS and support Light DOM scoping", () => {
    const shadowCss = getBundledCss();
    assert.ok(shadowCss.includes(":host"));
    assert.ok(shadowCss.includes(".main-content"));

    const lightCss = getBundledCss({ scope: ".my-portal" });
    assert.ok(!lightCss.includes(":host {"));
    assert.ok(lightCss.includes(".my-portal"));
  });

  it("getMethodBadge should format 3-character badges matching core RapiDoc", () => {
    assert.equal(getMethodBadge("delete"), "DEL");
    assert.equal(getMethodBadge("post"), "POS");
    assert.equal(getMethodBadge("get"), "GET");
    assert.equal(getMethodBadge("put"), "PUT");
    assert.equal(getMethodBadge("patch"), "PAT");
    assert.equal(getMethodBadge("get", "full"), "GET");
    assert.equal(getMethodBadge("delete", "full"), "DELETE");
  });

  it("getNavBarHtml and renderNavBarHtml should serialize matching 3-tier HTML directly from spec", async () => {
    const html = await getNavBarHtml(sampleSpec, {
      basePath: "/apis/shipments",
      activeHref: "/apis/shipments#shipments--list-shipments",
    });

    assert.ok(html.includes('class="nav-bar-tag-group expanded"'));
    assert.ok(html.includes('class="nav-bar-tag-group-header nav-bar-section-label"'));
    assert.ok(!html.includes('data-action="expand-collapse-tag-group"'), "a tag group is a label");
    assert.ok(!html.includes("tags-as-labels"), "with tag groups, the tags are rows");
    assert.ok(
      html.includes(
        '<div class="nav-bar-section-label" part="section-navbar-label">Overview</div>',
      ),
    );
    assert.ok(html.includes('<svg class="nav-bar-icon" part="section-navbar-icon"'));
    assert.ok(html.includes('class="nav-bar-tag-and-paths expanded"'));
    assert.ok(html.includes('class="nav-bar-tag"'));
    assert.ok(html.includes('class="nav-bar-paths-under-tag"'));
    assert.ok(html.includes('class="nav-bar-path active"'));
    assert.ok(html.includes('class="nav-method as-colored-text get"'));
    assert.ok(html.includes(">GET</span>"));
    assert.ok(html.includes('href="/apis/shipments#overview"'));
    assert.ok(html.includes('href="/apis/shipments#shipments--list-shipments"'));
    assert.ok(html.includes("Shipment Logistics"));
    assert.ok(html.includes("Shipments"));

    assert.ok(html.includes('class="nav-bar-search-input portal-filter-input"'));
    assert.ok(
      html.includes('<svg class="nav-bar-search-icon"'),
      "the filter icon is a single-colour SVG",
    );
    assert.ok(!html.includes("🔍"), "not the colour emoji");
    assert.ok(
      !html.includes('id="advanced-search-btn"'),
      "Must not render redundant advanced-search-btn",
    );

    // Multi-page Tag Mode: routingMode: 'tag-pages'
    const tagPagesHtml = await getNavBarHtml(sampleSpec, {
      basePath: "/apis/shipments",
      routingMode: "tag-pages",
    });
    assert.ok(tagPagesHtml.includes('href="/apis/shipments/shipments#list-shipments"'));
  });

  it("getNavBarHtml makes a tag's name a link to the tag and its arrow a button beside it", async () => {
    const html = await getNavBarHtml(sampleSpec, {
      basePath: "/apis/shipments",
      routingMode: "tag-pages",
      activeHref: "/apis/shipments/shipments",
    });
    const row = html.match(/<div\s+class="nav-bar-tag[ "][\s\S]*?<\/div>/)?.[0] ?? "";
    assert.match(row, /class="nav-bar-tag active"/);
    // the row itself is not a control: the link and the button are, side by side
    assert.doesNotMatch(row.slice(0, row.indexOf(">")), /data-action|tabindex|role=/);
    assert.match(
      row,
      /<a\s+href="\/apis\/shipments\/shipments"\s+id="link-tag--shipments"\s+class="nav-bar-tag-title"\s+aria-current="true"\s+data-action="navigate"\s+data-content-id="tag--shipments"\s*>Shipments<\/a>/,
    );
    assert.match(
      row,
      /<button\s+type="button"\s+class="nav-bar-tag-icon"[^>]*aria-expanded="true"[^>]*data-action="expand-collapse-tag"\s*><\/button>/,
    );
    // no focusable element is a div, and only the current item is marked as current
    assert.doesNotMatch(html, /<div[^>]*tabindex="0"/);
    assert.equal(html.match(/aria-current=/g)?.length, 1);
  });

  it("renderNavBarHtml should show methods and paths as <rapi-doc> does (show-method-in-nav-bar, use-path-in-nav-bar)", async () => {
    const nav = (options) => getNavBarHtml(sampleSpec, { basePath: "/apis/shipments", ...options });

    const byDefault = await nav({});
    assert.ok(
      byDefault.includes('<span class="nav-method as-colored-text get">GET</span>'),
      "default: colored text",
    );
    assert.match(
      byDefault,
      /<span class="nav-method [^"]*">GET<\/span>\s*<span class="nav-bar-path-label">/,
      "the method leads the row",
    );
    const block = await nav({ showMethodInNavBar: "as-colored-block" });
    assert.ok(block.includes('<span class="nav-method as-colored-block get">GET</span>'));

    const text = await nav({ "show-method-in-nav-bar": "as-colored-text" });
    assert.ok(text.includes('<span class="nav-method as-colored-text get">GET</span>'));
    const plain = await nav({ showMethodInNavBar: "as-plain-text" });
    assert.ok(plain.includes('<span class="nav-method as-plain-text get">GET</span>'));
    const hidden = await nav({ showMethodInNavBar: "false" });
    assert.ok(!hidden.includes('class="nav-method'), "false: no method at all");
    const unknown = await nav({ showMethodInNavBar: "as-rainbow" });
    assert.ok(
      unknown.includes('class="nav-method as-colored-text get"'),
      "an unknown value falls back to the default",
    );

    const paths = await nav({ "use-path-in-nav-bar": "true" });
    assert.ok(
      paths.includes(
        '<span class="nav-bar-path-label"><span class="mono-font">/v1/shipments</span></span>',
      ),
    );
    assert.ok(!(await nav({ usePathInNavBar: "false" })).includes('class="mono-font"'));
  });

  it("getNavFilterHtml should generate clean dedicated filter header without search modal button", () => {
    const filterHtml = getNavFilterHtml({ searchPlaceholder: "Search APIs..." });
    assert.ok(filterHtml.includes('class="nav-bar-header"'));
    assert.ok(filterHtml.includes('placeholder="Search APIs..."'));
    assert.ok(filterHtml.includes("portal-filter-input"));
    assert.ok(!filterHtml.includes("advanced-search-btn"));
  });

  it("isInternalOrHidden should correctly identify internal or hidden operations and tags", () => {
    assert.equal(isInternalOrHidden({ "x-internal": true }), true);
    assert.equal(isInternalOrHidden({ "x-hidden": true }), true);
    assert.equal(isInternalOrHidden({ xInternal: true }), true);
    assert.equal(isInternalOrHidden({ xHidden: "true" }), true);
    assert.equal(isInternalOrHidden({ rawOperation: { "x-internal": true } }), true);
    assert.equal(isInternalOrHidden({ summary: "Public Endpoint" }), false);
    assert.equal(isInternalOrHidden(null), false);
  });

  it("bindNavBar should be exported as a callable binding function", () => {
    assert.equal(typeof bindNavBar, "function");
  });

  it("getNavCss should return complete scoped navigation styles including method badges", () => {
    const navCss = getNavCss(".portal-sidebar");
    assert.ok(navCss.includes(".portal-sidebar {"));
    assert.ok(navCss.includes(".nav-bar-path"));
    assert.ok(navCss.includes(".nav-bar-tag-group"));
    assert.ok(navCss.includes(".nav-method.as-colored-block"));
    assert.ok(navCss.includes(".nav-method.as-colored-block.delete"));
  });

  it("getThemeTokensCss should return adapted design system tokens for portal light and dark modes", () => {
    const emberTokens = getThemeTokensCss("ember");
    assert.ok(emberTokens.includes("[data-theme='light']"));
    assert.ok(emberTokens.includes("[data-theme='dark']"));
    assert.ok(emberTokens.includes("--primary: #f76b39;"));

    const cobaltTokens = getThemeTokensCss("cobalt");
    assert.ok(cobaltTokens.includes("--primary: #7aa2d6;"));
    assert.ok(cobaltTokens.includes("--primary: #3a6cb0;"));
  });
});

describe("Light DOM scoping of :host selectors (getBundledCss, getNavCss)", () => {
  it("rewrites :host(:not([x])...) whole, keeping the nested parentheses", () => {
    const bundled = getBundledCss({ scope: ".api-docs" });
    assert.ok(
      bundled.includes(".api-docs:not([theme])[color-scheme='light']"),
      "the default preset's light selector keeps its attribute after :not()",
    );
    assert.ok(!bundled.includes(":not([theme][color-scheme"), "no attribute swallowed into :not()");
    assert.ok(!bundled.includes("]))"), "no stray closing parenthesis");
    assert.ok(bundled.includes(".api-docs:not([nav-item-overflow]) :is(.nav-bar-tag-group-title"));

    const nav = getNavCss(".api-nav");
    assert.ok(nav.includes(".api-nav:not([nav-item-overflow]) :is(.nav-bar-tag-group-title"));
    assert.ok(!nav.includes("]))"), "no stray closing parenthesis in the nav css");
  });

  it("escapes theme and colorScheme in the endpoint and schema containers", async () => {
    const theme = '"><script>alert(1)</script>';
    const endpoint = await renderEndpoint({
      spec: sampleSpec,
      path: "/v1/shipments",
      method: "get",
      theme,
      colorScheme: theme,
      includeStyles: false,
    });
    const schema = await renderSchema({
      schema: { type: "string" },
      theme,
      colorScheme: theme,
      includeStyles: false,
    });
    for (const out of [endpoint, schema]) {
      assert.ok(!out.includes("<script>alert(1)</script>"), "no raw markup from the theme");
      assert.ok(out.includes('data-theme="&quot;&gt;&lt;script&gt;'));
    }
  });

  it("rejects an option name a function does not know, listing the valid ones", async () => {
    const endpoint = { spec: sampleSpec, path: "/v1/shipments", method: "get" };
    const schema = { schema: { type: "string" } };
    for (const [call, pattern] of [
      [
        () => getNavBarHtml(sampleSpec, { usePathInNav: true }),
        /getNavBarHtml\(\): unknown option "usePathInNav"\. Valid options: .*usePathInNavBar/,
      ],
      [
        () => getNavBarHtml(sampleSpec, { "routing-mode": "tag-pages" }),
        /unknown option "routing-mode"/,
      ],
      [
        () => getSpecNavigation(sampleSpec, { apiKey: "x" }),
        /getSpecNavigation\(\): unknown option "apiKey".*apiKeyName/,
      ],
      [
        () => renderEndpoint({ ...endpoint, schemStyle: "tree" }),
        /renderEndpoint\(\): unknown option "schemStyle"/,
      ],
      [
        () => renderSchema({ ...schema, style: "tree" }),
        /renderSchema\(\): unknown option "style".*schemaStyle/,
      ],
      [
        () => renderRapiDoc({ spec: sampleSpec, "output-mode": "light" }),
        /unknown option "output-mode"/,
      ],
      [
        () =>
          renderRapiDoc({
            spec: sampleSpec,
            "render-style": "read",
            renderStyle: "view",
          }),
        /"renderStyle" is given twice/,
      ],
    ]) {
      await assert.rejects(async () => call(), pattern);
    }
    assert.throws(() => getNavFilterHtml({ placeholder: "Find" }), /unknown option "placeholder"/);
    assert.throws(
      () => getBundledCss({ theme: "ember" }),
      /getBundledCss\(\): unknown option "theme"/,
    );
  });

  it("accepts the kebab-case name of every option that is an attribute of <rapi-doc>, in every function", async () => {
    const endpoint = await renderEndpoint({
      spec: sampleSpec,
      path: "/v1/shipments",
      method: "get",
      "schema-style": "tree",
      "color-scheme": "light",
      "render-style": "view",
      includeStyles: false,
    });
    assert.ok(endpoint.includes('data-color-scheme="light"') && endpoint.includes("view-mode"));
    const schema = await renderSchema({
      schema: sampleSpec.components.schemas.Shipment,
      "schema-style": "tree",
      "schema-expand-level": 1,
      includeStyles: false,
    });
    assert.ok(!schema.includes("Field"), "tree, not the table with its column headers");
    const sorted = await getSpecNavigation(sampleSpec, { "sort-tags": "true" });
    assert.deepEqual(
      sorted.tags.map((t) => t.name),
      sorted.tags.map((t) => t.name).sort(),
    );
    const nav = await getNavBarHtml(sampleSpec, { "use-path-in-nav-bar": true, sortTags: true });
    assert.ok(nav.includes('class="mono-font"'));
    // renderRapiDoc passes any other attribute of <rapi-doc> on to the element
    const doc = await renderRapiDoc({
      spec: sampleSpec,
      "use-path-in-nav-bar": "true",
      gotoPath: "x",
    });
    assert.ok(doc.startsWith('<rapi-doc use-path-in-nav-bar="true" goto-path="x">'));
  });

  it("gives every sidebar link one form, with or without a closing slash on basePath", async () => {
    const hrefs = async (options) =>
      [...(await getNavBarHtml(sampleSpec, options)).matchAll(/href="([^"]+)"/g)]
        .map((m) => m[1])
        .sort();
    for (const routingMode of ["single-page", "tag-pages"]) {
      const withSlash = await hrefs({ basePath: "/apis/x/", routingMode });
      assert.deepEqual(withSlash, await hrefs({ basePath: "/apis/x", routingMode }));
      assert.ok(withSlash.includes("/apis/x#overview"));
      assert.ok(!withSlash.some((href) => href.includes("/apis/x/#") || href.includes("x//")));
    }
  });

  it("getSpecNavigation returns exactly the declared fields of an operation", async () => {
    const nav = await getSpecNavigation(sampleSpec);
    const fields = [
      "deprecated",
      "description",
      "elementId",
      "isWebhook",
      "method",
      "operationId",
      "path",
      "summary",
    ];
    const tags = [...nav.tags, ...nav.remainingTags, ...nav.tagGroups.flatMap((g) => g.tags)];
    assert.ok(tags.length > 0);
    for (const tag of tags) {
      for (const operation of tag.paths) {
        assert.deepEqual(Object.keys(operation).sort(), fields);
        assert.equal(typeof operation.deprecated, "boolean");
        assert.equal(typeof operation.isWebhook, "boolean");
      }
    }
  });

  it("exports the documented API by name only: no default export, no internal helpers", () => {
    assert.deepEqual(Object.keys(prerender).sort(), [
      "bindNavBar",
      "getBundledCss",
      "getFlowCss",
      "getNavBarHtml",
      "getNavCss",
      "getNavFilterHtml",
      "getSpecNavigation",
      "getThemeTokensCss",
      "methodPathSlug",
      "operationAnchorSource",
      "renderArazzoWorkflow",
      "renderEndpoint",
      "renderRapiDoc",
      "renderSchema",
      "toKebabCase",
    ]);
  });
});

describe("A spec that cannot be loaded throws", () => {
  const calls = (spec) => [
    () => renderRapiDoc({ spec }),
    () => renderEndpoint({ spec, path: "/a", method: "get" }),
    () => renderSchema({ spec, schema: "A" }),
    () => getSpecNavigation(spec),
    () => getNavBarHtml(spec),
    () => resolveSpecInput(spec),
  ];

  it("a path that is not a file: file not found, and nothing is fetched", async () => {
    const realFetch = globalThis.fetch;
    let fetched = 0;
    globalThis.fetch = async () => {
      fetched += 1;
      throw new Error("no network in this test");
    };
    try {
      for (const call of calls("./specs/no-such-spec.yaml")) {
        await assert.rejects(
          call,
          /Cannot load the OpenAPI spec: file not found: \.\/specs\/no-such-spec\.yaml/,
        );
      }
      assert.equal(fetched, 0, "a mistyped path is not requested from http://localhost");
    } finally {
      globalThis.fetch = realFetch;
    }
  });

  it("a URL that does not answer, naming the URL", async () => {
    const realFetch = globalThis.fetch;
    globalThis.fetch = async () => new Response("gone", { status: 503, statusText: "Unavailable" });
    try {
      for (const call of calls("https://specs.example.test/openapi.json")) {
        await assert.rejects(
          call,
          /Cannot load the OpenAPI spec https:\/\/specs\.example\.test\/openapi\.json: /,
        );
      }
      globalThis.fetch = async () => {
        throw new TypeError("fetch failed");
      };
      await assert.rejects(
        getNavBarHtml("https://specs.example.test/openapi.json"),
        /Cannot load the OpenAPI spec https:\/\/specs\.example\.test\/openapi\.json: /,
      );
    } finally {
      globalThis.fetch = realFetch;
    }
  });

  it("text and objects that are not an OpenAPI document", async () => {
    await assert.rejects(getNavBarHtml("{ not json\n  nor: [yaml"), /it is not valid JSON or YAML/);
    await assert.rejects(getNavBarHtml("just some\ntext"), /it is not an OpenAPI document/);
    await assert.rejects(
      getSpecNavigation({ hello: "world" }),
      /Cannot load the OpenAPI spec \(the object given\): it is not an OpenAPI document/,
    );
    await assert.rejects(renderRapiDoc({}), /An OpenAPI spec is required/);
  });

  it("a file that exists but does not parse, naming the file", async () => {
    const fs = await import("node:fs");
    const os = await import("node:os");
    const path = await import("node:path");
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "rapidoc-prerender-spec-"));
    const file = path.join(dir, "broken.yaml");
    fs.writeFileSync(file, "openapi: 3.1.0\ninfo: [unclosed\n");
    try {
      await assert.rejects(getNavBarHtml(file), (err) => {
        assert.ok(err.message.includes(file) && /not valid JSON or YAML/.test(err.message));
        return true;
      });
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });
});
