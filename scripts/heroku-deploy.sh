#!/usr/bin/env bash
set -euo pipefail
shopt -s inherit_errexit

NEWPWD="/tmp/gatsby-build"
mv $OLDPWD $NEWPWD
ln -s $NEWPWD $OLDPWD
cd $NEWPWD
dvc config core.no_scm true
./scripts/deploy-with-s3.js
rm -rf static .dvc .heroku/python contents content
