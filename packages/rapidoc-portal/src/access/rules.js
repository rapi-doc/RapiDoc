import crypto from 'node:crypto';

/**
 * Access rules from rapidoc.config.yaml (`access`): path patterns, the normalized form of an `allow`,
 * and zones. A zone is one distinct `allow`; the build gives every page and file exactly one zone and
 * `rapidoc serve` decides per zone (it never sees the patterns).
 */

/** URL prefixes that hold no page content and are never protected. */
export const RESERVED_PREFIXES = ['/_astro/', '/_rapidoc/'];

export const PUBLIC_ZONE = 'public';
export const SIGNED_IN_ZONE = 'signed-in';

/**
 * `public` | `signed-in` | { groups, emails } → { kind, groups, emails } with sorted, de-duplicated lists.
 *
 * @param {string | {groups?: string[], emails?: string[]}} [allow]
 */
export function normalizeAllow(allow = 'public') {
  if (allow === 'public') return { kind: 'public' };
  if (allow === 'signed-in') return { kind: 'signed-in' };
  const sorted = (list = []) => [...new Set(list)].sort();
  return { kind: 'members', groups: sorted(allow.groups), emails: sorted(allow.emails) };
}

/** Stable zone id of a normalized allow: `public`, `signed-in`, or `m-<hash>` (the hash reveals no group names). */
export function zoneIdOf(allow) {
  if (allow.kind === 'public') return PUBLIC_ZONE;
  if (allow.kind === 'signed-in') return SIGNED_IN_ZONE;
  const digest = crypto
    .createHash('sha256')
    .update(JSON.stringify([allow.groups, allow.emails]))
    .digest('hex');
  return `m-${digest.slice(0, 10)}`;
}

/** `/docs/a/` and `/docs/a` are the same page; `/` is the empty path. */
export function trimPath(urlPath) {
  return urlPath.replace(/\/+$/, '');
}

const escapeRegExp = (text) => text.replace(/[.+?^${}()|[\]\\]/g, '\\$&');

/**
 * Compiles a rule path: `*` matches within one path segment, a `**` segment matches any number of
 * segments (none included). A trailing slash does not matter.
 *
 * @param {string} pattern - e.g. /docs/internal/**
 * @returns {RegExp}
 */
export function compilePattern(pattern) {
  const segments = trimPath(pattern).split('/').slice(1);
  const source = segments
    .map((segment) => (segment === '**' ? '(?:/.*)?' : `/${segment.split('*').map(escapeRegExp).join('[^/]*')}`))
    .join('');
  return new RegExp(`^${source}$`);
}

/**
 * The normalized `access` section: the default allow, the rules in order, and every zone they use.
 *
 * @param {object} [access] - `access` from a valid config
 */
export function normalizeAccess(access = {}) {
  const defaultAllow = normalizeAllow(access.default);
  const rules = (access.rules || []).map((rule) => {
    const allow = normalizeAllow(rule.allow);
    return { path: rule.path, allow, zone: zoneIdOf(allow) };
  });
  const zones = { [zoneIdOf(defaultAllow)]: defaultAllow };
  for (const rule of rules) zones[rule.zone] = rule.allow;
  return {
    default: { allow: defaultAllow, zone: zoneIdOf(defaultAllow) },
    rules,
    zones,
    // Something is protected: the build splits its output and needs `rapidoc serve`.
    enabled: Object.keys(zones).some((zone) => zone !== PUBLIC_ZONE),
  };
}

/**
 * Zone matcher for a normalized `access`: the zone of the first rule whose path matches, else the default.
 * `matched` records which rules matched at least one path (to report rules that match nothing).
 *
 * @param {object} access - From normalizeAccess()
 */
export function createZoneMatcher(access) {
  const compiled = access.rules.map((rule) => ({ ...rule, regex: compilePattern(rule.path) }));
  const matched = new Set();
  const zoneOf = (urlPath) => {
    const target = trimPath(urlPath.split(/[?#]/)[0]);
    const index = compiled.findIndex((rule) => rule.regex.test(target));
    if (index === -1) return access.default.zone;
    matched.add(index);
    return compiled[index].zone;
  };
  return { zoneOf, matched };
}
