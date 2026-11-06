import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const CLI_PATH = path.resolve(here, "../src/index.js");

const run = (args) => spawnSync("node", [CLI_PATH, ...args], { encoding: "utf8" });
const has = (shell) => spawnSync("sh", ["-c", `command -v ${shell}`]).status === 0;

/** What bash would offer for the words typed so far (the last one being completed). */
function bashComplete(script, words) {
  const program = [
    `source ${script}`,
    `COMP_WORDS=(${words.map((w) => `'${w}'`).join(" ")})`,
    `COMP_CWORD=${words.length - 1}`,
    "_rapidoc",
    'printf "%s\\n" "${COMPREPLY[@]}"',
  ].join("\n");
  const result = spawnSync("bash", ["-c", program], { encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout.trim().split("\n").filter(Boolean).sort();
}

test("rapidoc completion", async (t) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "rapidoc-completion-"));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const scripts = {};
  for (const shell of ["zsh", "bash", "fish"]) {
    const result = run(["completion", shell]);
    assert.equal(result.status, 0, result.stderr);
    scripts[shell] = path.join(dir, shell);
    fs.writeFileSync(scripts[shell], result.stdout);
  }

  await t.test("the scripts parse", () => {
    for (const shell of ["zsh", "bash"])
      if (has(shell)) {
        const check = spawnSync(shell, ["-n", scripts[shell]], { encoding: "utf8" });
        assert.equal(check.status, 0, `${shell}: ${check.stderr}`);
      }
    if (has("fish")) {
      const check = spawnSync("fish", ["-n", scripts.fish], { encoding: "utf8" });
      assert.equal(check.status, 0, check.stderr);
    }
  });

  await t.test("every command, option and choice is in each script", () => {
    for (const shell of ["zsh", "bash", "fish"]) {
      const text = fs.readFileSync(scripts[shell], "utf8");
      for (const name of ["init", "dev", "validate", "lint", "bundle", "mcp", "doctor"])
        assert.match(text, new RegExp(`\\b${name}\\b`), `${shell}: ${name}`);
      assert.match(text, /out-dir/, shell);
      assert.match(text, /no-install/, `${shell}: negatable options`);
      assert.match(text, /pretty json sarif/, `${shell}: choices`);
      assert.match(text, /\bexport serve\b/, `${shell}: mcp's actions`);
    }
    assert.match(fs.readFileSync(scripts.zsh, "utf8"), /^#compdef rapidoc/);
    assert.match(fs.readFileSync(scripts.bash, "utf8"), /complete -F _rapidoc rapidoc/);
    assert.match(
      fs.readFileSync(scripts.fish, "utf8"),
      /complete -c rapidoc -n __fish_use_subcommand -a lint/,
    );
  });

  await t.test("bash: commands, options, choices and actions", { skip: !has("bash") }, () => {
    const script = scripts.bash;
    assert.deepEqual(bashComplete(script, ["rapidoc", "val"]), ["validate"]);
    assert.deepEqual(bashComplete(script, ["rapidoc", "lint", "--format", ""]), [
      "json",
      "pretty",
      "sarif",
    ]);
    assert.deepEqual(bashComplete(script, ["rapidoc", "lint", "--st"]), ["--strict"]);
    assert.deepEqual(bashComplete(script, ["rapidoc", "init", "--no-"]), ["--no-install"]);
    assert.deepEqual(bashComplete(script, ["rapidoc", "mcp", ""]), ["export", "serve"]);
    assert.deepEqual(bashComplete(script, ["rapidoc", "help", "bu"]), ["build", "bundle"]);
  });

  await t.test("a shell is required and must be known", () => {
    assert.equal(run(["completion"]).status, 2);
    const unknown = run(["completion", "powershell"]);
    assert.equal(unknown.status, 2);
    assert.match(unknown.stderr, /Unknown shell "powershell": one of zsh, bash, fish/);
  });
});
