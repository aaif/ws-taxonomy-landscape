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

## 2. Step-by-Step Contribution Process

We support two ways to contribute to the taxonomy and landscape: **Code Contributions (via GitHub Pull Requests)** for technical editors, and **Asynchronous Issue Proposals** for general community members.

### Option A: The Git & Pull Request Workflow (Technical Contributors)

If you are comfortable with Git and want to propose changes directly:

1. **Fork & Clone:** Fork the `aaif/ws-taxonomy-landscape` repository and clone it to your local machine:
   ```bash
   git clone https://github.com/<your-username>/ws-taxonomy-landscape.git
   cd ws-taxonomy-landscape
   ```
2. **Create a Branch:** Create a descriptive branch for your changes:
   ```bash
   git checkout -b feature/add-term-myterm
   ```
3. **Edit the Data Files:** Make your changes strictly within the data files:
   * **Taxonomy:** Add or modify entries in [taxonomy/taxonomy-data.js](file:///Users/jbu/Development/ws-taxonomy-landscape/taxonomy/taxonomy-data.js).
   * **Landscape:** Add or modify entries in [landscape/landscape.yml](file:///Users/jbu/Development/ws-taxonomy-landscape/landscape/landscape.yml).
4. **Run Local Preview Server:** Since this is a pure static portal, you can preview the changes instantly by running a local web server in the repository root:
   ```bash
   # Using Python 3 (standard on macOS/Linux)
   python3 -m http.server 8000
   
   # Or using Node/npx
   npx serve -l 8000
   ```
   Open your browser and navigate to `http://localhost:8000/` to test:
   * **Taxonomy Explorer:** Navigate to `http://localhost:8000/taxonomy/` and verify your new term renders, links to broader terms, and filters correctly.
   * **Landscape Map:** Navigate to `http://localhost:8000/landscape/static/` to verify your new tool or project renders in the correct category.
5. **Local Validation Checklist:**
   * Open your browser's Developer Tools Console (`F12` or `Cmd+Opt+I`) on the local preview page. Ensure there are no JavaScript syntax or parsing errors.
   * Ensure your YAML indentation is exactly 2 spaces (no tabs) in `landscape.yml`.
6. **Commit & Push:** Commit your changes with a clear message and push your branch:
   ```bash
   git add taxonomy/taxonomy-data.js landscape/landscape.yml
   git commit -m "add(taxonomy): define Attestation and map to Security WG"
   git push origin feature/add-term-myterm
   ```
7. **Open a PR:** Go to the upstream repository on GitHub and open a Pull Request. In the description, clearly state:
   * The purpose of the additions/changes.
   * Which Working Groups are impacted.
   * Request review from the relevant **Domain Editors** (WG delegates).

---

### Option B: The Asynchronous Proposal Workflow (Non-Code Contributors)

If you do not want to use Git, you can propose additions directly through GitHub Issues:

1. **Open an Issue:** Go to the repository's **Issues** tab and click **New Issue**.
2. **Select Template / Fill Details:** Fill in the requested details depending on your proposal type:
   * **For a Taxonomy Term:** Provide the `term`, `definition`, `category`, and the `workgroups` it aligns with.
   * **For a Landscape Tool/Standard:** Provide the `name`, `homepage_url`, `description` (non-marketing), and the category it belongs to.
3. **Review & Curation:** A Domain Editor or Workstream Chair will review your issue, verify it meets the acceptance criteria, and translate it into a Pull Request on your behalf.

---

## 3. Collaborative PR Curation Workflow

Once a Pull Request is opened:

1. **Peer Review:** The PR must be reviewed and approved by **at least two or three Domain Editors**. To ensure cross-functional alignment and prevent siloed terminology, this group of reviewers **must include Domain Editors from different Technical Working Groups** (e.g., at least one Editor from the primary seeding/aligned WG and at least one Editor from a related/cross-cutting WG, such as Security & Privacy or Governance).
2. **Final Merge:** Once the required cross-workgroup approvals are secured, one of the Co-Chairs (Junjie or Gala) will perform a final administrative review and merge the PR.

---

## 3. Terminology Acceptance Criteria & Decision-Making

To maintain a high-quality, cohesive vocabulary across the foundation, all proposed taxonomy terminology must meet strict criteria and follow a structured consensus process.

### A. Terminology Acceptance Criteria
For any new glossary term to be approved and merged, it must satisfy the following:
1. **High-Level Scope Alignment:** The term must represent a cross-cutting concept (affecting $\ge$ 2 WGs) or be foundational to the entire AAIF ecosystem. Specialized, single-WG terms should remain in their respective WG repositories (see the Index vs. Payload boundaries in the [Charter](charter/charter.md)).
2. **Pre-Competitive & Neutral:** Definitions must be vendor-neutral, objective, and clear. Proprietary product names, marketing jargon, or biased terminology are strictly prohibited.
3. **Technical Precision & Clarity:** The term must be clearly defined with technical utility. Avoid overly broad definitions that lack concrete boundaries.
4. **Uniqueness (De-duplication):** The term must not duplicate existing concepts. If a proposed term is a synonym of an existing term, it must be added as an entry in the `aliases` array of the existing term rather than creating a new entry.
5. **Schema Compliance:** The metadata structure must strictly conform to the SKOS-Lite specification (including category, workgroups, broaderTerm, and a precise definition and scopeNote).

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

## 4. Data File Guidelines & Schemas

To ensure automated builds and parsers run successfully, all additions must strictly adhere to the field-by-field definitions below.

### A. Taxonomy Entries (`taxonomy/taxonomy-data.js`)

Each entry in the taxonomy glossary array is a JavaScript object representing a concept in our SKOS-Lite taxonomy.

```javascript
{
  "term": "Agent derailment",
  "category": "Agentic Threats",
  "aliases": ["Goal drift", "Misalignment"],
  "broaderTerm": "Agentic Misbehavior",
  "definition": "An unintended deviation in an AI agent's behavior that causes it to pursue goals...",
  "scopeNote": "Raised during discussion of non-malicious agent misbehavior (2026-03-03)...",
  "workgroups": ["Security & Privacy", "Accuracy & Reliability"]
}
```

#### Schema Field Specifications:
*   **`term`** *(String, Required):* The primary display name of the concept. It must be written in sentence case (only capitalize proper nouns, acronyms, or the first word). Must be unique.
*   **`category`** *(String, Required):* The parent taxonomy bucket under which this term is organized. Current categories include:
    *   `Agentic Threats`
    *   `Identity & Authorization`
    *   `Infrastructure & Architecture`
    *   `Capabilities & Interfaces`
    *   `Governance & Compliance`
*   **`aliases`** *(Array of Strings, Required):* Synonyms, alternative spellings, or historical terms. If a term is a synonym of an existing term, add it here instead of creating a new object. Use empty array `[]` if none.
*   **`broaderTerm`** *(String or null, Required):* The direct parent concept in the hierarchical mindmap. For example, the broader term of `Agent derailment` is `Agentic Misbehavior`. Set to `null` if it is a top-level term.
*   **`definition`** *(String, Required):* A neutral, objective technical definition. Avoid referring to specific commercial tools or proprietary systems.
*   **`scopeNote`** *(String, Optional):* Explains historical review dates, WG-specific context, or caveats about the term's boundaries.
*   **`workgroups`** *(Array of Strings, Required):* The working groups that share interest or joint ownership of this term (e.g., `["Security & Privacy", "Identity & Trust"]`).

---

### B. Ecosystem Landscape Entries (`landscape/landscape.yml`)

The landscape configuration follows a CNCF-style structure. Each category node has subcategories containing items:

```yaml
- category: Security Guardrails & Firewalls
  subcategories:
    - subcategory: Prompt & Runtime Guardrails
      items:
        - name: Google Cloud Model Armor
          homepage_url: https://cloud.google.com/security/products/model-armor
          repo_url: https://github.com/... (optional)
          description: Enterprise security service providing prompt injection defense...
          project: member
```

#### Item Field Specifications:
*   **`name`** *(String, Required):* The official name of the tool, framework, protocol, or standard.
*   **`homepage_url`** *(String, Required):* The official URL of the project homepage. Must start with `https://`.
*   **`repo_url`** *(String, Optional):* The open-source code repository URL (GitHub, GitLab, etc.).
*   **`description`** *(String, Required):* A brief description of the technical capabilities. **Strictly pre-competitive and neutral:** avoid marketing terms like *"first," "best," "industry-leading," or "revolutionary."*
*   **`project`** *(String, Required):* The project's alignment within the AAIF/Linux Foundation ecosystem. Must be one of:
    *   `graduated` (Fully approved AAIF standards/projects)
    *   `incubating` (AAIF work-in-progress standards/projects)
    *   `member` (Member-contributed tools/projects)
    *   `external` (Non-member, open-source industry tools/frameworks)

---

## 5. Code of Conduct
All contributors must strictly adhere to the [AAIF Code of Conduct](https://www.linuxfoundation.org/code-of-conduct) and the Linux Foundation Antitrust Policy.
