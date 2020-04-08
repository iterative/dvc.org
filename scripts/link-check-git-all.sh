#!/usr/bin/env bash

repo="$(dirname "$(realpath "$(dirname "$0")")")"

(find "$repo"/.github/ "$repo"/content/docs/ "$repo"/src/ -name '*.md' -o -name '*.js' && ls "$repo"/*.md "$repo"/*.js) \
  | xargs -n1 -P8 $(dirname "$0")/link-check.sh
