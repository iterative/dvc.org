#!/usr/bin/env bash
set -euo pipefail

differ="git diff $(git merge-base HEAD origin/master)"
# caveat: can't accept spaces in paths
for f in $($differ --name-only) ; do
  echo -n "$f:"
  $(dirname "$0")/link-check.sh <($differ -U0 -- "$f" | grep '^\+')
done
