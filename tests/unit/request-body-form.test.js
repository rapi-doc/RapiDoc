import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { renderTemplateToString } from "rapidoc/static";
import { formDataTemplate } from "~/templates/request-body-template";

// The form fields of a multipart/form-data or x-www-form-urlencoded request body.
const doc = { allowTry: "true", fileInputKeys: {}, fillRequestFieldsWithExample: "true" };

// Field names as rendered, with "*" for a required marker
function fieldNames(schema, mimeType = "multipart/form-data") {
  const html = renderTemplateToString(formDataTemplate.call(doc, schema, mimeType));
  return [...html.matchAll(/class="param-name[^"]*"[^>]*>([\s\S]*?)<\/div>/g)].map((m) =>
    m[1].replace(/<[^>]+>/g, "").replace(/\s+/g, ""),
  );
}

describe("form data required markers", () => {
  // An object field's own required list says which of its members are required, not whether the field is (#1139)
  const options = {
    type: "object",
    required: ["member_1"],
    properties: { member_1: { type: "boolean" }, member_2: { type: "boolean" } },
  };
  const schema = {
    type: "object",
    required: ["section_1_1", "section_2_1"],
    properties: {
      section_1_1: { type: "string" },
      section_1_2: { type: "string" },
      section_2_1: options,
      section_2_2: options,
    },
  };

  it("marks only the fields in the parent's required list", () => {
    assert.deepEqual(fieldNames(schema), [
      "section_1_1*",
      "section_1_2",
      "section_2_1*",
      "section_2_2",
    ]);
  });

  it("does the same for x-www-form-urlencoded", () => {
    assert.deepEqual(fieldNames(schema, "application/x-www-form-urlencoded"), [
      "section_1_1*",
      "section_1_2",
      "section_2_1*",
      "section_2_2",
    ]);
  });
});
