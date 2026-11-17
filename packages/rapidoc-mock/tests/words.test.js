// The word splitter of the stateful mock: one reading of a name, whatever its naming style.
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { nameKey, singular, splitWords, trimWords } from "../src/stateful/words.js";

describe("words", () => {
  it("splits every naming style the same way", () => {
    for (const name of [
      "assignedUserId",
      "assigned_user_id",
      "AssignedUserID",
      "assigned-user.id",
    ]) {
      assert.deepEqual(splitWords(name), ["assigned", "user", "id"], name);
    }
    assert.deepEqual(splitWords("HTTPServer2Config"), ["http", "server", "2", "config"]);
    assert.deepEqual(splitWords("petid"), ["petid"], "no boundary to cut at");
    assert.deepEqual(splitWords(""), []);
  });

  it("puts a word in the singular", () => {
    assert.deepEqual(
      ["pets", "categories", "addresses", "boxes", "status", "class", "analysis"].map(singular),
      ["pet", "category", "address", "box", "status", "class", "analysis"],
    );
  });

  it("compares names by their words", () => {
    assert.equal(nameKey("ApiKey"), nameKey("api_keys"));
    assert.equal(nameKey("Pet"), nameKey("PETS"));
    assert.notEqual(nameKey("Pet"), nameKey("PetType"));
  });

  it("trims variant words from a name and keeps its casing", () => {
    const prefixes = new Set(["create", "new"]);
    const suffixes = new Set(["dto", "response", "patch", "out", "output"]);
    const trim = (name) => trimWords(name, prefixes, suffixes);
    assert.equal(trim("CreatePetDto"), "Pet");
    assert.equal(trim("ApiKeyResponseDto"), "ApiKey");
    assert.equal(trim("key_patch"), "key");
    assert.equal(trim("PetOut-Output"), "Pet");
    assert.equal(trim("NewsItem"), "NewsItem", "News is not New");
    assert.equal(trim("Response"), "Response", "one word is always kept");
  });
});
