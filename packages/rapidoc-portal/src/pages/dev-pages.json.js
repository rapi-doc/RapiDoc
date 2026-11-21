/**
 * `rapidoc dev` only: the addresses of the project's own pages (pages/*.astro), for the dev server's
 * search index (engine/dev-server.js reads this, then each page). A page of a dynamic route has one
 * address per entry of its getStaticPaths(), which only the page's module knows.
 */
import pages from "virtual:rapidoc-portal/project-pages";

/** `/api/[...element]` with `{ element: "mini" }` → `/api/mini`; a rest parameter may be empty. */
function fillPattern(pattern, params = {}) {
  const segments = pattern
    .split("/")
    .filter(Boolean)
    .map((segment) =>
      segment.replace(/\[(\.\.\.)?([^\]]+)\]/g, (match, rest, name) => params[name] ?? ""),
    )
    .filter(Boolean);
  return `/${segments.join("/")}`;
}

export async function GET() {
  const urls = new Set();
  for (const { pattern, load } of pages) {
    if (pattern === "/404") continue;
    if (!pattern.includes("[")) {
      urls.add(pattern);
      continue;
    }
    try {
      const module = await load();
      // No pagination helper: a page that needs one is left out of the dev index, not out of the build's
      const paths = (await module.getStaticPaths?.({})) ?? [];
      for (const { params } of paths.flat()) urls.add(fillPattern(pattern, params));
    } catch {
      // A page that can't list its paths here is still built, and found by search, in `rapidoc build`.
    }
  }
  return new Response(JSON.stringify([...urls].sort()), {
    headers: { "content-type": "application/json" },
  });
}
