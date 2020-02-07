#!/usr/bin/env bash
set -euxo pipefail
$(dirname "$0")/link-check.sh <(git diff $(git merge-base HEAD origin/master) -U0 | grep '^\+')
