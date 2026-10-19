import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import YAML from 'yaml';
import { RapidocConfigSchema } from './schema.js';
import { normalizeConfig } from './normalizer.js';

export const CONFIG_CANDIDATES = [
  // Primary RapiDoc config formats
  'rapidoc.config.yaml',
  'rapidoc.config.yml',
  'rapidoc.config.json',
  'rapidoc.config.js',
  'rapidoc.config.mjs',
  'rapidoc.config.ts',
  // Fallbacks
  'redocly.yaml',
  'redocly.yml',
  'zudoku.config.ts',
  'zudoku.config.js',
  'zudoku.config.mjs',
];

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
async function parseRawFile(filePath) {
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
 * Loads, validates, and normalizes a RapiDoc Portal configuration file.
 *
 * @param {string} dirOrFilePath - Path to config file, or directory containing it
 * @returns {Promise<{ config: object, rawConfig: object, configPath: string, format: string, isFallback: boolean }>}
 */
export async function loadConfig(dirOrFilePath = process.cwd()) {
  let targetPath = path.resolve(dirOrFilePath);

  if (fs.existsSync(targetPath) && fs.statSync(targetPath).isDirectory()) {
    const detected = findConfigFile(targetPath);
    if (!detected) {
      throw new Error(
        `No RapiDoc or fallback configuration file found in "${targetPath}". Expected one of: ${CONFIG_CANDIDATES.join(', ')}`
      );
    }
    targetPath = detected;
  } else if (!fs.existsSync(targetPath)) {
    throw new Error(`Configuration file not found: "${targetPath}"`);
  }

  const baseDir = path.dirname(targetPath);
  const fileName = path.basename(targetPath);
  const isRedocly = fileName.startsWith('redocly.');
  const isZudoku = fileName.startsWith('zudoku.config.');
  const isFallback = isRedocly || isZudoku;

  // 1. Read & parse raw config file
  let rawConfig = await parseRawFile(targetPath);

  // 2. If Redocly config is detected, check for companion sidebars.yaml
  if (isRedocly && !rawConfig.navigation && !rawConfig.sidebars) {
    const sidebarCandidates = ['sidebars.yaml', 'sidebars.yml'];
    for (const sb of sidebarCandidates) {
      const sbPath = path.join(baseDir, sb);
      if (fs.existsSync(sbPath)) {
        try {
          const sbContent = YAML.parse(fs.readFileSync(sbPath, 'utf8'));
          if (Array.isArray(sbContent)) {
            rawConfig.sidebars = sbContent;
          }
        } catch {
          // ignore sidebar parse error if malformed
        }
        break;
      }
    }
  }

  // 3. Validate against Tolerant Super-Set Schema
  const validated = RapidocConfigSchema.parse(rawConfig);

  // 4. Normalize to canonical internal structure
  const normalized = normalizeConfig(validated, baseDir);

  return {
    config: normalized,
    rawConfig,
    configPath: targetPath,
    format: path.extname(targetPath).replace('.', ''),
    isFallback,
  };
}
