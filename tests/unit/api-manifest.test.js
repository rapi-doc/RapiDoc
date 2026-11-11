// The public API of <rapi-doc> is read from the declarations and doc comments of rapidoc.ts
// (scripts/rapidoc-api.js): the docs /api page renders it and the build turns it into the schema,
// custom elements manifest and types in dist/. These tests check the reader and the generators.
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { parseDocComment } from "../../scripts/rapidoc-api.js";
import {
  readApiManifest,
  readElementManifests,
  listAttributes,
  buildOptionsSchema,
  buildCustomElementsManifest,
  buildTypes,
  buildFlowTypes,
  buildReactTypes,
  buildVueTypes,
  buildIntegrationManifest,
  plainText,
} from "../../scripts/rapidoc-metadata.js";

const manifest = readApiManifest();
const elements = readElementManifests();
const attributes = listAttributes(manifest);
const pkg = { name: "rapidoc", version: "0.0.0" };

/** Reads the manifest of a small element written to a temporary file. */
function manifestOf(members, classDoc = "") {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "rapidoc-api-"));
  try {
    const file = path.join(dir, "element.ts");
    fs.writeFileSync(file, `${classDoc}\nexport default class RapiDoc {\n${members}\n}\n`);
    return readApiManifest(file);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

describe("doc comments", () => {
  it("splits a comment into description and tags", () => {
    const doc = parseDocComment(
      [
        "/**",
        "   * Shows the <b>header</b>,",
        "   * mail ann@example.com or see @rapidoc/prerender.",
        "   * @group Hide and Show",
        "   * @hidden",
        "   * @code",
        "   * <script>",
        "   *   run();",
        "   * </script>",
        "   */",
      ].join("\n"),
    );
    assert.equal(
      doc.description,
      "Shows the <b>header</b>,\nmail ann@example.com or see @rapidoc/prerender.",
    );
    assert.deepEqual(doc.tags, [
      { name: "group", text: "Hide and Show" },
      { name: "hidden", text: "" },
      { name: "code", text: "<script>\n  run();\n</script>" },
    ]);
  });

  it("reads a one-line comment", () => {
    assert.deepEqual(parseDocComment("/** @internal */").tags, [{ name: "internal", text: "" }]);
  });
});

describe("the manifest read from an element", () => {
  it("takes name, allowed values, default and number type from the declaration", () => {
    const { Attributes } = manifestOf(`
  /**
   * How it renders.
   * @summary Display mode
   * @group Layout
   * @example /examples/render-style
   */
  @property({ type: String, attribute: "render-style" })
  renderStyle: "read" | "view" = "read";

  /**
   * A color.
   * @group Layout
   * @allowedNote (or a hex color)
   * @default ember
   */
  @property({ type: String, reflect: true })
  theme: "ember" | "jade" | (string & {}) = DEFAULT_THEME;

  /** Depth. @group ignored on this line
   * @group Schema
   */
  @property({ type: Number, attribute: "expand-level" }) expandLevel = 3;

  /**
   * A URL.
   * @group Schema
   * @hidden
   */
  @property({ type: String, attribute: "spec-url" }) specUrl = "";

  /** @internal */
  @property({ type: Boolean }) loading = false;
  @property({ type: String, attribute: false }) specFile: any;
  notReactive = 1;`);
    assert.deepEqual(Attributes, [
      {
        "Layout Attributes": [
          {
            name: "render-style",
            allowed: ["read", "view"],
            description: "How it renders.",
            summary: "Display mode",
            default: "read",
            example: "/examples/render-style",
          },
          {
            name: "theme",
            allowed: ["ember", "jade", "(or a hex color)"],
            description: "A color.",
            default: "ember",
          },
        ],
      },
      {
        "Schema Attributes": [
          {
            name: "expand-level",
            description: "Depth. @group ignored on this line",
            type: "number",
            default: 3,
          },
          { name: "spec-url", description: "A URL.", default: "(empty)", hidden: true },
        ],
      },
    ]);
  });

  it("fails on an attribute without a description or group", () => {
    assert.throws(
      () => manifestOf('  @property({ type: String, attribute: "new-thing" }) newThing = "";'),
      /attribute "new-thing" \(newThing\) needs a doc comment/,
    );
    assert.throws(
      () => manifestOf('  /** Described. */\n  @property({ type: String }) theme = "";'),
      /attribute "theme"/,
    );
  });

  it("reads documented methods, events, slots and removed attributes", () => {
    const api = manifestOf(
      `
  /**
   * Loads a spec.
   * @public
   * @example https://example.com/load
   */
  async loadSpec(specUrl) {}

  /**
   * Scrolls.
   * @public scrollToPath(path)
   * @code
   * el.scrollToPath('get-/pets');
   */
  scrollToPath(elementId, expand = true) {}

  // Public Method
  helper() {}`,
      `/**
 * An element.
 *
 * @fires spec-loaded - After the spec
 * is rendered.
 * @slot - The default slot.
 * @slot tag--{tag-name} - Under a tag.
 * @deprecatedAttr old-one | Layout | a, b | a | No longer read.
 */`,
    );
    assert.deepEqual(api.Methods.items, [
      {
        name: "loadSpec(specUrl)",
        description: "Loads a spec.",
        example: "https://example.com/load",
      },
      {
        name: "scrollToPath(path)",
        description: "Scrolls.",
        code: "el.scrollToPath('get-/pets');\n",
      },
    ]);
    assert.deepEqual(api.Events.items, [
      { name: "spec-loaded", description: "After the spec\nis rendered." },
    ]);
    assert.deepEqual(api.Slots.items, [
      { name: "(default)", description: "The default slot." },
      { name: "tag--{tag-name}", description: "Under a tag." },
    ]);
    assert.deepEqual(api.Attributes, [
      {
        "Layout Attributes": [
          {
            name: "old-one",
            deprecated: true,
            allowed: ["a", "b"],
            description: "No longer read.",
            default: "a",
          },
        ],
      },
    ]);
  });
});

describe("rapidoc.ts", () => {
  it("documents every attribute, with unique names", () => {
    assert.ok(attributes.length > 60);
    const names = attributes.map((a) => a.name);
    assert.deepEqual(
      names.filter((name, i) => names.indexOf(name) !== i),
      [],
    );
    for (const attribute of attributes) assert.ok(attribute.description, attribute.name);
  });

  it("gives every list of values a default from that list, or none", () => {
    for (const group of manifest.Attributes) {
      for (const item of Object.values(group)[0]) {
        if (!item.allowed || item.default === undefined) continue;
        const listed = item.allowed.includes(String(item.default));
        const isNote = /[()]/.test(String(item.default));
        assert.ok(
          listed || isNote,
          `${item.name}: default "${item.default}" is not an allowed value`,
        );
      }
    }
  });

  it("documents methods, events and slots", () => {
    assert.ok(manifest.Methods.items.some((method) => method.name === "loadSpec(spec)"));
    assert.ok(manifest.Events.items.some((event) => event.name === "before-try"));
    assert.ok(manifest.Slots.items.some((slot) => slot.name === "(default)"));
  });
});

describe("rapidoc metadata", () => {
  it("turns descriptions into plain text", () => {
    assert.equal(
      plainText('Use <span class="mono">&lt;link&gt;</span>\n  &amp; more'),
      "Use <link> & more",
    );
  });

  it("derives kinds from the allowed values", () => {
    const byName = Object.fromEntries(attributes.map((a) => [a.name, a]));
    assert.equal(byName["allow-try"].kind, "boolean");
    assert.equal(byName["allow-try"].default, "true");
    assert.equal(byName["render-style"].kind, "enum");
    assert.deepEqual(byName["render-style"].values, ["read", "view", "focused"]);
    assert.equal(byName.theme.open, true, "a note in the list makes it open");
    assert.ok(!byName.theme.values.some((value) => value.startsWith("(")));
    assert.equal(byName.mcp.kind, "enum", "true/false/none is not a boolean");
    assert.equal(byName["schema-expand-level"].kind, "number");
    assert.equal(byName["spec-url"].default, undefined, "(empty) is a note");
    assert.deepEqual(byName["fetch-credentials"].values, ["omit", "same-origin", "include"]);
    assert.equal(byName.layout.default, undefined, "a default that depends on render-style");
  });

  it("builds a JSON Schema with one property per attribute", () => {
    const schema = buildOptionsSchema(manifest, pkg);
    assert.equal(Object.keys(schema.properties).length, attributes.length);
    assert.deepEqual(schema.properties["allow-try"].enum, [true, false, "true", "false"]);
    assert.deepEqual(schema.properties["render-style"].enum, ["read", "view", "focused"]);
    assert.equal(schema.properties.theme.enum, undefined);
    assert.equal(schema.properties["mock-server-delay"].type, "number");
    assert.equal(schema.properties["on-nav-tag-click"].deprecated, true);
  });

  it("builds a custom elements manifest with every element, by bundle", () => {
    const cem = buildCustomElementsManifest(elements);
    assert.deepEqual(
      cem.modules.map((module) => module.path),
      ["dist/rapidoc-min.js", "dist/rapidoc-flow-min.js"],
    );
    const [main, mini] = cem.modules[0].declarations;
    assert.equal(main.tagName, "rapi-doc");
    assert.equal(main.attributes.length, attributes.length);
    assert.ok(main.events.some((event) => event.name === "spec-loaded"));
    assert.ok(
      main.slots.some((slot) => slot.name === ""),
      "the default slot",
    );
    const loadSpec = main.members.find((member) => member.name === "loadSpec");
    assert.deepEqual(loadSpec.parameters, [{ name: "spec" }]);

    assert.equal(mini.tagName, "rapi-doc-mini");
    assert.ok(mini.attributes.some((attribute) => attribute.name === "paths-expanded"));
    assert.ok(mini.members.some((member) => member.name === "removeAllSecurityKeys"));

    const [flow] = cem.modules[1].declarations;
    assert.equal(flow.tagName, "rapi-flow");
    assert.deepEqual(
      flow.events.map((event) => event.name),
      ["flow-loaded", "step-click", "view-change", "workflow-run"],
    );
    assert.deepEqual(cem.modules[1].exports[0].declaration, {
      name: "RapiFlow",
      module: "dist/rapidoc-flow-min.js",
    });
  });

  it("builds types with every attribute, event and method of each element", () => {
    const types = buildTypes(elements);
    assert.match(types, /"allow-try"\?: "true" \| "false";/);
    assert.match(types, /"spec-loaded": CustomEvent;/);
    assert.match(types, /loadSpec\(spec\?: any\): any;/);
    assert.match(types, /"rapi-doc": RapiDocElement;/);
    assert.match(types, /export interface RapiDocMiniAttributes \{/);
    assert.match(types, /"paths-expanded"\?: "true" \| "false";/);
    assert.match(types, /"rapi-doc-mini": RapiDocMiniElement;/);
    assert.doesNotMatch(types, /RapiFlow/, "the flow element is in its own bundle");

    const flow = buildFlowTypes(elements);
    assert.match(flow, /export interface RapiFlowAttributes \{/);
    assert.match(flow, /"view"\?: "expanded" \| "compact";/);
    assert.match(flow, /"workflow-run": CustomEvent;/);
    assert.match(flow, /"rapi-flow": RapiFlowElement;/);

    for (const text of [buildReactTypes(), buildVueTypes()]) {
      for (const tag of ["rapi-doc", "rapi-doc-mini", "rapi-flow"])
        assert.ok(text.includes(`"${tag}"`));
    }
  });

  it("reads the mini and flow elements from their own sources", () => {
    const byTag = Object.fromEntries(elements.map((element) => [element.tag, element]));
    const mini = Object.fromEntries(
      listAttributes(byTag["rapi-doc-mini"].manifest).map((a) => [a.name, a]),
    );
    assert.equal(mini.layout.default, "row", "its own default, not <rapi-doc>'s");
    assert.equal(mini["response-area-height"].default, "300px");
    assert.equal(mini["show-header"], undefined, "it has no header");
    // every attribute of the mini element that <rapi-doc> also has takes the same values
    for (const attribute of Object.values(mini)) {
      const same = attributes.find((a) => a.name === attribute.name);
      if (same?.values) assert.deepEqual(attribute.values, same.values, attribute.name);
    }
    const flow = listAttributes(byTag["rapi-flow"].manifest).map((a) => a.name);
    assert.deepEqual(flow.slice(0, 4), ["arazzo-url", "spec-url", "workflow-id", "for"]);
  });

  it("lists the files of a build with size and SRI hash", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "rapidoc-metadata-"));
    try {
      fs.writeFileSync(path.join(dir, "rapidoc-min.js"), "export {};\n");
      const integration = buildIntegrationManifest(dir, { name: "rapidoc", version: "1.2.3" });
      assert.equal(integration.contract, 1);
      assert.equal(integration.cdn, "https://cdn.jsdelivr.net/npm/rapidoc@1.2.3/dist/");
      assert.deepEqual(Object.keys(integration.files), ["rapidoc-min.js"]);
      const file = integration.files["rapidoc-min.js"];
      assert.equal(file.role, "script");
      assert.equal(file.bytes, 11);
      assert.match(file.integrity, /^sha384-[A-Za-z0-9+/]{64}$/);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });
});
