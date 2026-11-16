import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { buildDocDefinition, generatePdf, loadSpecFile, renderPdf } from "../src/node.js";

/*
 * rapipdf/node from source: files and spec text in, a PDF out, rendered with pdfmake's Node build.
 */

const here = path.dirname(fileURLToPath(import.meta.url));
const specFile = (name) => path.join(here, "fixtures/specs", name);
const pageCount = (pdf) => (pdf.toString("latin1").match(/\/Type \/Page\b/g) ?? []).length;

function tempDir(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "rapipdf-node-"));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  return dir;
}

describe("generatePdf", () => {
  it("renders a spec file to a PDF", async () => {
    const pdf = await generatePdf(specFile("petstore_extended.yaml"));
    assert.ok(Buffer.isBuffer(pdf));
    assert.equal(pdf.subarray(0, 5).toString(), "%PDF-");
    assert.ok(pageCount(pdf) > 10, `only ${pageCount(pdf)} pages`);
  });

  it("applies the options", async () => {
    const whole = await generatePdf(specFile("data-types.yaml"));
    const bare = await generatePdf(specFile("data-types.yaml"), {
      includeInfo: false,
      includeToc: false,
      includeSecurity: false,
    });
    assert.ok(pageCount(bare) < pageCount(whole));
  });

  it("takes spec text and spec objects", async () => {
    const text = fs.readFileSync(specFile("basic.json"), "utf8");
    assert.equal((await generatePdf(text)).subarray(0, 5).toString(), "%PDF-");
    assert.equal((await generatePdf(JSON.parse(text))).subarray(0, 5).toString(), "%PDF-");
  });

  it("follows $refs to other files, in a Swagger 2.0 spec too", async (t) => {
    const dir = tempDir(t);
    fs.mkdirSync(path.join(dir, "schemas"));
    fs.writeFileSync(
      path.join(dir, "api.yaml"),
      [
        'swagger: "2.0"',
        'info: { title: Split, version: "1" }',
        "paths:",
        "  /pets:",
        "    get:",
        "      tags: [pets]",
        "      responses:",
        '        "200":',
        "          description: ok",
        '          schema: { $ref: "./schemas/pet.yaml#/Pet" }',
      ].join("\n"),
    );
    fs.writeFileSync(
      path.join(dir, "schemas/pet.yaml"),
      [
        "Pet:",
        "  type: object",
        "  properties:",
        "    petName: { type: string }",
        '    parent: { $ref: "#/Pet" }',
      ].join("\n"),
    );
    const spec = await loadSpecFile(path.join(dir, "api.yaml"));
    const pet = spec.paths["/pets"].get.responses[200].content["application/json"].schema;
    assert.deepEqual(pet.properties.petName, { type: "string" });
    assert.deepEqual(pet.properties.parent, { $ref: "#/Pet" });
    assert.equal(
      (await generatePdf(path.join(dir, "api.yaml"))).subarray(0, 5).toString(),
      "%PDF-",
    );
  });

  it("rejects a file that does not exist or is not a spec", async (t) => {
    await assert.rejects(() => generatePdf("no-such-spec.yaml"), /File not found/);
    const dir = tempDir(t);
    const notSpec = path.join(dir, "package.json");
    fs.writeFileSync(notSpec, '{ "name": "not-a-spec" }');
    await assert.rejects(() => generatePdf(notSpec), /Not an OpenAPI or Swagger document/);
  });

  it("uses a font file in place of the built-in one", async () => {
    const require = createRequire(import.meta.url);
    const font = path.join(
      path.dirname(require.resolve("pdfmake/package.json")),
      "fonts/Roboto/Roboto-Italic.ttf",
    );
    const pdf = await generatePdf(specFile("basic.json"), { font });
    assert.equal(pdf.subarray(0, 5).toString(), "%PDF-");
    await assert.rejects(
      () => generatePdf(specFile("basic.json"), { font: "no-such-font.ttf" }),
      /Font file not found/,
    );
  });
});

describe("renderPdf", () => {
  it("does not fetch or read what a document definition points at", async () => {
    const definition = buildDocDefinition(await loadSpecFile(specFile("basic.json")));
    definition.content.push({ image: "https://example.com/pixel.png" });
    await assert.rejects(() => renderPdf(definition));
    const local = buildDocDefinition(await loadSpecFile(specFile("basic.json")));
    local.content.push({ image: specFile("basic.json") });
    await assert.rejects(() => renderPdf(local));
  });
});
