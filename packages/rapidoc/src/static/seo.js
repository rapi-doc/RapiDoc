/**
 * SEO & Structured Data (JSON-LD) Metadata Generator.
 *
 * Generates Schema.org WebAPI JSON-LD structured data and OpenGraph tags
 * for automated search engine discovery and social card unfurling.
 */

import { resolveSpecInput } from './render.js';

/**
 * Strips markdown markup to plain text for meta description and SEO summaries.
 * @param {string} md
 * @returns {string}
 */
function stripMarkdownToPlainText(md = '') {
  if (!md || typeof md !== 'string') return '';
  return md
    .replace(/!\[.*?\]\(.*?\)/g, '') // images
    .replace(/\[([^\]]+)\]\(.*?\)/g, '$1') // links
    .replace(/#{1,6}\s+/g, '') // headers
    .replace(/`{1,3}[^`]*`{1,3}/g, '') // inline code / blocks
    .replace(/[*_~]{1,2}/g, '') // bold / italic / strike
    .replace(/^\s*[-*+]\s+/gm, '') // list items
    .replace(/\n+/g, ' ') // newlines to single space
    .trim();
}

/**
 * Generates SEO metadata including Schema.org WebAPI JSON-LD, OpenGraph tags,
 * and meta description tags from an OpenAPI spec.
 *
 * @param {string|Object} specInput - Specification file path, URL, raw string, or parsed spec
 * @param {Object} [options]
 * @param {string} [options.baseUrl] - Base canonical URL of the documentation portal
 * @returns {Promise<Object>} SEO metadata dictionary
 */
export async function generateSeoMetadata(specInput, options = {}) {
  const resolved = await resolveSpecInput(specInput, options);

  const rawTitle = resolved.info?.title || 'API Documentation';
  const version = resolved.info?.version || '';
  const pageTitle = version ? `${rawTitle} v${version} - API Reference` : `${rawTitle} - API Reference`;

  const plainDescription = stripMarkdownToPlainText(resolved.info?.description || '');
  const truncatedDesc = plainDescription.length > 200 ? `${plainDescription.slice(0, 197)}...` : plainDescription;

  const docUrl = options.baseUrl || resolved.servers?.[0]?.url || '';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebAPI',
    name: rawTitle,
    description: plainDescription,
    ...(version ? { version } : {}),
    ...(resolved.info?.termsOfService ? { termsOfService: resolved.info.termsOfService } : {}),
    ...(docUrl ? { documentation: docUrl } : {}),
    ...(resolved.info?.contact
      ? {
          provider: {
            '@type': 'Organization',
            name: resolved.info.contact.name || rawTitle,
            ...(resolved.info.contact.email ? { email: resolved.info.contact.email } : {}),
            ...(resolved.info.contact.url ? { url: resolved.info.contact.url } : {}),
          },
        }
      : {}),
  };

  const openGraph = {
    'og:title': pageTitle,
    'og:description': truncatedDesc,
    'og:type': 'website',
    ...(docUrl ? { 'og:url': docUrl } : {}),
  };

  const jsonLdScript = `<script type="application/ld+json">\n${JSON.stringify(jsonLd, null, 2)}\n</script>`;

  const metaTags = [
    `<title>${pageTitle}</title>`,
    `<meta name="description" content="${truncatedDesc.replace(/"/g, '&quot;')}" />`,
    `<meta property="og:title" content="${pageTitle.replace(/"/g, '&quot;')}" />`,
    `<meta property="og:description" content="${truncatedDesc.replace(/"/g, '&quot;')}" />`,
    `<meta property="og:type" content="website" />`,
    ...(docUrl ? [`<meta property="og:url" content="${docUrl}" />`] : []),
  ].join('\n');

  return {
    title: pageTitle,
    description: truncatedDesc,
    jsonLd,
    jsonLdScript,
    openGraph,
    metaTags,
  };
}

export default generateSeoMetadata;
