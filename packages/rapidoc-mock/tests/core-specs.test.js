// The classifier against the core specs (tests/fixtures/core-specs/README.md): real APIs, hand-written and
// generated. The baseline is what the classifier produces today, not what is correct: a change in it shows that a
// classifier change reached real specs. Update the numbers when that is intended.
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadSpec, listOperations } from "../src/spec.js";
import { classifySpec, labelCounts, operationIds } from "../src/stateful/classify.js";
import { generateSeed } from "../src/stateful/seed.js";

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), "fixtures/core-specs");

/**
 * Per spec: its operations, how many carry each label (see `labelCounts`), and its resources.
 * confident + needsReview + plainMock = operations.
 */
const BASELINE = {
  "museum.yaml": { operations: 8, confident: 4, needsReview: 2, plainMock: 2, resources: 2 },
  "realworld.yaml": { operations: 19, confident: 8, needsReview: 2, plainMock: 9, resources: 3 },
  "eshop-catalog.json": {
    operations: 14,
    confident: 8,
    needsReview: 4,
    plainMock: 2,
    resources: 3,
  },
  "petclinic.yaml": { operations: 37, confident: 34, needsReview: 0, plainMock: 3, resources: 6 },
  "pokeapi.yaml": { operations: 102, confident: 56, needsReview: 44, plainMock: 2, resources: 50 },
  "calcom-v2.json": {
    operations: 121,
    confident: 41,
    needsReview: 26,
    plainMock: 54,
    resources: 17,
  },
  "ably-control.json": {
    operations: 22,
    confident: 10,
    needsReview: 8,
    plainMock: 4,
    resources: 5,
  },
  "mealie.json": {
    operations: 285,
    confident: 122,
    needsReview: 44,
    plainMock: 119,
    resources: 34,
  },
  "immich.json": { operations: 290, confident: 79, needsReview: 35, plainMock: 176, resources: 36 },
  "nylas.json": { operations: 244, confident: 128, needsReview: 45, plainMock: 71, resources: 38 },
  "apicurio-registry.json": {
    operations: 64,
    confident: 13,
    needsReview: 20,
    plainMock: 31,
    resources: 9,
  },
  "apideck-crm.json": { operations: 40, confident: 32, needsReview: 8, plainMock: 0, resources: 8 },
  // Added after the classifier was written, because they showed what the first twelve did not (see the README)
  "jira.json": { operations: 630, confident: 171, needsReview: 82, plainMock: 377, resources: 69 },
  "digitalocean.yaml": {
    operations: 916,
    confident: 314,
    needsReview: 150,
    plainMock: 452,
    resources: 131,
  },
};

describe("classifySpec on the core specs", () => {
  for (const [file, expected] of Object.entries(BASELINE)) {
    it(`${file} matches its baseline`, async () => {
      const doc = await loadSpec(path.join(dir, file));
      const model = classifySpec(doc);
      assert.deepEqual(
        {
          operations: listOperations(doc).length,
          ...labelCounts(model),
          resources: Object.keys(model.resources).length,
        },
        expected,
      );
      // Every mapped operation points at a resource the model has, with a key where it needs one
      for (const [id, entry] of Object.entries(model.operations)) {
        if (entry.action === "none") continue;
        assert.ok(model.resources[entry.resource], `${id}: resource ${entry.resource}`);
        if (["read", "update", "patch", "delete"].includes(entry.action)) {
          // or it is marked for review: an update with no key in the path or the body (Jira has two), which
          // the mock then answers without state
          assert.ok(entry.keyFrom || entry.review, `${id}: keyFrom`);
        }
      }
    });
  }
});

/**
 * How completely each spec's records are mapped. The label counts above can look good while resources are half
 * working: a create that is stored and a list that is not means the new record never shows up.
 *
 * A record is an item path with a GET (`/pets/{id}`). Of those: `lists` and `creates` are the collection's GET
 * and POST that use the store, out of the ones the spec has; `complete` is the records whose read, list, create,
 * update and delete all work, where the spec has them. "Work" is strict: an operation on one record counts only
 * when its resource has a key. Today's numbers; they should only go up.
 */
const COMPLETENESS = {
  "museum.yaml": { records: 1, lists: "1/1", creates: "1/1", complete: 1 },
  "realworld.yaml": { records: 2, lists: "1/1", creates: "1/1", complete: 2 },
  "eshop-catalog.json": { records: 5, lists: "2/2", creates: "1/1", complete: 5 },
  "petclinic.yaml": { records: 7, lists: "6/6", creates: "6/6", complete: 7 },
  "pokeapi.yaml": { records: 50, lists: "50/50", creates: "0/0", complete: 50 },
  "calcom-v2.json": { records: 17, lists: "12/13", creates: "11/12", complete: 12 },
  "ably-control.json": { records: 1, lists: "1/1", creates: "1/1", complete: 0 },
  "mealie.json": { records: 45, lists: "32/34", creates: "24/25", complete: 38 },
  "immich.json": { records: 20, lists: "18/18", creates: "11/11", complete: 18 },
  "nylas.json": { records: 41, lists: "33/36", creates: "28/30", complete: 32 },
  "apicurio-registry.json": { records: 11, lists: "5/8", creates: "5/6", complete: 3 },
  "apideck-crm.json": { records: 8, lists: "8/8", creates: "8/8", complete: 8 },
  "jira.json": { records: 58, lists: "29/36", creates: "24/27", complete: 41 },
  "digitalocean.yaml": { records: 120, lists: "82/107", creates: "84/88", complete: 83 },
};

/** The measure of COMPLETENESS for one document and its model. */
function completeness(doc, model) {
  const ids = operationIds(doc);
  const shapeOf = (route) =>
    `/${route
      .split("/")
      .filter(Boolean)
      .map((segment) => (/^\{.+\}$/.test(segment) ? "{}" : segment))
      .join("/")}`;
  // An operation works when the mock really answers it from the store: reading, updating or deleting one
  // record needs the resource's key (without one the mock answers as a plain mock, whatever the map says)
  const works = (entry) =>
    Boolean(entry) &&
    entry.action !== "none" &&
    (entry.action === "list" ||
      entry.action.startsWith("create") ||
      Boolean(model.resources[entry.resource]?.key));
  const byShape = new Map();
  for (const { method, path: route } of listOperations(doc)) {
    const entry = model.operations[ids.get(`${method} ${route}`)];
    const shape = shapeOf(route);
    byShape.set(shape, [...(byShape.get(shape) || []), { method, mapped: works(entry) }]);
  }
  const result = { records: 0, lists: [0, 0], creates: [0, 0], complete: 0 };
  for (const [shape, here] of byShape) {
    const read = here.find((op) => op.method === "get");
    if (!shape.endsWith("/{}") || !read) continue;
    result.records += 1;
    const collection = byShape.get(shape.slice(0, -3)) || [];
    const list = collection.find((op) => op.method === "get");
    const create = collection.find((op) => op.method === "post");
    const others = [
      here.find((op) => op.method === "put" || op.method === "patch"),
      here.find((op) => op.method === "delete"),
    ];
    if (list) result.lists = [result.lists[0] + (list.mapped ? 1 : 0), result.lists[1] + 1];
    if (create) {
      result.creates = [result.creates[0] + (create.mapped ? 1 : 0), result.creates[1] + 1];
    }
    if ([read, list, create, ...others].every((op) => !op || op.mapped)) result.complete += 1;
  }
  return { ...result, lists: result.lists.join("/"), creates: result.creates.join("/") };
}

describe("how completely the core specs' records are mapped", () => {
  for (const [file, expected] of Object.entries(COMPLETENESS)) {
    it(`${file}: ${expected.complete} of ${expected.records} records complete`, async () => {
      const doc = await loadSpec(path.join(dir, file));
      assert.deepEqual(completeness(doc, classifySpec(doc)), expected);
    });
  }
});

/**
 * Seed data per spec, 10 records a resource: how many records miss their own schema. Every spec must come out
 * with no orphaned reference; the invalid counts are today's, and should only go down.
 */
const SEED_INVALID = {
  "museum.yaml": 0,
  "realworld.yaml": 0,
  "eshop-catalog.json": 0,
  "petclinic.yaml": 0,
  "pokeapi.yaml": 0,
  "calcom-v2.json": 24,
  "ably-control.json": 0,
  "mealie.json": 41,
  "immich.json": 0,
  "nylas.json": 21,
  "apicurio-registry.json": 1,
  "apideck-crm.json": 0,
  "jira.json": 60,
  "digitalocean.yaml": 69,
};

/**
 * Specs whose seed data cannot be generated today, with the error: a known failure, kept visible. The mock then
 * serves the whole API without state. Fixing one moves it to SEED_INVALID.
 */
const SEED_FAILS = {};

describe("generateSeed on the core specs", () => {
  for (const [file, error] of Object.entries(SEED_FAILS)) {
    it(`${file}: known failure`, async () => {
      const doc = await loadSpec(path.join(dir, file));
      await assert.rejects(generateSeed(doc, classifySpec(doc), { rows: 10, seed: 1 }), error);
    });
  }
  for (const [file, invalid] of Object.entries(SEED_INVALID)) {
    it(`${file}: no orphaned reference, ${invalid} invalid records`, async () => {
      const doc = await loadSpec(path.join(dir, file));
      const model = classifySpec(doc);
      const { data, report } = await generateSeed(doc, model, { rows: 10, seed: 1 });
      assert.deepEqual(report.orphans, []);
      assert.deepEqual(report.failed, {}, "every resource could be seeded");
      for (const name of Object.keys(model.resources)) {
        assert.ok(Array.isArray(data[name]), `${name} has records`);
      }
      assert.equal(
        Object.values(report.invalid).reduce((sum, count) => sum + count, 0),
        invalid,
      );
    });
  }
});
