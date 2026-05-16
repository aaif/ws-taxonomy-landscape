/**
 * AAIF Taxonomy Explorer Engine (Skosmos Master-Detail Architecture)
 * Core logic handling real-time fuzzy filtering, sidebar tree/A-Z navigation modes,
 * active concept detail sheet rendering, and 100% secure DOM manipulation.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Retrieve data model array bound to global window scope
  const taxonomyData = window.AAIF_TAXONOMY || [];

  // Application States Hub
  const state = {
    currentSearch: '',
    navMode: 'tree', // 'tree' or 'az'
    activeTerm: 'Agentic AI', // Default active term on load
    filteredData: [...taxonomyData],
    expandedGroups: new Set(taxonomyData.map(item => item.category))
  };

  // DOM Elements Index
  const searchInput = document.getElementById('search-input');
  const clearSearchBtn = document.getElementById('clear-search');
  const resultCount = document.getElementById('result-count');
  const activeFiltersBar = document.getElementById('active-filters');
  const resetFiltersBtn = document.getElementById('reset-filters-btn');
  const sidebarNavContent = document.getElementById('sidebar-nav-content');
  const mainContentPane = document.getElementById('main-content-pane');
  const tabTree = document.getElementById('tab-tree');
  const tabAz = document.getElementById('tab-az');

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

  // Render Left Sidebar Navigation (Tree or A-Z Index) securely
  function renderSidebar() {
    sidebarNavContent.replaceChildren();

    if (state.filteredData.length === 0) {
      const emptyP = document.createElement('p');
      emptyP.className = 'empty-state';
      emptyP.textContent = 'No matching terms found.';
      sidebarNavContent.appendChild(emptyP);
      resultCount.textContent = 'Showing 0 terms';
      return;
    }

    resultCount.textContent = `Showing ${state.filteredData.length} terms`;
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

    const activeItem = taxonomyData.find(item => item.term === state.activeTerm);
    if (!activeItem) {
      const emptyDiv = document.createElement('div');
      emptyDiv.className = 'empty-state';
      const emptyP = document.createElement('p');
      emptyP.textContent = 'Select a concept from the sidebar to view its SKOS metadata sheet.';
      emptyDiv.appendChild(emptyP);
      mainContentPane.appendChild(emptyDiv);
      return;
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

  // Unified filter and filter pipeline logic
  function runFilteringPipeline() {
    const query = state.currentSearch.toLowerCase().trim();

    state.filteredData = taxonomyData.filter(item => {
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

    if (query) {
      activeFiltersBar.style.display = 'flex';
    } else {
      activeFiltersBar.style.display = 'none';
    }

    renderSidebar();
    renderDetailPane();
  }

  // Event Listeners
  searchInput.addEventListener('input', (e) => {
    state.currentSearch = e.target.value;
    if (state.currentSearch.length > 0) {
      clearSearchBtn.style.display = 'block';
    } else {
      clearSearchBtn.style.display = 'none';
    }
    runFilteringPipeline();
  });

  clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    state.currentSearch = '';
    clearSearchBtn.style.display = 'none';
    searchInput.focus();
    runFilteringPipeline();
  });

  resetFiltersBtn.addEventListener('click', () => {
    searchInput.value = '';
    state.currentSearch = '';
    clearSearchBtn.style.display = 'none';
    runFilteringPipeline();
  });

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
  runFilteringPipeline();
});
