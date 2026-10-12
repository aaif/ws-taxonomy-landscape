# Contributing to the AAIF Taxonomy & Landscape Workstream

Thank you for contributing to the Agentic AI Foundation (AAIF) Taxonomy & Landscape Workstream!

This repository maintains the horizontal, shared vocabulary (Taxonomy) and the global market ecosystem map (Landscape) across all active Technical Working Groups.

> [!IMPORTANT]
> **Taxonomy contributions only:** The workstream is currently focused exclusively on the Taxonomy. Landscape work remains on the future roadmap, but the contribution and review process for it has not yet been accepted. Until that process is approved and this guide is updated, pull requests that propose Landscape changes will be closed.

---

## 1. Roles and Governance

To maintain data integrity and keep the curation workload distributed, we divide repository participation and governance into three distinct roles:

- **Contributors (Anyone):** Any community member, external partner, or Working Group participant can contribute. Anyone is welcome to submit pull requests, propose new glossary terms, or file issues within the current Taxonomy scope.
- **Domain Editors (Working Group Delegates):** Nominated technical experts representing the seven active Technical Working Groups. They act as core curators who **actively author and drive** their respective domains' taxonomy entries. While they do not have direct merge access, changes require approval from at least two Domain Editors representing different Working Groups.
- **Maintainers (Workstream Chairs):** **Junjie Bu** and **Gala Malbasic** hold write access to the repository and have final administrative authority to merge approved pull requests.

---

## 2. Contribution Process

Taxonomy contributions are predominantly submitted by delegates assigned to the Taxonomy Workstream from another Working Group. The process for contributing terms and definitions is:

1. Terms are raised in individual Working Groups.
2. A delegate from that Working Group brings the term to the Taxonomy Workstream by adding it to the [taxonomy spreadsheet](https://docs.google.com/spreadsheets/d/1Oa-x7nBISIOuqaC-BnsQ1R-iPdwZ6Otk3dpWlqpI_z4/edit?gid=0#gid=0). Because delegates do not necessarily monitor the spreadsheet for changes, the delegate should also post in the [Discord channel](https://discord.com/channels/1461090924791595243/1504201248025346110) to request attention.
3. During the weekly Taxonomy Workstream meeting, outstanding terms are reviewed. The workstream discusses whether each term is used in practice, captures a real-world rather than purely theoretical concept, is sufficiently novel and relevant, and has an appropriate owning Working Group. The group then votes on the term, with one of the following outcomes:

   - **KEEP:** The term is accepted, and the workstream is open to a pull request.
   - **CULL:** The term is rejected.
   - **DEBATE:** The term requires broader discussion.

4. A delegate from the Working Group that owns the term creates a pull request defining it. The definition should be one sentence; additional details and examples can be provided in the `scopeNote` field. Although a pull request may contain more than one term, one pull request per term is generally recommended.
5. Fellow delegates can comment on, discuss, and ultimately approve the pull request. A single-term pull request requires two approvals from delegates representing different Working Groups. Any delegate can veto a pull request. A multi-term pull request may require a higher approval threshold.
6. Once the approval threshold is met, the pull request can be merged using GitHub's **Rebase and merge** strategy. Once merged, the term in the spreadsheet will be marked as **FINALIZED**.

All pull requests must define terms that have already been accepted. A pull request for a term that has not received a **KEEP** vote will be closed.

If you would like to propose a term but are not a delegate, contact your Working Group's delegate and ask them to raise it. Alternatively, attend the Taxonomy Workstream meeting to advocate for the term.

---

## 3. Data Schema Guidelines

To ensure automated builds and parsing pipelines run successfully, all additions must strictly adhere to our metadata schemas.

- **Taxonomy glossary:** Uses a SKOS-Lite-compliant schema that maps display terms, categories, parent concepts (`broaderTerm`), definitions, and aligned Working Groups.
- **Ecosystem Landscape:** A schema is documented for future-roadmap planning, but Landscape contributions are not currently accepted.
- For field-by-field specifications, enum lists, and code examples, see the **[Data Schema Specifications and Guidelines](docs/data-schemas.md)**.

---

## 4. Code of Conduct

All contributors must strictly adhere to the [AAIF Code of Conduct](https://www.linuxfoundation.org/code-of-conduct) and the Linux Foundation Antitrust Policy.
