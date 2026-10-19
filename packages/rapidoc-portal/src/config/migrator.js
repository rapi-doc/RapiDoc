import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';
import { loadConfig } from './loader.js';

/**
 * Migrates an existing Redocly or Zudoku project into a clean rapidoc.config.yaml.
 *
 * @param {string} sourceDir - Directory containing redocly.yaml or zudoku.config.*
 * @returns {Promise<string>} Formatted YAML string representing rapidoc.config.yaml
 */
export async function generateMigratedConfig(sourceDir) {
  const loaded = await loadConfig(sourceDir);
  const normalized = loaded.config;

  // Build clean exportable object
  const migrated = {
    site: {
      title: normalized.site.title,
      description: normalized.site.description || undefined,
      tagline: normalized.site.tagline || undefined,
      logo: normalized.site.logo || undefined,
      favicon: normalized.site.favicon || '/favicon.ico',
    },
    apis: {},
    docs: {
      dir: normalized.docs.dir,
      engine: normalized.docs.engine,
    },
    navigation: normalized.navigation.map((group) => ({
      title: group.title,
      items: group.items.map((item) => {
        if (item.api) {
          return { label: item.label, api: item.api };
        }
        return { label: item.label, path: item.path };
      }),
    })),
    rapidoc: {
      'render-style': normalized.rapidoc['render-style'] || 'focused',
      'schema-style': normalized.rapidoc['schema-style'] || 'tree',
      'show-header': normalized.rapidoc['show-header'] !== undefined ? normalized.rapidoc['show-header'] : false,
      'allow-try': normalized.rapidoc['allow-try'] !== undefined ? normalized.rapidoc['allow-try'] : true,
      'allow-authentication': normalized.rapidoc['allow-authentication'] !== undefined ? normalized.rapidoc['allow-authentication'] : true,
      theme: normalized.rapidoc.theme || 'dark',
      'primary-color': normalized.rapidoc['primary-color'] || '#f59e0b',
    },
    search: {
      enabled: normalized.search.enabled,
      provider: normalized.search.provider,
    },
  };

  // Populate APIs map
  for (const api of normalized.apis) {
    migrated.apis[api.id] = {
      root: api.root,
      path: api.path,
      title: api.title,
      version: api.version || undefined,
      description: api.description || undefined,
    };
  }

  return YAML.stringify(migrated, { indent: 2 });
}

/**
 * Migrates and writes rapidoc.config.yaml directly to target directory.
 *
 * @param {string} targetDir - Directory to write rapidoc.config.yaml to
 * @param {object} options - Options ({ overwrite: boolean })
 * @returns {Promise<{ filePath: string, content: string }>}
 */
export async function migrateConfig(targetDir = process.cwd(), options = {}) {
  const outputPath = path.join(targetDir, 'rapidoc.config.yaml');

  if (fs.existsSync(outputPath) && !options.overwrite) {
    throw new Error(`File already exists: "${outputPath}". Use --overwrite or pass { overwrite: true } to replace it.`);
  }

  const yamlContent = await generateMigratedConfig(targetDir);
  fs.writeFileSync(outputPath, yamlContent, 'utf8');

  return {
    filePath: outputPath,
    content: yamlContent,
  };
}
