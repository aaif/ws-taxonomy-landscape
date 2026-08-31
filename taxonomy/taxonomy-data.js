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
    definition: 'A harness is the software control layer that sits between an AI model and the external world, enabling it to execute a breadth of complex tasks.',
    scopeNote: 'In a traditional pipeline, a harness might just be a thin layer for sanitizing inputs and outputs. In an agentic workflow, the harness manages: Control Flow (orchestrating the loop and stopping conditions); Environment Access (connections to tools, APIs, and browsers); State & Memory (persisting context across turns); Input/Output Shaping (prompt templates and parsing); and Observability (logging and evals). Ultimately, the harness restrains, coordinates, and empowers a foundational model to operate effectively within a specific system.',
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
    definition: 'The process by which a Workflow, or a participant acting on its behalf, identifies candidate participants, capabilities, tools, resources, or services that may be relevant to performing an Activity or progressing the Workflow toward its goal. Discovery may use capability descriptions, registries, metadata, configuration, policies, or other mechanisms. It produces a set of candidate options and associated descriptive information, but it does not by itself imply selection, authorization, trust, or invocation.',
    relatedTerms: [],
    contrastsWith: [],
    workgroups: ['Workflows & Process Integration', 'Identity & Trust']
  },
  {
    term: 'Handoff',
    category: '',
    aliases: ['Hand-off'],
    broaderTerm: null,
    definition: 'The transfer of responsibility for continuing an Activity, Workflow segment, or Workflow from one participant to another, together with the relevant State, Context, or information needed to continue execution. A Handoff concerns continuation of work. It does not by itself imply transfer of authorization, accountability, or broader authority.',
    relatedTerms: [Delegation],
    contrastsWith: [],
    workgroups: ['Workflows & Process Integration', 'Observability & Traceability', 'Governance, Risk & Regulatory Alignment']
  },
   {
    term: 'Determinism',
    category: '',
    aliases: [],
    broaderTerm: null,
    definition: 'The property of a component or execution step such that, given the same relevant inputs and initial state, it produces the same execution behavior and observable result.',
    relatedTerms: ['Deterministic', 'Non-deterministic'],
    contrastsWith: [],
    workgroups: ['Workflows & Process Integration', 'Observability & Traceability', 'Accuracy & Reliability']
  },
  {
    term: 'Orchestration',
    category: '',
    aliases: [],
    broaderTerm: null,
    definition: 'A coordination pattern in which a designated orchestrator directs Activities, manages their sequencing, and determines subsequent actions based on Workflow State and results.',
    relatedTerms: ['Orchestrator', 'Choreography'],
    contrastsWith: [],
    workgroups: ['Workflows & Process Integration', 'Observability & Traceability']
  },
  {
    term: 'Agentic Lifecycle',
    category: '',
    aliases: ['Lifecycle'],
    broaderTerm: null,
    definition: 'The stages through which an agentic system progresses from definition and configuration through operation to evaluation, adaptation, suspension, or retirement.',
    relatedTerms: [],
    contrastsWith: [],
    workgroups: ['Workflows & Process Integration', 'Observability & Traceability']
  },
  {
    term: 'Activity',
    category: '',
    aliases: ['Task', 'Action'],
    broaderTerm: null,
    definition: ' A bounded unit of work performed as part of a Workflow, with defined or identifiable inputs, outputs, and execution outcome. An Activity may be performed by an agent, human, tool, service, or other participant.',
    relatedTerms: [],
    contrastsWith: [],
    workgroups: ['Workflows & Process Integration']
  },
  {
    term: 'Agentic Workflow',
    category: '',
    aliases: ['Workflow'],
    broaderTerm: null,
    definition: 'A coordinated progression of Activities toward a defined goal or outcome in which one or more Agents participate in determining, sequencing, selecting, or performing work.',
    relatedTerms: [],
    contrastsWith: [],
    workgroups: ['Workflows & Process Integration']
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
