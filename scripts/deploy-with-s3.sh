#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
node $DIR/deploy-with-s3.js 2>&1 | tee log.txt
