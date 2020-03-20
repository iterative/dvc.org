#!/usr/bin/env bash
set -euo pipefail

exclude="${CHECK_LINKS_EXCLUDE_LIST:-$(dirname $0)/exclude-links.txt}"
differ="git diff $(git merge-base HEAD origin/master)"
changed="$($differ --name-only | grep -v "$(basename "$exclude")")"

[ -z "$changed" ] && exit 0

echo "$changed" | while read -r file ; do
  echo -n "$file:"
  $(dirname "$0")/link-check.sh <($differ -U0 -- "$file" | grep '^\+')
done
