# exp show

Display `dvc experiments` as a table, with optional formatting.

> Press `q` to exit.

## Synopsis

```usage
usage: dvc exp show [-h] [-q | -v] [-a] [-T] [--all-commits] [--no-pager]
                    [--include-metrics <metrics_list>]
                    [--exclude-metrics <metrics_list>]
                    [--include-params <params_list>]
                    [--exclude-params <params_list>]
                    [--sort-by <metric/param>] [--sort-order {asc,desc}]
                    [--no-timestamp] [--sha] [--show-json]
                    [--precision <n>]
```

## Description

Enters a screen that shows all of the relevant experiments you've run. Typically
you can exit this screen by typing `q` in your keyboard.

By default only the experiments derived from the last project version (Git
commit) are listed, but you can use `-n` to include the ones based on a given
number of previous commits.
