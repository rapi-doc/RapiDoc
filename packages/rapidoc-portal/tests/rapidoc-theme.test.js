// The color attributes of the API reference's <rapi-doc>: a RapiDoc preset keeps its own accent and
// surfaces; otherwise the portal's accent (components/rapidoc-theme.js).
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { rapidocThemeAttributes } from "../src/components/rapidoc-theme.js";
import { renderThemeCss } from "../src/engine/theme-css.js";
import { readFileSync } from "node:fs";
import { DEFAULT_PRIMARY_COLOR, DEFAULT_LIGHT_ACCENT } from "../src/config/normalizer.js";

describe("rapidocThemeAttributes", () => {
  it("uses the portal's accent when rapidoc.theme is not set", () => {
    assert.deepEqual(rapidocThemeAttributes({ "render-style": "read" }, "#ff791a"), {
      preset: "amber",
      usesPreset: false,
      // data-portal-accent: the light theme takes the portal's light accent (pages/api-reference.astro)
      attributes: { theme: "amber", "primary-color": "#ff791a", "data-portal-accent": "" },
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

// Without theme.primary the portal takes the accents of RapiDoc's default theme, amber, which differ by mode
describe("the default accent", () => {
  const lightBlock = (css) => css.slice(css.indexOf('[data-theme="light"] {'));

  it("is amber's: #f6a821 in dark mode, #ab6534 with white text in light mode", () => {
    const css = renderThemeCss({});
    assert.match(css, /--portal-primary: #f6a821;/);
    assert.match(lightBlock(css), /--portal-primary: #ab6534;/);
    assert.match(lightBlock(css), /--portal-on-primary: #ffffff;/);
    assert.match(lightBlock(css), /--sl-color-accent: #ab6534;/);
    assert.ok(!css.includes("__PORTAL_"), "all theme tokens are replaced");
  });

  it("matches RapiDoc's amber theme", () => {
    const tokens = readFileSync(
      new URL("../../rapidoc/src/styles/theme-tokens.js", import.meta.url),
      "utf8",
    );
    const amber = tokens.slice(tokens.indexOf("  amber: {"));
    const light = amber.slice(amber.indexOf("light: `"));
    assert.match(amber, new RegExp(`dark: \`\\s*--primary: ${DEFAULT_PRIMARY_COLOR};`));
    assert.match(light, new RegExp(`--primary: ${DEFAULT_LIGHT_ACCENT.primary};`));
    assert.match(light, new RegExp(`--primary-foreground: ${DEFAULT_LIGHT_ACCENT.onPrimary};`));
  });

  it("is theme.primary in both modes when it is set", () => {
    const css = renderThemeCss({ theme: { primary: "#2563eb" } });
    assert.match(lightBlock(css), /--portal-primary: #2563eb;/);
    assert.match(lightBlock(css), /--portal-on-primary: #ffffff;/);
  });
});
