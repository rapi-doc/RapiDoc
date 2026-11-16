import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { dereference, load } from "@scalar/openapi-parser";
import { breakCircularRefs } from "../../packages/rapidoc/src/utils/spec-loader.js";

/** A spec dereferenced the way spec-parser.js does it: each resolved $ref marked with `x-ref`. */
async function dereferenced(spec) {
  const { filesystem } = await load(spec);
  const { schema } = await dereference(filesystem, {
    onDereference: ({ schema: resolved, ref }) => {
      resolved["x-ref"] = ref;
    },
  });
  return schema;
}

const NODE_REF = "#/components/schemas/Node";
const spec = () => ({
  openapi: "3.0.0",
  info: { title: "Circular", version: "1" },
  paths: {
    "/nodes": {
      get: {
        responses: {
          200: {
            description: "ok",
            content: { "application/json": { schema: { $ref: NODE_REF } } },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Node: {
        type: "object",
        properties: {
          id: { type: "integer" },
          parent: { $ref: NODE_REF },
          children: { type: "array", items: { $ref: NODE_REF } },
        },
      },
    },
  },
});

describe("breakCircularRefs", () => {
  it("returns a tree: no object contains itself", async () => {
    const tree = breakCircularRefs(await dereferenced(spec()));
    assert.doesNotThrow(() => JSON.stringify(tree));
  });

  it("puts the $ref where the schema refers to itself, reached through a $ref", async () => {
    const tree = breakCircularRefs(await dereferenced(spec()));
    const node = tree.paths["/nodes"].get.responses[200].content["application/json"].schema;
    assert.deepEqual(node.properties.parent, { $ref: NODE_REF });
    assert.deepEqual(node.properties.children.items, { $ref: NODE_REF });
    assert.deepEqual(node.properties.id, { type: "integer" });
  });

  it("puts it there too when the schema is reached directly, under components", async () => {
    const tree = breakCircularRefs(await dereferenced(spec()));
    const node = tree.components.schemas.Node;
    assert.deepEqual(node.properties.parent, { $ref: NODE_REF });
    assert.deepEqual(node.properties.children.items, { $ref: NODE_REF });
    assert.deepEqual(node.properties.id, { type: "integer" });
  });

  it("puts it there when nothing else refers to the schema", async () => {
    const onlyComponents = { ...spec(), paths: {} };
    const tree = breakCircularRefs(await dereferenced(onlyComponents));
    const node = tree.components.schemas.Node;
    assert.deepEqual(node.properties.parent, { $ref: NODE_REF });
    assert.deepEqual(node.properties.children.items, { $ref: NODE_REF });
  });

  it("leaves the x-ref markers out and does not change its input", async () => {
    const input = await dereferenced(spec());
    const tree = breakCircularRefs(input);
    assert.ok(!JSON.stringify(tree).includes("x-ref"));
    assert.equal(
      input.components.schemas.Node.properties.parent["x-ref"],
      NODE_REF,
      "the input keeps its marker",
    );
  });
});
