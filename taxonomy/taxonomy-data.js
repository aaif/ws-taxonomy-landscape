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
    term: 'Capability',
    category: '',
    aliases: [],
    broaderTerm: null,
    definition: 'The functions an agent is able to, and is authorized to, perform.',
    scopeNote: "Capabilities may be declared in an identity record, and would be matched to a requester's stated need during discovery.",
    relatedTerms: [],
    contrastsWith: [],
    workgroups: []
  },
  {
    term: 'Agent-to-agent',
    category: '',
    aliases: [],
    broaderTerm: null,
    definition: 'An interaction in which one agent communicates or coordinates with another agent.',
    scopeNote: 'This is a general term for interaction between agents and does not refer specifically to the Agent2Agent (A2A) protocol. The term does not distinguish between an agent communicating with a peer agent, subagent, or parent agent.',
    relatedTerms: [],
    contrastsWith: [],
    workgroups: []
  },
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
