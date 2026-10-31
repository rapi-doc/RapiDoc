/**
 * Frontmatter keys the portal adds to Starlight's, merged in by the temp workspace's content config
 * (`docsSchema({ extend: portalFrontmatterSchema })`). Starlight deep-merges it, so `hero.layout`
 * sits next to Starlight's own hero keys and a wrong value fails the build with its path.
 *
 * Uses astro/zod, the zod instance Starlight's schemas are built with.
 */

import { z } from "astro/zod";

/** split: text left, image right (stacked on phones). stacked: centred text, image below. */
export const HERO_LAYOUTS = ["split", "stacked"];

export const portalFrontmatterSchema = z.object({
  hero: z
    .object({
      layout: z
        .enum(HERO_LAYOUTS)
        .optional()
        .describe("split (default): text left, image right. stacked: centred text, image below."),
    })
    .optional(),
});
