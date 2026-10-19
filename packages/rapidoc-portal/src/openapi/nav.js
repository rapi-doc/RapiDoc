import fs from 'node:fs';
import yaml from 'yaml';

/**
 * Parses an OpenAPI spec file (JSON or YAML) from a local filesystem path.
 *
 * @param {string} filePath - Absolute path to spec file
 * @returns {object|null} Parsed specification object
 */
export function parseSpecFile(filePath) {
  if (!filePath || !fs.existsSync(filePath)) return null;
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    return yaml.parse(raw);
  } catch (err) {
    console.warn(`[openapi/nav] Failed to parse spec file at ${filePath}:`, err.message);
    return null;
  }
}

/**
 * Extracts metadata for the right-hand API Sidecar card.
 *
 * @param {object} spec - Parsed OpenAPI specification
 * @returns {object} API sidecar metadata
 */
export function extractApiMetadata(spec = {}) {
  const info = spec.info || {};
  return {
    title: info.title || 'API Reference',
    version: info.version || '1.0.0',
    description: info.description || '',
    license: info.license || null,
    termsOfService: info.termsOfService || null,
    contact: info.contact || null,
    servers: Array.isArray(spec.servers) ? spec.servers : [],
    externalDocs: spec.externalDocs || null,
  };
}
