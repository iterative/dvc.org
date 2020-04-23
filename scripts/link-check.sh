#!/usr/bin/env bash
# Check HTTP status codes of links in the given files.
# Success: 2xx, Errors: 4xx/5xx, Warnings: anything else.
# Redirects (3xx) are followed.
# Usage:
#     link-check.sh [<files>]
set -euo pipefail

base_url="${CHECK_LINKS_RELATIVE_URL:-https://dvc.org}"
exclude="${CHECK_LINKS_EXCLUDE_LIST:-$(dirname $0)/exclude-links.txt}"
[ -f "$exclude" ] && exclude="$(cat $exclude)"
user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:74.0) Gecko/20100101 Firefox/74.0"


finder(){  # expects list of files
  # explicit links not in markdown
  pcregrep -o '(?<!\]\()https?://[^\s<>{}"'"'"'`]+' "$@"
  # explicit links in markdown
  pcregrep -o '(?<=\])\(https?://[^[\]\s]+\)' "$@" | pcregrep -o '\((?:[^)(]*(?R)?)*+\)' | pcregrep -o '(?<=\().*(?=\))'
  # relative links in markdown
  sed -nE 's/.*]\((\/[^)[:space:]]+).*/\1/p' "$@" | xargs -n1 -II echo ${base_url}I
  # relative links in html
  sed -nE 's/.*href=["'"'"'](\/[^"'"'"']+?)["'"'"'].*/\1/p' "$@" | xargs -n1 -II echo ${base_url}I
}

checker(){  # expects list of urls
  errors=0
  for url in "$@"; do
    status="$(curl -IL -A "$user_agent" -w '%{http_code}' -so /dev/null "$url")"
    case "$status" in
      2??)
        # success
        ;;
      429)
        # too many requests: treat as success
        ;;
      999)
        # linkedin denied code: treat as success
        ;;
      [45]??)
        echo
        echo " ERROR:$status:$url" >&2
        errors=$(($errors + 1))
        ;;
      *)
        echo
        echo " WARNING:$status:$url" >&2
        ;;
    esac
  done
  return $errors
}

fails=0
for file in "$@"; do
  echo -n "$file:"
  prev=$fails
  checker $(finder "$file" | sed 's/#.*//g' | sort -u | comm -23 - <(echo "$exclude" | sort -u)) || fails=$(($fails + 1))
  [ $prev -eq $fails ] && echo OK
done

[ $fails -eq 0 ] || echo -e "ERROR:$fails failures\n---" >&2
exit $fails
