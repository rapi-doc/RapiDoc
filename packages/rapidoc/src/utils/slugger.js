import Slugger from 'github-slugger';

/**
 * Converts any string (camelCase, PascalCase, snake_case, spaces, slashes) to clean kebab-case.
 *
 * @param {string} str
 * @returns {string}
 */
export function toKebabCase(str) {
  return String(str || '')
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .replace(/[_\s/\\.]+/g, '-')
    .replace(/[^a-zA-Z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}

/**
 * Clamps a slug at a word boundary to prevent URL bloat from lengthy summaries.
 *
 * @param {string} slug
 * @param {number} [maxLen=40]
 * @returns {string}
 */
export function clampWordBoundary(slug, maxLen = 40) {
  if (!slug || slug.length <= maxLen) return slug;
  const cut = slug.slice(0, maxLen);
  const lastHyphen = cut.lastIndexOf('-');
  return lastHyphen > 8 ? cut.slice(0, lastHyphen) : cut;
}

/**
 * Deterministic, collision-free operation anchor slugger for OpenAPI specs.
 */
export class OperationSlugger {
  constructor() {
    this.slugger = new Slugger();
    this.used = new Set();
    this.opMap = new Map();
  }

  reset() {
    this.slugger.reset();
    this.used.clear();
    this.opMap.clear();
  }

  /**
   * Generates a clean operation slug candidate (without tag prefix).
   *
   * @param {Object} op - Operation object with { method, path, operationId, summary }
   * @returns {string} Operation slug candidate
   */
  slugOp(op = {}) {
    let candidate = '';

    // Candidate 1: operationId (if concise: <= 45 chars and not a generic placeholder)
    if (op.operationId && typeof op.operationId === 'string') {
      const trimmed = op.operationId.trim();
      if (trimmed.length > 0 && trimmed.length <= 45 && !/^(endpoint|operation|method|api)[-_]?\d+$/i.test(trimmed)) {
        candidate = toKebabCase(trimmed);
      }
    }

    // Candidate 2: summary (with early 100-char pre-slice and 40-char word-boundary clamp)
    if (!candidate && op.summary && typeof op.summary === 'string' && op.summary.trim()) {
      const head = op.summary.trim().slice(0, 100);
      const slugified = toKebabCase(head);
      if (slugified) {
        candidate = clampWordBoundary(slugified, 40);
      }
    }

    // Candidate 3: Method + Clean Path (guaranteed fallback if both opId and summary are missing)
    if (!candidate) {
      const method = (op.method || 'get').toLowerCase();
      const cleanPath = (op.path || '')
        .replace(/[{}]/g, '')
        .replace(/[^a-zA-Z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      candidate = cleanPath ? `${method}-${cleanPath}` : method;
    }

    return candidate;
  }

  /**
   * Generates a clean, unique elementId for an operation.
   *
   * @param {Object} op - Operation object with { method, path, operationId, summary }
   * @param {string} [tagSlug=''] - Optional tag slug for hierarchical routing
   * @returns {string} Unique elementId
   */
  slug(op = {}, tagSlug = '') {
    const opKey = tagSlug
      ? `${tagSlug}:${(op.method || 'get').toLowerCase()} ${op.path || ''}`
      : `${(op.method || 'get').toLowerCase()} ${op.path || ''}`;

    if (this.opMap.has(opKey)) {
      return this.opMap.get(opKey);
    }

    let candidate = this.slugOp(op);

    // Smart semantic collision differentiator:
    // If the base candidate has already been seen in this spec, attempt method-prefix first (e.g. post-webhooks)
    if (this.used.has(candidate)) {
      const method = (op.method || 'get').toLowerCase();
      const methodCandidate = `${method}-${candidate}`;
      if (!this.used.has(methodCandidate)) {
        candidate = methodCandidate;
      }
    }

    // Hierarchical style prefixes with tag if provided
    if (tagSlug && tagSlug !== 'general') {
      candidate = `${tagSlug}--${candidate}`;
    }

    // Guaranteed uniqueness via GitHub slugger registry
    const finalSlug = this.slugger.slug(candidate);
    this.used.add(finalSlug);
    if (opKey) {
      this.opMap.set(opKey, finalSlug);
    }
    return finalSlug;
  }

  /**
   * Generates a clean elementId for a tag.
   *
   * @param {string} name
   * @returns {string}
   */
  slugTag(name) {
    return `tag--${toKebabCase(name)}`;
  }

  /**
   * Generates a clean elementId for a tag group.
   *
   * @param {string} name
   * @returns {string}
   */
  slugTagGroup(name) {
    return `tag-group--${toKebabCase(name)}`;
  }
}

/**
 * Factory helper to create an OperationSlugger instance.
 *
 * @param {Object} [options]
 * @returns {OperationSlugger}
 */
export function createSlugger(options) {
  return new OperationSlugger(options);
}

export default OperationSlugger;
