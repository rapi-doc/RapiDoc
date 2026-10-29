import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { schemaToAST } from "../../packages/rapidoc/src/utils/schema-utils.js";

// Polyfill minimal browser globals for Lit components in Node.js
if (typeof globalThis.customElements === "undefined") {
  globalThis.customElements = { define: () => {} };
}

const { default: SchemaTree } =
  await import("../../packages/rapidoc/src/components/schema-tree.js");
const { default: SchemaTable } =
  await import("../../packages/rapidoc/src/components/schema-table.js");

function renderToString(result) {
  if (!result) return "";
  if (typeof result === "string" || typeof result === "number") return String(result);
  if (Array.isArray(result)) return result.map(renderToString).join("");
  if (result.strings && result.values) {
    let str = "";
    for (let i = 0; i < result.strings.length; i++) {
      str += result.strings[i];
      if (i < result.values.length) {
        str += renderToString(result.values[i]);
      }
    }
    return str;
  }
  return "";
}

describe("Nullable Schemas Visualization (schema-tree & schema-table)", () => {
  const tree = new SchemaTree();
  tree.schemaExpandLevel = 999;
  const table = new SchemaTable();
  table.schemaExpandLevel = 999;

  describe("schema-tree null markers and classes", () => {
    it("should render null marker on nullable primitive array", () => {
      const ast = schemaToAST(
        { type: "array", nullable: true, items: { type: "string" } },
        0,
        "tags",
      );
      const html = renderToString(tree.renderAST(ast));
      assert.ok(html.includes("null┃[string]"), "Should contain null┃[string]");
      assert.ok(html.includes('class="tr primitive nullable"'), "Row should have nullable class");
    });

    it("should not render null marker on non-nullable primitive array", () => {
      const ast = schemaToAST({ type: "array", items: { type: "string" } }, 0, "tags");
      const html = renderToString(tree.renderAST(ast));
      assert.ok(html.includes("[string]"), "Should contain [string]");
      assert.ok(!html.includes("null┃"), "Should not contain null┃ marker");
      assert.ok(!html.includes("nullable"), "Row should not have nullable class");
    });

    it("should render null marker on nullable array of objects", () => {
      const ast = schemaToAST(
        {
          type: "array",
          nullable: true,
          items: { type: "object", properties: { id: { type: "integer" } } },
        },
        0,
        "users",
      );
      const html = renderToString(tree.renderAST(ast));
      assert.ok(
        html.includes('null┃<span class="open-bracket-expanded">[{</span>'),
        "Should prefix [{ with null marker",
      );
      assert.ok(html.includes("nullable"), "Row should have nullable class");
    });

    it("should render null marker on nullable array of arrays", () => {
      const ast = schemaToAST(
        {
          type: "array",
          nullable: true,
          items: { type: "array", items: { type: "integer" } },
        },
        0,
        "matrix",
      );
      const html = renderToString(tree.renderAST(ast));
      assert.ok(
        html.includes('null┃<span class="open-bracket-expanded">[['),
        "Should prefix [[ with null marker",
      );
      assert.ok(html.includes("nullable"), "Row should have nullable class");
    });

    it("should render null marker on nullable array of unions", () => {
      const ast = schemaToAST(
        {
          type: "array",
          nullable: true,
          items: { anyOf: [{ type: "string" }, { type: "integer" }] },
        },
        0,
        "mixed",
      );
      const html = renderToString(tree.renderAST(ast));
      assert.ok(
        html.includes('null┃<span class="open-bracket-expanded">[</span>'),
        "Should prefix [ with null marker",
      );
      assert.ok(html.includes("nullable"), "Row should have nullable class");
    });

    it("should render null marker on nullable empty array", () => {
      const ast = schemaToAST({ type: "array", nullable: true }, 0, "emptyArr");
      const html = renderToString(tree.renderAST(ast));
      assert.ok(html.includes("null┃[ ]"), "Should contain null┃[ ]");
      assert.ok(html.includes("nullable"), "Row should have nullable class");
    });

    it("should render null marker on nullable object", () => {
      const ast = schemaToAST(
        {
          type: "object",
          nullable: true,
          properties: { id: { type: "string" } },
        },
        0,
        "account",
      );
      const html = renderToString(tree.renderAST(ast));
      assert.ok(
        html.includes('null┃<span class="open-bracket-expanded">{</span>'),
        "Should prefix { with null marker",
      );
      assert.ok(html.includes("nullable"), "Row should have nullable class");
    });

    it("distinguishes nullable array vs array of nullable items", () => {
      // 1. Array of nullable items (array itself is not nullable)
      const itemsNullable = schemaToAST(
        { type: "array", items: { type: "string", nullable: true } },
        0,
        "arr1",
      );
      const html1 = renderToString(tree.renderAST(itemsNullable));
      assert.ok(html1.includes("[string┃null]"), "Item type should indicate nullability");
      assert.ok(!html1.includes("null┃["), "Array itself should not have null prefix");

      // 2. Both array and items nullable
      const bothNullable = schemaToAST(
        { type: "array", nullable: true, items: { type: "string", nullable: true } },
        0,
        "arr2",
      );
      const html2 = renderToString(tree.renderAST(bothNullable));
      assert.ok(
        html2.includes("null┃[string┃null]"),
        "Both array and item null markers should be present",
      );
    });
  });

  describe("schema-table null labels and classes", () => {
    it('should render "┃ null" suffix for nullable primitive array in table view', () => {
      const ast = schemaToAST(
        { type: "array", nullable: true, items: { type: "string" } },
        0,
        "tags",
      );
      const html = renderToString(table.renderAST(ast));
      assert.ok(html.includes("[string] ┃ null"), 'Should contain "[string] ┃ null"');
      assert.ok(html.includes('class="tr primitive nullable"'), "Row should have nullable class");
    });

    it('should not render "┃ null" for non-nullable primitive array in table view', () => {
      const ast = schemaToAST({ type: "array", items: { type: "string" } }, 0, "tags");
      const html = renderToString(table.renderAST(ast));
      assert.ok(html.includes("[string]"), "Should contain [string]");
      assert.ok(!html.includes("┃ null"), "Should not contain ┃ null");
      assert.ok(!html.includes("nullable"), "Row should not have nullable class");
    });

    it('should render "array of object ┃ null" for nullable object array in table view', () => {
      const ast = schemaToAST(
        {
          type: "array",
          nullable: true,
          items: { type: "object", properties: { id: { type: "integer" } } },
        },
        0,
        "users",
      );
      const html = renderToString(table.renderAST(ast));
      assert.ok(html.includes("array of object ┃ null"), 'Should contain "array of object ┃ null"');
      assert.ok(html.includes("nullable"), "Row should have nullable class");
    });

    it('should render "array of array of integer ┃ null" for nullable nested array in table view', () => {
      const ast = schemaToAST(
        {
          type: "array",
          nullable: true,
          items: { type: "array", items: { type: "integer" } },
        },
        0,
        "matrix",
      );
      const html = renderToString(table.renderAST(ast));
      assert.ok(
        html.includes("array of array of integer ┃ null"),
        "Should contain nested array type with null label",
      );
      assert.ok(html.includes("nullable"), "Row should have nullable class");
    });

    it('should render "array of union ┃ null" for nullable union array in table view', () => {
      const ast = schemaToAST(
        {
          type: "array",
          nullable: true,
          items: { anyOf: [{ type: "string" }, { type: "integer" }] },
        },
        0,
        "mixed",
      );
      const html = renderToString(table.renderAST(ast));
      assert.ok(html.includes("array of union ┃ null"), 'Should contain "array of union ┃ null"');
      assert.ok(html.includes("nullable"), "Row should have nullable class");
    });

    it('should render "array ┃ null" for nullable empty array in table view', () => {
      const ast = schemaToAST({ type: "array", nullable: true }, 0, "emptyArr");
      const html = renderToString(table.renderAST(ast));
      assert.ok(html.includes("array ┃ null"), 'Should contain "array ┃ null"');
      assert.ok(html.includes("nullable"), "Row should have nullable class");
    });

    it('should render "object ┃ null" for nullable object in table view', () => {
      const ast = schemaToAST(
        {
          type: "object",
          nullable: true,
          properties: { id: { type: "string" } },
        },
        0,
        "account",
      );
      const html = renderToString(table.renderAST(ast));
      assert.ok(html.includes("object ┃ null"), 'Should contain "object ┃ null"');
      assert.ok(html.includes("nullable"), "Row should have nullable class");
    });
  });

  // https://github.com/rapi-doc/RapiDoc/issues/1161
  describe("property name on oneOf/anyOf properties", () => {
    const schema = {
      type: "object",
      required: ["parent"],
      properties: {
        parent_id: { oneOf: [{ type: "integer" }, { type: "null" }] },
        parent: {
          anyOf: [{ type: "object", properties: { id: { type: "integer" } } }, { type: "null" }],
        },
      },
    };

    it("should render the property name on its own row with the union label indented below it in tree view", () => {
      // collapse template whitespace so the markup can be matched exactly
      const html = renderToString(tree.renderAST(schemaToAST(schema)))
        .replace(/\s+>/g, ">")
        .replace(/>\s+</g, "><");
      const nameRowThenIndentedLabel = (name, label) =>
        new RegExp(
          `>${name}:</span></div><div class="td key-descr"></div></div>` +
            '<div class="inside-bracket xxx-of-option" style="padding-left:12px;">' +
            `<div class="tr expanded xxx-of-option"><div class="td key"[^>]*><span class="key-label xxx-of-key">${label}</span>`,
        );
      assert.match(html, nameRowThenIndentedLabel("parent_id", "ONE OF"));
      assert.match(
        html,
        nameRowThenIndentedLabel(
          'parent<span style="color:var\\(--destructive\\)">\\*</span>',
          "ANY OF",
        ),
      );
    });

    it("should render the property name in the key column and the union label as its type in table view", () => {
      const html = renderToString(table.renderAST(schemaToAST(schema)));
      assert.match(html, /data-obj="parent_id"/);
      assert.match(
        html,
        /<span class="key-label" title="parent_id">parent_id<\/span>[\s\S]*?<div class="td key-type"><span class="xxx-of-key">ONE OF/,
      );
      assert.match(
        html,
        /<span class="key-label" title="parent">parent<\/span>[\s\S]*?<div class="td key-type"><span class="xxx-of-key">ANY OF/,
      );
    });

    it("should not repeat option names on a union nested inside another union", () => {
      const nested = schemaToAST(
        { oneOf: [{ anyOf: [{ type: "string" }, { type: "integer" }] }, { type: "null" }] },
        0,
        "value",
      );
      const treeHtml = renderToString(tree.renderAST(nested));
      const tableHtml = renderToString(table.renderAST(nested));
      assert.ok(treeHtml.includes("value:"), "Top-level property name is shown");
      assert.doesNotMatch(
        treeHtml,
        /Option 1:<\/span>\s*<span class="key-label xxx-of-key">/,
        "Nested union is not labelled with its option name",
      );
      assert.doesNotMatch(
        tableHtml,
        /data-obj="Option 1"/,
        "Nested union is not labelled with its option name",
      );
    });
  });
});
