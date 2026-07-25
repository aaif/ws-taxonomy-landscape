#!/usr/bin/env node
/**
 * Validate landscape/landscape.yml against the schema in docs/data-schemas.md.
 *
 * Parsing uses js-yaml, the same library the site loads in the browser
 * (landscape/static via the js-yaml CDN), pinned to the same version AND parsed with
 * the same options: FAILSAFE_SCHEMA and maxDepth (see landscape/static/app.js). That
 * keeps CI and the browser in agreement: anything the site would reject or mis-type at
 * load time fails here too rather than passing review and breaking the rendered map. In
 * particular FAILSAFE_SCHEMA keeps every scalar a string, so a value like `name: 789`
 * cannot pass here as a string but parse as a number (or `2026-07-25` as a Date) in the
 * browser, where the search code would then throw calling `.toLowerCase()` on it.
 *
 * All schema fields are read as own properties (Object.hasOwn / Object.keys), so
 * values that only exist on an object's prototype (for example via a YAML merge
 * key payload) never satisfy a required field or hide from the unknown-field
 * checks.
 *
 * On top of parsing it checks the category -> subcategory -> item structure, that
 * each level is non-empty, the required item fields, the `project` enum, https
 * URLs, unexpected fields at every level, and duplicate category, subcategory, or
 * entry names. It also bounds the work: item count, per-field lengths, display-name
 * lengths, and the number and size of reported errors, so neither this validator nor
 * the browser can be overwhelmed by a small but hostile file. It prints every problem
 * and exits non-zero if there are any.
 *
 * Usage: node validate-landscape.mjs [path/to/landscape.yml]
 */
import { readFileSync, statSync } from 'node:fs';
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

// Bound the parsed data, not just the file. A file well under MAX_BYTES can still
// materialize an enormous render workload in the browser (one huge name, many items, or
// a scalar reused via a YAML alias across thousands of items) or force this validator to
// build a huge pile of error strings. These caps bound the item count, each text field,
// the display names, and the error output. The real landscape has a few tens of entries,
// so 500 items is already generous headroom.
const MAX_TOTAL_ITEMS = 500;
const MAX_ERRORS = 200;
const MAX_ERROR_LENGTH = 500;
const DISPLAY_NAME_MAX = 120;
const LENGTH_LIMITS = {
  name: 200,
  description: 2_000,
  homepage_url: 2_048,
  repo_url: 2_048,
  logo: 300,
  project: 50,
};

// Control and format characters (zero-width joiners, bidi overrides, other C0/C1) render
// invisibly and let two visually identical names differ, defeating duplicate detection
// and enabling spoofed entries; reject them in any displayed string.
const CONTROL_OR_FORMAT = /[\p{Cc}\p{Cf}]/u;

// addError bounds both the number of errors and the length of each, so a file crafted to
// produce a huge volume of error text cannot exhaust memory here or flood the CI log.
function addError(errors, message) {
  if (errors.length >= MAX_ERRORS) return;
  errors.push(message.length > MAX_ERROR_LENGTH ? `${message.slice(0, MAX_ERROR_LENGTH)}…` : message);
}

// A displayed string (category, subcategory, or item name) must be within its length cap
// and free of control/format characters. Checking length before the name is interpolated
// into any location string keeps a hostile name from inflating every downstream message.
function displayStringProblem(value, max) {
  if (value.length > max) return `is longer than ${max} characters`;
  if (CONTROL_OR_FORMAT.test(value)) return 'contains control or format characters';
  return null;
}

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

// Bound the whole parsed object graph, not just the schema-relevant parts. A file under
// MAX_BYTES can still materialize a very wide graph (for example a large unknown top-level key
// full of empty mappings) that js-yaml builds and this validator would then walk. graphProblem
// walks once, iteratively (an explicit stack, not recursion, so a deeply nested file cannot
// overflow the call stack), and returns a problem string as soon as it exceeds a budget or
// revisits a node, so the walk stops early instead of traversing the whole thing.
//
// It also rejects reused nodes: YAML anchors/aliases resolve to shared references, so a small
// file can expand into an N^3 traversal (and N^3 DOM nodes in the browser) from ~3N lines. The
// landscape schema never needs anchors, aliases, or merge keys, so any object or array seen
// more than once is rejected. (A scalar alias shares a primitive, not an object, so it slips
// past the WeakSet; the per-field length caps and the item cap bound those, and the FAILSAFE
// parse schema disables merge keys.) A self-referential alias terminates on the WeakSet hit.
const MAX_CONTAINERS = 5_000;
const MAX_GRAPH_EDGES = 20_000;
function graphProblem(root) {
  const seen = new WeakSet();
  const stack = [root];
  let containers = 0;
  let edges = 0;
  while (stack.length > 0) {
    const value = stack.pop();
    if (value === null || typeof value !== 'object') continue;
    if (seen.has(value)) {
      return 'reused object or array nodes (YAML aliases or cycles) are not allowed';
    }
    seen.add(value);
    if (++containers > MAX_CONTAINERS) {
      return `has more than ${MAX_CONTAINERS} objects or arrays`;
    }
    if (Array.isArray(value)) {
      for (const element of value) {
        if (++edges > MAX_GRAPH_EDGES) return `has more than ${MAX_GRAPH_EDGES} graph edges`;
        stack.push(element);
      }
    } else {
      for (const key of Object.keys(value)) {
        if (++edges > MAX_GRAPH_EDGES) return `has more than ${MAX_GRAPH_EDGES} graph edges`;
        stack.push(value[key]);
      }
    }
  }
  return null;
}

function unexpectedKeys(object, allowed, location, errors) {
  for (const key of Object.keys(object)) {
    if (!allowed.has(key)) {
      // Bound and escape the key: an unknown key can be arbitrarily long (or carry control
      // characters), and it would otherwise be echoed verbatim into the error and the CI log.
      const shown = key.length > 100 ? `${key.slice(0, 100)}…` : key;
      addError(errors, `${location}: unknown field ${JSON.stringify(shown)}`);
    }
  }
}

function urlProblem(field, value) {
  if (/\s/.test(value)) {
    return `${field} must not contain whitespace (got ${JSON.stringify(value)})`;
  }
  // Require the literal scheme: the WHATWG URL parser canonicalizes forms like
  // "https:example.com" or "https:\\host" to an https: URL, so the protocol check below is
  // not enough to enforce the documented "must start with https://".
  if (!value.startsWith('https://')) {
    return `${field} must start with https:// (got ${JSON.stringify(value)})`;
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
    // landscape uses. It drops merge (`<<`) resolution, so a merge key becomes a plain
    // (and rejected) unknown field instead of silently merging, and it keeps every scalar
    // a string so numeric/timestamp scalars cannot diverge between here and the browser.
    // maxDepth bounds nesting. app.js parses with these same options.
    data = yaml.load(text, { schema: yaml.FAILSAFE_SCHEMA, maxDepth: 10 });
  } catch (err) {
    // Bound the parser's message too: js-yaml puts the offending token into it (for example
    // an undefined alias name), so an oversized token would otherwise flood the output past
    // the MAX_ERROR_LENGTH cap that every other diagnostic respects.
    const reason = err instanceof Error ? err.message : String(err);
    const message = `${source}: YAML parse error: ${reason}`;
    return [message.length > MAX_ERROR_LENGTH ? `${message.slice(0, MAX_ERROR_LENGTH)}…` : message];
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
  const graphIssue = graphProblem(data);
  if (graphIssue) {
    return [`${source}: ${graphIssue}`];
  }

  // Preflight the item count cheaply (list lengths only) so a file with far too many items
  // is rejected before the detailed, allocation-heavy validation below runs on all of them.
  let itemTotal = 0;
  for (const category of categories) {
    if (!isPlainObject(category) || !Array.isArray(category.subcategories)) continue;
    for (const sub of category.subcategories) {
      if (isPlainObject(sub) && Array.isArray(sub.items)) itemTotal += sub.items.length;
    }
  }
  if (itemTotal > MAX_TOTAL_ITEMS) {
    return [`${source}: landscape has ${itemTotal} items, more than the ${MAX_TOTAL_ITEMS} allowed`];
  }

  const errors = [];
  unexpectedKeys(data, new Set(['landscape']), source, errors);

  const seenCategories = new Map();
  const seenNames = new Map();
  let itemCount = 0;

  categories.forEach((category, categoryIndex) => {
    if (!isPlainObject(category) || !Object.hasOwn(category, 'category') || !isNonEmptyString(category.category)) {
      addError(errors, `landscape[${categoryIndex}]: missing 'category' name`);
      return;
    }
    const categoryName = category.category;
    const categoryProblem = displayStringProblem(categoryName, DISPLAY_NAME_MAX);
    if (categoryProblem) {
      addError(errors, `landscape[${categoryIndex}]: category name ${categoryProblem}`);
      return;
    }
    unexpectedKeys(category, ALLOWED_CATEGORY_FIELDS, `category '${categoryName}'`, errors);
    const categoryKey = normalizeKey(categoryName);
    if (seenCategories.has(categoryKey)) {
      addError(errors, `category '${categoryName}': duplicate category name (also at ${seenCategories.get(categoryKey)})`);
    } else {
      seenCategories.set(categoryKey, `landscape[${categoryIndex}]`);
    }
    if (!Object.hasOwn(category, 'subcategories') || !Array.isArray(category.subcategories)) {
      addError(errors, `category '${categoryName}': 'subcategories' must be a list`);
      return;
    }
    if (category.subcategories.length === 0) {
      addError(errors, `category '${categoryName}': must contain at least one subcategory`);
    }

    const seenSubcategories = new Map();
    category.subcategories.forEach((subcategory, subcategoryIndex) => {
      if (!isPlainObject(subcategory) || !Object.hasOwn(subcategory, 'subcategory') || !isNonEmptyString(subcategory.subcategory)) {
        addError(errors, `category '${categoryName}': subcategory[${subcategoryIndex}] missing 'subcategory' name`);
        return;
      }
      const subcategoryName = subcategory.subcategory;
      const subcategoryProblem = displayStringProblem(subcategoryName, DISPLAY_NAME_MAX);
      if (subcategoryProblem) {
        addError(errors, `'${categoryName}' / subcategory[${subcategoryIndex}]: name ${subcategoryProblem}`);
        return;
      }
      unexpectedKeys(subcategory, ALLOWED_SUBCATEGORY_FIELDS, `'${categoryName}' / '${subcategoryName}'`, errors);
      const subcategoryKey = normalizeKey(subcategoryName);
      if (seenSubcategories.has(subcategoryKey)) {
        addError(errors, `'${categoryName}' / '${subcategoryName}': duplicate subcategory name in this category`);
      } else {
        seenSubcategories.set(subcategoryKey, subcategoryIndex);
      }
      if (!Object.hasOwn(subcategory, 'items') || !Array.isArray(subcategory.items)) {
        addError(errors, `'${categoryName}' / '${subcategoryName}': 'items' must be a list`);
        return;
      }
      if (subcategory.items.length === 0) {
        addError(errors, `'${categoryName}' / '${subcategoryName}': must contain at least one item`);
      }

      subcategory.items.forEach((item, itemIndex) => {
        itemCount += 1;
        const baseLocation = `'${categoryName}' / '${subcategoryName}' / item[${itemIndex}]`;
        if (!isPlainObject(item)) {
          addError(errors, `${baseLocation}: item must be a mapping`);
          return;
        }

        // Preflight every schema field for type and length before anything interpolates a
        // value into a location, normalizes it, or hands it to the URL parser. This rejects a
        // non-string field (for example a `logo` object graph) and an oversized scalar (for
        // example a reused alias) using only the bounded baseLocation, so a hostile value
        // cannot materialize a giant diagnostic or traversal even while the file stays under
        // the byte and item caps.
        let bounded = true;
        for (const [field, max] of Object.entries(LENGTH_LIMITS)) {
          if (!Object.hasOwn(item, field)) continue;
          if (typeof item[field] !== 'string') {
            addError(errors, `${baseLocation}: ${field} must be a string`);
            bounded = false;
            continue;
          }
          if (item[field].length > max) {
            addError(errors, `${baseLocation}: ${field} is longer than ${max} characters`);
            bounded = false;
            continue;
          }
          // Names and descriptions are rendered directly, so reject control/format characters
          // (zero-width, bidi) that would let them spoof. This runs only after the value is
          // known to be within its length cap, so the test cost stays bounded even for a
          // scalar alias reused across many items.
          if ((field === 'name' || field === 'description') && CONTROL_OR_FORMAT.test(item[field])) {
            addError(errors, `${baseLocation}: ${field} contains control or format characters`);
            bounded = false;
          }
        }
        if (!bounded) return;

        let location = baseLocation;
        if (Object.hasOwn(item, 'name') && isNonEmptyString(item.name)) {
          location = `'${categoryName}' / '${subcategoryName}' / '${item.name}'`;
        }

        for (const field of REQUIRED_FIELDS) {
          if (!Object.hasOwn(item, field) || !isNonEmptyString(item[field])) {
            addError(errors, `${location}: missing or empty required field '${field}'`);
          }
        }
        if (Object.hasOwn(item, 'project') && isNonEmptyString(item.project) && !PROJECT_VALUES.has(item.project)) {
          addError(errors, `${location}: project ${JSON.stringify(item.project)} is not one of ${[...PROJECT_VALUES].sort().join(', ')}`);
        }
        if (Object.hasOwn(item, 'homepage_url') && isNonEmptyString(item.homepage_url)) {
          const problem = urlProblem('homepage_url', item.homepage_url);
          if (problem) addError(errors, `${location}: ${problem}`);
        }
        if (Object.hasOwn(item, 'repo_url')) {
          if (!isNonEmptyString(item.repo_url)) {
            addError(errors, `${location}: repo_url is present but empty`);
          } else {
            const problem = urlProblem('repo_url', item.repo_url);
            if (problem) addError(errors, `${location}: ${problem}`);
          }
        }
        unexpectedKeys(item, ALLOWED_ITEM_FIELDS, location, errors);
        if (Object.hasOwn(item, 'name') && isNonEmptyString(item.name)) {
          const nameKey = normalizeKey(item.name);
          if (seenNames.has(nameKey)) {
            addError(errors, `${location}: duplicate entry name (also at ${seenNames.get(nameKey)})`);
          } else {
            seenNames.set(nameKey, location);
          }
        }
      });
    });
  });

  if (itemCount === 0) {
    addError(errors, `${source}: landscape contains no items`);
  }
  return errors;
}

function main() {
  const path = process.argv[2] ?? '../landscape/landscape.yml';
  let text;
  try {
    // Check the size before reading so an oversized file is not fully read into memory first.
    // validate() re-checks the byte length for unit tests and other callers.
    const { size } = statSync(path);
    if (size > MAX_BYTES) {
      console.error(`${path}: file is larger than ${MAX_BYTES} bytes`);
      process.exit(1);
    }
    text = readFileSync(path, 'utf8');
  } catch (err) {
    console.error(`cannot read ${path}: ${err.message}`);
    process.exit(2);
  }
  const errors = validate(text, path);
  if (errors.length > 0) {
    const count = errors.length >= MAX_ERRORS ? `${MAX_ERRORS}+ (reporting capped)` : `${errors.length}`;
    console.error(`landscape validation failed with ${count} problem(s):`);
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
