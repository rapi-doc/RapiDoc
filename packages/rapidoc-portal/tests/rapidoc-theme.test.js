// The color attributes of the API reference's <rapi-doc>: a RapiDoc preset keeps its own accent and
// surfaces; otherwise the portal's accent (components/rapidoc-theme.js).
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { rapidocThemeAttributes } from "../src/components/rapidoc-theme.js";

describe("rapidocThemeAttributes", () => {
  it("uses the portal's accent when rapidoc.theme is not set", () => {
    assert.deepEqual(rapidocThemeAttributes({ "render-style": "read" }, "#ff791a"), {
      preset: "amber",
      usesPreset: false,
      attributes: { theme: "amber", "primary-color": "#ff791a" },
    });
  });

  it("lets a preset keep its own accent and surfaces", () => {
    assert.deepEqual(rapidocThemeAttributes({ theme: "amber" }, "#ff791a"), {
      preset: "amber",
      usesPreset: true,
      attributes: { theme: "amber", "data-portal-preset": "" },
    });
  });

  it("takes a #hex rapidoc.theme as the accent, over the portal's surfaces", () => {
    assert.deepEqual(rapidocThemeAttributes({ theme: "#2563eb" }, "#ff791a"), {
      preset: "#2563eb",
      usesPreset: false,
      attributes: { theme: "#2563eb", "primary-color": "#2563eb" },
    });
  });
});
