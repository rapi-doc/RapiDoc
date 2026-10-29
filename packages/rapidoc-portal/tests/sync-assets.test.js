import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { newestSourceMtimeMs } from "../src/engine/sync-assets.js";

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
});
