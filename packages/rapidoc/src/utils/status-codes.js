/**
 * Mock status codes with an optional strategy prefix, as `mock-server-status-code` (each value of its
 * map), RapiFlow's Mock Response Status fields and an Arazzo step's `x-mock-server-status-code` take
 * them: `503`, `503, 200`, `cycle:503,503,200`, `random:200,500`. Headless and dependency-free, so the
 * in-browser mock and `<rapi-flow>` share it.
 *
 * - `cycle` (the default without a prefix): one code per call, in order, starting again after the last
 * - `random`: a code at random for each call
 * - `first`: always the first code (deprecated: a single code does the same)
 */

export const STATUS_STRATEGIES = ["cycle", "random", "first"];

/**
 * @param {string | number | Array<string | number> | null | undefined} spec
 * @param {string} [defaultStrategy] - Used when the value has no prefix; `cycle` when not a strategy
 * @returns {{ strategy: "cycle" | "random" | "first", codes: string[] }}
 */
export function parseStatusCodes(spec, defaultStrategy = "cycle") {
  const text = Array.isArray(spec) ? spec.join(",") : String(spec ?? "").trim();
  const prefixed = text.match(/^(cycle|random|first)\s*:\s*(.*)$/i);
  const fallback = STATUS_STRATEGIES.includes(defaultStrategy) ? defaultStrategy : "cycle";
  return {
    strategy: prefixed ? prefixed[1].toLowerCase() : fallback,
    codes: (prefixed ? prefixed[2] : text)
      .split(",")
      .map((code) => code.trim())
      .filter(Boolean),
  };
}

/**
 * The code for one call: `index` counts the calls so far (0 for the first). "" when there are none.
 * @param {string | number | Array<string | number>} spec
 * @param {number} index
 * @param {string} [defaultStrategy]
 */
export function pickStatusCode(spec, index, defaultStrategy = "cycle") {
  const { strategy, codes } = parseStatusCodes(spec, defaultStrategy);
  if (!codes.length) return "";
  if (strategy === "random") return codes[Math.floor(Math.random() * codes.length)];
  if (strategy === "first") return codes[0];
  return codes[Math.max(0, index) % codes.length];
}
