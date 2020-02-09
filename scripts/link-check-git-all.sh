#!/usr/bin/env bash
(find pages/ public/static/docs/ src/ .github/ -name '*.md' -o -name '*.js' && ls *.md *.js) \
  | xargs -n1 -P8 $(dirname "$0")/link-check.sh
