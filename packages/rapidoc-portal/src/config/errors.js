/**
 * Readable rapidoc.config.yaml validation errors: one line per problem, with the path of the key
 * and, for key names other portals use (Redocly, Zudoku), the name to use instead.
 */

/** Redocly / Zudoku key → what to write in rapidoc.config.yaml. */
const KEY_HINTS = {
  path: 'href (links) or slug (doc pages)',
  link: 'href',
  to: 'href',
  page: 'slug',
  file: 'slug',
  title: 'label',
  group: 'label',
  pages: 'items',
  root: 'spec',
  input: 'spec',
  sidebars: 'navigation',
  catalogs: 'a navigation tab with `catalog: true`',
};

/** <rapi-doc> attributes the portal sets itself, with the config key to use instead (if any). */
export const MANAGED_RAPIDOC_ATTRIBUTES = {
  'spec-url': 'apis[].spec',
  'show-header': null,
  'show-side-nav': null,
  'update-route': null,
  'auto-height': null,
  'goto-path': null,
  'color-scheme': 'theme.mode',
  'primary-color': 'theme.primary',
};

export class ConfigError extends Error {
  /**
   * @param {string} file
   * @param {string[]} problems
   */
  constructor(file, problems) {
    super([`Invalid configuration in ${file}:`, ...problems.map((p) => `  - ${p}`)].join('\n'));
    this.name = 'ConfigError';
    this.problems = problems;
  }
}

/** `apis[n].path` was removed in v2: every API is at /apis/<id>. */
function apiPathHint(path, key) {
  if (key !== 'path' || path.length !== 2 || path[0] !== 'apis') return '';
  return ' (every API is at /apis/<id>; add a `redirects` entry from the old URL)';
}

/** navigation[0].items[2] */
export function formatPath(path) {
  return path.reduce((out, part) => (typeof part === 'number' ? `${out}[${part}]` : out ? `${out}.${part}` : String(part)), '');
}

/**
 * @param {Array} issues - zod issues
 * @returns {string[]}
 */
export function describeIssues(issues) {
  const problems = [];
  for (const issue of issues) {
    const where = formatPath(issue.path) || '(top level)';
    if (issue.code === 'unrecognized_keys') {
      for (const key of issue.keys) {
        const hint = apiPathHint(issue.path, key) || (KEY_HINTS[key] ? ` (use ${KEY_HINTS[key]})` : '');
        problems.push(`${where}: unknown key "${key}"${hint}`);
      }
    } else if (issue.code === 'invalid_union' && issue.errors?.length) {
      // A string or an object: report the object branch, which is where the detail is.
      const objectBranch = issue.errors.find((branch) => !branch.every((i) => i.code === 'invalid_type' && i.path.length === 0));
      if (objectBranch) {
        problems.push(...describeIssues(objectBranch.map((i) => ({ ...i, path: [...issue.path, ...i.path] }))));
      } else {
        problems.push(`${where}: ${issue.message}`);
      }
    } else {
      problems.push(`${where}: ${issue.message}`);
    }
  }
  return problems;
}
