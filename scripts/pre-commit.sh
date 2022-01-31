#!/bin/bash
git diff --cached --name-status | egrep -i "(A|M).*content\/blog\/.*\.(md|mdx)" | while read a b; do node ./scripts/update-blog-post.js $b; git add $b; done
yarn format-staged && yarn lint-staged
