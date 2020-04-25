#!/usr/bin/env bash
# Checks that `exclude-links.txt` contains only used links.
set -euo pipefail

source "$(dirname "$0")"/utils.sh
exclude="${CHECK_LINKS_EXCLUDE_LIST:-$(dirname "$0")/exclude-links.txt}"
[ -f "$exclude" ] && exclude="$(cat "$exclude")"

missing="$(
  urlfinder $(git ls-files '*.js' '*.jsx' '*.md' '*.tsx' '*.ts' '*.json') \
  | sed 's/#.*//g' | sort -u \
  | comm -13 - <(echo "$exclude" | sort -u)
)"

if [[ -n "$missing" ]]; then
  echo "ERROR:Exclusions not found in codebase:" >&2
  echo "$missing" | sed 's/^/  /' >&2
  exit 1
fi
