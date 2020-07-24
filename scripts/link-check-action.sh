#!/usr/bin/env bash
source ./scripts/utils.sh

echo "Fetching origin/master to diff against"
git fetch origin master >/dev/null 2>&1

differ="git diff $(git merge-base HEAD origin/master)"
changed="$($differ --name-only -- '*.css' '*.js' '*.jsx' '*.md' '*.tsx' '*.ts' '*.json' ':!redirects-list.json' ':!*.test.js')"
code=0

if [ -z "$changed" ]; then
    echo "\nNo checkable files have changed."
    exit 0
fi

echo "\nChecking links in changed files...\n"
echo "$changed" | while read -r file ; do
    echo -n "$file:"
    ./scripts/link-check.sh <($differ -U0 -- "$file" | grep '^\+')
    if [ $? -ne 0 ] ; then
        code=1
    fi
done

exit $code
