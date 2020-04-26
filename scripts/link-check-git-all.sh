#!/usr/bin/env bash
set -euo pipefail

repo="$(dirname "$(realpath "$(dirname "$0")")")"
pushd "$repo"

# can't do git ls-files since some may be untracked
(find .github/ content/docs/ src/ \
  -name '*.css' -o -name '*.js' -o -name '*.jsx' -o -name '*.md' -o -name '*.tsx' -o \
  -name '*.ts' -o -name '*.json' && ls *.js *.jsx *.md *.tsx *.ts *.json) \
  | grep -Ev '(redirects-list\.json|\.test\.js)$' \
  | xargs -n1 -P8 "$(dirname "$0")"/link-check.sh

popd
