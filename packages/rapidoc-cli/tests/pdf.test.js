import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const CLI_PATH = path.resolve(here, "../src/index.js");
const SPEC = path.join(here, "fixtures/bundle/split/openapi.yaml");

const run = (args, options = {}) =>
  spawnSync("node", [CLI_PATH, ...args], { encoding: "utf8", ...options });

function tempDir(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "rapidoc-pdf-"));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  return dir;
}

const isPdf = (file) => fs.readFileSync(file).subarray(0, 5).toString() === "%PDF-";
const pageCount = (file) =>
  (
    fs
      .readFileSync(file)
      .toString("latin1")
      .match(/\/Type \/Page\b/g) ?? []
  ).length;

test("rapidoc pdf", async (t) => {
  await t.test("writes <spec name>.pdf in the current folder", (t) => {
    const dir = tempDir(t);
    const result = run(["pdf", SPEC], { cwd: dir });
    assert.equal(result.status, 0, result.stderr);
    assert.ok(isPdf(path.join(dir, "openapi.pdf")));
    assert.match(result.stdout, /openapi\.pdf/);
    assert.match(result.stdout, /\d+ page\(s\)/);
  });

  await t.test("-o names the file and creates its folder; --quiet prints nothing", (t) => {
    const dir = tempDir(t);
    const output = path.join(dir, "out/reference.pdf");
    const result = run(["pdf", SPEC, "-o", output, "--quiet"]);
    assert.equal(result.status, 0, result.stderr);
    assert.ok(isPdf(output));
    assert.equal(result.stdout, "");
  });

  await t.test("the section flags change what is in the PDF", (t) => {
    const dir = tempDir(t);
    const whole = path.join(dir, "whole.pdf");
    const bare = path.join(dir, "bare.pdf");
    assert.equal(run(["pdf", SPEC, "-o", whole, "--examples", "--api-list"]).status, 0);
    const result = run([
      "pdf",
      SPEC,
      "-o",
      bare,
      "--no-info",
      "--no-toc",
      "--no-security",
      "--schema-style",
      "table",
      "--title",
      "Orders",
      "--footer",
      "Acme",
    ]);
    assert.equal(result.status, 0, result.stderr);
    assert.ok(pageCount(bare) < pageCount(whole), `${pageCount(bare)} vs ${pageCount(whole)}`);
  });

  await t.test("--labels takes a JSON file of labels", (t) => {
    const dir = tempDir(t);
    const labels = path.join(dir, "labels.json");
    fs.writeFileSync(labels, JSON.stringify({ request: "ANFRAGE", response: "ANTWORT" }));
    const output = path.join(dir, "de.pdf");
    const result = run(["pdf", SPEC, "-o", output, "--labels", labels]);
    assert.equal(result.status, 0, result.stderr);
    assert.ok(isPdf(output));

    fs.writeFileSync(labels, "{ not json");
    const bad = run(["pdf", SPEC, "-o", output, "--labels", labels]);
    assert.equal(bad.status, 1);
    assert.match(bad.stderr, /not valid JSON/);
  });

  await t.test(
    "problems: no spec, a missing file, a file that is not a spec, a bad choice",
    (t) => {
      const dir = tempDir(t);
      const none = run(["pdf"]);
      assert.equal(none.status, 2);
      assert.match(none.stderr, /needs a spec/);

      const missing = run(["pdf", "no-such-spec.yaml"], { cwd: dir });
      assert.equal(missing.status, 1);
      assert.match(missing.stderr, /File not found/);

      const notSpec = path.join(dir, "package.json");
      fs.writeFileSync(notSpec, '{ "name": "not-a-spec" }');
      const wrong = run(["pdf", notSpec], { cwd: dir });
      assert.equal(wrong.status, 1);
      assert.match(wrong.stderr, /Not an OpenAPI or Swagger document/);
      assert.ok(!fs.existsSync(path.join(dir, "package.pdf")), "nothing is written");

      const style = run(["pdf", SPEC, "--schema-style", "fancy"], { cwd: dir });
      assert.equal(style.status, 2);

      const font = run(["pdf", SPEC, "--font", "no-such-font.ttf"], { cwd: dir });
      assert.equal(font.status, 1);
      assert.match(font.stderr, /Font file not found/);
    },
  );

  await t.test("without rapipdf: says what to install", () => {
    const result = run(["pdf", SPEC], {
      env: { ...process.env, RAPIDOC_PDF_MODULE: "rapipdf-not-installed" },
    });
    assert.equal(result.status, 1);
    assert.ok(result.stderr.includes("npm install -D rapipdf"), result.stderr);
  });
});
