export {
  RapidocConfigSchema,
  ConfigError,
  normalizeConfig,
  loadConfig,
  resolveConfig,
  findConfigFile,
  CONFIG_CANDIDATES,
  generateMigratedConfig,
  migrateConfig,
  convertConfig,
  MIGRATION_SOURCES,
  defineConfig,
} from './config/index.js';

export { compileMarkdoc, compileDocFile, createMarkdocConfig, tags as markdocTags, extractHeadings } from './markdoc/index.js';

export { stripMarkup, extractDocSections, indexOpenApiSpec, buildSearchIndex, searchRecords } from './search/index.js';
export { buildPortal } from './engine/build-portal.js';
export { startDevServer } from './engine/dev-server.js';
export { checkApiSpec, checkPortalSpecs, readSpecFile, summaryAnchoredOperations } from './engine/spec-checks.js';
