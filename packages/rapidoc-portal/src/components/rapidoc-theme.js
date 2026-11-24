/**
 * The color attributes of an API reference page's <rapi-doc> (pages/api-reference.astro).
 *
 * - `rapidoc.theme` names a RapiDoc preset (`amber`, `jade`, ...): the preset brings its own accent and
 *   surfaces, so no `primary-color`, and `data-portal-preset` turns off the portal's background and text
 *   colors on the element.
 * - Otherwise the accent is the portal's: `theme.primary`, or a `#hex` given as `rapidoc.theme`, over the
 *   portal's background and text colors. RapiDoc's `primary-color` replaces the theme with that color.
 *   `data-portal-accent` marks the portal's own accent, which the light theme replaces with its light
 *   accent (the `rapi-doc[data-portal-accent]` rule of pages/api-reference.astro).
 *
 * `preset` is what the sidebar's theme tokens are built from (`getThemeTokensCss`).
 *
 * @param {Record<string, unknown>} rapidocConfig - the config's `rapidoc:` section
 * @param {string} portalPrimary - the config's `theme.primary`
 * @returns {{ preset: string, usesPreset: boolean, attributes: Record<string, string> }}
 */
export function rapidocThemeAttributes(rapidocConfig, portalPrimary) {
  const configured = String(rapidocConfig?.theme ?? "").trim();
  const usesPreset = configured !== "" && !configured.startsWith("#");
  const preset = configured || "amber";
  const attributes = usesPreset
    ? { theme: preset, "data-portal-preset": "" }
    : configured
      ? { theme: preset, "primary-color": configured }
      : { theme: preset, "primary-color": portalPrimary, "data-portal-accent": "" };
  return { preset, usesPreset, attributes };
}
