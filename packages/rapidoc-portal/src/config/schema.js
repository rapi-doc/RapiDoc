import { z } from 'zod';

/**
 * Single API specification item schema.
 * Tolerantly accepts Redocly's 'root' or Zudoku's 'input', and aliases.
 */
export const ApiItemSchema = z
  .object({
    id: z.string().optional(),
    name: z.string().optional(),
    root: z.string().optional(),
    input: z.string().optional(),
    spec: z.string().optional(),
    path: z.string().optional(),
    title: z.string().optional(),
    version: z.string().optional(),
    description: z.string().optional(),
    category: z.string().optional(),
    categories: z.any().optional(),
  })
  .refine((data) => data.root || data.input || data.spec, {
    message: 'Each API entry must define a spec location using "root", "input", or "spec".',
  });

/**
 * APIs catalog schema: accepts either Redocly map ({ [id]: spec }) or Zudoku list (spec[]).
 */
export const ApisCatalogSchema = z.union([
  // Array format (Zudoku style)
  z.array(ApiItemSchema),
  // Record format (Redocly style: { payments: { root: "..." } } or { payments: "./spec.yaml" })
  z.record(z.string(), z.union([z.string().transform((str) => ({ root: str })), ApiItemSchema])),
]);

/**
 * Navigation item or category schema.
 * Tolerantly accepts title/label/group, and path/page/href/api.
 */
export const NavItemSchema = z.lazy(() =>
  z.union([
    // Simple string reference to a doc page (e.g. "overview" or "/docs/overview")
    z.string().transform((str) => ({ label: str, path: str })),
    // Category or Link object
    z.object({
      title: z.string().optional(),
      label: z.string().optional(),
      group: z.string().optional(),
      path: z.string().optional(),
      page: z.string().optional(),
      href: z.string().optional(),
      to: z.string().optional(),
      api: z.string().optional(),
      items: z.array(z.any()).optional(),
    }),
  ])
);

/**
 * Site Branding & Metadata Schema.
 */
export const SiteConfigSchema = z.object({
  title: z.string().default('Developer Portal'),
  tagline: z.string().optional(),
  description: z.string().optional(),
  logo: z
    .union([
      z.string().transform((src) => ({ light: src, dark: src, alt: 'Logo' })),
      z.object({
        light: z.string().optional(),
        dark: z.string().optional(),
        src: z.union([z.string(), z.object({ light: z.string(), dark: z.string() })]).optional(),
        alt: z.string().default('Logo'),
        href: z.string().default('/'),
      }),
    ])
    .optional(),
  favicon: z.string().optional(),
  baseUrl: z.string().default('/'),
  announcement: z
    .object({
      text: z.string(),
      link: z.string().optional(),
      dismissible: z.boolean().default(true),
      bgColor: z.string().optional(),
      textColor: z.string().optional(),
    })
    .optional(),
  headerLinks: z
    .array(
      z.object({
        label: z.string(),
        path: z.string().optional(),
        href: z.string().optional(),
        icon: z.string().optional(),
        items: z
          .array(
            z.object({
              label: z.string(),
              title: z.string().optional(),
              path: z.string().optional(),
              href: z.string().optional(),
              icon: z.string().optional(),
              description: z.string().optional(),
            })
          )
          .optional(),
      })
    )
    .optional(),
  footer: z
    .object({
      columns: z
        .array(
          z.object({
            title: z.string(),
            links: z.array(
              z.object({
                label: z.string(),
                href: z.string().optional(),
                path: z.string().optional(),
              })
            ),
          })
        )
        .optional(),
      social: z
        .array(
          z.object({
            icon: z.string(),
            href: z.string(),
          })
        )
        .optional(),
      copyright: z.string().optional(),
      branding: z.string().optional(),
    })
    .optional(),
});

/**
 * Docs Content Directory Schema.
 */
export const DocsConfigSchema = z.union([
  z.string().transform((dir) => ({ dir, engine: 'markdoc' })),
  z.object({
    dir: z.string().default('./docs'),
    files: z.string().optional(),
    engine: z.enum(['markdoc', 'markdown', 'mdx']).default('markdoc'),
  }),
]);

/**
 * Search Configuration Schema.
 */
export const SearchConfigSchema = z.union([
  z.boolean().transform((enabled) => ({ enabled, provider: 'pagefind' })),
  z.object({
    enabled: z.boolean().default(true),
    provider: z.string().default('pagefind'),
  }),
]);

/**
 * Tolerant Super-Set Configuration Schema.
 * Accepts rapidoc.config.yaml, rapidoc.config.ts, redocly.yaml, and zudoku.config.ts.
 */
export const RapidocConfigSchema = z.object({
  site: SiteConfigSchema.default({}),
  apis: ApisCatalogSchema.default({}),
  docs: DocsConfigSchema.default({ dir: './docs', engine: 'markdoc' }),
  navigation: z.array(NavItemSchema).optional(),
  sidebars: z.array(NavItemSchema).optional(), // Redocly alias
  rapidoc: z.record(z.string(), z.any()).default({}),
  theme: z.record(z.string(), z.any()).default({}),
  search: SearchConfigSchema.default({ enabled: true, provider: 'pagefind' }),
  catalog: z.any().optional(),
  catalogs: z.any().optional(), // Zudoku alias
  footer: z.any().optional(),
});
