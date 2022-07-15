#!/usr/bin/env bash
NEWPWD="/tmp/gatsby-build"
mv $OLDPWD $NEWPWD
ln -s $NEWPWD $OLDPWD
cd $NEWPWD
./scripts/deploy-with-s3.js
rm -rf static
