# Contributing to the AAIF Taxonomy & Landscape Workstream

Thank you for contributing to the Agentic AI Foundation (AAIF) Taxonomy & Landscape Workstream! 

This repository maintains the horizontal, shared vocabulary (Taxonomy) and the global market ecosystem map (Landscape) across all active technical working groups.

---

## 1. Roles & Governance

To maintain data integrity and keep the curation workload distributed, we divide repository participation and governance into three distinct roles:

*   **Contributors (Anyone):** Any community member, external partner, or working group participant can contribute. Anyone is welcome to submit pull requests, propose new glossary terms, suggest landscape updates, or file issues.
*   **Domain Editors (WG Delegates):** Nominated technical experts representing the 7 active Technical Working Groups. They act as core curators who **actively author and drive** their respective domains' taxonomy and landscape entries. While they do not have direct merge access, a consensus of their peer approvals (at least two or three Domain Editors from different workgroups) is required to advance and approve any changes.
*   **Maintainers (Workstream Chairs):** **Junjie Bu** & **Gala Malbasic** hold write access to the repository and have final administrative authority to merge approved Pull Requests.

---

## 2. Contribution Pathways

We support two ways to contribute to the taxonomy and landscape:

*   **Option A: The Git & Pull Request Workflow (Code Contributors):** Best for technical domain editors. You will clone the repo, make edits directly to the data files, run a local preview web server to test, and submit a PR.
    *   👉 For step-by-step instructions on setting up Git, starting a local server, and submitting PRs, see the **[Local Development & Git Workflow Guide](docs/local-development.md)**.
*   **Option B: The Asynchronous Proposal Workflow (General Contributors):** If you prefer not to write code or use Git, you can propose glossary additions or landscape tools by opening an issue on our GitHub Issues page.
    *   👉 Follow the templates on our Issues page to submit the raw details, and a Domain Editor will review and merge them on your behalf.

---

## 3. Data Schema Guidelines

To ensure automated builds and parsing pipelines run successfully, all additions must strictly adhere to our metadata schemas. 
*   **Taxonomy Glossary:** Uses a SKOS-Lite-compliant schema mapping display terms, categories, parent nodes (`broaderTerm`), definitions, and aligned working groups.
*   **Ecosystem Landscape:** Follows a CNCF-style structure mapping tools, protocols, and regulatory bodies to categories.
*   👉 For field-by-field specifications, enum lists, and code examples, see the **[Data Schema Specifications & Guidelines](docs/data-schemas.md)**.

---

## 4. Collaborative PR Curation Workflow

Once a Pull Request is opened:

1. **Peer Review:** The PR must be reviewed and approved by **at least two or three Domain Editors**. To ensure cross-functional alignment and prevent siloed terminology, this group of reviewers **must include Domain Editors from different Technical Working Groups** (e.g., at least one Editor from the primary seeding/aligned WG and at least one Editor from a related/cross-cutting WG, such as Security & Privacy or Governance).
2. **Final Merge:** Once the required cross-workgroup approvals are secured, one of the Co-Chairs (Junjie or Gala) will perform a final administrative review and merge the PR.

---

## 5. Terminology Acceptance Criteria & Decision-Making

To maintain a high-quality, cohesive vocabulary across the foundation, all proposed taxonomy terminology must meet strict criteria and follow a structured consensus process.

### A. Terminology Acceptance Criteria
For any new glossary term to be approved and merged, it must satisfy the following:
1. **High-Level Scope Alignment:** The term must represent a cross-cutting concept (affecting $\ge$ 2 WGs) or be foundational to the entire AAIF ecosystem. Specialized, single-WG terms should remain in their respective WG repositories (see the Index vs. Payload boundaries in the [Charter](charter/charter.md)).
2. **Pre-Competitive & Neutral:** Definitions must be vendor-neutral, objective, and clear. Proprietary product names, marketing jargon, or biased terminology are strictly prohibited.
3. **Technical Precision & Clarity:** The term must be clearly defined with technical utility. Avoid overly broad definitions that lack concrete boundaries.
4. **Uniqueness (De-duplication):** The term must not duplicate existing concepts. If a proposed term is a synonym of an existing term, it must be added as an entry in the `aliases` array of the existing term rather than creating a new entry.
5. **Schema Compliance:** The metadata structure must strictly conform to the specifications outlined in the [Schema Guide](docs/data-schemas.md).

### B. Decision-Making & Consensus Process
We prioritize rough consensus across the AAIF community:
* **Default Process:** Domain Editors review PRs asynchronously. When at least 2–3 Domain Editors from different relevant working groups approve, it signifies rough consensus.
* **Weekly Synchronous Alignment:** For complex, broad, or controversial terms, contributors or editors are encouraged to bring the proposal to the weekly Workstream Sync for live discussion.

### C. Cross-Workgroup Conflict Resolution & Arbitration
Because terms often intersect (e.g., *Attestation* or *Agent* might have slightly different meanings in the Security WG vs. the Identity & Trust WG), we use the following conflict resolution protocol:
1. **Joint Collaboration (PR Phase):** If a Domain Editor flags a conceptual conflict, the primary seeding editor and the objecting editor must collaborate directly in the PR discussion to find a unified definition or refine the `scopeNote` to document the different perspectives.
2. **Partitioning & Hierarchies:** If a single term cannot represent both perspectives, editors should use `broaderTerm` hierarchy or specify context within the term name (e.g., *Security Attestation* vs. *Identity Attestation*).
3. **Chair Arbitration:** If Domain Editors cannot reach consensus within 14 days, the Workstream Chairs (Junjie & Gala) will mediate a resolution, choosing a compromise or scheduling a dedicated sync.
4. **TSC Escalation:** As a final resort, unresolved issues are escalated to the AAIF Technical Steering Committee (TSC) and the Foundation CTO (Manik) for a binding decision.

---

## 5. Code of Conduct
All contributors must strictly adhere to the [AAIF Code of Conduct](https://www.linuxfoundation.org/code-of-conduct) and the Linux Foundation Antitrust Policy.
