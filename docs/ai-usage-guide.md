# AI Usage Guide

This guide explains how contributors should use AI assistance when drafting, editing, or reviewing content for the AAIF Taxonomy & Landscape Workstream.

It applies to:

- taxonomy terms and definitions
- landscape entries
- pull request descriptions
- issue proposals
- documentation changes
- review summaries

AI assistance can help contributors draft and organize material, but it does not replace human review, domain-editor judgment, or workstream consensus.

## Principles

AI-assisted contributions should be:

- human-owned
- source-checkable
- vendor-neutral
- pre-competitive
- privacy-preserving
- aligned with repository schemas and contribution rules
- clear about uncertainty

The contributor is responsible for every submitted sentence, field, link, and claim.

## Acceptable Uses

AI tools may be used to:

- turn rough notes into clearer prose
- suggest alternative wording for neutral definitions
- summarize public sources that the contributor independently checks
- identify duplicate or look-alike terms for human review
- draft pull request summaries from the actual diff
- improve grammar, structure, and accessibility
- generate checklist drafts for reviewers to refine

AI output should be treated as a draft. It must be reviewed against the repository, public source material, and the relevant workgroup context before submission.

## Prohibited Uses

Do not use AI tools to:

- invent sources, references, approvals, affiliations, or working-group consensus
- generate final definitions without domain-editor review
- merge look-alike terms without explicit working-group sign-off
- create vendor-favorable or marketing language
- submit private, confidential, or member-only content into external AI tools
- paste credentials, personal data, private mailing-list content, or private Discord content into AI tools
- bypass review requirements in `CONTRIBUTING.md`
- claim AAIF, Linux Foundation, workstream, or maintainer endorsement without explicit public evidence

If a claim cannot be verified from public evidence or approved workstream material, do not submit it as fact.

## Source Handling

When AI assistance is used with source material:

1. Prefer public sources.
2. Keep links to the sources that shaped the contribution.
3. Verify the source directly instead of trusting an AI summary.
4. Quote sparingly and only when the wording itself matters.
5. Convert source-specific wording into neutral taxonomy language.
6. Mark unresolved questions in the PR or issue instead of guessing.

For landscape entries, contributors should verify the project name, repository URL, license, website, and category directly from source repositories or official project pages.

For taxonomy terms, contributors should verify that the term is not already present and that it does not erase a distinct working-group meaning.

## Human Review Requirements

Before submitting AI-assisted content, the contributor should check:

- Does the change match the repository schema?
- Is every factual claim verified?
- Is the language vendor-neutral and pre-competitive?
- Are working-group boundaries respected?
- Are aliases true synonyms rather than adjacent concepts?
- Are related or contrasting terms called out clearly?
- Does the contribution avoid private or confidential material?
- Does the PR explain where human judgment is still needed?

Domain Editors and maintainers can request changes, additional source links, or removal of AI-assisted text that is not sufficiently grounded.

## Disclosure In Pull Requests

If AI assistance materially shaped a contribution, include a short note in the PR body.

Example:

```text
AI assistance note: AI assistance was used to draft or revise wording. I reviewed the final text against the repository schema, public source material, and the contribution guidelines before submitting.
```

If AI was used only for spelling, grammar, or formatting, a disclosure is optional unless a maintainer asks for it.

## Review Checklist

Reviewers can use this checklist when AI assistance is disclosed or suspected:

- [ ] The contribution has a human author taking responsibility for the final text.
- [ ] Public sources or repository context support the factual claims.
- [ ] No private, confidential, credential, or personal data is included.
- [ ] Definitions remain neutral and do not promote a vendor or product.
- [ ] AI-generated wording has been edited into the workstream's voice.
- [ ] The contribution does not imply unearned consensus or endorsement.
- [ ] Unresolved questions are marked for human review.

## When To Pause

Pause and ask for maintainer or domain-editor guidance when:

- the AI output changes the meaning of a term
- the content appears to resolve a working-group disagreement
- the wording could affect compliance, security, antitrust, or legal interpretation
- the source material is private or member-only
- the contribution depends on a claim that cannot be verified publicly

The safest path is to submit a smaller, source-backed proposal and let the workstream review it openly.
