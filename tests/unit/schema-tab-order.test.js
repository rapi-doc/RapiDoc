import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { renderTemplateToString } from "@rapidoc/prerender";
import { schemaTabButtons } from "~/templates/schema-tabs-template";
import { inputParametersTemplate } from "~/templates/request-params-template";

// With default-schema-tab="schema" the tab row reads SCHEMA | EXAMPLE (#987)

const tabs = (html) =>
  [...html.matchAll(/data-tab="(example|schema)">(EXAMPLE|SCHEMA)</g)].map((m) => m[2]);
const active = (html) => html.match(/class="[^"]*\bactive\b[^"]*" data-tab="(\w+)"/)?.[1];

describe("EXAMPLE / SCHEMA tab order", () => {
  it("puts the configured default tab first", () => {
    const render = (d, a) => renderTemplateToString(schemaTabButtons(d, a));
    assert.deepEqual(tabs(render("example", "example")), ["EXAMPLE", "SCHEMA"]);
    assert.deepEqual(tabs(render("schema", "schema")), ["SCHEMA", "EXAMPLE"]);
    assert.deepEqual(tabs(render(undefined, "example")), ["EXAMPLE", "SCHEMA"]);
  });

  it("keeps the order when the reader selects the other tab", () => {
    const html = renderTemplateToString(schemaTabButtons("schema", "example"));
    assert.deepEqual(tabs(html), ["SCHEMA", "EXAMPLE"]);
    assert.equal(active(html), "example");
  });

  it("keeps part=tab-btn, and leaves it off the vertical tabs", () => {
    assert.match(renderTemplateToString(schemaTabButtons("example", "example")), /part="tab-btn"/);
    const vertical = renderTemplateToString(
      schemaTabButtons("example", "example", { cls: "v-tab-btn", part: false }),
    );
    assert.doesNotMatch(vertical, /part=/);
    assert.match(vertical, /class="v-tab-btn active"/);
  });
});

describe("object parameter tabs follow default-schema-tab", () => {
  const render = (defaultSchemaTab, chosen = {}) => {
    const doc = {
      allowTry: "true",
      fillRequestFieldsWithExample: "true",
      activeParameterSchemaTabs: chosen,
      config: { defaultSchemaTab },
      schemaStyle: "tree",
      method: "get",
      schemaHideReadOnly: "",
      schemaHideWriteOnly: "",
      parameters: [
        {
          in: "query",
          name: "filter",
          schema: { type: "object", properties: { q: { type: "string" } } },
        },
      ],
    };
    return renderTemplateToString(inputParametersTemplate.call(doc, "query"));
  };

  it("opens on the default tab, listed first", () => {
    let html = render("schema");
    assert.deepEqual(tabs(html), ["SCHEMA", "EXAMPLE"]);
    assert.equal(active(html), "schema");
    html = render("example");
    assert.deepEqual(tabs(html), ["EXAMPLE", "SCHEMA"]);
    assert.equal(active(html), "example");
  });

  it("the reader's choice wins over the default", () => {
    const html = render("example", { filter: "schema" });
    assert.equal(active(html), "schema");
    assert.deepEqual(tabs(html), ["EXAMPLE", "SCHEMA"]);
  });
});
