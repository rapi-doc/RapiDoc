import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ProcessSpec, {
  groupByParentTags,
  normalizeExampleObjects,
} from "../../packages/rapidoc/src/utils/spec-parser.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const op = (tags, extra = {}) => ({ tags, responses: { 200: { description: "ok" } }, ...extra });

const parse = (spec) => ProcessSpec.call({}, spec);

describe("OpenAPI 3.2 tags: summary, parent, kind", () => {
  it("shows a tag's summary as its name, x-displayName still winning", async () => {
    const spec = await parse({
      openapi: "3.2.0",
      info: { title: "T", version: "1" },
      tags: [
        { name: "pet", summary: "Pets" },
        { name: "store", summary: "Store", "x-displayName": "The Store" },
        { name: "user" },
      ],
      paths: {
        "/pet": { get: op(["pet"]) },
        "/store": { get: op(["store"]) },
        "/user": { get: op(["user"]) },
      },
    });
    assert.deepEqual(
      spec.tags.map((t) => t.displayName),
      ["Pets", "The Store", "user"],
    );
  });

  it("groups child tags under their parent, with the parent's summary as heading", async () => {
    const spec = await parse({
      openapi: "3.2.0",
      info: { title: "T", version: "1" },
      tags: [
        { name: "shop", summary: "Shop", description: "Pets and orders", kind: "nav" },
        { name: "pet", summary: "Pets", parent: "shop" },
        { name: "store", summary: "Store", parent: "shop" },
        { name: "user", summary: "Users" },
      ],
      paths: {
        "/pet": { get: op(["pet"]) },
        "/store": { get: op(["store"]) },
        "/user": { get: op(["user"]) },
      },
    });
    assert.equal(spec.tagGroups.length, 1);
    const [shop] = spec.tagGroups;
    assert.equal(shop.displayName, "Shop");
    assert.equal(shop.description, "Pets and orders");
    assert.equal(shop.elementId, "tag-group--shop");
    assert.deepEqual(
      shop.tags.map((t) => t.name),
      ["pet", "store"],
    );
    // The parent has no operations: it is the group heading, not a tag section of its own
    assert.deepEqual(
      spec.tags.map((t) => t.name),
      ["pet", "store", "user"],
    );
    // Operation anchors do not change (no tag prefix, unlike x-tagGroups)
    assert.equal(spec.tags[0].paths[0].elementId, "get-pet");
  });

  it("keeps a parent with operations first in its group and puts grandchildren under the root", async () => {
    const spec = await parse({
      openapi: "3.2.0",
      info: { title: "T", version: "1" },
      tags: [
        { name: "a", summary: "A" },
        { name: "b", parent: "a" },
        { name: "c", parent: "b" },
      ],
      paths: {
        "/c": { get: op(["c"]) },
        "/b": { get: op(["b"]) },
        "/a": { get: op(["a"]) },
      },
    });
    assert.equal(spec.tagGroups.length, 1);
    assert.deepEqual(
      spec.tagGroups[0].tags.map((t) => t.name),
      ["a", "b", "c"],
    );
  });

  it("ignores an unknown parent and survives a parent cycle", () => {
    const tags = [
      { name: "x", paths: [{}] },
      { name: "y", paths: [{}] },
      { name: "z", paths: [{}] },
    ];
    assert.deepEqual(groupByParentTags({ tags: [{ name: "x", parent: "missing" }] }, tags), []);
    const groups = groupByParentTags(
      {
        tags: [{ name: "x", parent: "y" }, { name: "y", parent: "x" }, { name: "z" }],
      },
      tags,
    );
    assert.equal(
      groups.flatMap((g) => g.tags).length,
      2,
      "x and y are grouped once each, z stays ungrouped",
    );
  });

  it("leaves x-tagGroups in charge when the spec has them", async () => {
    const spec = await parse({
      openapi: "3.2.0",
      info: { title: "T", version: "1" },
      "x-tagGroups": [{ name: "Everything", tags: ["pet", "store"] }],
      tags: [
        { name: "shop", summary: "Shop" },
        { name: "pet", parent: "shop" },
        { name: "store", parent: "shop" },
      ],
      paths: { "/pet": { get: op(["pet"]) }, "/store": { get: op(["store"]) } },
    });
    assert.deepEqual(
      spec.tagGroups.map((g) => g.name),
      ["Everything"],
    );
  });

  it("files operations under navigation tags only, and shows badge tags as badges", async () => {
    const spec = await parse({
      openapi: "3.2.0",
      info: { title: "T", version: "1" },
      tags: [
        { name: "pet", kind: "nav" },
        { name: "beta", summary: "Beta", kind: "badge" },
        { name: "partners", kind: "audience" },
      ],
      paths: {
        "/pet": { get: op(["pet", "beta", "partners"]) },
        "/partner-only": { get: op(["partners"]) },
        "/both": {
          get: op(["pet", "beta"], { "x-badges": [{ label: "Beta", color: "orange" }] }),
        },
      },
    });
    assert.deepEqual(
      spec.tags.map((t) => t.name),
      ["pet", "partners"],
      "beta is never a section; partners only holds the operation that has no navigation tag",
    );
    const getPet = spec.tags[0].paths.find((p) => p.path === "/pet");
    assert.deepEqual(getPet.xBadges, [{ label: "Beta", color: "primary-color" }]);
    // A badge the spec already lists under x-badges is not repeated
    const both = spec.tags[0].paths.find((p) => p.path === "/both");
    assert.deepEqual(both.xBadges, [{ label: "Beta", color: "orange" }]);
  });
});

describe("OpenAPI 3.2 Example Objects: dataValue and serializedValue", () => {
  it("copies dataValue, else serializedValue, to value, and leaves value and schemas alone", () => {
    const schema = { type: "object", examples: { a: { dataValue: 1 } } };
    const node = {
      content: {
        "application/json": {
          schema,
          examples: {
            data: { dataValue: { id: 1 } },
            serialized: { serializedValue: "id=1" },
            both: { value: "v", dataValue: "d" },
          },
        },
      },
    };
    normalizeExampleObjects(node);
    const { examples } = node.content["application/json"];
    assert.deepEqual(examples.data.value, { id: 1 });
    assert.equal(examples.serialized.value, "id=1");
    assert.equal(examples.both.value, "v");
    assert.equal(schema.examples.a.value, undefined);
  });

  const readSpec = (name) =>
    fs.readFileSync(path.resolve(__dirname, `../../docs/public/specs/${name}`), "utf8");

  it("parses the 3.2 Petstore with nested tags: groups, names and dataValue examples", async () => {
    const spec = await parse(readSpec("petstore-with-tag-nesting-3.2.yaml"));
    assert.equal(spec.specLoadError, false);
    assert.deepEqual(
      spec.tagGroups.map((g) => [g.displayName, g.tags.map((t) => t.displayName)]),
      [
        ["Shop", ["Pets", "Store"]],
        ["Accounts", ["Users"]],
      ],
    );
    const ops = spec.tags.flatMap((t) => t.paths);
    assert.equal(ops.length, 19);
    const inventory = ops.find((p) => p.operationId === "getInventory");
    assert.deepEqual(
      inventory.responses["200"].content["application/json"].examples.inventory.value,
      { available: 12, pending: 3, sold: 41 },
    );
  });

  it("parses the 3.2 Petstore without nesting: flat tags, plus QUERY, COPY and PURGE", async () => {
    const spec = await parse(readSpec("petstore-3.2.yaml"));
    assert.equal(spec.specLoadError, false);
    assert.deepEqual(spec.tagGroups, []);
    assert.deepEqual(
      spec.tags.map((t) => [t.displayName, t.paths.length]),
      [
        ["Pets", 10],
        ["Store", 5],
        ["Users", 7],
      ],
    );
  });
});
