/**
 * What goes in the <head> of every portal page, for Starlight's pages (the `head` option and
 * route-middleware.js) and the portal's own pages (components/PortalLayout.astro) alike: web fonts,
 * the link-preview image, `noindex`, the configured `head` entries, and page titles from `titleTemplate`.
 */

/**
 * <link> head entries for the configured web fonts.
 */
export function fontHeadEntries(fonts = {}) {
  const urls = [fonts.sans?.url, fonts.mono?.url].filter(Boolean);
  if (urls.length === 0) return [];
  return [
    { tag: "link", attrs: { rel: "preconnect", href: "https://fonts.googleapis.com" } },
    {
      tag: "link",
      attrs: { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
    },
    ...urls.map((href) => ({ tag: "link", attrs: { rel: "stylesheet", href } })),
  ];
}

/**
 * Head entries shared by every page, as { tag, attrs, content }: fonts, then the preview image and
 * robots tag, then the config's `head` entries (last, so they can add to what the portal sets).
 *
 * @param {object} portalConfig - Normalized rapidoc.config.yaml
 */
export function portalHeadEntries(portalConfig) {
  const { site } = portalConfig;
  const meta = (attrs) => ({ tag: "meta", attrs });
  return [
    ...fontHeadEntries(portalConfig.theme.fonts),
    ...(site.image
      ? [
          meta({ property: "og:image", content: site.image }),
          meta({ name: "twitter:image", content: site.image }),
        ]
      : []),
    ...(site.noindex ? [meta({ name: "robots", content: "noindex, nofollow" })] : []),
    ...portalConfig.head,
  ];
}

/**
 * Open Graph tags for the portal's own pages (catalog, API reference); Starlight adds these to docs pages.
 *
 * @param {object} portalConfig - Normalized rapidoc.config.yaml
 * @param {{ title: string, description?: string, pathname: string }} page - title is the page's own title, as
 *   Starlight uses for og:title (the site name is og:site_name)
 */
export function openGraphEntries(portalConfig, { title, description, pathname }) {
  const { site } = portalConfig;
  const meta = (property, content) => ({ tag: "meta", attrs: { property, content } });
  const origin = site.url ? new URL(site.url).origin : null;
  return [
    meta("og:title", title),
    meta("og:type", "website"),
    meta("og:site_name", site.title),
    ...(description ? [meta("og:description", description)] : []),
    ...(origin ? [meta("og:url", `${origin}${pathname}`)] : []),
    { tag: "meta", attrs: { name: "twitter:card", content: "summary_large_image" } },
  ];
}

/**
 * A page's full title from `site.titleTemplate`; the home page and a page titled like the site show
 * the site title alone.
 */
export function pageTitle(portalConfig, title) {
  const { site } = portalConfig;
  if (!title || title === site.title) return site.title;
  return site.titleTemplate.replaceAll("%s", title);
}

const escapeAttr = (value) =>
  String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

/** Head entries → HTML, for pages that don't go through Starlight's <Head>. */
export function renderHeadHtml(entries) {
  return entries
    .map(({ tag, attrs = {}, content = "" }) => {
      const attributes = Object.entries(attrs)
        .map(([name, value]) =>
          value === true || value === "" ? ` ${name}` : ` ${name}="${escapeAttr(value)}"`,
        )
        .join("");
      return tag === "meta" || tag === "link"
        ? `<${tag}${attributes}>`
        : `<${tag}${attributes}>${content}</${tag}>`;
    })
    .join("\n");
}
