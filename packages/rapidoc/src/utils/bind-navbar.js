import { syncNavItemTitle } from "./common-utils.js";
import {
  expandCollapseNavBarTag,
  expandParentNavContainers,
  markNavItem,
  navItemRow,
} from "../templates/navbar-template.js";

/**
 * Connects an external navigation bar (e.g. in Astro, Next.js, or Starlight portals)
 * to a <rapi-doc> component, reusing RapiDoc's internal accordion mechanics,
 * scroll controller, and active item tracking.
 *
 * @param {HTMLElement|string} sidebar - Sidebar element or selector
 * @param {HTMLElement|string} rapiDoc - <rapi-doc> element or selector
 * @param {object} [options]
 * @param {string} [options.activeClass='active'] - Class applied to active navigation item
 * @param {boolean} [options.updateHistory=true] - Whether to sync window history
 * @returns {() => void} Cleanup unbind function
 */
export function bindNavBar(sidebar, rapiDoc, options = {}) {
  const sidebarEl = typeof sidebar === "string" ? document.querySelector(sidebar) : sidebar;
  const rapiDocEl = typeof rapiDoc === "string" ? document.querySelector(rapiDoc) : rapiDoc;

  if (!sidebarEl || typeof window === "undefined") {
    return () => {};
  }

  const activeClass = options.activeClass || "active";
  const updateHistory = options.updateHistory !== false;

  // 1. Resolve matching navigation link in sidebar
  function findMatchingLink(targetId) {
    if (!targetId) return null;
    return (
      sidebarEl.querySelector(`#link-${CSS.escape(targetId)}`) ||
      sidebarEl.querySelector(`.nav-bar-path[data-content-id="${CSS.escape(targetId)}"]`) ||
      sidebarEl.querySelector(`.nav-bar-path[data-op-slug="${CSS.escape(targetId)}"]`) ||
      sidebarEl.querySelector(`#link-${CSS.escape(targetId.replace(/^[a-z0-9_-]+--/, ""))}`) ||
      (targetId === "overview" ? sidebarEl.querySelector("#link-overview, .nav-bar-info") : null)
    );
  }

  // 2. Set active navigation link and auto-expand parent containers
  function setActiveNavId(targetId, shouldUpdateHistory = true) {
    const link = findMatchingLink(targetId);
    if (!link || navItemRow(link).classList.contains(activeClass)) return;

    sidebarEl
      .querySelectorAll("." + activeClass)
      .forEach((el) => markNavItem(el, false, activeClass));
    markNavItem(link, true, activeClass);

    // Reuse RapiDoc's native hierarchy expander
    expandParentNavContainers(link);

    if (shouldUpdateHistory && updateHistory) {
      const href = link.getAttribute("href");
      // Keep history.state: routers (Vue Router, React Router) store their own data there
      if (href) window.history.replaceState(window.history.state, "", href);
    }

    // Scroll active item into view inside the sidebar container
    const navScroll = link.closest(".nav-scroll");
    if (navScroll) {
      const itemRect = link.getBoundingClientRect();
      const scrollRect = navScroll.getBoundingClientRect();
      if (itemRect.top < scrollRect.top + 20 || itemRect.bottom > scrollRect.bottom - 40) {
        const targetTop = itemRect.top - scrollRect.top + navScroll.scrollTop - 40;
        navScroll.scrollTo({ top: targetTop, behavior: "smooth" });
      }
    }
  }

  // 3. Delegated Click Listener (reusing RapiDoc's accordion handlers)
  const handleClick = (e) => {
    const navEl =
      e.target.closest("[data-action]") || e.target.closest(".nav-bar-path, .nav-bar-info");
    if (!navEl) return;
    // A link opened in a new tab or window (Ctrl, Cmd, Shift, middle button) is the browser's business
    if (navEl.matches("a") && (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey))
      return;

    const action = navEl.dataset?.action;
    if (action === "expand-collapse-tag") {
      expandCollapseNavBarTag(navEl, "toggle");
    } else if (
      action === "navigate" ||
      navEl.classList.contains("nav-bar-path") ||
      navEl.classList.contains("nav-bar-info")
    ) {
      const href = navEl.getAttribute("href");
      const hashIdx = href ? href.indexOf("#") : -1;
      // A tag's link on a tag page (tag-pages routing) has no hash: its section is in data-content-id
      const elementId =
        (hashIdx !== -1 ? href.substring(hashIdx + 1) : "") ||
        navEl.getAttribute("data-content-id") ||
        navEl.getAttribute("data-op-slug") ||
        navEl.id?.replace(/^link-/, "");

      // A click on a closed tag's name opens it as well as going to its section
      if (navEl.closest(".nav-bar-tag")) expandCollapseNavBarTag(navEl, "expand");
      if (elementId && rapiDocEl && typeof rapiDocEl.scrollToPath === "function") {
        e.preventDefault();
        setActiveNavId(elementId, false);
        rapiDocEl.scrollToPath(elementId);
        if (updateHistory && href) {
          window.history.pushState(null, "", href);
        }
      }
    }
  };
  sidebarEl.addEventListener("click", handleClick);
  // A tooltip on an item only when its name is cut off or it has badges
  sidebarEl.addEventListener("pointerover", syncNavItemTitle);

  // 4. Sidebar Search Filter
  const filterInput = sidebarEl.querySelector(".portal-filter-input, .nav-bar-search-input");
  let handleFilter = null;
  if (filterInput) {
    handleFilter = (e) => {
      const query = (e.target.value || "").toLowerCase().trim();
      sidebarEl.querySelectorAll(".nav-bar-path, .portal-sidebar-op-item").forEach((item) => {
        item.style.display = item.textContent.toLowerCase().includes(query) ? "flex" : "none";
      });
      sidebarEl.querySelectorAll(".nav-bar-tag-and-paths").forEach((tag) => {
        const hasVisible = tag.querySelector(
          '.nav-bar-path:not([style*="display: none"]), .portal-sidebar-op-item:not([style*="display: none"])',
        );
        tag.style.display = hasVisible || !query ? "" : "none";
        if (query && hasVisible) expandCollapseNavBarTag(tag, "expand");
      });
      sidebarEl.querySelectorAll(".nav-bar-tag-group").forEach((group) => {
        const hasVisible = group.querySelector(
          '.nav-bar-path:not([style*="display: none"]), .portal-sidebar-op-item:not([style*="display: none"])',
        );
        group.style.display = hasVisible || !query ? "" : "none";
      });
    };
    filterInput.addEventListener("input", handleFilter);
  }

  // 5. Native rapi-doc nav-active-change event listener: the section's element id, also for a tag
  const handleNavActiveChange = (e) => {
    if (e.detail?.elementId) setActiveNavId(e.detail.elementId, true);
  };
  if (rapiDocEl) {
    rapiDocEl.addEventListener("nav-active-change", handleNavActiveChange);
  }

  // 6. Popstate / hash sync
  const handleHashSync = () => {
    if (window.location.hash) {
      const hash = window.location.hash.replace(/^#/, "");
      if (hash) {
        setActiveNavId(hash, false);
        if (rapiDocEl && typeof rapiDocEl.scrollToPath === "function") {
          rapiDocEl.scrollToPath(hash);
        }
      }
    }
  };
  window.addEventListener("popstate", handleHashSync);
  window.addEventListener("hashchange", handleHashSync);

  // Initial sync on load and spec load
  if (rapiDocEl) {
    rapiDocEl.addEventListener("spec-loaded", () => setTimeout(handleHashSync, 80));
    if (typeof rapiDocEl.updateComplete?.then === "function") {
      rapiDocEl.updateComplete.then(() => setTimeout(handleHashSync, 50));
    }
  }
  setTimeout(handleHashSync, 150);

  return () => {
    sidebarEl.removeEventListener("click", handleClick);
    sidebarEl.removeEventListener("pointerover", syncNavItemTitle);
    if (filterInput && handleFilter) filterInput.removeEventListener("input", handleFilter);
    if (rapiDocEl) rapiDocEl.removeEventListener("nav-active-change", handleNavActiveChange);
    window.removeEventListener("popstate", handleHashSync);
    window.removeEventListener("hashchange", handleHashSync);
  };
}

export default bindNavBar;
