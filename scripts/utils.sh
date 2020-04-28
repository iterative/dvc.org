#!/usr/bin/env bash
# Common utility functions and helpers for link-check.
# Defines:
#   repo, base_url, exclude, user_agent, urlfinder()

repo="$(dirname "$(realpath "$(dirname "$0")")")"
base_url="${CHECK_LINKS_RELATIVE_URL:-https://dvc.org}"
exclude="${CHECK_LINKS_EXCLUDE_LIST:-$(dirname "$0")/exclude-links.txt}"
[ -f "$exclude" ] && exclude="$(cat "$exclude")"
user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:74.0) Gecko/20100101 Firefox/74.0"

urlfinder(){  # expects <base_url> <files>...
  base_url="$1"
  content="$(cat "${@:2}")"  # read once (could be file descriptors)
  # explicit links not in markdown
  echo "$content" | pcregrep -o '(?<!\]\()https?://[^\s<>{}"'"'"'`]+'
  # explicit links in markdown
  echo "$content" | pcregrep -o '(?<=\])\(https?://[^[\]\s]+\)' | pcregrep -o '\((?:[^)(]*(?R)?)*+\)' | pcregrep -o '(?<=\().*(?=\))'
  # relative links in markdown
  echo "$content" | sed -nE 's/.*]\((\/[^)[:space:]]+).*/\1/p' | xargs -n1 -II echo ${base_url}I
  # relative links in html
  echo "$content" | sed -nE 's/.*href=["'"'"'](\/[^"'"'"']+)["'"'"'].*/\1/p' | xargs -n1 -II echo ${base_url}I
}
