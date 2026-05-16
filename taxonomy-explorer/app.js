/**
 * AAIF Taxonomy Explorer Engine (Dual-Mode Architecture)
 * Core logic handling real-time fuzzy filtering, master view toggling (Split vs Grid),
 * sidebar tree/A-Z navigation, grid card injection, and 100% secure DOM manipulation.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Retrieve data model array bound to global window scope
  const taxonomyData = window.AAIF_TAXONOMY || [];

  // Application States Hub
  const state = {
    masterView: 'split', // 'split' or 'grid'
    currentSearch: '',
    currentLetterGrid: 'ALL', // Alphabet filtering for grid view
    navMode: 'tree', // 'tree' or 'az' for split view
    activeTerm: 'Agentic AI', // Default active term on load
    filteredData: [...taxonomyData],
    expandedGroups: new Set(taxonomyData.map(item => item.category))
  };

  // DOM Elements Index
  const masterTabSplit = document.getElementById('master-tab-split');
  const masterTabGrid = document.getElementById('master-tab-grid');
  const splitLayoutContainer = document.getElementById('split-layout-container');
  const gridViewContainer = document.getElementById('grid-view-container');
  
  // Split View Elements
  const searchInputSplit = document.getElementById('search-input-split');
  const clearSearchBtnSplit = document.getElementById('clear-search-split');
  const resultCountSplit = document.getElementById('result-count-split');
  const activeFiltersBarSplit = document.getElementById('active-filters-split');
  const resetFiltersBtnSplit = document.getElementById('reset-filters-btn-split');
  const sidebarNavContent = document.getElementById('sidebar-nav-content');
  const mainContentPane = document.getElementById('main-content-pane');
  const tabTree = document.getElementById('tab-tree');
  const tabAz = document.getElementById('tab-az');

  // Grid View Elements
  const searchInputGrid = document.getElementById('search-input-grid');
  const clearSearchBtnGrid = document.getElementById('clear-search-grid');
  const alphabetBarGrid = document.getElementById('alphabet-bar-grid');
  const resultCountGrid = document.getElementById('result-count-grid');
  const activeFiltersBarGrid = document.getElementById('active-filters-grid');
  const resetFiltersBtnGrid = document.getElementById('reset-filters-btn-grid');
  const cardsGridContainer = document.getElementById('cards-grid-container');

  // Initialize Alphabet Shortcut Bar Layout for Grid View
  function initAlphabetIndexGrid() {
    const lettersWithData = new Set(
      taxonomyData.map(item => item.term.trim().charAt(0).toUpperCase())
    );

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    letters.forEach(letter => {
      const btn = document.createElement('button');
      btn.className = 'alpha-btn';
      btn.textContent = letter;
      btn.setAttribute('data-letter', letter);

      if (!lettersWithData.has(letter)) {
        btn.classList.add('disabled');
        btn.setAttribute('tabindex', '-1');
      }

      alphabetBarGrid.appendChild(btn);
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

  // Helper to group taxonomy data by category and parent-child relationships
  function getGroupedTreeData(data) {
    const groups = {};
    data.forEach(item => {
      const cat = item.category || 'Uncategorized';
      if (!groups[cat]) groups[cat] = { title: cat, roots: [], childrenMap: {} };
      
      if (item.broaderTerm) {
        if (!groups[cat].childrenMap[item.broaderTerm]) {
          groups[cat].childrenMap[item.broaderTerm] = [];
        }
        groups[cat].childrenMap[item.broaderTerm].push(item);
      } else {
        groups[cat].roots.push(item);
      }
    });
    return groups;
  }

  // ==================== MODE 1: MASTER-DETAIL SPLIT VIEW RENDERING ====================

  // Render Left Sidebar Navigation (Tree or A-Z Index) securely
  function renderSidebar() {
    sidebarNavContent.replaceChildren();

    if (state.filteredData.length === 0) {
      const emptyP = document.createElement('p');
      emptyP.className = 'empty-state';
      emptyP.textContent = 'No matching terms found.';
      sidebarNavContent.appendChild(emptyP);
      resultCountSplit.textContent = 'Showing 0 terms';
      return;
    }

    resultCountSplit.textContent = `Showing ${state.filteredData.length} terms`;
    const query = state.currentSearch;

    if (state.navMode === 'tree') {
      const groups = getGroupedTreeData(state.filteredData);

      Object.keys(groups).sort().forEach(cat => {
        const groupObj = groups[cat];
        const groupContainer = document.createElement('div');
        groupContainer.className = 'tree-group';

        const groupTitle = document.createElement('div');
        groupTitle.className = 'tree-group-title';
        groupTitle.textContent = cat;
        groupContainer.appendChild(groupTitle);

        const renderedTerms = new Set();

        // Helper to recursively render tree nodes
        function renderNode(item, isChild = false) {
          if (renderedTerms.has(item.term)) return;
          renderedTerms.add(item.term);

          const navItem = document.createElement('a');
          navItem.className = `nav-item ${isChild ? 'tree-child' : ''} ${item.term === state.activeTerm ? 'active' : ''}`;
          navItem.setAttribute('href', `#${item.term.replace(/\s+/g, '-')}`);
          
          const labelSpan = document.createElement('span');
          appendHighlightedText(labelSpan, item.term, query);
          navItem.appendChild(labelSpan);

          navItem.addEventListener('click', (e) => {
            e.preventDefault();
            setActiveTerm(item.term);
          });

          groupContainer.appendChild(navItem);

          // Render children if any exist
          const children = groupObj.childrenMap[item.term] || [];
          children.forEach(child => renderNode(child, true));
        }

        groupObj.roots.forEach(root => renderNode(root, false));

        // Render orphaned children whose parent was filtered out
        Object.keys(groupObj.childrenMap).forEach(parentTerm => {
          groupObj.childrenMap[parentTerm].forEach(child => {
            if (!renderedTerms.has(child.term)) {
              renderNode(child, false);
            }
          });
        });

        sidebarNavContent.appendChild(groupContainer);
      });

    } else {
      // A-Z Index Mode
      const alphaGroups = {};
      state.filteredData.forEach(item => {
        const letter = item.term.trim().charAt(0).toUpperCase();
        if (!alphaGroups[letter]) alphaGroups[letter] = [];
        alphaGroups[letter].push(item);
      });

      Object.keys(alphaGroups).sort().forEach(letter => {
        const alphaContainer = document.createElement('div');
        alphaContainer.className = 'alpha-group';

        const alphaHeader = document.createElement('div');
        alphaHeader.className = 'alpha-header';
        alphaHeader.textContent = letter;
        alphaContainer.appendChild(alphaHeader);

        alphaGroups[letter].forEach(item => {
          const navItem = document.createElement('a');
          navItem.className = `nav-item ${item.term === state.activeTerm ? 'active' : ''}`;
          navItem.setAttribute('href', `#${item.term.replace(/\s+/g, '-')}`);
          
          const labelSpan = document.createElement('span');
          appendHighlightedText(labelSpan, item.term, query);
          navItem.appendChild(labelSpan);

          navItem.addEventListener('click', (e) => {
            e.preventDefault();
            setActiveTerm(item.term);
          });

          alphaContainer.appendChild(navItem);
        });

        sidebarNavContent.appendChild(alphaContainer);
      });
    }
  }

  // Render Right Content Area (Active Concept Detail Sheet) securely
  function renderDetailPane() {
    mainContentPane.replaceChildren();

    if (state.filteredData.length === 0) {
      const emptyDiv = document.createElement('div');
      emptyDiv.className = 'empty-state';
      const emptyP = document.createElement('p');
      emptyP.textContent = 'No concepts match your current search filter.';
      emptyDiv.appendChild(emptyP);
      mainContentPane.appendChild(emptyDiv);
      return;
    }

    let activeItem = state.filteredData.find(item => item.term === state.activeTerm);
    if (!activeItem) {
      activeItem = state.filteredData[0];
      state.activeTerm = activeItem.term;
    }

    const query = state.currentSearch;

    // 1. Breadcrumb Trail (Traversing pointers upward)
    const breadcrumbTrail = document.createElement('div');
    breadcrumbTrail.className = 'breadcrumb-trail';

    const catBreadcrumb = document.createElement('span');
    catBreadcrumb.className = 'breadcrumb-item';
    catBreadcrumb.textContent = activeItem.category;
    breadcrumbTrail.appendChild(catBreadcrumb);

    // Build lineage
    const lineage = [];
    let current = activeItem.broaderTerm;
    while (current) {
      const parentItem = taxonomyData.find(i => i.term === current);
      if (parentItem) {
        lineage.unshift(parentItem);
        current = parentItem.broaderTerm;
      } else {
        break;
      }
    }

    lineage.forEach(parentItem => {
      const sep = document.createElement('span');
      sep.className = 'breadcrumb-sep';
      sep.textContent = '/';
      breadcrumbTrail.appendChild(sep);

      const parentLink = document.createElement('a');
      parentLink.className = 'breadcrumb-item';
      parentLink.setAttribute('href', `#${parentItem.term.replace(/\s+/g, '-')}`);
      parentLink.textContent = parentItem.term;
      parentLink.addEventListener('click', (e) => {
        e.preventDefault();
        setActiveTerm(parentItem.term);
      });
      breadcrumbTrail.appendChild(parentLink);
    });

    const sepFinal = document.createElement('span');
    sepFinal.className = 'breadcrumb-sep';
    sepFinal.textContent = '/';
    breadcrumbTrail.appendChild(sepFinal);

    const activeBreadcrumb = document.createElement('span');
    activeBreadcrumb.className = 'breadcrumb-active';
    activeBreadcrumb.textContent = activeItem.term;
    breadcrumbTrail.appendChild(activeBreadcrumb);

    mainContentPane.appendChild(breadcrumbTrail);

    // 2. Main Concept Detail Card
    const card = document.createElement('article');
    card.className = 'concept-detail-card';
    card.setAttribute('id', activeItem.term.replace(/\s+/g, '-'));

    // Header
    const cardHeader = document.createElement('div');
    cardHeader.className = 'card-header';

    const cardTitle = document.createElement('h3');
    cardTitle.className = 'card-title';
    appendHighlightedText(cardTitle, activeItem.term, query);
    cardHeader.appendChild(cardTitle);

    const catClass = mapCategoryClass(activeItem.category);
    const catTag = document.createElement('span');
    catTag.className = `category-tag ${catClass}`;
    catTag.textContent = activeItem.category;
    cardHeader.appendChild(catTag);

    card.appendChild(cardHeader);

    // Body (Definition)
    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';
    const defP = document.createElement('p');
    appendHighlightedText(defP, activeItem.definition, query);
    cardBody.appendChild(defP);
    card.appendChild(cardBody);

    // Aliases
    if (activeItem.aliases && activeItem.aliases.length > 0) {
      const aliasesDiv = document.createElement('div');
      aliasesDiv.className = 'card-aliases';
      
      const aliasLabel = document.createElement('span');
      aliasLabel.className = 'alias-label';
      aliasLabel.textContent = 'Aliases:';
      aliasesDiv.appendChild(aliasLabel);

      activeItem.aliases.forEach(alias => {
        const badge = document.createElement('span');
        badge.className = 'alias-badge';
        appendHighlightedText(badge, alias, query);
        aliasesDiv.appendChild(badge);
      });

      card.appendChild(aliasesDiv);
    }

    // Broader Concept
    if (activeItem.broaderTerm) {
      const broaderDiv = document.createElement('div');
      broaderDiv.className = 'card-broader';

      const broaderLabel = document.createElement('span');
      broaderLabel.className = 'broader-label';
      broaderLabel.textContent = 'Broader Concept:';
      broaderDiv.appendChild(broaderLabel);

      const broaderLink = document.createElement('a');
      broaderLink.className = 'broader-link';
      broaderLink.setAttribute('href', `#${activeItem.broaderTerm.replace(/\s+/g, '-')}`);
      appendHighlightedText(broaderLink, activeItem.broaderTerm, query);

      broaderLink.addEventListener('click', (e) => {
        e.preventDefault();
        setActiveTerm(activeItem.broaderTerm);
      });

      broaderDiv.appendChild(broaderLink);
      card.appendChild(broaderDiv);
    }

    // Scope Notes
    if (activeItem.scopeNote) {
      const notesDiv = document.createElement('div');
      notesDiv.className = 'card-notes';

      const notesStrong = document.createElement('strong');
      notesStrong.textContent = 'Notes: ';
      notesDiv.appendChild(notesStrong);

      const notesText = document.createElement('span');
      appendHighlightedText(notesText, activeItem.scopeNote, query);
      notesDiv.appendChild(notesText);

      card.appendChild(notesDiv);
    }

    // Workgroups
    const wgDiv = document.createElement('div');
    wgDiv.className = 'card-workgroups';

    const wgLabel = document.createElement('span');
    wgLabel.className = 'wg-label';
    wgLabel.textContent = 'Aligns With:';
    wgDiv.appendChild(wgLabel);

    activeItem.workgroups.forEach(wg => {
      const wgBadge = document.createElement('span');
      wgBadge.className = 'wg-badge';
      appendHighlightedText(wgBadge, wg, query);
      wgDiv.appendChild(wgBadge);
    });

    card.appendChild(wgDiv);

    mainContentPane.appendChild(card);
  }

  // Handle active concept switching and smooth animation
  function setActiveTerm(term) {
    state.activeTerm = term;
    renderSidebar();
    renderDetailPane();
    
    const detailCard = document.querySelector('.concept-detail-card');
    if (detailCard) {
      detailCard.classList.remove('card-pulse');
      void detailCard.offsetWidth; // Trigger reflow
      detailCard.classList.add('card-pulse');
    }
  }

  // ==================== MODE 2: GRID CARD VIEW RENDERING ====================

  // Render Grid Card View securely
  function renderGridCards() {
    cardsGridContainer.replaceChildren();

    if (state.filteredData.length === 0) {
      const emptyState = document.createElement('div');
      emptyState.className = 'empty-state';

      const emptyMsg = document.createElement('p');
      emptyMsg.textContent = 'No vocabulary terms matched your current filters.';
      emptyState.appendChild(emptyMsg);

      const emptySub = document.createElement('span');
      emptySub.textContent = 'Try refining your search input keyword or resetting your alphabet slider constraints.';
      emptyState.appendChild(emptySub);

      cardsGridContainer.appendChild(emptyState);
      resultCountGrid.textContent = 'Showing 0 vocabulary terms';
      return;
    }

    resultCountGrid.textContent = `Showing ${state.filteredData.length} vocabulary terms`;
    const query = state.currentSearch;

    state.filteredData.forEach(item => {
      const card = document.createElement('article');
      card.className = 'taxonomy-card';
      card.setAttribute('id', `grid-${item.term.replace(/\s+/g, '-')}`);

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
        broaderLink.setAttribute('href', `#grid-${item.broaderTerm.replace(/\s+/g, '-')}`);
        appendHighlightedText(broaderLink, item.broaderTerm, query);

        broaderLink.addEventListener('click', (e) => {
          e.preventDefault();
          searchInputGrid.value = item.broaderTerm;
          state.currentSearch = item.broaderTerm;
          if (clearSearchBtnGrid) clearSearchBtnGrid.style.display = 'block';
          runFilteringPipeline();
          
          setTimeout(() => {
            const targetCard = document.getElementById(`grid-${item.broaderTerm.replace(/\s+/g, '-')}`);
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

      // 5. Scope Notes
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

      cardsGridContainer.appendChild(card);
    });
  }

  // ==================== FILTERING PIPELINE & EVENT LISTENERS ====================

  // Unified filter and filter pipeline logic
  function runFilteringPipeline() {
    const query = state.currentSearch.toLowerCase().trim();

    state.filteredData = taxonomyData.filter(item => {
      // Check letter constraint (only applies in grid view)
      if (state.masterView === 'grid' && state.currentLetterGrid !== 'ALL') {
        const firstLetter = item.term.trim().charAt(0).toUpperCase();
        if (firstLetter !== state.currentLetterGrid) return false;
      }

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

    state.filteredData.sort((a, b) => a.term.localeCompare(b.term));

    if (state.masterView === 'split') {
      if (query) {
        activeFiltersBarSplit.style.display = 'flex';
      } else {
        activeFiltersBarSplit.style.display = 'none';
      }
      renderSidebar();
      renderDetailPane();
    } else {
      if (state.currentLetterGrid !== 'ALL' || query) {
        activeFiltersBarGrid.style.display = 'flex';
      } else {
        activeFiltersBarGrid.style.display = 'none';
      }
      renderGridCards();
    }
  }

  // Master View Toggle Listeners
  masterTabSplit.addEventListener('click', () => {
    state.masterView = 'split';
    masterTabSplit.classList.add('active');
    masterTabGrid.classList.remove('active');
    
    splitLayoutContainer.style.display = 'grid';
    gridViewContainer.style.display = 'none';
    
    // Sync search input
    searchInputSplit.value = state.currentSearch;
    if (state.currentSearch.length > 0) {
      clearSearchBtnSplit.style.display = 'block';
    } else {
      clearSearchBtnSplit.style.display = 'none';
    }
    
    runFilteringPipeline();
  });

  masterTabGrid.addEventListener('click', () => {
    state.masterView = 'grid';
    masterTabGrid.classList.add('active');
    masterTabSplit.classList.remove('active');
    
    gridViewContainer.style.display = 'block';
    splitLayoutContainer.style.display = 'none';
    
    // Sync search input
    searchInputGrid.value = state.currentSearch;
    if (state.currentSearch.length > 0) {
      clearSearchBtnGrid.style.display = 'block';
    } else {
      clearSearchBtnGrid.style.display = 'none';
    }
    
    runFilteringPipeline();
  });

  // Split View Search Listeners
  searchInputSplit.addEventListener('input', (e) => {
    state.currentSearch = e.target.value;
    if (state.currentSearch.length > 0) {
      clearSearchBtnSplit.style.display = 'block';
    } else {
      clearSearchBtnSplit.style.display = 'none';
    }
    // Sync grid search input as well
    searchInputGrid.value = state.currentSearch;
    if (state.currentSearch.length > 0) {
      clearSearchBtnGrid.style.display = 'block';
    } else {
      clearSearchBtnGrid.style.display = 'none';
    }
    runFilteringPipeline();
  });

  clearSearchBtnSplit.addEventListener('click', () => {
    searchInputSplit.value = '';
    searchInputGrid.value = '';
    state.currentSearch = '';
    clearSearchBtnSplit.style.display = 'none';
    clearSearchBtnGrid.style.display = 'none';
    searchInputSplit.focus();
    runFilteringPipeline();
  });

  resetFiltersBtnSplit.addEventListener('click', () => {
    searchInputSplit.value = '';
    searchInputGrid.value = '';
    state.currentSearch = '';
    clearSearchBtnSplit.style.display = 'none';
    clearSearchBtnGrid.style.display = 'none';
    runFilteringPipeline();
  });

  // Grid View Search & Alphabet Listeners
  searchInputGrid.addEventListener('input', (e) => {
    state.currentSearch = e.target.value;
    if (state.currentSearch.length > 0) {
      clearSearchBtnGrid.style.display = 'block';
    } else {
      clearSearchBtnGrid.style.display = 'none';
    }
    // Sync split search input as well
    searchInputSplit.value = state.currentSearch;
    if (state.currentSearch.length > 0) {
      clearSearchBtnSplit.style.display = 'block';
    } else {
      clearSearchBtnSplit.style.display = 'none';
    }
    runFilteringPipeline();
  });

  clearSearchBtnGrid.addEventListener('click', () => {
    searchInputGrid.value = '';
    searchInputSplit.value = '';
    state.currentSearch = '';
    clearSearchBtnGrid.style.display = 'none';
    clearSearchBtnSplit.style.display = 'none';
    searchInputGrid.focus();
    runFilteringPipeline();
  });

  alphabetBarGrid.addEventListener('click', (e) => {
    const targetBtn = e.target.closest('.alpha-btn');
    if (!targetBtn || targetBtn.classList.contains('disabled')) return;

    alphabetBarGrid.querySelectorAll('.alpha-btn').forEach(btn => btn.classList.remove('active'));
    targetBtn.classList.add('active');
    state.currentLetterGrid = targetBtn.getAttribute('data-letter');

    runFilteringPipeline();
  });

  resetFiltersBtnGrid.addEventListener('click', () => {
    searchInputGrid.value = '';
    searchInputSplit.value = '';
    state.currentSearch = '';
    clearSearchBtnGrid.style.display = 'none';
    clearSearchBtnSplit.style.display = 'none';
    state.currentLetterGrid = 'ALL';

    alphabetBarGrid.querySelectorAll('.alpha-btn').forEach(btn => btn.classList.remove('active'));
    const allBtn = alphabetBarGrid.querySelector('.alpha-btn[data-letter="ALL"]');
    if (allBtn) allBtn.classList.add('active');

    runFilteringPipeline();
  });

  // Split View Tabs Listeners
  tabTree.addEventListener('click', () => {
    state.navMode = 'tree';
    tabTree.classList.add('active');
    tabAz.classList.remove('active');
    renderSidebar();
  });

  tabAz.addEventListener('click', () => {
    state.navMode = 'az';
    tabAz.classList.add('active');
    tabTree.classList.remove('active');
    renderSidebar();
  });

  // Initialize Dashboard Execution Flow Pipeline
  initAlphabetIndexGrid();
  runFilteringPipeline();
});
