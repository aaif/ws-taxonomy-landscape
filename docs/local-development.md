# Local Development & Git Workflow Guide

This guide details the technical workflow for setting up a local preview environment and submitting code contributions to the AAIF Taxonomy & Landscape Workstream repository.

> [!IMPORTANT]
> **Current contribution scope:** Only Taxonomy changes are currently accepted. Landscape work is on the future roadmap, but its contribution and review process has not yet been accepted. Pull requests that propose Landscape changes will be closed until that process is approved and this guide is updated.

---

## 1. Local Development Setup

The standards portal is built as a pure, zero-dependency client-side web application. This allows you to preview all changes instantly.

### Running a Local Preview Server
1. Clone the repository and navigate to the directory:
   ```bash
   git clone https://github.com/aaif/ws-taxonomy-landscape.git
   cd ws-taxonomy-landscape
   ```
2. Start a lightweight local HTTP server in the repository root:
   * **Using Python 3** (available out-of-the-box on most systems):
     ```bash
     python3 -m http.server 8000
     ```
   * **Using Node.js / npx:**
     ```bash
     npx serve -l 8000
     ```
3. Open your browser and navigate to the local portal at `http://localhost:8000/`.

---

## 2. Previewing and Validating Changes

When the local server is running, preview the Taxonomy dashboard directly:

*   **Taxonomy Explorer:** Open `http://localhost:8000/taxonomy/`. Verify that your new terms render in the list, link correctly to parent concepts, and filter properly using the search input.

### Pre-Submission Validation Checklist
Before committing and pushing your changes, perform these sanity checks:
1. **JavaScript Syntax Verification:** Open the browser's Developer Tools Console (`F12` or `Cmd+Opt+I`) on the local taxonomy page. Verify that there are no JavaScript syntax errors, parsing exceptions, or warnings.
2. **Link Health:** Check that any links you add resolve correctly and use secure `https://` URLs where available.

---

## 3. Git Workflow & Submitting Pull Requests

All code contributions must be proposed via Git branches targeting the `main` branch.

1. **Create a Feature Branch:** Always create a branch dedicated to your specific term addition:
   ```bash
   git checkout -b feature/add-term-<term-name>
   ```
2. **Commit Your Changes:** Follow clean, descriptive commit conventions:
   ```bash
   git add taxonomy/taxonomy-data.js
   git commit -m "add(taxonomy): define Attestation and map to Security WG"
   ```
3. **Push to Your Fork:** Push the branch to your GitHub fork:
   ```bash
   git push origin feature/add-term-<term-name>
   ```
4. **Open a Pull Request:** Navigate to the upstream `aaif/ws-taxonomy-landscape` repository and open a Pull Request. In the description, clearly state:
   * The purpose of your additions.
   * Which Technical Working Groups are affected or aligned.
   * Tag the relevant **Domain Editors** (WG delegates) for review.

---
