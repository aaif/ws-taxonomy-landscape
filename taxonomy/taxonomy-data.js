/**
 * AAIF Taxonomy — glossary data (SKOS-Lite).
 *
 * See docs/data-schemas.md for field specifications.
 *
 * INITIAL CHECK-IN — PLEASE READ BEFORE EDITING:
 * `definition`, `category` and `broaderTerm` are intentionally deferred on
 * every entry below. This is a decision of the Taxonomy & Landscape
 * workstream, not an oversight, and not an invitation to fill them in.
 *
 *   - `definition`  — these terms have been accepted into the taxonomy, but
 *     their definitions have NOT been agreed. Definitions are debated
 *     separately, term by term, at the weekly workstream sync.
 *   - `category`    — deferred until enough of the taxonomy exists to
 *     categorise it meaningfully. Agreed 2026-07-27.
 *   - `broaderTerm` — the SKOS parent/hierarchy field. Deferred for the same
 *     reason; this pass is deliberately flat and top-level only.
 *
 * Please do not open PRs populating these fields ad hoc. Bring proposals to
 * the workstream sync (Mondays, 08:30 PST) or open an issue.
 */
window.AAIF_TAXONOMY = [
  // ---------------------------------------------------------------------
  // Universal
  //
  // `workgroups` is deliberately empty for Universal terms: the workstream
  // agreed on 2026-07-27 that "Universal" is not itself a working group.
  // Whether this field denotes the OWNING/shepherding group or all
  // INTERESTED groups is an open decision.
  // ---------------------------------------------------------------------
  {
    term: 'Harness',
    category: '',
    aliases: [],
    broaderTerm: null,
    definition: 'Definition pending — term accepted; definition under working group discussion.',
    relatedTerms: [],
    contrastsWith: [],
    workgroups: []
  },
  {
    term: 'Meta-harness',
    category: '',
    aliases: [],
    broaderTerm: null,
    definition: 'Definition pending — term accepted; definition under working group discussion.',
    relatedTerms: [],
    contrastsWith: [],
    workgroups: []
  },
  {
    term: 'Human curated',
    category: '',
    aliases: [],
    broaderTerm: null,
    definition: 'Definition pending — term accepted; definition under working group discussion.',
    relatedTerms: [],
    contrastsWith: [],
    workgroups: []
  },
  {
    term: 'Human in the loop',
    category: '',
    aliases: [],
    broaderTerm: null,
    definition: 'Definition pending — term accepted; definition under working group discussion.',
    relatedTerms: [],
    contrastsWith: [],
    workgroups: []
  },
  {
    term: 'Context exhaustion',
    category: '',
    aliases: [],
    broaderTerm: null,
    definition: 'Definition pending — term accepted; definition under working group discussion.',
    relatedTerms: [],
    contrastsWith: [],
    workgroups: []
  },
  {
    term: 'Intent',
    category: '',
    aliases: ['Intended purpose'],
    broaderTerm: null,
    definition: 'Definition pending — term accepted; definition under working group discussion.',
    relatedTerms: [],
    contrastsWith: [],
    workgroups: []
  },
  {
    term: 'Session',
    category: '',
    aliases: [],
    broaderTerm: null,
    definition: 'Definition pending — term accepted; definition under working group discussion.',
    relatedTerms: [],
    contrastsWith: [],
    workgroups: []
  },
  {
    term: 'Skill',
    category: '',
    aliases: [],
    broaderTerm: null,
    definition: 'Definition pending — term accepted; definition under working group discussion.',
    relatedTerms: [],
    contrastsWith: [],
    workgroups: []
  },

  // ---------------------------------------------------------------------
  // Identity & Trust
  // ---------------------------------------------------------------------
  {
    term: 'Trust',
    category: '',
    aliases: [],
    broaderTerm: null,
    definition: 'How and how much another party believes an agent\'s assertions, capabilities, and reasoning.',
    relatedTerms: [],
    contrastsWith: [],
    workgroups: ['Identity & Trust']
  },
  {
    term: 'Identifier',
    category: '',
    aliases: [],
    broaderTerm: null,
    definition: 'A unique and stable label or reference',
    scopeNote: 'Examples of identifiers include email address, username, account ID, public key. An identifier may represent the agent, the responsible or OBO party/parties, or other metadata.',
    relatedTerms: [],
    contrastsWith: [],
    workgroups: ['Identity & Trust']
  },
  {
    term: 'Attestation',
    category: '',
    aliases: [],
    broaderTerm: null,
    definition: 'A verifiable claim made by an entity about itself or another entity, system, event, property, or condition.',
    relatedTerms: [],
    contrastsWith: [],
    workgroups: ['Identity & Trust', 'Security & Privacy', 'Governance, Risk & Regulatory Alignment']
  },
  {
    // Ownership (Identity & Trust vs. Workflows) is still under debate;
    // this workgroups list is provisional.
    term: 'Delegation',
    category: '',
    aliases: [],
    broaderTerm: null,
    definition: 'The act of granting another entity authority to act on behalf of a user, organization, or system.',
    scopeNote: 'Subagents should operate under a delegation that traces back to an originating principal. A delegation may contain the scope of authority and available actions.',
    relatedTerms: ['Handoff'],
    contrastsWith: [],
    workgroups: ['Identity & Trust', 'Workflows & Process Integration', 'Observability & Traceability']
  },

  // ---------------------------------------------------------------------
  // Workflows & Process Integration
  // ---------------------------------------------------------------------
  {
    term: 'Discovery',
    category: '',
    aliases: ['Agent discovery'],
    broaderTerm: null,
    definition: 'Definition pending — term accepted; definition under working group discussion.',
    relatedTerms: [],
    contrastsWith: [],
    workgroups: ['Workflows & Process Integration', 'Identity & Trust']
  },
  {
    term: 'Handoff',
    category: '',
    aliases: ['Hand-off'],
    broaderTerm: null,
    definition: 'Definition pending — term accepted; definition under working group discussion.',
    relatedTerms: [],
    contrastsWith: [],
    workgroups: ['Workflows & Process Integration', 'Observability & Traceability', 'Governance, Risk & Regulatory Alignment']
  },

  // ---------------------------------------------------------------------
  // Governance, Risk & Regulatory Alignment
  // ---------------------------------------------------------------------
  {
    term: 'Governance',
    category: '',
    aliases: [],
    broaderTerm: null,
    definition: 'Definition pending — term accepted; definition under working group discussion.',
    relatedTerms: [],
    contrastsWith: [],
    workgroups: ['Governance, Risk & Regulatory Alignment']
  },
  {
    term: 'Autonomy level',
    category: '',
    aliases: [],
    broaderTerm: null,
    definition: 'Definition pending — term accepted; definition under working group discussion.',
    relatedTerms: [],
    contrastsWith: [],
    workgroups: ['Governance, Risk & Regulatory Alignment']
  },
  {
    term: 'Risk classification',
    category: '',
    aliases: [],
    broaderTerm: null,
    definition: 'Definition pending — term accepted; definition under working group discussion.',
    relatedTerms: [],
    contrastsWith: [],
    workgroups: ['Governance, Risk & Regulatory Alignment', 'Security & Privacy']
  },
  {
    term: 'Accountability',
    category: '',
    aliases: [],
    broaderTerm: null,
    definition: 'Definition pending — term accepted; definition under working group discussion.',
    relatedTerms: [],
    contrastsWith: [],
    workgroups: ['Governance, Risk & Regulatory Alignment', 'Identity & Trust', 'Observability & Traceability']
  },
  {
    term: 'Kill switch',
    category: '',
    aliases: [],
    broaderTerm: null,
    definition: 'Definition pending — term accepted; definition under working group discussion.',
    relatedTerms: [],
    contrastsWith: [],
    workgroups: ['Governance, Risk & Regulatory Alignment', 'Security & Privacy', 'Workflows & Process Integration']
  },
  {
    term: 'AI agent bill of materials',
    category: '',
    aliases: ['AI-BOM'],
    broaderTerm: null,
    definition: 'Definition pending — term accepted; definition under working group discussion.',
    relatedTerms: [],
    contrastsWith: [],
    workgroups: ['Governance, Risk & Regulatory Alignment']
  },
  {
    term: 'Reversibility',
    category: '',
    aliases: [],
    broaderTerm: null,
    definition: 'Definition pending — term accepted; definition under working group discussion.',
    relatedTerms: [],
    contrastsWith: [],
    workgroups: ['Governance, Risk & Regulatory Alignment', 'Workflows & Process Integration']
  }
];
