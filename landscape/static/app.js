/**
 * AAIF Ecosystem Architecture Map Engine
 * Lightweight Vanilla JS Client Parser for landscape.yml
 * Handles real-time fuzzy search, category filtering, tier highlighting, and dynamic card rendering.
 */

document.addEventListener('DOMContentLoaded', () => {
  // State Hub
  const state = {
    rawLandscape: null,
    currentSearch: '',
    currentCategory: 'ALL',
    filteredCategories: []
  };

  // DOM Elements Index
  const landscapeGrid = document.getElementById('landscape-grid');
  const searchInput = document.getElementById('search-input');
  const clearSearchBtn = document.getElementById('clear-search');
  const categoryBar = document.getElementById('category-bar');
  const resultCount = document.getElementById('result-count');

  // Escape a user query so it is matched as a literal (not a pattern) in a RegExp. Filtering
  // and highlighting build their regexes from this with the case-insensitive `i` flag (no `u`),
  // so they apply the same ECMAScript case-folding and an item is highlighted exactly when the
  // filter matched it.
  function escapeRegExp(text) {
    return text.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  }

  // Helper to append highlighted query substrings using pure DOM methods. `highlight` is a
  // per-render context { regex, budget } shared across every field, so the regex is compiled
  // once and the total number of <mark> nodes for the whole render is bounded, not just the
  // count per field.
  function appendHighlightedText(parentElement, text, highlight) {
    if (!highlight || highlight.budget.remaining <= 0) {
      parentElement.textContent = text;
      return;
    }
    try {
      const { regex, budget } = highlight;
      regex.lastIndex = 0;

      // Walk matches with exec() and stop after MAX_MATCHES_PER_FIELD (or once the shared
      // render budget runs out), rather than splitting the whole string into a fragment array
      // first. Only the matched slices and the surrounding gaps become nodes; the remainder is
      // appended as a single text node so the field still renders in full.
      const MAX_MATCHES_PER_FIELD = 100;
      let cursor = 0;
      let count = 0;
      let match;
      while (count < MAX_MATCHES_PER_FIELD && budget.remaining > 0 && (match = regex.exec(text)) !== null) {
        // A zero-length match cannot advance lastIndex on its own and would loop forever.
        if (match.index === regex.lastIndex) {
          regex.lastIndex += 1;
          continue;
        }
        if (match.index > cursor) {
          parentElement.appendChild(document.createTextNode(text.slice(cursor, match.index)));
        }
        const mark = document.createElement('mark');
        mark.className = 'match-highlight';
        mark.textContent = match[0];
        parentElement.appendChild(mark);
        cursor = match.index + match[0].length;
        count += 1;
        budget.remaining -= 1;
      }
      if (cursor < text.length) {
        parentElement.appendChild(document.createTextNode(text.slice(cursor)));
      }
    } catch (e) {
      parentElement.textContent = text;
    }
  }

  // Initialize Dynamic Category Navigation Bar
  function initCategoryBar() {
    if (!state.rawLandscape || !state.rawLandscape.landscape) return;

    state.rawLandscape.landscape.forEach(catObj => {
      const catName = catObj.category;
      const btn = document.createElement('button');
      btn.className = 'cat-btn';
      btn.textContent = catName;
      btn.setAttribute('data-category', catName);
      categoryBar.appendChild(btn);
    });
  }

  // Helper to get tier badge class and label
  function getTierMeta(tier) {
    const cleanTier = (tier || 'external').toLowerCase();
    switch (cleanTier) {
      case 'graduated': return { class: 'badge-graduated', label: 'Graduated', borderClass: 'tier-card-graduated' };
      case 'incubating': return { class: 'badge-incubating', label: 'Incubating', borderClass: 'tier-card-incubating' };
      case 'member': return { class: 'badge-member', label: 'Member', borderClass: 'tier-card-member' };
      default: return { class: 'badge-external', label: 'External', borderClass: 'tier-card-external' };
    }
  }

  // Render Landscape Grid. `query` is the already-normalized search string from
  // runFilteringPipeline (lower-cased and trimmed); highlighting must use the same value the
  // filter matched on, so it is passed in rather than re-read from state here.
  function renderLandscape(query) {
    landscapeGrid.replaceChildren();

    let totalItems = 0;

    if (state.filteredCategories.length === 0) {
      const emptyState = document.createElement('div');
      emptyState.className = 'empty-state';
      const emptyMsg = document.createElement('p');
      emptyMsg.textContent = 'No projects matched your current search or category filters.';
      emptyState.appendChild(emptyMsg);
      const emptySub = document.createElement('span');
      emptySub.textContent = 'Try refining your keyword search or selecting "All Categories".';
      emptyState.appendChild(emptySub);
      landscapeGrid.appendChild(emptyState);
      resultCount.textContent = 'Showing 0 projects';
      return;
    }

    // Compile the search regex once for the whole render and share a total <mark> budget across
    // every field, so the number of highlight nodes is bounded per render, not just per field.
    // A whitespace-only query has already been normalized to empty by the caller.
    const highlight = query
      ? { regex: new RegExp(escapeRegExp(query), 'gi'), budget: { remaining: 2_000 } }
      : null;

    state.filteredCategories.forEach(catObj => {
      const catGroup = document.createElement('section');
      catGroup.className = 'landscape-category-group';

      const catTitle = document.createElement('h2');
      catTitle.className = 'landscape-category-title';
      appendHighlightedText(catTitle, catObj.category, highlight);
      catGroup.appendChild(catTitle);

      catObj.subcategories.forEach(subcatObj => {
        if (!subcatObj.items || subcatObj.items.length === 0) return;

        const subGroup = document.createElement('div');
        subGroup.className = 'subcat-group';

        const subTitle = document.createElement('h3');
        subTitle.className = 'subcat-title';
        appendHighlightedText(subTitle, subcatObj.subcategory, highlight);
        subGroup.appendChild(subTitle);

        const itemsGrid = document.createElement('div');
        itemsGrid.className = 'items-grid';

        subcatObj.items.forEach(item => {
          totalItems++;
          const card = document.createElement('article');
          const tierMeta = getTierMeta(item.project);
          card.className = `project-card ${tierMeta.borderClass}`;

          const cardHeader = document.createElement('div');
          cardHeader.className = 'card-header';

          const cardTitle = document.createElement('h4');
          cardTitle.className = 'card-title';
          appendHighlightedText(cardTitle, item.name, highlight);
          cardHeader.appendChild(cardTitle);

          const tierBadge = document.createElement('span');
          tierBadge.className = `project-tier-badge ${tierMeta.class}`;
          tierBadge.textContent = tierMeta.label;
          cardHeader.appendChild(tierBadge);

          card.appendChild(cardHeader);

          const cardDesc = document.createElement('p');
          cardDesc.className = 'card-desc';
          appendHighlightedText(cardDesc, item.description || '', highlight);
          card.appendChild(cardDesc);

          const cardLinks = document.createElement('div');
          cardLinks.className = 'card-links';

          if (item.homepage_url) {
            const homeLink = document.createElement('a');
            homeLink.className = 'project-link';
            homeLink.setAttribute('href', item.homepage_url);
            homeLink.setAttribute('target', '_blank');
            homeLink.setAttribute('rel', 'noopener noreferrer');
            homeLink.textContent = 'Website ↗';
            cardLinks.appendChild(homeLink);
          }

          if (item.repo_url) {
            const repoLink = document.createElement('a');
            repoLink.className = 'project-link';
            repoLink.setAttribute('href', item.repo_url);
            repoLink.setAttribute('target', '_blank');
            repoLink.setAttribute('rel', 'noopener noreferrer');
            repoLink.textContent = 'Repository ↗';
            cardLinks.appendChild(repoLink);
          }

          if (cardLinks.hasChildNodes()) {
            card.appendChild(cardLinks);
          }

          itemsGrid.appendChild(card);
        });

        subGroup.appendChild(itemsGrid);
        catGroup.appendChild(subGroup);
      });

      landscapeGrid.appendChild(catGroup);
    });

    resultCount.textContent = `Showing ${totalItems} projects across ${state.filteredCategories.length} categories`;
  }

  // Filter Pipeline
  function runFilteringPipeline() {
    if (!state.rawLandscape || !state.rawLandscape.landscape) return;

    const rawQuery = state.currentSearch.trim();
    // Filter and highlight share one escaped regex (case-insensitive `i`, no `u`) so an item is
    // highlighted exactly when the filter matched it. A `.test()` regex without the global flag
    // is stateless, so it is safely reused across every field.
    const filterRegex = rawQuery ? new RegExp(escapeRegExp(rawQuery), 'i') : null;

    // Filter Categories and Subcategories
    state.filteredCategories = state.rawLandscape.landscape.map(catObj => {
      // Check Category Match
      if (state.currentCategory !== 'ALL' && catObj.category !== state.currentCategory) {
        return null;
      }

      // Filter Subcategories and Items
      const filteredSubcats = catObj.subcategories.map(subcatObj => {
        const filteredItems = subcatObj.items.filter(item => {
          if (!filterRegex) return true;

          return filterRegex.test(item.name || '') ||
            filterRegex.test(item.description || '') ||
            filterRegex.test(item.project || '') ||
            filterRegex.test(item.homepage_url || '') ||
            filterRegex.test(item.repo_url || '');
        });

        if (filteredItems.length === 0) return null;

        return {
          subcategory: subcatObj.subcategory,
          items: filteredItems
        };
      }).filter(Boolean);

      if (filteredSubcats.length === 0) return null;

      return {
        category: catObj.category,
        subcategories: filteredSubcats
      };
    }).filter(Boolean);

    // Highlight with the same query and escaping the filter used, so an item is highlighted
    // exactly when it matched (a whitespace-only query trims to empty, filtering nothing out
    // and highlighting nothing).
    renderLandscape(rawQuery);
  }

  // Fetch landscape.yml and Initialize
  async function fetchLandscapeData() {
    try {
      const response = await fetch('landscape.yml');
      if (!response.ok) throw new Error('Failed to fetch landscape.yml');
      const yamlText = await response.text();
      
      // Parse with the same options as the CI validator (scripts/validate-landscape.mjs):
      // FAILSAFE_SCHEMA keeps every scalar a string, so a value like `name: 789` cannot
      // arrive here as a number or Date and then throw in the search .toLowerCase() calls,
      // and maxDepth bounds nesting. These options must stay in sync with the validator.
      state.rawLandscape = jsyaml.load(yamlText, { schema: jsyaml.FAILSAFE_SCHEMA, maxDepth: 10 });
      initCategoryBar();
      runFilteringPipeline();
    } catch (error) {
      landscapeGrid.replaceChildren();
      const errorState = document.createElement('div');
      errorState.className = 'empty-state';
      const errorTitle = document.createElement('p');
      errorTitle.textContent = 'Error loading landscape configuration.';
      const errorDetail = document.createElement('span');
      errorDetail.textContent = `Please ensure landscape.yml exists and is valid YAML. (${error.message})`;
      errorState.append(errorTitle, errorDetail);
      landscapeGrid.appendChild(errorState);
      resultCount.textContent = 'Error loading data';
    }
  }

  // Event Listeners
  searchInput.addEventListener('input', (e) => {
    state.currentSearch = e.target.value;
    if (state.currentSearch.length > 0) clearSearchBtn.style.display = 'block';
    else clearSearchBtn.style.display = 'none';
    runFilteringPipeline();
  });

  clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    state.currentSearch = '';
    clearSearchBtn.style.display = 'none';
    searchInput.focus();
    runFilteringPipeline();
  });

  categoryBar.addEventListener('click', (e) => {
    const targetBtn = e.target.closest('.cat-btn');
    if (!targetBtn) return;

    categoryBar.querySelectorAll('.cat-btn').forEach(btn => btn.classList.remove('active'));
    targetBtn.classList.add('active');
    state.currentCategory = targetBtn.getAttribute('data-category');

    runFilteringPipeline();
  });

  const styleToggleBtn = document.getElementById('style-toggle-btn');
  if (styleToggleBtn) {
    styleToggleBtn.addEventListener('click', () => {
      const isCncf = document.body.classList.toggle('cncf-mode');
      if (isCncf) {
        styleToggleBtn.innerHTML = 'Switch to Cosmic Style 🌌';
      } else {
        styleToggleBtn.innerHTML = 'Switch to CNCF Style 🏛️';
      }
    });
  }

  // Start Execution
  fetchLandscapeData();
});

