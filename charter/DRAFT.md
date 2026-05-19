# AAIF Taxonomy & Landscape Workstream Charter (DRAFT)

**Chairs:** Junjie Bu (Google) – Chair | Gala Malbasic (Bloomberg) – Co-Chair  
**Meeting Cadence:** Weekly on Wednesdays at 8:00 AM PT / 11:00 AM ET / 4:00 PM BST (duration: 30 minutes)  
**Communication Channels:** Mailing List (`ws-taxonomy-landscape@lists.aaif.io`), Discord (`#ws-taxonomy-landscape`), GitHub (`aaif/ws-taxonomy-landscape`)  

---

## 1. Purpose & Mission

### Mission Statement
The Taxonomy & Landscape Workstream advances the Agentic AI Foundation's (AAIF) mission by establishing a unified living vocabulary (Taxonomy) and a comprehensive visual market map (Landscape) across all 7 active Technical Working Groups. We provide the pre-competitive architectural bridge that enables clear communication, interoperability, and seamless enterprise adoption of agentic AI technologies.

### Why This Workstream Exists
1. **Eliminating Siloed Terminology:** The 7 Working Groups (WGs) operate in specialized domains. Without a shared taxonomy, conflicting definitions (e.g., differing interpretations of *Agent*, *Attestation*, or *Autonomy*) create friction and integration complexity.
2. **Preventing Duplicate Ecosystem Research:** Multiple WGs duplicate effort surveying the same platforms, tools, and compliance regimes (e.g., both Security WG and Governance WG tracking compliance monitors).
3. **Providing an Enterprise Blueprint:** Enterprise CTOs and CIOs require a single, consolidated, authoritative guide to navigate the fragmented Agentic AI technology stack, rather than maintaining isolated spreadsheets from 7 different groups.

### Foundation Alignment
Supports the foundation's core pillars of **Interoperability**, **Ecosystem Transparency**, and **Engineering Excellence** by uniting the outputs of all working groups into cohesive, publicly accessible web assets.

---

## 2. Scope

### In Scope
*   **Technical Taxonomy & Glossary Consolidation:** Defining, standardizing, and arbitrating core vocabulary terms using a flexible SKOS-Lite metadata schema (`prefLabel`, `altLabel`, `broaderTerm`, `scopeNote`).
*   **Global Ecosystem Architecture Map Curation:** Maintaining a CNCF-style interactive landscape (`landscape.yml`) categorizing the industry into 6 macro buckets:
    1. *Agent Runtimes & Frameworks*
    2. *Protocols & Discovery Registries*
    3. *Security Guardrails & Firewalls*
    4. *Observability & Tracing Telemetry*
    5. *Agentic Commerce & Wallets*
    6. *Global Governance & Regulatory Regimes*
*   **Cross-WG Terminology Arbitration:** Serving as the technical gatekeeper and dispute resolution forum for cross-cutting concepts.
*   **Automated Web Dashboard Publishing:** Maintaining the CI/CD pipelines that deploy the interactive Taxonomy Explorer and Landscape Map web applications.

### Out of Scope
*   **Authoring Vertical Domain Reports:** We do not write deep-dive legal compliance whitepapers or domain-specific specifications (e.g., narrative regulatory analyses belong to WG7 Governance).
*   **Core Protocol Design:** We do not define execution protocols (e.g., MCP or A2A specifications belong to their respective WGs).
*   **Proprietary Commercial Portals:** We do not build closed commercial enterprise landscape platforms.

### Assumptions & Dependencies
*   **Assumptions:** Assumes each WG Chair will nominate 1–2 active delegates to participate in weekly synchronization and asynchronous PR reviews.
*   **Dependencies:** Depends on the 7 WGs providing their baseline glossaries, vendor tool inventories, and regional policy tracking data.

---

## 3. Goals & Deliverables

### 3–6 Month Goals
*   **Consolidate Baseline Terminology:** Ingest and de-duplicate existing glossaries from all 7 WGs into a unified SKOS-Lite data repository (`taxonomy-data.js`).
*   **Launch Master Web Portal:** Deploy the fully interactive Shared Taxonomy Explorer and CNCF Landscape 2 instances to GitHub Pages (`https://aaif.github.io/ws-taxonomy-landscape/`).
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
*   **Primary Artifacts:** `taxonomy-data.js`, `landscape.yml`, web dashboard portals, governance documentation.

### Meetings
*   **Cadence:** Weekly on Thursday at 8:00 AM PT / 11:00 AM ET / 4:00 PM BST.
*   **Duration:** 30 minutes.
*   **Open Meetings:** Open to all AAIF members and nominated WG delegates.
*   **Minutes & Recordings:** Stored in the LFX Member Portal and GitHub repository.

### Communication Channels
*   **Asynchronous:** Mailing List (`ws-taxonomy-landscape@lists.aaif.io`), Discord (`#ws-taxonomy-landscape`), GitHub PRs/Issues.
*   **Synchronous:** Zoom (calendar invite provided to registered delegates).

---

## 5. Membership & Governance

### Who Can Participate
Open to all individuals and organizations consistent with foundation policies. We actively require 1–2 nominated delegates from each of the 7 Technical Working Groups.

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
*   **Adoption:** Number of downstream working groups, specifications, and external enterprise architectures adopting our taxonomy terms and linking to `ecosystem.aaif.io`.
*   **Quality:** Zero conflicting definitions across the 7 WGs; successful Next.js static export builds passing CI/CD gates.
*   **Community:** Active weekly participation from nominated delegates representing 100% of the 7 WGs.
*   **Timeliness:** 100% of planned deliverables meeting their target deployment windows.

### Immediate Next Steps
1.  Publish this approved charter to the `aaif/ws-taxonomy-landscape` GitHub repository.
2.  Send formal "Call for Delegates" announcement to the `wg-chairs@lists.aaif.io` mailing list.
3.  Hold initial co-chair synchronization (Junjie & Gala) to kick off delegate sync scheduling.
