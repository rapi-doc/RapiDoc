// @rapidoc/docusaurus/client: the component that draws an API reference in a Docusaurus page.
//
//   import RapidocReference from '@rapidoc/docusaurus/client';
//
//   <RapidocReference api="pets" />
//
// `api` names a document given to the plugin in docusaurus.config.js. Written without JSX, so the site's
// bundler needs no setting to compile it. The element is loaded in the browser only.
import { createElement, useEffect, useRef } from "react";
import { useLocation } from "@docusaurus/router";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { toAttributes } from "@rapidoc/embed/core";
import { specs, oauthReceiver } from "@generated/rapidoc-docusaurus/default/specs";

/**
 * How <rapi-doc> sits in a Docusaurus page: the theme's navbar and sidebar replace its own, the page
 * scrolls instead of the element, and its colours follow the theme's light and dark modes.
 */
export const PAGE_ATTRIBUTES = {
  "render-style": "focused",
  "show-header": "false",
  "show-side-nav": "false",
  "auto-height": "true",
  "color-scheme": "auto",
  "allow-spec-url-load": "false",
  "allow-spec-file-load": "false",
};

const STYLE = { display: "block", width: "100%", minHeight: "60vh" };

/**
 * Puts the element on the theme's own background. Infima's background is transparent in light mode (the
 * page is the browser's white, which is also <rapi-doc>'s), so it is only set when it is a real colour.
 */
function matchBackground(element) {
  const color = getComputedStyle(document.documentElement)
    .getPropertyValue("--ifm-background-color")
    .trim();
  const isColor =
    color && color !== "transparent" && !/^#0000$|^#00000000$|rgba\(.*,\s*0\)$/.test(color);
  if (isColor) element.style.setProperty("--background", color);
  else element.style.removeProperty("--background");
}

/**
 * Marks the sidebar link of the section that is showing. Docusaurus marks the page's own item (the
 * overview) and knows nothing of the operation links, which only differ by their hash.
 */
function markActive(id) {
  const here = window.location.pathname.replace(/\/+$/, "");
  // A category's link can have an empty href, which has no URL
  const urlOf = (link) => {
    try {
      return new URL(link.href);
    } catch {
      return null;
    }
  };
  // Array.from, not a spread: Docusaurus compiles a spread of a NodeList into a concat, which keeps the
  // list as one item
  const links = Array.from(document.querySelectorAll("a.menu__link"))
    .map((link) => ({ link, url: urlOf(link) }))
    .filter(({ url }) => url && url.pathname.replace(/\/+$/, "") === here);
  const isOverview = !id || id === "overview";
  const target = links.find(({ url }) => decodeURIComponent(url.hash.slice(1)) === id);
  // A section without a link of its own (a tag's description, say) leaves the marks as they are
  if (!target && !isOverview) return;
  for (const entry of links) {
    // A category's own link (href="#") is left alone
    if (entry.link.getAttribute("href") === "#") continue;
    const active = target ? entry === target : entry.url.hash === "";
    entry.link.classList.toggle("menu__link--active", active);
    if (active) entry.link.setAttribute("aria-current", "page");
    else entry.link.removeAttribute("aria-current");
  }
}

export function RapidocReference({ api, spec, options = {} }) {
  const element = useRef(null);
  const location = useLocation();
  const receiver = useBaseUrl(`/${oauthReceiver}`);
  const attributes = Object.fromEntries(
    toAttributes({ options: { ...PAGE_ATTRIBUTES, "oauth-receiver": receiver, ...options } }),
  );

  // Load the element and hand it the document
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!spec && !specs[api]) {
        throw new Error(
          `@rapidoc/docusaurus: no API named "${api}"; add it to the plugin's "apis" in docusaurus.config.js`,
        );
      }
      const document = spec ?? (await specs[api]()).default;
      await import("rapidoc");
      await customElements.whenDefined("rapi-doc");
      if (cancelled || !element.current) return;
      await element.current.loadSpec(structuredClone(document));
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (id) element.current.scrollToPath(id);
      markActive(id);
    })();
    // The element says which section is showing, also when the reader scrolls to another one
    const onActive = (event) => markActive(event.detail?.elementId ?? event.detail?.id ?? "");
    const current = element.current;
    current?.addEventListener("nav-active-change", onActive);
    return () => {
      cancelled = true;
      current?.removeEventListener("nav-active-change", onActive);
    };
  }, [api, spec]);

  // Follow the theme's background, also when the reader switches between light and dark
  useEffect(() => {
    if (!element.current) return undefined;
    matchBackground(element.current);
    const observer = new MutationObserver(() => matchBackground(element.current));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  // The sidebar's operation links only change the hash, through the site's router; tell the element
  useEffect(() => {
    // No hash is the page's own sidebar item: back to the overview
    const id = decodeURIComponent(location.hash.slice(1)) || "overview";
    if (element.current?.scrollToPath && element.current.resolvedSpec) {
      element.current.scrollToPath(id);
    }
    markActive(id);
  }, [location.hash]);

  return createElement("rapi-doc", {
    ref: element,
    class: "rapidoc-docusaurus",
    style: STYLE,
    ...attributes,
  });
}

export default RapidocReference;
