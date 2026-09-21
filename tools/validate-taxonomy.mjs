#!/usr/bin/env node
/**
 * Validates taxonomy/taxonomy-data.js.
 *
 * Primary guard (the regression this exists to prevent):
 *   A viewer loads taxonomy-data.js directly via a <script> tag, so ANY
 *   JavaScript syntax error (e.g. an unescaped quote inside a string) takes
 *   down any dependent viewer. See commit 36cd708 ("Fix unescaped quote in
 *   Delegation scopeNote").
 *
 *   This validator NEVER executes the file. taxonomy-data.js contains a single
 *   static data literal (`window.AAIF_TAXONOMY = [ ... ];`), so we parse that
 *   literal with a small, self-contained reader that understands only JSON-like
 *   values (objects, arrays, strings, numbers, true/false/null) and comments.
 *   Because the input is treated as data — never as code — a hostile PR cannot
 *   run arbitrary JavaScript in CI, and a malformed literal fails fast exactly
 *   like a broken viewer would.
 *
 * Secondary guard: schema conformance per docs/data-schemas.md so malformed
 * (but syntactically valid) entries also can't reach main.
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
// Defaults to the real data file; tests may point at a fixture via the
// TAXONOMY_DATA_FILE env var. The value is only ever read, never executed.
const DATA_FILE = process.env.TAXONOMY_DATA_FILE
  ? resolve(process.env.TAXONOMY_DATA_FILE)
  : resolve(here, '..', 'taxonomy', 'taxonomy-data.js');

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

// --- Step 1: read the file -------------------------------------------------
// Cap the input size before doing any work. taxonomy-data.js is a curated,
// human-authored index; a legitimate file is well under this bound. The cap
// keeps a hostile PR from spending CI compute on a multi-megabyte payload —
// the parse below is rejected in O(1) instead of scanning the whole file.
const MAX_SOURCE_BYTES = 2 * 1024 * 1024; // 2 MiB

let source;
try {
  source = readFileSync(DATA_FILE, 'utf8');
} catch (e) {
  console.error(`Could not read ${DATA_FILE}: ${e.message}`);
  process.exit(2);
}

const sourceBytes = Buffer.byteLength(source, 'utf8');
if (sourceBytes > MAX_SOURCE_BYTES) {
  console.error(
    `❌ ${DATA_FILE} is ${sourceBytes} bytes, exceeding the ${MAX_SOURCE_BYTES}-byte limit. ` +
    'The taxonomy index is not expected to be this large; refusing to parse.'
  );
  process.exit(1);
}

// --- Step 2: parse the data literal WITHOUT executing it -------------------
//
// A minimal recursive-descent reader for the JSON-superset literal subset the
// data file uses: objects with bare identifier keys, arrays, single- and
// double-quoted strings (with escapes), numbers, and true/false/null. It also
// skips // and /* */ comments and whitespace. Anything outside this grammar —
// including the unescaped-quote class of regression — raises a SyntaxError
// with a line/column, mirroring how a browser would refuse the file.
class LiteralReader {
  constructor(text, offset = 0) {
    this.text = text;
    this.pos = offset;
  }

  error(msg) {
    // Compute a 1-based line/column for the current position.
    let line = 1;
    let col = 1;
    for (let i = 0; i < this.pos && i < this.text.length; i++) {
      if (this.text[i] === '\n') {
        line++;
        col = 1;
      } else {
        col++;
      }
    }
    const err = new SyntaxError(`${msg} (line ${line}, column ${col})`);
    err.line = line;
    err.column = col;
    return err;
  }

  skipTrivia() {
    for (;;) {
      const c = this.text[this.pos];
      if (c === ' ' || c === '\t' || c === '\n' || c === '\r' || c === '\f' || c === '\v') {
        this.pos++;
      } else if (c === '/' && this.text[this.pos + 1] === '/') {
        this.pos += 2;
        while (this.pos < this.text.length && this.text[this.pos] !== '\n') this.pos++;
      } else if (c === '/' && this.text[this.pos + 1] === '*') {
        this.pos += 2;
        while (this.pos < this.text.length && !(this.text[this.pos] === '*' && this.text[this.pos + 1] === '/')) {
          this.pos++;
        }
        if (this.pos >= this.text.length) throw this.error('Unterminated block comment');
        this.pos += 2;
      } else {
        return;
      }
    }
  }

  peek() {
    this.skipTrivia();
    return this.text[this.pos];
  }

  parseValue() {
    const c = this.peek();
    if (c === undefined) throw this.error('Unexpected end of input, expected a value');
    if (c === '{') return this.parseObject();
    if (c === '[') return this.parseArray();
    if (c === '"' || c === "'") return this.parseString();
    if (c === '-' || (c >= '0' && c <= '9')) return this.parseNumber();
    if (this.text.startsWith('true', this.pos)) { this.pos += 4; return true; }
    if (this.text.startsWith('false', this.pos)) { this.pos += 5; return false; }
    if (this.text.startsWith('null', this.pos)) { this.pos += 4; return null; }
    throw this.error(`Unexpected character ${JSON.stringify(c)}`);
  }

  parseObject() {
    this.pos++; // consume '{'
    const obj = {};
    if (this.peek() === '}') { this.pos++; return obj; }
    for (;;) {
      const key = this.parseKey();
      if (this.peek() !== ':') throw this.error(`Expected ':' after key ${JSON.stringify(key)}`);
      this.pos++; // consume ':'
      obj[key] = this.parseValue();
      const sep = this.peek();
      if (sep === ',') {
        this.pos++;
        if (this.peek() === '}') { this.pos++; return obj; } // trailing comma
        continue;
      }
      if (sep === '}') { this.pos++; return obj; }
      throw this.error(`Expected ',' or '}' in object, got ${JSON.stringify(sep)}`);
    }
  }

  parseKey() {
    const c = this.peek();
    if (c === '"' || c === "'") return this.parseString();
    // Bare identifier key (the style this data file uses).
    const start = this.pos;
    while (this.pos < this.text.length && /[A-Za-z0-9_$]/.test(this.text[this.pos])) this.pos++;
    if (this.pos === start) throw this.error('Expected object key');
    return this.text.slice(start, this.pos);
  }

  parseArray() {
    this.pos++; // consume '['
    const arr = [];
    if (this.peek() === ']') { this.pos++; return arr; }
    for (;;) {
      arr.push(this.parseValue());
      const sep = this.peek();
      if (sep === ',') {
        this.pos++;
        if (this.peek() === ']') { this.pos++; return arr; } // trailing comma
        continue;
      }
      if (sep === ']') { this.pos++; return arr; }
      throw this.error(`Expected ',' or ']' in array, got ${JSON.stringify(sep)}`);
    }
  }

  parseString() {
    const quote = this.text[this.pos];
    this.pos++; // consume opening quote
    let out = '';
    for (;;) {
      const c = this.text[this.pos];
      if (c === undefined || c === '\n') throw this.error('Unterminated string literal');
      if (c === quote) { this.pos++; return out; }
      if (c === '\\') {
        const esc = this.text[this.pos + 1];
        this.pos += 2;
        switch (esc) {
          case 'n': out += '\n'; break;
          case 't': out += '\t'; break;
          case 'r': out += '\r'; break;
          case 'b': out += '\b'; break;
          case 'f': out += '\f'; break;
          case 'v': out += '\v'; break;
          case '0': out += '\0'; break;
          case 'u': {
            const hex = this.text.slice(this.pos, this.pos + 4);
            if (!/^[0-9a-fA-F]{4}$/.test(hex)) throw this.error('Invalid \\u escape');
            out += String.fromCharCode(parseInt(hex, 16));
            this.pos += 4;
            break;
          }
          case undefined: throw this.error('Unterminated escape sequence');
          default: out += esc; // \\ \' \" \/ and any other escaped char
        }
        continue;
      }
      out += c;
      this.pos++;
    }
  }

  parseNumber() {
    const start = this.pos;
    if (this.text[this.pos] === '-') this.pos++;
    while (this.pos < this.text.length && /[0-9.eE+\-]/.test(this.text[this.pos])) this.pos++;
    const raw = this.text.slice(start, this.pos);
    const n = Number(raw);
    if (Number.isNaN(n)) throw this.error(`Invalid number ${JSON.stringify(raw)}`);
    return n;
  }
}

// Locate the array literal assigned to the global, then parse only that literal.
const assignMatch = source.match(/window\.AAIF_TAXONOMY\s*=\s*\[/);
if (!assignMatch) {
  console.error('❌ Could not find `window.AAIF_TAXONOMY = [ ... ]` assignment in taxonomy/taxonomy-data.js.');
  process.exit(1);
}
const arrayStart = assignMatch.index + assignMatch[0].length - 1; // index of '['

let data;
try {
  const reader = new LiteralReader(source, arrayStart);
  data = reader.parseValue();
  // Ensure only trivia (and the terminating ';') follows the literal.
  reader.skipTrivia();
  if (reader.text[reader.pos] === ';') { reader.pos++; reader.skipTrivia(); }
  if (reader.pos < reader.text.length) {
    throw reader.error('Unexpected trailing content after the taxonomy array literal');
  }
} catch (e) {
  // This is the exact class of failure the regression produced.
  console.error('❌ taxonomy/taxonomy-data.js failed to parse:');
  console.error(`   ${e.name}: ${e.message}`);
  console.error('\nThis would break any taxonomy viewer that loads the file the same way.');
  process.exit(1);
}

// --- Step 3: schema conformance --------------------------------------------
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
