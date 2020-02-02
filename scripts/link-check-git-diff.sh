#!/usr/bin/env bash
set -euxo pipefail
$(dirname $0)/link-check.sh <(git diff origin/master -U0)
