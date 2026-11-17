// The stateful mock's seed generator: the first records of every resource, from the spec alone.
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadSpec } from "../src/spec.js";
import { classifySpec } from "../src/stateful/classify.js";
import { generateSeed } from "../src/stateful/seed.js";
import { entityDomain, generatorFor } from "../src/stateful/generators.js";
import { valuesFor } from "../src/engine/values.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const petstore = await loadSpec(path.resolve(here, "../../../docs/public/specs/petstore-3.2.yaml"));
const model = classifySpec(petstore);

describe("generateSeed on the Petstore", async () => {
  const { data, report } = await generateSeed(petstore, model, { rows: 6, seed: 1 });

  it("fills resources in the order of their relations, with no orphaned reference", () => {
    assert.ok(report.order.indexOf("Pet") < report.order.indexOf("Order"));
    assert.deepEqual(report.records, { Pet: 6, Order: 6, User: 6 });
    assert.deepEqual(report.orphans, []);
    assert.deepEqual(report.invalid, {});
    const petIds = new Set(data.Pet.map((pet) => pet.id));
    for (const order of data.Order) assert.ok(petIds.has(order.petId), `petId ${order.petId}`);
  });

  it("gives every record its own key", () => {
    assert.deepEqual(
      data.Pet.map((pet) => pet.id),
      [1, 2, 3, 4, 5, 6],
    );
    assert.equal(new Set(data.User.map((user) => user.username)).size, 6);
  });

  it("covers every value of an enum", () => {
    assert.deepEqual(
      new Set(data.Pet.map((pet) => pet.status)),
      new Set(["available", "pending", "sold"]),
    );
  });

  it("names what is nested in a record too", () => {
    assert.deepEqual(data.Pet[1].category.name, "Category 2");
    assert.ok(data.Pet[1].tags.every((tag) => /^Tag \d+$/.test(tag.name)));
    assert.equal(data.Pet[0].category.name, "Dogs", "the first record keeps the spec's example");
  });

  it("shows the spec's examples in the first record and varies the rest", () => {
    assert.equal(data.Pet[0].name, "doggie");
    assert.equal(data.User[0].firstName, "John");
    assert.ok(new Set(data.Pet.map((pet) => pet.name)).size > 3);
  });

  it("keeps a person's fields consistent", () => {
    for (const user of data.User.slice(1)) {
      const expected = `${user.firstName}.${user.lastName}`.toLowerCase();
      assert.equal(user.username, expected);
      assert.equal(user.email, `${expected}@example.com`);
    }
  });

  it("gives the same data for the same seed, and other data for another", async () => {
    const again = await generateSeed(petstore, model, { rows: 6, seed: 1 });
    const other = await generateSeed(petstore, model, { rows: 6, seed: 2 });
    assert.deepEqual(again.data, data);
    assert.notDeepEqual(other.data.User, data.User);
  });

  it("takes row counts per resource", async () => {
    const sized = await generateSeed(petstore, model, { rows: { default: 2, Order: 5 } });
    assert.deepEqual(sized.report.records, { Pet: 2, Order: 5, User: 2 });
  });
});

describe("generateSeed: cycles and references to a record's own kind", async () => {
  const json = (schema) => ({ content: { "application/json": { schema } } });
  const ref = (name) => ({ $ref: `#/components/schemas/${name}` });
  const item = (operationId, name) => ({
    get: { operationId, responses: { 200: json(ref(name)) } },
  });
  const int = { type: "integer" };
  const doc = {
    openapi: "3.1.0",
    info: {},
    paths: { "/teams/{id}": item("team", "Team"), "/members/{id}": item("member", "Member") },
    components: {
      schemas: {
        Team: {
          type: "object",
          required: ["id"],
          properties: { id: int, leadMemberId: int, parentId: int },
        },
        Member: {
          type: "object",
          required: ["id", "teamId"],
          properties: { id: int, teamId: int },
        },
      },
    },
  };
  const cyclic = classifySpec(doc);
  const { data, report } = await generateSeed(doc, cyclic, { rows: 4 });

  it("fills a cycle in two passes and leaves no orphan", () => {
    assert.deepEqual(report.orphans, []);
    const members = new Set(data.Member.map((m) => m.id));
    const teams = new Set(data.Team.map((t) => t.id));
    for (const member of data.Member) assert.ok(teams.has(member.teamId));
    for (const team of data.Team) assert.ok(members.has(team.leadMemberId));
  });

  it("points parentId at an earlier record of the same kind, never at itself", () => {
    assert.ok(!("parentId" in data.Team[0]), "the first has no parent");
    for (const [i, team] of data.Team.entries()) {
      if (i > 0) assert.ok(team.parentId < team.id, `team ${team.id} -> ${team.parentId}`);
    }
  });
});

describe("entityDomain and generatorFor", () => {
  const value = (entity, fields, field) => {
    const generator = generatorFor(entityDomain(entity, fields), field);
    return generator?.({ values: valuesFor(7), entity, index: 2 });
  };

  it("knows an entity by the words of its name, else by its fields", () => {
    assert.equal(entityDomain("Pet", ["name", "status"]), "animal");
    assert.equal(
      entityDomain("Elephant", ["name"]),
      "animal",
      "from the library's list of animals",
    );
    assert.equal(entityDomain("ManagedUser", ["id"]), "person");
    assert.equal(entityDomain("Member", ["firstName", "lastName", "email"]), "person");
    assert.equal(entityDomain("MenuItem", ["name"]), "", "an item is not a product");
    assert.equal(entityDomain("Notetaker", ["code", "level"]), "");
  });

  it("names a thing by its domain, on the entity or in the field", () => {
    const petName = value("Pet", [], "name");
    assert.equal(value("Elephant", [], "name"), petName);
    for (const field of ["petName", "animal_name", "elephantName", "beastName"]) {
      assert.equal(value("Order", [], field), petName, field);
    }
    assert.match(value("Member", ["firstName", "lastName"], "name"), /^\S+ \S+/);
    assert.notEqual(value("Invoice", [], "companyName"), petName);
  });

  it("never guesses a domain it does not know", () => {
    assert.equal(value("Notetaker", [], "name"), "Notetaker 3");
    assert.equal(value("MenuItem", [], "name"), "Menu Item 3");
    assert.equal(value("Task", [], "state"), undefined, "state is often a status, not a place");
  });

  it("keeps a field's own meaning over a domain word in it", () => {
    assert.match(
      value("User", [], "userName"),
      /^[a-z]+\.[a-z]+$/,
      "a username, not a person's name",
    );
  });

  it("gives the same values for the same seed", () => {
    assert.equal(value("Pet", [], "name"), value("Pet", [], "name"));
  });
});
