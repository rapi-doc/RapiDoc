/**
 * Frontmatter the portal adds to Starlight's (src/engine/frontmatter.js), merged the way the temp
 * workspace's content config merges it. tests/engine.test.js checks a built hero's data-layout.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { z } from "astro/zod";
import { docsSchema } from "@astrojs/starlight/schema";
import { HERO_LAYOUTS, portalFrontmatterSchema } from "../src/engine/frontmatter.js";

// Starlight's schema takes Astro's content context; only image() is used, for hero images.
const schema = docsSchema({ extend: portalFrontmatterSchema })({ image: () => z.string() });
const page = (hero) => ({ title: "Home", template: "splash", hero });

describe("frontmatter: hero.layout", () => {
  it("accepts each layout next to Starlight's hero keys", () => {
    for (const layout of HERO_LAYOUTS) {
      const { hero } = schema.parse(page({ layout, title: "Hi", image: { file: "./hero.png" } }));
      assert.equal(hero.layout, layout);
      assert.equal(hero.title, "Hi");
      assert.equal(hero.image.file, "./hero.png");
    }
  });

  it("is optional", () => {
    assert.equal(schema.parse(page({ tagline: "Hello" })).hero.layout, undefined);
    assert.equal(schema.parse({ title: "Guide" }).hero, undefined);
  });

  it("rejects an unknown layout with its path", () => {
    const result = schema.safeParse(page({ layout: "stack" }));
    assert.equal(result.success, false);
    assert.deepEqual(result.error.issues[0].path, ["hero", "layout"]);
  });
});
