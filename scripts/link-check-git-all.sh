#!/usr/bin/env bash
set -euo pipefail

source "$(dirname "$0")"/utils.sh
pushd "$repo"

# can't do git ls-files since some may be untracked
(
  find .github/ content/docs/ src/ \
    -name '*.css' -o -name '*.js' -o -name '*.jsx' -o -name '*.md' -o -name '*.tsx' -o \
    -name '*.ts' -o -name '*.json'
  ls *.css *.js *.jsx *.md *.tsx *.ts *.json 2>/dev/null || :
) | grep -Ev '(package-lock\.json|redirects-list\.json|\.test\.js)$' \
  | xargs -n1 -P8 "$(dirname "$0")"/link-check.sh

popd
