import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { isSourceCheckout, newestSourceMtimeMs } from "../src/engine/sync-assets.js";

describe("RapiDoc bundle freshness", () => {
  it("ignores dotfiles and dot-folders when finding the newest source file", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "rapidoc-src-"));
    try {
      const write = (file, seconds) => {
        const full = path.join(dir, file);
        fs.mkdirSync(path.dirname(full), { recursive: true });
        fs.writeFileSync(full, "");
        fs.utimesSync(full, seconds, seconds);
      };
      write("rapidoc.ts", 1000);
      write("components/api-request.js", 2000);
      write(".DS_Store", 9000); // Finder writes this when the folder is opened
      write("components/.DS_Store", 9000);
      write(".vscode/settings.json", 9000);

      assert.equal(newestSourceMtimeMs(dir), 2000 * 1000);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  it("checks the bundle's age only in a source checkout, not in an installed package", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "rapidoc-install-"));
    try {
      const bundle = (root) => {
        const file = path.join(root, "dist", "rapidoc-min.js");
        fs.mkdirSync(path.dirname(file), { recursive: true });
        fs.writeFileSync(file, "");
        return file;
      };
      // npm install: node_modules/rapidoc is a real folder
      assert.equal(isSourceCheckout(bundle(path.join(dir, "app/node_modules/rapidoc"))), false);

      // monorepo: node_modules/rapidoc is a symlink to packages/rapidoc
      bundle(path.join(dir, "repo/packages/rapidoc"));
      fs.mkdirSync(path.join(dir, "repo/node_modules"), { recursive: true });
      fs.symlinkSync(
        path.join(dir, "repo/packages/rapidoc"),
        path.join(dir, "repo/node_modules/rapidoc"),
        "dir",
      );
      const linked = path.join(dir, "repo/node_modules/rapidoc/dist/rapidoc-min.js");
      assert.equal(isSourceCheckout(linked), true);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });
});
