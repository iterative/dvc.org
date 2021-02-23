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
experiments can be included with the `---all-commits` option.

`dvc exp show` enters a paginated screen by default, which you can exit by
typing `Q` (or Esc) in your keyboard. Use `--no-pager` to print the entire
output to terminal instead.

## Options

- `-a`, `--all-branches` - print experiments derived from the tip of all Git
  branches instead of just those derived from the current workspace. Note that
  this can be combined with `-T` below, for example using the `-aT` flag.

- `-T`, `--all-tags` - same as `-a` above, but applies to Git tags as well as
  the workspace. Note that both options can be combined, for example using the
  `-aT` flag.

- `--all-commits` - same as `-a` or `-T` above, but applies to _all_ Git commits
  as well as the workspace. This prints all experiments derived from the entire
  commit history of the project.

- `--no-pager` - do not pipe output into a pager.

- `--include-metrics <metrics_list>` - include the specified metrics in output
  table. When this option is used, only the specified metrics columns will be
  shown.

- `--exclude-metrics <metrics_list>` - exclude the specified metrics from output
  table. When this option is used, all metric columns except for the specified
  columns will be shown.

- `--include-params <params_list>` - include the specified params in output
  table. When this option is used, only the specified params columns will be
  shown.

- `--exclude-params <params_list>` - exclude the specified params from output
  table. When this option is used, all params columns except for the specified
  columns will be shown.

- `--sort-by <metric/param>` - sort related experiments by the specified metric
  or param. Experiments in the printed table will be sorted by the specified
  metric or param column. By default, experiments will be sorted by timestamp.
  Only one sort column (either metric or param) can be specified.

- `--sort-order {asc,desc}` - sort order to use with `--sort-by`. Defaults to
  descending.

- `--no-timestamp` - do not show experiment timestamps.

- `--sha` - always show Git commit SHAs instead of branch/tag names. By default,
  if commit is the tip of a Git branch or a Git tag, the branch or tag name will
  be shown instead of the Git SHA.

- `--show-json` - prints the command's output in easily parsable JSON format,
  instead of a human-readable table.

- `--precision <n>` - round metrics and params to `n` digits precision after the
  decimal point. Rounds to 5 digits by default.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.
