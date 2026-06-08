/**
 * AAIF Taxonomy Explorer Engine (Tri-Mode Architecture)
 * Core logic handling real-time fuzzy filtering, master view toggling (Split vs Grid vs Mindmap),
 * sidebar tree/A-Z navigation, grid card injection, mindmap tree rendering, and 100% secure DOM manipulation.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Retrieve data model array bound to global window scope
  const taxonomyData = window.AAIF_TAXONOMY || [];

  // Application States Hub
  const state = {
    masterView: 'grid', // 'split', 'grid', or 'mindmap'
    currentSearch: '',
    currentLetterGrid: 'ALL', // Alphabet filtering for grid view
    activeTerm: 'Agentic AI', // Default active term on load
    filteredData: [...taxonomyData],
    mindmapCollapsedCats: new Set() // Tracks which categories are collapsed in mindmap
  };

  // DOM Elements Index
  const masterTabSplit = document.getElementById('master-tab-split');
  const masterTabGrid = document.getElementById('master-tab-grid');
  const masterTabMindmap = document.getElementById('master-tab-mindmap');
  const splitLayoutContainer = document.getElementById('split-layout-container');
  const gridViewContainer = document.getElementById('grid-view-container');
  const mindmapViewContainer = document.getElementById('mindmap-view-container');

  // Split View Elements
  const searchInputSplit = document.getElementById('search-input-split');
  const clearSearchBtnSplit = document.getElementById('clear-search-split');
  const resultCountSplit = document.getElementById('result-count-split');
  const activeFiltersBarSplit = document.getElementById('active-filters-split');
  const resetFiltersBtnSplit = document.getElementById('reset-filters-btn-split');
  const sidebarNavContent = document.getElementById('sidebar-nav-content');
  const mainContentPane = document.getElementById('main-content-pane');

  // Grid View Elements
  const searchInputGrid = document.getElementById('search-input-grid');
  const clearSearchBtnGrid = document.getElementById('clear-search-grid');
  const alphabetBarGrid = document.getElementById('alphabet-bar-grid');
  const resultCountGrid = document.getElementById('result-count-grid');
  const activeFiltersBarGrid = document.getElementById('active-filters-grid');
  const resetFiltersBtnGrid = document.getElementById('reset-filters-btn-grid');
  const cardsGridContainer = document.getElementById('cards-grid-container');

  // Mindmap View Elements
  const searchInputMindmap = document.getElementById('search-input-mindmap');
  const clearSearchBtnMindmap = document.getElementById('clear-search-mindmap');
  const btnExpandAll = document.getElementById('btn-expand-all');
  const btnCollapseAll = document.getElementById('btn-collapse-all');
  const mindmapCanvasContainer = document.getElementById('mindmap-canvas-container');
  const mindmapDetailModal = document.getElementById('mindmap-detail-modal');
  const mindmapModalContent = document.getElementById('mindmap-modal-content');
  const modalCloseBtn = document.getElementById('modal-close-btn');

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

  // Render Left Sidebar Navigation (Tree Hierarchy) securely
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

        const children = groupObj.childrenMap[item.term] || [];
        children.forEach(child => renderNode(child, true));
      }

      groupObj.roots.forEach(root => renderNode(root, false));

      Object.keys(groupObj.childrenMap).forEach(parentTerm => {
        groupObj.childrenMap[parentTerm].forEach(child => {
          if (!renderedTerms.has(child.term)) {
            renderNode(child, false);
          }
        });
      });

      sidebarNavContent.appendChild(groupContainer);
    });
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

    // 1. Breadcrumb Trail
    const breadcrumbTrail = document.createElement('div');
    breadcrumbTrail.className = 'breadcrumb-trail';

    const catBreadcrumb = document.createElement('span');
    catBreadcrumb.className = 'breadcrumb-item';
    catBreadcrumb.textContent = activeItem.category;
    breadcrumbTrail.appendChild(catBreadcrumb);

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

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';
    const defP = document.createElement('p');
    appendHighlightedText(defP, activeItem.definition, query);
    cardBody.appendChild(defP);
    card.appendChild(cardBody);

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

    if (activeItem.relatedTerms && activeItem.relatedTerms.length > 0) {
      const relDiv = document.createElement('div');
      relDiv.className = 'card-aliases';

      const relLabel = document.createElement('span');
      relLabel.className = 'alias-label';
      relLabel.textContent = 'Related Concept:';
      relDiv.appendChild(relLabel);

      activeItem.relatedTerms.forEach(rel => {
        const badge = document.createElement('span');
        badge.className = 'alias-badge';
        badge.style.background = 'rgba(14, 165, 233, 0.15)';
        badge.style.border = '1px solid rgba(14, 165, 233, 0.3)';
        badge.style.color = '#38bdf8';
        appendHighlightedText(badge, rel, query);
        relDiv.appendChild(badge);
      });

      card.appendChild(relDiv);
    }

    if (activeItem.contrastsWith && activeItem.contrastsWith.length > 0) {
      const conDiv = document.createElement('div');
      conDiv.className = 'card-aliases';

      const conLabel = document.createElement('span');
      conLabel.className = 'alias-label';
      conLabel.textContent = 'Contrasts With:';
      conDiv.appendChild(conLabel);

      activeItem.contrastsWith.forEach(con => {
        const badge = document.createElement('span');
        badge.className = 'alias-badge';
        badge.style.background = 'rgba(244, 63, 94, 0.15)';
        badge.style.border = '1px solid rgba(244, 63, 94, 0.3)';
        badge.style.color = '#fb7185';
        appendHighlightedText(badge, con, query);
        conDiv.appendChild(badge);
      });

      card.appendChild(conDiv);
    }

    const wgDiv = document.createElement('div');
    wgDiv.className = 'card-workgroups';

    const wgLabel = document.createElement('span');
    wgLabel.className = 'wg-label';
    wgLabel.textContent = 'WGs:';
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

  function setActiveTerm(term) {
    state.activeTerm = term;
    renderSidebar();
    renderDetailPane();

    const detailCard = document.querySelector('.concept-detail-card');
    if (detailCard) {
      detailCard.classList.remove('card-pulse');
      void detailCard.offsetWidth;
      detailCard.classList.add('card-pulse');
    }
  }

  // ==================== MODE 2: GRID CARD VIEW RENDERING ====================

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

      const cardBody = document.createElement('div');
      cardBody.className = 'card-body';
      const defP = document.createElement('p');
      appendHighlightedText(defP, item.definition, query);
      cardBody.appendChild(defP);
      card.appendChild(cardBody);

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

      if (item.relatedTerms && item.relatedTerms.length > 0) {
        const relDiv = document.createElement('div');
        relDiv.className = 'card-aliases';

        const relLabel = document.createElement('span');
        relLabel.className = 'alias-label';
        relLabel.textContent = 'Related Concept:';
        relDiv.appendChild(relLabel);

        item.relatedTerms.forEach(rel => {
          const badge = document.createElement('span');
          badge.className = 'alias-badge';
          badge.style.background = 'rgba(14, 165, 233, 0.15)';
          badge.style.border = '1px solid rgba(14, 165, 233, 0.3)';
          badge.style.color = '#38bdf8';
          appendHighlightedText(badge, rel, query);
          relDiv.appendChild(badge);
        });

        card.appendChild(relDiv);
      }

      if (item.contrastsWith && item.contrastsWith.length > 0) {
        const conDiv = document.createElement('div');
        conDiv.className = 'card-aliases';

        const conLabel = document.createElement('span');
        conLabel.className = 'alias-label';
        conLabel.textContent = 'Contrasts With:';
        conDiv.appendChild(conLabel);

        item.contrastsWith.forEach(con => {
          const badge = document.createElement('span');
          badge.className = 'alias-badge';
          badge.style.background = 'rgba(244, 63, 94, 0.15)';
          badge.style.border = '1px solid rgba(244, 63, 94, 0.3)';
          badge.style.color = '#fb7185';
          appendHighlightedText(badge, con, query);
          conDiv.appendChild(badge);
        });

        card.appendChild(conDiv);
      }

      const wgDiv = document.createElement('div');
      wgDiv.className = 'card-workgroups';

      const wgLabel = document.createElement('span');
      wgLabel.className = 'wg-label';
      wgLabel.textContent = 'Workgroups:';
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

  // ==================== MODE 3: VISUAL MINDMAP EXPLORER RENDERING ====================

  function renderMindmap() {
    mindmapCanvasContainer.replaceChildren();

    if (state.filteredData.length === 0) {
      const emptyState = document.createElement('div');
      emptyState.className = 'empty-state';
      const emptyMsg = document.createElement('p');
      emptyMsg.textContent = 'No mindmap branches match your current search filter.';
      emptyState.appendChild(emptyMsg);
      mindmapCanvasContainer.appendChild(emptyState);
      return;
    }

    const query = state.currentSearch;

    // Root Node
    const rootNode = document.createElement('div');
    rootNode.className = 'mindmap-root';
    rootNode.textContent = 'AAIF Taxonomy';
    mindmapCanvasContainer.appendChild(rootNode);

    // Branches Container
    const branchesContainer = document.createElement('div');
    branchesContainer.className = 'mindmap-branches';

    const groups = getGroupedTreeData(state.filteredData);

    Object.keys(groups).sort().forEach(cat => {
      const groupObj = groups[cat];

      const catBranch = document.createElement('div');
      catBranch.className = 'mindmap-branch';

      const catNode = document.createElement('div');
      catNode.className = 'mindmap-node category-node';

      const catTitleSpan = document.createElement('span');
      appendHighlightedText(catTitleSpan, cat, query);
      catNode.appendChild(catTitleSpan);

      const indicator = document.createElement('span');
      indicator.style.fontSize = '0.8rem';
      indicator.style.color = 'var(--accent-teal)';
      indicator.textContent = state.mindmapCollapsedCats.has(cat) ? ' [+]' : ' [−]';
      catNode.appendChild(indicator);

      catBranch.appendChild(catNode);

      catNode.addEventListener('click', (e) => {
        e.stopPropagation();
        if (state.mindmapCollapsedCats.has(cat)) {
          state.mindmapCollapsedCats.delete(cat);
        } else {
          state.mindmapCollapsedCats.add(cat);
        }
        renderMindmap();
      });

      if (!state.mindmapCollapsedCats.has(cat)) {
        const subbranchesContainer = document.createElement('div');
        subbranchesContainer.className = 'mindmap-subbranches';

        const renderedTerms = new Set();

        function renderMindmapConcept(item, isChild = false) {
          if (renderedTerms.has(item.term)) return;
          renderedTerms.add(item.term);

          const conceptBranch = document.createElement('div');
          conceptBranch.className = 'mindmap-branch';

          const conceptNode = document.createElement('div');
          conceptNode.className = `mindmap-node ${isChild ? 'child-concept-node' : 'concept-node'}`;

          const labelSpan = document.createElement('span');
          appendHighlightedText(labelSpan, item.term, query);
          conceptNode.appendChild(labelSpan);

          conceptNode.addEventListener('click', (e) => {
            e.stopPropagation();
            openMindmapModal(item.term);
          });

          conceptBranch.appendChild(conceptNode);

          const children = groupObj.childrenMap[item.term] || [];
          if (children.length > 0) {
            const childSubContainer = document.createElement('div');
            childSubContainer.className = 'mindmap-subbranches';
            children.forEach(child => {
              const childElement = renderMindmapConcept(child, true);
              if (childElement) childSubContainer.appendChild(childElement);
            });
            conceptBranch.appendChild(childSubContainer);
          }

          return conceptBranch;
        }

        groupObj.roots.forEach(root => {
          const branchElem = renderMindmapConcept(root, false);
          if (branchElem) subbranchesContainer.appendChild(branchElem);
        });

        Object.keys(groupObj.childrenMap).forEach(parentTerm => {
          groupObj.childrenMap[parentTerm].forEach(child => {
            if (!renderedTerms.has(child.term)) {
              const branchElem = renderMindmapConcept(child, false);
              if (branchElem) subbranchesContainer.appendChild(branchElem);
            }
          });
        });

        catBranch.appendChild(subbranchesContainer);
      }

      branchesContainer.appendChild(catBranch);
    });

    mindmapCanvasContainer.appendChild(branchesContainer);
  }

  // Open Native Dialog Modal with Concept Sheet
  function openMindmapModal(term) {
    const activeItem = taxonomyData.find(item => item.term === term);
    if (!activeItem) return;

    mindmapModalContent.replaceChildren();
    const query = state.currentSearch;

    // 1. Breadcrumb Trail
    const breadcrumbTrail = document.createElement('div');
    breadcrumbTrail.className = 'breadcrumb-trail';

    const catBreadcrumb = document.createElement('span');
    catBreadcrumb.className = 'breadcrumb-item';
    catBreadcrumb.textContent = activeItem.category;
    breadcrumbTrail.appendChild(catBreadcrumb);

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

      const parentLink = document.createElement('span');
      parentLink.className = 'breadcrumb-item';
      parentLink.textContent = parentItem.term;
      parentLink.addEventListener('click', () => openMindmapModal(parentItem.term));
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

    mindmapModalContent.appendChild(breadcrumbTrail);

    // 2. Concept Sheet Card
    const card = document.createElement('article');
    card.className = 'concept-detail-card';
    card.style.boxShadow = 'none';
    card.style.border = 'none';
    card.style.padding = '0';

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

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';
    const defP = document.createElement('p');
    appendHighlightedText(defP, activeItem.definition, query);
    cardBody.appendChild(defP);
    card.appendChild(cardBody);

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

    if (activeItem.broaderTerm) {
      const broaderDiv = document.createElement('div');
      broaderDiv.className = 'card-broader';

      const broaderLabel = document.createElement('span');
      broaderLabel.className = 'broader-label';
      broaderLabel.textContent = 'Broader Concept:';
      broaderDiv.appendChild(broaderLabel);

      const broaderLink = document.createElement('span');
      broaderLink.className = 'broader-link';
      broaderLink.style.cursor = 'pointer';
      appendHighlightedText(broaderLink, activeItem.broaderTerm, query);

      broaderLink.addEventListener('click', () => openMindmapModal(activeItem.broaderTerm));

      broaderDiv.appendChild(broaderLink);
      card.appendChild(broaderDiv);
    }

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

    if (activeItem.relatedTerms && activeItem.relatedTerms.length > 0) {
      const relDiv = document.createElement('div');
      relDiv.className = 'card-aliases';

      const relLabel = document.createElement('span');
      relLabel.className = 'alias-label';
      relLabel.textContent = 'Related Concept:';
      relDiv.appendChild(relLabel);

      activeItem.relatedTerms.forEach(rel => {
        const badge = document.createElement('span');
        badge.className = 'alias-badge';
        badge.style.background = 'rgba(14, 165, 233, 0.15)';
        badge.style.border = '1px solid rgba(14, 165, 233, 0.3)';
        badge.style.color = '#38bdf8';
        appendHighlightedText(badge, rel, query);
        relDiv.appendChild(badge);
      });

      card.appendChild(relDiv);
    }

    if (activeItem.contrastsWith && activeItem.contrastsWith.length > 0) {
      const conDiv = document.createElement('div');
      conDiv.className = 'card-aliases';

      const conLabel = document.createElement('span');
      conLabel.className = 'alias-label';
      conLabel.textContent = 'Contrasts With:';
      conDiv.appendChild(conLabel);

      activeItem.contrastsWith.forEach(con => {
        const badge = document.createElement('span');
        badge.className = 'alias-badge';
        badge.style.background = 'rgba(244, 63, 94, 0.15)';
        badge.style.border = '1px solid rgba(244, 63, 94, 0.3)';
        badge.style.color = '#fb7185';
        appendHighlightedText(badge, con, query);
        conDiv.appendChild(badge);
      });

      card.appendChild(conDiv);
    }

    const wgDiv = document.createElement('div');
    wgDiv.className = 'card-workgroups';

    const wgLabel = document.createElement('span');
    wgLabel.className = 'wg-label';
    wgLabel.textContent = 'Workgroups:';
    wgDiv.appendChild(wgLabel);

    activeItem.workgroups.forEach(wg => {
      const wgBadge = document.createElement('span');
      wgBadge.className = 'wg-badge';
      appendHighlightedText(wgBadge, wg, query);
      wgDiv.appendChild(wgBadge);
    });

    card.appendChild(wgDiv);

    mindmapModalContent.appendChild(card);

    if (typeof mindmapDetailModal.showModal === 'function') {
      mindmapDetailModal.showModal();
    } else {
      mindmapDetailModal.setAttribute('open', 'true');
    }
  }

  // ==================== FILTERING PIPELINE & EVENT LISTENERS ====================

  function runFilteringPipeline() {
    const query = state.currentSearch.toLowerCase().trim();

    state.filteredData = taxonomyData.filter(item => {
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
    } else if (state.masterView === 'grid') {
      if (state.currentLetterGrid !== 'ALL' || query) {
        activeFiltersBarGrid.style.display = 'flex';
      } else {
        activeFiltersBarGrid.style.display = 'none';
      }
      renderGridCards();
    } else {
      renderMindmap();
    }
  }

  // Master View Toggle Listeners
  masterTabSplit.addEventListener('click', () => {
    state.masterView = 'split';
    masterTabSplit.classList.add('active');
    masterTabGrid.classList.remove('active');
    masterTabMindmap.classList.remove('active');

    splitLayoutContainer.style.display = 'grid';
    gridViewContainer.style.display = 'none';
    mindmapViewContainer.style.display = 'none';

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
    masterTabMindmap.classList.remove('active');

    gridViewContainer.style.display = 'block';
    splitLayoutContainer.style.display = 'none';
    mindmapViewContainer.style.display = 'none';

    searchInputGrid.value = state.currentSearch;
    if (state.currentSearch.length > 0) {
      clearSearchBtnGrid.style.display = 'block';
    } else {
      clearSearchBtnGrid.style.display = 'none';
    }
    runFilteringPipeline();
  });

  masterTabMindmap.addEventListener('click', () => {
    state.masterView = 'mindmap';
    masterTabMindmap.classList.add('active');
    masterTabSplit.classList.remove('active');
    masterTabGrid.classList.remove('active');

    mindmapViewContainer.style.display = 'block';
    splitLayoutContainer.style.display = 'none';
    gridViewContainer.style.display = 'none';

    searchInputMindmap.value = state.currentSearch;
    if (state.currentSearch.length > 0) {
      clearSearchBtnMindmap.style.display = 'block';
    } else {
      clearSearchBtnMindmap.style.display = 'none';
    }
    runFilteringPipeline();
  });

  // Split View Search Listeners
  searchInputSplit.addEventListener('input', (e) => {
    state.currentSearch = e.target.value;
    if (state.currentSearch.length > 0) clearSearchBtnSplit.style.display = 'block';
    else clearSearchBtnSplit.style.display = 'none';

    searchInputGrid.value = state.currentSearch;
    if (state.currentSearch.length > 0) clearSearchBtnGrid.style.display = 'block';
    else clearSearchBtnGrid.style.display = 'none';

    searchInputMindmap.value = state.currentSearch;
    if (state.currentSearch.length > 0) clearSearchBtnMindmap.style.display = 'block';
    else clearSearchBtnMindmap.style.display = 'none';

    runFilteringPipeline();
  });

  clearSearchBtnSplit.addEventListener('click', () => {
    searchInputSplit.value = '';
    searchInputGrid.value = '';
    searchInputMindmap.value = '';
    state.currentSearch = '';
    clearSearchBtnSplit.style.display = 'none';
    clearSearchBtnGrid.style.display = 'none';
    clearSearchBtnMindmap.style.display = 'none';
    searchInputSplit.focus();
    runFilteringPipeline();
  });

  resetFiltersBtnSplit.addEventListener('click', () => {
    searchInputSplit.value = '';
    searchInputGrid.value = '';
    searchInputMindmap.value = '';
    state.currentSearch = '';
    clearSearchBtnSplit.style.display = 'none';
    clearSearchBtnGrid.style.display = 'none';
    clearSearchBtnMindmap.style.display = 'none';
    runFilteringPipeline();
  });

  // Grid View Search & Alphabet Listeners
  searchInputGrid.addEventListener('input', (e) => {
    state.currentSearch = e.target.value;
    if (state.currentSearch.length > 0) clearSearchBtnGrid.style.display = 'block';
    else clearSearchBtnGrid.style.display = 'none';

    searchInputSplit.value = state.currentSearch;
    if (state.currentSearch.length > 0) clearSearchBtnSplit.style.display = 'block';
    else clearSearchBtnSplit.style.display = 'none';

    searchInputMindmap.value = state.currentSearch;
    if (state.currentSearch.length > 0) clearSearchBtnMindmap.style.display = 'block';
    else clearSearchBtnMindmap.style.display = 'none';

    runFilteringPipeline();
  });

  clearSearchBtnGrid.addEventListener('click', () => {
    searchInputGrid.value = '';
    searchInputSplit.value = '';
    searchInputMindmap.value = '';
    state.currentSearch = '';
    clearSearchBtnGrid.style.display = 'none';
    clearSearchBtnSplit.style.display = 'none';
    clearSearchBtnMindmap.style.display = 'none';
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
    searchInputMindmap.value = '';
    state.currentSearch = '';
    clearSearchBtnGrid.style.display = 'none';
    clearSearchBtnSplit.style.display = 'none';
    clearSearchBtnMindmap.style.display = 'none';
    state.currentLetterGrid = 'ALL';

    alphabetBarGrid.querySelectorAll('.alpha-btn').forEach(btn => btn.classList.remove('active'));
    const allBtn = alphabetBarGrid.querySelector('.alpha-btn[data-letter="ALL"]');
    if (allBtn) allBtn.classList.add('active');

    runFilteringPipeline();
  });

  // Mindmap Search & Actions Listeners
  searchInputMindmap.addEventListener('input', (e) => {
    state.currentSearch = e.target.value;
    if (state.currentSearch.length > 0) clearSearchBtnMindmap.style.display = 'block';
    else clearSearchBtnMindmap.style.display = 'none';

    searchInputSplit.value = state.currentSearch;
    if (state.currentSearch.length > 0) clearSearchBtnSplit.style.display = 'block';
    else clearSearchBtnSplit.style.display = 'none';

    searchInputGrid.value = state.currentSearch;
    if (state.currentSearch.length > 0) clearSearchBtnGrid.style.display = 'block';
    else clearSearchBtnGrid.style.display = 'none';

    runFilteringPipeline();
  });

  clearSearchBtnMindmap.addEventListener('click', () => {
    searchInputMindmap.value = '';
    searchInputSplit.value = '';
    searchInputGrid.value = '';
    state.currentSearch = '';
    clearSearchBtnMindmap.style.display = 'none';
    clearSearchBtnSplit.style.display = 'none';
    clearSearchBtnGrid.style.display = 'none';
    searchInputMindmap.focus();
    runFilteringPipeline();
  });

  btnExpandAll.addEventListener('click', () => {
    state.mindmapCollapsedCats.clear();
    renderMindmap();
  });

  btnCollapseAll.addEventListener('click', () => {
    taxonomyData.forEach(item => {
      if (item.category) state.mindmapCollapsedCats.add(item.category);
    });
    renderMindmap();
  });

  modalCloseBtn.addEventListener('click', () => {
    if (typeof mindmapDetailModal.close === 'function') {
      mindmapDetailModal.close();
    } else {
      mindmapDetailModal.removeAttribute('open');
    }
  });

  // Style Toggle Listener
  const styleToggleBtn = document.getElementById('style-toggle-btn');
  if (styleToggleBtn) {
    styleToggleBtn.addEventListener('click', () => {
      const isLight = document.body.classList.toggle('light-mode');
      if (isLight) {
        styleToggleBtn.innerHTML = 'Switch to Premium Dark 🌙';
      } else {
        styleToggleBtn.innerHTML = 'Switch to Premium Light ☀️';
      }
    });
  }

  // Initialize Dashboard Execution Flow Pipeline
  initAlphabetIndexGrid();
  runFilteringPipeline();
});
