# Reporting — Agent Instructions

`TEMPLATE.md` is the canonical template for the monthly update the working group submits to the Technical Committee (TC). Follow these instructions to produce a report from it.

## File Naming

Save each report as `YYYY-MM-report.md` using the year and month of the reporting period (e.g. `2026-06-report.md`).

## Cadence and Deadlines

- One report is due per calendar month, by the **last business day of the month**.
- The TC review window closes **7 calendar days** after submission.
- Merge the report once the TC signs off or the review window closes, whichever is sooner.

## Workflow

1. Copy `TEMPLATE.md` into a new file named for the reporting period (e.g. `2026-06-report.md`).
2. Delete the `HOW TO USE THIS TEMPLATE` comment block before submitting.
3. Fill in the header fields: **Reporting period** (`Month YYYY`) and **Date submitted** (`YYYY-MM-DD`). Leave **Working Group** and **Chair(s)** as-is unless they have changed.
4. Write a 2-3 sentence **Summary** capturing the month at a glance.
5. Populate **Progress Against Objectives**, tying items back to stated objectives where possible.
6. List **Blockers and Risks**. If none, write "None this month."
7. List **Decisions Needed from the TC** as explicit asks. If none, write "None."
8. List the top 2-3 priorities under **Next Month's Focus**.
9. Add relevant PRs, issues, releases, meeting notes, and dashboards under **Metrics / Links**.
10. Open a pull request titled `[Report] WS-Taxonomy & Landscape – Month YYYY` (e.g. `[Report] WS-Taxonomy & Landscape – June 2026`) and add the TC (or the designated TC GitHub team) as reviewers.
11. Add a row to the table in `README.md` for the new report. Insert the row at the top of the table (below the header) so reports remain in descending order by reporting period. The row should contain the reporting period (`YYYY-MM`), a link labeled "Full report" pointing to the report file, and a 1-2 sentence summary of the month.

## Style Guidance

- Keep it short and scannable — the TC reviews async.
- Use concise bullet points, not full paragraphs.
- State each requested decision clearly so it can be actioned in the PR.

## Sections With No Content

Keep the section heading and write "None." (or "None this month.") rather than removing the section. This keeps the structure consistent across reports.

## Communication Style

Apply these guidelines to all writing in this repository, including documents, commit messages, pull request descriptions, and responses to users:

- Do not use contrastive language.
- Do not line break with horizontal rules.
- Don't be a sycophant.
- Be direct, but don't use partial clauses in your sentence structure.
- Use complete thoughts that flow naturally.
- Provide a neutral voice that's both playful but professional at the same time.