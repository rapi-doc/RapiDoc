import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { RULES } from "../src/lint/rules/index.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const CLI_PATH = path.resolve(here, "../src/index.js");
const FIXTURES = path.join(here, "fixtures/lint");
const MESSY = path.join(FIXTURES, "messy.yaml");
const CLEAN = path.join(FIXTURES, "clean.yaml");
const EVERY_RULE_ON = RULES.flatMap((rule) => ["--rule", `${rule.name}=warn`]);

const run = (args, options = {}) =>
  spawnSync("node", [CLI_PATH, ...args], { encoding: "utf8", ...options });

function tempDir(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "rapidoc-lint-"));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  return dir;
}

const json = (args, options) => {
  const result = run(["lint", "--format", "json", ...args], options);
  return { result, report: result.stdout ? JSON.parse(result.stdout) : undefined };
};
const byRule = (report) =>
  Object.groupBy(
    report.items.flatMap((item) => item.problems),
    (problem) => problem.rule,
  );

test("rapidoc lint", async (t) => {
  await t.test("every rule trips on the messy spec, with file:line:col", () => {
    const { result, report } = json([MESSY, "--strict", ...EVERY_RULE_ON]);
    assert.equal(result.status, 1);
    const rules = byRule(report);
    // the stateful mock's rules have a fixture of their own (stateful.yaml, below)
    for (const rule of RULES.filter((one) => !one.name.startsWith("stateful-")))
      assert.ok(rules[rule.name], `${rule.name} found nothing`);

    const unique = rules["operation-operationId-unique"][0];
    assert.equal(unique.severity, "warning", "--rule made it a warning");
    assert.match(unique.message, /"createOrder" is also used by POST \/orderItems/);
    assert.equal(unique.line, 37);
    assert.equal(unique.pointer, "#/paths/~1orders~1{id}/delete/operationId");
    assert.match(
      rules["operation-operationId"][0].message,
      /PATCH \/orders\/\{id\} has no operationId/,
    );
    assert.match(rules["operation-tag-defined"][0].message, /Tag "legacy"/);
    assert.match(rules["media-example"][0].message, /request body has no example/);
    assert.equal(rules["media-example"].length, 1, "the response has an example");
    assert.match(rules["example-named-map"][0].message, /"Report example"/);
    assert.match(rules["example-matches-schema"][0].message, /\/id must be string/);
    assert.match(rules["no-unused-components"][0].message, /#\/components\/schemas\/Unused/);
    assert.match(rules["security-defined"][0].message, /POST \/orderItems/);
    assert.equal(
      rules["security-defined"].length,
      2,
      "POST and PATCH; DELETE has its own, GET is a read",
    );
  });

  await t.test("defaults: error, warn and off; pretty output shows the rule", () => {
    const result = run(["lint", MESSY]);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /2 error\(s\)/);
    assert.match(
      result.stderr,
      /messy\.yaml:37:7  operationId "createOrder" is also used by POST \/orderItems  \[operation-operationId-unique\]/,
    );
    assert.match(result.stderr, /\[security-scheme-defined\]/);
    assert.match(result.stderr, /\[operation-summary\]/);
    assert.doesNotMatch(result.stderr, /\[operation-description\]/, "off by default");
    assert.doesNotMatch(result.stderr, /\[info-contact\]/);
    assert.match(result.stderr, /1 spec\(s\) linted: 2 error\(s\), \d+ warning\(s\)/);
  });

  await t.test("a clean spec passes every rule, --strict included", () => {
    const result = run(["lint", CLEAN, "--strict", ...EVERY_RULE_ON]);
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /No problems/);
    assert.match(result.stdout, /0 error\(s\), 0 warning\(s\)/);
  });

  await t.test("--strict fails on warnings", () => {
    const result = run(["lint", CLEAN, "--strict", "--rule", "operation-4xx-response=warn"]);
    assert.equal(result.status, 0, "clean has 4xx responses");
    const noContact = run([
      "lint",
      CLEAN,
      "--strict",
      "--rule",
      "info-contact=warn",
      "--rule",
      "operation-summary=off",
    ]);
    assert.equal(noContact.status, 0, "clean has a contact");
    const warned = run([
      "lint",
      MESSY,
      "--strict",
      "--rule",
      "operation-operationId-unique=off",
      "--rule",
      "security-scheme-defined=off",
    ]);
    assert.equal(warned.status, 1);
    assert.match(warned.stderr, /--strict fails on warnings/);
  });

  await t.test("Swagger 2.0: host, securityDefinitions, definitions", () => {
    const { result, report } = json([path.join(FIXTURES, "swagger2.yaml")]);
    assert.equal(result.status, 1);
    const rules = byRule(report);
    assert.match(rules["no-server-example-com"][0].message, /host "localhost:8080"/);
    assert.match(rules["security-scheme-defined"][0].message, /"key" is not declared/);
    assert.match(rules["no-unused-components"][0].message, /#\/definitions\/Pet/);
  });

  await t.test("an invalid spec is reported by validate's check and not linted", () => {
    const { result, report } = json([path.resolve(here, "fixtures/validate/missing-version.yaml")]);
    assert.equal(result.status, 1);
    const problems = report.items[0].problems;
    assert.ok(problems.length > 0);
    assert.ok(
      problems.every((p) => p.rule === "openapi"),
      JSON.stringify(problems),
    );
  });

  await t.test("--rule checks names and severities", () => {
    const unknown = run(["lint", CLEAN, "--rule", "operation-sumary=off"]);
    assert.equal(unknown.status, 2);
    assert.match(
      unknown.stderr,
      /unknown rule "operation-sumary"\. Did you mean operation-summary\?/,
    );
    const severity = run(["lint", CLEAN, "--rule", "operation-summary=loud"]);
    assert.equal(severity.status, 2);
    assert.match(severity.stderr, /must be one of error, warn, off/);
    const shape = run(["lint", CLEAN, "--rule", "operation-summary"]);
    assert.equal(shape.status, 2);
    assert.match(shape.stderr, /--rule needs <name>=<error\|warn\|off>/);
  });

  await t.test("--rules lists every rule with its default", () => {
    const result = run(["lint", "--rules"]);
    assert.equal(result.status, 0);
    for (const rule of RULES)
      assert.match(result.stdout, new RegExp(`${rule.name}\\s+${rule.default}\\s`));
  });

  await t.test("lint: in rapidoc.config.* sets severities, per API too; --rule wins", (t) => {
    const dir = tempDir(t);
    fs.mkdirSync(path.join(dir, "specs"));
    fs.copyFileSync(MESSY, path.join(dir, "specs/messy.yaml"));
    fs.copyFileSync(CLEAN, path.join(dir, "specs/clean.yaml"));
    fs.writeFileSync(
      path.join(dir, "rapidoc.config.yaml"),
      [
        "site: { title: Lint test }",
        "apis:",
        "  - { id: messy, spec: ./specs/messy.yaml }",
        "  - { id: clean, spec: ./specs/clean.yaml }",
        "lint:",
        "  rules:",
        "    operation-summary: off",
        "    info-license: error",
        "  apis:",
        "    clean: { info-license: off }",
        "    messy: { no-unused-components: error }",
        "",
      ].join("\n"),
    );
    const { result, report } = json([], { cwd: dir });
    assert.equal(result.status, 1, result.stderr);
    const [messy, clean] = report.items;
    assert.equal(messy.id, "messy");
    const messyRules = byRule({ items: [messy] });
    assert.equal(messyRules["operation-summary"], undefined, "off for every spec");
    assert.equal(messyRules["info-license"][0].severity, "error", "lint.rules raised it");
    assert.equal(
      messyRules["no-unused-components"][0].severity,
      "error",
      "lint.apis.messy raised it",
    );
    assert.equal(clean.problems.length, 0, "lint.apis.clean turned info-license back off");

    const overridden = json(["--rule", "info-license=off"], { cwd: dir });
    assert.equal(
      byRule(overridden.report)["info-license"],
      undefined,
      "--rule wins over the config",
    );

    // One file, run from that folder, takes lint.rules (not the per-API part).
    const one = json(["specs/messy.yaml"], { cwd: dir });
    const [license] = byRule(one.report)["info-license"];
    assert.match(license.message, /info has no license/);
    assert.equal(license.severity, "error");
    assert.equal(byRule(one.report)["operation-summary"], undefined);
  });

  await t.test("a wrong rule name or severity in the config is an error naming the file", (t) => {
    const dir = tempDir(t);
    fs.writeFileSync(
      path.join(dir, "rapidoc.config.yaml"),
      "site: { title: X }\nlint:\n  rules:\n    operation-sumary: off\n",
    );
    const result = run(["lint", CLEAN], { cwd: dir });
    assert.equal(result.status, 2);
    assert.match(
      result.stderr,
      /rapidoc\.config\.yaml: lint\.rules: unknown rule "operation-sumary"/,
    );
  });

  await t.test("a folder without a config lints every OpenAPI file in it", (t) => {
    const dir = tempDir(t);
    fs.copyFileSync(CLEAN, path.join(dir, "a.yaml"));
    fs.copyFileSync(MESSY, path.join(dir, "b.yaml"));
    fs.writeFileSync(path.join(dir, "notes.yaml"), "hello: world\n");
    const { result, report } = json([dir]);
    assert.equal(result.status, 1);
    assert.deepEqual(
      report.items.map((item) => item.id),
      ["a.yaml", "b.yaml"],
    );
    assert.equal(report.items[0].problems.length, 0);
  });

  await t.test("--format sarif names the tool and lists the rules", () => {
    const result = run(["lint", MESSY, "--format", "sarif"]);
    assert.equal(result.status, 1);
    const sarif = JSON.parse(result.stdout);
    const { driver } = sarif.runs[0].tool;
    assert.equal(driver.name, "rapidoc lint");
    const ids = driver.rules.map((rule) => rule.id);
    for (const rule of RULES) assert.ok(ids.includes(rule.name), rule.name);
    assert.ok(ids.includes("openapi"), "validate's rules too");
    const unique = sarif.runs[0].results.find((r) => r.ruleId === "operation-operationId-unique");
    assert.equal(unique.level, "error");
    assert.equal(unique.locations[0].physicalLocation.region.startLine, 37);
  });

  const EXAMPLES = path.join(FIXTURES, "examples.yaml");

  await t.test("example-named-map: an example written as a map of named examples", () => {
    const { report } = json([EXAMPLES]);
    const found = byRule(report)["example-named-map"];
    assert.deepEqual(
      found.map((problem) => problem.pointer),
      [
        "#/paths/~1calendars/get/responses/200/content/application~1json/example",
        "#/paths/~1pets/get/responses/200/content/application~1json/example",
      ],
      "not /orders: its one key, data, is a property of the schema",
    );
    assert.match(found[0].message, /"Calendars response example"\): move it under examples/);
    assert.match(found[1].message, /"Two pets"/, "an Example Object under the name");
  });

  await t.test("example-matches-schema: examples that miss their schema", () => {
    const { report } = json([EXAMPLES]);
    const found = byRule(report)["example-matches-schema"];
    assert.deepEqual(
      found.map((problem) => problem.message),
      [
        'example "wrongType" does not fit the schema: /id must be integer',
        'example "missing" does not fit the schema: the value must have name',
        "example does not fit the schema: /name must be string",
      ],
      "not the good example, and not the maps of named examples",
    );
    assert.equal(found[0].line, 88);
  });

  await t.test(
    "example-matches-schema is skipped, with a note, where @rapidoc/mock is missing",
    () => {
      const env = { ...process.env, RAPIDOC_MOCK_MODULE: "@rapidoc/not-installed" };
      const { report } = json([EXAMPLES], { env });
      const rules = byRule(report);
      assert.equal(rules["example-matches-schema"], undefined);
      assert.equal(rules["example-named-map"].length, 2, "the other rules still run");

      const pretty = run(["lint", EXAMPLES], { env });
      assert.equal(pretty.status, 0);
      assert.match(
        pretty.stdout + pretty.stderr,
        /Not run: example-matches-schema\. It needs @rapidoc\/mock/,
      );
      const off = run(["lint", EXAMPLES, "--rule", "example-matches-schema=off"], { env });
      assert.doesNotMatch(off.stdout + off.stderr, /Not run/, "a rule that is off needs nothing");
    },
  );

  const STATEFUL = path.join(FIXTURES, "stateful.yaml");
  const STATEFUL_RULES = RULES.filter((rule) => rule.name.startsWith("stateful-"));

  await t.test("--stateful reports what the stateful mock assumed or could not map", () => {
    const quietRun = json([STATEFUL]);
    assert.equal(quietRun.report.items[0].problems.length, 0, "off without --stateful");

    const { result, report } = json([STATEFUL, "--stateful"]);
    assert.equal(result.status, 0, "warnings");
    const rules = byRule(report);
    for (const rule of STATEFUL_RULES.filter((one) => one.withStateful))
      assert.ok(rules[rule.name], `${rule.name} found nothing`);
    assert.equal(rules["stateful-relation-assumed"], undefined, "not part of --stateful");

    assert.match(
      rules["stateful-list-filter"][0].message,
      /GET \/pets: query parameter color matches no field of Pet/,
    );
    assert.equal(rules["stateful-list-filter"][0].line, 12);
    assert.equal(rules["stateful-list-filter"].length, 1, "limit pages the list: no finding");
    assert.match(
      rules["stateful-write-unmapped"][0].message,
      /DELETE \/sessions\/\{id\} fits no resource/,
    );
    assert.match(
      rules["stateful-resource-key"][0].message,
      /Widget: no key field found for \{code\}/,
    );
    assert.equal(
      rules["stateful-reference-target"][0].pointer,
      "#/components/schemas/Pet/properties/shelter_id",
    );
    assert.equal(rules["stateful-response-unnamed"].length, 2, "the list and the item of /keys");
    assert.match(rules["stateful-operation-assumed"][0].message, /POST on an item path/);
  });

  await t.test(
    "--stateful gives way to a severity set by name; a stateful rule works without it",
    () => {
      const off = json([STATEFUL, "--stateful", "--rule", "stateful-list-filter=off"]);
      assert.equal(byRule(off.report)["stateful-list-filter"], undefined);
      const error = json([STATEFUL, "--stateful", "--rule", "stateful-resource-key=error"]);
      assert.equal(error.result.status, 1);

      const one = json([STATEFUL, "--rule", "stateful-relation-assumed=warn"]);
      assert.deepEqual(Object.keys(byRule(one.report)), ["stateful-relation-assumed"]);
      assert.match(one.report.items[0].problems[0].message, /Pet\.parentId is linked to Pet\.id/);
    },
  );

  await t.test("--stateful without @rapidoc/mock says which rules did not run", () => {
    const env = { ...process.env, RAPIDOC_MOCK_MODULE: "@rapidoc/not-installed" };
    const result = run(["lint", STATEFUL, "--stateful"], { env });
    assert.equal(result.status, 0);
    const output = result.stdout + result.stderr;
    assert.match(output, /Not run: example-matches-schema, stateful-resource-key, /);
    assert.match(output, /They need @rapidoc\/mock/);
  });

  await t.test("--stateful reads mock.config.yaml: what it settles is not reported", (t) => {
    const dir = tempDir(t);
    const spec = path.join(dir, "stateful.yaml");
    fs.copyFileSync(STATEFUL, spec);
    const before = byRule(json([spec, "--stateful"]).report);
    assert.ok(before["stateful-resource-key"] && before["stateful-write-unmapped"]);

    fs.writeFileSync(
      path.join(dir, "mock.config.yaml"),
      [
        "resources:",
        "  Widget: { key: label }",
        "operations:",
        "  endSession: { action: none }",
        "  touchPet: { resource: Pet, action: patch }",
        "  ghost: { action: none }",
        "",
      ].join("\n"),
    );
    const { result, report } = json([spec, "--stateful"]);
    assert.equal(result.status, 0);
    const rules = byRule(report);
    assert.equal(rules["stateful-resource-key"], undefined, "Widget's key is stated");
    assert.equal(
      rules["stateful-write-unmapped"],
      undefined,
      "endSession is stated to keep no state",
    );
    assert.equal(rules["stateful-operation-assumed"], undefined, "touchPet is stated");
    assert.equal(rules["stateful-list-filter"].length, 1, "what the file does not mention stays");
    assert.equal(rules["mock-config"].length, 1, "an entry that no longer fits the spec");
    assert.match(
      rules["mock-config"][0].message,
      /mock\.config\.yaml: operations\.ghost: the spec has no operation with that id/,
    );

    // another file by name; a missing one is an error
    fs.writeFileSync(path.join(dir, "other.yaml"), "resources:\n  Widget: { key: label }\n");
    const other = byRule(
      json([spec, "--stateful", "--mock-config", path.join(dir, "other.yaml")]).report,
    );
    assert.equal(other["stateful-resource-key"], undefined);
    assert.ok(other["stateful-write-unmapped"], "only what that file states");
    const missing = run(["lint", spec, "--stateful", "--mock-config", path.join(dir, "no.yaml")]);
    assert.equal(missing.status, 1);
    assert.match(missing.stderr, /Not found: .*no\.yaml/);
  });

  await t.test("without a stateful rule on, mock.config.yaml is not read", (t) => {
    const dir = tempDir(t);
    const spec = path.join(dir, "stateful.yaml");
    fs.copyFileSync(STATEFUL, spec);
    fs.writeFileSync(path.join(dir, "mock.config.yaml"), "not: [yaml\n");
    assert.equal(run(["lint", spec]).status, 0, "a broken file does not fail a plain lint");
    const stateful = run(["lint", spec, "--stateful"]);
    assert.equal(stateful.status, 1);
    assert.match(stateful.stderr, /mock\.config\.yaml: /);
    const byName = run(["lint", spec, "--rule", "stateful-list-filter=warn"]);
    assert.equal(byName.status, 1, "a stateful rule turned on by name reads it too");
  });
});

test("lint summary: every rule is in exactly one category", async () => {
  const { CATEGORIES } = await import("../src/lint/summary.js");
  const listed = CATEGORIES.flatMap((category) => category.rules);
  assert.deepEqual([...listed].sort(), RULES.map((rule) => rule.name).sort());
  assert.equal(new Set(listed).size, listed.length);
});

test("lint summary: counts findings per category, and what passed where a rule looks at one thing at a time", async () => {
  const { summarize } = await import("../src/lint/summary.js");
  const { traverse } = await import("../src/lint/traverse.js");
  const doc = {
    openapi: "3.1.0",
    info: { title: "T", version: "1" },
    paths: {
      "/a": { get: { operationId: "a", summary: "A", responses: { 200: { description: "ok" } } } },
      "/b": { get: { responses: { 200: { description: "ok" } } } },
    },
    components: { schemas: { Unused: { type: "object" } } },
  };
  const names = ["operation-operationId", "operation-summary", "no-unused-components"];
  const rules = RULES.filter((rule) => names.includes(rule.name));
  const tally = new Map();
  const problems = traverse(doc, rules, {}, tally).map((finding) => ({
    rule: finding.rule,
    severity: finding.rule === "operation-operationId" ? "error" : "warning",
  }));
  const summary = summarize(rules, problems, tally);
  assert.deepEqual(
    summary.categories.map((one) => one.id),
    ["naming", "documentation", "housekeeping"],
  );
  const [naming, documentation, housekeeping] = summary.categories;
  assert.deepEqual([naming.errors, naming.warnings, naming.checked, naming.passed], [1, 0, 2, 1]);
  assert.deepEqual(
    [documentation.warnings, documentation.checked, documentation.passed],
    [1, 2, 1],
  );
  // a rule on the whole document has findings and no count of what passed
  assert.equal(housekeeping.warnings, 1);
  assert.equal(housekeeping.checked, undefined);
  assert.deepEqual(
    [summary.errors, summary.warnings, summary.checked, summary.passed],
    [1, 2, 4, 2],
  );
});
