import assert from "node:assert/strict";
import fs from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { createBrowserMock } from "../src/browser.js";
import { loadSpec } from "../src/spec.js";

const SPEC = fileURLToPath(new URL("./fixtures/core-specs/petclinic.yaml", import.meta.url));

describe("the mock without a server (createBrowserMock)", () => {
  it("answers the control API as a function", async () => {
    const mock = await createBrowserMock(await loadSpec(SPEC), { id: "petclinic" });
    const model = await mock.source({ path: "/model" });
    assert.equal(model.status, 200);
    const [api] = model.data.apis;
    assert.equal(api.id, "petclinic");
    assert.deepEqual(api.labels, { confident: 34, needsReview: 0, plainMock: 3 });

    const owners = await mock.source({ path: "/state/petclinic/Owner" });
    assert.equal(owners.data.length, 10);
    const settings = await mock.source({ path: "/settings" });
    assert.equal(settings.data.rows, 10);
    assert.equal(settings.data.stateful, true);

    const operation = await mock.source({ path: "/model/petclinic/operations/listOwners" });
    assert.equal(operation.status, 200);
    assert.equal(typeof operation.data.sample.status, "number");
    const sample = await mock.source({ path: "/model/petclinic/resources/Owner/sample?seed=3" });
    assert.equal(sample.data.seed, 3);
  });

  it("reseeds, and reports a failure with its status", async () => {
    const mock = await createBrowserMock(await loadSpec(SPEC), { id: "petclinic" });
    const reset = await mock.source({ method: "POST", path: "/reset", body: { rows: 3, seed: 7 } });
    assert.equal(reset.status, 204);
    assert.equal((await mock.source({ path: "/state/petclinic/Owner" })).data.length, 3);
    const missing = await mock.source({ path: "/state/petclinic/Nothing" });
    assert.equal(missing.status, 404);
    assert.match(missing.data.detail, /Nothing/);
  });

  it("refuses what is not OpenAPI 3", async () => {
    await assert.rejects(() => createBrowserMock({ swagger: "2.0" }), /Swagger 2\.0/);
  });

  it("imports nothing a browser lacks", () => {
    // every file the browser entry reaches, by following its relative imports
    const seen = new Set();
    const visit = (file) => {
      if (seen.has(file)) return;
      seen.add(file);
      const text = fs.readFileSync(file, "utf8");
      for (const [, from] of text.matchAll(/^import[^"']*["']([^"']+)["']/gm)) {
        assert.ok(!/^node:|^hono|^@hono|^openapi-backend$/.test(from), `${file} imports ${from}`);
        if (from.startsWith(".")) visit(fileURLToPath(new URL(from, `file://${file}`)));
      }
    };
    visit(fileURLToPath(new URL("../src/browser.js", import.meta.url)));
    assert.ok(seen.size > 5);
  });
});
