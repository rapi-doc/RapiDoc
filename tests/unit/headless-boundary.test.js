// The headless code in packages/rapidoc/src (spec parsing, schema utilities, slugs, Arazzo, MCP) is
// shared by the browser bundles and the Node builds (@rapidoc/prerender, @rapidoc/mcp). It must not pull in
// Lit, elements, templates or styles, and may use only the third-party packages listed here. Calls to
// DOM APIs inside functions are allowed (Node never calls them); importing UI code is not.
//
// oxlint runs without a config file (AGENTS.md §4), so this boundary is checked here, not by a lint rule.
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const srcDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../packages/rapidoc/src",
);

/** `@rapidoc/mcp`'s entry, which bundles the shared code from packages/rapidoc/src. */
const MCP_ENTRY = path
  .relative(srcDir, path.resolve(srcDir, "../../rapidoc-mcp/src/index.js"))
  .split(path.sep)
  .join("/");

/** Headless entry points; everything they import, transitively, must stay headless. */
const ROOTS = [
  MCP_ENTRY,
  "utils/mcp-generator.js",
  "utils/spec-parser.js",
  "utils/schema-utils.js",
  "utils/slugger.js",
  "utils/arazzo/index.js",
];

/** Third-party packages headless code may import. Adding one here is a deliberate decision. */
const ALLOWED_PACKAGES = ["@scalar/openapi-parser", "yaml", "marked", "github-slugger"];

/** UI code: folders and element files headless code must never reach. */
const UI_FOLDERS = ["components/", "templates/", "styles/"];
const UI_FILES = ["rapidoc.ts", "rapidoc-mini.ts", "rapi-flow.ts", "oauth-receiver.ts", "index.js"];

function importSpecifiers(text) {
  const code = text.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
  const patterns = [
    /\b(?:import|export)\s[^;]*?\sfrom\s*["']([^"']+)["']/g,
    /\bimport\s*["']([^"']+)["']/g,
    /\bimport\(\s*["']([^"']+)["']\s*\)/g,
  ];
  return [...new Set(patterns.flatMap((re) => [...code.matchAll(re)].map((m) => m[1])))];
}

function resolveLocal(fromFile, specifier) {
  const base = specifier.startsWith("~/")
    ? path.join(srcDir, specifier.slice(2))
    : path.resolve(path.dirname(path.join(srcDir, fromFile)), specifier);
  const candidates = [base, `${base}.js`, `${base}.ts`, path.join(base, "index.js")];
  const found = candidates.find((c) => fs.existsSync(c) && fs.statSync(c).isFile());
  return found && path.relative(srcDir, found).split(path.sep).join("/");
}

function packageName(specifier) {
  const parts = specifier.split("/");
  return specifier.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0];
}

function isUi(file) {
  return UI_FOLDERS.some((folder) => file.startsWith(folder)) || UI_FILES.includes(file);
}

/** Walks the import graph from ROOTS; returns the files reached and every boundary violation. */
function walk() {
  const visited = new Map(); // file -> the file that first imported it
  const problems = [];
  const queue = ROOTS.map((root) => [root, null]);
  while (queue.length) {
    const [file, importer] = queue.shift();
    if (visited.has(file)) continue;
    visited.set(file, importer);
    const chain = () => {
      const links = [];
      for (let f = file; f; f = visited.get(f)) links.unshift(f);
      return links.join(" -> ");
    };
    if (isUi(file)) {
      problems.push(`${chain()} is UI code`);
      continue;
    }
    if (file.startsWith("../") && file !== MCP_ENTRY) {
      problems.push(`${chain()} is outside packages/rapidoc/src`);
      continue;
    }
    for (const specifier of importSpecifiers(fs.readFileSync(path.join(srcDir, file), "utf8"))) {
      // `?raw` imports are text (e.g. a file copied into an exported MCP project), not code to run.
      if (specifier.includes("?raw")) continue;
      if (specifier.startsWith(".") || specifier.startsWith("~/")) {
        const target = resolveLocal(file, specifier);
        if (!target) problems.push(`${chain()} imports "${specifier}", which does not resolve`);
        else queue.push([target, file]);
      } else if (
        !specifier.startsWith("node:") &&
        !ALLOWED_PACKAGES.includes(packageName(specifier))
      ) {
        problems.push(`${chain()} imports "${specifier}", which is not an allowed package`);
      }
    }
  }
  return { files: [...visited.keys()], problems };
}

describe("headless code boundary", () => {
  const { files, problems } = walk();

  it("headless modules import no Lit, elements, templates, styles or unlisted packages", () => {
    assert.deepEqual(problems, []);
  });

  it("walks the whole headless graph", () => {
    for (const expected of [
      "utils/mcp/manifest.js",
      "utils/mcp/workflow-runtime.js",
      "utils/arazzo/parse.js",
      "utils/common-utils.js",
    ]) {
      assert.ok(files.includes(expected), `${expected} was not reached from ROOTS`);
    }
  });

  it("flags a UI import (self-check)", () => {
    assert.deepEqual(importSpecifiers(`import { html } from "lit";\nimport "~/styles/x";`), [
      "lit",
      "~/styles/x",
    ]);
    assert.equal(isUi("templates/endpoint-template.js"), true);
    assert.equal(isUi("utils/mcp/manifest.js"), false);
  });
});
