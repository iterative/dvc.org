#!/usr/bin/env bash
set -euo pipefail
shopt -s inherit_errexit

NEWPWD="/tmp/gatsby-build"
mv $OLDPWD $NEWPWD
ln -s $NEWPWD $OLDPWD
cd $NEWPWD
yarn build
rm -rf static .cache
# Copy the 404 HTML file from public into the root dir for Heroku
./scripts/clear-cloudfront-cache.js
