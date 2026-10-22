export {
  RapidocConfigSchema,
  ApiItemSchema,
  NavItemSchema,
  normalizeConfig,
  loadConfig,
  findConfigFile,
  CONFIG_CANDIDATES,
  generateMigratedConfig,
  migrateConfig,
  defineConfig,
} from './config/index.js';

export { compileMarkdoc, compileDocFile, createMarkdocConfig, tags as markdocTags, extractHeadings } from './markdoc/index.js';

export { stripMarkup, extractDocSections, indexOpenApiSpec, buildSearchIndex, searchRecords } from './search/index.js';
export {
  buildStarlightSidebar,
  createStarlightConfig,
  prepareAstroWorkspace,
  buildPortalWithAstro,
  buildPortalWithAstro as buildPortal,
  devPortalWithAstro,
} from './astro/index.js';
