# Data Schema Specifications & Guidelines

To ensure automated builds, parsing pipelines, and UI mindmap rendering run successfully, all additions must strictly conform to the schemas documented below.

---

## A. Taxonomy Glossary Schema (`taxonomy/taxonomy-data.js`)

Each entry in the master taxonomy array is a JavaScript object representing a concept in our SKOS-Lite taxonomy.

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
*   **`category`** *(String, Required):* The primary organization bucket.
    *   *Constraint:* Must be one of the following approved categories:
        *   `Agentic Threats`
        *   `Identity & Authorization`
        *   `Infrastructure & Architecture`
        *   `Capabilities & Interfaces`
        *   `Governance & Compliance`
*   **`aliases`** *(Array of Strings, Required):* Synonyms, alternate spellings, or historical terms. If a term is a synonym of an existing term, add it here instead of creating a new object. Use `[]` if none.
*   **`broaderTerm`** *(String or null, Required):* The direct parent concept in the mindmap hierarchy.
    *   *Rule:* For example, the broader term of `Agent derailment` is `Agentic Misbehavior`.
    *   *Root nodes:* If the term is a top-level conceptual category, set this to `null`.
*   **`definition`** *(String, Required):* A clear, technical, pre-competitive definition.
    *   *Content Rule:* Vendor-neutral and objective. If the term represents an adjacent contrasting concept (e.g., *Tool* vs. *Skill*), the definition MUST explicitly state how it differs from its counterpart.
*   **`scopeNote`** *(String, Optional):* Captures historical context, meeting review dates, or explanations of conceptual boundaries between working groups.
*   **`relatedTerms`** *(Array of Strings, Optional):* Maps associative `skos:related` conceptual linkages (e.g., `["Skill", "Primitive"]`). Defaults to `[]`.
*   **`contrastsWith`** *(Array of Strings, Optional):* Explicitly links paired contrasting terms (e.g., `["Tool"]`). Defaults to `[]`.
*   **`workgroups`** *(Array of Strings, Required):* The working groups that share interest or joint ownership of this term (e.g., `["Security & Privacy", "Identity & Trust"]`).

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
            repo_url: https://github.com/... (optional)
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

*   **Parsing:** the file is parsed with `FAILSAFE_SCHEMA`, so every scalar is a string — a bare `123` or `2026-01-01` is read as text, matching the browser. YAML anchors, aliases, and merge (`<<`) keys are rejected, and nesting depth and file size (2 MB) are bounded.
*   **Field lengths:** `name` ≤ 200, `description` ≤ 2000, `homepage_url` / `repo_url` ≤ 2048, `logo` ≤ 300, and `category` / `subcategory` names ≤ 120 characters.
*   **Cardinality:** at most 500 items across the whole landscape.
*   **URLs:** `homepage_url` and `repo_url` must be `https://`, contain no whitespace, and carry no embedded credentials.
*   **Fields:** only the fields documented above are allowed at each level; any other key is rejected.
*   **Characters:** display names must not contain control or format characters (for example zero-width or bidirectional-override characters).

---
