/**
 * Lit reactive controller behind color-scheme="auto" on <rapi-doc> and <rapi-doc-mini>.
 *
 * "auto" follows the host page: it reads the page's CSS `color-scheme` (as set by Starlight and most
 * theme toggles, e.g. `:root[data-theme='light'] { color-scheme: light }`), or the OS preference when
 * the page declares none or both. The resolved 'dark' / 'light' is written to the element's
 * color-scheme property and attribute, which drive the styles, and is re-resolved when attributes
 * on <html> or <body> change (data-theme, class, style) or the OS preference changes.
 *
 * Setting color-scheme to any other value later turns auto mode off.
 */
export class AutoColorSchemeController {
  constructor(host) {
    this.host = host;
    this.active = false;
    this.resolved = "";
    this.observer = null;
    this.media = null;
    this.onPageChange = () => this.apply();
    host.addController(this);
  }

  hostConnected() {
    if (this.host.colorScheme === "auto") {
      this.enable();
    } else if (this.active) {
      this.watch(true);
      this.apply();
    }
  }

  hostDisconnected() {
    this.watch(false);
  }

  hostUpdate() {
    const value = this.host.colorScheme;
    if (value === "auto") {
      this.enable();
    } else if (this.active && value !== this.resolved) {
      // An explicit value from the page or a script
      this.active = false;
      this.watch(false);
    }
  }

  enable() {
    this.active = true;
    this.watch(true);
    this.apply();
  }

  apply() {
    if (!this.active || typeof window === "undefined") {
      return;
    }
    const scheme = resolvePageColorScheme(this.host);
    this.resolved = scheme;
    if (this.host.colorScheme !== scheme) {
      this.host.colorScheme = scheme;
    }
    // Set the attribute now (property reflection is async) so the styles switch immediately.
    if (this.host.getAttribute("color-scheme") !== scheme) {
      this.host.setAttribute("color-scheme", scheme);
    }
  }

  watch(enable) {
    this.observer?.disconnect();
    this.observer = null;
    this.media?.removeEventListener("change", this.onPageChange);
    this.media = null;
    if (!enable || typeof window === "undefined") {
      return;
    }
    this.observer = new MutationObserver(this.onPageChange);
    this.observer.observe(document.documentElement, { attributes: true });
    if (document.body) {
      this.observer.observe(document.body, { attributes: true });
    }
    this.media = window.matchMedia("(prefers-color-scheme: light)");
    this.media.addEventListener("change", this.onPageChange);
  }
}

/**
 * 'dark' or 'light' for the page around `el`. Reads the parent's CSS color-scheme: the element sets
 * color-scheme on itself from its own attribute.
 */
export function resolvePageColorScheme(el) {
  const pageEl = el.parentElement || el.getRootNode().host || document.documentElement;
  const pageScheme = getComputedStyle(pageEl).colorScheme || "";
  const hasDark = /\bdark\b/.test(pageScheme);
  const hasLight = /\blight\b/.test(pageScheme);
  if (hasDark !== hasLight) {
    return hasDark ? "dark" : "light";
  }
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}
