// The stateful mock's store: collections in memory, keyed by the classifier's key, with a copy per session.
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createStore, valuesAt } from "../src/stateful/store.js";

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

  it("lists with filters on fields, nested fields and array items, and pages", () => {
    const state = newStore().session();
    assert.deepEqual(
      state.list("Pet", { where: { status: "sold" } }).records.map((p) => p.id),
      [2],
    );
    assert.equal(state.list("Pet", { where: { "tags[].name": "calm" } }).total, 2);
    assert.equal(state.list("Pet", { where: { "tags[].name": ["small", "loud"] } }).total, 1);
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
