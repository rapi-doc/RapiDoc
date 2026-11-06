import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";

const here = path.dirname(fileURLToPath(import.meta.url));
const CLI_PATH = path.resolve(here, "../src/index.js");
const FIXTURES = path.join(here, "fixtures/bundle");
const SPLIT = path.join(FIXTURES, "split/openapi.yaml");
const DEMO_PORTAL_DIR =
  process.env.RAPIDOC_DEMO_PORTAL_DIR ??
  path.resolve(here, "../../../../rapi-portal-demo/cosmo-cargo");

const run = (args, options = {}) =>
  spawnSync("node", [CLI_PATH, ...args], { encoding: "utf8", ...options });

function tempDir(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "rapidoc-bundle-"));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  return dir;
}

/** Every $ref string in a value. */
const refsIn = (value, found = []) => {
  if (Array.isArray(value)) value.forEach((item) => refsIn(item, found));
  else if (value && typeof value === "object") {
    if (typeof value.$ref === "string") found.push(value.$ref);
    Object.values(value).forEach((child) => refsIn(child, found));
  }
  return found;
};

test("rapidoc bundle", async (t) => {
  await t.test("other-file $refs become components; in-file ones stay", () => {
    const result = run(["bundle", SPLIT]);
    assert.equal(result.status, 0, result.stderr);
    const doc = parse(result.stdout);

    const refs = refsIn(doc);
    assert.ok(refs.length > 0);
    assert.ok(
      refs.every((ref) => ref.startsWith("#/")),
      `every $ref points into the document: ${refs}`,
    );

    const { schemas, parameters, responses } = doc.components;
    assert.deepEqual(Object.keys(schemas), ["Money", "Order", "Address", "LineItem", "Error"]);
    assert.equal(doc.components.parameters.Id.name, "id", "the entry's own components stay");
    assert.equal(parameters.Page.in, "query", "named after the pointer's last segment");
    assert.equal(responses.NotFound.description, "Not found");

    // Order.yaml: a $ref back to the entry, an in-file $ref, and a $ref to a sibling file.
    assert.equal(schemas.Order.properties.total.$ref, "#/components/schemas/Money");
    assert.equal(schemas.Order.properties.shipTo.$ref, "#/components/schemas/Address");
    assert.equal(schemas.Order.properties.items.items.$ref, "#/components/schemas/LineItem");

    // The same target from two places is one component.
    const orderRefs = refs.filter((ref) => ref === "#/components/schemas/Order");
    assert.equal(orderRefs.length, 2);
    assert.equal(
      responses.NotFound.content["application/json"].schema.$ref,
      "#/components/schemas/Error",
    );

    // A $ref under a vendor extension has no component kind: inlined.
    assert.deepEqual(doc.paths["/orders/{id}"].get["x-internal"], { owner: "team-orders" });
  });

  await t.test("a name taken by different content gets -2, -3", () => {
    const result = run(["bundle", path.join(FIXTURES, "collide/openapi.yaml")]);
    assert.equal(result.status, 0, result.stderr);
    const { schemas } = parse(result.stdout).components;
    assert.deepEqual(Object.keys(schemas), ["Error", "Error-2", "Error-3"]);
    assert.equal(schemas.Error.type, "string", "the entry's own Error is untouched");
    assert.equal(schemas["Error-2"].properties.code.type, "integer");
    assert.equal(schemas["Error-3"].properties.reason.type, "string");
  });

  await t.test("Swagger 2.0 uses definitions, parameters and responses", () => {
    const result = run(["bundle", path.join(FIXTURES, "swagger2/swagger.yaml")]);
    assert.equal(result.status, 0, result.stderr);
    const doc = parse(result.stdout);
    assert.equal(doc.definitions.Pet.type, "object");
    assert.equal(doc.parameters.Limit.name, "limit");
    assert.equal(doc.paths["/pets"].get.parameters[0].$ref, "#/parameters/Limit");
    assert.equal(doc.paths["/pets"].get.responses["200"].schema.items.$ref, "#/definitions/Pet");
    assert.equal(doc.components, undefined);
  });

  await t.test("-o writes the file, JSON by extension, and the result validates", (t) => {
    const dir = tempDir(t);
    const out = path.join(dir, "dist/openapi.json");
    const result = run(["bundle", SPLIT, "-o", out]);
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /Bundled .*openapi\.yaml → .*openapi\.json/);
    assert.match(result.stdout, /7 file\(s\) merged, 6 component\(s\) added/);
    assert.match(result.stdout, /1 \$ref\(s\) inlined/);
    const doc = JSON.parse(fs.readFileSync(out, "utf8"));
    assert.equal(doc.openapi, "3.1.0");

    const validated = run(["validate", out]);
    assert.equal(validated.status, 0, validated.stderr);

    const yaml = run(["bundle", SPLIT, "-o", out, "--format", "yaml"]);
    assert.equal(yaml.status, 0);
    assert.match(
      fs.readFileSync(out, "utf8"),
      /^openapi: 3\.1\.0\n/,
      "--format wins over the extension",
    );
  });

  await t.test("--dereference leaves no $ref", () => {
    const result = run(["bundle", SPLIT, "--dereference", "--format", "json"]);
    assert.equal(result.status, 0, result.stderr);
    const doc = JSON.parse(result.stdout);
    assert.deepEqual(refsIn(doc), []);
    assert.equal(
      doc.paths["/orders/{id}"].get.responses["200"].content["application/json"].schema.properties
        .total.properties.currency.type,
      "string",
    );
    assert.equal(doc.paths["/orders/{id}"].get.parameters[0].name, "id", "in-file $refs too");
  });

  await t.test("--dereference stops on a recursive schema and names the cycle", () => {
    const spec = path.resolve(here, "fixtures/validate/recursive-3.0.yaml");
    const result = run(["bundle", spec, "--dereference", "--no-validate"]);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /Recursive \$ref can't be inlined/);
    assert.match(
      result.stderr,
      /recursive-3\.0\.yaml#\/components\/schemas\/Node\n\s+→ .*#\/components\/schemas\/Node/,
    );
    assert.match(result.stderr, /without --dereference, cycles stay \$refs/);

    const kept = run(["bundle", spec, "--no-validate"]);
    assert.equal(kept.status, 0, "the default mode keeps the cycle as a $ref");
    assert.match(kept.stdout, /\$ref: "#\/components\/schemas\/Node"/);
  });

  await t.test("the result is validated before it's written", (t) => {
    const dir = tempDir(t);
    const out = path.join(dir, "out.yaml");
    const spec = path.resolve(here, "fixtures/validate/recursive-3.0.yaml"); // `type: 12`
    const result = run(["bundle", spec, "-o", out]);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /not valid OpenAPI \(2 error\(s\)\)/);
    assert.match(result.stderr, /#\/components\/schemas\/Node\/properties\/weight\/type/);
    assert.ok(!fs.existsSync(out), "nothing written");
    assert.equal(run(["bundle", spec, "-o", out, "--no-validate"]).status, 0);
    assert.ok(fs.existsSync(out));
  });

  await t.test("a broken $ref is reported with file:line:col, exit 1", () => {
    const result = run(["bundle", path.join(FIXTURES, "broken.yaml")]);
    assert.equal(result.status, 1);
    assert.equal(result.stdout, "");
    assert.match(result.stderr, /1 broken \$ref\(s\)/);
    assert.match(result.stderr, /broken\.yaml:14:17  \$ref "\.\/missing\.yaml": can't read/);
  });

  await t.test(
    "--api <id> bundles that API's spec from rapidoc.config.*",
    { skip: !fs.existsSync(DEMO_PORTAL_DIR) && "demo portal not checked out" },
    (t) => {
      const dir = tempDir(t);
      const out = path.join(dir, "shipments.yaml");
      const result = run(["bundle", "--api", "shipments", "-o", out], { cwd: DEMO_PORTAL_DIR });
      assert.equal(result.status, 0, result.stderr);
      assert.match(result.stdout, /Bundled specs\/shipments\.json → /);
      assert.equal(parse(fs.readFileSync(out, "utf8")).info.title, "Shipment API");

      const unknown = run(["bundle", "--api", "nope"], { cwd: DEMO_PORTAL_DIR });
      assert.equal(unknown.status, 1);
      assert.match(unknown.stderr, /No API "nope" in rapidoc\.config\.\* \(APIs: shipments, /);
    },
  );

  await t.test("a spec is required, must exist, and not with --api", () => {
    assert.equal(run(["bundle"]).status, 2);
    assert.equal(run(["bundle", SPLIT, "--api", "x"]).status, 2);
    const missing = run(["bundle", "nope.yaml"]);
    assert.equal(missing.status, 1);
    assert.match(missing.stderr, /File not found/);
  });
});
