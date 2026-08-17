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
    definition: 'The tendency for models to lose accuracy on tasks as context approaches its maximum length.',
    scopeNote: 'This is an anecdotal situation repeatedly observed across members of the industry. AI developers might handle context exhaustion, among other related context management issues, in their own ways, such as by pre-emptively compacting context.',
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
    definition: 'A composed capability that packages logic, tools, or sub-steps into a reusable unit.',
    relatedTerms: [],
    contrastsWith: ['Tool'],
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
    definition: 'Definition pending — term accepted; definition under working group discussion.',
    relatedTerms: [],
    contrastsWith: [],
    workgroups: ['Identity & Trust']
  },
  {
    term: 'Identifier',
    category: '',
    aliases: [],
    broaderTerm: null,
    definition: 'Definition pending — term accepted; definition under working group discussion.',
    relatedTerms: [],
    contrastsWith: [],
    workgroups: ['Identity & Trust']
  },
  {
    term: 'Attestation',
    category: '',
    aliases: [],
    broaderTerm: null,
    definition: 'Definition pending — term accepted; definition under working group discussion.',
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
    definition: 'Definition pending — term accepted; definition under working group discussion.',
    relatedTerms: [],
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
    definition: 'The explicit transfer of responsibility, execution context, state, or authority from one participant, Workflow, or execution unit to another.',
    relatedTerms: ['Delegation', 'Human in the loop'],
    contrastsWith: [],
    workgroups: ['Workflows & Process Integration', 'Observability & Traceability', 'Governance, Risk & Regulatory Alignment']
  },

  // ---------------------------------------------------------------------
  // Security & Privacy
  // ---------------------------------------------------------------------
  {
    term: 'Agent derailment',
    category: '',
    aliases: [],
    broaderTerm: null,
    definition: 'An unintended deviation in an Agent\'s behavior that causes it to pursue goals or take actions outside of its intended scope, without external cause.',
    scopeNote: 'Agent Derailment would happen either due to a mistake in the model or a lack of guardrails. Contrast with Agent Misuse/Mishandling/Sabotage, where deviations are caused by external parties',
    relatedTerms: [],
    contrastsWith: ['Agent misuse', 'Agent sabotage'],
    workgroups: ['Security & Privacy', 'Accuracy & Reliability']
  },
  {
    term: 'Agent misuse',
    category: '',
    aliases: ['Agent mishandling'],
    broaderTerm: null,
    definition: 'Deliberate manipulation of an Agent\'s behavior by an external party, causing it to act against its intended purpose.',
    scopeNote: 'This could be for pedestrian purposes (asking an airline chatbot to write a cookie recipe). Contrast with "agent sabotage", which is a kind of agent misuse with severe consequences.',
    relatedTerms: [],
    contrastsWith: ['Agent derailment', 'Agent sabotage'],
    workgroups: ['Security & Privacy']
  },
  {
    term: 'Agent sabotage',
    category: '',
    aliases: [],
    broaderTerm: null,
    definition: 'Agent misuse leading to severe or criminal consequences.',
    relatedTerms: [],
    contrastsWith: ['Agent misuse'],
    workgroups: ['Security & Privacy']
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
    definition: 'How independently an agent acts.',
    scopeNote: 'A tiered rating system. Used to decide how much oversight an agent needs. Relevant for risk classification.',
    relatedTerms: ['Risk classification'],
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
    definition: 'An out-of-band stop that instantly halts an agent by cutting its access, regardless of the agent\'s own logic.',
    relatedTerms: [],
    contrastsWith: ['Reversibility'],
    workgroups: ['Governance, Risk & Regulatory Alignment', 'Security & Privacy', 'Workflows & Process Integration']
  },
  {
    term: 'AI agent bill of materials',
    category: '',
    aliases: ['AI-BOM'],
    broaderTerm: null,
    definition: 'An inventory of an agent\'s models, tools, APIs, and third-party components, with provenance and versions.',
    relatedTerms: [],
    contrastsWith: [],
    workgroups: ['Governance, Risk & Regulatory Alignment']
  },
  {
    term: 'Reversibility',
    category: '',
    aliases: [],
    broaderTerm: null,
    definition: 'Whether and how an agent\'s action can be undone.',
    relatedTerms: [],
    contrastsWith: ['Kill switch'],
    workgroups: ['Governance, Risk & Regulatory Alignment', 'Workflows & Process Integration']
  }
];
