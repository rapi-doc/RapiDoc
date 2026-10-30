import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { renderTemplateToString } from "rapidoc/static";
import { serializeQueryParam, buildQueryString } from "~/utils/url-utils";
import { inputParametersTemplate } from "~/templates/request-params-template";

// A query array described by content: application/json is sent as one JSON array (#924)
describe("query arrays described by content: application/json", () => {
  it("serialize to one JSON array", () => {
    assert.deepEqual(
      serializeQueryParam("fields", ["enable", "service_level"], {
        style: "json",
        explode: true,
        isArray: true,
      }),
      [["fields", '["enable","service_level"]']],
    );
  });

  it("keep number and boolean items typed", () => {
    assert.deepEqual(
      serializeQueryParam("ids", ["1", " 2 ", "x"], {
        style: "json",
        isArray: true,
        itemType: "integer",
      }),
      [["ids", '[1,2,"x"]']],
    );
    assert.deepEqual(
      serializeQueryParam("flags", ["true", "false"], {
        style: "json",
        isArray: true,
        itemType: "boolean",
      }),
      [["flags", "[true,false]"]],
    );
    assert.deepEqual(
      serializeQueryParam("ids", ["3"], { style: "json", isArray: true, itemType: "integer,null" }),
      [["ids", "[3]"]],
    );
  });

  it("are URL-encoded as one parameter in the query string", () => {
    assert.equal(
      buildQueryString([
        {
          name: "fields",
          value: ["enable", "service_level"],
          style: "json",
          explode: true,
          isArray: true,
        },
      ]),
      `fields=${encodeURIComponent('["enable","service_level"]')}`,
    );
  });

  it("leave form-style arrays as one parameter per value", () => {
    assert.deepEqual(
      serializeQueryParam("fields", ["a", "b"], { style: "form", explode: true, isArray: true }),
      [
        ["fields", "a"],
        ["fields", "b"],
      ],
    );
  });

  it("the array input carries the json style and the item type", () => {
    const doc = {
      allowTry: "true",
      fillRequestFieldsWithExample: "false",
      activeParameterSchemaTabs: {},
      parameters: [
        {
          in: "query",
          name: "fields",
          content: {
            "application/json": { schema: { type: "array", items: { type: "integer" } } },
          },
        },
      ],
    };
    const html = renderTemplateToString(inputParametersTemplate.call(doc, "query"));
    assert.match(
      html,
      /<tag-input[^>]*data-item-type="integer"[^>]*data-param-serialize-style="json"/,
    );
  });
});
