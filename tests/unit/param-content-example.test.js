import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { renderTemplateToString } from "rapidoc/static";
import { inputParametersTemplate } from "~/templates/request-params-template";

// A query parameter described by content, whose example is an object (#1016)
function render(media, paramExtras = {}) {
  const doc = {
    allowTry: "true",
    fillRequestFieldsWithExample: "true",
    activeParameterSchemaTabs: {},
    schemaStyle: "tree",
    method: "get",
    schemaHideReadOnly: "",
    schemaHideWriteOnly: "",
    parameters: [
      {
        in: "query",
        name: "properties",
        content: {
          "application/json": {
            schema: { type: "object", additionalProperties: { type: "string" } },
            ...media,
          },
        },
        ...paramExtras,
      },
    ],
  };
  const result = inputParametersTemplate.call(doc, "query");
  const html = renderTemplateToString(result);
  // .value is a property binding, so it is read from the template values rather than the HTML
  const values = [];
  const walk = (r) => {
    if (Array.isArray(r)) r.forEach(walk);
    else if (r && typeof r === "object" && "values" in r) r.values.forEach(walk);
    else if (r && typeof r === "object" && r._$litDirective$) (r.values || []).forEach(walk);
    else if (typeof r === "string" && r.includes("{")) values.push(r);
  };
  walk(result);
  const dataExample =
    html.match(/data-ptype="query-object"[\s\S]*?data-example="([^"]*)"/)?.[1] ?? null;
  const unescape = (s) =>
    s
      ?.replace(/&quot;/g, '"')
      .replace(/&#10;|&#xa;/gi, "\n")
      .replace(/&amp;/g, "&");
  return {
    dataExample: unescape(dataExample),
    value: values.find((v) => v.includes('"')) ?? "",
    html,
  };
}

const compact = (s) => s.replace(/\s+/g, "");

describe("object examples of content parameters", () => {
  const cases = {
    "example on the schema": { schema: { type: "object", example: { Min: "0" } } },
    "example on the media type": { example: { Min: "0" } },
    "examples on the media type": { examples: { one: { summary: "One", value: { Min: "0" } } } },
    "examples (3.1 array) on the schema": { schema: { type: "object", examples: [{ Min: "0" }] } },
  };
  for (const [name, media] of Object.entries(cases)) {
    it(`${name}: fills the field and Fill example with the JSON`, () => {
      const { dataExample, value, html } = render(media);
      assert.doesNotMatch(html, /\[object Object\]/);
      assert.equal(compact(dataExample), '{"Min":"0"}');
      assert.equal(compact(value), '{"Min":"0"}');
    });
  }

  it("example on the parameter is used as it is", () => {
    const { dataExample } = render({}, { example: { value: "literal" } });
    assert.equal(compact(dataExample), '{"value":"literal"}');
  });
});
