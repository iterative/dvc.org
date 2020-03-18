#!/usr/bin/env bash
set -euo pipefail
differ="git diff $(git merge-base HEAD origin/master)"
$differ --name-only | while read -r file ; do
  echo -n "$file:"
  $(dirname "$0")/link-check.sh <($differ -U0 -- "$file" | grep '^\+')
done
