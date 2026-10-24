import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import YAML from 'yaml';
import { RapidocConfigSchema } from './schema.js';
import { checkReferences, normalizeConfig } from './normalizer.js';
import { ConfigError, describeIssues } from './errors.js';

export const CONFIG_CANDIDATES = [
  'rapidoc.config.yaml',
  'rapidoc.config.yml',
  'rapidoc.config.json',
  'rapidoc.config.js',
  'rapidoc.config.mjs',
  'rapidoc.config.ts',
];

/** Configs of other portals, which `rapidoc migrate` converts. */
const FOREIGN_CONFIGS = {
  'redocly.yaml': 'redocly',
  'redocly.yml': 'redocly',
  'zudoku.config.ts': 'zudoku',
  'zudoku.config.js': 'zudoku',
  'zudoku.config.mjs': 'zudoku',
};

/**
 * Searches for a valid configuration file in the specified directory.
 *
 * @param {string} dir - Directory to search in
 * @returns {string | null} Absolute path to the detected config file, or null
 */
export function findConfigFile(dir = process.cwd()) {
  for (const candidate of CONFIG_CANDIDATES) {
    const fullPath = path.resolve(dir, candidate);
    if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
      return fullPath;
    }
  }
  return null;
}

/**
 * Parses raw file content according to its extension.
 */
export async function parseRawFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const rawText = fs.readFileSync(filePath, 'utf8');

  if (ext === '.yaml' || ext === '.yml') {
    return YAML.parse(rawText) || {};
  }

  if (ext === '.json') {
    return JSON.parse(rawText);
  }

  if (ext === '.js' || ext === '.mjs') {
    const fileUrl = pathToFileURL(filePath).href;
    const mod = await import(fileUrl);
    return mod.default || mod;
  }

  if (ext === '.ts') {
    // Attempt dynamic import (Node 22+ supports strip-types with flag, or ESM)
    try {
      const fileUrl = pathToFileURL(filePath).href;
      const mod = await import(fileUrl);
      return mod.default || mod;
    } catch {
      // Fallback: simple regex/json extraction for config values if TS runner isn't active
      throw new Error(
        `Direct loading of TypeScript config "${filePath}" requires ts-node, tsx, or node --experimental-strip-types. Convert to rapidoc.config.yaml or use a JS/MJS config.`
      );
    }
  }

  throw new Error(`Unsupported configuration file format: ${ext}`);
}

/**
 * Validates a raw config object and normalizes it.
 *
 * @param {object} rawConfig - Parsed rapidoc.config.* contents
 * @param {string} baseDir - Folder of the config file (spec and docs paths are relative to it)
 * @param {string} [fileName] - Shown in error messages
 * @returns {object} Normalized portal config
 * @throws {ConfigError}
 */
export function resolveConfig(rawConfig, baseDir, fileName = 'rapidoc.config.yaml') {
  const result = RapidocConfigSchema.safeParse(rawConfig);
  if (!result.success) throw new ConfigError(fileName, describeIssues(result.error.issues));
  const problems = checkReferences(result.data);
  if (problems.length) throw new ConfigError(fileName, problems);
  return normalizeConfig(result.data, baseDir);
}

/**
 * Loads, validates, and normalizes a RapiDoc Portal configuration file.
 *
 * @param {string} dirOrFilePath - Path to config file, or directory containing it
 * @returns {Promise<{ config: object, rawConfig: object, configPath: string, format: string }>}
 * @throws {ConfigError} When the config is invalid
 */
export async function loadConfig(dirOrFilePath = process.cwd()) {
  let targetPath = path.resolve(dirOrFilePath);

  if (fs.existsSync(targetPath) && fs.statSync(targetPath).isDirectory()) {
    const detected = findConfigFile(targetPath);
    if (!detected) {
      const foreign = Object.keys(FOREIGN_CONFIGS).find((name) => fs.existsSync(path.join(targetPath, name)));
      throw new Error(
        foreign
          ? `Found ${foreign} but no rapidoc.config.yaml in "${targetPath}". Run \`rapidoc migrate --from ${FOREIGN_CONFIGS[foreign]}\` to create one.`
          : `No RapiDoc configuration file found in "${targetPath}". Expected one of: ${CONFIG_CANDIDATES.join(', ')}`
      );
    }
    targetPath = detected;
  } else if (!fs.existsSync(targetPath)) {
    throw new Error(`Configuration file not found: "${targetPath}"`);
  }

  const rawConfig = (await parseRawFile(targetPath)) || {};
  const config = resolveConfig(rawConfig, path.dirname(targetPath), path.basename(targetPath));

  return {
    config,
    rawConfig,
    configPath: targetPath,
    format: path.extname(targetPath).replace('.', ''),
  };
}
