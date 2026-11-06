import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import net from "node:net";
import os from "node:os";
import path from "node:path";
import { spawn, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const CLI_PATH = path.resolve(here, "../src/index.js");
const SPEC = path.join(here, "fixtures/validate/valid-3.1.yaml");

/**
 * Runs the CLI with scripted answers (RAPIDOC_PROMPT_ANSWERS answers the questions in order; null is
 * Ctrl+C). Without `answers`, nothing is scripted and stdin isn't a terminal: the CLI must not ask.
 */
function run(args, { cwd, answers } = {}) {
  const env = { ...process.env };
  delete env.RAPIDOC_PROMPT_ANSWERS;
  if (answers) env.RAPIDOC_PROMPT_ANSWERS = JSON.stringify(answers);
  return spawnSync("node", [CLI_PATH, ...args], { cwd, env, encoding: "utf8" });
}

function tempDir(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "rapidoc-prompts-"));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  return dir;
}

/** A folder with two OpenAPI files, as `init` finds them in an existing repo. */
function repoWithSpecs(t) {
  const dir = tempDir(t);
  fs.mkdirSync(path.join(dir, "specs"));
  for (const name of ["orders.yaml", "billing.yaml"])
    fs.copyFileSync(SPEC, path.join(dir, "specs", name));
  return dir;
}

test("rapidoc init asks for what the options don't say", async (t) => {
  await t.test("title, which specs, install; then the command that does the same", (t) => {
    const dir = repoWithSpecs(t);
    const result = run(["init"], {
      cwd: dir,
      answers: ["Acme Docs", ["specs/orders.yaml"], false],
    });
    assert.equal(result.status, 0, result.stderr);
    const config = fs.readFileSync(path.join(dir, "rapidoc.config.yaml"), "utf8");
    assert.match(config, /title: "Acme Docs"/);
    assert.match(config, /spec: "\.\/specs\/orders\.yaml"/);
    assert.doesNotMatch(config, /billing/, "only the chosen spec");
    assert.match(
      result.stdout,
      /rapidoc init --title "Acme Docs" --spec specs\/orders\.yaml --no-install/,
    );
  });

  await t.test("an empty title takes the default; no specs chosen means the starter spec", (t) => {
    const dir = repoWithSpecs(t);
    const result = run(["init"], { cwd: dir, answers: ["", [], false] });
    assert.equal(result.status, 0, result.stderr);
    const config = fs.readFileSync(path.join(dir, "rapidoc.config.yaml"), "utf8");
    assert.match(config, /spec: "\.\/specs\/api\.yaml"/, "the starter spec");
    assert.match(result.stdout, /--starter-spec/);
  });

  await t.test("options answer the questions: nothing is asked", (t) => {
    const dir = repoWithSpecs(t);
    // An empty script: any question would fail with "No scripted answer left".
    const result = run(["init", "--title", "T", "--spec", "specs/billing.yaml", "--no-install"], {
      cwd: dir,
      answers: [],
    });
    assert.equal(result.status, 0, result.stderr);
    assert.match(fs.readFileSync(path.join(dir, "rapidoc.config.yaml"), "utf8"), /billing/);
    assert.doesNotMatch(result.stdout, /The same without questions/);
  });

  await t.test("without a terminal it asks nothing and uses every spec found", (t) => {
    const dir = repoWithSpecs(t);
    const result = run(["init", "--no-install"], { cwd: dir });
    assert.equal(result.status, 0, result.stderr);
    const config = fs.readFileSync(path.join(dir, "rapidoc.config.yaml"), "utf8");
    assert.match(config, /orders/);
    assert.match(config, /billing/);
  });

  await t.test("--force lists the files it would replace and asks", (t) => {
    const dir = repoWithSpecs(t);
    assert.equal(run(["init", "--title", "Old", "--no-install"], { cwd: dir }).status, 0);
    const args = [
      "init",
      "--title",
      "New",
      "--spec",
      "specs/orders.yaml",
      "--no-install",
      "--force",
    ];
    const declined = run(args, { cwd: dir, answers: [false] });
    assert.equal(declined.status, 130);
    assert.match(declined.stdout, /exist and would be replaced/);
    assert.match(declined.stderr, /Cancelled; nothing was written\./);
    assert.match(fs.readFileSync(path.join(dir, "rapidoc.config.yaml"), "utf8"), /title: "Old"/);

    const accepted = run(args, { cwd: dir, answers: [true] });
    assert.equal(accepted.status, 0, accepted.stderr);
    assert.match(fs.readFileSync(path.join(dir, "rapidoc.config.yaml"), "utf8"), /title: "New"/);
  });

  await t.test("Ctrl+C on a question: Cancelled., exit 130", (t) => {
    const dir = repoWithSpecs(t);
    const result = run(["init"], { cwd: dir, answers: [null] });
    assert.equal(result.status, 130);
    assert.equal(result.stderr.trim(), "Cancelled.");
    assert.ok(!fs.existsSync(path.join(dir, "rapidoc.config.yaml")));
  });

  await t.test("--spec must exist, and not with --starter-spec", (t) => {
    const dir = repoWithSpecs(t);
    const missing = run(["init", "--spec", "nope.yaml", "--yes"], { cwd: dir });
    assert.equal(missing.status, 1);
    assert.match(missing.stderr, /--spec nope\.yaml: file not found/);
    const both = run(["init", "--spec", "specs/orders.yaml", "--starter-spec", "--yes"], {
      cwd: dir,
    });
    assert.equal(both.status, 1);
    assert.match(both.stderr, /--spec or --starter-spec, not both/);
  });
});

test("rapidoc migrate finds the project to migrate", async (t) => {
  const redoclyProject = (t) => {
    const dir = tempDir(t);
    fs.mkdirSync(path.join(dir, "specs"));
    fs.copyFileSync(SPEC, path.join(dir, "specs/orders.yaml"));
    fs.writeFileSync(
      path.join(dir, "redocly.yaml"),
      "apis:\n  orders:\n    root: ./specs/orders.yaml\n",
    );
    return dir;
  };

  await t.test("nothing to migrate: exit 2 naming --from", (t) => {
    const result = run(["migrate"], { cwd: tempDir(t) });
    assert.equal(result.status, 2);
    assert.match(
      result.stderr,
      /No Redocly \(redocly\.yaml\) or Zudoku \(zudoku\.config\.\*\) project/,
    );
  });

  await t.test("found, no terminal: exit 2 with the exact option", (t) => {
    const result = run(["migrate"], { cwd: redoclyProject(t) });
    assert.equal(result.status, 2);
    assert.match(result.stderr, /Found redocly\.yaml: pass --from redocly \(or --yes\)/);
  });

  await t.test("found: confirmed in a terminal, or taken with --yes", (t) => {
    const asked = redoclyProject(t);
    assert.equal(run(["migrate"], { cwd: asked, answers: [true] }).status, 0);
    assert.ok(fs.existsSync(path.join(asked, "rapidoc.config.yaml")));

    const yes = redoclyProject(t);
    assert.equal(run(["migrate", "--yes"], { cwd: yes }).status, 0);
    assert.ok(fs.existsSync(path.join(yes, "rapidoc.config.yaml")));
  });

  await t.test("an existing rapidoc.config.yaml is replaced only after asking", (t) => {
    const dir = redoclyProject(t);
    fs.writeFileSync(path.join(dir, "rapidoc.config.yaml"), "# mine\n");
    const declined = run(["migrate", "--from", "redocly"], { cwd: dir, answers: [false] });
    assert.equal(declined.status, 130);
    assert.equal(fs.readFileSync(path.join(dir, "rapidoc.config.yaml"), "utf8"), "# mine\n");
  });
});

test("a busy port", async (t) => {
  const blocker = net.createServer();
  await new Promise((resolve) => blocker.listen(0, "0.0.0.0", resolve));
  const busy = blocker.address().port;
  t.after(() => blocker.close());

  await t.test("without a terminal: exit 1 naming --port", () => {
    const result = run(["mock", SPEC, "--port", String(busy)]);
    assert.equal(result.status, 1);
    assert.match(result.stderr, new RegExp(`Port ${busy} is in use\\. Pass --port <number>`));
  });

  await t.test("in a terminal: the next free port, after asking", async () => {
    const env = { ...process.env, RAPIDOC_PROMPT_ANSWERS: "[true]" };
    const child = spawn("node", [CLI_PATH, "mock", SPEC, "--port", String(busy)], { env });
    try {
      const url = await new Promise((resolve, reject) => {
        let output = "";
        const timer = setTimeout(() => reject(new Error(`no banner:\n${output}`)), 20000);
        const read = (chunk) => {
          output += chunk;
          const match = output.match(/Mock server: (http:\/\/\S+)/);
          if (match) {
            clearTimeout(timer);
            resolve(match[1]);
          }
        };
        child.stdout.on("data", read);
        child.stderr.on("data", read);
        child.on("exit", () => reject(new Error(`exited:\n${output}`)));
      });
      const port = Number(new URL(url).port);
      assert.ok(port > busy, `${port} comes after the busy ${busy}`);
    } finally {
      child.kill();
    }
  });
});

test("rapidoc alone", async (t) => {
  await t.test("in a terminal: a menu", () => {
    const result = run([], { answers: ["help"] });
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /Commands:/, "the help entry prints the overview");
  });

  await t.test("not in a terminal: the help, no question", () => {
    const result = run([]);
    assert.equal(result.status, 0);
    assert.match(result.stdout, /Commands:/);
  });

  await t.test("--yes is a global option", () => {
    for (const name of ["init", "dev", "build", "serve", "mock", "validate", "migrate"])
      assert.match(run([name, "--help"]).stdout, /-y, --yes/, name);
  });
});
