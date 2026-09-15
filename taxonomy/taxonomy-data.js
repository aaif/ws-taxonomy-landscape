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
    relatedTerms: ['Meta-harness'],
    contrastsWith: [],
    workgroups: []
  },
  {
    term: 'Meta-harness',
    category: '',
    aliases: [],
    broaderTerm: null,
    definition: 'A meta-harness is the software control layer that builds, selects, configures, or supervises harnesses themselves.',
    scopeNote: 'Where a harness runs one agent\'s loop, a meta-harness answers "which harness (tools, prompts, model, control flow) should be assembled for this task, and how do multiple agents/harnesses coordinate." The scope of the meta-harness is the full path from initial input to final outcome, which may include non-agentic models and services such as speech, vision, image, audio, video, and OCR, along with supporting libraries and deterministic workflow code. Observability marks the sharpest distinction. Harness-level observability is intra-agent: the trace of a single run, built to debug one agent\'s behavior at one step. Meta-harness-level observability spans agents, non-agentic stages, and runs, answering what no single harness\'s logs can, such as which configuration performs better, where failures cluster, how one stage\'s output shaped another\'s input, and whether a change improved outcomes system-wide.',
    relatedTerms: ['Harness'],
    contrastsWith: [],
    workgroups: []
  },
  {
    term: 'Human curated',
    category: '',
    aliases: [],
    broaderTerm: null,
    definition: 'Agentic output that a human was involved in reviewing, modifying, or enhancing.',
    scopeNote: 'This is an assurance to other humans that the content is worth consuming - namely, that it isn\'t \'AI slop\'.',
    relatedTerms: [],
    contrastsWith: [],
    workgroups: []
  },
  {
    term: 'Human in the loop',
    category: '',
    aliases: [],
    broaderTerm: null,
    definition: 'An agentic workflow that includes a human-required step.',
    scopeNote: 'A design pattern in which a human must review, approve, or intervene in an AI agent\'s actions at defined checkpoints before the agent may proceed. Contrasts with Human *on* the Loop - HOTL allows for optional human action, whereas HITL *requires* human action. Compare with Handoff - a subtype (agent -> human -> agent), as opposed to other subtypes of hand-offs like Agent-to-agent delegation.',
    relatedTerms: ["Handoff"],
    contrastsWith: ["Human on the loop"],
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
    definition: 'How and to what extent another party believes an agent\'s assertions, capabilities, and reasoning.',
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
    scopeNote: 'Examples of identifiers include email address, username, account ID, public key. An identifier may represent the agent, the responsible or OBO party/parties, or other metadata. The identifier should be unique within the scope of its use.',
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
    scopeNote: 'Subagents should operate under a delegation that traces back to an originating principal. A delegation may contain the scope of authority and available actions. 'Delegation' is a subtype of handoff.',
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
