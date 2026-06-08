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
3. **Providing an Enterprise Blueprint:** Enterprise CTOs and CIOs require a single, consolidated, authoritative guide to navigate the fragmented Agentic AI technology stack, rather than maintaining isolated spreadsheets from 7 different groups.

### Foundation Alignment
Supports the foundation's core pillars of **Interoperability**, **Ecosystem Transparency**, and **Engineering Excellence** by uniting the outputs of all working groups into cohesive, publicly accessible web assets.

---

## 2. Scope

### Defining "High-Level" Boundaries (Index vs. Payload)
To ensure clear boundaries and prevent overlap with the 7 vertical Technical Working Groups, this workstream distinguishes between **Horizontal Indexes** and **Vertical Domain Payloads**:

| Dimension | The Workstream (High-Level "Index") | Vertical Working Groups (Deep-Dive "Payload") |
| :--- | :--- | :--- |
| **Taxonomy Focus** | Foundational terms and cross-cutting concepts affecting $\ge$ 2 working groups. | Highly specialized, domain-specific terminology and internal technical helper definitions. |
| **Landscape Scope** | Curation of the ecosystem map categorized into 7 macro-buckets. | Detailed vendor feature audits, benchmarks, or project-specific libraries. |
| **Deliverable Nature** | Standardized metadata, API schemas, and interactive web dashboard directories. | Specifications (e.g., MCP/A2A specs), vulnerability catalogs, threat models, and compliance papers. |

### Scope Overlap & Conflict Prevention Policy
1. **Federated Governance:** Curation is driven by nominated delegates (**Domain Editors**) from each WG, ensuring no definitions or landscape updates are created in isolation.
2. **Consolidation over Creation:** The workstream ingests and standardizes glossaries supplied by the WGs rather than authoring domain-specific definitions from scratch.
3. **Arbitration Process:** Any conflicting definitions (e.g., overlapping terms) are resolved using the collaborative peer-review workflow and hierarchical partitioning defined in [CONTRIBUTING.md](../CONTRIBUTING.md), with escalation to the Technical Steering Committee (TSC) as a final resort.

### In Scope
*   **Technical Taxonomy & Glossary Consolidation:** Defining, standardizing, and arbitrating core vocabulary terms using a flexible SKOS-Lite metadata schema (`prefLabel`, `altLabel`, `broaderTerm`, `scopeNote`, `relatedTerms`, `contrastsWith`).
*   **Global Ecosystem Architecture Map Curation:** Maintaining a CNCF-style interactive landscape (`landscape.yml`) categorizing the industry into 7 macro buckets:
    1. *Agent Runtimes, Frameworks & Workflow Orchestration* (aligned with **Workflows & Process Integration** WG)
    2. *Protocols & Discovery Registries* (aligned with **Identity & Trust** WG)
    3. *Security Guardrails & Firewalls* (aligned with **Security & Privacy** WG)
    4. *Observability & Tracing Telemetry* (aligned with **Observability & Traceability** WG)
    5. *Agentic Commerce & Wallets* (aligned with **Agentic Commerce** WG)
    6. *Global Governance & Regulatory Regimes* (aligned with **Governance, Risk & Regulatory Alignment** WG)
    7. *Evaluation & Reliability Harnesses* (aligned with **Accuracy & Reliability** WG)
*   **Cross-WG Terminology Arbitration:** Serving as the technical gatekeeper and dispute resolution forum for cross-cutting concepts.
*   **Automated Web Dashboard Publishing:** Maintaining the CI/CD pipelines that deploy the interactive Taxonomy Explorer and Landscape Map web applications.

### Out of Scope
*   **Authoring Vertical Domain Reports:** We do not write deep-dive legal compliance whitepapers or domain-specific specifications (e.g., narrative regulatory analyses belong to WG7 Governance).
*   **Core Protocol Design:** We do not define execution protocols (e.g., MCP or A2A specifications belong to their respective WGs).
*   **Proprietary Commercial Portals:** We do not build closed commercial enterprise landscape platforms.

### Assumptions & Dependencies
*   **Assumptions:** Assumes each WG Chair will nominate 2 active delegates to participate in weekly synchronization and asynchronous PR reviews.
*   **Dependencies:** Depends on all WGs providing their baseline glossaries, vendor tool inventories, and regional policy tracking data.

---

## 3. Goals & Deliverables

### 3–6 Month Goals
*   **Consolidate Baseline Terminology:** Ingest and de-duplicate existing glossaries from all 7 WGs into a unified SKOS-Lite data repository (`taxonomy-data.js`).
*   **Launch Master Web Portal:** Deploy the fully interactive Shared Taxonomy Explorer and CNCF Landscape 2 instances to GitHub Pages (`https://aaif.github.io/ws-taxonomy-landscape/`) or (`https://taxonomy.github.io/` and `https://landscapt.github.io/`).
*   **Establish Delegate Governance:** Operationalize the weekly cross-WG delegate sync to review pull requests and resolve terminology intersections.

### Planned Deliverables
| Deliverable Name | Format | Target Date |
| :--- | :--- | :--- |
| **Shared Taxonomy Explorer (v1.0)** | `taxonomy-data.js` + Web App | 2026-08-15 |
| **Ecosystem Architecture Map (v1.0)** | `landscape.yml` + Web App (Landscape 2) | 2026-08-15 |
| **Cross-WG Terminology Arbitration Guide** | Governance Documentation | 2026-08-15 |

**Definition of Done:** Reviewed by WG delegates, approved by rough consensus/voting, merged into the official GitHub repository, and published to AAIF web properties.

---

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

---

## 5. Membership & Governance

### Who Can Participate
Open to all individuals and organizations consistent with foundation policies. We require 2 nominated delegates from each of the Technical Working Groups.

### Leadership Structure & Division of Labor
*   **Chair:** Junjie Bu (Google) – *Primary Focus: Technical Taxonomy architecture, SKOS-Lite schema, and web dashboard infrastructure.*
*   **Co-Chair:** Gala Malbasic (Bloomberg) – *Primary Focus: Landscape `landscape.yml` curation, vendor PR management, and operational PM administration.*
*   **Term:** 12 months, elected by working group chairs.

### Decision Process & Escalation
*   **Default:** Rough consensus documented in GitHub issues and meeting minutes.
*   **Escalation Path:** AAIF Technical Steering Committee (TSC) / Foundation CTO (Manik).
*   **Quorum:** 50% of active nominated delegates.

---

## 6. Security, Safety & Responsible AI

### Data Handling & Integrity
*   **No Sensitive Data:** Absolutely no proprietary, sensitive, or PII data is permitted in public landscape YAML files or taxonomy definitions.
*   **Transparent Attribution:** All vendor tools, open-source projects, and regulatory regimes indexed in the landscape must include clear, verifiable links to their authoritative upstream sources (`homepage_url`, `repo_url`).
*   **Code of Conduct:** All participants must strictly adhere to the AAIF Code of Conduct; conflicts of interest must be declared openly.

---

## 7. Success Metrics & Next Steps

### Key Success Metrics (KPIs)
*   **Normative Ingestion & Utility (Adoption):** Number of documents referencing specific taxonomy terms (by permalink, verbatim definition match, or verified Domain Editor attestation) within AAIF Working Group specifications and across public GitHub (collected quarterly); count of defined-but-never-cited terms.
*   **Vendor-Neutral Diversity (Community):** No single organization authors more than 50% of merged contributions to either artifact (Taxonomy or Landscape).
*   **Ecosystem Coverage (Breadth):** Every active Technical Working Group has $\ge$ 10 merged terms in the Taxonomy.
*   **Conflict Resolution Responsiveness (Velocity):** No reported conflict in the Taxonomy goes a quarter without a recorded decision.