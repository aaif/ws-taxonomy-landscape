#!/usr/bin/env bash
# Fail if any deployed source path contains a symlink. actions/upload-pages-artifact packs the
# tree with `tar --dereference`, so a symlink committed to the repo would be published as the
# bytes of its target (for example a runner-local file). Only the paths that are copied into the
# Pages artifact are checked, so this does not trip on the node_modules symlinks under scripts/.
# Run this in both PR CI and the deploy assembly, so a bad symlink is caught before merge, not
# only at deploy time. Must be run from the repository root.
set -euo pipefail

links="$(find landscape taxonomy index.html -type l -print)"
if [ -n "$links" ]; then
  echo "::error::Symlinks are not allowed in the deployed sources"
  printf '%s\n' "$links"
  exit 1
fi
echo "No symlinks in the deployed sources."
