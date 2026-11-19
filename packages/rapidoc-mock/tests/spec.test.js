import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { loadSpec } from "../src/spec.js";
import { FIXTURES } from "./helpers.js";

/** Serves the fixtures folder on a free localhost port, as a local API server serves its spec. */
function serveFixtures() {
  const server = http.createServer((request, response) => {
    const file = path.join(FIXTURES, decodeURIComponent(new URL(request.url, "http://x").pathname));
    if (!file.startsWith(FIXTURES) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      response.writeHead(404).end("not here");
      return;
    }
    response.writeHead(200, { "content-type": "application/yaml" }).end(fs.readFileSync(file));
  });
  return new Promise((resolve) =>
    server.listen(0, "127.0.0.1", () =>
      resolve({ base: `http://127.0.0.1:${server.address().port}`, close: () => server.close() }),
    ),
  );
}

describe("loadSpec from an address", () => {
  let served;
  before(async () => {
    served = await serveFixtures();
  });
  after(() => served.close());

  it("reads a spec at a localhost address, with the files its $refs name on that server", async () => {
    const doc = await loadSpec(`${served.base}/orders.yaml`);
    assert.equal(doc.info.title, "Orders API");
    // bundled: every $ref left points inside the document
    const refs = JSON.stringify(doc).match(/"\$ref":"[^"]*"/g) || [];
    assert.ok(refs.length > 0);
    assert.ok(
      refs.every((ref) => ref.includes('"#')),
      refs.find((ref) => !ref.includes('"#')),
    );
  });

  it("says which address failed and how it answered", async () => {
    await assert.rejects(loadSpec(`${served.base}/missing.yaml`), /missing\.yaml answered 404/);
  });
});
