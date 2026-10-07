#!/usr/bin/env node

/**
 * Generates taxonomy/TERMS.md from taxonomy/taxonomy-data.js.
 *
 * The taxonomy source is parsed by validate-taxonomy.mjs rather than executed.
 * Section comments in the source provide the human-readable category headings.
 *
 * Usage:
 *   node tools/generate-taxonomy-markdown.mjs
 *   node tools/generate-taxonomy-markdown.mjs --verify
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(here, '..');
const dataFile = resolve(
  process.env.TAXONOMY_DATA_FILE || resolve(repositoryRoot, 'taxonomy', 'taxonomy-data.js')
);
const outputFile = resolve(
  process.env.TAXONOMY_MARKDOWN_FILE || resolve(repositoryRoot, 'taxonomy', 'TERMS.md')
);
const validator = resolve(here, 'validate-taxonomy.mjs');

const supportedArguments = new Set(['--verify']);
const unknownArguments = process.argv.slice(2).filter((argument) => !supportedArguments.has(argument));
if (unknownArguments.length > 0) {
  console.error(`Unknown argument(s): ${unknownArguments.join(', ')}`);
  console.error('Usage: node tools/generate-taxonomy-markdown.mjs [--verify]');
  process.exit(2);
}

const verifyOnly = process.argv.includes('--verify');

function readValidatedTaxonomy() {
  const result = spawnSync(process.execPath, [validator, '--json'], {
    env: { ...process.env, TAXONOMY_DATA_FILE: dataFile },
    encoding: 'utf8',
    maxBuffer: 4 * 1024 * 1024,
  });

  if (result.error) throw result.error;
  if (result.status !== 0) {
    if (result.stdout) process.stderr.write(result.stdout);
    if (result.stderr) process.stderr.write(result.stderr);
    throw new Error('Cannot generate Markdown because taxonomy validation failed.');
  }

  try {
    return JSON.parse(result.stdout);
  } catch (error) {
    throw new Error(`Validator returned invalid JSON: ${error.message}`);
  }
}

function extractSections(source, expectedEntryCount) {
  const lines = source.split(/\r?\n/);
  const separator = /^\s*\/\/\s*-{5,}\s*$/;
  const comment = /^\s*\/\/\s+(.+?)\s*$/;
  const termProperty = /^\s*term\s*:/;
  const sections = [];
  let currentSection = null;

  for (let index = 0; index < lines.length; index++) {
    const header = lines[index].match(comment);
    if (header && index > 0 && separator.test(lines[index - 1])) {
      currentSection = header[1];
    }

    if (termProperty.test(lines[index])) {
      if (!currentSection) {
        throw new Error(`Taxonomy entry on line ${index + 1} has no section heading.`);
      }
      sections.push(currentSection);
    }
  }

  if (sections.length !== expectedEntryCount) {
    throw new Error(
      `Found ${sections.length} section assignments for ${expectedEntryCount} taxonomy entries.`
    );
  }

  return sections;
}

function slugify(value) {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/\r?\n/g, '<br>');
}

function escapeMarkdownLinkText(value) {
  return String(value).replace(/([\\\[\]])/g, '\\$1');
}

function buildMarkdown(entries, sections) {
  const termAnchors = new Map();
  const usedAnchors = new Map();

  for (const entry of entries) {
    const anchor = `term-${slugify(entry.term)}`;
    if (usedAnchors.has(anchor)) {
      throw new Error(
        `Terms "${usedAnchors.get(anchor)}" and "${entry.term}" produce the same anchor "${anchor}".`
      );
    }
    usedAnchors.set(anchor, entry.term);
    termAnchors.set(entry.term, anchor);
  }

  const groupedEntries = new Map();
  entries.forEach((entry, index) => {
    const section = sections[index];
    if (!groupedEntries.has(section)) groupedEntries.set(section, []);
    groupedEntries.get(section).push(entry);
  });

  // Every workgroup gets a category heading, even if no terms currently live
  // in that source section. This keeps all workgroup links valid.
  for (const entry of entries) {
    for (const workgroup of entry.workgroups) {
      if (!groupedEntries.has(workgroup)) groupedEntries.set(workgroup, []);
    }
  }

  const orderedSections = [...groupedEntries.keys()].sort((left, right) => {
    if (left === 'Universal') return -1;
    if (right === 'Universal') return 1;
    return left.localeCompare(right, 'en', { sensitivity: 'base' });
  });

  for (const sectionEntries of groupedEntries.values()) {
    sectionEntries.sort((left, right) =>
      left.term.localeCompare(right.term, 'en', { sensitivity: 'base' })
    );
  }

  const formatReferences = (references) => references.map((reference) => {
    const anchor = termAnchors.get(reference);
    return anchor
      ? `<a href="#${anchor}">${escapeHtml(reference)}</a>`
      : escapeHtml(reference);
  }).join(', ');

  const lines = [
    '<!--',
    '  GENERATED FILE — DO NOT EDIT DIRECTLY.',
    '  Edit taxonomy/taxonomy-data.js and run:',
    '  node tools/generate-taxonomy-markdown.mjs',
    '-->',
    '',
    '# AAIF Taxonomy Reference',
    '',
    'This human-readable reference is generated from [`taxonomy-data.js`](./taxonomy-data.js).',
    '',
  ];

  const fieldDefinitions = [
    ['Definition', 'definition', 'text'],
    ['Scope note', 'scopeNote', 'text'],
    ['Aliases', 'aliases', 'list'],
    ['Broader term', 'broaderTerm', 'reference'],
    ['Related terms', 'relatedTerms', 'references'],
    ['Contrasts with', 'contrastsWith', 'references'],
    ['Workgroups', 'workgroups', 'list'],
    ['Category', 'category', 'text'],
  ];

  for (const section of orderedSections) {
    const sectionEntries = groupedEntries.get(section);
    lines.push(`<a id="category-${slugify(section)}"></a>`);
    lines.push(`## ${section}`, '');

    if (sectionEntries.length === 0) {
      lines.push('_No terms are currently assigned to this category._', '');
      continue;
    }

    for (const entry of sectionEntries) {
      lines.push(`<a id="${termAnchors.get(entry.term)}"></a>`);
      lines.push(`### [${escapeMarkdownLinkText(entry.term)}](#${termAnchors.get(entry.term)})`);
      const rows = [];

      for (const [label, field, kind] of fieldDefinitions) {
        let value = entry[field];
        if (field === 'definition' && typeof value === 'string' && value.startsWith('Definition pending')) {
          continue;
        }
        if (field === 'workgroups' && Array.isArray(value)) {
          value = value
            .filter((workgroup) => workgroup !== section)
            .sort((left, right) => left.localeCompare(right, 'en', { sensitivity: 'base' }));
        }
        if (value === undefined || value === null || value === '') continue;
        if (Array.isArray(value) && value.length === 0) continue;

        let formatted;
        if (field === 'workgroups') {
          formatted = value
            .map((workgroup) =>
              `<a href="#category-${slugify(workgroup)}">${escapeHtml(workgroup)}</a>`
            )
            .join('<br>');
        } else if (kind === 'references') {
          formatted = formatReferences(value);
        } else if (kind === 'reference') {
          formatted = formatReferences([value]);
        } else if (kind === 'list') {
          formatted = value.map(escapeHtml).join(', ');
        } else {
          formatted = escapeHtml(value);
        }

        rows.push(`    <tr><th scope="row">${label}</th><td>${formatted}</td></tr>`);
      }

      if (rows.length > 0) {
        lines.push('', '<table>', '  <tbody>', ...rows, '  </tbody>', '</table>');
      }

      lines.push('');
    }
  }

  return `${lines.join('\n').trimEnd()}\n`;
}

try {
  const source = readFileSync(dataFile, 'utf8');
  const entries = readValidatedTaxonomy();
  const sections = extractSections(source, entries.length);
  const expected = buildMarkdown(entries, sections);

  if (verifyOnly) {
    let actual;
    try {
      actual = readFileSync(outputFile, 'utf8');
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.error(`Generated taxonomy reference is missing: ${outputFile}`);
        console.error('Run: node tools/generate-taxonomy-markdown.mjs');
        process.exit(1);
      }
      throw error;
    }

    if (actual !== expected) {
      console.error(`Generated taxonomy reference is stale or was edited directly: ${outputFile}`);
      console.error('Run: node tools/generate-taxonomy-markdown.mjs');
      process.exit(1);
    }

    console.log('Generated taxonomy reference is up to date.');
  } else {
    writeFileSync(outputFile, expected, 'utf8');
    console.log(`Generated ${outputFile}`);
  }
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
