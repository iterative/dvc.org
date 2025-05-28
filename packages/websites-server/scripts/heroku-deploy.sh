#!/usr/bin/env bash
set -euo pipefail
shopt -s inherit_errexit

NEWPWD="/tmp/gatsby-build"
mv $OLDPWD $NEWPWD
ln -s $NEWPWD $OLDPWD
cd $NEWPWD
chmod +x ./node_modules/@dvcorg/websites-server/scripts/deploy-with-s3.js
./node_modules/@dvcorg/websites-server/scripts/deploy-with-s3.js 
rm -rf static
