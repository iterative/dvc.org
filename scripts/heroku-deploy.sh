#!/usr/bin/env sh
mkdir /tmp/gatsby-build
mv $OLDPWD /tmp/gatsby-build
ln -s /tmp/gatsby-build $OLDPWD
cd /tmp/gatsby-build
node ./scripts/deploy-with-s3.js
