import { defineCollection } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
  docs: defineCollection({
    loader: docsLoader({
      generateId: ({ entry }) => {
        const clean = entry.replace(/\.(md|mdx)$/, '');
        return clean === 'index' ? 'docs' : `docs/${clean}`;
      },
    }),
    schema: docsSchema(),
  }),
};
