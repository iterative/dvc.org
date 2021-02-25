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
experiments can be included with `---all-commits` (see the command
[options](#options for more alternatives)). Experiments are sorted by timestamp
by default.

Your terminal will enter a paginated screen by default, which you can exit by
typing `Q` in your keyboard. Use `--no-pager` to print the entire table at once
instead.

```dvc
$ dvc exp show --no-pager
┏━━━━━━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━┓
┃ Experiment    ┃ avg_prec ┃ roc_auc ┃ train.n_est┃ train.min_split ┃
┡━━━━━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━┩
│ workspace     │  0.56191 │ 0.93345 │ 50         │ 2               │
│ master        │  0.55259 │ 0.91536 │ 50         │ 2               │
│ ├── exp-bfe64 │  0.57833 │ 0.95555 │ 50         │ 8               │
│ └── exp-ad5b1 │  0.56191 │ 0.93345 │ 50         │ 2               │
└───────────────┴──────────┴─────────┴────────────┴─────────────────┘
```

## Filtering the output

By default, the printed experiments table will include columns for all metrics
and params from the entire project. The `--include-metrics`,
`--exclude-metrics`, `--include-params`, and `--exclude-params` options can be
used to limit the columns to be displayed. Each option accepts a comma-separated
list of metric or param names.

When an `--include-...` option is used, only the specified metric/param columns
will be displayed. When an `--exclude-...` option is used, all columns except
for those specified will be displayed.

`--include-...` and `--exclude-...` will match nested metrics and params. So for
a stage `featurize` with params `max_features` and `ngrams`,
`--include-params=featurize` would include columns for both
`featurize.max_features` and `featurize.ngrams`.

Metric and param columns are handled separately. So for the command
`dvc exp show --include-metrics=foo,bar`, `foo` and `bar` would be the only
metrics displayed in the output table, and all possible params columns would
also be displayed in the table.

## Sorting the output

By default, experiment rows will be sorted by timestamp in descending order. The
`--sort-by` and `--sort-order` options can be used to sort related experiment
rows on any single metric or param column.

Note that when sorting experiments, related experiments will remain grouped
together. This means that for a given Git commit `abc123`, all experiments
derived from that commit will be sorted and grouped together. Experiments
derived from a different Git commit `def456` would be sorted in their own group.

## Paging the output

This command's output is automatically piped to
[Less](<https://en.wikipedia.org/wiki/Less_(Unix)>), if available in the
terminal. (The exact command used is `less --chop-long-lines --clear-screen`.)
If `less` is not available (e.g. on Windows), the output is simply printed out.

> It's also possible to
> [enable Less paging on Windows](/doc/user-guide/running-dvc-on-windows#enabling-paging-with-less).

### Providing a custom pager

It's possible to override the default pager via the `DVC_PAGER` environment
variable. For example, the following command will replace the default pager with
[`more`](<https://en.wikipedia.org/wiki/More_(command)>), for a single run:

```dvc
$ DVC_PAGER=more dvc dag
```

For a persistent change, define `DVC_PAGER` in the shell configuration. For
example in Bash, we could add the following line to `~/.bashrc`:

```bash
export DVC_PAGER=more
```

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
