/**
 * Accent color variants that stay readable (WCAG AA, 4.5:1 for normal text) whatever `theme.primary` is:
 * - onPrimary: black or white text on a primary-colored fill (buttons, badges);
 * - textLight / textDark: the primary darkened or lightened just enough to be used as text color in the
 *   light and dark theme, including on the pale primary tint behind current sidebar items.
 *
 * Only hex colors can be measured; for any other CSS color the fallbacks are color-mix() estimates.
 */

const MIN_CONTRAST = 4.5;
const LIGHT_BACKGROUNDS = ["#ffffff", "#f4f4f5"]; // --portal-bg, --portal-surface (light)
const DARK_BACKGROUNDS = ["#22242b"]; // --portal-bg (dark)
const TINT = 0.12; // --portal-primary-tint: the primary tint behind text (current sidebar item, badges)

function parseHex(color) {
  const m = /^#([0-9a-f]{3}|[0-9a-f]{6})([0-9a-f]{2})?$/i.exec(String(color).trim());
  if (!m) return null;
  const hex = m[1].length === 3 ? [...m[1]].map((c) => c + c).join("") : m[1];
  return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
}

const toHex = (rgb) => `#${rgb.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("")}`;
const mix = (a, b, amountOfB) => a.map((v, i) => v + (b[i] - v) * amountOfB);

function luminance(rgb) {
  const [r, g, b] = rgb.map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** The primary mixed toward `target` in 2% steps until it reaches MIN_CONTRAST on every background. */
function readableShade(primary, target, backgrounds) {
  const surfaces = backgrounds.flatMap((bg) => [bg, mix(bg, primary, TINT)]);
  for (let amount = 0; amount <= 1; amount += 0.02) {
    const shade = mix(primary, target, amount);
    if (surfaces.every((bg) => contrast(shade, bg) >= MIN_CONTRAST)) return toHex(shade);
  }
  return toHex(target);
}

/**
 * @param {string} primary - `theme.primary`
 * @returns {{ onPrimary: string, textLight: string, textDark: string }}
 */
export function accentColors(primary) {
  const rgb = parseHex(primary);
  if (!rgb) {
    return {
      onPrimary: "#000000",
      textLight: `color-mix(in oklch, ${primary} 65%, #000000)`,
      textDark: `color-mix(in oklch, ${primary} 75%, #ffffff)`,
    };
  }
  const black = [0, 0, 0];
  const white = [255, 255, 255];
  return {
    onPrimary: contrast(rgb, black) >= contrast(rgb, white) ? "#000000" : "#ffffff",
    textLight: readableShade(rgb, black, LIGHT_BACKGROUNDS.map(parseHex)),
    textDark: readableShade(rgb, white, DARK_BACKGROUNDS.map(parseHex)),
  };
}
