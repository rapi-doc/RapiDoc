/**
 * `rapidoc dev` only: links to other sites, pointed at local dev servers.
 *
 * Sites that link to each other (a product site, its docs on another domain) write those links as full
 * addresses, so under `rapidoc dev` a click leaves for the live site. RAPIDOC_DEV_LINKS maps origins to local
 * ones, comma-separated:
 *
 *   RAPIDOC_DEV_LINKS="https://flow.example.com=http://localhost:4330,https://example.com=http://localhost:4329"
 *
 * The dev server then rewrites `href` attributes that start with a mapped origin in every HTML response it
 * serves (docs pages, the portal's pages and a project's own pages alike). Only `href`: a spec URL, an image
 * or text in a code sample keeps the address it was written with. A build is never changed.
 */

export const DEV_LINKS_ENV = "RAPIDOC_DEV_LINKS";

/** An origin, or undefined when the value is not an absolute http(s) URL with nothing after its origin. */
function toOrigin(value) {
  let url;
  try {
    url = new URL(value.trim());
  } catch {
    return undefined;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return undefined;
  if (url.pathname !== "/" || url.search || url.hash) return undefined;
  return url.origin;
}

/**
 * @param {string | undefined} value - RAPIDOC_DEV_LINKS
 * @returns {{ links: {from: string, to: string}[], problems: string[] }} the mapped origins, and an entry
 *   per part that is not `<origin>=<origin>`
 */
export function parseDevLinks(value) {
  const links = [];
  const problems = [];
  for (const part of (value ?? "").split(",")) {
    if (!part.trim()) continue;
    const [fromText, toText, ...rest] = part.split("=");
    const from = fromText === undefined ? undefined : toOrigin(fromText);
    const to = toText === undefined ? undefined : toOrigin(toText);
    if (rest.length || !from || !to) {
      problems.push(
        `"${part.trim()}" is not <origin>=<origin>, e.g. https://example.com=http://localhost:4321`,
      );
      continue;
    }
    if (from !== to) links.push({ from, to });
  }
  return { links, problems };
}

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Rewrites `href` attributes of tags that start with a mapped origin. The origin must be followed by the end of
 * the value, a path, a query or a hash, so https://example.com does not match https://example.com.evil.
 *
 * @param {string} html
 * @param {{from: string, to: string}[]} links - From parseDevLinks()
 */
export function rewriteDevLinks(html, links) {
  if (!links.length) return html;
  const byOrigin = new Map(links.map(({ from, to }) => [from, to]));
  const origins = [...byOrigin.keys()].sort((a, b) => b.length - a.length).map(escapeRegExp);
  // Inside a tag: `<name ... href="`, with no `>` before it, so text that only looks like an attribute
  // (`&lt;a href="…"` in a code sample) is left alone.
  const pattern = new RegExp(
    `(<[a-zA-Z][^<>]*?\\shref=)(["'])(${origins.join("|")})(?=[/?#"'])`,
    "gi",
  );
  return html.replace(pattern, (match, attr, quote, origin) => {
    const to = byOrigin.get(origin) ?? byOrigin.get(origin.toLowerCase());
    return to ? `${attr}${quote}${to}` : match;
  });
}

/**
 * A Vite plugin for `rapidoc dev`: rewrites the links of every HTML response (rewriteDevLinks()).
 *
 * @param {{from: string, to: string}[]} links
 */
export function devLinksPlugin(links) {
  return {
    name: "rapidoc-portal:dev-links",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const chunks = [];
        const write = res.write.bind(res);
        const end = res.end.bind(res);
        const isHtml = () => /^text\/html/i.test(String(res.getHeader("content-type") ?? ""));
        res.write = (chunk, encoding, callback) => {
          if (!isHtml()) return write(chunk, encoding, callback);
          if (chunk != null)
            chunks.push(Buffer.from(chunk, typeof encoding === "string" ? encoding : undefined));
          if (typeof encoding === "function") encoding();
          else if (typeof callback === "function") callback();
          return true;
        };
        res.end = (chunk, encoding, callback) => {
          if (!isHtml()) return end(chunk, encoding, callback);
          if (chunk != null && typeof chunk !== "function")
            chunks.push(Buffer.from(chunk, typeof encoding === "string" ? encoding : undefined));
          const html = rewriteDevLinks(Buffer.concat(chunks).toString("utf8"), links);
          if (!res.headersSent) {
            res.removeHeader("content-length");
            res.setHeader("content-length", Buffer.byteLength(html));
          }
          const done = [chunk, encoding, callback].find((arg) => typeof arg === "function");
          return end(html, "utf8", done);
        };
        next();
      });
    },
  };
}
