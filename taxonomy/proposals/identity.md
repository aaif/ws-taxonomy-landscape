# Term proposal: Identity

> **Status:** Draft proposal for workstream discussion. Not yet merged into
> `taxonomy/taxonomy-data.js`.
>
> Per `CONTRIBUTING.md` §2 and `docs/data-schemas.md`, a definition is only
> written into the taxonomy data after (a) the term has received a **KEEP**
> vote at the weekly Taxonomy Workstream sync, and (b) its definition is
> agreed term-by-term. `Identity` is **not yet an accepted term** in the
> taxonomy, so this document proposes the term and a definition for that
> discussion rather than backfilling the deferred `definition` field.

## Proposed preferred term

**Identity**

## Proposed definition (one sentence)

> A set of attributes related to an entity.

This reproduces the ISO/IEC 24760-1 verbatim entry: *"set of attributes
(3.1.3) related to an entity (3.1.1)."* The entry lists **partial identity**
as an alternative term.

## Primary citation

**ISO/IEC 24760-1:2025**, *Information security, cybersecurity and privacy
protection — A framework for identity management — Part 1: Core concepts and
terminology*, §3.1.2. The 2025 third edition replaces the 2019 edition.

## Scope note (proposed)

The ISO definition does **not** require uniqueness. The accompanying notes
permit an entity to have multiple identities, and permit different entities to
share an identity. Uniqueness within a domain is treated separately under
*identifier* (ISO/IEC 24760-1 §3.1.4). ISO's examples of entities include
people, organizations, devices, applications, and services.

## Required disambiguation — Identity vs. Identifier

`AGENTS.md` §3 (Paired Contrast Disambiguation Protocol) requires contrasting
terms to state explicitly how they differ and to be linked in the data. The
existing `Identifier` entry is defined as *"a unique and stable label or
reference."*

- An **identity** is a *set of attributes* about an entity; it is not required
  to be unique, and one entity may hold several.
- An **identifier** is a *single unique, stable label* used to pick out an
  entity within a scope.

Proposed linkage when the entry is added: `relatedTerms: ['Identifier']` (and a
reciprocal `relatedTerms: ['Identity']` on the `Identifier` entry), or
`contrastsWith` if the workstream judges them an adjacent-contrast pair rather
than merely associated. Any change to the existing `Identifier` entry needs
Identity & Trust Domain Editor sign-off (`AGENTS.md` §4).

## Proposed workgroups

`['Identity & Trust']` — consistent with the other Identity & Trust entries
(`Trust`, `Identifier`, `Attestation`, `Delegation`).

## Proposed taxonomy entry (for the eventual, post-KEEP PR)

Note the deferred fields (`category: ''`, `broaderTerm: null`) follow the
initial-check-in convention in `docs/data-schemas.md`.

```javascript
{
  term: 'Identity',
  category: '',
  aliases: ['Partial identity'],
  broaderTerm: null,
  definition: 'A set of attributes related to an entity.',
  scopeNote: 'Reproduces ISO/IEC 24760-1:2025 §3.1.2 ("set of attributes related to an entity"). The definition does not require uniqueness: an entity may have multiple identities, and different entities may share an identity. Uniqueness within a domain is handled by Identifier (ISO/IEC 24760-1 §3.1.4). ISO entity examples include people, organizations, devices, applications, and services.',
  relatedTerms: ['Identifier'],
  contrastsWith: [],
  workgroups: ['Identity & Trust']
}
```

## Sources

- ISO/IEC 24760-1:2025 (current edition), §3.1.2 — ISO Online Browsing
  Platform: <https://www.iso.org/obp/ui#iso:std:iso-iec:24760:-1:ed-3:v1:en>
- ISO/IEC 24760-1:2019 (preceding edition), §3.1.2 — public PDF preview,
  printed page 1 / PDF page 7.
- ISO/IEC 24760-1:2011 (original edition), §3.1.2 — public PDF preview,
  printed page 2.
- ISO/IEC JTC 1/SC 27 terminology glossary (CD 6, 2025-09-02), PDF page 87 —
  reproduces the definition and attributes it to ISO/IEC 24760-1:2019 §3.1.2;
  also records adoption in ISO/IEC 29115:2013 §3.13 and ISO/IEC 29191:2012 §2.5.

> These citations were supplied with the request. The ISO Online Browsing
> Platform renders term content client-side and could not be independently
> retrieved verbatim by automated fetch during drafting; a reviewer with OBP
> access should confirm the §3.1.2 wording before merge.

<!-- Content describing the ISO definition was rephrased for compliance with
licensing restrictions; the short definitional phrase is reproduced as a
verbatim standards term for citation accuracy. -->
