#!/usr/bin/env node
/**
 * Validates taxonomy/taxonomy.json without executing contributor-controlled
 * content. JSON.parse handles syntax and Zod handles schema conformance.
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { TaxonomySchema } from './taxonomy-schema.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const DATA_FILE = process.env.TAXONOMY_DATA_FILE
  ? resolve(process.env.TAXONOMY_DATA_FILE)
  : resolve(here, '..', 'taxonomy', 'taxonomy.json');
const MAX_SOURCE_BYTES = 2 * 1024 * 1024;

let source;
try {
  source = readFileSync(DATA_FILE, 'utf8');
} catch (error) {
  console.error(`Could not read ${DATA_FILE}: ${error.message}`);
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

let json;
try {
  json = JSON.parse(source);
} catch (error) {
  console.error('❌ taxonomy/taxonomy.json is not valid JSON:');
  console.error(`   ${error.message}`);
  process.exit(1);
}

const result = TaxonomySchema.safeParse(json);
if (!result.success) {
  console.error(`❌ taxonomy.json validation failed with ${result.error.issues.length} error(s):\n`);
  for (const issue of result.error.issues) {
    const path = issue.path.length > 0 ? issue.path.join('.') : '<root>';
    console.error(`  - ${path}: ${issue.message}`);
  }
  process.exit(1);
}

const data = result.data;
const allTerms = new Set(data.map((entry) => entry.term));
const warnings = [];

data.forEach((entry, index) => {
  for (const field of ['relatedTerms', 'contrastsWith']) {
    for (const reference of entry[field]) {
      if (!allTerms.has(reference)) {
        warnings.push(
          `entry #${index} ("${entry.term}"): "${field}" references term ` +
          `"${reference}" which is not defined in the taxonomy.`
        );
      }
    }
  }
});

if (warnings.length > 0) {
  console.warn(`⚠️  ${warnings.length} warning(s):`);
  for (const warning of warnings) console.warn(`  - ${warning}`);
  console.warn('');
}

console.log(`✅ taxonomy.json is valid: ${data.length} entries conform to the schema.`);
