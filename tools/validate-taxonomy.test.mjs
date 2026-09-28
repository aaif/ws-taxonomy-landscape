#!/usr/bin/env node

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const VALIDATOR = resolve(here, 'validate-taxonomy.mjs');
const temporaryDirectories = [];

function runValidator(data) {
  const directory = mkdtempSync(join(tmpdir(), 'taxonomy-test-'));
  temporaryDirectories.push(directory);
  const dataFile = join(directory, 'taxonomy.json');
  const contents = typeof data === 'string' ? data : JSON.stringify(data);
  writeFileSync(dataFile, contents, 'utf8');

  return spawnSync(process.execPath, [VALIDATOR], {
    env: { ...process.env, TAXONOMY_DATA_FILE: dataFile },
    encoding: 'utf8',
  });
}

test.after(() => {
  for (const directory of temporaryDirectories) {
    rmSync(directory, { recursive: true, force: true });
  }
});

const validEntry = {
  term: 'Harness',
  category: '',
  aliases: [],
  broaderTerm: null,
  definition: 'A control layer between a model and the world.',
  scopeNote: "It's fine to use apostrophes in JSON strings.",
  relatedTerms: [],
  contrastsWith: [],
  workgroups: [],
};

test('valid data passes', () => {
  const result = runValidator([validEntry]);
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout, /is valid/);
});

test('malformed JSON fails', () => {
  const broken = JSON.stringify([validEntry]).replace(
    'A control layer between a model and the world.',
    'A control layer with an unescaped "quote".'
  );
  const result = runValidator(broken);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /not valid JSON/);
});

test('JavaScript source is rejected rather than executed', () => {
  const result = runValidator(`window.AAIF_TAXONOMY = ${JSON.stringify([validEntry])};`);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /not valid JSON/);
});

test('missing required fields fail schema validation', () => {
  const result = runValidator([{ category: '', aliases: [], broaderTerm: null, workgroups: [] }]);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /validation failed/);
  assert.match(result.stderr, /term/);
  assert.match(result.stderr, /definition/);
});

test('unapproved categories are rejected', () => {
  const result = runValidator([{ ...validEntry, category: 'Not A Real Category' }]);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Invalid option/);
});

test('duplicate terms are rejected', () => {
  const result = runValidator([validEntry, validEntry]);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Duplicate term/);
});

test('unknown fields are rejected', () => {
  const result = runValidator([{ ...validEntry, typo: true }]);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Unrecognized key/);
});
