// The stateful mock's store: collections in memory, keyed by the classifier's key, with a copy per session.
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createStore, MAX_SESSIONS, valuesAt } from "../src/stateful/store.js";

const seed = {
  Pet: [
    { id: 1, name: "Biscuit", status: "available", tags: [{ name: "small" }, { name: "calm" }] },
    { id: 2, name: "Miso", status: "sold", tags: [{ name: "calm" }] },
  ],
  User: [{ username: "ada", email: "ada@example.com" }],
};
const newStore = () => {
  const store = createStore({ Pet: { key: "id" }, User: { key: "username" } });
  store.load(seed);
  return store;
};

describe("store", () => {
  it("reads by key, whether the key arrives as a number or as text", () => {
    const state = newStore().session();
    assert.equal(state.get("Pet", 2).name, "Miso");
    assert.equal(state.get("Pet", "2").name, "Miso");
    assert.equal(state.get("User", "ada").email, "ada@example.com");
    assert.equal(state.get("Pet", 99), undefined);
    assert.throws(() => state.get("Nope", 1), /Unknown collection/);
  });

  it("resets the default state and a session, and restores given records", () => {
    const store = newStore();
    const state = store.session();
    const count = () => state.list("Pet").total;
    const seeded = count();
    state.insert("Pet", { name: "New" });
    state.reset();
    assert.equal(count(), seeded, "the default state undoes its writes");

    state.restore({ Pet: [{ id: 50, name: "Only" }] });
    assert.deepEqual(
      state.list("Pet").records.map((pet) => pet.id),
      [50],
    );
    assert.throws(() => state.restore({ Nothing: [] }), /Unknown collection/);
    const mine = store.session("s1");
    mine.restore({ Pet: [] });
    assert.equal(mine.list("Pet").total, 0);
    assert.equal(count(), 1, "a session's restore leaves the default state");
    state.reset();
    assert.equal(count(), seeded, "a reset goes back to the loaded data, not the restored");
  });

  it("keeps the state of a limited number of sessions, dropping the one used longest ago", () => {
    const store = createStore(
      { Pet: { key: "id" }, User: { key: "username" } },
      { maxSessions: 3 },
    );
    store.load(seed);
    const write = (id) => store.session(id).insert("Pet", { name: id });
    const pets = (id) => store.session(id).list("Pet").total;
    ["a", "b", "c"].forEach(write);
    assert.equal(store.sessionCount, 3);
    assert.equal(pets("a"), 3, "a read counts as use: a is now the most recent");
    write("d");
    assert.equal(store.sessionCount, 3);
    assert.equal(pets("b"), 2, "b, used longest ago, reads the seed data again");
    assert.equal(pets("a"), 3);
    assert.equal(pets("c"), 3);
    assert.equal(pets("d"), 3);
    assert.equal(pets("never-wrote"), 2);
    assert.equal(store.sessionCount, 3, "a session that only reads holds nothing");

    store.session("e").restore({ Pet: [] });
    assert.equal(store.sessionCount, 3, "a restore into a new session counts too");
    assert.equal(MAX_SESSIONS, 1000);
  });

  it("numbers a new key like the ones there, as text where they are text", () => {
    const store = createStore({ Issue: { key: "id" }, Note: { key: "id", keyAs: "number" } });
    store.load({ Issue: [{ id: "10" }, { id: "11" }] });
    const state = store.session();
    assert.equal(state.insert("Issue", { title: "new" }).id, "12", "text, since the keys are text");
    assert.equal(state.insert("Note", { text: "first" }).id, "1", "the path takes a number");
    assert.equal(state.insert("Note", { text: "second" }).id, "2");
  });

  it("lists with filters on fields, nested fields and array items, and pages", () => {
    const state = newStore().session();
    assert.deepEqual(
      state.list("Pet", { where: { status: "sold" } }).records.map((p) => p.id),
      [2],
    );
    assert.equal(state.list("Pet", { where: { "tags[].name": "calm" } }).total, 2);
    assert.equal(state.list("Pet", { where: { "tags[].name": ["small", "loud"] } }).total, 1);
    assert.equal(state.list("Pet", { test: (pet) => pet.status !== "sold" }).total > 0, true);
    assert.equal(
      state.list("Pet", { where: { status: "sold" }, test: (pet) => pet.status !== "sold" }).total,
      0,
    );
    const page = state.list("Pet", { offset: 1, limit: 1 });
    assert.deepEqual([page.total, page.records.length, page.records[0].id], [2, 1, 2]);
    assert.deepEqual(valuesAt(seed.Pet[0], "tags[].name"), ["small", "calm"]);
  });

  it("assigns the next key on insert and refuses a key in use", () => {
    const state = newStore().session();
    assert.equal(state.insert("Pet", { name: "Luna" }).id, 3);
    assert.equal(state.insert("Pet", { id: 3, name: "Twin" }), null);
    assert.equal(state.insert("User", { username: "grace" }).username, "grace");
  });

  it("replaces or merges on update and keeps the key", () => {
    const state = newStore().session();
    assert.deepEqual(state.update("Pet", 1, { id: 77, name: "Bix" }), { id: 1, name: "Bix" });
    assert.equal(state.update("Pet", 2, { status: "available" }, { merge: true }).name, "Miso");
    assert.equal(state.update("Pet", 99, {}), undefined);
    assert.equal(state.remove("Pet", 2), true);
    assert.equal(state.remove("Pet", 2), false);
  });

  it("gives each session its own copy, made when it first writes", () => {
    const store = newStore();
    const a = store.session("a");
    const b = store.session("b");
    assert.equal(a.get("Pet", 1).name, "Biscuit");
    assert.equal(store.sessionCount, 0, "reading makes no copy");
    a.remove("Pet", 1);
    b.insert("Pet", { name: "Luna" });
    assert.equal(a.get("Pet", 1), undefined);
    assert.equal(b.get("Pet", 1).name, "Biscuit");
    assert.equal(store.session().list("Pet").total, 2, "the seed state is untouched");
    assert.equal(a.list("Pet").total, 1);
    assert.equal(b.list("Pet").total, 3);
    a.reset();
    assert.equal(a.get("Pet", 1).name, "Biscuit");
    assert.equal(store.sessionCount, 1);
  });

  it("hands out copies: changing a returned record does not change the store", () => {
    const state = newStore().session();
    state.get("Pet", 1).name = "Changed";
    state.list("Pet").records[0].tags.push({ name: "x" });
    assert.equal(state.get("Pet", 1).name, "Biscuit");
    assert.equal(state.get("Pet", 1).tags.length, 2);
    assert.deepEqual(Object.keys(state.snapshot()), ["Pet", "User"]);
  });
});
