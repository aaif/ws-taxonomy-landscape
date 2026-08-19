# Data Schema Specifications & Guidelines

To ensure automated builds, parsing pipelines, and UI mindmap rendering run successfully, all additions must strictly conform to the schemas documented below.

---

## A. Taxonomy Glossary Schema (`taxonomy/taxonomy-data.js`)

Each entry in the main taxonomy array is a JavaScript object representing a concept in our SKOS-Lite taxonomy.

> **⚠️ Current state of the taxonomy (as of 2026-07-27):** the workstream is admitting *terms* first and agreeing *definitions* second. Until that second pass runs, three fields are **deliberately deferred** on every entry — `definition`, `category` and `broaderTerm`. See [Deferred fields](#deferred-fields-initial-check-in) below. Entries that leave these blank are conformant, not incomplete; please do not open PRs backfilling them ad hoc.

The example below shows a *fully populated* entry — the target state, not the current one.

```javascript
{
  "term": "Agent derailment",
  "category": "Agentic Threats",
  "aliases": ["Goal drift", "Misalignment"],
  "broaderTerm": "Agentic Misbehavior",
  "definition": "An unintended deviation in an AI agent's behavior that causes it to pursue goals...",
  "scopeNote": "Raised during discussion of non-malicious agent misbehavior (2026-03-03)...",
  "relatedTerms": ["Agent sabotage"],
  "contrastsWith": ["Deterministic operation"],
  "workgroups": ["Security & Privacy", "Accuracy & Reliability"]
}
```

### Field Specifications & Validation Rules
*   **`term`** *(String, Required):* The preferred display term.
    *   *Formatting:* Sentence case (only capitalize the first word, proper nouns, or acronyms).
    *   *Constraint:* Must be unique across the entire taxonomy file.
*   **`category`** *(String, Required — currently [deferred](#deferred-fields-initial-check-in), use `""`):* The primary organization bucket.
    *   *Status:* **Deferred.** The workstream agreed on 2026-07-27 to leave this empty for the initial check-in and revisit once enough of the taxonomy exists to categorise it meaningfully. Categorising up front would either duplicate the working-group split or force a cross-group debate we are not yet equipped to have.
    *   *Constraint (when reinstated):* Must be one of the following approved categories:
        *   `Agentic Threats`
        *   `Identity & Authorization`
        *   `Infrastructure & Architecture`
        *   `Capabilities & Interfaces`
        *   `Governance & Compliance`
    *   *Note:* This enum is itself provisional and will be revisited alongside the field.
*   **`aliases`** *(Array of Strings, Required):* Synonyms, alternate spellings, or historical terms. If a term is a synonym of an existing term, add it here instead of creating a new object. Use `[]` if none.
*   **`broaderTerm`** *(String or null, Required — currently [deferred](#deferred-fields-initial-check-in), use `null`):* The direct parent concept in the mindmap hierarchy (SKOS `broader`).
    *   *Status:* **Deferred.** The initial check-in is deliberately flat. Hierarchy depends on scope-boundary mapping between working groups, which is still in progress.
    *   *Rule (when reinstated):* For example, the broader term of `Agent derailment` is `Agentic Misbehavior`.
    *   *Root nodes:* If the term is a top-level conceptual category, set this to `null`.
*   **`definition`** *(String, Required — currently [deferred](#deferred-fields-initial-check-in), use the pending placeholder):* A clear, technical, pre-competitive definition.
    *   *Status:* **Deferred.** Terms are being admitted to the taxonomy ahead of their definitions. Until a definition is agreed at the workstream sync, use exactly: `Definition pending — term accepted; definition under working group discussion.`
    *   *Content Rule:* Vendor-neutral and objective. If the term represents an adjacent contrasting concept (e.g., *Tool* vs. *Skill*), the definition MUST explicitly state how it differs from its counterpart.
*   **`scopeNote`** *(String, Optional):* Captures historical context, meeting review dates, or explanations of conceptual boundaries between working groups.
*   **`relatedTerms`** *(Array of Strings, Optional):* Maps associative `skos:related` conceptual linkages (e.g., `["Skill", "Primitive"]`). Defaults to `[]`.
*   **`contrastsWith`** *(Array of Strings, Optional):* Explicitly links paired contrasting terms (e.g., `["Tool"]`). Defaults to `[]`.
*   **`workgroups`** *(Array of Strings, Required):* The working groups that share interest or joint ownership of this term (e.g., `["Security & Privacy", "Identity & Trust"]`).
    *   *Constraint:* `"Universal"` is **not** a valid value. The workstream agreed on 2026-07-27 that Universal is a bucket in the working sheet, not a working group. A term that belongs to no single group carries an empty array (`[]`).
    *   *⚠️ Open decision:* whether this field denotes the **owning/shepherding** group or **all interested** groups is not yet settled — see [Open decisions](#open-decisions). Until it is, entries record cross-group interest in `scopeNote` rather than inflating this array.

---

## Deferred fields (initial check-in)

`definition`, `category` and `broaderTerm` are currently left blank on every taxonomy entry by deliberate decision of the Taxonomy & Landscape workstream (2026-07-27). They are **not** missing data.

| Field | Value to use | Why deferred |
|---|---|---|
| `definition` | `Definition pending — term accepted; definition under working group discussion.` | Terms are admitted first, defined second. Definitions are debated term by term at the weekly sync. |
| `category` | `""` | Categorising before the taxonomy is built out would either mirror the working-group split or force a premature cross-group debate. |
| `broaderTerm` | `null` | Hierarchy depends on scope-boundary mapping between working groups, still in progress. |

**If you are a contributor:** please do not open pull requests populating these fields on existing entries. Bring proposals to the workstream sync (Mondays, 08:30 PST) or open an issue. New terms should follow the same convention until the deferral is lifted.

---

## Open decisions

Tracked here so they are visible to contributors rather than buried in meeting notes.

| Decision | Status | Raised |
|---|---|---|
| Does `workgroups` mean the **owning/shepherding** group, or **all interested** groups? Related: should a term ever have no shepherd at all? | Open — needs a named owner to drive it | 2026-07-27 |
| Ownership of `Delegation` — Identity & Trust vs. Workflows & Process Integration | Open | 2026-07-27 |
| When `category` and `broaderTerm` are reinstated, and with what category enum | Open | 2026-07-27 |

---

## B. Ecosystem Landscape Schema (`landscape/landscape.yml`)

The landscape configuration follows a hierarchical CNCF-style structure. Each root category node contains subcategories, which contain individual items:

```yaml
landscape:
  - category: Security Guardrails & Firewalls
    subcategories:
      - subcategory: Prompt & Runtime Guardrails
        items:
          - name: Google Cloud Model Armor
            homepage_url: https://cloud.google.com/security/products/model-armor
            repo_url: https://github.com/example/project # optional
            description: Enterprise security service providing prompt injection defense...
            project: member
```

The file has a single top-level `landscape:` key holding the list of categories.

### Landscape Item Field Specifications
*   **`name`** *(String, Required):* The official name of the tool, framework, protocol, or standard.
*   **`homepage_url`** *(String, Required):* The landing page URL of the project.
    *   *Constraint:* Must start with `https://`.
*   **`repo_url`** *(String, Optional):* The open-source code repository URL (GitHub, GitLab, etc.).
*   **`description`** *(String, Required):* A brief technical description.
    *   *Constraint:* Must be strictly objective and pre-competitive. **Do not use marketing superlatives** (e.g., *"first," "best," "industry-leading," or "revolutionary"*).
*   **`project`** *(String, Required):* The project's alignment within the AAIF/Linux Foundation ecosystem.
    *   *Constraint:* Must be one of:
        *   `graduated` - Fully approved AAIF standards/projects
        *   `incubating` - Active AAIF work-in-progress standards/projects
        *   `member` - Member-contributed tools/projects
        *   `external` - Non-member open-source tools/frameworks
*   **`logo`** *(String, Optional):* Path to the item's logo asset.

### Landscape Structural Rules
*   Each **`category`** requires a non-empty `category` name and a non-empty `subcategories` list; each **`subcategory`** requires a non-empty `subcategory` name and a non-empty `items` list.
*   Category names and item names must each be unique across the whole landscape; subcategory names must be unique within their category. Names are compared case- and Unicode-normalization-insensitively.

### Landscape Validation Limits
`scripts/validate-landscape.mjs` runs in CI with the same js-yaml parser and options the site loads with, and enforces the following so a malformed or hostile file cannot break the rendered map or the validator itself:

*   **Parsing:** the file is parsed with `FAILSAFE_SCHEMA`, so every scalar is a string — a bare `123` or `2026-01-01` is read as text, matching the browser. Reused object or array nodes (YAML aliases or cycles) and merge (`<<`) keys are rejected; a scalar alias is allowed but stays within the per-field and total limits below. Nesting depth and file size (512 KB) are bounded; the size cap is what limits how much the parser materializes.
*   **Field lengths:** `name` ≤ 200, `description` ≤ 2000, `project` ≤ 50, `homepage_url` / `repo_url` ≤ 2048, `logo` ≤ 300, and `category` / `subcategory` names ≤ 120 characters.
*   **Cardinality:** at most 500 items across the whole landscape, and at most 5000 objects or arrays and 20,000 references in the whole document (a budget that stops the validation walk early on a hostile file; it does not change what the parser already materialized).
*   **URLs:** `homepage_url` and `repo_url` must be `https://`, contain no whitespace, and carry no embedded credentials.
*   **Fields:** only the fields documented above are allowed at each level; any other key is rejected.
*   **Characters:** display names and item descriptions must not contain control or format characters (for example zero-width or bidirectional-override characters).

---
