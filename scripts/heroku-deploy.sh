#!/usr/bin/env bash
NEWPWD="/tmp/gatsby-build"
echo $OLDPWD
echo $NEWPWD
mkdir $NEWPWD
mv $OLDPWD $NEWPWD
ln -s $NEWPWD $OLDPWD
cd $NEWPWD
node ./scripts/deploy-with-s3.js
