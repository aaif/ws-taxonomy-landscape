/**
 * AAIF Taxonomy Explorer Engine
 * Core logic handling real-time fuzzy filtering, alphabet paging index mapping,
 * active search term query highlighting, and dynamic card injection.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Retrieve data model array bound to global window scope
  const taxonomyData = window.AAIF_TAXONOMY || [];

  // Application States Hub
  const state = {
    currentSearch: '',
    currentLetter: 'ALL',
    filteredData: [...taxonomyData]
  };

  // DOM Elements Index
  const cardsGrid = document.getElementById('cards-grid');
  const searchInput = document.getElementById('search-input');
  const clearSearchBtn = document.getElementById('clear-search');
  const alphabetBar = document.getElementById('alphabet-bar');
  const resultCount = document.getElementById('result-count');
  const activeFiltersBar = document.getElementById('active-filters');
  const resetFiltersBtn = document.getElementById('reset-filters-btn');

  // Initialize Alphabet Shortcut Bar Layout
  function initAlphabetIndex() {
    // Get unique letters that actually have data to toggle enabled/disabled states
    const lettersWithData = new Set(
      taxonomyData.map(item => item.term.trim().charAt(0).toUpperCase())
    );

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    letters.forEach(letter => {
      const btn = document.createElement('button');
      btn.className = 'alpha-btn';
      btn.textContent = letter;
      btn.setAttribute('data-letter', letter);

      // Disable buttons for letters that contain no vocabulary terms to prevent empty links
      if (!lettersWithData.has(letter)) {
        btn.classList.add('disabled');
        btn.setAttribute('tabindex', '-1');
      }

      alphabetBar.appendChild(btn);
    });
  }

  // Helper to map text string category into matching CSS variable tags
  function mapCategoryClass(cat) {
    switch (cat) {
      case 'Agentic Threats': return 'tag-threats';
      case 'Agentic Controls': return 'tag-controls';
      case 'Data and Privacy': return 'tag-privacy';
      case 'Identity and Authorization': return 'tag-identity';
      case 'Security Practices': return 'tag-practices';
      case 'Infrastructure and Architecture': return 'tag-infra';
      default: return 'tag-default';
    }
  }

  // Helper to highlight query substrings within matching parent blocks cleanly
  function highlightQueryMatch(text, query) {
    if (!query) return text;
    try {
      // Escape special regex characters for safety
      const escapedQuery = query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(`(${escapedQuery})`, 'gi');
      return text.replace(regex, '<mark class="match-highlight">$1</mark>');
    } catch (e) {
      return text;
    }
  }

  // Render data model items to cards deck container
  function renderDashboardCards() {
    cardsGrid.innerHTML = '';

    if (state.filteredData.length === 0) {
      cardsGrid.innerHTML = `
        <div class="empty-state">
          <p>No vocabulary terms matched your current filters.</p>
          <span>Try refining your search input keyword or resetting your alphabet slider constraints.</span>
        </div>
      `;
      resultCount.textContent = 'Showing 0 vocabulary terms';
      return;
    }

    // Update metadata status count label
    resultCount.textContent = `Showing ${state.filteredData.length} vocabulary terms`;

    // Iterate over data model elements
    state.filteredData.forEach(item => {
      const card = document.createElement('article');
      card.className = 'taxonomy-card';

      // Highlight content segments matching active query string
      const query = state.currentSearch;
      const highlightedTerm = highlightQueryMatch(item.term, query);
      const highlightedDef = highlightQueryMatch(item.definition, query);
      const highlightedNotes = highlightQueryMatch(item.notes, query);

      const catClass = mapCategoryClass(item.category);

      // Structure related cross-WG item string nodes
      const wgBadges = item.workgroups.map(wg => `<span class="wg-badge">${highlightQueryMatch(wg, query)}</span>`).join('');

      card.innerHTML = `
        <div class="card-header">
          <h3 class="card-title">${highlightedTerm}</h3>
          <span class="category-tag ${catClass}">${item.category}</span>
        </div>
        <div class="card-body">
          <p>${highlightedDef}</p>
        </div>
        <div class="card-notes">
          <strong>Notes:</strong> ${highlightedNotes}
        </div>
        <div class="card-workgroups">
          <span class="wg-label">Aligns With:</span>
          ${wgBadges}
        </div>
      `;

      cardsGrid.appendChild(card);
    });
  }

  // Unified filter and filter pipeline logic
  function runFilteringPipeline() {
    const query = state.currentSearch.toLowerCase().trim();

    state.filteredData = taxonomyData.filter(item => {
      // Check letter constraint
      if (state.currentLetter !== 'ALL') {
        const firstLetter = item.term.trim().charAt(0).toUpperCase();
        if (firstLetter !== state.currentLetter) return false;
      }

      // Check text query matching across fields
      if (query) {
        const matchTerm = item.term.toLowerCase().includes(query);
        const matchDef = item.definition.toLowerCase().includes(query);
        const matchNotes = item.notes.toLowerCase().includes(query);
        const matchWGs = item.workgroups.some(wg => wg.toLowerCase().includes(query));

        return matchTerm || matchDef || matchNotes || matchWGs;
      }

      return true;
    });

    // Sort dynamically alphabetically by term
    state.filteredData.sort((a, b) => a.term.localeCompare(b.term));

    // Handle metadata control tags indicators visibilities
    if (state.currentLetter !== 'ALL' || query) {
      activeFiltersBar.style.display = 'flex';
    } else {
      activeFiltersBar.style.display = 'none';
    }

    renderDashboardCards();
  }

  // Event: Fuzzy Search input keyup listener
  searchInput.addEventListener('input', (e) => {
    state.currentSearch = e.target.value;

    // Toggle clear inline buttons indicators visibility
    if (state.currentSearch.length > 0) {
      clearSearchBtn.style.display = 'block';
    } else {
      clearSearchBtn.style.display = 'none';
    }

    runFilteringPipeline();
  });

  // Event: Inline Clear Search Button Click
  clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    state.currentSearch = '';
    clearSearchBtn.style.display = 'none';
    searchInput.focus();
    runFilteringPipeline();
  });

  // Event: Alphabet Index Clicks Listener
  alphabetBar.addEventListener('click', (e) => {
    const targetBtn = e.target.closest('.alpha-btn');
    if (!targetBtn || targetBtn.classList.contains('disabled')) return;

    // Remove active class state tokens from old button nodes
    document.querySelectorAll('.alpha-btn').forEach(btn => btn.classList.remove('active'));

    // Bind state
    targetBtn.classList.add('active');
    state.currentLetter = targetBtn.getAttribute('data-letter');

    runFilteringPipeline();
  });

  // Event: Full Filters State Clear Reset Trigger Click
  function resetAllFilters() {
    searchInput.value = '';
    state.currentSearch = '';
    clearSearchBtn.style.display = 'none';
    state.currentLetter = 'ALL';

    document.querySelectorAll('.alpha-btn').forEach(btn => btn.classList.remove('active'));
    const allBtn = document.querySelector('.alpha-btn[data-letter="ALL"]');
    if (allBtn) allBtn.classList.add('active');

    runFilteringPipeline();
  }

  resetFiltersBtn.addEventListener('click', resetAllFilters);

  // Initialize Dashboard Execution Flow Pipeline
  initAlphabetIndex();
  runFilteringPipeline();
});
