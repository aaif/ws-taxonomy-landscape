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
      case 'Data and Privacy':
      case 'Data & Privacy': return 'tag-privacy';
      case 'Identity and Authorization':
      case 'Identity & Authorization': return 'tag-identity';
      case 'Security Practices': return 'tag-practices';
      case 'Infrastructure and Architecture':
      case 'Infrastructure & Architecture': return 'tag-infra';
      default: return 'tag-default';
    }
  }

  // Helper to append highlighted query substrings within matching parent blocks cleanly using pure DOM methods
  function appendHighlightedText(parentElement, text, query) {
    if (!query) {
      parentElement.textContent = text;
      return;
    }
    try {
      // Escape special regex characters for safety
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

  // Render data model items to cards deck container securely
  function renderDashboardCards() {
    cardsGrid.replaceChildren();

    if (state.filteredData.length === 0) {
      const emptyState = document.createElement('div');
      emptyState.className = 'empty-state';

      const emptyMsg = document.createElement('p');
      emptyMsg.textContent = 'No vocabulary terms matched your current filters.';
      emptyState.appendChild(emptyMsg);

      const emptySub = document.createElement('span');
      emptySub.textContent = 'Try refining your search input keyword or resetting your alphabet slider constraints.';
      emptyState.appendChild(emptySub);

      cardsGrid.appendChild(emptyState);
      resultCount.textContent = 'Showing 0 vocabulary terms';
      return;
    }

    // Update metadata status count label
    resultCount.textContent = `Showing ${state.filteredData.length} vocabulary terms`;

    // Iterate over data model elements
    state.filteredData.forEach(item => {
      const card = document.createElement('article');
      card.className = 'taxonomy-card';
      card.setAttribute('id', item.term.replace(/\s+/g, '-'));

      const query = state.currentSearch;

      // 1. Header
      const cardHeader = document.createElement('div');
      cardHeader.className = 'card-header';

      const cardTitle = document.createElement('h3');
      cardTitle.className = 'card-title';
      appendHighlightedText(cardTitle, item.term, query);
      cardHeader.appendChild(cardTitle);

      const catClass = mapCategoryClass(item.category);
      const catTag = document.createElement('span');
      catTag.className = `category-tag ${catClass}`;
      catTag.textContent = item.category;
      cardHeader.appendChild(catTag);

      card.appendChild(cardHeader);

      // 2. Body (Definition)
      const cardBody = document.createElement('div');
      cardBody.className = 'card-body';
      const defP = document.createElement('p');
      appendHighlightedText(defP, item.definition, query);
      cardBody.appendChild(defP);
      card.appendChild(cardBody);

      // 3. Aliases (if present)
      if (item.aliases && item.aliases.length > 0) {
        const aliasesDiv = document.createElement('div');
        aliasesDiv.className = 'card-aliases';
        
        const aliasLabel = document.createElement('span');
        aliasLabel.className = 'alias-label';
        aliasLabel.textContent = 'Aliases:';
        aliasesDiv.appendChild(aliasLabel);

        item.aliases.forEach(alias => {
          const badge = document.createElement('span');
          badge.className = 'alias-badge';
          appendHighlightedText(badge, alias, query);
          aliasesDiv.appendChild(badge);
        });

        card.appendChild(aliasesDiv);
      }

      // 4. Broader Concept (if present)
      if (item.broaderTerm) {
        const broaderDiv = document.createElement('div');
        broaderDiv.className = 'card-broader';

        const broaderLabel = document.createElement('span');
        broaderLabel.className = 'broader-label';
        broaderLabel.textContent = 'Broader Concept:';
        broaderDiv.appendChild(broaderLabel);

        const broaderLink = document.createElement('a');
        broaderLink.className = 'broader-link';
        broaderLink.setAttribute('href', `#${item.broaderTerm.replace(/\s+/g, '-')}`);
        appendHighlightedText(broaderLink, item.broaderTerm, query);

        // Add click listener for smooth interactive filtering to parent card
        broaderLink.addEventListener('click', (e) => {
          e.preventDefault();
          searchInput.value = item.broaderTerm;
          state.currentSearch = item.broaderTerm;
          if (clearSearchBtn) clearSearchBtn.style.display = 'block';
          runFilteringPipeline();
          
          // Smooth scroll to the target card if it exists in the new filtered view
          setTimeout(() => {
            const targetCard = document.getElementById(item.broaderTerm.replace(/\s+/g, '-'));
            if (targetCard) {
              targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
              targetCard.classList.add('card-pulse');
              setTimeout(() => targetCard.classList.remove('card-pulse'), 1500);
            }
          }, 100);
        });

        broaderDiv.appendChild(broaderLink);
        card.appendChild(broaderDiv);
      }

      // 5. Scope Notes (formerly notes)
      if (item.scopeNote) {
        const notesDiv = document.createElement('div');
        notesDiv.className = 'card-notes';

        const notesStrong = document.createElement('strong');
        notesStrong.textContent = 'Notes: ';
        notesDiv.appendChild(notesStrong);

        const notesText = document.createElement('span');
        appendHighlightedText(notesText, item.scopeNote, query);
        notesDiv.appendChild(notesText);

        card.appendChild(notesDiv);
      }

      // 6. Workgroups
      const wgDiv = document.createElement('div');
      wgDiv.className = 'card-workgroups';

      const wgLabel = document.createElement('span');
      wgLabel.className = 'wg-label';
      wgLabel.textContent = 'Aligns With:';
      wgDiv.appendChild(wgLabel);

      item.workgroups.forEach(wg => {
        const wgBadge = document.createElement('span');
        wgBadge.className = 'wg-badge';
        appendHighlightedText(wgBadge, wg, query);
        wgDiv.appendChild(wgBadge);
      });

      card.appendChild(wgDiv);

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
        const matchNotes = (item.scopeNote || '').toLowerCase().includes(query);
        const matchAliases = (item.aliases || []).some(a => a.toLowerCase().includes(query));
        const matchBroader = (item.broaderTerm || '').toLowerCase().includes(query);
        const matchWGs = item.workgroups.some(wg => wg.toLowerCase().includes(query));

        return matchTerm || matchDef || matchNotes || matchAliases || matchBroader || matchWGs;
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
