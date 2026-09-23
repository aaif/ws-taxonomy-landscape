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
    definition: 'The process by which a Workflow identifies candidate participants, capabilities, or tools that may be relevant to performing an Activity or advancing the Workflow toward its goal.',
    scopeNote: 'Discovery may use descriptions of the capabilities, registries, metadata, configuration, policies, or other mechanisms. It identifies candidate options and related  information, but does not by itself imply selection, authorization, trust, or invocation.',
    relatedTerms: [],
    contrastsWith: [],
    workgroups: ['Workflows & Process Integration', 'Identity & Trust']
  },
  {
    term: 'Handoff',
    category: '',
    aliases: ['Hand-off'],
    broaderTerm: null,
    definition: 'The transfer of responsibility for continuing execution from one participant to another.',
    scopeNote: 'A Handoff may occur at the level of an Activity, Workflow segment, or Workflow and may include the relevant State, Context, or other information needed to continue execution. A Handoff does not by itself imply transfer of authorization, accountability, or broader authority.',
    relatedTerms: [Delegation],
    contrastsWith: [],
    workgroups: ['Workflows & Process Integration', 'Observability & Traceability', 'Governance, Risk & Regulatory Alignment']
  },
   {
    term: 'Determinism',
    category: '',
    aliases: [],
    broaderTerm: null,
    definition: 'The property by which a Workflow Execution, or a specific layer or component within it, produces the same execution behavior given the same inputs, execution state and execution history.',
    scopeNote: 'Determinism may apply to the overall Workflow Execution or to a specific layer or component, such as Control Flow or an individual Activity. A Workflow may have deterministic Control Flow such as taking the same branch, selecting the same next Activity, or reaching the same synchronization point, while the containing Activities, particularly LLM-driven ones, whose outputs may vary across otherwise identical executions. This definition does not prescribe how Determinism is measured, scored, or evaluated.',
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
    definition: 'The stages through which an agentic system progresses from definition and configuration through operation, evaluation, adaptation and retirement.',
    scopeNote: 'Agentic Lifecycle refers to the lifecycle of the overall agentic system, rather than a single Agent or Workflow Execution. Its stages may repeat or occur in different orders.',
    relatedTerms: ["Agentic loop"],
    contrastsWith: [],
    workgroups: ['Workflows & Process Integration', 'Observability & Traceability']
  },
  {
    term: 'Activity',
    category: '',
    aliases: ['Task', 'Action'],
    broaderTerm: null,
    definition: ' A bounded unit of work performed as part of a Workflow, with defined or identifiable inputs, outputs, and execution outcome.',
    scopeNote: 'An Activity may be performed by an agent, human, tool, service, or other participant. It may consist of one or more lower-level steps or actions. Terms such as Task, Step, and Action may represent finer-grained or framework-specific units of work.',
    relatedTerms: [],
    contrastsWith: [],
    workgroups: ['Workflows & Process Integration']
  },
  {
    term: 'Agentic Workflow',
    category: '',
    aliases: ['Workflow'],
    broaderTerm: null,
    definition: 'A progression of Activities toward a goal in which one or more Agents participate in determining, sequencing, or performing work.',
    scopeNote: 'Agent participation may occur in only part of the Workflow and does not require every Activity to be performed by an Agent. An Agentic Workflow may also include humans, tools, services, or other participants.',
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
