/**
 * Readable rapidoc.config.yaml validation errors: one line per problem, with the path of the key
 * and, for keys from older configs, the v2 name to use instead.
 */

/** Old (v1, Redocly, Zudoku) key → what to write in v2. */
const KEY_HINTS = {
  path: 'href (links) or slug (doc pages)',
  link: 'href',
  to: 'href',
  page: 'slug',
  title: 'label',
  group: 'label',
  pages: 'items',
  features: 'items',
  root: 'spec',
  input: 'spec',
  text: 'message',
  bgColor: 'background',
  textColor: 'color',
  featured: 'a navigation tab with `api: <id>`',
  headerLinks: 'header.links (and the tabs in navigation)',
  announcement: 'site.banner',
  footer: 'the top-level footer',
  font: 'theme.fonts',
  engine: 'nothing (the file extension decides)',
  sidebars: 'navigation',
  catalog: 'a navigation tab with `catalog: true`',
};

/** Keys only older configs have; finding one suggests `rapidoc migrate`. */
const LEGACY_KEYS = new Set(['headerLinks', 'announcement', 'root', 'input', 'sidebars', 'featured', 'catalogs', 'font']);

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
  constructor(file, problems) {
    const legacy = problems.some((p) => p.legacy);
    super(
      [
        `Invalid configuration in ${file}:`,
        ...problems.map((p) => `  - ${p.text}`),
        ...(legacy ? ['', 'This looks like an older config. `rapidoc migrate --from v1` converts it.'] : []),
      ].join('\n')
    );
    this.name = 'ConfigError';
    this.problems = problems.map((p) => p.text);
  }
}

/** navigation[0].items[2] */
export function formatPath(path) {
  return path.reduce((out, part) => (typeof part === 'number' ? `${out}[${part}]` : out ? `${out}.${part}` : String(part)), '');
}

/**
 * @param {Array} issues - zod issues
 * @returns {Array<{text: string, legacy: boolean}>}
 */
export function describeIssues(issues) {
  const problems = [];
  for (const issue of issues) {
    const where = formatPath(issue.path) || '(top level)';
    if (issue.code === 'unrecognized_keys') {
      for (const key of issue.keys) {
        const hint = KEY_HINTS[key] ? ` (use ${KEY_HINTS[key]})` : '';
        problems.push({ text: `${where}: unknown key "${key}"${hint}`, legacy: LEGACY_KEYS.has(key) });
      }
    } else if (issue.code === 'invalid_union' && issue.errors?.length) {
      // A string or an object: report the object branch, which is where the detail is.
      const objectBranch = issue.errors.find((branch) => !branch.every((i) => i.code === 'invalid_type' && i.path.length === 0));
      if (objectBranch) {
        problems.push(...describeIssues(objectBranch.map((i) => ({ ...i, path: [...issue.path, ...i.path] }))));
      } else {
        problems.push({ text: `${where}: ${issue.message}`, legacy: false });
      }
    } else {
      problems.push({ text: `${where}: ${issue.message}`, legacy: false });
    }
  }
  return problems;
}
