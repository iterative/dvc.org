#!/bin/bash
set -eu

NEWPWD="/tmp/gatsby-build"
mv $OLDPWD $NEWPWD
ln -s $NEWPWD $OLDPWD
cd $NEWPWD

yarn build

rm -rf static .cache
