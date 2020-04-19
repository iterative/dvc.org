#!/usr/bin/env bash
set -euo pipefail

repo="$(dirname "$(realpath "$(dirname "$0")")")"
pushd "$repo"

# can't do git ls-files since some may be untracked
(find .github/ content/docs/ src/ -name '*.md' -o -name '*.js' && ls *.md *.js) \
  | xargs -n1 -P8 "$(dirname "$0")"/link-check.sh

popd
