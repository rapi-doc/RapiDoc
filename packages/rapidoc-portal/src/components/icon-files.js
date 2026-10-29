import fs from "node:fs";

const warned = new Set();

/**
 * The inner markup of a Phosphor icon (viewBox 0 0 256 256). An unknown name gives `question`
 * and warns once per build.
 *
 * @param {string} iconsDir - Phosphor's assets/ folder, ending in a slash
 * @param {string} name - Phosphor icon name, e.g. `rocket`
 * @param {'regular' | 'bold' | 'duotone'} weight
 */
export function readIconSvg(iconsDir, name, weight) {
  const file = (icon) =>
    `${iconsDir}${weight}/${icon}${weight === "regular" ? "" : `-${weight}`}.svg`;
  let svg;
  try {
    svg = fs.readFileSync(file(name), "utf8");
  } catch {
    if (!warned.has(name)) {
      warned.add(name);
      console.warn(`[rapidoc] Unknown icon "${name}": use a name from https://phosphoricons.com`);
    }
    svg = fs.readFileSync(file("question"), "utf8");
  }
  return svg.slice(svg.indexOf(">") + 1, svg.lastIndexOf("</svg>"));
}
