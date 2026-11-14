import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  parseOperationFilter,
  operationFacts,
  operationRank,
} from "../../packages/rapidoc/src/utils/filter-operations.js";
import ProcessSpec from "../../packages/rapidoc/src/utils/spec-parser.js";

const op = (method, path, extra = {}) => operationFacts(method, path, extra);
const shown = (text, facts) => operationRank(parseOperationFilter(text), facts) >= 0;

const spec = {
  openapi: "3.1.0",
  info: { title: "Filter", version: "1" },
  tags: [{ name: "pet" }, { name: "store" }],
  paths: {
    "/pet": {
      post: { operationId: "addPet", tags: ["pet"] },
      put: { operationId: "updatePet", tags: ["pet"], deprecated: true },
    },
    "/pet/{petId}": {
      get: { operationId: "getPetById", tags: ["pet"], "x-badges": [{ label: "Beta" }] },
      delete: { operationId: "deletePet", tags: ["pet"], "x-badges": [{ label: "Internal" }] },
    },
    "/petition": { get: { operationId: "listPetitions", tags: ["store"] } },
    "/store/order": { post: { operationId: "placeOrder", tags: ["store"] } },
  },
};
// The operationIds a filter shows, in the order they are listed (tags, then their operations)
const listed = async (text) => {
  const parsed = await ProcessSpec(
    structuredClone(spec),
    false,
    false,
    false,
    null,
    "",
    "",
    "",
    "",
    text,
  );
  return parsed.tags.flatMap((t) => t.paths.map((p) => p.operationId));
};

describe("filter-operations: terms", () => {
  it("matches operationIds exactly", () => {
    assert.ok(shown("getPetById", op("get", "/pet/{petId}", { operationId: "getPetById" })));
    assert.ok(!shown("getPet", op("get", "/pet/{petId}", { operationId: "getPetById" })));
  });

  it("matches a method and path, or a path for every method, without substrings", () => {
    assert.ok(shown("GET /pet/{petId}", op("get", "/pet/{petId}")));
    assert.ok(!shown("GET /pet/{petId}", op("delete", "/pet/{petId}")));
    assert.ok(shown("/pet", op("put", "/pet")));
    assert.ok(!shown("/pet", op("get", "/petition")));
    assert.ok(!shown("/pet", op("get", "/pet/{petId}")));
  });

  it("matches path globs: * one segment, ** any number", () => {
    assert.ok(shown("/pet/*", op("get", "/pet/{petId}")));
    assert.ok(!shown("/pet/*", op("get", "/pet/{petId}/uploadImage")));
    assert.ok(shown("/pet/**", op("get", "/pet/{petId}/uploadImage")));
    assert.ok(shown("/pet/**", op("post", "/pet")));
    assert.ok(!shown("/pet/**", op("get", "/petition")));
    assert.ok(shown("/**", op("get", "/anything/at/all")));
  });

  it("matches tags and badges without case, quoted names with spaces, and deprecated", () => {
    assert.ok(shown("tag:STORE", op("get", "/x", { tags: ["store"] })));
    assert.ok(shown('tag:"Pet Store"', op("get", "/x", { tags: ["Pet Store"] })));
    assert.ok(shown("badge:beta", op("get", "/x", { "x-badges": [{ label: "Beta" }] })));
    assert.ok(shown("deprecated", op("get", "/x", { deprecated: true })));
    assert.ok(!shown("deprecated", op("get", "/x")));
  });

  it("leaves out ! terms, and shows everything without an include term", () => {
    assert.ok(!shown("!badge:Internal", op("get", "/x", { "x-badges": [{ label: "Internal" }] })));
    assert.ok(shown("!badge:Internal", op("get", "/x")));
    assert.ok(!shown("/pet/** !deprecated", op("put", "/pet", { deprecated: true })));
    assert.equal(parseOperationFilter("  , "), null);
  });

  it("reads commas as separators", () => {
    const filter = parseOperationFilter("addPet,placeOrder");
    assert.equal(filter.include.length, 2);
  });
});

describe("filter-operations: in the parsed spec", () => {
  it("keeps only matching operations and drops empty paths", async () => {
    assert.deepEqual(await listed("/pet/** !deprecated !badge:Internal"), ["addPet", "getPetById"]);
    assert.deepEqual(await listed("tag:store"), ["listPetitions", "placeOrder"]);
  });

  it("lists operations, and their tags, in the order of the first term they match", async () => {
    assert.deepEqual(await listed("placeOrder getPetById addPet"), [
      "placeOrder",
      "getPetById",
      "addPet",
    ]);
  });

  it("shows every operation without a filter", async () => {
    assert.equal((await listed("")).length, 6);
  });
});
