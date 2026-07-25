#!/usr/bin/env node
/**
 * Validate landscape/landscape.yml against the schema in docs/data-schemas.md.
 *
 * Parsing uses js-yaml, the same library the site loads in the browser
 * (landscape/static via the js-yaml CDN), pinned to the same version. That keeps
 * CI and the browser in agreement: anything the site would reject at load time,
 * such as a duplicate mapping key, fails here too rather than passing review and
 * breaking the rendered map.
 *
 * All schema fields are read as own properties (Object.hasOwn / Object.keys), so
 * values that only exist on an object's prototype (for example via a YAML merge
 * key payload) never satisfy a required field or hide from the unknown-field
 * checks.
 *
 * On top of parsing it checks the category -> subcategory -> item structure, that
 * each level is non-empty, the required item fields, the `project` enum, https
 * URLs, unexpected fields at every level, and duplicate category, subcategory, or
 * entry names. It prints every problem and exits non-zero if there are any.
 *
 * Usage: node validate-landscape.mjs [path/to/landscape.yml]
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

const PROJECT_VALUES = new Set(['graduated', 'incubating', 'member', 'external']);
const REQUIRED_FIELDS = ['name', 'homepage_url', 'description', 'project'];
const ALLOWED_ITEM_FIELDS = new Set([
  'name',
  'logo',
  'homepage_url',
  'repo_url',
  'description',
  'project',
]);
const ALLOWED_CATEGORY_FIELDS = new Set(['category', 'subcategories']);
const ALLOWED_SUBCATEGORY_FIELDS = new Set(['subcategory', 'items']);

// The landscape is a curated list a few tens of KB in size. A cap keeps a
// runaway or hostile file from producing an unbounded item list (and DOM) once
// the site renders it; the real data is far below this.
const MAX_BYTES = 2_000_000;

// Bound the parsed data, not just the file: a file well under MAX_BYTES can still
// materialize an enormous render workload (one huge description, many items, or a
// scalar reused via a YAML alias across thousands of items). These caps bound the
// item count and each text field so the browser cannot be overwhelmed.
const MAX_TOTAL_ITEMS = 5_000;
const LENGTH_LIMITS = {
  name: 200,
  description: 2_000,
  homepage_url: 2_048,
  repo_url: 2_048,
};

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim() !== '';
}

// Normalize a name to a duplicate-detection key: NFKC folds compatibility variants
// (full-width, composed vs decomposed) so visually equal names collide.
function normalizeKey(value) {
  return value.normalize('NFKC').trim().toLowerCase();
}

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

// YAML anchors/aliases resolve to shared references, so a small file can expand
// into a huge traversal: N reused category nodes, each holding N reused
// subcategory nodes, each holding N reused item nodes, is N^3 item visits here
// (and N^3 DOM nodes in the browser) from ~3N lines of input. The landscape
// schema never needs anchors, aliases, or merge keys, so reject any object or
// array that appears more than once. (A scalar alias shares a primitive, not an
// object, so it slips past this WeakSet; the per-field length caps bound those,
// and the FAILSAFE parse schema disables merge keys.) Iterative (an explicit stack, not
// recursion) so a deeply nested file cannot overflow the call stack, and a
// self-referential alias terminates on the WeakSet hit rather than looping.
function hasReusedNode(root) {
  const seen = new WeakSet();
  const stack = [root];
  while (stack.length > 0) {
    const value = stack.pop();
    if (value === null || typeof value !== 'object') continue;
    if (seen.has(value)) return true;
    seen.add(value);
    if (Array.isArray(value)) {
      for (const element of value) stack.push(element);
    } else {
      for (const key of Object.keys(value)) stack.push(value[key]);
    }
  }
  return false;
}

function unexpectedKeys(object, allowed, location, errors) {
  for (const key of Object.keys(object)) {
    if (!allowed.has(key)) {
      errors.push(`${location}: unknown field '${key}'`);
    }
  }
}

function urlProblem(field, value) {
  if (/\s/.test(value)) {
    return `${field} must not contain whitespace (got ${JSON.stringify(value)})`;
  }
  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    return `${field} is not a valid URL (got ${JSON.stringify(value)})`;
  }
  if (parsed.protocol !== 'https:') {
    return `${field} must use https:// (got ${JSON.stringify(value)})`;
  }
  if (!parsed.hostname) {
    return `${field} has no host (got ${JSON.stringify(value)})`;
  }
  if (parsed.username !== '' || parsed.password !== '') {
    return `${field} must not contain credentials`;
  }
  return null;
}

export function validate(text, source = 'landscape.yml') {
  if (typeof text === 'string' && Buffer.byteLength(text, 'utf8') > MAX_BYTES) {
    return [`${source}: file is larger than ${MAX_BYTES} bytes`];
  }
  let data;
  try {
    // FAILSAFE_SCHEMA parses only strings, sequences, and mappings, which is all the
    // landscape uses. It also drops merge (`<<`) resolution, so a merge key becomes a
    // plain (and rejected) unknown field instead of silently merging. maxDepth bounds
    // nesting so a deeply nested file cannot exhaust the parser.
    data = yaml.load(text, { schema: yaml.FAILSAFE_SCHEMA, maxDepth: 10 });
  } catch (err) {
    return [`${source}: YAML parse error: ${err.message}`];
  }

  if (!isPlainObject(data) || !Object.hasOwn(data, 'landscape')) {
    return [`${source}: top-level 'landscape' key is missing`];
  }
  const categories = data.landscape;
  if (!Array.isArray(categories)) {
    return [`${source}: 'landscape' must be a list of categories`];
  }
  if (categories.length === 0) {
    return [`${source}: 'landscape' must contain at least one category`];
  }
  if (hasReusedNode(data)) {
    return [`${source}: YAML anchors/aliases are not allowed`];
  }

  const errors = [];
  unexpectedKeys(data, new Set(['landscape']), source, errors);

  const seenCategories = new Map();
  const seenNames = new Map();
  let itemCount = 0;

  categories.forEach((category, categoryIndex) => {
    if (!isPlainObject(category) || !Object.hasOwn(category, 'category') || !isNonEmptyString(category.category)) {
      errors.push(`landscape[${categoryIndex}]: missing 'category' name`);
      return;
    }
    const categoryName = category.category;
    unexpectedKeys(category, ALLOWED_CATEGORY_FIELDS, `category '${categoryName}'`, errors);
    const categoryKey = normalizeKey(categoryName);
    if (seenCategories.has(categoryKey)) {
      errors.push(`category '${categoryName}': duplicate category name (also at ${seenCategories.get(categoryKey)})`);
    } else {
      seenCategories.set(categoryKey, `landscape[${categoryIndex}]`);
    }
    if (!Object.hasOwn(category, 'subcategories') || !Array.isArray(category.subcategories)) {
      errors.push(`category '${categoryName}': 'subcategories' must be a list`);
      return;
    }
    if (category.subcategories.length === 0) {
      errors.push(`category '${categoryName}': must contain at least one subcategory`);
    }

    const seenSubcategories = new Map();
    category.subcategories.forEach((subcategory, subcategoryIndex) => {
      if (!isPlainObject(subcategory) || !Object.hasOwn(subcategory, 'subcategory') || !isNonEmptyString(subcategory.subcategory)) {
        errors.push(`category '${categoryName}': subcategory[${subcategoryIndex}] missing 'subcategory' name`);
        return;
      }
      const subcategoryName = subcategory.subcategory;
      unexpectedKeys(subcategory, ALLOWED_SUBCATEGORY_FIELDS, `'${categoryName}' / '${subcategoryName}'`, errors);
      const subcategoryKey = normalizeKey(subcategoryName);
      if (seenSubcategories.has(subcategoryKey)) {
        errors.push(`'${categoryName}' / '${subcategoryName}': duplicate subcategory name in this category`);
      } else {
        seenSubcategories.set(subcategoryKey, subcategoryIndex);
      }
      if (!Object.hasOwn(subcategory, 'items') || !Array.isArray(subcategory.items)) {
        errors.push(`'${categoryName}' / '${subcategoryName}': 'items' must be a list`);
        return;
      }
      if (subcategory.items.length === 0) {
        errors.push(`'${categoryName}' / '${subcategoryName}': must contain at least one item`);
      }

      subcategory.items.forEach((item, itemIndex) => {
        itemCount += 1;
        let location = `'${categoryName}' / '${subcategoryName}' / item[${itemIndex}]`;
        if (!isPlainObject(item)) {
          errors.push(`${location}: item must be a mapping`);
          return;
        }
        if (Object.hasOwn(item, 'name') && isNonEmptyString(item.name)) {
          location = `'${categoryName}' / '${subcategoryName}' / '${item.name}'`;
        }

        for (const field of REQUIRED_FIELDS) {
          if (!Object.hasOwn(item, field) || !isNonEmptyString(item[field])) {
            errors.push(`${location}: missing or empty required field '${field}'`);
          }
        }
        for (const [field, max] of Object.entries(LENGTH_LIMITS)) {
          if (Object.hasOwn(item, field) && typeof item[field] === 'string' && item[field].length > max) {
            errors.push(`${location}: ${field} is longer than ${max} characters`);
          }
        }
        if (Object.hasOwn(item, 'project') && isNonEmptyString(item.project) && !PROJECT_VALUES.has(item.project)) {
          errors.push(`${location}: project '${item.project}' is not one of ${[...PROJECT_VALUES].sort().join(', ')}`);
        }
        if (Object.hasOwn(item, 'homepage_url') && isNonEmptyString(item.homepage_url)) {
          const problem = urlProblem('homepage_url', item.homepage_url);
          if (problem) errors.push(`${location}: ${problem}`);
        }
        if (Object.hasOwn(item, 'repo_url')) {
          if (!isNonEmptyString(item.repo_url)) {
            errors.push(`${location}: repo_url is present but empty`);
          } else {
            const problem = urlProblem('repo_url', item.repo_url);
            if (problem) errors.push(`${location}: ${problem}`);
          }
        }
        unexpectedKeys(item, ALLOWED_ITEM_FIELDS, location, errors);
        if (Object.hasOwn(item, 'name') && isNonEmptyString(item.name)) {
          const nameKey = normalizeKey(item.name);
          if (seenNames.has(nameKey)) {
            errors.push(`${location}: duplicate entry name (also at ${seenNames.get(nameKey)})`);
          } else {
            seenNames.set(nameKey, location);
          }
        }
      });
    });
  });

  if (itemCount === 0) {
    errors.push(`${source}: landscape contains no items`);
  }
  if (itemCount > MAX_TOTAL_ITEMS) {
    errors.push(`${source}: landscape has ${itemCount} items, more than the ${MAX_TOTAL_ITEMS} allowed`);
  }
  return errors;
}

function main() {
  const path = process.argv[2] ?? '../landscape/landscape.yml';
  let text;
  try {
    text = readFileSync(path, 'utf8');
  } catch (err) {
    console.error(`cannot read ${path}: ${err.message}`);
    process.exit(2);
  }
  const errors = validate(text, path);
  if (errors.length > 0) {
    console.error(`landscape validation failed with ${errors.length} problem(s):`);
    for (const error of errors) {
      console.error(`  - ${error}`);
    }
    process.exit(1);
  }
  console.log(`${path}: OK`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
