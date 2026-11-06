import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { checkSpec } from "../src/validate/check.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const CLI_PATH = path.resolve(here, "../src/index.js");
const FIXTURES = path.join(here, "fixtures/validate");
const fixture = (name) => path.join(FIXTURES, name);

// spawn, not spawnSync: the --remote tests serve files from this process while the CLI runs.
function run(args, options = {}) {
  return new Promise((resolve) => {
    const child = spawn("node", [CLI_PATH, ...args], { cwd: FIXTURES, ...options });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => (stdout += chunk));
    child.stderr.on("data", (chunk) => (stderr += chunk));
    child.on("close", (status) => resolve({ status, stdout, stderr }));
  });
}

/** One problem, as `file:line:col message`, for compact assertions. */
const brief = (problem) =>
  `${path.basename(problem.location)}:${problem.line}:${problem.column} ${problem.message}`;

test("checkSpec", async (t) => {
  await t.test(
    "a valid spec has no problems (path parameters defined through $ref count)",
    async () => {
      const result = await checkSpec(fixture("valid-3.1.yaml"));
      assert.equal(result.version, "3.1");
      assert.deepEqual(result.problems, []);
    },
  );

  await t.test("required fields are enforced, with line and column (YAML and JSON)", async () => {
    const yaml = await checkSpec(fixture("missing-version.yaml"));
    assert.deepEqual(yaml.problems.map(brief), [
      "missing-version.yaml:2:1 must have required property 'version'",
    ]);
    assert.deepEqual(yaml.problems[0].pointer, ["info"]);

    const json = await checkSpec(fixture("missing-version.json"));
    assert.deepEqual(json.problems.map(brief), [
      "missing-version.json:3:3 must have required property 'version'",
    ]);
  });

  await t.test("declared path parameters must be defined", async () => {
    const result = await checkSpec(fixture("path-parameter.yaml"));
    assert.equal(result.problems.length, 1);
    assert.match(result.problems[0].message, /Declared path parameter "orderId"/);
    assert.equal(result.problems[0].line, 7, "points at the operation");
  });

  await t.test("recursive schemas are checked without looping", async () => {
    const result = await checkSpec(fixture("recursive-3.0.yaml"));
    assert.ok(result.problems.length > 0);
    assert.ok(
      result.problems.every((problem) => problem.line === 27),
      result.problems.map(brief).join("\n"),
    );
    assert.deepEqual(result.problems[0].pointer, [
      "components",
      "schemas",
      "Node",
      "properties",
      "weight",
      "type",
    ]);
  });

  await t.test("errors in files reached through $ref point into those files", async () => {
    const result = await checkSpec(fixture("multi/root.yaml"));
    assert.deepEqual(result.problems.map(brief), [
      "responses.yaml:1:1 must have required property 'description'",
    ]);
    assert.deepEqual(result.problems[0].pointer, ["ok"]);
  });

  await t.test("$refs to nothing and to missing files are errors at the $ref", async () => {
    const result = await checkSpec(fixture("broken-refs.yaml"));
    const messages = result.problems.map(brief);
    assert.ok(
      messages.includes(
        'broken-refs.yaml:12:11 $ref "#/components/responses/Missing" points to nothing',
      ),
      messages.join("\n"),
    );
    assert.ok(
      messages.some((m) => m.startsWith("broken-refs.yaml:14:11") && m.includes("can't read")),
      messages.join("\n"),
    );
  });

  await t.test("a YAML syntax error is reported where it is", async () => {
    const result = await checkSpec(fixture("syntax-error.yaml"));
    assert.equal(result.problems.length, 1);
    assert.equal(result.problems[0].rule, "syntax");
    assert.equal(result.problems[0].line, 7);
  });
});

test("rapidoc validate", async (t) => {
  await t.test("pretty: file:line:col per error, exit 1", async () => {
    const result = await run(["validate", "missing-version.yaml"]);
    assert.equal(result.status, 1);
    assert.match(
      result.stderr,
      /missing-version\.yaml:2:1 {2}must have required property 'version' {2}\(#\/info\)/,
    );
    assert.match(result.stderr, /1 spec\(s\) checked: 1 error\(s\), 0 warning\(s\)/);
  });

  await t.test("a valid spec passes, exit 0", async () => {
    const result = await run(["validate", "valid-3.1.yaml"]);
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /Valid OpenAPI/);
  });

  await t.test("--format json: one JSON document on stdout", async () => {
    const result = await run(["validate", "multi/root.yaml", "--format", "json"]);
    assert.equal(result.status, 1);
    const report = JSON.parse(result.stdout);
    assert.equal(report.valid, false);
    assert.equal(report.errors, 1);
    assert.deepEqual(report.items[0].problems[0], {
      severity: "error",
      rule: "openapi",
      message: "must have required property 'description'",
      location: "multi/responses.yaml",
      line: 1,
      column: 1,
      pointer: "#/ok",
    });
  });

  await t.test("--format sarif: SARIF 2.1.0 with regions", async () => {
    const result = await run(["validate", "missing-version.yaml", "--format", "sarif"]);
    assert.equal(result.status, 1);
    const sarif = JSON.parse(result.stdout);
    assert.equal(sarif.version, "2.1.0");
    const [finding] = sarif.runs[0].results;
    assert.equal(finding.ruleId, "openapi");
    assert.equal(finding.level, "error");
    assert.deepEqual(finding.locations[0].physicalLocation, {
      artifactLocation: { uri: "missing-version.yaml" },
      region: { startLine: 2, startColumn: 1 },
    });
    assert.ok(sarif.runs[0].tool.driver.rules.some((rule) => rule.id === "openapi"));
  });

  await t.test("warnings pass, --strict fails on them", async () => {
    const loose = await run(["validate", "no-operation-id.yaml"]);
    assert.equal(loose.status, 0, loose.stderr);
    assert.match(loose.stderr, /no operationId/, "the portal's link check warns");

    const strict = await run(["validate", "no-operation-id.yaml", "--strict"]);
    assert.equal(strict.status, 1);
    assert.match(strict.stderr, /--strict fails on warnings/);
  });

  await t.test("--format is checked", async () => {
    const result = await run(["validate", "valid-3.1.yaml", "--format", "xml"]);
    assert.equal(result.status, 2);
    assert.match(result.stderr, /--format must be one of pretty, json, sarif/);
  });

  await t.test(
    "remote $refs: skipped with a warning, followed with --remote; URLs as the spec",
    async () => {
      const server = http.createServer((req, res) => {
        const file = path.join(FIXTURES, "multi", path.basename(req.url));
        if (!fs.existsSync(file)) return res.writeHead(404).end();
        res.writeHead(200, { "content-type": "application/yaml" }).end(fs.readFileSync(file));
      });
      await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
      const base = `http://127.0.0.1:${server.address().port}`;
      const dir = fs.mkdtempSync(path.join(os.tmpdir(), "rapidoc-validate-"));
      try {
        const spec = path.join(dir, "remote-ref.yaml");
        fs.writeFileSync(
          spec,
          fs.readFileSync(fixture("remote-ref.yaml"), "utf8").replace("REMOTE", base),
        );

        const skipped = await run(["validate", spec]);
        assert.equal(skipped.status, 0, skipped.stderr);
        assert.match(skipped.stderr, /not checked \(remote; use --remote\)/);

        const followed = await run(["validate", spec, "--remote", "--format", "json"]);
        assert.equal(followed.status, 1);
        const problem = JSON.parse(followed.stdout).items[0].problems[0];
        assert.equal(problem.location, `${base}/responses.yaml`);
        assert.equal(problem.line, 1);

        const url = await run(["validate", `${base}/root.yaml`, "--format", "json"]);
        assert.equal(url.status, 1, "a URL is fetched, its relative $refs too");
        assert.equal(
          JSON.parse(url.stdout).items[0].problems[0].location,
          `${base}/responses.yaml`,
        );
      } finally {
        server.close();
        fs.rmSync(dir, { recursive: true, force: true });
      }
    },
  );
});
