import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { buildDocDefinition, buildSpecModel, markdownToPdfmake } from "../src/core/index.js";
import { loadSpec } from "../src/load-spec.js";
import { serializeDefinition } from "./helpers/definitions.js";

const operation = (extra = {}) => ({ responses: { 200: { description: "ok" } }, ...extra });
const spec = (paths, extra = {}) => ({
  openapi: "3.0.0",
  info: { title: "T", version: "1" },
  paths,
  ...extra,
});

/** Every `text` string in a definition (or part of one), in document order. */
function texts(node, out = []) {
  if (typeof node === "string" || typeof node === "number") out.push(node);
  else if (Array.isArray(node)) node.forEach((item) => texts(item, out));
  else if (node && typeof node === "object") {
    for (const [key, value] of Object.entries(node)) {
      if (key === "text" || typeof value === "object") texts(value, out);
    }
  }
  return out;
}

describe("loadSpec", () => {
  it("rejects when the input is not a spec", async () => {
    await assert.rejects(() => loadSpec(42));
  });

  it("reads spec text as JSON or YAML", async () => {
    const fromYaml = await loadSpec(
      "openapi: 3.0.0\ninfo:\n  title: Y\n  version: '1'\npaths: {}\n",
    );
    assert.equal(fromYaml.info.title, "Y");
    const fromJson = await loadSpec(JSON.stringify(spec({})));
    assert.equal(fromJson.info.title, "T");
  });

  it("converts Swagger 2.0 to OpenAPI 3", async () => {
    const loaded = await loadSpec({
      swagger: "2.0",
      info: { title: "S", version: "1" },
      paths: {
        "/a": {
          post: {
            consumes: ["application/json"],
            parameters: [{ in: "body", name: "body", schema: { $ref: "#/definitions/A" } }],
            responses: { 200: { description: "ok" } },
          },
        },
      },
      definitions: { A: { type: "object", properties: { id: { type: "integer" } } } },
    });
    assert.match(loaded.openapi, /^3\./);
    const body = loaded.paths["/a"].post.requestBody.content["application/json"].schema;
    assert.deepEqual(Object.keys(body.properties), ["id"]);
  });

  it("leaves a schema inside itself as a $ref, so the result is a tree", async () => {
    const loaded = await loadSpec(
      spec(
        {},
        {
          components: {
            schemas: {
              Node: {
                type: "object",
                properties: { parent: { $ref: "#/components/schemas/Node" } },
              },
            },
          },
        },
      ),
    );
    assert.deepEqual(loaded.components.schemas.Node.properties.parent, {
      $ref: "#/components/schemas/Node",
    });
    assert.doesNotThrow(() => JSON.stringify(loaded));
  });
});

describe("buildSpecModel", () => {
  it("lists each tag once, however many paths there are", () => {
    const model = buildSpecModel(
      spec(
        {
          "/a": { get: operation({ tags: ["one"] }) },
          "/b": { get: operation({ tags: ["two"] }) },
          "/c": { get: operation({ tags: ["one"] }) },
        },
        { tags: [{ name: "one" }, { name: "two" }] },
      ),
      false,
    );
    assert.deepEqual(
      model.tags.map((tag) => [tag.name, tag.paths.length]),
      [
        ["one", 2],
        ["two", 1],
      ],
    );
  });

  it("includes trace operations", () => {
    const model = buildSpecModel(spec({ "/a": { trace: operation({ tags: ["t"] }) } }), false);
    assert.deepEqual(
      model.tags[0].paths.map((path) => path.method),
      ["trace"],
    );
  });
});

describe("buildDocDefinition", () => {
  const examplesSpec = spec({
    "/a": {
      get: operation({
        tags: ["t"],
        parameters: [
          {
            name: "limit",
            in: "query",
            schema: { type: "integer" },
            examples: { low: { value: 5 } },
          },
        ],
        responses: {
          200: {
            description: "ok",
            content: {
              "application/json": {
                schema: { type: "object", properties: { id: { type: "integer" } } },
                examples: { first: { value: { id: 1 } }, second: { value: "plain text" } },
              },
            },
          },
        },
      }),
    },
  });

  it("prints the values of named examples, not their names", () => {
    const all = texts(buildDocDefinition(examplesSpec, { includeExample: true }).content);
    assert.ok(all.includes(JSON.stringify({ id: 1 }, null, 2)));
    assert.ok(all.includes("plain text"));
    assert.ok(!all.includes('"first"'));
  });

  it("prints a parameter's first named example", () => {
    const all = texts(buildDocDefinition(examplesSpec, { includeExample: true }).content);
    assert.ok(all.includes(5));
  });

  it("renders an array request body in the table style", () => {
    const definition = buildDocDefinition(
      spec({
        "/a": {
          post: operation({
            tags: ["t"],
            requestBody: {
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { type: "object", properties: { petName: { type: "string" } } },
                  },
                },
              },
            },
          }),
        },
      }),
      { pdfSchemaStyle: "table" },
    );
    assert.ok(texts(definition.content).includes("petName"));
  });

  it("leaves no blank placeholder in a list of blocks", () => {
    const definition = buildDocDefinition(examplesSpec);
    (function check(node) {
      if (Array.isArray(node)) {
        assert.ok(!node.includes("") && !node.includes(undefined) && !node.includes(null));
        node.forEach(check);
      } else if (node && typeof node === "object") {
        if (node.stack) check(node.stack);
      }
    })(definition.content);
  });

  it("is plain data apart from the footer and table layouts", () => {
    const text = serializeDefinition(buildDocDefinition(examplesSpec, { pdfFooterText: "f" }));
    assert.ok(JSON.parse(text).footer["[fn footer(3,7)]"]);
  });

  it("uses the labels given in localize and keeps the other defaults", () => {
    const all = texts(
      buildDocDefinition(examplesSpec, { localize: { request: "ANFRAGE" } }).content,
    );
    assert.ok(all.includes("ANFRAGE"));
    assert.ok(all.includes("RESPONSE"));
  });
});

describe("schemas in the PDF", () => {
  const responseSpec = (schema, extra = {}) =>
    spec(
      {
        "/a": {
          get: {
            tags: ["t"],
            responses: {
              200: { description: "ok", content: { "application/json": { schema } } },
            },
          },
        },
      },
      extra,
    );
  const printed = async (schema, options, extra) =>
    texts(buildDocDefinition(await loadSpec(responseSpec(schema, extra)), options).content);

  const employee = {
    description: "an employee",
    allOf: [
      {
        type: "object",
        required: ["first"],
        properties: { first: { type: "string" } },
      },
      {
        type: "object",
        required: ["title"],
        properties: { title: { type: "string", description: "job title" } },
      },
    ],
  };

  for (const pdfSchemaStyle of ["object", "table"]) {
    describe(`${pdfSchemaStyle} style`, () => {
      it("merges allOf into one object, required from every member", async () => {
        const all = await printed(employee, { pdfSchemaStyle });
        assert.ok(all.includes("first*"));
        assert.ok(all.includes("title*"));
        assert.ok(all.includes("job title"));
      });

      it("prints each anyOf / oneOf option", async () => {
        const all = await printed(
          {
            type: "object",
            properties: {
              pet: {
                oneOf: [
                  { type: "object", properties: { bark: { type: "boolean" } } },
                  { type: "object", title: "Cat", properties: { purr: { type: "boolean" } } },
                ],
              },
            },
          },
          { pdfSchemaStyle },
        );
        assert.ok(all.includes("bark"));
        assert.ok(all.includes("purr"));
        assert.ok(all.some((text) => String(text).startsWith("OPTION 1")));
        assert.ok(all.some((text) => String(text).startsWith("OPTION 2 Cat")));
      });

      it("prints an OpenAPI 3.1 type list, formats and nullable", async () => {
        const all = await printed(
          {
            type: "object",
            properties: {
              code: { type: ["string", "null"] },
              count: { type: "integer", format: "int64" },
              id: { type: "string", format: "uuid" },
              old: { type: "string", nullable: true },
            },
          },
          { pdfSchemaStyle },
          { openapi: "3.1.0" },
        );
        assert.ok(all.includes("string | null"));
        assert.ok(all.includes("int64"));
        assert.ok(all.includes("uuid"));
        assert.ok(!all.join(" ").includes("┃"), "the bar RapiDoc joins types with has no glyph");
      });

      it("prints additionalProperties and a schema inside itself", async () => {
        const all = await printed(
          { $ref: "#/components/schemas/Node" },
          { pdfSchemaStyle },
          {
            components: {
              schemas: {
                Node: {
                  type: "object",
                  properties: { parent: { $ref: "#/components/schemas/Node" } },
                  additionalProperties: { type: "string" },
                },
              },
            },
          },
        );
        assert.ok(all.includes("parent"));
        assert.ok(all.includes("{recursive: Node}"));
        assert.ok(all.includes("[any-key]"));
      });

      it("cuts off a schema nested deeper than RapiDoc expands", async () => {
        let schema = { type: "object", properties: { leaf: { type: "string" } } };
        for (let depth = 0; depth < 12; depth++) {
          schema = { type: "object", properties: { [`level${depth}`]: schema } };
        }
        const all = await printed(schema, { pdfSchemaStyle });
        assert.ok(all.includes("{…}"));
        assert.ok(!all.includes("leaf"));
      });

      it("prints a default of false or 0", async () => {
        const all = await printed(
          {
            type: "object",
            properties: {
              on: { type: "boolean", default: false },
              n: { type: "integer", default: 0 },
            },
          },
          { pdfSchemaStyle },
        );
        assert.ok(all.includes("false"));
        assert.ok(all.includes("0"));
      });
    });
  }

  it("prints a parameter's format, constraints and allowed values", () => {
    const all = texts(
      buildDocDefinition(
        spec({
          "/a": {
            get: operation({
              tags: ["t"],
              parameters: [
                {
                  name: "limit",
                  in: "query",
                  schema: { type: "integer", format: "int32", minimum: 1, maximum: 50 },
                },
                {
                  name: "sort",
                  in: "query",
                  schema: { type: "array", items: { type: "string", enum: ["asc", "desc"] } },
                },
              ],
            }),
          },
        }),
      ).content,
    );
    assert.ok(all.includes("int32"));
    assert.ok(all.includes("Min 1, Max 50"));
    assert.ok(all.includes("array of string"));
    assert.ok(all.includes("asc, desc"));
  });
});

describe("markdownToPdfmake", () => {
  it("returns no nodes for empty or non-string input", () => {
    assert.deepEqual(markdownToPdfmake(""), []);
    assert.deepEqual(markdownToPdfmake(undefined), []);
  });

  it("makes a plain paragraph a text node", () => {
    assert.deepEqual(markdownToPdfmake("Hello world"), [
      { text: "Hello world", margin: [0, 5, 0, 10] },
    ]);
  });

  it("keeps words apart across a line break in the source", () => {
    assert.equal(markdownToPdfmake("first\nsecond")[0].text, "first second");
  });

  it("maps inline formatting to text runs", () => {
    const [paragraph] = markdownToPdfmake("a **b** *c* `d` [e](https://example.com) ~~f~~");
    assert.deepEqual(paragraph.text, [
      { text: "a " },
      { text: "b", bold: true },
      { text: " " },
      { text: "c", italics: true },
      { text: " " },
      { text: "d", style: ["mono"] },
      { text: " " },
      { text: "e", color: "blue", decoration: "underline", link: "https://example.com" },
      { text: " " },
      { text: "f", decoration: "lineThrough" },
    ]);
  });

  it("nests formatting", () => {
    const [paragraph] = markdownToPdfmake("**bold and *both***");
    assert.deepEqual(paragraph.text, [
      { text: "bold and ", bold: true },
      { text: "both", bold: true, italics: true },
    ]);
  });

  it("maps headings, lists, code blocks, quotes, rules and tables", () => {
    const nodes = markdownToPdfmake(
      [
        "## Title",
        "",
        "- one",
        "- two",
        "",
        "3. three",
        "4. four",
        "",
        "```",
        "  code",
        "```",
        "",
        "> quoted",
        "",
        "---",
        "",
        "| A | B |",
        "| - | -: |",
        "| 1 | 2 |",
      ].join("\n"),
    );
    const [heading, bullets, numbers, code, quote, rule, table] = nodes;
    assert.deepEqual(heading, { text: "Title", fontSize: 22, bold: true, marginBottom: 5 });
    assert.deepEqual(bullets.ul, [{ text: "one" }, { text: "two" }]);
    assert.deepEqual(numbers.ol, [{ text: "three" }, { text: "four" }]);
    assert.equal(numbers.start, 3);
    assert.equal(code.text, "  code");
    assert.equal(code.preserveLeadingSpaces, true);
    assert.deepEqual(quote.stack, [{ text: "quoted", margin: [0, 5, 0, 10] }]);
    assert.ok(rule.canvas);
    assert.deepEqual(table.table.body, [
      [
        { text: "A", bold: true, fillColor: "#EEEEEE" },
        { text: "B", bold: true, fillColor: "#EEEEEE", alignment: "right" },
      ],
      [{ text: "1" }, { text: "2", alignment: "right" }],
    ]);
  });

  it("reduces HTML to its text and decodes entities", () => {
    assert.equal(markdownToPdfmake("<div>Tom &amp; Jerry</div>")[0].text, "Tom & Jerry");
    assert.deepEqual(markdownToPdfmake("a <b>b</b> &lt;c&gt; &#65;")[0].text, [
      { text: "a " },
      { text: "b" },
      { text: " <c> A" },
    ]);
  });

  it("prints an image's alt text", () => {
    assert.equal(markdownToPdfmake("![a diagram](https://example.com/x.png)")[0].text, "a diagram");
  });
});
