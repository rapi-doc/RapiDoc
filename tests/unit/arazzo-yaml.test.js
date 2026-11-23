import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { parse as parseWithYaml } from "yaml";
import { parseYaml } from "../../packages/rapidoc/src/utils/arazzo/yaml.js";
import { parseDocument } from "../../packages/rapidoc/src/utils/arazzo/parse.js";

/** Every YAML file under a folder */
const yamlFiles = (dir) =>
  fs.existsSync(dir)
    ? fs
        .readdirSync(dir, { withFileTypes: true, recursive: true })
        .filter((entry) => entry.isFile() && /\.ya?ml$/.test(entry.name))
        .map((entry) => path.join(entry.parentPath, entry.name))
        .filter((file) => !/node_modules|[\\/]dist[\\/]/.test(file))
    : [];

describe("the YAML reader of Arazzo documents (js-yaml)", () => {
  it("reads YAML 1.2 core values, with merge keys and no dates", () => {
    assert.deepEqual(
      parseYaml(
        "base: &b {a: 1, b: 2}\none: {<<: *b, b: 3}\nd: 2020-01-01\nt: yes\nn: ~\nh: 0x1F\nf: .5\ns: '1'\n200: ok",
      ),
      {
        base: { a: 1, b: 2 },
        one: { a: 1, b: 3 },
        d: "2020-01-01",
        t: "yes",
        n: null,
        h: 31,
        f: 0.5,
        s: "1",
        200: "ok",
      },
    );
    assert.deepEqual(parseYaml('{"a": [1, true, null]}'), { a: [1, true, null] });
    assert.equal(parseYaml("just text"), "just text");
  });

  it("gives null for an empty document", () => {
    for (const text of ["", "  \n\n", "# only a comment\n", "---\n"]) {
      assert.equal(parseYaml(text), null, JSON.stringify(text));
    }
  });

  it("keeps the value of a tag it does not know", () => {
    assert.deepEqual(parseYaml("a: !Ref x\nb: !Sub [1, 2]\nc: !m {k: v}\nd: !!binary aGk="), {
      a: "x",
      b: [1, 2],
      c: { k: "v" },
      d: "aGk=",
    });
  });

  it("reads past raw control characters, which YAML does not allow", () => {
    assert.deepEqual(parseYaml("a: x\u0007y\nb: z\u0081w"), { a: "xy", b: "zw" });
  });

  it("still fails on text that is not YAML", () => {
    assert.throws(() => parseYaml("a:\n  b: 1\n c: 2"));
    assert.throws(() => parseYaml("a: [1, 2"));
    assert.throws(() => parseYaml("a: 1\na: 2"), /duplicate/i);
    assert.throws(() => parseDocument("- a\n- b\n: x"));
  });

  it("reads every Arazzo and OpenAPI file of the sites and tests as the yaml package does", () => {
    const root = path.resolve(import.meta.dirname, "../..");
    const files = ["sites", "tests", "packages/rapidoc-mock/tests", "packages/rapidoc-portal/tests"]
      .flatMap((dir) => yamlFiles(path.join(root, dir)))
      // one spec has stray control characters: the yaml package keeps them, this reader drops them
      .filter((file) => !file.endsWith("youtube.yaml"));
    assert.ok(files.length > 100, `found ${files.length} files`);
    let compared = 0;
    for (const file of files) {
      const text = fs.readFileSync(file, "utf8");
      let expected;
      try {
        expected = parseWithYaml(text, { maxAliasCount: -1, merge: true });
      } catch {
        continue; // not valid YAML for either
      }
      assert.deepEqual(parseYaml(text), expected, path.relative(root, file));
      compared++;
    }
    assert.ok(compared > 100);
  });
});
