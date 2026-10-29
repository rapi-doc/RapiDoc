/**
 * Inline script that sets <html data-theme> before the page paints: the visitor's choice (stored by
 * Starlight and the header switcher under 'starlight-theme'), else `theme.mode`, where auto follows the OS.
 *
 * @param {'auto' | 'dark' | 'light'} mode
 * @returns {string}
 */
export function themeBootstrapScript(mode = "auto") {
  return `(() => {
  let stored = null;
  try { stored = localStorage.getItem('starlight-theme'); } catch {}
  const fallback = ${JSON.stringify(mode)} === 'auto' ? (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark') : ${JSON.stringify(mode)};
  const theme = stored === 'light' || stored === 'dark' ? stored : fallback;
  document.documentElement.dataset.theme = theme;
  return { stored, theme };
})()`;
}
