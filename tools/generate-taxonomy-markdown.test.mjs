#!/usr/bin/env node

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const generator = resolve(here, 'generate-taxonomy-markdown.mjs');
const cleanupDirectories = [];

const fixture = `window.AAIF_TAXONOMY = [
  // ---------------------------------------------------------------------
  // Universal
  // ---------------------------------------------------------------------
  {
    term: 'Harness',
    category: '',
    aliases: [],
    broaderTerm: null,
    definition: 'A control layer between a model and the world.',
    relatedTerms: ['Trust'],
    contrastsWith: [],
    workgroups: ['Workflows & Process Integration', 'Identity & Trust']
  },
  {
    term: 'Alpha',
    category: '',
    aliases: [],
    broaderTerm: null,
    definition: 'Definition pending — term accepted; definition under working group discussion.',
    relatedTerms: [],
    contrastsWith: [],
    workgroups: []
  },

  // ---------------------------------------------------------------------
  // Identity & Trust
  // ---------------------------------------------------------------------
  {
    term: 'Trust',
    category: '',
    aliases: [],
    broaderTerm: null,
    definition: 'Confidence in an assertion.',
    scopeNote: 'Used here as a compact test fixture.',
    relatedTerms: [],
    contrastsWith: [],
    workgroups: ['Identity & Trust']
  }
];
`;

function createFixture() {
  const directory = mkdtempSync(join(tmpdir(), 'taxonomy-markdown-test-'));
  cleanupDirectories.push(directory);
  const dataFile = join(directory, 'taxonomy-data.js');
  const outputFile = join(directory, 'TERMS.md');
  writeFileSync(dataFile, fixture, 'utf8');
  return { dataFile, outputFile };
}

function runGenerator(dataFile, outputFile, args = []) {
  return spawnSync(process.execPath, [generator, ...args], {
    env: {
      ...process.env,
      TAXONOMY_DATA_FILE: dataFile,
      TAXONOMY_MARKDOWN_FILE: outputFile,
    },
    encoding: 'utf8',
  });
}

test.after(() => {
  for (const directory of cleanupDirectories) {
    try { rmSync(directory, { recursive: true, force: true }); } catch { /* ignore */ }
  }
});

test('generates linked, alphabetized terms with non-empty rows only', () => {
  const { dataFile, outputFile } = createFixture();
  const result = runGenerator(dataFile, outputFile);
  assert.equal(result.status, 0, result.stdout + result.stderr);

  const markdown = readFileSync(outputFile, 'utf8');
  assert.match(markdown, /## Universal/);
  assert.match(markdown, /## Identity & Trust/);
  assert.match(markdown, /## Workflows & Process Integration/);
  assert.match(markdown, /<a id="term-harness"><\/a>\n### \[Harness\]\(#term-harness\)/);
  assert.match(markdown, /<th scope="row">Definition<\/th><td>A control layer between a model and the world\.<\/td>/);
  assert.match(markdown, /<th scope="row">Scope note<\/th><td>Used here as a compact test fixture\.<\/td>/);
  assert.match(markdown, /<th scope="row">Related terms<\/th><td><a href="#term-trust">Trust<\/a><\/td>/);
  assert.doesNotMatch(markdown, /Field.*Value/);
  assert.doesNotMatch(markdown, /<th scope="row">Aliases<\/th>/);
  assert.doesNotMatch(markdown, /<th scope="row">Category<\/th>/);

  const alphaStart = markdown.indexOf('### [Alpha](#term-alpha)');
  const harnessStart = markdown.indexOf('### [Harness](#term-harness)');
  assert.ok(alphaStart >= 0 && alphaStart < harnessStart, 'terms are not alphabetized');
  const alphaSection = markdown.slice(alphaStart, harnessStart);
  assert.doesNotMatch(alphaSection, /Definition pending/);
  assert.doesNotMatch(alphaSection, /<table>/);

  assert.match(
    markdown,
    /<th scope="row">Workgroups<\/th><td><a href="#category-identity-and-trust">Identity &amp; Trust<\/a><br><a href="#category-workflows-and-process-integration">Workflows &amp; Process Integration<\/a><\/td>/
  );

  const trustStart = markdown.indexOf('### [Trust](#term-trust)');
  const workflowsStart = markdown.indexOf('## Workflows & Process Integration');
  assert.doesNotMatch(markdown.slice(trustStart, workflowsStart), /Workgroups/);
});

test('--verify passes for current output and fails after a direct edit', () => {
  const { dataFile, outputFile } = createFixture();
  const generated = runGenerator(dataFile, outputFile);
  assert.equal(generated.status, 0, generated.stdout + generated.stderr);

  const current = runGenerator(dataFile, outputFile, ['--verify']);
  assert.equal(current.status, 0, current.stdout + current.stderr);

  writeFileSync(outputFile, `${readFileSync(outputFile, 'utf8')}manual edit\n`, 'utf8');
  const stale = runGenerator(dataFile, outputFile, ['--verify']);
  assert.equal(stale.status, 1, 'expected verification failure');
  assert.match(stale.stderr, /stale or was edited directly/);
});
