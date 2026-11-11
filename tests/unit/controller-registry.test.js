// The tuner's controls. Attribute controls are derived from the element's declarations
// (packages/rapidoc/src/rapidoc.ts), so these tests compare them with the manifest read from there.
import test from "node:test";
import assert from "node:assert/strict";
import {
  CONTROL_REGISTRY,
  CATEGORY_TITLES,
  PRESETS,
  resolveActiveControls,
  resolveControlKeys,
  resolveActiveSlots,
  groupControlsByCategory,
  TUNER_SECTIONS,
} from "../../docs/src/components/controller-registry.ts";
import { readApiManifest, listAttributes } from "../../scripts/rapidoc-metadata.js";

const attributes = Object.fromEntries(listAttributes(readApiManifest()).map((a) => [a.name, a]));
const TUNER_ONLY = [
  "regular-font",
  "mono-font",
  "slot-nav-logo",
  "slot-fixed-header",
  "slot-default",
];

test("controller-registry", async (t) => {
  await t.test("every control but the font and slot ones is an attribute of <rapi-doc>", () => {
    for (const [key, control] of Object.entries(CONTROL_REGISTRY)) {
      if (TUNER_ONLY.includes(key)) continue;
      const attribute = attributes[control.attr];
      assert.ok(attribute && !attribute.deprecated, `${key} is not an attribute the element reads`);
      assert.equal(control.label, attribute.name, "the label is the attribute name");
      assert.equal(control.category, attribute.group, "the section is the attribute's group");
      assert.ok(control.tip, `${key} has a tip`);
    }
  });

  await t.test("a true/false attribute is a toggle starting at the element's default", () => {
    const allowTry = CONTROL_REGISTRY["allow-try"];
    assert.equal(allowTry.type, "toggle");
    assert.equal(allowTry.defaultOn, true);
    assert.equal(CONTROL_REGISTRY["show-components"].defaultOn, false);
    for (const control of Object.values(CONTROL_REGISTRY)) {
      if (control.type !== "toggle" || !attributes[control.attr]) continue;
      assert.equal(attributes[control.attr].kind, "boolean", control.attr);
      assert.equal(String(control.defaultOn), attributes[control.attr].default, control.attr);
    }
  });

  await t.test("a list attribute offers the element's values, labelled as written in HTML", () => {
    const renderStyle = CONTROL_REGISTRY["render-style"];
    assert.equal(renderStyle.type, "segmented");
    assert.deepEqual(renderStyle.options, [
      { label: "read", rawVal: "read", isDefault: true },
      { label: "view", rawVal: "view" },
      { label: "focused", rawVal: "focused" },
    ]);
    assert.deepEqual(
      CONTROL_REGISTRY.mcp.options.map((option) => option.rawVal),
      ["true", "false", "none"],
    );
    for (const control of Object.values(CONTROL_REGISTRY)) {
      const attribute = attributes[control.attr];
      if (control.type !== "segmented" || !attribute?.values || attribute.open) continue;
      assert.deepEqual(
        control.options.map((option) => option.rawVal),
        attribute.values,
        control.attr,
      );
      const initial = control.options.find((option) => option.isDefault)?.rawVal;
      assert.equal(initial, attribute.default, `default of ${control.attr}`);
    }
  });

  await t.test(
    "the tip is the attribute's summary; the description is kept when it says more",
    () => {
      const renderStyle = CONTROL_REGISTRY["render-style"];
      assert.equal(renderStyle.tip, attributes["render-style"].summary);
      assert.match(renderStyle.description, /Three distinct modes/);
      assert.equal(renderStyle.defaultText, "read");
      assert.equal(CONTROL_REGISTRY["allow-try"].defaultText, "true");
      assert.equal(CONTROL_REGISTRY["heading-text"].defaultText, "(empty)");
      assert.match(CONTROL_REGISTRY.layout.defaultText, /column \(read, focused\)/);
      assert.equal(CONTROL_REGISTRY["regular-font"].defaultText, undefined, "not an attribute");
      for (const control of Object.values(CONTROL_REGISTRY)) {
        const attribute = attributes[control.attr];
        if (attribute?.summary) assert.equal(control.tip, attribute.summary, control.attr);
      }
    },
  );

  await t.test("free-form attributes offer sample values, swatches come with the theme", () => {
    assert.deepEqual(CONTROL_REGISTRY["heading-text"].options[0], {
      label: "default",
      rawVal: "",
      isDefault: true,
    });
    const levels = CONTROL_REGISTRY["schema-expand-level"].options;
    assert.equal(levels.find((option) => option.isDefault).rawVal, "99999");
    assert.ok(CONTROL_REGISTRY.theme.options.every((option) => option.dotColor));
    // the element's presets, then a custom hex colour as an example of the open list
    assert.deepEqual(
      CONTROL_REGISTRY.theme.options.map((option) => option.rawVal),
      [...attributes.theme.values, "#f4bf32"],
    );
  });

  await t.test("PRESETS map to valid controls in CONTROL_REGISTRY", () => {
    assert.ok(PRESETS.minimal.length > 0);
    for (const [presetName, controls] of Object.entries(PRESETS)) {
      if (presetName === "none") {
        assert.equal(controls.length, 0);
        continue;
      }
      for (const ctrlKey of controls) {
        assert.ok(
          CONTROL_REGISTRY[ctrlKey],
          `Preset "${presetName}" references unknown control: "${ctrlKey}"`,
        );
      }
    }
  });

  await t.test("resolveActiveControls resolves presets and custom control lists correctly", () => {
    const minimal = resolveActiveControls(undefined, "minimal");
    assert.ok(minimal.length >= 3);
    assert.ok(minimal.some((c) => c.attr === "render-style"));
    assert.ok(minimal.some((c) => c.attr === "theme"));

    // Custom list with duplicates
    const custom = resolveActiveControls(["theme", "theme", "schema-style", "invalid-key"]);
    assert.equal(custom.length, 2);
    assert.equal(custom[0].attr, "theme");
    assert.equal(custom[1].attr, "schema-style");

    // Fallback on empty/invalid preset
    const fallback = resolveActiveControls(undefined, "non-existent-preset");
    assert.deepEqual(
      fallback.map((c) => c.attr),
      PRESETS.minimal,
    );
  });

  await t.test("sections come in the tuner's own order, least used last", () => {
    const groups = groupControlsByCategory(resolveActiveControls(PRESETS.all), true);
    const titles = groups.map((group) => group.title);
    assert.deepEqual(titles, [
      "Theme",
      "Layout & Scrolling",
      "Schemas",
      "Authentication",
      "Try & Servers",
      "Mock Server",
      "MCP",
      "Sidebar & Navigation",
      "Header & Sections",
      "Fonts",
      "Slots",
      "Spec & Content",
    ]);
    // every group of the element has a place, also one added later
    for (const group of new Set(Object.values(attributes).map((a) => a.group))) {
      assert.ok(TUNER_SECTIONS.includes(group), group);
    }
    assert.ok(TUNER_SECTIONS.indexOf("Methods & Actions") > TUNER_SECTIONS.indexOf("Slots"));
    for (const group of groups) {
      assert.equal(CATEGORY_TITLES[group.id], group.title);
      assert.ok(group.controls.length > 0);
      for (const ctrl of group.controls) assert.equal(ctrl.category, group.id);
    }
    const withoutSlots = groupControlsByCategory(resolveActiveControls(PRESETS.all));
    assert.ok(!withoutSlots.some((group) => group.id === "Slots"));
  });

  await t.test("slot and colour presets", () => {
    assert.deepEqual(PRESETS.slots, ["slot-nav-logo", "slot-fixed-header", "slot-default"]);
    assert.deepEqual(PRESETS.slot, PRESETS.slots);
    for (const ctrl of PRESETS.colors) {
      assert.ok(["Theme", "Fonts"].includes(CONTROL_REGISTRY[ctrl].category), ctrl);
    }
    assert.deepEqual(resolveActiveSlots(undefined, "slots"), [
      "nav-logo",
      "fixed-header",
      "default",
    ]);
    assert.deepEqual(resolveActiveSlots(["theme"]), []);
  });

  await t.test("aliases resolve to their control", () => {
    assert.deepEqual(resolveControlKeys(["primary-color", "nav-logo"]), ["theme", "slot-nav-logo"]);
  });
});
