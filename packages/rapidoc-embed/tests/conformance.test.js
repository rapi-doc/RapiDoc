// Runs conformance/fixtures/ against src/core.js. An integration in another language runs the same
// fixtures against its own port (conformance/README.md). `UPDATE_FIXTURES=1 npm test` rewrites the
// expected files after a deliberate change to the contract.
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { renderHostPage, renderOAuthReceiverPage, embedRoutes } from "../src/core.js";

const fixturesDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../conformance/fixtures",
);
const update = process.env.UPDATE_FIXTURES === "1";

const RENDER = {
  host: { file: "expected.html", run: renderHostPage },
  "oauth-receiver": { file: "expected.html", run: renderOAuthReceiverPage },
  routes: {
    file: "expected.json",
    run: (options) => `${JSON.stringify(embedRoutes(options), null, 2)}\n`,
  },
};

describe("conformance fixtures", () => {
  const names = fs.readdirSync(fixturesDir).filter((name) => !name.startsWith("."));

  it("has fixtures", () => {
    assert.ok(names.length >= 15);
  });

  for (const name of names) {
    it(name, () => {
      const dir = path.join(fixturesDir, name);
      const input = JSON.parse(fs.readFileSync(path.join(dir, "input.json"), "utf8"));
      assert.ok(input.description, "every fixture says what it checks");
      const { file, run } = RENDER[input.page];
      const actual = run(input.options);
      if (update) fs.writeFileSync(path.join(dir, file), actual);
      assert.equal(actual, fs.readFileSync(path.join(dir, file), "utf8"));
    });
  }
});
