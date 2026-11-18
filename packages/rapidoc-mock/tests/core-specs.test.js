// The classifier against the core specs (tests/fixtures/core-specs/README.md): real APIs, hand-written and
// generated. The baseline is what the classifier produces today, not what is correct: a change in it shows that a
// classifier change reached real specs. Update the numbers when that is intended.
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadSpec, listOperations } from "../src/spec.js";
import { classifySpec, labelCounts } from "../src/stateful/classify.js";
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
    needsReview: 23,
    plainMock: 57,
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
  "immich.json": { operations: 290, confident: 79, needsReview: 33, plainMock: 178, resources: 36 },
  "nylas.json": { operations: 244, confident: 128, needsReview: 44, plainMock: 72, resources: 38 },
  "apicurio-registry.json": {
    operations: 64,
    confident: 13,
    needsReview: 19,
    plainMock: 32,
    resources: 9,
  },
  "apideck-crm.json": { operations: 40, confident: 32, needsReview: 8, plainMock: 0, resources: 8 },
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
          assert.ok(entry.keyFrom, `${id}: keyFrom`);
        }
      }
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
};

describe("generateSeed on the core specs", () => {
  for (const [file, invalid] of Object.entries(SEED_INVALID)) {
    it(`${file}: no orphaned reference, ${invalid} invalid records`, async () => {
      const doc = await loadSpec(path.join(dir, file));
      const model = classifySpec(doc);
      const { data, report } = await generateSeed(doc, model, { rows: 10, seed: 1 });
      assert.deepEqual(report.orphans, []);
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
