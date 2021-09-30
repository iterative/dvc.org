#!/usr/bin/env bash
NEWPWD="/tmp/gatsby-build"
mkdir $NEWPWD
mv $OLDPWD $NEWPWD
ln -s $NEWPWD $OLDPWD
echo $PATH
ls $OLDPWD
cd $NEWPWD
which node
./scripts/deploy-with-s3.js
