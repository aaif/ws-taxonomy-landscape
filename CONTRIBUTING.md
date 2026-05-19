# Contributing to the AAIF Taxonomy & Landscape Workstream

Thank you for contributing to the Agentic AI Foundation (AAIF) Taxonomy & Landscape Workstream! 

This repository maintains the horizontal, shared vocabulary (Taxonomy) and the global market ecosystem map (Landscape) across all active technical working groups.

---

## 1. Roles & Governance

To maintain data integrity and keep the curation workload distributed, we divide repository governance into two roles:

*   **Maintainers (Chairs):** **Junjie Bu** & **Gala Malbasic** hold final write access to the repository. Only the Co-Chairs have the authority to merge Pull Requests into the `main` branch.
*   **Reviewers (Nominated Delegates):** Nominated delegates representing the 7 active Technical Working Groups have review and approval access. While they cannot merge directly, their peer approvals are required to advance changes in their respective domains.

---

## 2. Collaborative PR Curation Workflow

All additions or modifications to our taxonomy glossary or landscape market map follow a 3-step peer-reviewed workflow:

```
1. Contributor opens a PR (e.g., adding a term or tool)
       │
       ▼
2. Relevant WG Delegate reviews the PR and clicks "Approve"
       │
       ▼
3. Workstream Chair performs sanity check and clicks "Merge"
```

1.  **Submit a Pull Request (PR):** Ensure your changes are limited to the appropriate data files:
    *   Taxonomy updates: [`taxonomy/taxonomy-data.js`](taxonomy/taxonomy-data.js) (SKOS-Lite schema)
    *   Landscape updates: [`landscape/landscape.yml`](landscape/landscape.yml) (CNCF-style schema)
2.  **Peer Review:** The nominated delegates from the relevant Working Group (e.g., the Security WG delegates for a security-seeded term) will review the PR for domain accuracy and click **Approve** in GitHub.
3.  **Final Merge:** Once the relevant delegate has approved the change, one of the Co-Chairs will perform a final administrative review and click **Merge** to deploy the update to the live portal.

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
