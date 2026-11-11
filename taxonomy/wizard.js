/**
 * AAIF Taxonomy — Propose / Edit Term Wizard
 *
 * Consolidated into the main Taxonomy Explorer (index.html) per Junjie Bu
 * (@mindpower) review on PR #90. This module is intentionally:
 *   - Backend-free: it reads the taxonomy from the already-loaded
 *     window.AAIF_TAXONOMY global (same-origin taxonomy-data.js) — no fetch,
 *     no CORS, no raw.githubusercontent.com dependency.
 *   - Credential-free submission: NO GitHub Personal Access Token input. The
 *     PR is opened via GitHub's own token-less in-browser web flow, or a
 *     downloadable create-pr.sh script that runs locally.
 *   - Optional AI assist via the key-less Puter SDK. It is model-AGNOSTIC: the
 *     dropdown lists EVERY model Puter exposes (no single vendor/model such as
 *     Grok is privileged or defaulted). The human reviews before submitting.
 *
 * Validation guardrails preserved from the prototype:
 *   - Aliases may NOT collide with an existing primary term (#78).
 *   - relatedTerms / contrastsWith must reference existing taxonomy terms.
 */
(function () {
  "use strict";

  const REPO = "aaif/ws-taxonomy-landscape";
  const DATA_FILE = "taxonomy/taxonomy-data.js";
  const BASE_BRANCH = "main";
  const WORKGROUPS = [
    "Accuracy & Reliability",
    "Agentic Commerce",
    "Governance, Risk & Regulatory Alignment",
    "Identity & Trust",
    "Observability & Traceability",
    "Security & Privacy",
    "Workflows & Process Integration",
  ];
  const PENDING_RE = /^definition pending/i;
  const PENDING_TEXT =
    "Definition pending — term accepted; definition under working group discussion.";

  const STATE = { terms: [], byName: {} };

  const $ = (id) => document.getElementById(id);
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
  function isPending(t) {
    return !t.definition || PENDING_RE.test(t.definition.trim());
  }
  function banner(kind, msg) {
    const b = $("wizard-banner");
    if (!b) return;
    b.className = "wizard-msg " + kind;
    b.innerHTML = msg;
    b.style.display = "block";
    if (kind === "ok") setTimeout(() => { b.style.display = "none"; }, 6000);
  }

  // ---------- boot ----------
  function boot() {
    const data = window.AAIF_TAXONOMY || [];
    STATE.terms = data.slice().sort((a, b) => a.term.localeCompare(b.term));
    STATE.byName = {};
    STATE.terms.forEach((t) => (STATE.byName[t.term.toLowerCase()] = t));

    renderWorkgroups();
    wireTabs();
    wireTagboxes();
    wireTermField();
    $("wiz-definition").addEventListener("input", checkSentences);
    $("wiz-gen-btn").addEventListener("click", generate);

    // AI assist (any model exposed by the Puter SDK).
    AI.init();
  }

  // ---------- tab integration with the existing explorer ----------
  function wireTabs() {
    const proposeTab = $("main-tab-propose");
    const proposeView = $("propose-view-container");
    const otherTabs = [
      $("main-tab-split"),
      $("main-tab-grid"),
      $("main-tab-mindmap"),
    ].filter(Boolean);
    const otherViews = [
      $("split-layout-container"),
      $("grid-view-container"),
      $("mindmap-view-container"),
    ].filter(Boolean);

    proposeTab.addEventListener("click", () => {
      otherTabs.forEach((t) => { t.classList.remove("active"); t.setAttribute("aria-selected", "false"); });
      proposeTab.classList.add("active");
      proposeTab.setAttribute("aria-selected", "true");
      otherViews.forEach((v) => { v.style.display = "none"; });
      proposeView.style.display = "block";
    });

    // When any existing tab is chosen, hide the propose view. app.js already
    // shows the correct explorer container, so we only clean up our own view.
    otherTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        proposeTab.classList.remove("active");
        proposeTab.setAttribute("aria-selected", "false");
        proposeView.style.display = "none";
      });
    });
  }

  // ---------- workgroups ----------
  function renderWorkgroups() {
    const el = $("wiz-wg-list");
    el.innerHTML = "";
    WORKGROUPS.forEach((wg) => {
      const lab = document.createElement("label");
      lab.innerHTML = `<input type="checkbox" value="${esc(wg)}"> ${esc(wg)}`;
      el.appendChild(lab);
    });
  }

  // ---------- tag boxes ----------
  function wireTagboxes() {
    document.querySelectorAll(".wizard-tagbox[data-tags]").forEach((box) => {
      const input = box.querySelector("input");
      const suggest = box.querySelector(".wizard-suggest");
      const validate = box.dataset.validate === "existing";
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          const active = suggest && suggest.querySelector(".active");
          addTag(box, active ? active.textContent.replace(/\s+\(pending\)$/, "") : input.value, validate);
          input.value = "";
          if (suggest) suggest.style.display = "none";
        } else if (e.key === "Backspace" && !input.value) {
          const tags = box.querySelector(".wizard-tags");
          if (tags.lastElementChild) tags.lastElementChild.remove();
        } else if (suggest && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
          e.preventDefault();
          moveActive(suggest, e.key === "ArrowDown" ? 1 : -1);
        }
      });
      if (validate) {
        input.addEventListener("input", () => showSuggest(suggest, input.value, box));
        input.addEventListener("blur", () => setTimeout(() => (suggest.style.display = "none"), 150));
      }
    });
  }
  function currentTags(box) {
    return [...box.querySelectorAll(".wizard-tags .wizard-chip")].map((c) => c.dataset.value);
  }
  function addTag(box, value, validate, opts) {
    value = (value || "").trim();
    if (!value) return;
    if (currentTags(box).some((v) => v.toLowerCase() === value.toLowerCase())) return;
    if (validate) {
      const match = STATE.byName[value.toLowerCase()];
      if (!match) {
        banner("err", `"${esc(value)}" is not an existing taxonomy term.`);
        return;
      }
      value = match.term;
    }
    // Aliases must NOT collide with an existing primary term: an alias that is
    // also a real term creates an ambiguous reference. Reject on interactive
    // adds; programmatic prefill (opts.silent) drops it quietly so loading an
    // existing entry doesn't spray errors, but the clashing alias is still not
    // re-submittable. (Validation alignment from #78.)
    if (box.dataset.tags === "aliases") {
      const clash = STATE.byName[value.toLowerCase()];
      if (clash) {
        if (!(opts && opts.silent)) {
          banner("err", `"${esc(clash.term)}" is already an existing taxonomy term, so it can't be used as an alias.`);
        }
        return;
      }
    }
    const tags = box.querySelector(".wizard-tags");
    const chip = document.createElement("span");
    chip.className = "wizard-chip";
    chip.dataset.value = value;
    chip.innerHTML = `${esc(value)} <button type="button" aria-label="Remove">×</button>`;
    chip.querySelector("button").addEventListener("click", () => chip.remove());
    tags.appendChild(chip);
  }
  function showSuggest(suggest, q, box) {
    q = q.trim().toLowerCase();
    if (!q) { suggest.style.display = "none"; return; }
    const chosen = new Set(currentTags(box).map((v) => v.toLowerCase()));
    const termVal = $("wiz-term").value.trim().toLowerCase();
    const matches = STATE.terms
      .filter((t) => t.term.toLowerCase().includes(q) && !chosen.has(t.term.toLowerCase()) && t.term.toLowerCase() !== termVal)
      .slice(0, 8);
    suggest.innerHTML = "";
    if (!matches.length) { suggest.style.display = "none"; return; }
    matches.forEach((t, i) => {
      const d = document.createElement("div");
      if (i === 0) d.className = "active";
      d.textContent = t.term;
      if (isPending(t)) {
        const s = document.createElement("span");
        s.className = "pending";
        s.textContent = "  (pending)";
        d.appendChild(s);
      }
      d.addEventListener("mousedown", (e) => {
        e.preventDefault();
        addTag(box, t.term, true);
        box.querySelector("input").value = "";
        suggest.style.display = "none";
      });
      suggest.appendChild(d);
    });
    suggest.style.display = "block";
  }
  function moveActive(suggest, dir) {
    const items = [...suggest.children];
    const idx = items.findIndex((i) => i.classList.contains("active"));
    if (idx >= 0) items[idx].classList.remove("active");
    const next = (idx + dir + items.length) % items.length;
    if (items[next]) items[next].classList.add("active");
  }

  // ---------- term field ----------
  function wireTermField() {
    const input = $("wiz-term");
    const suggest = $("wiz-term-suggest");
    input.addEventListener("input", () => {
      const q = input.value.trim().toLowerCase();
      updateTermBadge();
      if (!q) { suggest.style.display = "none"; return; }
      const matches = STATE.terms.filter((t) => t.term.toLowerCase().includes(q)).slice(0, 8);
      suggest.innerHTML = "";
      if (!matches.length) { suggest.style.display = "none"; return; }
      matches.forEach((t, i) => {
        const d = document.createElement("div");
        if (i === 0) d.className = "active";
        d.textContent = t.term;
        if (isPending(t)) {
          const s = document.createElement("span");
          s.className = "pending";
          s.textContent = "  (pending)";
          d.appendChild(s);
        }
        d.addEventListener("mousedown", (e) => {
          e.preventDefault();
          input.value = t.term;
          suggest.style.display = "none";
          prefill(t);
          updateTermBadge();
        });
        suggest.appendChild(d);
      });
      suggest.style.display = "block";
    });
    input.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        moveActive(suggest, e.key === "ArrowDown" ? 1 : -1);
      } else if (e.key === "Enter") {
        const active = suggest.querySelector(".active");
        if (active && suggest.style.display !== "none") {
          e.preventDefault();
          input.value = active.textContent.replace(/\s+\(pending\)$/, "");
          suggest.style.display = "none";
          const t = STATE.byName[input.value.toLowerCase()];
          if (t) prefill(t);
          updateTermBadge();
        }
      }
    });
    input.addEventListener("blur", () => setTimeout(() => (suggest.style.display = "none"), 150));
  }
  function updateTermBadge() {
    const badge = $("wiz-term-badge");
    const t = STATE.byName[$("wiz-term").value.trim().toLowerCase()];
    if (t) {
      badge.style.display = "inline-block";
      badge.className = "wizard-badge " + (isPending(t) ? "pending" : "defined");
      badge.textContent = isPending(t) ? "existing • pending" : "existing • defined";
    } else {
      badge.style.display = "none";
    }
  }
  function prefill(t) {
    $("wiz-definition").value = t.definition && !isPending(t) ? t.definition : "";
    $("wiz-scope").value = t.scopeNote || "";
    fillTags("aliases", t.aliases || []);
    fillTags("relatedTerms", t.relatedTerms || []);
    fillTags("contrastsWith", t.contrastsWith || []);
    const set = new Set(t.workgroups || []);
    document.querySelectorAll("#wiz-wg-list input").forEach((cb) => (cb.checked = set.has(cb.value)));
    AI.resetBaseline();
    checkSentences();
  }
  function fillTags(name, values) {
    const box = document.querySelector(`.wizard-tagbox[data-tags="${name}"]`);
    box.querySelector(".wizard-tags").innerHTML = "";
    values.forEach((v) => addTag(box, v, false, { silent: true }));
  }
  function checkSentences() {
    const txt = $("wiz-definition").value.trim();
    const parts = txt.split(/[.!?]+(?:\s|$)/).filter((s) => s.trim());
    $("wiz-sentence-warn").style.display = parts.length > 1 ? "block" : "none";
  }

  // ---------- generate ----------
  function slug(s) {
    return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 50);
  }
  function commitSubject(p, exists) {
    return (exists ? "Update" : "Define") + " taxonomy term: " + p.term;
  }
  // Authorship provenance: how much of the final entry survived from the AI
  // draft (if any) versus human editing. Recorded in the commit body and PR.
  function provenanceLine(attribution) {
    const attr = attribution || { origin: "manual", defPct: 0, scopePct: null, totalHumanPct: 100 };
    if (attr.origin === "manual") return "Authorship: 100% human-written (no AI draft used).";
    const scope = attr.scopePct == null ? "n/a" : attr.scopePct + "% AI";
    return (
      "Authorship (AI-drafted vs. human): definition " + attr.defPct + "% AI, scope " +
      scope + ", total " + attr.totalHumanPct + "% human across the patch" +
      (attr.model ? " (model: " + attr.model + ")" : "") + "."
    );
  }
  function prBody(p, exists, attribution) {
    const action = exists ? "update" : "add";
    return `Proposed via the Taxonomy Term Wizard (${action}). Touches only ${DATA_FILE}.\n\n${provenanceLine(attribution)}`;
  }

  // Splice the generated entry into the raw data file text in the browser,
  // mirroring the surgical, comment-preserving edit the bash/Python script
  // performs — so the token-less GitHub web flow can prefill the FULL file.
  function spliceEntry(rawText, term, entryText) {
    if (!rawText) return null;
    const m = /window\.AAIF_TAXONOMY\s*=\s*\[/.exec(rawText);
    if (!m) return null;
    const start = m.index + m[0].length;
    let depth = 1, i = start;
    while (i < rawText.length && depth) {
      const c = rawText[i];
      if (c === "[") depth++;
      else if (c === "]") depth--;
      i++;
    }
    const end = i - 1;
    const body = rawText.slice(start, end);
    const pat = new RegExp("\\{[^{}]*?term:\\s*'" + term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "'[^{}]*?\\}", "s");
    let newBody;
    const existing = pat.exec(body);
    if (existing) {
      newBody = body.slice(0, existing.index) + entryText.trim() + body.slice(existing.index + existing[0].length);
    } else {
      const trimmed = body.replace(/\s+$/, "");
      const sep = trimmed.endsWith("}") ? ",\n" : "\n";
      newBody = trimmed + sep + entryText + "\n";
    }
    return rawText.slice(0, start) + newBody + rawText.slice(end);
  }

  function collectPayload() {
    return {
      term: $("wiz-term").value.trim(),
      definition: $("wiz-definition").value.trim(),
      scopeNote: $("wiz-scope").value.trim(),
      aliases: currentTags(document.querySelector('.wizard-tagbox[data-tags="aliases"]')),
      relatedTerms: currentTags(document.querySelector('.wizard-tagbox[data-tags="relatedTerms"]')),
      contrastsWith: currentTags(document.querySelector('.wizard-tagbox[data-tags="contrastsWith"]')),
      workgroups: [...document.querySelectorAll("#wiz-wg-list input:checked")].map((cb) => cb.value),
    };
  }

  // Emit a JS entry object matching the file's formatting (2-space indent,
  // single quotes).
  function jsEntry(p) {
    const q = (s) => "'" + String(s).replace(/\\/g, "\\\\").replace(/'/g, "\\'") + "'";
    const arr = (a) => (a.length ? "[" + a.map(q).join(", ") + "]" : "[]");
    const def = p.definition || PENDING_TEXT;
    const lines = [
      "  {",
      "    term: " + q(p.term) + ",",
      "    category: '',",
      "    aliases: " + arr(p.aliases) + ",",
      "    broaderTerm: null,",
      "    definition: " + q(def) + ",",
    ];
    if (p.scopeNote) lines.push("    scopeNote: " + q(p.scopeNote) + ",");
    lines.push("    relatedTerms: " + arr(p.relatedTerms) + ",");
    lines.push("    contrastsWith: " + arr(p.contrastsWith) + ",");
    lines.push("    workgroups: " + arr(p.workgroups));
    lines.push("  }");
    return lines.join("\n");
  }

  function buildScript(p, exists, attribution) {
    const branch = "taxonomy/define-" + slug(p.term);
    const entry = jsEntry(p);
    const action = exists ? "update" : "add";
    const subject = commitSubject(p, exists);
    const commitBody = provenanceLine(attribution);
    const DELIM = "TAXONOMY_ENTRY_EOF";

    const py = [
      `import io, os, re, sys, json`,
      `FILE = ${JSON.stringify(DATA_FILE)}`,
      `TERM = ${JSON.stringify(p.term)}`,
      `ENTRY = open("/tmp/taxonomy_entry.txt", encoding="utf-8").read().rstrip("\\n")`,
      `src = open(FILE, encoding="utf-8").read()`,
      `m = re.search(r"window\\.AAIF_TAXONOMY\\s*=\\s*\\[", src)`,
      `if not m:`,
      `    sys.exit("Could not find window.AAIF_TAXONOMY array in " + FILE)`,
      `start = m.end()`,
      `depth = 1; i = start`,
      `while i < len(src) and depth:`,
      `    c = src[i]`,
      `    if c == '[': depth += 1`,
      `    elif c == ']': depth -= 1`,
      `    i += 1`,
      `end = i - 1  # index of closing ]`,
      `body = src[start:end]`,
      `pat = re.compile(r"\\{[^{}]*?term:\\s*'" + re.escape(TERM) + r"'[^{}]*?\\}", re.S)`,
      `existing = pat.search(body)`,
      `if existing:`,
      `    new_body = body[:existing.start()] + ENTRY.strip() + body[existing.end():]`,
      `else:`,
      `    trimmed = body.rstrip()`,
      `    sep = ",\\n" if trimmed.endswith("}") else "\\n"`,
      `    new_body = trimmed + sep + ENTRY + "\\n"`,
      `out = src[:start] + new_body + src[end:]`,
      `open(FILE, "w", encoding="utf-8").write(out)`,
      `print("Patched", FILE)`,
    ].join("\n");

    return `#!/usr/bin/env bash
#
# Auto-generated by the AAIF Taxonomy Term Wizard.
# Creates a branch, applies a surgical edit to ${DATA_FILE}, makes a
# signed-off commit, pushes, and opens a PR. Run from the repo root.
#
set -euo pipefail

REPO="${REPO}"
BASE="${BASE_BRANCH}"
BRANCH="${branch}"
FILE="${DATA_FILE}"

# --- sanity checks -----------------------------------------------------------
command -v git >/dev/null || { echo "git not found"; exit 1; }
[ -f "$FILE" ] || { echo "Run this from the repo root ($FILE not found)"; exit 1; }
if ! git diff --quiet -- "$FILE"; then
  echo "Refusing: $FILE has uncommitted changes."; exit 1
fi
ORIG_BRANCH="$(git rev-parse --abbrev-ref HEAD)"

# --- write the entry payload -------------------------------------------------
cat > /tmp/taxonomy_entry.txt <<'${DELIM}'
${entry}
${DELIM}

# --- branch ------------------------------------------------------------------
git fetch origin "$BASE" --quiet || true
git checkout -b "$BRANCH" "origin/$BASE" 2>/dev/null || git checkout -b "$BRANCH" "$BASE"

# --- surgical edit (comment-preserving) --------------------------------------
python3 - <<'${DELIM}_PY'
${py}
${DELIM}_PY

# --- commit ------------------------------------------------------------------
git add "$FILE"
git commit -s -m "${subject}" -m "Proposed via the Taxonomy Term Wizard (${action}). Touches only ${DATA_FILE}.

${commitBody}"

# --- push & PR ---------------------------------------------------------------
git push -u origin "$BRANCH"

PR_BODY="Proposed via the Taxonomy Term Wizard (${action}). Touches only ${DATA_FILE}.

${commitBody}"
if command -v gh >/dev/null; then
  gh pr create --repo "$REPO" --base "$BASE" --head "$BRANCH" \\
    --title "${subject}" --body "$PR_BODY"
else
  echo
  echo "gh CLI not found. Open the PR manually:"
  echo "  https://github.com/$REPO/compare/$BASE...$BRANCH?expand=1"
fi

git checkout "$ORIG_BRANCH" >/dev/null 2>&1 || true
echo "Done."
`;
  }

  function generate() {
    const p = collectPayload();
    if (!p.term) { banner("err", "Term is required."); return; }
    const exists = !!STATE.byName[p.term.toLowerCase()];
    const attribution = AI.attribution(p);

    // Guard: a 100% AI-drafted, entirely unedited entry must not ship
    // unreviewed. Ask the human to confirm they reviewed it first.
    if (attribution && attribution.origin === "ai" && !generate._aiConfirmed) {
      const ok = window.confirm(
        "This entry is 100% AI-drafted" + (attribution.model ? " (" + attribution.model + ")" : "") +
        " and has not been edited.\n\nYou are the author of record. Have you reviewed it and do you " +
        "confirm it is accurate and vendor-neutral?\n\nClick OK to confirm and generate the PR, or Cancel to edit it first."
      );
      if (!ok) {
        banner("warn", "Review the AI-drafted entry and edit as needed, then generate again.");
        $("wiz-definition").focus();
        return;
      }
      generate._aiConfirmed = true;
    } else if (!attribution || attribution.origin !== "ai") {
      generate._aiConfirmed = false;
    }

    const script = buildScript(p, exists, attribution);
    const entry = jsEntry(p);
    const branch = "taxonomy/define-" + slug(p.term);

    let attrText;
    if (attribution && (attribution.origin === "ai" || attribution.origin === "ai-edited")) {
      const scope = attribution.scopePct == null ? "n/a" : `${attribution.scopePct}% AI`;
      attrText = ` • Authorship: definition ${attribution.defPct}% AI / scope ${scope} / total ${attribution.totalHumanPct}% human`;
    } else {
      attrText = " • Authorship: 100% human-written";
    }

    $("wiz-result-card").style.display = "block";
    $("wiz-result-meta").textContent =
      `Action: ${exists ? "update existing" : "add new"} • Branch: ${branch} • Only ${DATA_FILE} is touched.${attrText}`;
    $("wiz-run-cmd").textContent = "bash create-pr.sh";
    $("wiz-script-preview").textContent = script;
    $("wiz-entry-preview").textContent = entry;
    $("wiz-gh-upstream").textContent = REPO;

    wireSubmit(p, exists, entry, script, branch, attribution);

    banner("ok", `Ready for "${esc(p.term)}". Create the PR directly on GitHub (no token needed), or download <code>create-pr.sh</code> and run it locally.`);
    $("wiz-result-card").scrollIntoView({ behavior: "smooth" });
  }

  // ---------- submit: token-less GitHub web flow + script download ----------
  function wireSubmit(p, exists, entry, script, branch, attribution) {
    const repoName = REPO.split("/")[1];
    const fileDir = DATA_FILE.split("/").slice(0, -1).join("/");
    const subject = commitSubject(p, exists);
    const description = prBody(p, exists, attribution);
    const recBranch = branch;
    const ghBtn = $("wiz-gh-pr-btn");

    // We read the local data file (same origin) and splice against it. Falls
    // back to nothing if unavailable — the paste flow still works.
    async function localRawText() {
      try {
        const r = await fetch("taxonomy-data.js", { cache: "no-cache" });
        if (r.ok) {
          const t = await r.text();
          if (t && !/^\s*</.test(t)) return t;
        }
      } catch (e) { /* ignore */ }
      return null;
    }
    async function splicedFileFor(ownerRepo) {
      let src = await localRawText();
      try {
        const rawFork = `https://raw.githubusercontent.com/${ownerRepo}/${BASE_BRANCH}/${DATA_FILE}`;
        const r = await fetch(rawFork, { cache: "no-cache" });
        if (r.ok) {
          const t = await r.text();
          if (t && !/^\s*</.test(t)) src = t;
        }
      } catch (e) { /* use local text */ }
      return spliceEntry(src, p.term, entry);
    }

    function buildPrefillUrl(ownerRepo, full) {
      if (!full) return null;
      const params = new URLSearchParams({
        filename: DATA_FILE.split("/").pop(),
        value: full,
        message: subject,
        description,
      });
      const url = `https://github.com/${ownerRepo}/new/${BASE_BRANCH}/${fileDir}?${params.toString()}`;
      // GitHub's /new/ prefill only honors a `value` up to roughly 8 KB of URL.
      // Above that it OPENS the editor but silently drops the file content,
      // producing a broken/empty commit (the "create a PR breaks" symptom).
      // The old 30000 cap let a ~26 KB URL through, so prefill always failed
      // for the current data file. Cap conservatively and fall back to the
      // reliable clipboard-paste flow when the file is too large.
      return url.length > 8000 ? null : url;
    }

    async function pasteFallback(ownerRepo, note) {
      let copied = false;
      try { await navigator.clipboard.writeText(entry); copied = true; } catch (e) {}
      window.open(`https://github.com/${ownerRepo}/edit/${BASE_BRANCH}/${DATA_FILE}`, "_blank", "noopener");
      banner("warn", `${copied ? "Entry copied to clipboard." : "Copy the entry below."} Couldn't prefill automatically${note ? " (" + note + ")" : ""}, so opened the plain editor — paste the entry before the closing <code>];</code>, then <b>Commit changes → Create a new branch → Propose changes</b>.`);
    }

    ghBtn.onclick = async () => {
      const user = $("wiz-gh-user").value.trim().replace(/^@/, "");
      if (user && !/^[A-Za-z0-9](?:[A-Za-z0-9]|-(?=[A-Za-z0-9])){0,38}$/.test(user)) {
        banner("err", "That doesn't look like a valid GitHub username.");
        return;
      }

      let branchCopied = false;
      try { await navigator.clipboard.writeText(recBranch); branchCopied = true; } catch (e) {}
      const branchNote = branchCopied
        ? `The branch name <code>${esc(recBranch)}</code> is on your clipboard — paste it when GitHub asks to <b>Create a new branch</b>.`
        : `Use the branch name <code>${esc(recBranch)}</code> when GitHub asks to <b>Create a new branch</b>.`;

      if (user) {
        const forkRepo = `${user}/${repoName}`;
        const forkUrl = `https://github.com/${REPO}/fork`;
        // Tri-state detection: "yes" (confirmed fork), "no" (confirmed absent /
        // 404), "unknown" (API error or rate limit — can't tell).
        let forkState = "unknown";
        try {
          const r = await fetch(`https://api.github.com/repos/${forkRepo}`, {
            headers: { Accept: "application/vnd.github+json" },
            cache: "no-cache",
          });
          if (r.ok) {
            const info = await r.json();
            const parent = info && info.parent && info.parent.full_name;
            const source = info && info.source && info.source.full_name;
            const isFork = !!info.fork && ((parent && parent.toLowerCase() === REPO.toLowerCase()) || (source && source.toLowerCase() === REPO.toLowerCase()));
            if (isFork) {
              forkState = "yes";
            } else if (info && info.fork === false) {
              // A repo with this name exists but is NOT a fork of upstream —
              // committing there would target the wrong repo. Warn and stop.
              banner("err", `<code>${esc(forkRepo)}</code> exists but is not a fork of <code>${esc(REPO)}</code>. Rename it or fork upstream first.`);
              return;
            } else {
              forkState = "no";
            }
          } else if (r.status === 404) {
            forkState = "no";
          }
        } catch (e) { /* network/rate-limit → forkState stays "unknown" */ }

        // Only send the user to the fork page when we're CERTAIN the fork is
        // missing. If the fork exists (or we can't tell), go straight to the
        // prefilled commit — GitHub routes an existing fork correctly.
        if (forkState === "no") {
          window.open(forkUrl, "_blank", "noopener");
          banner("warn", `You don't appear to have a fork yet. Opened the <b>fork page</b> for <code>${esc(REPO)}</code> — click <b>Create fork</b>, then press the button again.`);
          return;
        }

        const full = await splicedFileFor(forkRepo);
        const prefill = buildPrefillUrl(forkRepo, full);
        const forkNote = forkState === "unknown"
          ? " (couldn't verify your fork via the API — if GitHub says the fork doesn't exist, create it and try again)"
          : "";
        if (prefill) {
          window.open(prefill, "_blank", "noopener");
          banner("ok", `Opened a <b>prefilled commit</b> on your fork <code>${esc(forkRepo)}</code>: file, commit title and description are filled in.${forkNote} ${branchNote} Then <b>Propose changes</b> to open the PR.`);
        } else {
          await pasteFallback(forkRepo, "the file is too large to prefill via URL");
        }
      } else {
        const full = await splicedFileFor(REPO);
        const prefill = buildPrefillUrl(REPO, full);
        if (prefill) {
          window.open(prefill, "_blank", "noopener");
          banner("ok", `Opened a <b>prefilled commit</b> (file, commit title and description filled in). GitHub will offer to <b>fork ${esc(REPO)}</b> on commit. ${branchNote}`);
        } else {
          await pasteFallback(REPO, "the file is too large to prefill via URL");
        }
      }
    };

    const dl = $("wiz-download-btn");
    dl.onclick = () => {
      const blob = new Blob([script], { type: "text/x-shellscript" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "create-pr.sh";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    };
  }

  // ---------- AI assist: any model exposed by the Puter SDK ----------
  // Model-neutral: the dropdown lists EVERY model Puter returns, in the order
  // Puter returns them. No single vendor/model (e.g. Grok) is privileged or
  // defaulted — the first available model is simply the first in the list.
  // The human always reviews and edits before generating a PR.
  const AI = (function () {
    // Minimal fallback list only used if the live model list can't be fetched.
    const FALLBACK_MODELS = ["gpt-4o-mini"];
    let available = false;
    let models = [];
    let selectedModel = null;
    // Snapshot of the last AI-drafted payload, for authorship attribution.
    let aiDraft = null;

    function currentModel() {
      const sel = $("wiz-ai-model");
      return (sel && sel.value) || selectedModel || FALLBACK_MODELS[0];
    }

    // Flatten the various shapes Puter may return into a flat array of slugs.
    function normalize(data) {
      let out = [];
      const push = (v) => {
        if (typeof v === "string") out.push(v);
        else if (v && v.id) out.push(v.id);
        else if (v && v.name) out.push(v.name);
      };
      if (Array.isArray(data)) data.forEach(push);
      else if (data && Array.isArray(data.models)) data.models.forEach(push);
      else if (data && data.models && typeof data.models === "object")
        Object.values(data.models).forEach((l) => (Array.isArray(l) ? l.forEach(push) : push(l)));
      else if (data && typeof data === "object")
        Object.values(data).forEach((v) => (Array.isArray(v) ? v.forEach(push) : push(v)));
      return [...new Set(out.filter(Boolean))];
    }

    async function fetchModels() {
      if (typeof puter !== "undefined" && puter.ai && typeof puter.ai.listModels === "function") {
        try { const m = await puter.ai.listModels(); const n = normalize(m); if (n.length) return n; } catch (e) {}
      }
      for (const url of ["https://api.puter.com/puterai/chat/models", "https://api.puter.com/puterai/chat/models/"]) {
        try { const r = await fetch(url, { headers: { "Content-Type": "application/json" } }); if (r.ok) { const n = normalize(await r.json()); if (n.length) return n; } } catch (e) {}
      }
      return [];
    }

    function populateSelect(list) {
      const sel = $("wiz-ai-model");
      if (!sel) return;
      sel.innerHTML = "";
      // Every model Puter exposes, in Puter's own order — no reordering, no
      // Grok-first preference. Default to the first entry.
      list.forEach((m) => {
        const o = document.createElement("option");
        o.value = m;
        o.textContent = m;
        sel.appendChild(o);
      });
      sel.value = list[0];
      selectedModel = sel.value;
      // Changing the model must NOT trigger a probe — probing costs a real
      // Puter query and the daily quota is tiny (≈25/day). Just update the
      // tooltip to reflect the newly selected model.
      sel.addEventListener("change", () => {
        selectedModel = sel.value;
        if (available) setStatus("ready", "✓ AI ready", "Using model: " + currentModel());
      });
    }

    // text = short label shown inline; detail = full reason shown on hover.
    function setStatus(cls, text, detail) {
      const el = $("wiz-ai-status");
      if (!el) return;
      el.className = "wizard-ai-status " + cls;
      el.textContent = text;
      if (detail) el.title = detail;
      else el.removeAttribute("title");
    }

    // Turn a thrown error into a short status label + a longer tooltip detail,
    // so the UI explains *why* AI is unavailable instead of a generic "✗".
    function classifyError(e) {
      // Puter rejects with structured shapes like
      //   { error: { code: "auth_canceled", message: "Authentication canceled" } }
      // which have no top-level .message — so dig out code + message from the
      // nested object before falling back to a string-ified error.
      const inner = e && typeof e === "object" ? (e.error || e) : null;
      const code = (inner && (inner.code || inner.name)) || "";
      const innerMsg = (inner && inner.message) || "";
      let raw = innerMsg || code || (e && e.message) || "";
      if (!raw) {
        try { raw = typeof e === "string" ? e : JSON.stringify(e); } catch (_) { raw = String(e); }
      }
      const msg = String(raw);
      const low = (String(code) + " " + msg).toLowerCase();

      // SDK script never loaded (CDN blocked, offline, CSP, ad-blocker, file://).
      if (low.includes("sdk not loaded")) {
        return {
          label: "✗ SDK blocked",
          detail: "The Puter SDK (js.puter.com/v2/) did not load. Likely offline, blocked by an ad/script blocker or CSP, or the CDN is unreachable.",
        };
      }
      // User dismissed / canceled the Puter sign-in popup.
      if (low.includes("auth_canceled") || low.includes("cancel")) {
        return {
          label: "✗ Sign-in canceled",
          detail: "You canceled the Puter sign-in. Click \u2728 Fill with AI again and complete the sign-in popup to use AI. (" + msg + ")",
        };
      }
      // Popup blocked by the browser.
      if (low.includes("popup") || low.includes("blocked")) {
        return {
          label: "✗ Popup blocked",
          detail: "The browser blocked Puter's sign-in popup. Allow popups for this page, then click Fill with AI again. (" + msg + ")",
        };
      }
      // Not signed in / unauthorized.
      if (low.includes("auth") || low.includes("sign in") || low.includes("signin") ||
          low.includes("login") || low.includes("unauthor") || low.includes("401") ||
          low.includes("403") || low.includes("permission")) {
        return {
          label: "✗ Sign-in required",
          detail: "Puter needs you to sign in before using AI. Click Fill with AI and complete the popup. (" + msg + ")",
        };
      }
      // Rate limited / quota (Puter free tier is ~25 queries/day).
      if (low.includes("rate") || low.includes("quota") || low.includes("429") ||
          low.includes("too many") || low.includes("limit")) {
        return {
          label: "✗ Rate limited",
          detail: "Puter is rate-limiting or you've hit the daily usage quota (~25 queries/day on the free tier). Wait and retry later. (" + msg + ")",
        };
      }
      // Model-specific failure.
      if (low.includes("model") || low.includes("not found") || low.includes("404")) {
        return {
          label: "✗ Model error",
          detail: "The selected model isn't serviceable right now. Pick another model from the dropdown. (" + msg + ")",
        };
      }
      // Network / CORS / server-side failure.
      if (low.includes("fetch") || low.includes("network") || low.includes("cors") ||
          low.includes("failed to fetch") || low.includes("timeout") ||
          low.includes("500") || low.includes("502") || low.includes("503")) {
        return {
          label: "✗ Network error",
          detail: "Could not reach Puter's AI backend (network/CORS/server error). Check your connection and retry. (" + msg + ")",
        };
      }
      return {
        label: "✗ Unavailable",
        detail: "AI is unavailable: " + (msg || "unknown error") + ". See the browser console for details.",
      };
    }

    // Readiness check that costs ZERO Puter queries.
    //
    // The old implementation fired a real `puter.ai.chat("ping", …)` on every
    // page load (and again on every model change). Puter's free tier allows
    // only ~25 queries/day, so those probes silently drained the quota — and
    // once exhausted, the probe itself failed, leaving the button permanently
    // disabled with a generic "Unavailable". We now treat AI as available if
    // the SDK object is present and exposes puter.ai.chat, and we only make a
    // real request when the user explicitly clicks "Fill with AI".
    async function check() {
      setStatus("checking", "Checking…");
      try {
        if (typeof puter === "undefined") {
          await new Promise((r) => setTimeout(r, 600));
          if (typeof puter === "undefined") throw new Error("Puter SDK not loaded");
        }
        if (!puter.ai || typeof puter.ai.chat !== "function") {
          throw new Error("Puter AI chat API not available");
        }
        // SDK is loaded and the chat API exists — ready. No query spent here.
        // (Auth/quota/model errors, if any, surface when the user clicks Fill.)
        available = true;
        setStatus("ready", "✓ AI ready", "Using model: " + currentModel() + " — no query is spent until you click Fill with AI.");
        const btn = $("wiz-ai-fill-btn");
        if (btn) btn.disabled = false;
      } catch (e) {
        available = false;
        const info = classifyError(e);
        // Full reason to the console for debugging; short label + tooltip in UI.
        try { console.warn("[wizard AI] unavailable:", info.label, "-", info.detail, e); } catch (_) {}
        setStatus("off", info.label, info.detail);
        const btn = $("wiz-ai-fill-btn");
        if (btn) btn.disabled = true;
      }
    }

    const PROMPT = (term) => {
      const existing = STATE.terms.map((t) => t.term).filter((t) => t.toLowerCase() !== term.toLowerCase());
      const termList = existing.length ? existing.join(", ") : "(none available)";
      const wgList = WORKGROUPS.join(", ");
      return `You are a careful terminology editor for the AAIF (Agentic AI Foundation) taxonomy.
Given a single term, produce a vendor-neutral, standards-style entry.

Term: ${JSON.stringify(term)}

Existing taxonomy terms you may reference (choose ONLY from these, verbatim):
${termList}

Working groups you may choose from (choose ONLY from these, verbatim):
${wgList}

Rules:
- "definition": exactly ONE sentence, concise and vendor-neutral. No trailing examples.
- "scopeNote": optional clarifying context, examples or boundaries (may be empty string).
- "aliases": array of common synonyms or alternate spellings (may be empty). Do NOT include any value that is itself an existing taxonomy term.
- "relatedTerms": array of 0–4 CLOSELY related terms, each copied VERBATIM from the existing-terms list above. Never invent a term that isn't in that list. Empty array if none fit.
- "contrastsWith": array of 0–3 terms that meaningfully CONTRAST with this one, each copied VERBATIM from the existing-terms list above. Never invent one. Empty array if none fit.
- "workgroups": array of 0–3 working groups from the list above that would care about this term, copied VERBATIM. Empty array if unsure. Do NOT use "Universal".

Return ONLY a JSON object with keys: definition, scopeNote, aliases, relatedTerms, contrastsWith, workgroups. No markdown, no commentary.`;
    };

    function parseJson(raw) {
      let s = String(raw || "").trim();
      s = s.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
      const first = s.indexOf("{"), last = s.lastIndexOf("}");
      if (first >= 0 && last > first) s = s.slice(first, last + 1);
      return JSON.parse(s);
    }

    async function fill() {
      const btn = $("wiz-ai-fill-btn");
      const term = $("wiz-term").value.trim();
      if (!term) { banner("err", "Enter a term first, then let AI draft the fields."); return; }
      if (!available) {
        const statusEl = $("wiz-ai-status");
        const reason = statusEl && statusEl.title ? ` ${statusEl.title}` : "";
        banner("err", `AI (Puter) is not available right now.${esc(reason)}`);
        return;
      }

      const original = btn.textContent;
      btn.disabled = true;
      btn.textContent = "⏳ Drafting…";

      // IMPORTANT: Puter only opens its sign-in popup while the browser's
      // user-activation is still "active" (i.e. synchronously inside the click
      // handler, before any awaited microtask). If we await other work first,
      // the activation is consumed and Puter rejects with "auth_canceled"
      // WITHOUT ever showing a popup. So, still inside this gesture, kick off
      // sign-in FIRST (do not await anything before this), then await it.
      let signInPromise = null;
      try {
        const signedIn =
          (puter.auth && typeof puter.auth.isSignedIn === "function" && puter.auth.isSignedIn()) ||
          (typeof puter.isSignedIn === "function" && puter.isSignedIn());
        if (!signedIn && puter.auth && typeof puter.auth.signIn === "function") {
          // Synchronous call inside the gesture — this opens the popup.
          signInPromise = puter.auth.signIn();
        }
      } catch (_) { /* fall through; chat() will trigger auth if needed */ }

      try {
        if (signInPromise) await signInPromise;
        const res = await puter.ai.chat(PROMPT(term), { model: currentModel() });
        const content = res && res.message ? res.message.content : res;
        const obj = parseJson(content);

        $("wiz-definition").value = String(obj.definition || "").trim();
        $("wiz-scope").value = String(obj.scopeNote || "").trim();
        const aliases = Array.isArray(obj.aliases) ? obj.aliases : [];
        // fillTags routes through addTag, which already drops any alias that
        // collides with an existing primary term (#78) — silently, so a draft
        // doesn't spray errors.
        fillTags("aliases", aliases.map((a) => String(a).trim()).filter(Boolean));

        const skipped = [];
        const applyValidated = (name, values) => {
          const box = document.querySelector(`.wizard-tagbox[data-tags="${name}"]`);
          box.querySelector(".wizard-tags").innerHTML = "";
          (Array.isArray(values) ? values : []).forEach((v) => {
            const val = String(v).trim();
            if (!val) return;
            const match = STATE.byName[val.toLowerCase()];
            if (match && match.term.toLowerCase() !== term.toLowerCase()) addTag(box, match.term, false);
            else skipped.push(val);
          });
        };
        applyValidated("relatedTerms", obj.relatedTerms);
        applyValidated("contrastsWith", obj.contrastsWith);

        const wgWanted = new Set((Array.isArray(obj.workgroups) ? obj.workgroups : []).map((w) => String(w).trim().toLowerCase()));
        document.querySelectorAll("#wiz-wg-list input").forEach((cb) => {
          if (wgWanted.has(cb.value.toLowerCase())) cb.checked = true;
        });

        aiDraft = { payload: collectPayload(), model: currentModel() };

        checkSentences();
        updateTermBadge();
        const extra = skipped.length
          ? ` (skipped ${skipped.length} suggested term${skipped.length > 1 ? "s" : ""} not in the taxonomy: ${skipped.map(esc).join(", ")})`
          : "";
        banner("ok", `${esc(currentModel())} drafted an entry for "${esc(term)}" — definition, scope, aliases, related terms, contrasts and working groups.${extra} <b>Review and edit</b> before generating the PR.`);
      } catch (e) {
        const info = classifyError(e);
        try { console.warn("[wizard AI] fill failed:", info.label, "-", info.detail, e); } catch (_) {}
        banner("err", `${esc(info.label.replace(/^\u2717\s*/, ""))}: ${esc(info.detail)} Try again, pick another model, or fill the fields manually.`);
      } finally {
        btn.disabled = false;
        btn.textContent = original;
      }
    }

    // ---- authorship attribution ----
    function levenshtein(a, b) {
      a = a || ""; b = b || "";
      if (a === b) return 0;
      if (!a.length) return b.length;
      if (!b.length) return a.length;
      let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
      let cur = new Array(b.length + 1);
      for (let i = 1; i <= a.length; i++) {
        cur[0] = i;
        for (let j = 1; j <= b.length; j++) {
          const cost = a[i - 1] === b[j - 1] ? 0 : 1;
          cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
        }
        [prev, cur] = [cur, prev];
      }
      return prev[b.length];
    }
    function setSimilarityPct(draftArr, finalArr) {
      const norm = (a) => new Set((Array.isArray(a) ? a : []).map((v) => String(v).trim().toLowerCase()).filter(Boolean));
      const d = norm(draftArr), f = norm(finalArr);
      if (d.size === 0 && f.size === 0) return 100;
      let inter = 0;
      f.forEach((v) => { if (d.has(v)) inter++; });
      const union = new Set([...d, ...f]).size || 1;
      return Math.round((inter / union) * 100);
    }
    function textSimilarityPct(draft, final) {
      draft = (draft || "").trim(); final = (final || "").trim();
      if (!draft && !final) return 100;
      if (draft === final) return 100;
      const dist = levenshtein(draft, final);
      const denom = Math.max(draft.length, final.length) || 1;
      return Math.max(0, 100 - Math.round((dist / denom) * 100));
    }

    function attribution(final) {
      if (aiDraft == null) {
        return { origin: "manual", defPct: 0, scopePct: null, totalHumanPct: 100, model: null };
      }
      final = final || {};
      const d = aiDraft.payload;
      const textLen = (s) => (s || "").trim().length;
      const setLen = (a) => (Array.isArray(a) ? a : []).filter((v) => String(v).trim()).length;

      const fields = [
        { kind: "text", draft: d.definition, final: final.definition, weight: textLen(final.definition) },
        { kind: "text", draft: d.scopeNote, final: final.scopeNote, weight: textLen(final.scopeNote) },
        { kind: "set", draft: d.aliases, final: final.aliases, weight: setLen(final.aliases) },
        { kind: "set", draft: d.relatedTerms, final: final.relatedTerms, weight: setLen(final.relatedTerms) },
        { kind: "set", draft: d.contrastsWith, final: final.contrastsWith, weight: setLen(final.contrastsWith) },
        { kind: "set", draft: d.workgroups, final: final.workgroups, weight: setLen(final.workgroups) },
      ];
      let aiKept = 0, totalWeight = 0;
      fields.forEach((f) => {
        const sim = f.kind === "text" ? textSimilarityPct(f.draft, f.final) : setSimilarityPct(f.draft, f.final);
        aiKept += f.weight * (sim / 100);
        totalWeight += f.weight;
      });
      const defPct = textSimilarityPct(d.definition, final.definition);
      const scopePct = textLen(final.scopeNote) === 0 && textLen(d.scopeNote) === 0 ? null : textSimilarityPct(d.scopeNote, final.scopeNote);
      const totalAiPct = totalWeight ? Math.round((aiKept / totalWeight) * 100) : 100;
      const totalHumanPct = Math.max(0, Math.min(100, 100 - totalAiPct));
      const origin = totalHumanPct === 0 ? "ai" : "ai-edited";
      return { origin, defPct, scopePct, totalHumanPct, model: aiDraft.model };
    }

    function resetBaseline() { aiDraft = null; }

    async function init() {
      const btn = $("wiz-ai-fill-btn");
      if (btn) btn.addEventListener("click", fill);
      setStatus("checking", "Loading models…");
      models = await fetchModels();
      if (!models.length) models = FALLBACK_MODELS.slice();
      populateSelect(models);
      check();
    }

    return { init, attribution, resetBaseline, get available() { return available; } };
  })();

  // ---------- init ----------
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
