# AAIF Taxonomy & Landscape Workstream Charter

**Chairs:** Junjie Bu (Google) – Chair | Gala Malbasic (Bloomberg) – Co-Chair  
**Meeting Cadence:** Weekly on Monday at 8:30 AM PT / 11:30 AM ET / 4:30 PM BST (duration: 30 minutes)  
**Communication Channels:** Mailing List (`ws-taxonomy-landscape@lists.aaif.io`), Discord (`#ws-taxonomy-landscape`), GitHub (`aaif/ws-taxonomy-landscape`)  

---

## 1. Purpose & Mission

### Mission Statement
The Taxonomy & Landscape Workstream curates and maintains a glossary of agentic AI terms (the Taxonomy) and an ecosystem map (the Landscape) for the AAIF, so every Working Group can work from the same definitions and one view of the ecosystem.

### Why This Workstream Exists
1. **Eliminating Siloed Terminology:** Working Groups (WGs) operate in specialized domains. Without a shared taxonomy, conflicting definitions (e.g., differing interpretations of *Agent*, *Attestation*, or *Autonomy*) create friction and integration complexity.
2. **Preventing Duplicate Ecosystem Research:** Multiple WGs duplicate effort surveying the same platforms, tools, and compliance regimes (e.g., both Security WG and Governance WG tracking compliance monitors).
3. **Providing an Enterprise Blueprint:** Enterprise CTOs and CIOs require a single, consolidated, authoritative guide to navigate the fragmented Agentic AI technology stack, rather than maintaining isolated spreadsheets from different Working Groups.

### Foundation Alignment
Supports the foundation's core pillars of **Interoperability**, **Ecosystem Transparency**, and **Engineering Excellence** by uniting the outputs of all working groups into cohesive, publicly accessible web assets.

## 2. Scope

### Iterative Curation & Boundary Evolution
Rather than pre-defining hardcoded taxonomy partitions or landscape buckets upfront in the charter, the workstream determines its architectural boundaries and categorization schemas iteratively through cross-workgroup delegate consensus. The taxonomy and landscape evolve dynamically alongside the working groups as new terms and ecosystem platforms emerge.

### Scope Guardrail (Shared vs. Specialized)
* **Horizontal Curation:** The workstream focuses on consolidating cross-cutting concepts and maintaining the foundation-wide ecosystem map.
* **Vertical Ownership:** Specialized domain whitepapers, low-level technical helper definitions, and execution protocol designs remain the exclusive purview of their respective vertical Technical Working Groups.

### Scope Overlap & Conflict Prevention Policy
1. **Federated Governance:** Curation is actively driven by nominated delegates (**Domain Editors**) representing each WG, ensuring no shared definitions or landscape modifications occur in isolation.
2. **Consolidation over Creation:** The workstream ingests and reconciles glossaries supplied by the WGs rather than authoring domain-specific definitions from scratch.
3. **Iterative Ratification:** Categorization schemas and conceptual boundaries evolve iteratively; delegates hold the ongoing mandate to refine and ratify these boundaries via consensus.

### In Scope
*   **Technical Taxonomy & Glossary Consolidation:** Curating and standardizing core vocabulary terms using a flexible SKOS-Lite metadata schema (`prefLabel`, `altLabel`, `broaderTerm`, `scopeNote`, `relatedTerms`, `contrastsWith`).
*   **Global Ecosystem Architecture Map Curation:** Maintaining a living, interactive CNCF-style landscape (`landscape.yml`) whose categorization buckets evolve through delegate consensus.

*   **Cross-WG Terminology Arbitration:** Serving as the technical gatekeeper and collaborative peer-review forum for resolving cross-cutting terminology intersections.
*   **Automated Web Dashboard Publishing:** Maintaining the CI/CD pipelines that deploy the interactive Shared Taxonomy Explorer and Landscape Map web applications.

### Out of Scope
*   **Authoring Vertical Domain Reports:** We do not write deep-dive legal compliance whitepapers or domain-specific specifications (e.g., narrative regulatory analyses belong to WG7 Governance).
*   **Core Protocol Design:** We do not define execution protocols (e.g., MCP or A2A specifications belong to their respective WGs).
*   **Proprietary Commercial Portals:** We do not build closed commercial enterprise landscape platforms.

### Assumptions & Dependencies
*   **Assumptions:** Assumes each WG Chair will nominate 2 active delegates to participate in weekly synchronization and asynchronous PR reviews.
*   **Dependencies:** Depends on all WGs providing their baseline glossaries, vendor tool inventories, and regional policy tracking data.

## 3. Goals & Deliverables

### 3–6 Month Goals
*   **Consolidate Baseline Terminology:** Ingest and de-duplicate existing glossaries from all WGs into a unified SKOS-Lite data repository (`taxonomy-data.js`).
*   **Launch Master Web Portal:** Deploy the fully interactive Shared Taxonomy Explorer and CNCF Landscape 2 instances to GitHub Pages (`https://aaif.github.io/ws-taxonomy-landscape/`) or (`https://taxonomy.github.io/` and `https://landscapt.github.io/`).
*   **Establish Delegate Governance:** Operationalize the weekly cross-WG delegate sync to review pull requests and resolve terminology intersections.

### Planned Deliverables
| Deliverable Name | Format | Target Date |
| :--- | :--- | :--- |
| **Shared Taxonomy Explorer (v1.0)** | `taxonomy-data.js` + Web App | 2026-08-15 |
| **Ecosystem Architecture Map (v1.0)** | `landscape.yml` + Web App (Landscape 2) | 2026-10-15 |
| **Cross-WG Terminology Arbitration Guide** | Governance Documentation | 2026-08-15 |

**Definition of Done:** Reviewed by WG delegates, approved by rough consensus/voting, merged into the official GitHub repository, and published to AAIF web properties.

## 4. Working Methods

### Operating Model
*   **Consensus-Driven:** Chair-led consensus; formal voting as fallback per AAIF bylaws.
*   **Work Tracking:** All issues, tasks, and pull requests are tracked in the `aaif/ws-taxonomy-landscape` GitHub repository.

### Meetings
*   **Cadence:** Weekly (Please see the meeting time in the header).
*   **Duration:** 30 minutes.
*   **Minutes & Recordings:** Stored in the LFX Member Portal and GitHub repository.

### Communication Channels
*   **Asynchronous:** Mailing List (`ws-taxonomy-landscape@lists.aaif.io`), Discord (`#ws-taxonomy-landscape`), GitHub PRs/Issues.
*   **Synchronous:** Zoom (calendar invite provided to registered delegates).

## 5. Membership & Governance

### Who Can Participate
Open to all individuals and organizations consistent with foundation policies. We require 2 nominated delegates from each of the Technical Working Groups.

### Leadership Structure
*   **Chair:** Junjie Bu (Google)
*   **Co-Chair:** Gala Malbasic (Bloomberg)
*   **Term:** 12 months, elected by working group chairs.

### Decision Process & Escalation
*   **Default:** Rough consensus documented in GitHub issues and meeting minutes.
*   **Escalation Path:** AAIF Technical Steering Committee (TSC) / Foundation CTO (Manik).
*   **Quorum:** 50% of active nominated delegates.

## 6. Security, Safety & Responsible AI

### Data Handling & Integrity
*   **No Sensitive Data:** Absolutely no proprietary, sensitive, or PII data is permitted in the Taxonomy / Landscape.
*   **Transparent Attribution:** All vendor tools, open-source projects, and regulatory regimes indexed in the landscape must include clear, verifiable links to their authoritative upstream sources (`homepage_url`, `repo_url`).
*   **Code of Conduct:** All participants must strictly adhere to the AAIF Code of Conduct; conflicts of interest must be declared openly.

## 7. Success Metrics & Next Steps

### Key Success Metrics (KPIs)
*   **Normative Ingestion & Utility (Adoption):** Number of documents referencing specific taxonomy terms (by permalink, verbatim definition match, or verified Domain Editor attestation) within AAIF Working Group specifications and across public GitHub (collected quarterly); count of defined-but-never-cited terms.
*   **Vendor-Neutral Diversity (Community):** No single organization authors more than 50% of merged contributions to either artifact (Taxonomy or Landscape).
*   **Ecosystem Coverage (Breadth):** Every active Technical Working Group has $\ge$ 10 merged terms in the Taxonomy.
*   **Conflict Resolution Responsiveness (Velocity):** No reported conflict in the Taxonomy goes a quarter without a recorded decision.