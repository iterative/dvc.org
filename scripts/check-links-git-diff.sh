#!/usr/bin/env bash
set -euxo pipefail
$(dirname $0)/check-links.sh <(git diff origin/master -U0)
