#!/usr/bin/env bash
source ./scripts/utils.sh

echo "Fetching origin/master to diff against"
git fetch origin master >/dev/null 2>&1

CHANGED_FILES="$(git diff origin/master HEAD --name-only -- '*.css' '*.js' '*.jsx' '*.md' '*.tsx' '*.ts' '*.json' ':!redirects-list.json' ':!*.test.js')"
EXIT_CODE=0

if [ -z "$CHANGED_FILES" ]; then
    echo "No checkable files have changed."
    exit 0
fi

echo -e "\nChecking links in changed files:"

echo "$CHANGED_FILES" | while read -r CHANGED_FILE ; do
    echo -n "$CHANGED_FILE:"
    ./scripts/link-check.sh <($DIFF_COMMAND -U0 -- "$CHANGED_FILE" | grep '^\+')
    if [ $? -ne 0 ] ; then
        EXIT_CODE=1
    fi
done

exit $EXIT_CODE
