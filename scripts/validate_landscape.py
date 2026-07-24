#!/usr/bin/env python3
"""Validate landscape/landscape.yml against the schema in docs/data-schemas.md.

Checks that the file parses, follows the category -> subcategory -> item
structure, has the required item fields, uses a valid `project` value, keeps
URLs on https, and has no duplicate entry names. Prints every problem it finds
and exits non-zero if there are any, so it can gate pull requests that change
the landscape data.

Usage: python scripts/validate_landscape.py [path/to/landscape.yml]
"""
import sys

try:
    import yaml
except ImportError:
    print("error: PyYAML is required (pip install pyyaml)", file=sys.stderr)
    sys.exit(2)

PROJECT_VALUES = {"graduated", "incubating", "member", "external"}
REQUIRED_ITEM_FIELDS = ("name", "homepage_url", "description", "project")


def is_nonempty_str(value):
    return isinstance(value, str) and value.strip() != ""


def validate(path):
    errors = []
    try:
        with open(path, "r", encoding="utf-8") as handle:
            data = yaml.safe_load(handle)
    except yaml.YAMLError as exc:
        return [f"{path}: YAML parse error: {exc}"]
    except OSError as exc:
        return [f"{path}: cannot read file: {exc}"]

    if not isinstance(data, dict) or "landscape" not in data:
        return [f"{path}: top-level 'landscape' key is missing"]
    categories = data["landscape"]
    if not isinstance(categories, list):
        return [f"{path}: 'landscape' must be a list of categories"]

    seen_names = {}  # normalized name -> first location where it appeared
    for cat_index, category in enumerate(categories):
        if not isinstance(category, dict) or not is_nonempty_str(category.get("category")):
            errors.append(f"landscape[{cat_index}]: missing 'category' name")
            continue
        cat_name = category["category"]
        subcategories = category.get("subcategories")
        if not isinstance(subcategories, list):
            errors.append(f"category '{cat_name}': 'subcategories' must be a list")
            continue
        for sub_index, subcategory in enumerate(subcategories):
            if not isinstance(subcategory, dict) or not is_nonempty_str(subcategory.get("subcategory")):
                errors.append(f"category '{cat_name}': subcategory[{sub_index}] missing 'subcategory' name")
                continue
            sub_name = subcategory["subcategory"]
            items = subcategory.get("items")
            if not isinstance(items, list):
                errors.append(f"'{cat_name}' / '{sub_name}': 'items' must be a list")
                continue
            for item_index, item in enumerate(items):
                location = f"'{cat_name}' / '{sub_name}' / item[{item_index}]"
                if not isinstance(item, dict):
                    errors.append(f"{location}: item must be a mapping")
                    continue
                name = item.get("name")
                if is_nonempty_str(name):
                    location = f"'{cat_name}' / '{sub_name}' / '{name}'"

                for field in REQUIRED_ITEM_FIELDS:
                    if not is_nonempty_str(item.get(field)):
                        errors.append(f"{location}: missing or empty required field '{field}'")

                project = item.get("project")
                if is_nonempty_str(project) and project not in PROJECT_VALUES:
                    errors.append(
                        f"{location}: project '{project}' is not one of {sorted(PROJECT_VALUES)}"
                    )

                homepage = item.get("homepage_url")
                if is_nonempty_str(homepage) and not homepage.startswith("https://"):
                    errors.append(f"{location}: homepage_url must start with https:// (got '{homepage}')")

                if "repo_url" in item:
                    repo = item.get("repo_url")
                    if not is_nonempty_str(repo):
                        errors.append(f"{location}: repo_url is present but empty")
                    elif not repo.startswith("https://"):
                        errors.append(f"{location}: repo_url must start with https:// (got '{repo}')")

                if is_nonempty_str(name):
                    key = name.strip().lower()
                    if key in seen_names:
                        errors.append(f"{location}: duplicate entry name (also at {seen_names[key]})")
                    else:
                        seen_names[key] = location

    return errors


def main():
    path = sys.argv[1] if len(sys.argv) > 1 else "landscape/landscape.yml"
    errors = validate(path)
    if errors:
        print(f"landscape validation failed with {len(errors)} problem(s):", file=sys.stderr)
        for error in errors:
            print(f"  - {error}", file=sys.stderr)
        sys.exit(1)
    print(f"{path}: OK")


if __name__ == "__main__":
    main()
