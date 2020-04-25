#!/usr/bin/env bash

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
