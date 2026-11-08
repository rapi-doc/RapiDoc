import { describe, it } from "node:test";
import assert from "node:assert";
import {
  getMergedProperties,
  getMergedRequired,
  schemaInObjectNotation,
  schemaToAST,
  schemaToSampleObj,
} from "../../packages/rapidoc/src/utils/schema-utils.js";

describe("schemaToAST", () => {
  describe("primitive data types", () => {
    it("should generate primitive AST for string schema", () => {
      const ast = schemaToAST({ type: "string" });
      assert.strictEqual(ast.kind, "primitive");
      assert.strictEqual(ast.type, "string");
      assert.strictEqual(ast.required, false);
      assert.strictEqual(ast.deprecated, false);
    });

    it("should generate primitive AST for integer and number schemas", () => {
      const intAst = schemaToAST({ type: "integer" });
      assert.strictEqual(intAst.kind, "primitive");
      assert.strictEqual(intAst.type, "integer");

      const numAst = schemaToAST({ type: "number" });
      assert.strictEqual(numAst.kind, "primitive");
      assert.strictEqual(numAst.type, "number");
    });

    it("should generate primitive AST for boolean and null schemas", () => {
      const boolAst = schemaToAST({ type: "boolean" });
      assert.strictEqual(boolAst.kind, "primitive");
      assert.strictEqual(boolAst.type, "boolean");

      const nullAst = schemaToAST({ type: "null" });
      assert.strictEqual(nullAst.kind, "primitive");
      assert.strictEqual(nullAst.type, "null");
    });

    it("should capture const value in AST", () => {
      const ast = schemaToAST({ const: "ACTIVE" });
      assert.strictEqual(ast.kind, "primitive");
      assert.strictEqual(ast.type, "const");
      assert.strictEqual(ast.allowedValues, "ACTIVE");
    });

    it("should capture enum values in AST", () => {
      const ast = schemaToAST({ type: "string", enum: ["pending", "completed"] });
      assert.strictEqual(ast.kind, "primitive");
      assert.strictEqual(ast.type, "enum");
      assert.strictEqual(ast.allowedValues, "pending┃completed");
    });

    it("should capture format and string length constraints", () => {
      const formatAst = schemaToAST({ type: "string", format: "uuid" });
      assert.strictEqual(formatAst.kind, "primitive");
      assert.strictEqual(formatAst.type, "uuid");
      assert.strictEqual(formatAst.format, "uuid");

      const lengthAst = schemaToAST({
        type: "string",
        minLength: 5,
        maxLength: 20,
      });
      assert.strictEqual(lengthAst.kind, "primitive");
      assert.strictEqual(lengthAst.constraints, "5 to 20 chars");
    });

    it("should capture numeric range constraints", () => {
      const ast = schemaToAST({
        type: "integer",
        minimum: 1,
        maximum: 100,
      });
      assert.strictEqual(ast.kind, "primitive");
      assert.strictEqual(ast.type, "integer");
      assert.strictEqual(ast.constraints, "Min 1┃Max 100");
    });

    it("should capture default value", () => {
      const ast = schemaToAST({
        type: "string",
        default: "hello",
      });
      assert.strictEqual(ast.kind, "primitive");
      assert.strictEqual(ast.defaultValue, "hello");
    });

    it("should capture contentMediaType and contentEncoding in primitive AST", () => {
      const ast = schemaToAST({
        type: "string",
        contentMediaType: "image/png",
        contentEncoding: "base64",
      });
      assert.strictEqual(ast.kind, "primitive");
      assert.strictEqual(ast.type, "string");
      assert.strictEqual(ast.contentMediaType, "image/png");
      assert.strictEqual(ast.contentEncoding, "base64");
    });
  });

  describe("object schemas", () => {
    it("should generate object AST with typed properties array", () => {
      const schema = {
        type: "object",
        properties: {
          id: { type: "integer" },
          name: { type: "string" },
        },
        required: ["id"],
      };
      const ast = schemaToAST(schema);
      assert.strictEqual(ast.kind, "object");
      assert.strictEqual(ast.properties.length, 2);

      const idProp = ast.properties.find((p) => p.name === "id");
      const nameProp = ast.properties.find((p) => p.name === "name");

      assert.ok(idProp);
      assert.strictEqual(idProp.kind, "primitive");
      assert.strictEqual(idProp.type, "integer");
      assert.strictEqual(idProp.required, true);

      assert.ok(nameProp);
      assert.strictEqual(nameProp.kind, "primitive");
      assert.strictEqual(nameProp.type, "string");
      assert.strictEqual(nameProp.required, false);
    });

    it("should capture object metadata (title, description, deprecated, readOnly, writeOnly, nullable)", () => {
      const schema = {
        type: "object",
        title: "Account",
        description: "User account object",
        deprecated: true,
        readOnly: true,
        nullable: true,
        properties: {
          id: { type: "string" },
        },
      };
      const ast = schemaToAST(schema);
      assert.strictEqual(ast.kind, "object");
      assert.strictEqual(ast.title, "Account");
      assert.ok(ast.description.includes("User account object"));
      assert.strictEqual(ast.deprecated, true);
      assert.strictEqual(ast.readOnly, true);
      assert.strictEqual(ast.nullable, true);
      assert.strictEqual(ast.dataTypeLabel, "object ┃ null");
    });

    it("should capture patternProperties as child nodes", () => {
      const schema = {
        type: "object",
        patternProperties: {
          "^S_": { type: "string" },
        },
      };
      const ast = schemaToAST(schema);
      assert.strictEqual(ast.kind, "object");
      assert.strictEqual(ast.patternProperties.length, 1);
      assert.strictEqual(ast.patternProperties[0].name, "[pattern: ^S_]");
      assert.strictEqual(ast.patternProperties[0].type, "string");
    });

    it("should capture additionalProperties as a child node", () => {
      const schema = {
        type: "object",
        additionalProperties: { type: "number" },
      };
      const ast = schemaToAST(schema);
      assert.strictEqual(ast.kind, "object");
      assert.ok(ast.additionalProperties);
      assert.strictEqual(ast.additionalProperties.name, "[any-key]");
      assert.strictEqual(ast.additionalProperties.type, "number");
    });

    it("should represent nested objects hierarchically", () => {
      const schema = {
        type: "object",
        properties: {
          address: {
            type: "object",
            properties: {
              city: { type: "string" },
            },
            required: ["city"],
          },
        },
      };
      const ast = schemaToAST(schema);
      assert.strictEqual(ast.kind, "object");
      const addressProp = ast.properties[0];
      assert.strictEqual(addressProp.kind, "object");
      assert.strictEqual(addressProp.name, "address");
      assert.strictEqual(addressProp.properties.length, 1);
      assert.strictEqual(addressProp.properties[0].name, "city");
      assert.strictEqual(addressProp.properties[0].required, true);
    });
  });

  describe("array schemas", () => {
    it("should generate array AST with primitive items node", () => {
      const schema = {
        type: "array",
        items: { type: "string" },
      };
      const ast = schemaToAST(schema);
      assert.strictEqual(ast.kind, "array");
      assert.ok(ast.items);
      assert.strictEqual(ast.items.kind, "primitive");
      assert.strictEqual(ast.items.type, "string");
    });

    it("should generate array AST with object items node", () => {
      const schema = {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "integer" },
          },
        },
      };
      const ast = schemaToAST(schema);
      assert.strictEqual(ast.kind, "array");
      assert.strictEqual(ast.items.kind, "object");
      assert.strictEqual(ast.items.properties.length, 1);
      assert.strictEqual(ast.items.properties[0].name, "id");
    });

    it("should capture nested arrayType for array of arrays", () => {
      const schema = {
        type: "array",
        items: {
          type: "array",
          items: { type: "integer" },
        },
      };
      const ast = schemaToAST(schema);
      assert.strictEqual(ast.kind, "array");
      assert.strictEqual(ast.arrayType, "integer");
      assert.strictEqual(ast.items.kind, "array");
    });

    it("should capture array constraints (minItems, maxItems, uniqueItems)", () => {
      const schema = {
        type: "array",
        minItems: 1,
        maxItems: 10,
        uniqueItems: true,
        items: { type: "string" },
      };
      const ast = schemaToAST(schema);
      assert.strictEqual(ast.kind, "array");
      assert.strictEqual(ast.minItems, 1);
      assert.strictEqual(ast.maxItems, 10);
      assert.strictEqual(ast.uniqueItems, true);
    });

    it("should capture nullable array and dataTypeLabel in OpenAPI 3.0", () => {
      const schema = {
        type: "array",
        nullable: true,
        items: { type: "string" },
      };
      const ast = schemaToAST(schema);
      assert.strictEqual(ast.kind, "array");
      assert.strictEqual(ast.nullable, true);
      assert.strictEqual(ast.dataTypeLabel, "array ┃ null");
    });

    it("should capture nullable array and dataTypeLabel in OpenAPI 3.1 (type array with null)", () => {
      const schema = {
        type: ["array", "null"],
        items: { type: "integer" },
      };
      const ast = schemaToAST(schema);
      assert.strictEqual(ast.kind, "array");
      assert.strictEqual(ast.nullable, true);
      assert.strictEqual(ast.dataTypeLabel, "array ┃ null");
    });
  });

  describe("allOf schemas", () => {
    it("should resolve single primitive allOf directly", () => {
      const schema = {
        allOf: [{ type: "string" }],
      };
      const ast = schemaToAST(schema);
      assert.strictEqual(ast.kind, "primitive");
      assert.strictEqual(ast.type, "string");
    });

    it("should merge properties from multiple object schemas in allOf", () => {
      const schema = {
        allOf: [
          {
            type: "object",
            properties: { id: { type: "integer" } },
            required: ["id"],
          },
          {
            type: "object",
            properties: { name: { type: "string" } },
          },
        ],
      };
      const ast = schemaToAST(schema);
      assert.strictEqual(ast.kind, "object");
      assert.strictEqual(ast.properties.length, 2);
      assert.strictEqual(ast.properties.find((p) => p.name === "id").required, true);
      assert.strictEqual(ast.properties.find((p) => p.name === "name").required, false);
    });
  });

  describe("oneOf and anyOf schemas", () => {
    it("should generate union AST node with operator and options", () => {
      const schema = {
        oneOf: [{ type: "string" }, { type: "number" }],
      };
      const ast = schemaToAST(schema);
      assert.strictEqual(ast.kind, "union");
      assert.strictEqual(ast.operator, "oneOf");
      assert.strictEqual(ast.options.length, 2);
      assert.strictEqual(ast.options[0].type, "string");
      assert.strictEqual(ast.options[1].type, "number");
    });

    it("should capture option titles in union options", () => {
      const schema = {
        anyOf: [
          {
            type: "object",
            title: "Dog",
            properties: { bark: { type: "boolean" } },
          },
          {
            type: "object",
            title: "Cat",
            properties: { meow: { type: "boolean" } },
          },
        ],
      };
      const ast = schemaToAST(schema);
      assert.strictEqual(ast.kind, "union");
      assert.strictEqual(ast.operator, "anyOf");
      assert.strictEqual(ast.options[0].optionTitle, "Dog");
      assert.strictEqual(ast.options[1].optionTitle, "Cat");
    });

    it("should retain base properties when schema has regular properties and oneOf", () => {
      const schema = {
        type: "object",
        properties: {
          type: { type: "string" },
        },
        required: ["type"],
        oneOf: [
          { type: "object", title: "A", properties: { valA: { type: "string" } } },
          { type: "object", title: "B", properties: { valB: { type: "string" } } },
        ],
      };
      const ast = schemaToAST(schema);
      assert.strictEqual(ast.kind, "union");
      assert.strictEqual(ast.properties.length, 1);
      assert.strictEqual(ast.properties[0].name, "type");
      assert.strictEqual(ast.properties[0].required, true);
      assert.strictEqual(ast.options.length, 2);
    });
  });

  describe("OpenAPI 3.1 multi-type arrays", () => {
    it("should handle multi-primitive types joined (e.g. integer┃string)", () => {
      const schema = { type: ["integer", "string"] };
      const ast = schemaToAST(schema);
      assert.strictEqual(ast.kind, "primitive");
      assert.ok(ast.type.includes("integer┃string"));
    });

    it("should recognize OpenAPI 3.1 nullable object as object with nullable: true", () => {
      const schema = {
        type: ["object", "null"],
        properties: {
          id: { type: "string" },
        },
      };
      const ast = schemaToAST(schema);
      assert.strictEqual(ast.kind, "object");
      assert.strictEqual(ast.nullable, true);
      assert.strictEqual(ast.dataTypeLabel, "object ┃ null");
      assert.strictEqual(ast.properties.length, 1);
      assert.strictEqual(ast.properties[0].name, "id");
    });

    it("should recognize OpenAPI 3.1 nullable array as array with nullable: true", () => {
      const schema = {
        type: ["array", "null"],
        items: { type: "string" },
      };
      const ast = schemaToAST(schema);
      assert.strictEqual(ast.kind, "array");
      assert.strictEqual(ast.nullable, true);
      assert.strictEqual(ast.dataTypeLabel, "array ┃ null");
      assert.strictEqual(ast.items.type, "string");
    });

    it("should generate union options for complex type combined with primitive", () => {
      const schema = {
        type: ["string", "object"],
        properties: { id: { type: "string" } },
      };
      const ast = schemaToAST(schema);
      assert.strictEqual(ast.kind, "union");
      assert.strictEqual(ast.operator, "oneOf");
      assert.strictEqual(ast.options.length, 2);
      assert.strictEqual(ast.options[0].kind, "object");
      assert.strictEqual(ast.options[1].kind, "primitive");
    });
  });

  describe("oneOf options", () => {
    it("should not name the untitled primitive options, but keep the name of the other options", () => {
      const ast = schemaToAST({
        oneOf: [
          { type: "string" },
          { type: "number", title: "Count" },
          { type: "object", properties: { id: { type: "string" } } },
        ],
      });
      assert.strictEqual(ast.kind, "union");
      assert.deepStrictEqual(
        ast.options.map((o) => [o.optionIndex, o.name]),
        [
          [1, ""],
          [2, "Count"],
          [3, "Option 3"],
        ],
      );
    });
  });

  describe("recursion limit & null inputs", () => {
    it("should return null for falsy schema input", () => {
      assert.strictEqual(schemaToAST(null), null);
      assert.strictEqual(schemaToAST(undefined), null);
    });

    it("should cap recursion at level > 8 and mark truncated: true", () => {
      const schema = {
        type: "object",
        description: "deeply nested",
        properties: { id: { type: "string" } },
      };
      const ast = schemaToAST(schema, 9);
      assert.strictEqual(ast.truncated, true);
      assert.strictEqual(ast.properties, undefined);
    });
  });

  // https://github.com/rapi-doc/RapiDoc/issues/1160
  describe("depth limit", () => {
    // Object nested `depth` levels deep through `child`; every level also has an `id` and a `tags` array
    const nestedObject = (depth) =>
      depth === 0
        ? { type: "object", properties: { id: { type: "integer" } } }
        : {
            type: "object",
            properties: {
              id: { type: "integer" },
              tags: { type: "array", items: { type: "string" } },
              child: nestedObject(depth - 1),
            },
          };
    const childAt = (ast, level) => {
      let node = ast;
      for (let i = 0; i < level; i++) node = node.properties.find((p) => p.name === "child");
      return node;
    };
    const prop = (node, name) => node.properties.find((p) => p.name === name);

    it("should not count allOf/anyOf/oneOf as nesting levels (issue example)", () => {
      const Base = { type: "object", properties: { id: { type: "integer" } } };
      const withBase = (properties) => ({ allOf: [Base, { type: "object", properties }] });
      const schema = {
        allOf: [
          { type: "object", properties: { total: { type: "integer" } } },
          {
            type: "object",
            properties: {
              data: {
                type: "array",
                items: {
                  allOf: [
                    withBase({ name: { type: "string" } }),
                    {
                      type: "object",
                      properties: {
                        organization: {
                          allOf: [
                            withBase({ name: { type: "string" } }),
                            {
                              type: "object",
                              properties: { location: withBase({ city: { type: "string" } }) },
                            },
                          ],
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
        ],
      };
      const ast = schemaToAST(schema);
      const location = prop(prop(prop(ast, "data").items, "organization"), "location");
      assert.deepStrictEqual(
        location.properties.map((p) => [p.name, p.kind, p.type]),
        [
          ["id", "primitive", "integer"],
          ["city", "primitive", "string"],
        ],
      );
    });

    it("should expand objects down to JSON depth 8 and keep primitives below it", () => {
      const ast = schemaToAST(nestedObject(10));
      const level8 = childAt(ast, 8);
      assert.strictEqual(level8.kind, "object");
      assert.ok(!level8.truncated, "Object at depth 8 is expanded");
      const level9 = childAt(ast, 9);
      assert.strictEqual(level9.truncated, true, "Object at depth 9 is truncated");
      assert.strictEqual(level9.properties, undefined);
      assert.strictEqual(prop(level8, "id").kind, "primitive", "Primitive at depth 9 is shown");
      assert.strictEqual(prop(level8, "id").type, "integer");
    });

    it("should truncate an array below the limit as an array", () => {
      const ast = schemaToAST(nestedObject(10));
      const tags = prop(childAt(ast, 8), "tags");
      assert.strictEqual(tags.kind, "array");
      assert.strictEqual(tags.truncated, true);
    });

    it("should not add depth for union options", () => {
      const wrapped = {
        oneOf: [{ anyOf: [{ allOf: [nestedObject(8)] }, { type: "null" }] }, { type: "string" }],
      };
      const ast = schemaToAST(wrapped);
      const objectOption = ast.options[0].options[0];
      assert.ok(!childAt(objectOption, 8).truncated, "Composition wrappers do not use up depth");
    });

    it("should stop on a cycle that only goes through composition", () => {
      const looping = { oneOf: [{ type: "string" }] };
      looping.oneOf.push(looping);
      const ast = schemaToAST(looping);
      assert.strictEqual(ast.kind, "union");
      assert.strictEqual(ast.options[1].truncated, true);
    });

    it("should build a very large schema one level shallower at a time until it fits", () => {
      // a chain 6 levels deep whose deepest object has more properties than the budget allows
      const wide = {
        type: "object",
        properties: Object.fromEntries(
          Array.from({ length: 9000 }, (_, i) => [`p${i}`, { type: "string" }]),
        ),
      };
      let schema = wide;
      for (let i = 0; i < 6; i++)
        schema = { type: "object", properties: { id: { type: "integer" }, child: schema } };
      const ast = schemaToAST(schema);
      const level6 = childAt(ast, 6);
      assert.strictEqual(level6.truncated, true, "Oversized object is cut off");
      assert.strictEqual(
        prop(childAt(ast, 5), "id").kind,
        "primitive",
        "Primitives next to it are still shown",
      );
    });

    it("should keep the full depth for schemas within the budget", () => {
      const wide = {
        type: "object",
        properties: Object.fromEntries(
          Array.from({ length: 100 }, (_, i) => [`p${i}`, { type: "string" }]),
        ),
      };
      let schema = wide;
      for (let i = 0; i < 6; i++)
        schema = { type: "object", properties: { id: { type: "integer" }, child: schema } };
      const level6 = childAt(schemaToAST(schema), 6);
      assert.ok(!level6.truncated);
      assert.strictEqual(level6.properties.length, 100);
    });
  });
});

describe("allOf wrapping a single composed schema", () => {
  const address = {
    type: "object",
    properties: { street: { type: "string" }, city: { type: "string" } },
  };
  const geoAddress = {
    allOf: [address, { type: "object", properties: { lat: { type: "number" } } }],
  };
  const wrapped = { description: "Billing address", allOf: [geoAddress] };

  it("schemaToAST keeps the fields of the inner allOf", () => {
    const ast = schemaToAST(wrapped);
    assert.strictEqual(ast.kind, "object");
    assert.deepStrictEqual(
      ast.properties.map((p) => p.name),
      ["street", "city", "lat"],
    );
  });

  it("schemaToSampleObj keeps the fields of the inner allOf", () => {
    const sample = schemaToSampleObj({ type: "object", properties: { address: wrapped } });
    const { street, city, lat } = sample["example-0"].address ?? {};
    assert.deepStrictEqual({ street, city, lat }, { street: "string", city: "string", lat: 0 });
  });
});

describe("allOf next to the schema's own properties (#1168)", () => {
  const resource = {
    type: "object",
    properties: { id: { type: "string" }, version: { type: "integer" } },
    required: ["version"],
  };
  const pet = {
    allOf: [resource],
    type: "object",
    properties: {
      name: { type: "string", example: "Rex" },
      status: { type: "string", enum: ["AVAILABLE", "SOLD"] },
    },
    required: ["name"],
  };

  it("schemaToAST lists the member and own properties with their required flags", () => {
    const ast = schemaToAST(pet);
    assert.strictEqual(ast.kind, "object");
    assert.deepStrictEqual(
      ast.properties.map((p) => [p.name, p.required]),
      [
        ["id", false],
        ["version", true],
        ["name", true],
        ["status", false],
      ],
    );
  });

  it("schemaToSampleObj includes the own properties", () => {
    const sample = schemaToSampleObj(pet)["example-0"];
    assert.deepStrictEqual(sample, { id: "string", version: 0, name: "Rex", status: "AVAILABLE" });
  });

  it("schemaToSampleObj keeps the own properties when a member has its own example", () => {
    const withExample = { ...pet, allOf: [{ ...resource, example: { id: "r-1", version: 3 } }] };
    const sample = schemaToSampleObj(withExample)["example-0"];
    assert.deepStrictEqual(sample, { id: "r-1", version: 3, name: "Rex", status: "AVAILABLE" });
  });

  it("schemaInObjectNotation includes the own properties", () => {
    const obj = schemaInObjectNotation(pet);
    assert.ok(["id", "version*", "name*", "status"].every((key) => key in obj));
  });
});

describe("property defined in several allOf members (#1169)", () => {
  const tagInput = { type: "object", properties: { name: { type: "string" } } };
  const tag = { type: "object", properties: { name: { type: "string" }, id: { type: "string" } } };
  const pet = {
    allOf: [
      {
        type: "object",
        properties: {
          status: { type: "string", description: "Pet status" },
          tags: { type: "array", items: tagInput },
        },
      },
      {
        type: "object",
        properties: {
          status: { type: "string", enum: ["AVAILABLE", "SOLD"] },
          tags: { type: "array", items: tag },
        },
        required: ["status"],
      },
    ],
  };

  it("schemaToAST shows one row per property, merged", () => {
    const ast = schemaToAST(pet);
    assert.deepStrictEqual(
      ast.properties.map((p) => p.name),
      ["status", "tags"],
    );
    const [status, tags] = ast.properties;
    assert.strictEqual(status.required, true);
    assert.strictEqual(status.type, "enum");
    assert.strictEqual(status.description, "Pet status");
    assert.deepStrictEqual(
      tags.items.properties.map((p) => p.name),
      ["name", "id"],
    );
  });

  it("getMergedProperties and getMergedRequired agree with the table", () => {
    assert.deepStrictEqual(Object.keys(getMergedProperties(pet)), ["status", "tags"]);
    assert.deepStrictEqual(getMergedRequired(pet), ["status"]);
  });
});

describe("allOf wrapping a single oneOf", () => {
  const wrapped = {
    description: "Amount or label",
    allOf: [{ oneOf: [{ type: "string" }, { type: "integer" }] }],
  };

  it("schemaToAST renders it as the union, not as an object", () => {
    const ast = schemaToAST(wrapped);
    assert.strictEqual(ast.kind, "union");
    assert.strictEqual(ast.description, "Amount or label");
    assert.strictEqual(ast.options.length, 2);
  });

  it("allOf of an object and a oneOf keeps the object with the options beside it", () => {
    const ast = schemaToAST({
      allOf: [
        { type: "object", properties: { id: { type: "string" } }, required: ["id"] },
        {
          oneOf: [
            { properties: { a: { type: "string" } } },
            { properties: { b: { type: "string" } } },
          ],
        },
      ],
    });
    assert.strictEqual(ast.kind, "object");
    assert.deepStrictEqual(
      ast.properties.map((p) => [p.name, p.required]),
      [["id", true]],
    );
    assert.strictEqual(ast.unions.length, 1);
  });
});

describe("allOf wrapping a primitive", () => {
  it("keeps the property in the example", () => {
    const sample = schemaToSampleObj({
      type: "object",
      properties: { status: { description: "State", allOf: [{ type: "string", enum: ["ON"] }] } },
    });
    assert.deepStrictEqual(sample["example-0"], { status: "ON" });
  });

  it("drops a readOnly one unless read-only fields are included", () => {
    const schema = {
      type: "object",
      properties: { id: { allOf: [{ type: "string", readOnly: true }] } },
    };
    assert.deepStrictEqual(schemaToSampleObj(schema)["example-0"], {});
    assert.deepStrictEqual(schemaToSampleObj(schema, { includeReadOnly: true })["example-0"], {
      id: "string",
    });
  });
});
