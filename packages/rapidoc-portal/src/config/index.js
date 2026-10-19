export { RapidocConfigSchema, ApiItemSchema, NavItemSchema } from './schema.js';
export { normalizeConfig } from './normalizer.js';
export { loadConfig, findConfigFile, CONFIG_CANDIDATES } from './loader.js';
export { generateMigratedConfig, migrateConfig } from './migrator.js';

/**
 * Type-hinting helper for JS / TS configs.
 *
 * @param {import('./schema.js').RapidocConfig} config
 * @returns {import('./schema.js').RapidocConfig}
 */
export function defineConfig(config) {
  return config;
}
