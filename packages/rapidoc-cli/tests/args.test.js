import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { parseCommandArgs } from "../src/lib/args.js";
import { UsageError } from "../src/lib/errors.js";
import { closest } from "../src/lib/suggest.js";

const CLI_PATH = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../src/index.js");
const run = (args, env = {}) =>
  spawnSync("node", [CLI_PATH, ...args], { encoding: "utf8", env: { ...process.env, ...env } });

const command = {
  name: "demo",
  usage: "demo [dir]",
  positionals: { name: "dir", max: 1 },
  options: {
    "out-dir": { type: "string", value: "path", default: "dist" },
    port: { type: "string", kind: "port" },
    seed: { type: "string", kind: "int" },
    force: { type: "boolean", short: "f" },
    install: { type: "boolean", negatable: true, default: true },
    from: { type: "string", choices: ["redocly", "zudoku"] },
  },
};
const parse = (...argv) => parseCommandArgs(command, argv);
const usageError = (fn, pattern) =>
  assert.throws(
    fn,
    (err) => err instanceof UsageError && err.exitCode === 2 && pattern.test(err.message),
  );

test("parseCommandArgs", async (t) => {
  await t.test("fills defaults and reads values in any order", () => {
    assert.deepEqual(parse(), {
      values: { "out-dir": "dist", install: true },
      positionals: [],
    });
    const { values, positionals } = parse("--out-dir", "public", "./portal", "-f", "--port=8080");
    assert.deepEqual(positionals, ["./portal"]);
    assert.equal(values["out-dir"], "public");
    assert.equal(values.force, true);
    assert.equal(values.port, 8080, "numbers are converted");
  });

  await t.test("negatable booleans and choices", () => {
    assert.equal(parse("--no-install").values.install, false);
    assert.equal(parse("--from", "Redocly").values.from, "redocly", "choices ignore case");
    usageError(
      () => parse("--from", "redoc"),
      /must be one of redocly, zudoku.*Did you mean redocly\?/,
    );
    usageError(() => parse("--no-force"), /Unknown option --no-force/);
  });

  await t.test("unknown options suggest the closest one", () => {
    usageError(() => parse("--outdir", "x"), /Unknown option --outdir\. Did you mean --out-dir\?/);
    usageError(() => parse("--instal"), /Did you mean --install\?/);
    usageError(() => parse("--zzz"), /^Unknown option --zzz\.$/);
  });

  await t.test("missing and malformed values", () => {
    usageError(() => parse("--out-dir"), /--out-dir needs a value/);
    usageError(
      () => parse("--out-dir", "--force"),
      /--out-dir needs a value/,
      "a flag is not a value",
    );
    usageError(
      () => parse("--port", "abc"),
      /--port needs a whole number from 0 to 65535, got "abc"/,
    );
    usageError(() => parse("--port", "70000"), /from 0 to 65535/);
    usageError(() => parse("--seed", "1.5"), /--seed needs a whole number, got "1.5"/);
    usageError(() => parse("--force=yes"), /--force takes no value/);
  });

  await t.test("extra positionals and required options", () => {
    usageError(() => parse("a", "b"), /Unexpected argument "b": rapidoc demo takes \[dir\]/);
    const required = { ...command, options: { from: { type: "string", required: true } } };
    usageError(() => parseCommandArgs(required, []), /rapidoc demo needs --from <value>/);
    assert.equal(
      parseCommandArgs(required, ["--help"]).values.help,
      true,
      "--help skips the checks",
    );
  });
});

test("closest", () => {
  assert.equal(closest("biuld", ["build", "dev", "serve"]), "build");
  assert.equal(closest("vaildate", ["validate", "migrate"]), "validate");
  assert.equal(closest("mig", ["migrate", "mock"]), "migrate", "a prefix");
  assert.equal(closest("xyz", ["build", "dev"]), undefined);
});

test("rapidoc dispatcher", async (t) => {
  await t.test("unknown commands suggest the closest one, exit 2", () => {
    const result = run(["biuld"]);
    assert.equal(result.status, 2);
    assert.match(result.stderr, /error: Unknown command "biuld"\. Did you mean "build"\?/);
    assert.match(result.stderr, /Run `rapidoc --help` for usage\./);
  });

  await t.test("unknown options exit 2 and point at the command's help", () => {
    const result = run(["build", "--outDir", "x"]);
    assert.equal(result.status, 2);
    assert.match(result.stderr, /Unknown option --outDir\. Did you mean --out-dir\?/);
    assert.match(result.stderr, /rapidoc build --help/);
  });

  await t.test("<command> --help prints the command's help instead of running it", () => {
    for (const args of [
      ["build", "--help"],
      ["help", "build"],
      ["build", "-h", "--outdir"],
    ]) {
      const result = run(args);
      assert.equal(result.status, 0, `${args.join(" ")}: ${result.stderr}`);
      assert.match(result.stdout, /rapidoc build \[dir\]/);
      assert.match(result.stdout, /--out-dir <path>/);
      assert.doesNotMatch(result.stdout, /Building RapiDoc Portal/, "nothing was built");
    }
  });

  await t.test("every command has help", () => {
    for (const name of ["init", "dev", "build", "serve", "mock", "validate", "migrate"]) {
      const result = run([name, "--help"]);
      assert.equal(result.status, 0, name);
      assert.match(result.stdout, new RegExp(`rapidoc ${name}`));
      assert.match(result.stdout, /--quiet/, `${name} lists the global options`);
    }
  });

  await t.test("no arguments prints the overview, exit 0", () => {
    const result = run([]);
    assert.equal(result.status, 0);
    assert.match(result.stdout, /Commands:/);
    assert.match(
      result.stdout,
      /Exit codes: 0 success, 1 problems in the input .*, 2 a wrong command line/,
    );
  });

  await t.test("piped output is plain text; problems exit 1", () => {
    const missing = run(["validate", "no-such-spec.yaml"], { NO_COLOR: "1" });
    assert.equal(missing.status, 1);
    assert.match(missing.stderr, /error: File not found: .*no-such-spec\.yaml/);
    assert.doesNotMatch(missing.stderr + missing.stdout, /❌|✅|⚠|🔍/u, "no icons when piped");
  });

  await t.test("--quiet keeps errors only", () => {
    const quiet = run(["validate", "no-such-spec.yaml", "-q"]);
    assert.equal(quiet.status, 1);
    assert.equal(quiet.stdout, "");
    assert.match(quiet.stderr, /File not found/);
  });
});
