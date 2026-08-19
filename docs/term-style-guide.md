# Term Style Guide

This guide explains how to draft candidate taxonomy terms, one-line disambiguators, and later full definitions for the AAIF Taxonomy and Landscape Workstream.

Use it with:

- `CONTRIBUTING.md`
- `docs/data-schemas.md`
- `taxonomy/taxonomy-data.js`

## Purpose

The taxonomy is a shared index across working groups. It should help readers understand how terms relate without erasing working-group-specific meaning.

Good taxonomy writing is:

- vendor-neutral
- pre-competitive
- clear enough for non-specialists
- precise enough for technical review
- careful about look-alike terms
- explicit when a term contrasts with another term

## Candidate term checklist

Before submitting a candidate term, check:

- [ ] The term is relevant to at least two AAIF working groups or is foundational to the AAIF ecosystem.
- [ ] The term is written in sentence case.
- [ ] The term does not include vendor, product, or marketing language.
- [ ] The one-line disambiguator explains what makes the term different from nearby concepts.
- [ ] Similar existing terms were checked before proposing a new row.
- [ ] If the term is a synonym, it is proposed as an alias instead of a new concept.
- [ ] If the term is adjacent but distinct, the distinction is stated plainly.

## Term formatting

Use sentence case:

- Good: `Agent behavior trace`
- Good: `Human approval checkpoint`
- Avoid: `Agent Behavior Trace`
- Avoid: `Enterprise-Grade Agent Observability`

Capitalize proper nouns and acronyms:

- `MCP server`
- `OpenTelemetry span`
- `W3C Trace Context`

Avoid overloaded punctuation unless the punctuation is part of a known name.

## One-line disambiguators

Early collection asks for one short line per term. This is a disambiguator, not a full definition.

Use this shape:

```text
Term - one short line that says what makes this concept distinct.
```

Examples:

```text
Agent behavior trace - an observable record of agent actions, decisions, tool use, and outcomes across a session or task.
Human approval checkpoint - a traceable point where execution pauses until a human approves, rejects, or escalates an action.
Tool invocation - a recorded agent request to an external capability, including intent, target, result, and side-effect class.
```

Keep the line short enough that it can fit in a whiteboard table and still be reviewed across working groups.

## Full definition shape

When a term moves from candidate collection into the repository taxonomy data, use this shape:

1. Name the concept.
2. State what boundary it covers.
3. Explain what it is not, if confusion is likely.
4. Keep implementation examples out of the core definition.
5. Put historical or review context in `scopeNote`.

Example pattern:

```text
An agent behavior trace is a structured record of observable agent activity across a session, task, or workflow. It captures events such as tool invocation, delegation, approval, outcome, and side-effect metadata. It differs from an LLM-call trace, which records model invocation details rather than the higher-level behavior of an agent system.
```

## Aliases

Use aliases for true synonyms, spelling variants, and historical names.

Use an alias when:

- the terms mean the same thing in the taxonomy context
- one term is a common abbreviation
- a term changed name but the concept did not change

Do not use an alias when:

- two working groups intentionally use similar terms differently
- one term is a subtype of the other
- the relationship is contrast rather than synonymy

When in doubt, preserve both terms and ask for working-group review.

## Related and contrasting terms

Use `relatedTerms` for adjacent concepts that should be discoverable together.

Use `contrastsWith` when two terms are commonly confused but represent different concepts.

Examples:

| Term | Contrast | Reason |
| --- | --- | --- |
| `Agentic workflow` | `Deterministic workflow` | One adapts through agent decisions; the other follows predefined control flow. |
| `Tool invocation` | `Protocol message` | One describes a capability request; the other describes a transport or protocol exchange. |
| `Approval checkpoint` | `Policy decision` | One is a human or workflow pause point; the other is a machine-evaluated decision result. |

Definitions should state the distinction directly instead of relying only on metadata.

## Scope notes

Use `scopeNote` for:

- working-group context
- review dates
- known boundary debates
- why a look-alike term was preserved
- links to relevant issues or pull requests

Do not put the main definition only in `scopeNote`. The `definition` field should stand on its own.

## Category selection

Use the approved categories from `docs/data-schemas.md`.

Choose the primary category by asking:

- Is this mainly a risk or failure mode? Use `Agentic Threats`.
- Is this mainly about authentication, authorization, identity, or access? Use `Identity & Authorization`.
- Is this mainly about runtime, deployment, trace, workflow, or system structure? Use `Infrastructure & Architecture`.
- Is this mainly about what agents, tools, protocols, or interfaces can do? Use `Capabilities & Interfaces`.
- Is this mainly about oversight, policy, compliance, or process? Use `Governance & Compliance`.

If more than one category seems plausible, choose the most useful navigation home and capture related concepts through `relatedTerms`, `contrastsWith`, or `workgroups`.

## Workgroup attribution

Use `workgroups` to show shared interest, not ownership by assertion.

List a working group when:

- the term affects that working group's deliverables
- the working group contributed or reviewed the term
- the term creates an explicit boundary with that working group's domain

Do not list a working group only to increase visibility.

## Writing anti-patterns

Avoid:

- marketing adjectives such as "best", "leading", "revolutionary", or "enterprise-grade"
- vendor-specific framing unless the term itself is a proper noun
- definitions that prescribe an implementation
- merging look-alike terms without working-group sign-off
- full technical essays in the one-line disambiguator field
- security, legal, or compliance claims without review from the relevant working group

## Review questions

Reviewers can use these questions:

- Is the term scoped to a shared taxonomy rather than a single implementation?
- Would another working group understand the term without private context?
- Does the disambiguator distinguish the term from similar concepts?
- Are aliases true synonyms?
- Are related and contrasting terms explicit?
- Is the definition neutral and pre-competitive?
- Does the entry avoid vendor or product promotion?
