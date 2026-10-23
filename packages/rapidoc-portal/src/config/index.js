export { RapidocConfigSchema, TabSchema, SidebarItemSchema, HeaderLinkSchema, ApiSchema } from './schema.js';
export { normalizeConfig, checkReferences } from './normalizer.js';
export { ConfigError } from './errors.js';
export { loadConfig, resolveConfig, findConfigFile, CONFIG_CANDIDATES } from './loader.js';
export { generateMigratedConfig, migrateConfig, convertConfig, MIGRATION_SOURCES } from './migrator.js';

/**
 * Type-hinting helper for JS / TS configs.
 *
 * @param {object} config
 * @returns {object}
 */
export function defineConfig(config) {
  return config;
}
