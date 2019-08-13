#!/bin/bash
# Run 'npx prettier' on the given .js or .md files. If no files are
# given, run it on all the .js and .md files of the project.

cd $(dirname $0)
cd ..

shopt -s globstar
files="$@"
[[ -z $files ]] && files='src/**/*.js pages/*.js static/**/*.md'
fix_files=$(npx prettier --list-different $files)
[[ -n $fix_files ]] && npx prettier --write $fix_files


