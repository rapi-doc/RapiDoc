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
    for (const rule of RULES) assert.ok(rules[rule.name], `${rule.name} found nothing`);

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
});
