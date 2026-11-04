# Taxonomy Explorer & Term Wizard

A single, self-contained site — no build, no server, no backend, no credentials.
The **Browse** experience and the **Propose / Edit Term** wizard both live in
[`index.html`](index.html).

- **Browse** existing AAIF taxonomy terms with search, filters, a grid card
  view, a main-detail split view, and a visual mindmap.
- **Propose / edit** a term from the **Propose / Edit Term** tab, then submit it
  one of two ways:
  - **Create PR on GitHub (token-less web flow)** — opens GitHub's own
    in-browser commit page, prefilled with the full edited file, commit title,
    and description, and copies the recommended branch name to your clipboard.
    Enter your GitHub username to target your personal fork; pick *Create a new
    branch → Propose changes* and GitHub opens the PR back to upstream. No
    download, no local git, and **no access token is ever requested or
    transmitted**.
  - **Download `create-pr.sh`** — a fully automated script that makes the
    branch, surgical commit, push, and PR for you.
- **Fill with AI** — optionally draft the definition, scope note, aliases,
  related terms, contrasts, and working groups for a term. Always review before
  submitting.

## AI assist (Fill with AI)

The Propose form has a **✨ Fill with AI** button backed by the key-less
[Puter](https://puter.com) SDK — no backend and no API key. The model dropdown
lists **every model Puter exposes**, in Puter's own order; no single vendor or
model is privileged or defaulted — pick whichever you like. Related/contrasting
suggestions are constrained to **existing taxonomy terms** and working groups to
the **fixed list** (the prompt is given both lists and told to copy verbatim;
anything the model invents is validated out and reported). Aliases the model
proposes that collide with an existing primary term are dropped (see #78). The
UI follows the explorer's own design tokens; it imports no foreign styling.

Authorship provenance is tracked: the wizard measures how much of the final
entry survived from the AI draft (character-level for text, set overlap for
lists) versus what you edited, and writes that ratio — plus the model used —
into the commit message and PR body. If an entry is **100% AI-drafted and
unedited**, the wizard asks you to confirm you reviewed it before generating the
PR, so no unreviewed AI text ships silently.

## Validation guardrails

- **Aliases cannot collide with primary terms.** An alias that is also an
  existing primary term creates an ambiguous reference, so the wizard rejects it
  (see [#78](https://github.com/aaif/ws-taxonomy-landscape/issues/78)).
- **Related / contrasting terms must already exist.** The *Related terms* and
  *Contrasts with* fields autocomplete from, and are validated against, the
  current taxonomy; invented terms are not accepted.

## Data source

The source of truth is
[`taxonomy/taxonomy-data.js`](taxonomy-data.js), which assigns the vocabulary to
`window.AAIF_TAXONOMY = [...]`. Because the wizard is served from the same
directory as the data file, `index.html` loads it directly with a normal
`<script src="taxonomy-data.js">` tag — no `fetch()`, no CORS, no raw GitHub URL.

## Submitting a term

A static page can't run git, so the wizard offers two backend-free paths after
you click **Prepare PR**:

### Create PR on GitHub (in-browser, from your fork)

You won't have write access to `aaif/ws-taxonomy-landscape`, so the PR comes
from **your own fork**. Enter your GitHub username; the button opens GitHub's
`/new/` editor with the full edited file, commit title, and description
prefilled, and copies the recommended branch name to your clipboard. Pick
*Create a new branch*, commit, and *Propose changes* — GitHub opens the PR from
your fork back to the upstream repo automatically.

If your fork doesn't exist yet, the button opens the fork page first. If the
file is too large for URL limits, it falls back to the plain editor with the
entry on your clipboard: paste it just **before the closing `];`** of the
`window.AAIF_TAXONOMY = [ … ]` array, then **Commit changes → Create a new
branch → Propose changes**.

If you leave the username blank, the button opens the **upstream** editor and
relies on GitHub's built-in "you don't have write access — fork this
repository?" prompt to route you through a fork.

### Download a script and run it locally

A fully self-contained `create-pr.sh` (bash + an embedded Python surgical
editor). You run it from the repo root:

```bash
bash create-pr.sh
```

It refuses if the data file is dirty, branches off `main`, applies a
comment-preserving edit to only `taxonomy/taxonomy-data.js`, commits with `-s`
(Signed-off-by), pushes, and opens the PR via `gh` (or prints the compare URL if
`gh` isn't installed).

## Run

Just open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server -d taxonomy 8000
# http://localhost:8000
```
