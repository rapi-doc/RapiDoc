import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { renderTemplateToString } from "@rapidoc/prerender";
import { typeLabel, schemaToAST, getTypeInfo } from "~/utils/schema-utils";
import { inputParametersTemplate } from "~/templates/request-params-template";

// One type label for parameters, schema trees and tables (#1009): a format that implies its type replaces it,
// any other format leaves the type and is shown as a Format note.

describe("typeLabel", () => {
  it("shows a format that implies its type in place of the type", () => {
    assert.deepEqual(typeLabel("integer", "int64"), {
      label: "int64",
      cssType: "integer",
      formatNote: "",
    });
    assert.equal(typeLabel("number", "double").label, "double");
    assert.equal(typeLabel("string", "date-time").label, "date-time");
    assert.equal(typeLabel("string", "uuid").label, "uuid");
  });

  it("keeps the type for a format that doesn't imply it, and returns the format as a note", () => {
    assert.deepEqual(typeLabel("string", "decimal", "decimal"), {
      label: "string",
      cssType: "string",
      formatNote: "decimal",
    });
    assert.deepEqual(typeLabel("integer", "my-id"), {
      label: "integer",
      cssType: "integer",
      formatNote: "my-id",
    });
  });

  it("colors by the declared type, never by the format", () => {
    assert.equal(typeLabel("string", "decimal").cssType, "string");
    assert.equal(typeLabel("string", "int64").cssType, "string");
    assert.equal(
      typeLabel("string", "int64").label,
      "string",
      "int64 on a string is not a string format",
    );
  });

  it("keeps null in a type list and replaces only the matching type", () => {
    assert.equal(typeLabel("integer┃null", "int64").label, "int64┃null");
    assert.equal(typeLabel("string┃integer", "int32").label, "string┃int32");
  });

  it("keeps enum, const and $ref labels", () => {
    assert.equal(typeLabel("string", "", "enum").label, "enum");
    assert.equal(typeLabel("string", "date", "enum").formatNote, "");
  });

  it("without a format the label is the type", () => {
    assert.equal(typeLabel("boolean").label, "boolean");
  });
});

describe("schema rows and parameters label a type the same way", () => {
  const props = {
    id: { type: "integer", format: "int64" },
    qty: { type: "string", format: "decimal" },
    when: { type: "string", format: "date-time" },
    n: { type: "integer" },
    ids: { type: "array", items: { type: "integer", format: "int64" } },
  };

  it("schema AST nodes carry the label, the color type and the format note", () => {
    const ast = schemaToAST({ type: "object", properties: props });
    const node = (name) => ast.properties.find((p) => p.name === name);
    assert.equal(node("id").typeLabel, "int64");
    assert.equal(node("qty").typeLabel, "string");
    assert.equal(node("qty").typeCss, "string");
    assert.equal(node("qty").formatNote, "decimal");
    assert.equal(node("when").typeLabel, "date-time");
    assert.equal(node("n").typeLabel, "integer");
    assert.equal(node("ids").items.typeLabel, "int64");
  });

  it("an array parameter's item type follows the same rule", () => {
    assert.equal(getTypeInfo(props.ids).arrayType, "array of int64");
    assert.equal(
      getTypeInfo({ type: "array", items: { type: "string", format: "decimal" } }).arrayType,
      "array of string",
    );
  });

  it("a parameter row shows the same label, and a Format line for other formats", () => {
    const doc = {
      allowTry: "true",
      fillRequestFieldsWithExample: "true",
      activeParameterSchemaTabs: {},
      schemaStyle: "tree",
      method: "get",
      schemaHideReadOnly: "",
      schemaHideWriteOnly: "",
      parameters: ["id", "qty", "when"].map((name) => ({
        in: "query",
        name,
        schema: props[name],
      })),
    };
    const html = renderTemplateToString(inputParametersTemplate.call(doc, "query"));
    const types = [...html.matchAll(/part="param-type"[^>]*>\s*([^<]*?)\s*</g)].map((m) => m[1]);
    assert.deepEqual(types, ["int64", "string", "date-time"]);
    assert.match(html, /Format:<\/dt>\s*<dd>decimal<\/dd>/);
  });
});
