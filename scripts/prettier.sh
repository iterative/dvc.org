#!/bin/bash
# Run 'npx prettier' on all .js and .md files.

cd $(dirname $0)
cd ..

shopt -s globstar
files=$(npx prettier --list-different src/**/*.js pages/*.js static/**/*.md)
[[ -n $files ]] && npx prettier --write $files


