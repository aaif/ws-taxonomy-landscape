# Taxonomy Browser & Term Wizard

A single, self-contained `index.html` — no build, no server, no backend.

- **Browse** existing AAIF taxonomy terms with search + filters.
- **Propose / edit** a term, then submit it one of two ways:
  - **Create PR on GitHub** — opens GitHub's in-browser file editor **on your
    personal fork** and copies the generated entry to your clipboard. Enter your
    GitHub username; the button forks the repo (if needed), opens the fork's
    editor, and you paste, commit to a new branch, and open the PR back to
    upstream — entirely from the browser (no download, no local git).
  - **Download `create-pr.sh`** — a fully automated script that makes the
    branch, surgical commit, push, and PR for you.
- **Fill with AI** — draft the definition, scope note, and aliases for a term
  using Grok (xAI). Always review before submitting.

## AI assist (Grok / xAI)

The Propose form has a **✨ Fill with AI** button. It drafts the definition
(one sentence, vendor-neutral), an optional scope note, and aliases from the
term name, and additionally suggests **related terms**, **contrasts-with**, and
**working groups**, using Grok via the key-less [Puter](https://puter.com) SDK —
no backend and no API key. Related/contrasting suggestions are constrained to
**existing taxonomy terms** and working groups to the **fixed list**: the prompt
is given both lists and told to copy verbatim, and any value the model invents
that isn't in the taxonomy is validated out (and reported in the confirmation
banner). The UI strictly follows the browser's own design tokens (accent-blue
button, panel/border/chip colors); it does **not** import any foreign styling.

Provenance is tracked and recorded: the wizard measures how much of the final
definition survived from the AI draft (character-level) versus what you edited
by hand, and writes that ratio into the commit message and PR body, e.g.:

```
Define taxonomy term: Skill

Definition authorship: 72% AI-drafted (Grok/xAI), 28% manually edited.
```

A definition typed entirely by hand is reported as `100% human-written`; an
unedited AI draft as `100% AI-drafted … unedited`.

If the definition is **100% AI-drafted and unedited**, the wizard asks you to
confirm you have reviewed it (accuracy, vendor-neutrality) before it will
generate the PR script — no unreviewed AI text ships silently.

## Data source (no CORS)

The source of truth is
[`taxonomy/taxonomy-data.js`](https://github.com/MatthewKhouzam/ws-taxonomy-landscape/blob/main/taxonomy/taxonomy-data.js),
which assigns to `window.AAIF_TAXONOMY = [...]`.

Because it's a script that assigns to a global, we load it via `fetch()` at
this **raw** URL and evaluate the assignment in a sandboxed scope:

```
https://raw.githubusercontent.com/MatthewKhouzam/ws-taxonomy-landscape/main/taxonomy/taxonomy-data.js
```

We deliberately do **not** use a `<script src>` tag. `raw.githubusercontent.com`
serves the file as `Content-Type: text/plain` with
`X-Content-Type-Options: nosniff`, so modern browsers **refuse to execute it as
a script** (MIME mismatch under nosniff) and, worse, fire neither `onload` nor
`onerror` reliably. `fetch()` avoids all of that, and the response sends
`access-control-allow-origin: *`, so there are **no CORS issues**.

Do **not** use the `github.com/.../blob/...` URL — that returns an HTML page,
not JS. To freeze a snapshot, replace `main` with a commit SHA.

## Submitting a term

A static page can't run git, so the wizard offers two backend-free paths after
you click **Prepare PR**:

### Create PR on GitHub (in-browser, from your fork)

You won't have write access to `aaif/ws-taxonomy-landscape`, so the PR comes
from **your own fork**. Enter your GitHub username. There are two modes:

**With a token — one click, fully via the GitHub REST API.** The button:

1. Fetches your fork's `taxonomy/taxonomy-data.js` and **splices the entry** in
   the browser (same comment-preserving surgery as the local script).
2. Ensures the fork exists — creating it (`POST /repos/{upstream}/forks`) if
   needed.
3. Creates the branch (`GET .../git/ref/heads/{base}` for the base SHA, then
   `POST .../git/refs`).
4. Commits the edited file (`PUT .../contents/{path}` with the base64 content,
   commit message + provenance description, and the target branch).
5. Opens the PR to upstream (`POST /repos/{upstream}/pulls` with
   `head: {you}:{branch}`), and links you straight to it.

The token is a **your own** GitHub Personal Access Token — fine-grained with
**Contents: read & write** and **Pull requests: read & write** on your fork, or
a classic token with the `repo` scope. It is used **only** for direct calls to
`api.github.com` from your browser and is never sent anywhere else. It's kept in
memory for the session; tick **remember token** to store it in this browser's
`localStorage` instead.

**Without a token — prefilled web flow (no credentials).** The button opens
GitHub's `/new/` editor with the full edited file, commit title and description
prefilled, and copies the recommended branch name to your clipboard. You pick
*Create a new branch*, commit, and *Propose changes*. If your fork doesn't exist
yet it opens the fork page first; if the file is too large for URL limits it
falls back to a plain editor with the entry on your clipboard to paste.

GitHub's edit URL can't pre-fill an edit to an existing file, which is why the
token-less path uses `/new/` (prefill) or a manual paste rather than injecting
the change automatically.

Paste the entry just **before the closing `];`** of the
`window.AAIF_TAXONOMY = [ … ]` array, then **Commit changes → Create a new
branch → Propose changes**. GitHub opens the PR from your fork back to the
upstream repo automatically — no download and no local git.

If you leave the username blank, the button opens the **upstream** editor
instead and relies on GitHub's built-in "you don't have write access — fork
this repository?" prompt to route you through a fork.

GitHub's edit URL can't pre-fill an edit to an existing file, so the entry is
placed on your clipboard for a single paste rather than injected automatically.

### Download a script and run it locally

A fully self-contained `create-pr.sh` (bash + an embedded Python surgical
editor). You run it from the repo root:

```bash
bash create-pr.sh
```

It refuses if the data file is dirty, branches off `main`, applies a
comment-preserving edit to only `taxonomy/taxonomy-data.js`, commits with
`-s` (Signed-off-by), pushes, and opens the PR via `gh` (or prints the compare
URL if `gh` isn't installed).

## Run

Just open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server -d taxonomy-browser 8000
# http://localhost:8000
```
