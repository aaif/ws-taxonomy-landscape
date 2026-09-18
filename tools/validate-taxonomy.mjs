#!/usr/bin/env node
/**
 * Validates taxonomy/taxonomy-data.js.
 *
 * Primary guard (the regression this exists to prevent):
 *   The browser loads taxonomy-data.js directly via a <script> tag, so ANY
 *   JavaScript syntax error (e.g. an unescaped quote inside a string) takes
 *   down any taxonomy viewer, official or other. See commit 36cd708
 *   ("Fix unescaped quote in Delegation scopeNote"). We load the file in a
 *   sandbox exactly the way the browser does, which fails fast on such errors.
 *
 * Secondary guard: schema conformance per docs/data-schemas.md so malformed
 * (but syntactically valid) entries also can't reach main.
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import vm from 'node:vm';

const here = dirname(fileURLToPath(import.meta.url));
const DATA_FILE = resolve(here, '..', 'taxonomy', 'taxonomy-data.js');

const APPROVED_CATEGORIES = new Set([
  '', // deferred — allowed empty per docs/data-schemas.md
  'Agentic Threats',
  'Identity & Authorization',
  'Infrastructure & Architecture',
  'Capabilities & Interfaces',
  'Governance & Compliance',
]);

const errors = [];
const warnings = [];
const fail = (msg) => errors.push(msg);
const warn = (msg) => warnings.push(msg);

// --- Step 1: load the file the same way the browser does -------------------
let source;
try {
  source = readFileSync(DATA_FILE, 'utf8');
} catch (e) {
  console.error(`Could not read ${DATA_FILE}: ${e.message}`);
  process.exit(2);
}

// A minimal `window` shim mirrors the browser global the file assigns to.
const sandbox = { window: {} };
vm.createContext(sandbox);
try {
  // filename + line offset give readable syntax-error locations.
  new vm.Script(source, { filename: 'taxonomy/taxonomy-data.js' }).runInContext(sandbox);
} catch (e) {
  // This is the exact class of failure the regression produced.
  console.error('❌ taxonomy/taxonomy-data.js failed to parse/execute:');
  console.error(`   ${e.name}: ${e.message}`);
  console.error('\nThis would break the taxonomy browser page in the same way.');
  process.exit(1);
}

const data = sandbox.window.AAIF_TAXONOMY;

// --- Step 2: schema conformance --------------------------------------------
if (!Array.isArray(data)) {
  fail('window.AAIF_TAXONOMY is not defined as an array.');
} else {
  const seenTerms = new Set();
  const allTerms = new Set();
  for (const entry of data) {
    if (entry && typeof entry.term === 'string') allTerms.add(entry.term);
  }

  data.forEach((entry, i) => {
    const at = `entry #${i}` + (entry && entry.term ? ` ("${entry.term}")` : '');

    if (typeof entry !== 'object' || entry === null) {
      fail(`${at}: not an object.`);
      return;
    }

    // term: required, non-empty string, unique
    if (typeof entry.term !== 'string' || entry.term.trim() === '') {
      fail(`${at}: "term" is required and must be a non-empty string.`);
    } else if (seenTerms.has(entry.term)) {
      fail(`${at}: duplicate term "${entry.term}" (terms must be unique).`);
    } else {
      seenTerms.add(entry.term);
    }

    // category: required string, from approved enum (empty allowed while deferred)
    if (typeof entry.category !== 'string') {
      fail(`${at}: "category" is required and must be a string (use "" while deferred).`);
    } else if (!APPROVED_CATEGORIES.has(entry.category)) {
      fail(`${at}: "category" value "${entry.category}" is not an approved category.`);
    }

    // broaderTerm: string or null
    if (!(entry.broaderTerm === null || typeof entry.broaderTerm === 'string')) {
      fail(`${at}: "broaderTerm" must be a string or null.`);
    }

    // definition: required non-empty string
    if (typeof entry.definition !== 'string' || entry.definition.trim() === '') {
      fail(`${at}: "definition" is required and must be a non-empty string.`);
    }

    // aliases / relatedTerms / contrastsWith / workgroups: arrays of strings
    for (const field of ['aliases', 'relatedTerms', 'contrastsWith', 'workgroups']) {
      const val = entry[field];
      // aliases and workgroups are required; relatedTerms/contrastsWith default to []
      if (val === undefined) {
        if (field === 'aliases' || field === 'workgroups') {
          fail(`${at}: "${field}" is required (use [] if none).`);
        }
        continue;
      }
      if (!Array.isArray(val) || !val.every((v) => typeof v === 'string')) {
        fail(`${at}: "${field}" must be an array of strings.`);
      }
    }

    // scopeNote: optional string
    if (entry.scopeNote !== undefined && typeof entry.scopeNote !== 'string') {
      fail(`${at}: "scopeNote" must be a string when present.`);
    }

    // "Universal" is not a valid workgroup value
    if (Array.isArray(entry.workgroups) && entry.workgroups.includes('Universal')) {
      fail(`${at}: "Universal" is not a valid workgroups value (use [] instead).`);
    }

    // relatedTerms / contrastsWith should reference existing terms.
    // Warning only: a term may intentionally reference a counterpart that has
    // not yet been admitted to the taxonomy, so this must not block CI.
    for (const field of ['relatedTerms', 'contrastsWith']) {
      const val = entry[field];
      if (Array.isArray(val)) {
        for (const ref of val) {
          if (!allTerms.has(ref)) {
            warn(`${at}: "${field}" references term "${ref}" which is not defined in the taxonomy.`);
          }
        }
      }
    }
  });
}

if (warnings.length > 0) {
  console.warn(`⚠️  ${warnings.length} warning(s):`);
  for (const w of warnings) console.warn(`  - ${w}`);
  console.warn('');
}

if (errors.length > 0) {
  console.error(`❌ taxonomy-data.js validation failed with ${errors.length} error(s):\n`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

console.log(`✅ taxonomy-data.js is valid: parsed cleanly and ${data.length} entries conform to the schema.`);
