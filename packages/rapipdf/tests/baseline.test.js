import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { baselineDir, definitionOf, specsDir, VARIANTS } from "./helpers/definitions.js";

/*
 * Regression test: for each spec in fixtures/specs and each option set, the pdfmake document definition
 * must equal fixtures/baseline/<spec>.<variant>.json. The baseline started as the output of the
 * published 2.2.1 bundle and is updated only with a change that alters the PDF on purpose (AGENTS.md §3).
 * Runs from source in Node: the core needs no browser.
 */

// RAPIPDF_BASELINE_DIR=<folder>: write the definitions there instead of comparing them (a folder to
// diff against the baseline, or the baseline folder itself to accept a deliberate change).
const writeDir = process.env.RAPIPDF_BASELINE_DIR && path.resolve(process.env.RAPIPDF_BASELINE_DIR);

for (const spec of fs.readdirSync(specsDir).sort()) {
  for (const [variant, options] of Object.entries(VARIANTS)) {
    const name = `${spec.replace(/\.(json|yaml)$/, "")}.${variant}`;
    test(`document definition matches the baseline: ${name}`, async () => {
      const actual = await definitionOf(spec, options);
      if (writeDir) {
        fs.mkdirSync(writeDir, { recursive: true });
        fs.writeFileSync(path.join(writeDir, `${name}.json`), `${actual}\n`);
        return;
      }
      const expected = fs.readFileSync(path.join(baselineDir, `${name}.json`), "utf8").trim();
      if (actual !== expected) {
        let at = 0;
        while (actual[at] === expected[at]) at++;
        assert.fail(
          `differs from the baseline at character ${at}:\n  expected: …${expected.slice(Math.max(0, at - 80), at + 120)}…\n  actual:   …${actual.slice(Math.max(0, at - 80), at + 120)}…`,
        );
      }
    });
  }
}
