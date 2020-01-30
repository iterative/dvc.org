#!/usr/bin/env bash
# Check links in the given files don't 404.
# Usage:
#     check_links.sh [<files>]

base_url="${CHECK_LINKS_RELATIVE_URL:-https://dvc.org}"
exclude="${CHECK_LINKS_EXCLUDE_LIST:-$(dirname $0)/exclude-links.txt}"
[ -f "$exclude" ] && exclude="$(cat $exclude)"

finder(){  # expects list of files
  # explicit links
  grep -Eo 'https?://[^)[:space:]"'"'"'`]+' "$@"
  # markdown relative links
  sed -nr 's/.*]\((\/[^)[:space:]]+).*/\1/p' "$@" | xargs -n1 -II echo ${base_url}I
}
checker(){  # expects list of urls
  errors=0
  for url in "$@"; do
    case $(curl -IL -w '%{http_code}' -so /dev/null "$url") in
      404)
        echo " ERROR:404:$url" >&2
        errors=$(($errors + 1))
        ;;
      *)
        ;;
    esac
  done
  return $errors
}

fails=0
for file in "$@"; do
  echo -n "$file:"
  prev=$fails
  checker $(finder "$file" | sort -u | comm -23 - <(echo "$exclude" | sort -u) ) || fails=$(($fails + 1))
  [ $prev -eq $fails ] && echo OK
done
[ $fails -eq 0 ] || echo -e "ERROR:$fails failures\n---" >&2
exit $fails
