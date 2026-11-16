import { defineCollection } from "astro:content";
import { docsLoader } from "@astrojs/starlight/loaders";
import { docsSchema } from "@astrojs/starlight/schema";

export const collections = {
  docs: defineCollection({
    loader: docsLoader({
      generateId: ({ entry }) => {
        // A folder's index.mdx is the folder's page: rapi-flow/index.mdx is docs/rapi-flow
        const clean = entry.replace(/\.(md|mdx)$/, "").replace(/(^|\/)index$/, "");
        return clean ? `docs/${clean}` : "docs";
      },
    }),
    schema: docsSchema(),
  }),
};
