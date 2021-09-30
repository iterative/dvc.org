#!/usr/bin/env bash
NEWPWD="/tmp/gatsby-build"
mkdir $NEWPWD
mv $OLDPWD $NEWPWD
ln -s $NEWPWD $OLDPWD
ls $OLDPWD
cd $NEWPWD
echo $NEWPWD
ls
ls ./scripts
$NEWPWD/scripts/deploy-with-s3.js
