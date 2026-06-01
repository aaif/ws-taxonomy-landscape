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

## 2. Collaborative PR Curation Workflow

All additions or modifications to our taxonomy glossary or landscape market map follow a 3-step peer-reviewed workflow:

```
1. Contributor opens a PR (e.g., adding a term or tool)
       │
       ▼
2. At least 2-3 Domain Editors (from different workgroups) approve the PR
       │
       ▼
3. Workstream Chair performs sanity check and clicks "Merge"
```

1.  **Submit a Pull Request (PR):** Ensure your changes are limited to the appropriate data files:
    *   Taxonomy updates: [`taxonomy/taxonomy-data.js`](taxonomy/taxonomy-data.js) (SKOS-Lite schema)
    *   Landscape updates: [`landscape/landscape.yml`](landscape/landscape.yml) (CNCF-style schema)
2.  **Peer Review:** The PR must be reviewed and approved by **at least two or three Domain Editors**. To ensure cross-functional alignment and prevent siloed terminology, this group of reviewers **must include Domain Editors from different Technical Working Groups** (e.g., at least one Editor from the primary seeding/aligned WG and at least one Editor from a related/cross-cutting WG, such as Security & Privacy or Governance).
3.  **Final Merge:** Once the required cross-workgroup approvals (at least 2 or 3 Domain Editors) are secured, one of the Co-Chairs will perform a final administrative review and click **Merge** to deploy the update to the live portal.

---

## 3. Data File Guidelines

### Taxonomy Entries (`taxonomy-data.js`)
Every new glossary entry must conform to the SKOS-Lite metadata structure:
```javascript
{
  "term": "Preferred Display Term",
  "category": "WG-Aligned Category Bucket",
  "aliases": ["Synonym 1", "Synonym 2"],
  "broaderTerm": "Parent Concept Term (if hierarchical)",
  "definition": "Clear, technical, pre-competitive definition.",
  "scopeNote": "Contextual notes, historical review dates, or WG-specific background.",
  "workgroups": ["Aligned Working Group Name"]
}
```

### Landscape Entries (`landscape.yml`)
Every new landscape node must be placed under the correct category and subcategory matching our WG domains:
```yaml
- name: Display Name
  homepage_url: https://example.com
  repo_url: https://github.com/example/repo (optional)
  description: Short, neutral, non-marketing blurb describing the tool or standard.
  project: graduated | incubating | member | external
```

---

## 4. Code of Conduct
All contributors must strictly adhere to the [AAIF Code of Conduct](https://www.linuxfoundation.org/code-of-conduct) and the Linux Foundation Antitrust Policy.
