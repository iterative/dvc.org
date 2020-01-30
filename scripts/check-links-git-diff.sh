#!/usr/bin/env bash
$(dirname $0)/check-links.sh <(git diff origin/master -U0)
