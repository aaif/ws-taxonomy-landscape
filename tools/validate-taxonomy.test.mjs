#!/usr/bin/env node
/**
 * Tests for tools/validate-taxonomy.mjs.
 *
 * Run with:  node --test tools/
 *
 * These tests write throwaway fixtures to a temp dir, point the validator at
 * them via TAXONOMY_DATA_FILE, and assert on its exit code. They cover:
 *   1. Valid data passes.
 *   2. The original regression (an unescaped quote inside a string) fails —
 *      "make sure it doesn't happen again".
 *   3. A schema violation fails.
 *   4. The validator PARSES rather than EXECUTES: a fixture containing code
 *      with a side effect must never run that code.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const VALIDATOR = resolve(here, 'validate-taxonomy.mjs');

const res_dir_cleanup = [];

function runValidator(dataFileContents, extraEnv = {}) {
  const dir = mkdtempSync(join(tmpdir(), 'taxonomy-test-'));
  res_dir_cleanup.push(dir);
  const dataFile = join(dir, 'taxonomy-data.js');
  writeFileSync(dataFile, dataFileContents, 'utf8');
  const res = spawnSync(process.execPath, [VALIDATOR], {
    env: { ...process.env, TAXONOMY_DATA_FILE: dataFile, ...extraEnv },
    encoding: 'utf8',
  });
  return { ...res, dir, dataFile };
}

test.after(() => {
  for (const d of res_dir_cleanup) {
    try { rmSync(d, { recursive: true, force: true }); } catch { /* ignore */ }
  }
});

const validEntry = `{
    term: 'Harness',
    category: '',
    aliases: [],
    broaderTerm: null,
    definition: 'A control layer between a model and the world.',
    scopeNote: "It's fine to have single quotes inside a double-quoted string.",
    relatedTerms: [],
    contrastsWith: [],
    workgroups: []
  }`;

test('valid data passes (exit 0)', () => {
  const src = `window.AAIF_TAXONOMY = [\n  ${validEntry}\n];\n`;
  const res = runValidator(src);
  assert.equal(res.status, 0, res.stdout + res.stderr);
  assert.match(res.stdout, /is valid/);
});

test('regression: unescaped quote inside a string fails (exit 1)', () => {
  // An apostrophe inside a single-quoted string closes the string early —
  // exactly the commit 36cd708 regression this validator exists to catch.
  const brokenEntry = `{
    term: 'Delegation',
    category: '',
    aliases: [],
    broaderTerm: null,
    definition: 'A subagent's authority traces back to a principal.',
    relatedTerms: [],
    contrastsWith: [],
    workgroups: []
  }`;
  const src = `window.AAIF_TAXONOMY = [\n  ${brokenEntry}\n];\n`;
  const res = runValidator(src);
  assert.equal(res.status, 1, 'expected validation failure');
  assert.match(res.stderr, /failed to parse/);
});

test('schema violation fails (exit 1)', () => {
  // Missing required "definition" and "term".
  const badEntry = `{
    category: '',
    aliases: [],
    broaderTerm: null,
    relatedTerms: [],
    contrastsWith: [],
    workgroups: []
  }`;
  const src = `window.AAIF_TAXONOMY = [\n  ${badEntry}\n];\n`;
  const res = runValidator(src);
  assert.equal(res.status, 1, 'expected validation failure');
  assert.match(res.stderr, /validation failed/);
});

test('bad category is rejected (exit 1)', () => {
  const entry = validEntry.replace("category: ''", "category: 'Not A Real Category'");
  const src = `window.AAIF_TAXONOMY = [\n  ${entry}\n];\n`;
  const res = runValidator(src);
  assert.equal(res.status, 1);
  assert.match(res.stderr, /not an approved category/);
});

test('security: file is parsed, not executed (no side effects run)', () => {
  const dir = mkdtempSync(join(tmpdir(), 'taxonomy-sec-'));
  res_dir_cleanup.push(dir);
  const sentinel = join(dir, 'SHOULD_NOT_EXIST.txt');
  // A hostile PR could try to run code at load time. If the validator
  // EXECUTED the file, this writeFileSync would create the sentinel.
  const dataFile = join(dir, 'taxonomy-data.js');
  const hostile = `require('node:fs').writeFileSync(${JSON.stringify(sentinel)}, 'pwned');\n`
    + `window.AAIF_TAXONOMY = [\n  ${validEntry}\n];\n`;
  writeFileSync(dataFile, hostile, 'utf8');

  const res = spawnSync(process.execPath, [VALIDATOR], {
    env: { ...process.env, TAXONOMY_DATA_FILE: dataFile },
    encoding: 'utf8',
  });

  // The sentinel must NOT exist: the code was never executed. This is the
  // core security guarantee — the validator reads the array literal as data
  // and ignores surrounding statements entirely, so PR-controlled code in the
  // file (like the require() above) never runs in CI.
  assert.equal(existsSync(sentinel), false, 'validator executed PR-controlled code!');
  // Sanity: the process still terminated (either pass or fail is acceptable;
  // what matters is that no side effect ran).
  assert.notEqual(res.status, null, 'validator did not exit cleanly');
});
