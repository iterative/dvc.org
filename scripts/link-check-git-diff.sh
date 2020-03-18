#!/usr/bin/env bash
set -euo pipefail

differ="git diff $(git merge-base HEAD origin/master)"
$differ --name-only | while read -r f ; do
  echo -n "$f:"
  $(dirname "$0")/link-check.sh <($differ -U0 -- "$f" | grep '^\+')
done
