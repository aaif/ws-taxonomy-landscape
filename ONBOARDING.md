# Taxonomy & Landscape Workstream Onboarding

Welcome to the Agentic AI Foundation (AAIF) Taxonomy & Landscape Workstream. This guide explains how the workstream relates to the AAIF Working Groups and how a proposed term moves from initial discussion to the official shared taxonomy.

## Why this is a workstream

The Taxonomy & Landscape group is a cross-working-group **workstream**, not a standalone Working Group (WG). Each WG has its own subject areas and may organize breakout groups to pursue its work. Those groups identify terms that need clear, shared definitions and send representatives—called **Domain Editors** in this repository—to shepherd the terms through the taxonomy process.

The workstream does not replace the WGs' subject-matter expertise. It provides a shared review and governance process so that AAIF terminology is consistent, useful across groups, and owned by the right WG.

## Working Group representatives

Each WG nominates representatives, called **Domain Editors**, to bring terms into the workstream, coordinate definition work with their WG, and participate in cross-WG review. The current representatives are:

| Working Group | Representatives |
| --- | --- |
| Accuracy & Reliability | Casper Nielsen ([@CasperGN](https://github.com/CasperGN)); Matthew Khouzam ([@MatthewKhouzam](https://github.com/MatthewKhouzam)) |
| Agentic Commerce | Leonardo Galesky ([@galesky-a](https://github.com/galesky-a)) |
| Governance, Risk & Regulatory Alignment | Amithash Kankanallu Jagadish ([@kjamithash](https://github.com/kjamithash)) |
| Identity & Trust | Julianna Mealin ([@julianna-ciq](https://github.com/julianna-ciq)) |
| Observability & Traceability | Pavan Sudheendra ([@91pavan](https://github.com/91pavan)); Matt Lee ([@mr-lee](https://github.com/mr-lee)) |
| Security & Privacy | Jautau White; Katherine Druckman |
| Workflows & Process Integration | Sumanth Sathyanarayana ([@mssumanth](https://github.com/mssumanth)) |

This roster was last updated on September 3, 2026. See the [historical running meeting notes](https://docs.google.com/document/d/1nn5dH89ao65hmRHjUD1rJUAd3rUIiIkrLLMkv-h-U3w/edit?tab=t.0) for earlier assignments, and update this section when a WG changes its representatives.

## The terminology lifecycle

### 1. Identify a candidate term

A WG or breakout group identifies a term that may need an AAIF definition. Its representative should be prepared to explain:

- why the term matters to agentic AI;
- how its agentic AI meaning differs from an established definition, if one exists;
- which WG should own the definition; and
- which other WGs use or are affected by the term.
Note: some terms are identified as "Universal", if its relevant to 3+ working groups.
### 2. Add it to the candidate spreadsheet

Add the term to the [Taxonomy Working Spreadsheet](https://docs.google.com/spreadsheets/d/1Oa-x7nBISIOuqaC-BnsQ1R-iPdwZ6Otk3dpWlqpI_z4/edit?gid=0#gid=0). The spreadsheet is the workstream's intake and decision log.

Workstream members review candidate terms asynchronously and add their feedback in new columns. Do not delete candidate rows. Record the outcome by marking each term with the appropriate status:

| Status | Meaning |
| --- | --- |
| **Debate** | The term still needs review or discussion. |
| **Keep** | The term qualifies for the shared taxonomy and can move to definition work. |
| **Cull** | The term does not qualify for the shared taxonomy. The row remains as a record of the decision. |

### 3. Decide whether the term qualifies

The workstream generally keeps terms that are specific to agentic AI or have a meaning in agentic AI that is materially different from their established use. Terms that name an AAIF Working Group are accepted by default and are owned by that WG.

Examples:

- **Red teaming — Cull.** This is an established security term, and applying it to AI systems does not make its meaning sufficiently different.
- **Guardrails — Keep.** The term has a distinct, AI-focused meaning relevant to agentic systems.
- **Trust — Keep.** It is part of the Identity & Trust WG's name, so it is accepted by default and owned by that WG.

The workstream also considers the broader [terminology acceptance criteria](CONTRIBUTING.md#5-terminology-acceptance-criteria--decision-making), including cross-WG relevance, technical clarity, neutrality, and uniqueness.

### 4. Draft and socialize the definition

After a term is marked **Keep**, the owning WG drafts its definition using its domain expertise. The WG should discuss and socialize the proposed wording internally before bringing it back to the workstream.

Definitions should be vendor-neutral, technically precise, and clear about the concept's boundaries. If a term resembles another concept but is intentionally distinct, preserve both terms and explain the contrast; do not merge or remove a term without the owning Domain Editor's written agreement.

### 5. Submit the definition in a pull request

Submit the socialized definition as a pull request to this repository. Follow the [contribution guide](CONTRIBUTING.md) and [taxonomy data schema](docs/data-schemas.md), and identify the owning WG and relevant Domain Editors in the pull request description.

The workstream reviews the proposed definition, resolves cross-WG concerns, and reaches rough consensus. A formal vote may be used when needed. After approval, a Workstream Chair merges the pull request, making the definition part of the official shared taxonomy.

## How to participate

- Review terms marked **Debate** in the candidate spreadsheet and add your comments in a new column.
- Bring candidate terms from your WG or breakout group to the spreadsheet.
- Help your WG draft and socialize definitions for terms it owns.
- Review definition pull requests, especially when they affect your WG's domain.
- Join the [weekly workstream meeting](README.md#meetings), [mailing list](https://lists.aaif.io/g/ws-taxonomy-landscape), or [Discord channel](https://discord.com/channels/1461090924791595243/1504201248025346110).

For repository setup and pull request instructions, see the [Local Development & Git Workflow Guide](docs/local-development.md).
