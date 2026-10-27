/**
 * Who may see a zone. Zones come from the build (rapidoc-server.json `access.zones`): `public`,
 * `signed-in`, or `members` with groups and email patterns. `user` is the session (null when signed out).
 */

/** `*@example.com` against an email, case-insensitive; `*` matches any characters. */
export function emailMatches(pattern, email) {
  if (!email) return false;
  const source = pattern
    .toLowerCase()
    .split('*')
    .map((part) => part.replace(/[.+?^${}()|[\]\\]/g, '\\$&'))
    .join('.*');
  return new RegExp(`^${source}$`).test(email.toLowerCase());
}

/**
 * @param {{kind: string, groups?: string[], emails?: string[]} | undefined} allow
 * @param {{groups?: string[], email?: string, emailVerified?: boolean} | null} user
 */
export function allows(allow, user) {
  if (!allow) return false; // a zone the build does not know: never served
  if (allow.kind === 'public') return true;
  if (!user) return false;
  if (allow.kind === 'signed-in') return true;
  const groups = new Set(user.groups || []);
  if ((allow.groups || []).some((group) => groups.has(group))) return true;
  return Boolean(user.emailVerified) && (allow.emails || []).some((pattern) => emailMatches(pattern, user.email));
}

/** Zone ids the user may see. */
export function visibleZones(zones, user) {
  return Object.entries(zones || {})
    .filter(([, allow]) => allows(allow, user))
    .map(([zone]) => zone);
}

/**
 * What to do with a request for a file of `zone` (§4 of the design):
 * `allow`, `sign-in` (signed out, zone needs a user) or `forbidden` (signed in, not allowed).
 */
export function decide(zones, zone, user) {
  if (allows(zones?.[zone], user)) return 'allow';
  return user ? 'forbidden' : 'sign-in';
}
