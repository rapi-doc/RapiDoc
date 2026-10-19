/**
 * @rapidoc/portal Client Runtime
 * Handles: Theme toggle, Announcement dismissal, Sidebar filtering, TOC scroll-spy, and Tabs switching
 */

(function () {
  // 1. Theme Management
  function initTheme() {
    const savedTheme = localStorage.getItem('rapidoc-portal-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

    document.documentElement.setAttribute('data-theme', initialTheme);
    updateThemeToggleIcon(initialTheme);

    const toggleBtn = document.querySelector('.portal-theme-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'dark';
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('rapidoc-portal-theme', next);
        updateThemeToggleIcon(next);

        // Notify RapiDoc components of theme change if present
        const rapDocs = document.querySelectorAll('rapi-doc');
        rapDocs.forEach((doc) => {
          doc.setAttribute('theme', next);
        });
      });
    }
  }

  function updateThemeToggleIcon(theme) {
    const icon = document.querySelector('.portal-theme-icon');
    if (icon) {
      icon.textContent = theme === 'dark' ? '🌙' : '☀️';
    }
  }

  // 2. Announcement Banner Dismissal
  function initAnnouncement() {
    const banner = document.querySelector('.portal-announcement');
    if (!banner) return;

    const isDismissed = sessionStorage.getItem('rapidoc-portal-announcement-dismissed');
    if (isDismissed === 'true') {
      banner.classList.add('hidden');
    }

    const closeBtn = banner.querySelector('.portal-announcement-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        banner.classList.add('hidden');
        sessionStorage.setItem('rapidoc-portal-announcement-dismissed', 'true');
      });
    }
  }

  // 3. Sidebar Documentation & Endpoint Filter
  function initSidebarFilter() {
    const filterInput = document.querySelector('.portal-filter-input, .nav-bar-search-input');
    if (!filterInput) return;

    filterInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      const sidebar = document.querySelector('.portal-sidebar');
      if (!sidebar) return;

      const items = sidebar.querySelectorAll('.nav-bar-path, .portal-sidebar-item');
      const tags = sidebar.querySelectorAll('.nav-bar-tag-and-paths');
      const groups = sidebar.querySelectorAll('.nav-bar-tag-group, .portal-nav-group');

      items.forEach((item) => {
        const text = item.textContent.toLowerCase();
        const matches = text.includes(query);
        item.style.display = matches ? 'flex' : 'none';
      });

      // Show/hide tags based on whether they have visible paths
      tags.forEach((tag) => {
        const visiblePaths = tag.querySelectorAll('.nav-bar-path:not([style*="display: none"])');
        tag.style.display = visiblePaths.length > 0 || !query ? '' : 'none';
        if (query && visiblePaths.length > 0) {
          tag.classList.remove('collapsed');
          tag.classList.add('expanded');
        }
      });

      // Show/hide groups based on whether they have visible children
      groups.forEach((group) => {
        const visibleChildren = group.querySelectorAll(
          '.nav-bar-path:not([style*="display: none"]), .portal-sidebar-item:not([style*="display: none"]), .nav-bar-tag-and-paths:not([style*="display: none"])'
        );
        group.style.display = visibleChildren.length > 0 || !query ? '' : 'none';
        if (query && visibleChildren.length > 0) {
          group.classList.remove('collapsed');
          group.classList.add('expanded');
        }
      });
    });
  }

  // 4. "On this page" TOC Scroll-Spy
  function initTocScrollSpy() {
    const tocLinks = document.querySelectorAll('.portal-toc-link');
    if (!tocLinks.length) return;

    const headingElements = [];
    tocLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        const target = document.getElementById(href.slice(1));
        if (target) {
          headingElements.push({ target, link });
        }
      }
    });

    if (!headingElements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            tocLinks.forEach((l) => l.classList.remove('active'));
            const match = headingElements.find((h) => h.target === entry.target);
            if (match) {
              match.link.classList.add('active');
            }
          }
        });
      },
      {
        root: document.querySelector('.portal-main') || null,
        rootMargin: '0px 0px -70% 0px',
        threshold: 0,
      }
    );

    headingElements.forEach((h) => observer.observe(h.target));
  }

  // 5. Interactive Tabs Switching
  function initTabs() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.portal-tab-btn');
      if (!btn) return;

      const container = btn.closest('.portal-tabs-container');
      if (!container) return;

      const tabId = btn.getAttribute('data-tab-id');
      const allBtns = container.querySelectorAll('.portal-tab-btn');
      const allPanels = container.querySelectorAll('.portal-tab-panel');

      allBtns.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      allPanels.forEach((p) => p.classList.add('hidden'));

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const targetPanel = container.querySelector(`.portal-tab-panel[data-tab-id="${tabId}"]`);
      if (targetPanel) {
        targetPanel.classList.remove('hidden');
      }
    });
  }

  // 6. Full-Text Search Modal (⌘K / Ctrl+K)
  function initSearchModal() {
    const modal = document.getElementById('portal-search-modal');
    const trigger = document.querySelector('.portal-search-trigger');
    if (!modal) return;

    const input = modal.querySelector('.portal-search-modal-input');
    const closeBtn = modal.querySelector('.portal-search-modal-close');
    const resultsContainer = modal.querySelector('.portal-search-modal-results');
    const emptyState = modal.querySelector('.portal-search-modal-empty');
    const emptyQuerySpan = modal.querySelector('.portal-search-empty-query');
    const hintState = modal.querySelector('.portal-search-modal-hint');
    const filterBtns = modal.querySelectorAll('.portal-search-filter-btn');

    let searchRecords = null;
    let isLoading = false;
    let activeFilter = 'all';
    let currentResults = [];
    let selectedIndex = 0;

    const assetsBase = document.body.getAttribute('data-assets-base') || './assets';

    async function loadSearchIndex() {
      if (searchRecords || isLoading) return;
      isLoading = true;
      try {
        const res = await fetch(`${assetsBase}/search-index.json`);
        if (res.ok) {
          const data = await res.json();
          searchRecords = data.records || [];
        }
      } catch (err) {
        console.warn('Failed to load search index:', err);
      } finally {
        isLoading = false;
      }
    }

    function openModal() {
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      loadSearchIndex();
      setTimeout(() => {
        if (input) {
          input.focus();
          if (input.value) {
            performSearch(input.value);
          }
        }
      }, 50);
    }

    function closeModal() {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
      if (input) input.value = '';
      if (resultsContainer) resultsContainer.innerHTML = '';
      if (emptyState) emptyState.classList.add('hidden');
      if (hintState) hintState.classList.remove('hidden');
      selectedIndex = 0;
    }

    // Keyboard trigger: ⌘K or Ctrl+K or / (when not typing in an input)
    document.addEventListener('keydown', (e) => {
      const isCmdK = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k';
      const isSlash = e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName);

      if (isCmdK || isSlash) {
        e.preventDefault();
        if (modal.classList.contains('hidden')) {
          openModal();
        } else {
          closeModal();
        }
      } else if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        e.preventDefault();
        closeModal();
      }
    });

    if (trigger) {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    // Filter switching
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        activeFilter = btn.getAttribute('data-filter') || 'all';
        if (input && input.value) {
          performSearch(input.value);
        }
      });
    });

    // Search algorithm
    function performSearch(query) {
      const q = query.toLowerCase().trim();

      if (!q) {
        resultsContainer.innerHTML = '';
        emptyState.classList.add('hidden');
        hintState.classList.remove('hidden');
        currentResults = [];
        selectedIndex = 0;
        return;
      }

      hintState.classList.add('hidden');

      if (!searchRecords || !searchRecords.length) {
        resultsContainer.innerHTML = '';
        emptyState.classList.remove('hidden');
        if (emptyQuerySpan) emptyQuerySpan.textContent = query;
        return;
      }

      const tokens = q.split(/\s+/).filter(Boolean);
      const scored = [];

      for (const record of searchRecords) {
        if (activeFilter !== 'all' && record.type !== activeFilter) {
          continue;
        }

        const titleLower = (record.title || '').toLowerCase();
        const subtitleLower = (record.subtitle || '').toLowerCase();
        const endpointLower = (record.endpoint || '').toLowerCase();
        const methodLower = (record.method || '').toLowerCase();
        const categoryLower = (record.category || '').toLowerCase();
        const contentLower = (record.content || '').toLowerCase();

        let score = 0;
        let matchesAllTokens = true;

        for (const token of tokens) {
          let tokenMatched = false;
          if (titleLower.includes(token)) {
            score += titleLower.startsWith(token) ? 25 : 15;
            tokenMatched = true;
          }
          if (endpointLower.includes(token)) {
            score += endpointLower.startsWith(token) ? 20 : 12;
            tokenMatched = true;
          }
          if (subtitleLower.includes(token)) {
            score += 10;
            tokenMatched = true;
          }
          if (methodLower === token) {
            score += 15;
            tokenMatched = true;
          }
          if (categoryLower.includes(token)) {
            score += 8;
            tokenMatched = true;
          }
          if (contentLower.includes(token)) {
            score += 4;
            tokenMatched = true;
          }

          if (!tokenMatched) {
            matchesAllTokens = false;
            break;
          }
        }

        if (matchesAllTokens && score > 0) {
          if (titleLower === q || endpointLower === q) score += 30;
          scored.push({ ...record, score });
        }
      }

      scored.sort((a, b) => b.score - a.score);
      currentResults = scored.slice(0, 15);
      selectedIndex = 0;

      renderResults(currentResults, tokens, query);
    }

    function highlightText(text, tokens) {
      if (!text) return '';
      let escaped = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      for (const token of tokens) {
        if (!token) continue;
        const re = new RegExp(`(${token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        escaped = escaped.replace(re, '<mark class="portal-search-match">$1</mark>');
      }
      return escaped;
    }

    function renderResults(results, tokens, query) {
      resultsContainer.innerHTML = '';

      if (!results.length) {
        emptyState.classList.remove('hidden');
        if (emptyQuerySpan) emptyQuerySpan.textContent = query;
        return;
      }

      emptyState.classList.add('hidden');

      results.forEach((item, idx) => {
        const link = document.createElement('a');
        link.href = item.url;
        link.className = `portal-search-result-item ${idx === selectedIndex ? 'selected' : ''}`;
        link.setAttribute('role', 'option');
        link.setAttribute('data-index', idx);

        let badgeHtml = '';
        if (item.type === 'api' && item.method) {
          const methodClass = `method-${item.method.toLowerCase()}`;
          badgeHtml = `<span class="portal-search-badge ${methodClass}">${item.method}</span>`;
        } else {
          badgeHtml = `<span class="portal-search-badge badge-doc">DOC</span>`;
        }

        const titleHtml = highlightText(item.title, tokens);
        const endpointHtml = item.endpoint
          ? `<span class="portal-search-result-endpoint">${highlightText(item.endpoint, tokens)}</span>`
          : '';
        const snippetHtml = item.content ? highlightText(item.content.slice(0, 140) + '...', tokens) : '';

        link.innerHTML = `
          <div class="portal-search-result-header">
            ${badgeHtml}
            <span>${titleHtml}</span>
            ${endpointHtml}
            <span class="portal-search-result-category">${item.category || ''}</span>
          </div>
          ${snippetHtml ? `<div class="portal-search-result-snippet">${snippetHtml}</div>` : ''}
        `;

        link.addEventListener('click', () => {
          closeModal();
        });

        resultsContainer.appendChild(link);
      });
    }

    function updateSelection(newIdx) {
      const items = resultsContainer.querySelectorAll('.portal-search-result-item');
      if (!items.length) return;

      if (newIdx < 0) newIdx = items.length - 1;
      if (newIdx >= items.length) newIdx = 0;

      selectedIndex = newIdx;
      items.forEach((it, i) => {
        if (i === selectedIndex) {
          it.classList.add('selected');
          it.scrollIntoView({ block: 'nearest' });
        } else {
          it.classList.remove('selected');
        }
      });
    }

    if (input) {
      input.addEventListener('input', (e) => {
        performSearch(e.target.value);
      });

      input.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          updateSelection(selectedIndex + 1);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          updateSelection(selectedIndex - 1);
        } else if (e.key === 'Enter') {
          e.preventDefault();
          if (currentResults[selectedIndex]) {
            const url = currentResults[selectedIndex].url;
            closeModal();
            window.location.href = url;
          }
        }
      });
    }
  }

  // 7. Server URL One-Click Copy
  function initCopyButtons() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.portal-copy-btn');
      if (!btn) return;
      const text = btn.getAttribute('data-copy');
      if (!text) return;

      navigator.clipboard
        .writeText(text)
        .then(() => {
          const originalText = btn.innerHTML;
          btn.innerHTML = '✓';
          btn.style.color = '#10b981';
          setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.color = '';
          }, 1500);
        })
        .catch((err) => {
          console.warn('Failed to copy to clipboard:', err);
        });
    });
  }

  // 8. API Sidebar Navigation & RapiDoc Hash Synchronization
  function initApiSidebarNav() {
    const sidebar = document.querySelector('.portal-sidebar');
    if (!sidebar) return;

    const rapiDocEl = document.querySelector('rapi-doc');
    if (!rapiDocEl) return;

    document.addEventListener('click', (e) => {
      const link = e.target.closest(
        '.portal-sidebar .nav-bar-path, .portal-sidebar .nav-bar-info, .portal-sidebar .nav-bar-tag, .portal-sidebar .nav-bar-tag-title'
      );
      if (!link) return;

      // If clicked the collapse chevron icon specifically, let nav collapse handler handle it
      if (e.target.closest('.nav-bar-tag-icon, .nav-bar-tag-group-icon')) return;

      const href = link.getAttribute('href') || link.getAttribute('data-tag-href');
      if (!href) return;

      const hashIdx = href.indexOf('#');
      const elementId = hashIdx !== -1 ? href.substring(hashIdx + 1) : '';

      // Check if target operation exists inside current <rapi-doc>
      let targetEl = elementId
        ? rapiDocEl.shadowRoot?.getElementById(elementId) ||
          rapiDocEl.shadowRoot?.querySelector?.(`[data-op-slug="${CSS.escape(elementId)}"]`) ||
          rapiDocEl.shadowRoot?.querySelector?.(`[id$="--${CSS.escape(elementId)}"]`) ||
          rapiDocEl.shadowRoot?.getElementById(elementId.replace(/^[a-z0-9_-]+--/, '')) ||
          rapiDocEl.querySelector?.(`[id="${CSS.escape(elementId)}"]`)
        : null;

      // If clicked tag header without hash, scroll to that tag section
      if (!targetEl && (link.classList.contains('nav-bar-tag') || link.classList.contains('nav-bar-tag-title'))) {
        const tagContainer = link.closest('.nav-bar-tag-and-paths');
        const tagContentId = tagContainer?.id?.replace(/^link-/, '');
        if (tagContentId) {
          targetEl = rapiDocEl.shadowRoot?.getElementById(tagContentId) || rapiDocEl.querySelector?.(`[id="${CSS.escape(tagContentId)}"]`);
        }
      }

      if (targetEl || elementId === 'overview') {
        e.preventDefault();
        window.history.pushState(null, '', href);

        sidebar.querySelectorAll('.active').forEach((l) => l.classList.remove('active'));
        if (link.classList.contains('nav-bar-path') || link.classList.contains('nav-bar-info')) {
          link.classList.add('active');
        }

        // Expand parent tag and group if collapsed
        const parentTag = link.closest('.nav-bar-tag-and-paths');
        if (parentTag && parentTag.classList.contains('collapsed')) {
          parentTag.classList.replace('collapsed', 'expanded');
          parentTag.querySelector('.nav-bar-tag')?.setAttribute('aria-expanded', 'true');
        }
        const parentGroup = link.closest('.nav-bar-tag-group');
        if (parentGroup && parentGroup.classList.contains('collapsed')) {
          parentGroup.classList.replace('collapsed', 'expanded');
          parentGroup.querySelector('.nav-bar-tag-group-header')?.setAttribute('aria-expanded', 'true');
        }

        const scrollTargetId = targetEl?.id || elementId;
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (typeof rapiDocEl.scrollToPath === 'function') {
          rapiDocEl.scrollToPath(scrollTargetId);
        }
        return;
      }
    });

    // Listen for scroll-spy active changes emitted by <rapi-doc>
    if (rapiDocEl) {
      rapiDocEl.addEventListener('nav-active-change', (e) => {
        const targetId = e.detail?.id || e.detail?.elementId;
        if (!targetId) return;

        if (targetId === 'overview') {
          sidebar.querySelectorAll('.active').forEach((l) => l.classList.remove('active'));
          const overviewLink = document.getElementById('link-overview') || sidebar.querySelector('.nav-bar-info');
          if (overviewLink) {
            overviewLink.classList.add('active');
          }
          return;
        }

        let matchingLink =
          document.getElementById(`link-${targetId}`) ||
          sidebar.querySelector(`.nav-bar-path[data-content-id="${CSS.escape(targetId)}"]`) ||
          sidebar.querySelector(`.nav-bar-path[data-op-slug="${CSS.escape(targetId)}"]`) ||
          sidebar.querySelector(`.nav-bar-path[data-content-id$="--${CSS.escape(targetId)}"]`) ||
          sidebar.querySelector(`.nav-bar-path[data-content-id="${CSS.escape(targetId.replace(/^[a-z0-9_-]+--/, ''))}"]`);

        // If matched element is a tag or group container rather than a link, select first path inside it
        if (matchingLink && !matchingLink.classList.contains('nav-bar-path') && !matchingLink.classList.contains('nav-bar-info')) {
          matchingLink = matchingLink.querySelector('.nav-bar-path');
        }

        if (matchingLink) {
          if (matchingLink.classList.contains('active')) return;

          sidebar.querySelectorAll('.active').forEach((l) => l.classList.remove('active'));
          matchingLink.classList.add('active');

          const matchingHref = matchingLink.getAttribute('href');
          if (matchingHref) {
            window.history.replaceState(null, null, matchingHref);
          }

          const parentTag = matchingLink.closest('.nav-bar-tag-and-paths');
          if (parentTag && parentTag.classList.contains('collapsed')) {
            parentTag.classList.replace('collapsed', 'expanded');
            parentTag.querySelector('.nav-bar-tag')?.setAttribute('aria-expanded', 'true');
          }
          const parentGroup = matchingLink.closest('.nav-bar-tag-group');
          if (parentGroup && parentGroup.classList.contains('collapsed')) {
            parentGroup.classList.replace('collapsed', 'expanded');
            parentGroup.querySelector('.nav-bar-tag-group-header')?.setAttribute('aria-expanded', 'true');
          }

          // Gentle auto-scroll of sidebar if active item is out of view
          const navScroll = sidebar.querySelector('.nav-scroll');
          if (navScroll) {
            const scrollRect = navScroll.getBoundingClientRect();
            const itemRect = matchingLink.getBoundingClientRect();
            if (itemRect.top < scrollRect.top + 20 || itemRect.bottom > scrollRect.bottom - 40) {
              const targetTop = itemRect.top - scrollRect.top + navScroll.scrollTop - 40;
              navScroll.scrollTo({ top: targetTop, behavior: 'smooth' });
            }
          }
        }
      });
    }

    // On page load or hash change, highlight matching operation and expand parents
    function syncActiveHash() {
      if (window.location.hash) {
        const rawHash = window.location.hash.replace(/^#/, '');
        if (!rawHash) return;

        let matchingLink =
          document.getElementById(`link-${rawHash}`) ||
          sidebar.querySelector(`.nav-bar-path[data-content-id="${CSS.escape(rawHash)}"]`) ||
          sidebar.querySelector(`.nav-bar-path[data-op-slug="${CSS.escape(rawHash)}"]`) ||
          sidebar.querySelector(`.nav-bar-path[data-content-id$="--${CSS.escape(rawHash)}"]`) ||
          sidebar.querySelector(`.nav-bar-path[data-content-id="${CSS.escape(rawHash.replace(/^[a-z0-9_-]+--/, ''))}"]`);

        if (matchingLink && !matchingLink.classList.contains('nav-bar-path') && !matchingLink.classList.contains('nav-bar-info')) {
          matchingLink = matchingLink.querySelector('.nav-bar-path');
        }

        if (matchingLink) {
          sidebar.querySelectorAll('.active').forEach((l) => l.classList.remove('active'));
          matchingLink.classList.add('active');
          matchingLink.scrollIntoView({ block: 'nearest' });

          const parentTag = matchingLink.closest('.nav-bar-tag-and-paths');
          if (parentTag && parentTag.classList.contains('collapsed')) {
            parentTag.classList.replace('collapsed', 'expanded');
            parentTag.querySelector('.nav-bar-tag')?.setAttribute('aria-expanded', 'true');
          }
          const parentGroup = matchingLink.closest('.nav-bar-tag-group');
          if (parentGroup && parentGroup.classList.contains('collapsed')) {
            parentGroup.classList.replace('collapsed', 'expanded');
            parentGroup.querySelector('.nav-bar-tag-group-header')?.setAttribute('aria-expanded', 'true');
          }

          if (rapiDocEl) {
            const targetEl =
              rapiDocEl.shadowRoot?.getElementById(rawHash) ||
              rapiDocEl.shadowRoot?.querySelector?.(`[data-op-slug="${CSS.escape(rawHash)}"]`) ||
              rapiDocEl.shadowRoot?.querySelector?.(`[id$="--${CSS.escape(rawHash)}"]`) ||
              rapiDocEl.shadowRoot?.getElementById?.(rawHash.replace(/^[a-z0-9_-]+--/, ''));
            if (targetEl) {
              targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else if (typeof rapiDocEl.scrollToPath === 'function') {
              rapiDocEl.scrollToPath(rawHash);
            }
          }
        }
      } else {
        const pathname = window.location.pathname.replace(/\/$/, '');
        const tagLink = sidebar.querySelector(`.nav-bar-tag-title[href="${pathname}"]`);
        if (tagLink) {
          const parentTag = tagLink.closest('.nav-bar-tag-and-paths');
          if (parentTag && parentTag.classList.contains('collapsed')) {
            parentTag.classList.replace('collapsed', 'expanded');
            parentTag.querySelector('.nav-bar-tag')?.setAttribute('aria-expanded', 'true');
          }
          const parentGroup = tagLink.closest('.nav-bar-tag-group');
          if (parentGroup && parentGroup.classList.contains('collapsed')) {
            parentGroup.classList.replace('collapsed', 'expanded');
            parentGroup.querySelector('.nav-bar-tag-group-header')?.setAttribute('aria-expanded', 'true');
          }
        }
      }
    }

    syncActiveHash();
    window.addEventListener('hashchange', syncActiveHash);
  }

  // 9. API Catalog Client-Side Filtering & Search
  function initCatalogFilters() {
    const searchInput = document.querySelector('.portal-catalog-search-input');
    const chips = document.querySelectorAll('.portal-catalog-chip');
    const cards = document.querySelectorAll('.portal-catalog-card');

    if (!cards.length) return;

    let selectedCategory = 'all';
    let searchQuery = '';

    function filterCards() {
      cards.forEach((card) => {
        const cardCategory = (card.getAttribute('data-category') || '').toLowerCase();
        const cardSearch = (card.getAttribute('data-search') || card.textContent || '').toLowerCase();

        const matchesCat = selectedCategory === 'all' || cardCategory === selectedCategory;
        const matchesQuery = !searchQuery || cardSearch.includes(searchQuery);

        card.style.display = matchesCat && matchesQuery ? 'flex' : 'none';
      });
    }

    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        chips.forEach((c) => c.classList.remove('active'));
        chip.classList.add('active');
        selectedCategory = (chip.getAttribute('data-category') || 'all').toLowerCase();
        filterCards();
      });
    });

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        filterCards();
      });
    }
  }

  // Initialize all interactive modules on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initAnnouncement();
    initSidebarFilter();
    initTocScrollSpy();
    initTabs();
    initSearchModal();
    initCopyButtons();
    initApiSidebarNav();
    initCatalogFilters();
    initNavCollapse();
    initDropdowns();
  });

  // 10. Shared RapiDoc Navbar Hierarchical Collapse / Expand
  function initNavCollapse() {
    document.addEventListener('click', (e) => {
      const groupTrigger = e.target.closest('.nav-bar-tag-group-header, .nav-bar-tag-group-icon');
      if (groupTrigger) {
        const group = groupTrigger.closest('.nav-bar-tag-group');
        const header = group?.querySelector('.nav-bar-tag-group-header');
        if (group) {
          const isCollapsed = group.classList.contains('collapsed');
          group.classList.toggle('collapsed', !isCollapsed);
          group.classList.toggle('expanded', isCollapsed);
          if (header) header.setAttribute('aria-expanded', isCollapsed ? 'true' : 'false');
        }
        return;
      }

      const tagTrigger = e.target.closest('.nav-bar-tag, .nav-bar-tag-icon');
      if (tagTrigger) {
        const tagContainer = tagTrigger.closest('.nav-bar-tag-and-paths');
        const tagHeader = tagContainer?.querySelector('.nav-bar-tag');
        const pathsUnderTag = tagContainer?.querySelector('.nav-bar-paths-under-tag');
        if (tagContainer) {
          const isCollapsed = tagContainer.classList.contains('collapsed');
          if (isCollapsed) {
            tagContainer.classList.replace('collapsed', 'expanded');
            if (pathsUnderTag) pathsUnderTag.style.maxHeight = pathsUnderTag.scrollHeight ? `${pathsUnderTag.scrollHeight}px` : null;
            if (tagHeader) tagHeader.setAttribute('aria-expanded', 'true');
          } else {
            if (pathsUnderTag) pathsUnderTag.style.maxHeight = '0px';
            tagContainer.classList.replace('expanded', 'collapsed');
            if (tagHeader) tagHeader.setAttribute('aria-expanded', 'false');
          }
        }
      }
    });

    // Keyboard accessibility: Enter or Space on group header toggles it
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const activeHeader = document.activeElement?.closest?.('.nav-bar-tag-group-header, .nav-bar-tag');
        if (activeHeader) {
          e.preventDefault();
          activeHeader.click();
        }
      }
    });

    // Wire #advanced-search-btn to open the ⌘K search modal
    const searchBtn = document.getElementById('advanced-search-btn');
    if (searchBtn) {
      searchBtn.addEventListener('click', () => {
        const trigger = document.querySelector('.portal-search-trigger');
        if (trigger) trigger.click();
      });
    }
  }

  // 11. Header Mega-Menu Dropdowns (Matching Image 3 & Feedback 6)
  function initDropdowns() {
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('.portal-dropdown-trigger');
      const allDropdowns = document.querySelectorAll('.portal-nav-dropdown');

      if (trigger) {
        const dropdown = trigger.closest('.portal-nav-dropdown');
        const isOpen = dropdown.classList.contains('active');
        allDropdowns.forEach((d) => {
          d.classList.remove('active');
          d.querySelector('.portal-dropdown-trigger')?.setAttribute('aria-expanded', 'false');
        });
        if (!isOpen) {
          dropdown.classList.add('active');
          trigger.setAttribute('aria-expanded', 'true');
        }
        return;
      }

      // Clicking outside any dropdown closes all
      if (!e.target.closest('.portal-mega-menu')) {
        allDropdowns.forEach((d) => {
          d.classList.remove('active');
          d.querySelector('.portal-dropdown-trigger')?.setAttribute('aria-expanded', 'false');
        });
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const allDropdowns = document.querySelectorAll('.portal-nav-dropdown');
        allDropdowns.forEach((d) => {
          d.classList.remove('active');
          d.querySelector('.portal-dropdown-trigger')?.setAttribute('aria-expanded', 'false');
        });
      }
    });
  }
})();
