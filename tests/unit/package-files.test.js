import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/*
 * Every publishable package says what it ships (`files` in package.json), so tests, design notes and
 * agent guides never reach npm. @rapidoc/portal's tests alone are 5 MB.
 */

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const PACKAGES = path.join(root, "packages");
const NEVER_SHIPPED = ["tests", "design", "scripts", "AGENTS.md", "CLAUDE.md"];

test("every publishable package lists the files it ships", () => {
  for (const dir of fs.readdirSync(PACKAGES)) {
    const file = path.join(PACKAGES, dir, "package.json");
    if (!fs.existsSync(file)) continue;
    const pkg = JSON.parse(fs.readFileSync(file, "utf8"));
    if (pkg.private) continue;
    assert.ok(Array.isArray(pkg.files) && pkg.files.length, `${pkg.name} has no files list`);
    for (const entry of pkg.files)
      assert.ok(
        !NEVER_SHIPPED.some((never) => entry === never || entry.startsWith(`${never}/`)),
        `${pkg.name} would publish ${entry}`,
      );
    // What the package points at must be inside what it ships.
    const shipped = (target) =>
      pkg.files.some((entry) => target === entry || target.startsWith(`${entry}/`));
    const targets = [
      ...Object.values(pkg.bin ?? {}),
      ...(typeof pkg.main === "string" ? [pkg.main] : []),
      ...Object.values(pkg.exports ?? {}).flatMap((value) =>
        typeof value === "string" ? [value] : Object.values(value),
      ),
    ].map((target) => target.replace(/^\.\//, ""));
    for (const target of targets)
      assert.ok(shipped(target), `${pkg.name}: ${target} is not in files (${pkg.files})`);
  }
});
