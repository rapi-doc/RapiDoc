import fs from 'node:fs';
import path from 'node:path';
import GithubSlugger from 'github-slugger';
import yaml from 'yaml';

/**
 * Strips Markdown, Markdoc, and HTML syntax into clean plain text for indexing.
 *
 * @param {string} rawContent
 * @returns {string} Plain text content
 */
export function stripMarkup(rawContent = '') {
  let text = rawContent;

  // 1. Remove YAML frontmatter
  text = text.replace(/^---[\s\S]*?---\s*/, '');

  // 2. Remove Markdoc tags ({% ... %})
  text = text.replace(/{%[\s\S]*?%}/g, ' ');

  // 3. Remove fenced code blocks
  text = text.replace(/```[\s\S]*?```/g, ' ');

  // 4. Remove inline code
  text = text.replace(/`([^`]+)`/g, '$1');

  // 5. Remove HTML tags
  text = text.replace(/<[^>]+>/g, ' ');

  // 6. Convert markdown links [text](url) -> text
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  // 7. Remove image tags ![alt](url) -> alt
  text = text.replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1');

  // 8. Remove markdown styling (*, _, ~, #)
  text = text.replace(/[*_~#]/g, ' ');

  // 9. Normalize whitespace
  return text.replace(/\s+/g, ' ').trim();
}

/**
 * Extracts sections from Markdown / Markdoc document based on headings.
 *
 * @param {string} rawContent
 * @param {string} basePath
 * @param {string} docTitle
 * @returns {Array<object>} List of search records
 */
export function extractDocSections(rawContent = '', basePath = '', docTitle = '') {
  const records = [];
  const slugger = new GithubSlugger();

  // Strip frontmatter first
  const contentWithoutFm = rawContent.replace(/^---[\s\S]*?---\s*/, '');
  const lines = contentWithoutFm.split('\n');

  let currentHeading = null;
  let currentLines = [];

  function flushSection() {
    if (currentHeading) {
      const sectionText = stripMarkup(currentLines.join('\n'));
      if (sectionText.length > 0 || currentHeading.title) {
        records.push({
          id: `doc-${basePath}#${currentHeading.slug}`,
          type: 'doc',
          title: currentHeading.title,
          pageTitle: docTitle,
          subtitle: docTitle,
          category: 'Documentation',
          url: `${basePath}#${currentHeading.slug}`,
          content: sectionText.slice(0, 500),
        });
      }
    }
    currentLines = [];
  }

  for (const line of lines) {
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      flushSection();
      const level = headingMatch[1].length;
      const title = headingMatch[2].trim();
      const slug = slugger.slug(title);
      currentHeading = { level, title, slug };
    } else {
      currentLines.push(line);
    }
  }

  flushSection();
  return records;
}

/**
 * Indexes an OpenAPI specification file into searchable operation records.
 *
 * @param {object} api - API configuration entry
 * @returns {Array<object>} List of API search records
 */
export function indexOpenApiSpec(api) {
  const records = [];
  if (!api.fullPath || !fs.existsSync(api.fullPath)) {
    return records;
  }

  try {
    const content = fs.readFileSync(api.fullPath, 'utf8');
    const parsed = yaml.parse(content);
    if (!parsed || !parsed.paths) return records;

    const httpMethods = ['get', 'post', 'put', 'delete', 'patch', 'options', 'head'];

    for (const [endpoint, pathItem] of Object.entries(parsed.paths)) {
      if (!pathItem) continue;

      for (const method of httpMethods) {
        const operation = pathItem[method];
        if (!operation) continue;

        const methodUpper = method.toUpperCase();
        const title = operation.summary || operation.operationId || `${methodUpper} ${endpoint}`;
        const tag = Array.isArray(operation.tags) && operation.tags.length > 0 ? operation.tags[0] : '';
        const operationId = operation.operationId || '';
        const slugId = operationId || `${method}-${endpoint.replace(/[^a-zA-Z0-9]/g, '-')}`;
        const url = `${api.path}#${slugId}`;

        const paramNames = Array.isArray(operation.parameters) ? operation.parameters.map((p) => p.name).join(' ') : '';

        const searchContent = [title, operation.description || '', operationId, endpoint, tag, paramNames].filter(Boolean).join(' ');

        records.push({
          id: `api-${api.id}-${method}-${endpoint}`,
          type: 'api',
          title,
          subtitle: `${methodUpper} ${endpoint}`,
          method: methodUpper,
          endpoint,
          tag,
          category: api.title || `${api.id.toUpperCase()} API`,
          url,
          content: stripMarkup(searchContent).slice(0, 500),
        });
      }
    }
  } catch (err) {
    console.warn(`[search-indexer] Failed to parse OpenAPI spec at ${api.fullPath}:`, err.message);
  }

  return records;
}

/**
 * Builds the complete unified search index across all docs and OpenAPI specifications.
 *
 * @param {object} config - Normalized RapiDoc portal configuration
 * @param {string} projectDir - Base project directory
 * @param {Array<string>} docFiles - List of absolute documentation file paths
 * @returns {{ version: number, generatedAt: string, records: Array<object> }}
 */
export function buildSearchIndex(config, projectDir, docFiles = []) {
  const records = [];

  // 1. Index documentation pages and heading sections
  for (const docFile of docFiles) {
    if (!fs.existsSync(docFile)) continue;
    const rawContent = fs.readFileSync(docFile, 'utf8');

    // Extract frontmatter title and description
    let docTitle = path.basename(docFile, path.extname(docFile)).replace(/-/g, ' ');
    let docDesc = '';

    const fmMatch = rawContent.match(/^---\s*\n([\s\S]*?)\n---/);
    if (fmMatch) {
      try {
        const fm = yaml.parse(fmMatch[1]);
        if (fm) {
          if (fm.title) docTitle = fm.title;
          if (fm.description) docDesc = fm.description;
        }
      } catch {
        // Fallback to filename title
      }
    }

    const relToDocs = path.relative(config.docs.fullPath, docFile);
    const parsedPath = path.parse(relToDocs);
    const routeDirName = path.join(parsedPath.dir, parsedPath.name).replace(/\\/g, '/');
    const routePath = `/docs/${routeDirName}`;

    // Index main page record
    records.push({
      id: `doc-${routePath}`,
      type: 'doc',
      title: docTitle,
      subtitle: docDesc || 'Documentation Page',
      category: 'Documentation',
      url: routePath,
      content: stripMarkup(rawContent).slice(0, 600),
    });

    // Index individual heading sections for direct anchor links
    const sectionRecords = extractDocSections(rawContent, routePath, docTitle);
    records.push(...sectionRecords);
  }

  // 2. Index OpenAPI specifications
  for (const api of config.apis || []) {
    const apiRecords = indexOpenApiSpec(api);
    records.push(...apiRecords);
  }

  return {
    version: 1,
    generatedAt: new Date().toISOString(),
    totalRecords: records.length,
    records,
  };
}

/**
 * In-memory search function for querying indexed records.
 *
 * @param {Array<object>} records
 * @param {string} query
 * @param {object} [options]
 * @param {string} [options.filter='all'] - 'all' | 'doc' | 'api'
 * @param {number} [options.limit=15]
 * @returns {Array<object>}
 */
export function searchRecords(records = [], query = '', options = {}) {
  const filter = options.filter || 'all';
  const limit = options.limit || 15;
  const q = query.toLowerCase().trim();

  if (!q) return [];

  const tokens = q.split(/\s+/).filter(Boolean);

  const scored = [];

  for (const record of records) {
    if (filter !== 'all' && record.type !== filter) {
      continue;
    }

    const titleLower = (record.title || '').toLowerCase();
    const subtitleLower = (record.subtitle || '').toLowerCase();
    const endpointLower = (record.endpoint || '').toLowerCase();
    const methodLower = (record.method || '').toLowerCase();
    const categoryLower = (record.category || '').toLowerCase();
    const contentLower = (record.content || '').toLowerCase();

    let score = 0;
    let matchesAllTokens = true;

    for (const token of tokens) {
      let tokenMatched = false;

      if (titleLower.includes(token)) {
        score += titleLower.startsWith(token) ? 25 : 15;
        tokenMatched = true;
      }
      if (endpointLower.includes(token)) {
        score += endpointLower.startsWith(token) ? 20 : 12;
        tokenMatched = true;
      }
      if (subtitleLower.includes(token)) {
        score += 10;
        tokenMatched = true;
      }
      if (methodLower === token) {
        score += 15;
        tokenMatched = true;
      }
      if (categoryLower.includes(token)) {
        score += 8;
        tokenMatched = true;
      }
      if (contentLower.includes(token)) {
        score += 4;
        tokenMatched = true;
      }

      if (!tokenMatched) {
        matchesAllTokens = false;
        break;
      }
    }

    if (matchesAllTokens && score > 0) {
      // Bonus for exact title or endpoint match
      if (titleLower === q || endpointLower === q) score += 30;

      scored.push({
        ...record,
        score,
      });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit);
}
