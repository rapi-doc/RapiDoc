import { describe, it } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { thirdPartyLicenses } from "../../scripts/third-party-licenses.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const nm = (...parts) => path.join(root, "node_modules", ...parts);

/** Runs the plugin's generateBundle on a fake bundle and returns the files it emitted. */
function emitted(bundle) {
  const files = [];
  thirdPartyLicenses({ owner: "rapidoc 0.0.0" }).generateBundle.call(
    { emitFile: (file) => files.push(file) },
    {},
    bundle,
  );
  return files;
}

describe("third-party license notices", () => {
  it("lists each bundled package once, with its license text, next to the chunk", () => {
    const files = emitted({
      "rapidoc-min.js": {
        type: "chunk",
        fileName: "rapidoc-min.js",
        moduleIds: [
          path.join(root, "packages/rapidoc/src/index.js"),
          nm("lit-html", "lit-html.js"),
          nm("lit-html", "directives", "repeat.js"),
          nm("@scalar", "openapi-parser", "dist", "index.js"),
          `\0${nm("yaml", "dist", "index.js")}?commonjs-proxy`,
        ],
      },
    });
    assert.equal(files.length, 1);
    assert.equal(files[0].fileName, "rapidoc-min.js.LICENSE.txt");
    const text = files[0].source;
    assert.match(text, /^Third-party software bundled in rapidoc-min\.js \(rapidoc 0\.0\.0\)/);
    assert.equal(text.match(/^- lit-html /gm)?.length, 1, "one entry per package");
    assert.match(
      text,
      /^- @scalar\/openapi-parser \S+ \(MIT\)$/m,
      "scoped packages keep their scope",
    );
    assert.match(text, /^- yaml \S+ \(ISC\)$/m, "virtual-module prefixes and queries are ignored");
    assert.match(text, /Copyright \(c\) 2017 Google LLC/, "the full license text is included");
    assert.doesNotMatch(text, /rapidoc\/src/, "own code is not listed");
  });

  it("writes nothing for a chunk without third-party code, or for assets", () => {
    const files = emitted({
      "own.js": { type: "chunk", fileName: "own.js", moduleIds: [path.join(root, "x.js")] },
      "style.css": { type: "asset", fileName: "style.css" },
    });
    assert.deepEqual(files, []);
  });
});
