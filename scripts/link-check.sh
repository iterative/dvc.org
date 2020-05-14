#!/usr/bin/env bash
# Check HTTP status codes of links in the given files.
# Success: 2xx, Errors: 4xx/5xx, Warnings: anything else.
# Redirects (3xx) are followed.
# Usage:
#     link-check.sh [<files>]
set -euo pipefail

source "$(dirname "$0")"/utils.sh

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
  checker $(urlfinder "$base_url" "$file" | sed 's/#.*//g' | sort -u \
            | comm -23 - <(echo "$exclude" | sort -u)) \
    || fails=$(($fails + 1))
  [ $prev -eq $fails ] && echo OK
done

[ $fails -eq 0 ] || echo -e "ERROR:$fails failures\n---" >&2
exit $fails
