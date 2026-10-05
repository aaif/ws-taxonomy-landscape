<!--
  GENERATED FILE — DO NOT EDIT DIRECTLY.
  Edit taxonomy/taxonomy-data.js and run:
  node tools/generate-taxonomy-markdown.mjs
-->

# AAIF Taxonomy Reference

This human-readable reference is generated from [`taxonomy-data.js`](./taxonomy-data.js).

<a id="category-universal"></a>
## Universal

<a id="term-context-exhaustion"></a>
### [Context exhaustion](#term-context-exhaustion)

<a id="term-harness"></a>
### [Harness](#term-harness)

<table>
  <tbody>
    <tr><th scope="row">Definition</th><td>A harness is the software control layer that sits between an AI model and the external world, enabling it to execute a breadth of complex tasks.</td></tr>
    <tr><th scope="row">Scope note</th><td>In a traditional pipeline, a harness might just be a thin layer for sanitizing inputs and outputs. In an agentic workflow, the harness manages: Control Flow (orchestrating the loop and stopping conditions); Environment Access (connections to tools, APIs, and browsers); State &amp; Memory (persisting context across turns); Input/Output Shaping (prompt templates and parsing); and Observability (logging and evals). Ultimately, the harness restrains, coordinates, and empowers a foundational model to operate effectively within a specific system.</td></tr>
    <tr><th scope="row">Related terms</th><td><a href="#term-meta-harness">Meta-harness</a></td></tr>
  </tbody>
</table>

<a id="term-human-curated"></a>
### [Human curated](#term-human-curated)

<table>
  <tbody>
    <tr><th scope="row">Definition</th><td>Agentic output that a human was involved in reviewing, modifying, or enhancing.</td></tr>
    <tr><th scope="row">Scope note</th><td>This is an assurance to other humans that the content is worth consuming - namely, that it isn't 'AI slop'.</td></tr>
  </tbody>
</table>

<a id="term-human-in-the-loop"></a>
### [Human in the loop](#term-human-in-the-loop)

<table>
  <tbody>
    <tr><th scope="row">Definition</th><td>An agentic workflow that includes a human-required step.</td></tr>
    <tr><th scope="row">Scope note</th><td>A design pattern in which a human must review, approve, or intervene in an AI agent's actions at defined checkpoints before the agent may proceed. Contrasts with Human *on* the Loop - HOTL allows for optional human action, whereas HITL *requires* human action. Compare with Handoff - a subtype (agent -&gt; human -&gt; agent), as opposed to other subtypes of hand-offs like Agent-to-agent delegation.</td></tr>
    <tr><th scope="row">Related terms</th><td><a href="#term-handoff">Handoff</a></td></tr>
    <tr><th scope="row">Contrasts with</th><td>Human on the loop</td></tr>
  </tbody>
</table>

<a id="term-intent"></a>
### [Intent](#term-intent)

<table>
  <tbody>
    <tr><th scope="row">Aliases</th><td>Intended purpose</td></tr>
  </tbody>
</table>

<a id="term-meta-harness"></a>
### [Meta-harness](#term-meta-harness)

<table>
  <tbody>
    <tr><th scope="row">Definition</th><td>A meta-harness is the software control layer that builds, selects, configures, or supervises harnesses themselves.</td></tr>
    <tr><th scope="row">Scope note</th><td>Where a harness runs one agent's loop, a meta-harness answers &quot;which harness (tools, prompts, model, control flow) should be assembled for this task, and how do multiple agents/harnesses coordinate.&quot; The scope of the meta-harness is the full path from initial input to final outcome, which may include non-agentic models and services such as speech, vision, image, audio, video, and OCR, along with supporting libraries and deterministic workflow code. Observability marks the sharpest distinction. Harness-level observability is intra-agent: the trace of a single run, built to debug one agent's behavior at one step. Meta-harness-level observability spans agents, non-agentic stages, and runs, answering what no single harness's logs can, such as which configuration performs better, where failures cluster, how one stage's output shaped another's input, and whether a change improved outcomes system-wide.</td></tr>
    <tr><th scope="row">Related terms</th><td><a href="#term-harness">Harness</a></td></tr>
  </tbody>
</table>

<a id="term-reasoning"></a>
### [Reasoning](#term-reasoning)

<table>
  <tbody>
    <tr><th scope="row">Definition</th><td>The process by which an agent interprets information, evaluates options, draws conclusions, or decides what to do next.</td></tr>
  </tbody>
</table>

<a id="term-session"></a>
### [Session](#term-session)

<a id="term-skill"></a>
### [Skill](#term-skill)

<a id="term-subagent"></a>
### [Subagent](#term-subagent)

<table>
  <tbody>
    <tr><th scope="row">Definition</th><td>An agent spawned by an existing agent</td></tr>
    <tr><th scope="row">Scope note</th><td>For example, an Audit Subagent for credential checks, a Policy Subagent for real-time compliance rules, a Pricing Subagent, or a Contract Subagent; each operates in a way that traces back to the originating principal. Subagents may have a variety of properties, including authentication, identity, accessibility by entities beyond the parent agent, operating environments, and permissions. None of these properties is implied by being a subagent.</td></tr>
    <tr><th scope="row">Aliases</th><td>child agent</td></tr>
    <tr><th scope="row">Related terms</th><td>Agent</td></tr>
  </tbody>
</table>

<a id="category-accuracy-and-reliability"></a>
## Accuracy & Reliability

_No terms are currently assigned to this category._

<a id="category-agentic-commerce"></a>
## Agentic Commerce

<a id="term-agent-completed-transaction"></a>
### [Agent-completed transaction](#term-agent-completed-transaction)

<a id="term-agent-initiated-transaction"></a>
### [Agent-initiated transaction](#term-agent-initiated-transaction)

<a id="term-agent-mediated-transaction"></a>
### [Agent-mediated transaction](#term-agent-mediated-transaction)

<a id="term-agentic-checkout"></a>
### [Agentic checkout](#term-agentic-checkout)

<a id="term-agentic-commerce"></a>
### [Agentic commerce](#term-agentic-commerce)

<a id="term-agentic-commerce-protocol"></a>
### [Agentic commerce protocol](#term-agentic-commerce-protocol)

<a id="term-delegated-payment"></a>
### [Delegated payment](#term-delegated-payment)

<a id="term-mandate"></a>
### [Mandate](#term-mandate)

<a id="category-governance-risk-and-regulatory-alignment"></a>
## Governance, Risk & Regulatory Alignment

<a id="term-accountability"></a>
### [Accountability](#term-accountability)

<table>
  <tbody>
    <tr><th scope="row">Workgroups</th><td><a href="#category-identity-and-trust">Identity &amp; Trust</a><br><a href="#category-observability-and-traceability">Observability &amp; Traceability</a></td></tr>
  </tbody>
</table>

<a id="term-ai-agent-bill-of-materials"></a>
### [AI agent bill of materials](#term-ai-agent-bill-of-materials)

<table>
  <tbody>
    <tr><th scope="row">Aliases</th><td>AI-BOM</td></tr>
  </tbody>
</table>

<a id="term-autonomy-level"></a>
### [Autonomy level](#term-autonomy-level)

<a id="term-governance"></a>
### [Governance](#term-governance)

<a id="term-kill-switch"></a>
### [Kill switch](#term-kill-switch)

<table>
  <tbody>
    <tr><th scope="row">Workgroups</th><td><a href="#category-security-and-privacy">Security &amp; Privacy</a><br><a href="#category-workflows-and-process-integration">Workflows &amp; Process Integration</a></td></tr>
  </tbody>
</table>

<a id="term-reversibility"></a>
### [Reversibility](#term-reversibility)

<table>
  <tbody>
    <tr><th scope="row">Workgroups</th><td><a href="#category-workflows-and-process-integration">Workflows &amp; Process Integration</a></td></tr>
  </tbody>
</table>

<a id="term-risk-classification"></a>
### [Risk classification](#term-risk-classification)

<table>
  <tbody>
    <tr><th scope="row">Workgroups</th><td><a href="#category-security-and-privacy">Security &amp; Privacy</a></td></tr>
  </tbody>
</table>

<a id="category-identity-and-trust"></a>
## Identity & Trust

<a id="term-attestation"></a>
### [Attestation](#term-attestation)

<table>
  <tbody>
    <tr><th scope="row">Definition</th><td>A verifiable claim made by an entity about itself or another entity, system, event, property, or condition.</td></tr>
    <tr><th scope="row">Workgroups</th><td><a href="#category-governance-risk-and-regulatory-alignment">Governance, Risk &amp; Regulatory Alignment</a><br><a href="#category-security-and-privacy">Security &amp; Privacy</a></td></tr>
  </tbody>
</table>

<a id="term-delegation"></a>
### [Delegation](#term-delegation)

<table>
  <tbody>
    <tr><th scope="row">Definition</th><td>The act of granting another entity authority to act on behalf of a user, organization, or system.</td></tr>
    <tr><th scope="row">Scope note</th><td>Subagents should operate under a delegation that traces back to an originating principal. A delegation may contain the scope of authority and available actions. 'Delegation' is a subtype of handoff.</td></tr>
    <tr><th scope="row">Related terms</th><td><a href="#term-handoff">Handoff</a></td></tr>
    <tr><th scope="row">Workgroups</th><td><a href="#category-observability-and-traceability">Observability &amp; Traceability</a><br><a href="#category-workflows-and-process-integration">Workflows &amp; Process Integration</a></td></tr>
  </tbody>
</table>

<a id="term-identifier"></a>
### [Identifier](#term-identifier)

<table>
  <tbody>
    <tr><th scope="row">Definition</th><td>A unique and stable label or reference</td></tr>
    <tr><th scope="row">Scope note</th><td>Examples of identifiers include email address, username, account ID, public key. An identifier may represent the agent, the responsible or OBO party/parties, or other metadata. The identifier should be unique within the scope of its use.</td></tr>
  </tbody>
</table>

<a id="term-trust"></a>
### [Trust](#term-trust)

<table>
  <tbody>
    <tr><th scope="row">Definition</th><td>How and to what extent another party believes an agent's assertions, capabilities, and reasoning.</td></tr>
  </tbody>
</table>

<a id="category-observability-and-traceability"></a>
## Observability & Traceability

<a id="term-agent-trajectory"></a>
### [Agent trajectory](#term-agent-trajectory)

<table>
  <tbody>
    <tr><th scope="row">Definition</th><td>The observable path an agent could take or has taken through a task or conversation across invocations, steps, handoffs, checkpoints, and outcomes.</td></tr>
    <tr><th scope="row">Related terms</th><td><a href="#term-handoff">Handoff</a>, <a href="#term-traceability">Traceability</a></td></tr>
    <tr><th scope="row">Workgroups</th><td><a href="#category-accuracy-and-reliability">Accuracy &amp; Reliability</a><br><a href="#category-workflows-and-process-integration">Workflows &amp; Process Integration</a></td></tr>
  </tbody>
</table>

<a id="term-context-assembly"></a>
### [Context assembly](#term-context-assembly)

<table>
  <tbody>
    <tr><th scope="row">Definition</th><td>The process by which candidate information is selected, compacted, dropped, or placed into working context.</td></tr>
    <tr><th scope="row">Related terms</th><td><a href="#term-context-propagation">Context propagation</a>, <a href="#term-memory-access">Memory access</a>, <a href="#term-retrieval">Retrieval</a></td></tr>
    <tr><th scope="row">Workgroups</th><td><a href="#category-workflows-and-process-integration">Workflows &amp; Process Integration</a></td></tr>
  </tbody>
</table>

<a id="term-context-propagation"></a>
### [Context propagation](#term-context-propagation)

<table>
  <tbody>
    <tr><th scope="row">Definition</th><td>The carrying of trace, correlation, or execution context across protocol, tool, agent, or workflow boundaries.</td></tr>
    <tr><th scope="row">Related terms</th><td><a href="#term-context-assembly">Context assembly</a>, <a href="#term-handoff">Handoff</a></td></tr>
    <tr><th scope="row">Workgroups</th><td><a href="#category-security-and-privacy">Security &amp; Privacy</a><br><a href="#category-workflows-and-process-integration">Workflows &amp; Process Integration</a></td></tr>
  </tbody>
</table>

<a id="term-memory-access"></a>
### [Memory access](#term-memory-access)

<table>
  <tbody>
    <tr><th scope="row">Definition</th><td>Observable read, write, update, or search activity against agent-accessible memory.</td></tr>
    <tr><th scope="row">Related terms</th><td><a href="#term-context-assembly">Context assembly</a></td></tr>
    <tr><th scope="row">Workgroups</th><td><a href="#category-workflows-and-process-integration">Workflows &amp; Process Integration</a></td></tr>
  </tbody>
</table>

<a id="term-retrieval"></a>
### [Retrieval](#term-retrieval)

<table>
  <tbody>
    <tr><th scope="row">Definition</th><td>A request to a generative AI service or framework that retrieves relevant information or context from a search system or other retrieval source.</td></tr>
    <tr><th scope="row">Related terms</th><td><a href="#term-context-assembly">Context assembly</a></td></tr>
    <tr><th scope="row">Workgroups</th><td><a href="#category-workflows-and-process-integration">Workflows &amp; Process Integration</a></td></tr>
  </tbody>
</table>

<a id="term-traceability"></a>
### [Traceability](#term-traceability)

<table>
  <tbody>
    <tr><th scope="row">Definition</th><td>The ability to track, observe, and understand how AI agents behave as they carry out tasks within a workflow.</td></tr>
    <tr><th scope="row">Related terms</th><td><a href="#term-agent-trajectory">Agent trajectory</a></td></tr>
  </tbody>
</table>

<a id="category-security-and-privacy"></a>
## Security & Privacy

_No terms are currently assigned to this category._

<a id="category-workflows-and-process-integration"></a>
## Workflows & Process Integration

<a id="term-discovery"></a>
### [Discovery](#term-discovery)

<table>
  <tbody>
    <tr><th scope="row">Aliases</th><td>Agent discovery</td></tr>
    <tr><th scope="row">Workgroups</th><td><a href="#category-identity-and-trust">Identity &amp; Trust</a></td></tr>
  </tbody>
</table>

<a id="term-handoff"></a>
### [Handoff](#term-handoff)

<table>
  <tbody>
    <tr><th scope="row">Aliases</th><td>Hand-off</td></tr>
    <tr><th scope="row">Related terms</th><td><a href="#term-agent-trajectory">Agent trajectory</a>, <a href="#term-context-propagation">Context propagation</a></td></tr>
    <tr><th scope="row">Workgroups</th><td><a href="#category-governance-risk-and-regulatory-alignment">Governance, Risk &amp; Regulatory Alignment</a><br><a href="#category-observability-and-traceability">Observability &amp; Traceability</a></td></tr>
  </tbody>
</table>
