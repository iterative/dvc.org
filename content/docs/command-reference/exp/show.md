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

Shows experiments in a detailed table which includes parameters and metrics.
Only the experiments derived from the Git `HEAD` are shown by default but all
experiments can be included with the `---all-commits` option. Experiments are
sorted by timestamp by default.

Your terminal will enter a paginated screen by default, which you can exit by
typing `Q` in your keyboard. Use `--no-pager` to print the entire table at once
instead.

<!-- Quick example -->

## Options

- `-a`, `--all-branches` - include experiments derived from the tip of all Git
  branches instead of just the last commit. Note that this can be combined with
  `-T` below, for example using the `-aT` flag.

- `-T`, `--all-tags` - same as `-a` above, but applies to Git tags as well as
  the workspace. Note that both options can be combined, for example using the
  `-aT` flag.

- `--all-commits` - same as `-a` or `-T` above, but applies to _all_ Git commits
  as well as the workspace. This prints all experiments available.

- `--no-pager` - do not enter the pager screen. Writes the entire table to
  standard output. Useful to redirect the output to a file, or use your own
  paginator.

- `--include-params <list>` - include the specified `dvc params` in the table
  (only the specified params will be shown). Accepts a comma-separated `list` of
  param names.

- `--exclude-params <list>` - exclude the specified `dvc params` from the table
  (all param will be shown except for the specified ones). Accepts a
  comma-separated `list` of param names.

- `--include-metrics <list>` - include the specified `dvc metrics` in the table
  (only the specified metrics will be shown). Accepts a comma-separated `list`
  of metric names.

- `--exclude-metrics <list>` - exclude the specified `dvc metrics` from the
  table (all param will be shown except for the specified ones). Accepts a
  comma-separated `list` of metric names.

- `--sort-by <name>` - sort related experiments by the specified metric or param
  (`name`). Only one sort column (either metric or param) can be specified.

- `--sort-order {asc,desc}` - sort order to use with `--sort-by` (defaults to
  descending).

- `--no-timestamp` - do not show experiment timestamps.

- `--sha` - display Git commit (SHA) hashes instead of branch, tag, or
  experiment names.

- `--show-json` - prints the command's output in easily parsable JSON format,
  instead of a human-readable table.

- `--precision <n>` -
  [round](https://docs.python.org/3/library/functions.html#round) decimal values
  to `n` digits of precision (5 by default). Applies to metrics only.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.
