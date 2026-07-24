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

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim() !== '';
}

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
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
  return null;
}

export function validate(text, source = 'landscape.yml') {
  let data;
  try {
    data = yaml.load(text);
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
    const categoryKey = categoryName.trim().toLowerCase();
    if (seenCategories.has(categoryKey)) {
      errors.push(`category '${categoryName}': duplicate category name (also at ${seenCategories.get(categoryKey)})`);
    } else {
      seenCategories.set(categoryKey, `landscape[${categoryIndex}]`);
    }
    if (!Array.isArray(category.subcategories)) {
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
      const subcategoryKey = subcategoryName.trim().toLowerCase();
      if (seenSubcategories.has(subcategoryKey)) {
        errors.push(`'${categoryName}' / '${subcategoryName}': duplicate subcategory name in this category`);
      } else {
        seenSubcategories.set(subcategoryKey, subcategoryIndex);
      }
      if (!Array.isArray(subcategory.items)) {
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
          const nameKey = item.name.trim().toLowerCase();
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
