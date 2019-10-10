#!/bin/bash
# Check links on the given .md files. If no files are given, check all
# the .md files of the project.
# Usage:
#     scripts/check_links.sh <base-url> [<list-of-md-files>]
#
# If <base-url> is missing, default is 'https://dvc.org'
# If the list of files is missing, all the .md files is 'static/' will be checked
#
# Examples:
#     scripts/check_links.sh https://dvc.org static/docs/user-guide/*.md
#     scripts/check_links.sh http://localhost:3000
#     scripts/check_links.sh

cd $(dirname $0)
cd ..

# wget settings
# the option '--max-redirect=0' disables redirections
settings="-q --max-redirect=0 --method=HEAD"

BASE_URL=${1:-https://dvc.org}
BASE_URL=${BASE_URL%/}    # remove a trailing /
shift

files="$@"
[[ -z $files ]] && files='static/**/*.md'
#echo "$files"    # debug

shopt -s globstar
for file in $files; do
    #echo "===== $file"    # debug
    grep -o ']([^)]*)' $file | sed -e 's/^](//' -e 's/)$//' | \
        while read link; do
            case $link in
                /*)   url="${BASE_URL}${link}" ;;
                '#'*) continue ;;
                '')   continue ;;
                *)    url=$link ;;
            esac
            #echo "--- $url"    # debug
            wget $settings "$url" || echo "$file: '$link'"
        done
done

