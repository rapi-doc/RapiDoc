import { expandCollapseNavBarTag, expandCollapseNavBarTagGroup, expandParentNavContainers } from '../templates/navbar-template.js';

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
  const sidebarEl = typeof sidebar === 'string' ? document.querySelector(sidebar) : sidebar;
  const rapiDocEl = typeof rapiDoc === 'string' ? document.querySelector(rapiDoc) : rapiDoc;

  if (!sidebarEl || typeof window === 'undefined') {
    return () => {};
  }

  const activeClass = options.activeClass || 'active';
  const updateHistory = options.updateHistory !== false;

  // 1. Resolve matching navigation link in sidebar
  function findMatchingLink(targetId) {
    if (!targetId) return null;
    return (
      sidebarEl.querySelector(`#link-${CSS.escape(targetId)}`) ||
      sidebarEl.querySelector(`.nav-bar-path[data-content-id="${CSS.escape(targetId)}"]`) ||
      sidebarEl.querySelector(`.nav-bar-path[data-op-slug="${CSS.escape(targetId)}"]`) ||
      sidebarEl.querySelector(`#link-${CSS.escape(targetId.replace(/^[a-z0-9_-]+--/, ''))}`) ||
      (targetId === 'overview' ? sidebarEl.querySelector('#link-overview, .nav-bar-info') : null)
    );
  }

  // 2. Set active navigation link and auto-expand parent containers
  function setActiveNavId(targetId, shouldUpdateHistory = true) {
    const link = findMatchingLink(targetId);
    if (!link || link.classList.contains(activeClass)) return;

    sidebarEl.querySelectorAll('.' + activeClass).forEach((el) => el.classList.remove(activeClass));
    link.classList.add(activeClass);

    // Reuse RapiDoc's native hierarchy expander
    expandParentNavContainers(link);

    if (shouldUpdateHistory && updateHistory) {
      const href = link.getAttribute('href');
      if (href) window.history.replaceState(null, '', href);
    }

    // Scroll active item into view inside the sidebar container
    const navScroll = link.closest('.nav-scroll');
    if (navScroll) {
      const itemRect = link.getBoundingClientRect();
      const scrollRect = navScroll.getBoundingClientRect();
      if (itemRect.top < scrollRect.top + 20 || itemRect.bottom > scrollRect.bottom - 40) {
        const targetTop = itemRect.top - scrollRect.top + navScroll.scrollTop - 40;
        navScroll.scrollTo({ top: targetTop, behavior: 'smooth' });
      }
    }
  }

  // 3. Delegated Click Listener (reusing RapiDoc's accordion handlers)
  const handleClick = (e) => {
    const navEl = e.target.closest('[data-action]') || e.target.closest('.nav-bar-path, .nav-bar-info');
    if (!navEl) return;

    const action = navEl.dataset?.action;
    if (action === 'expand-collapse-tag') {
      expandCollapseNavBarTag(navEl, 'toggle');
    } else if (action === 'expand-collapse-tag-group') {
      expandCollapseNavBarTagGroup(navEl, 'toggle');
    } else if (action === 'navigate' || navEl.classList.contains('nav-bar-path') || navEl.classList.contains('nav-bar-info')) {
      const href = navEl.getAttribute('href') || navEl.getAttribute('data-tag-href');
      const hashIdx = href ? href.indexOf('#') : -1;
      const elementId =
        (hashIdx !== -1 ? href.substring(hashIdx + 1) : href) ||
        navEl.getAttribute('data-content-id') ||
        navEl.getAttribute('data-op-slug') ||
        navEl.id?.replace(/^link-/, '');

      if (elementId && rapiDocEl && typeof rapiDocEl.scrollToPath === 'function') {
        e.preventDefault();
        setActiveNavId(elementId, false);
        rapiDocEl.scrollToPath(elementId);
        if (updateHistory && href) {
          window.history.pushState(null, '', href);
        }
      }
    }
  };
  sidebarEl.addEventListener('click', handleClick);

  // 4. Sidebar Search Filter
  const filterInput = sidebarEl.querySelector('.portal-filter-input, .nav-bar-search-input');
  let handleFilter = null;
  if (filterInput) {
    handleFilter = (e) => {
      const query = (e.target.value || '').toLowerCase().trim();
      sidebarEl.querySelectorAll('.nav-bar-path, .portal-sidebar-op-item').forEach((item) => {
        item.style.display = item.textContent.toLowerCase().includes(query) ? 'flex' : 'none';
      });
      sidebarEl.querySelectorAll('.nav-bar-tag-and-paths').forEach((tag) => {
        const hasVisible = tag.querySelector(
          '.nav-bar-path:not([style*="display: none"]), .portal-sidebar-op-item:not([style*="display: none"])'
        );
        tag.style.display = hasVisible || !query ? '' : 'none';
        if (query && hasVisible) expandCollapseNavBarTag(tag, 'expand');
      });
      sidebarEl.querySelectorAll('.nav-bar-tag-group').forEach((group) => {
        const hasVisible = group.querySelector(
          '.nav-bar-path:not([style*="display: none"]), .portal-sidebar-op-item:not([style*="display: none"])'
        );
        group.style.display = hasVisible || !query ? '' : 'none';
        if (query && hasVisible) expandCollapseNavBarTagGroup(group, 'expand');
      });
    };
    filterInput.addEventListener('input', handleFilter);
  }

  // 5. Native rapi-doc nav-active-change event listener
  const handleNavActiveChange = (e) => {
    const targetId = e.detail?.operationId || e.detail?.id || e.detail?.elementId;
    if (targetId) setActiveNavId(targetId, true);
  };
  if (rapiDocEl) {
    rapiDocEl.addEventListener('nav-active-change', handleNavActiveChange);
  }

  // 6. Popstate / hash sync
  const handleHashSync = () => {
    if (window.location.hash) {
      const hash = window.location.hash.replace(/^#/, '');
      if (hash) {
        setActiveNavId(hash, false);
        if (rapiDocEl && typeof rapiDocEl.scrollToPath === 'function') {
          rapiDocEl.scrollToPath(hash);
        }
      }
    }
  };
  window.addEventListener('popstate', handleHashSync);
  window.addEventListener('hashchange', handleHashSync);

  // Initial sync on load and spec load
  if (rapiDocEl) {
    rapiDocEl.addEventListener('spec-loaded', () => setTimeout(handleHashSync, 80));
    if (typeof rapiDocEl.updateComplete?.then === 'function') {
      rapiDocEl.updateComplete.then(() => setTimeout(handleHashSync, 50));
    }
  }
  setTimeout(handleHashSync, 150);

  return () => {
    sidebarEl.removeEventListener('click', handleClick);
    if (filterInput && handleFilter) filterInput.removeEventListener('input', handleFilter);
    if (rapiDocEl) rapiDocEl.removeEventListener('nav-active-change', handleNavActiveChange);
    window.removeEventListener('popstate', handleHashSync);
    window.removeEventListener('hashchange', handleHashSync);
  };
}

export default bindNavBar;
