// @ts-nocheck
/**
 * Formats/prettifies an XML string with indentation.
 *
 * @param {string} xml - The XML string to format.
 * @param {object} [options]
 * @param {string} [options.indentor='  '] - The indentation string (e.g. '  ' or '\t').
 * @param {boolean} [options.textNodesOnSameLine=true] - Keep simple text nodes on the same line as their opening and closing tags.
 * @returns {string} Formatted XML string.
 */
export function formatXml(xml, { indentor = '  ', textNodesOnSameLine = true } = {}) {
  if (!xml || typeof xml !== 'string') {
    return '';
  }

  // Tokenize by XML tags (including declarations, comments, and CDATA) while preserving text
  const tokens = xml
    .split(/(<[^>]+>)/g)
    .map((s) => s.trim())
    .filter(Boolean);

  let depth = 0;
  const lines = [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const isClosing = /^<\//.test(token);
    const isSelfClosing = /\/>$/.test(token);
    const isOpening = /^<[^/!?]/.test(token) && !isSelfClosing;

    if (isClosing) {
      depth = Math.max(0, depth - 1);
    }

    const indent = indentor.repeat(depth);

    // Lookahead for OpeningTag -> Text -> ClosingTag to collapse into one line
    if (textNodesOnSameLine && isOpening && i + 2 < tokens.length && !tokens[i + 1].startsWith('<') && tokens[i + 2].startsWith('</')) {
      const openTag = token.match(/^<([a-zA-Z0-9_\-:]+)/)?.[1];
      const closeTag = tokens[i + 2].match(/^<\/([a-zA-Z0-9_\-:]+)/)?.[1];
      if (openTag && closeTag && openTag === closeTag) {
        lines.push(`${indent}${token}${tokens[i + 1]}${tokens[i + 2]}`);
        i += 2;
        continue;
      }
    }

    lines.push(`${indent}${token}`);

    if (isOpening) {
      depth++;
    }
  }

  return lines.join('\n');
}
