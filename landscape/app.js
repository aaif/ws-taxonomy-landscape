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

  // Helper to append highlighted query substrings using pure DOM methods
  function appendHighlightedText(parentElement, text, query) {
    if (!query) {
      parentElement.textContent = text;
      return;
    }
    try {
      const escapedQuery = query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(`(${escapedQuery})`, 'gi');
      const parts = text.split(regex);

      parts.forEach(part => {
        if (part.toLowerCase() === query.toLowerCase()) {
          const mark = document.createElement('mark');
          mark.className = 'match-highlight';
          mark.textContent = part;
          parentElement.appendChild(mark);
        } else if (part) {
          parentElement.appendChild(document.createTextNode(part));
        }
      });
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

  // Render Landscape Grid
  function renderLandscape() {
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

    const query = state.currentSearch;

    state.filteredCategories.forEach(catObj => {
      const catGroup = document.createElement('section');
      catGroup.className = 'landscape-category-group';

      const catTitle = document.createElement('h2');
      catTitle.className = 'landscape-category-title';
      appendHighlightedText(catTitle, catObj.category, query);
      catGroup.appendChild(catTitle);

      catObj.subcategories.forEach(subcatObj => {
        if (!subcatObj.items || subcatObj.items.length === 0) return;

        const subGroup = document.createElement('div');
        subGroup.className = 'subcat-group';

        const subTitle = document.createElement('h3');
        subTitle.className = 'subcat-title';
        appendHighlightedText(subTitle, subcatObj.subcategory, query);
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
          appendHighlightedText(cardTitle, item.name, query);
          cardHeader.appendChild(cardTitle);

          const tierBadge = document.createElement('span');
          tierBadge.className = `project-tier-badge ${tierMeta.class}`;
          tierBadge.textContent = tierMeta.label;
          cardHeader.appendChild(tierBadge);

          card.appendChild(cardHeader);

          const cardDesc = document.createElement('p');
          cardDesc.className = 'card-desc';
          appendHighlightedText(cardDesc, item.description || '', query);
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
            repoLink.textContent = 'GitHub ↗';
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

    const query = state.currentSearch.toLowerCase().trim();

    // Filter Categories and Subcategories
    state.filteredCategories = state.rawLandscape.landscape.map(catObj => {
      // Check Category Match
      if (state.currentCategory !== 'ALL' && catObj.category !== state.currentCategory) {
        return null;
      }

      // Filter Subcategories and Items
      const filteredSubcats = catObj.subcategories.map(subcatObj => {
        const filteredItems = subcatObj.items.filter(item => {
          if (!query) return true;

          const matchName = (item.name || '').toLowerCase().includes(query);
          const matchDesc = (item.description || '').toLowerCase().includes(query);
          const matchTier = (item.project || '').toLowerCase().includes(query);
          const matchHome = (item.homepage_url || '').toLowerCase().includes(query);
          const matchRepo = (item.repo_url || '').toLowerCase().includes(query);

          return matchName || matchDesc || matchTier || matchHome || matchRepo;
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

    renderLandscape();
  }

  // Fetch landscape.yml and Initialize
  async function fetchLandscapeData() {
    try {
      const response = await fetch('landscape.yml');
      if (!response.ok) throw new Error('Failed to fetch landscape.yml');
      const yamlText = await response.text();
      
      state.rawLandscape = jsyaml.load(yamlText);
      initCategoryBar();
      runFilteringPipeline();
    } catch (error) {
      landscapeGrid.innerHTML = `
        <div class="empty-state">
          <p>Error loading landscape configuration.</p>
          <span>Please ensure landscape.yml exists and is valid YAML. (${error.message})</span>
        </div>
      `;
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

  // Start Execution
  fetchLandscapeData();
});
