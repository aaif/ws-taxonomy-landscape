import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { validate } from './validate-landscape.mjs';

const VALID = `landscape:
  - category: Frameworks
    subcategories:
      - subcategory: Agents
        items:
          - name: goose
            logo: placeholder.svg
            homepage_url: https://goose-docs.ai/
            repo_url: https://github.com/aaif-goose/goose
            description: An open agent.
            project: member
`;

function hasError(errors, pattern) {
  return errors.some((error) => pattern.test(error));
}

test('valid data produces no errors', () => {
  assert.deepEqual(validate(VALID), []);
});

test('the committed landscape.yml passes', () => {
  const path = fileURLToPath(new URL('../landscape/landscape.yml', import.meta.url));
  assert.deepEqual(validate(readFileSync(path, 'utf8'), path), []);
});

test('duplicate mapping keys fail parsing, matching the site', () => {
  const doc = VALID.replace('name: goose\n', 'name: goose\n            name: shadow\n');
  assert.ok(hasError(validate(doc), /parse error/i));
});

test('an empty landscape is rejected', () => {
  assert.ok(hasError(validate('landscape: []'), /at least one category/));
});

test('a landscape with no items is rejected', () => {
  const doc = `landscape:\n  - category: C\n    subcategories:\n      - subcategory: S\n        items: []\n`;
  assert.ok(hasError(validate(doc), /no items/));
});

test('a missing required field is caught', () => {
  const doc = VALID.replace('            description: An open agent.\n', '');
  assert.ok(hasError(validate(doc), /required field 'description'/));
});

test('an invalid project value is caught', () => {
  const doc = VALID.replace('project: member', 'project: hosted');
  assert.ok(hasError(validate(doc), /project "hosted" is not one of/));
});

test('a non-https url is caught', () => {
  const doc = VALID.replace('https://goose-docs.ai/', 'http://goose-docs.ai/');
  assert.ok(hasError(validate(doc), /homepage_url must start with https/));
});

test('a url with whitespace is caught', () => {
  const doc = VALID.replace('https://goose-docs.ai/', 'https://goose docs.ai/');
  assert.ok(hasError(validate(doc), /must not contain whitespace/));
});

test('a misspelled optional field is caught', () => {
  const doc = VALID.replace('repo_url:', 'reop_url:');
  assert.ok(hasError(validate(doc), /unknown field "reop_url"/));
});

test('duplicate entry names are caught', () => {
  const doc = VALID.replace(
    '        items:\n',
    '        items:\n          - {name: goose, homepage_url: "https://x.example", description: d, project: member}\n',
  );
  assert.ok(hasError(validate(doc), /duplicate entry name/));
});

test('duplicate categories are caught', () => {
  const doc =
    VALID +
    '  - category: Frameworks\n    subcategories:\n      - subcategory: Other\n        items:\n          - {name: b, homepage_url: "https://x.example", description: d, project: member}\n';
  assert.ok(hasError(validate(doc), /duplicate category name/));
});

test('duplicate subcategories in one category are caught', () => {
  const doc =
    VALID +
    '      - subcategory: Agents\n        items:\n          - {name: c, homepage_url: "https://x.example", description: d, project: member}\n';
  assert.ok(hasError(validate(doc), /duplicate subcategory name/));
});

test('a prototype-pollution merge payload does not satisfy required fields', () => {
  // Inline merge (no anchor/alias), so this exercises the own-property checks
  // rather than the alias gate: a merged __proto__ never becomes an own field.
  const doc = `landscape:
  - category: C
    subcategories:
      - subcategory: S
        items:
          - <<: {__proto__: {name: injected, homepage_url: 'https://example.com', description: injected, project: member}}
`;
  const errors = validate(doc);
  assert.ok(errors.length > 0, errors.join('\n'));
  assert.ok(hasError(errors, /required field/), 'inherited fields must not count as own fields');
});

test('nested YAML aliases are rejected before they can amplify', () => {
  // Each alias reuses a node, so this ~3N-line file would otherwise be N^3 item
  // visits here and N^3 DOM nodes in the browser. The gate rejects it outright.
  const doc = `landscape:
  - &c
    category: C
    subcategories:
      - &s
        subcategory: S
        items:
          - &i {name: a, homepage_url: 'https://x.example', description: d, project: member}
          - *i
      - *s
  - *c
`;
  assert.ok(hasError(validate(doc), /reused object or array nodes .* are not allowed/));
});

test('a file larger than the byte cap is rejected', () => {
  const doc = 'landscape:\n' + '#'.repeat(2_000_001);
  assert.ok(hasError(validate(doc), /larger than \d+ bytes/));
});

test('an unexpected field on a subcategory is caught', () => {
  const doc = `landscape:
  - category: C
    subcategories:
      - subcategory: S
        bogus_sub_field: x
        items:
          - {name: y, homepage_url: "https://x.example", description: d, project: member}
`;
  assert.ok(hasError(validate(doc), /unknown field "bogus_sub_field"/));
});

test('an empty repo_url is caught', () => {
  const doc = VALID.replace('repo_url: https://github.com/aaif-goose/goose', 'repo_url: ""');
  assert.ok(hasError(validate(doc), /repo_url is present but empty/));
});

test('a non-https repo_url is caught', () => {
  const doc = VALID.replace('https://github.com/aaif-goose/goose', 'http://github.com/aaif-goose/goose');
  assert.ok(hasError(validate(doc), /repo_url must start with https/));
});

test('a logo that is not a string is rejected (no object graph passes)', () => {
  const doc = VALID.replace('logo: placeholder.svg', 'logo: [{}, {}, {}]');
  assert.ok(hasError(validate(doc), /logo must be a string/));
});

test('an oversized project scalar is rejected before its value is interpolated', () => {
  const doc = VALID.replace('project: member', `project: ${'x'.repeat(100)}`);
  assert.ok(hasError(validate(doc), /project is longer than/));
});

test('an oversized name is rejected before a giant location is built', () => {
  const doc = VALID.replace('name: goose', `name: ${'n'.repeat(300)}`);
  assert.ok(hasError(validate(doc), /name is longer than/));
});

test('a scheme-relative https url without // is rejected', () => {
  const doc = VALID.replace('https://goose-docs.ai/', 'https:goose-docs.ai/');
  assert.ok(hasError(validate(doc), /must start with https/));
});

test('an oversized unknown field key is bounded in the diagnostic', () => {
  const bigKey = 'z'.repeat(5000);
  const doc = `landscape:\n  - category: C\n    subcategories:\n      - subcategory: S\n        items:\n          - {name: n, homepage_url: https://x.example, description: d, project: member, ${bigKey}: v}\n`;
  const errs = validate(doc);
  assert.ok(errs.some((e) => /unknown field/.test(e)), 'the unknown key is flagged');
  assert.ok(errs.every((e) => e.length < 300), 'no error echoes the full 5000-char key');
});

test('an oversized YAML parse error is bounded', () => {
  const errors = validate('*' + 'a'.repeat(100_000));
  assert.equal(errors.length, 1);
  assert.ok(errors[0].length <= 520, `parse error should be bounded, got ${errors[0].length}`);
});

test('a bounded scalar alias is allowed, matching the documented policy', () => {
  const doc = `landscape:
  - category: C
    subcategories:
      - subcategory: S
        items:
          - name: one
            homepage_url: https://example.com/one
            description: &d shared text
            project: member
          - name: two
            homepage_url: https://example.com/two
            description: *d
            project: member
`;
  assert.deepEqual(validate(doc), []);
});

test('a bidi control character in a description is rejected', () => {
  const doc = VALID.replace('description: An open agent.', 'description: "Trusted \\u202e project"');
  assert.ok(hasError(validate(doc), /description contains control or format characters/));
});

test('an empty subcategories list is rejected', () => {
  assert.ok(hasError(validate('landscape:\n  - category: C\n    subcategories: []\n'), /at least one subcategory/));
});

test('an empty items list is rejected', () => {
  const doc = 'landscape:\n  - category: C\n    subcategories:\n      - subcategory: S\n        items: []\n';
  assert.ok(hasError(validate(doc), /at least one item/));
});

test('an unexpected field on a category is caught', () => {
  const doc =
    VALID +
    '  - category: Extra\n    typo_field: hidden\n    subcategories:\n      - subcategory: S\n        items:\n          - {name: z, homepage_url: "https://x.example", description: d, project: member}\n';
  assert.ok(hasError(validate(doc), /unknown field "typo_field"/));
});

test('an unexpected top-level field is caught', () => {
  assert.ok(hasError(validate('metadata: hidden\n' + VALID), /unknown field "metadata"/));
});

test('an inline merge key is rejected (failsafe schema does not merge)', () => {
  const doc = `landscape:
  - category: C
    subcategories:
      - subcategory: S
        items:
          - <<: {name: n, homepage_url: "https://x.example", description: d, project: member}
`;
  // Under FAILSAFE_SCHEMA "<<" is a plain key, so the merge never happens: the item
  // has no own required fields and carries an unknown "<<" field.
  assert.ok(hasError(validate(doc), /required field|unknown field/));
});

test('a merge alias is rejected', () => {
  const doc = `landscape:
  - category: C
    subcategories:
      - subcategory: S
        items:
          - &base {name: n, homepage_url: "https://x.example", description: d, project: member}
          - <<: *base
            name: m
`;
  assert.ok(validate(doc).length > 0);
});

test('a scalar alias reused across items is still length-capped per occurrence', () => {
  const huge = 'x'.repeat(3000);
  const doc = `landscape:
  - category: C
    subcategories:
      - subcategory: S
        items:
          - {name: a, homepage_url: "https://x.example/a", description: &D ${huge}, project: member}
          - {name: b, homepage_url: "https://x.example/b", description: *D, project: member}
`;
  assert.ok(hasError(validate(doc), /description is longer than/));
});

test('a single over-long description is rejected', () => {
  const doc = VALID.replace('An open agent.', 'x'.repeat(3000));
  assert.ok(hasError(validate(doc), /description is longer than/));
});

test('too many items are rejected', () => {
  let items = '';
  for (let i = 0; i <= 500; i++) {
    items += `          - {name: n${i}, homepage_url: "https://x.example/${i}", description: d, project: member}\n`;
  }
  const doc = `landscape:\n  - category: C\n    subcategories:\n      - subcategory: S\n        items:\n${items}`;
  assert.ok(hasError(validate(doc), /more than the 500 allowed/));
});

test('a numeric scalar stays a string under the failsafe schema (browser parity)', () => {
  // name: 789 must not become a number here while the browser (same options) keeps it a
  // string; both parse it as "789", so the search .toLowerCase() cannot throw on it.
  const doc = VALID.replace('name: goose', 'name: 789');
  assert.deepEqual(validate(doc), []);
});

test('the browser parses with the same failsafe options as the validator', () => {
  // Guards the CI/browser parser parity: app.js must load YAML with FAILSAFE_SCHEMA so a
  // numeric or timestamp scalar cannot diverge between validation and the rendered site.
  const appjs = readFileSync(fileURLToPath(new URL('../landscape/static/app.js', import.meta.url)), 'utf8');
  assert.match(appjs, /jsyaml\.load\([^)]*FAILSAFE_SCHEMA/s);
});

test('the browser search regexes stay Unicode-aware and u-safe', () => {
  // Guards against reintroducing the case-folding gap, the same way the FAILSAFE_SCHEMA and
  // maxDepth checks guard parser parity. The filter and highlight regexes must carry the `u`
  // flag so both apply Unicode simple case-folding (a Kelvin sign matches `k`), and escapeRegExp
  // must not escape `-`, because a `\-` identity escape throws once the `u` flag is set.
  const appjs = readFileSync(fileURLToPath(new URL('../landscape/static/app.js', import.meta.url)), 'utf8');
  assert.match(appjs, /new RegExp\(escapeRegExp\([^)]*\),\s*'iu'\)/, 'the filter regex must use the iu flags');
  assert.match(appjs, /new RegExp\(escapeRegExp\([^)]*\),\s*'giu'\)/, 'the highlight regex must use the giu flags');
  const escClass = appjs.match(/function escapeRegExp[\s\S]*?text\.replace\((\/\[.*?\]\/g)/);
  assert.ok(escClass, 'escapeRegExp escapes a character class');
  assert.ok(!escClass[1].includes('-'), 'escapeRegExp must not escape "-" so the pattern stays valid under u');
});

test('an over-long category name is rejected before it inflates errors', () => {
  const doc = VALID.replace('category: Frameworks', `category: ${'A'.repeat(200)}`);
  assert.ok(hasError(validate(doc), /category name is longer than/));
});

test('the number of reported errors is capped', () => {
  let items = '';
  for (let i = 0; i < 300; i++) items += '          - {}\n';
  const doc = `landscape:\n  - category: C\n    subcategories:\n      - subcategory: S\n        items:\n${items}`;
  const errors = validate(doc);
  assert.ok(errors.length <= 200, `expected the error count to be capped at 200, got ${errors.length}`);
});

test('a control or format character in a name is rejected', () => {
  const doc = VALID.replace('name: goose', 'name: "goo\\u200bse"');
  assert.ok(hasError(validate(doc), /control or format characters/));
});

test('an over-long logo is rejected', () => {
  const doc = VALID.replace('logo: placeholder.svg', `logo: ${'x'.repeat(400)}`);
  assert.ok(hasError(validate(doc), /logo is longer than/));
});

test('a url with embedded credentials is rejected', () => {
  const doc = VALID.replace('https://goose-docs.ai/', 'https://user:pass@goose-docs.ai/');
  assert.ok(hasError(validate(doc), /must not contain credentials/));
});

test('unicode-equivalent duplicate names are caught', () => {
  const doc = VALID.replace(
    '        items:\n',
    '        items:\n          - {name: ｇｏｏｓｅ, homepage_url: "https://x.example", description: d, project: member}\n',
  );
  assert.ok(hasError(validate(doc), /duplicate entry name/));
});

test('a document with too many objects is rejected before a full walk', () => {
  // A wide unknown top-level key does not count toward the item cap. js-yaml still parses the
  // bounded input (the byte cap limits that), but the graph budget stops the validation walk
  // once it exceeds MAX_CONTAINERS instead of traversing the whole graph.
  const doc = VALID + 'junk: [' + '{},'.repeat(5001) + ']\n';
  assert.ok(hasError(validate(doc), /more than \d+ objects or arrays/));
});

test('a document with too many references is rejected by the edge budget', () => {
  // Only a couple of containers (one array), but many scalar elements, so the edge budget
  // triggers before the container budget does.
  const doc = VALID + 'junk: [' + '1,'.repeat(20001) + ']\n';
  assert.ok(hasError(validate(doc), /more than \d+ graph edges/));
});

test('the schema example in docs/data-schemas.md validates', () => {
  // Guards against a docs example that would fail the validator a reader copies it into.
  const docs = readFileSync(fileURLToPath(new URL('../docs/data-schemas.md', import.meta.url)), 'utf8');
  const example = docs.split('```').find((b) => b.includes('landscape:') && b.includes('Model Armor'));
  assert.ok(example, 'expected a landscape example block in docs/data-schemas.md');
  const yaml = example.replace(/^[a-zA-Z]*\n/, '');
  assert.deepEqual(validate(yaml), []);
});

test('the browser js-yaml version, SRI, and parse options match the pinned bundle', () => {
  // If js-yaml is bumped without updating index.html, the browser rejects the script on an SRI
  // mismatch and the site fails to load, while these Node tests would still pass. Lock the CDN
  // version and the integrity hash to the installed bundle, and keep maxDepth in sync.
  const pkg = JSON.parse(readFileSync(fileURLToPath(new URL('./package.json', import.meta.url)), 'utf8'));
  const version = (pkg.dependencies || {})['js-yaml'] || (pkg.devDependencies || {})['js-yaml'];
  const bundle = readFileSync(fileURLToPath(new URL('./node_modules/js-yaml/dist/js-yaml.min.js', import.meta.url)));
  const expectedSri = `sha512-${createHash('sha512').update(bundle).digest('base64')}`;
  const html = readFileSync(fileURLToPath(new URL('../landscape/static/index.html', import.meta.url)), 'utf8');
  assert.ok(html.includes(`js-yaml@${version}/`), `index.html should load js-yaml@${version}`);
  assert.ok(html.includes(expectedSri), 'index.html SRI must match the installed js-yaml bundle');
  const appJs = readFileSync(fileURLToPath(new URL('../landscape/static/app.js', import.meta.url)), 'utf8');
  const validatorJs = readFileSync(fileURLToPath(new URL('./validate-landscape.mjs', import.meta.url)), 'utf8');
  const appDepth = appJs.match(/maxDepth:\s*(\d+)/)?.[1];
  const validatorDepth = validatorJs.match(/maxDepth:\s*(\d+)/)?.[1];
  assert.ok(appDepth && validatorDepth, 'both app.js and the validator set maxDepth');
  assert.equal(appDepth, validatorDepth, 'app.js and the validator must use the same maxDepth');
});
