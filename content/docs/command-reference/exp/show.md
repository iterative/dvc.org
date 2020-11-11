# exp show

Print [experiments](/doc/command-reference/exp) table, with optional formatting.

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

optional arguments:
  -a, --all-branches    Show metrics for all branches.
  -T, --all-tags        Show metrics for all tags.
  --all-commits         Show metrics for all commits.
  --no-pager            Do not pipe output into a pager.
  --include-metrics <metrics_list>
                        Include the specified metrics in output table.
  --exclude-metrics <metrics_list>
                        Exclude the specified metrics from output table.
  --include-params <params_list>
                        Include the specified params in output table.
  --exclude-params <params_list>
                        Exclude the specified params from output table.
  --sort-by <metric/param>
                        Sort related experiments by the specified metric or param.
  --sort-order {asc,desc}
                        Sort order to use with --sort-by.
  --no-timestamp        Do not show experiment timestamps.
  --sha                 Always show git commit SHAs instead of branch/tag names.
  --show-json           Print output in JSON format instead of a human-readable table.
  --precision <n>       Round metrics/params to `n` digits precision after the decimal point. Rounds to 5 digits by default.
```

## Description

Finds and prints local experiments in the <abbr>project</abbr>.

By default, all experiments derived from the current workspace will be shown.
The `-a`, `-T`, and `--all-commits` options can be used to display more
experiments.

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

## Example: Tabular data

> This example is based on our
> [Get Started](/doc/tutorials/get-started/experiments), where you can find the
> actual source code.

The basic use case shows the values in the current workspace:

```dvc
$ dvc exp show
┏━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━┓
┃ Experiment            ┃ Created      ┃     auc ┃ featurize.max_fea… ┃ featurize.ngrams ┃ prepare.seed ┃ prepare.split ┃ train.n_estimators ┃ train.seed ┃
┡━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━┩
│ workspace             │ -            │ 0.61314 │ 1500               │ 2                │ 20170428     │ 0.2           │ 50                 │ 20170428   │
│ 11-bigrams-experiment │ Jun 20, 2020 │ 0.61314 │ 1500               │ 2                │ 20170428     │ 0.2           │ 50                 │ 20170428   │
│ ├── e6c974b           │ Oct 21, 2020 │ 0.61314 │ 1500               │ 2                │ 20170428     │ 0.2           │ 50                 │ 20170428   │
│ ├── 1dad0d2           │ Oct 09, 2020 │ 0.57756 │ 2000               │ 2                │ 20170428     │ 0.2           │ 50                 │ 20170428   │
│ └── 1df77f7           │ Oct 09, 2020 │ 0.51676 │ 500                │ 2                │ 20170428     │ 0.2           │ 50                 │ 20170428   │
└───────────────────────┴──────────────┴─────────┴────────────────────┴──────────────────┴──────────────┴───────────────┴────────────────────┴────────────┘
```

```dvc
$ dvc exp show --include-params=featurize
┏━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━┓
┃ Experiment            ┃ Created      ┃     auc ┃ featurize.max_features ┃ featurize.ngrams ┃
┡━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━┩
│ workspace             │ -            │ 0.61314 │ 1500                   │ 2                │
│ 11-bigrams-experiment │ Jun 20, 2020 │ 0.61314 │ 1500                   │ 2                │
│ ├── e6c974b           │ Oct 21, 2020 │ 0.61314 │ 1500                   │ 2                │
│ ├── 1dad0d2           │ Oct 09, 2020 │ 0.57756 │ 2000                   │ 2                │
│ └── 1df77f7           │ Oct 09, 2020 │ 0.51676 │ 500                    │ 2                │
└───────────────────────┴──────────────┴─────────┴────────────────────────┴──────────────────┘
```

To sort experiments by the `auc` metric in ascending order:

```dvc
$ dvc exp show --include-params=featurize --sort-by=auc --sort-order=asc
┏━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━┓
┃ Experiment            ┃ Created      ┃     auc ┃ featurize.max_features ┃ featurize.ngrams ┃
┡━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━┩
│ workspace             │ -            │ 0.61314 │ 1500                   │ 2                │
│ 11-bigrams-experiment │ Jun 20, 2020 │ 0.61314 │ 1500                   │ 2                │
│ ├── 1df77f7           │ Oct 09, 2020 │ 0.51676 │ 500                    │ 2                │
│ ├── 1dad0d2           │ Oct 09, 2020 │ 0.57756 │ 2000                   │ 2                │
│ └── e6c974b           │ Oct 21, 2020 │ 0.61314 │ 1500                   │ 2                │
└───────────────────────┴──────────────┴─────────┴────────────────────────┴──────────────────┘
```

To see all experiments in the workspace and down the Git history:

```dvc
$ dvc exp show --all-commits --include-params=featurize --sort-by=auc --sort-order=asc
┏━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━┓
┃ Experiment            ┃ Created      ┃     auc ┃ featurize.max_features ┃ featurize.ngrams ┃
┡━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━┩
│ workspace             │ -            │ 0.61314 │ 1500                   │ 2                │
│ 11-bigrams-experiment │ Jun 20, 2020 │ 0.61314 │ 1500                   │ 2                │
│ ├── 1df77f7           │ Oct 09, 2020 │ 0.51676 │ 500                    │ 2                │
│ ├── 1dad0d2           │ Oct 09, 2020 │ 0.57756 │ 2000                   │ 2                │
│ └── e6c974b           │ Oct 21, 2020 │ 0.61314 │ 1500                   │ 2                │
│ 10-bigrams-model      │ Jun 20, 2020 │ 0.54175 │ 1500                   │ 2                │
│ └── 069d9cc           │ Sep 24, 2020 │ 0.51076 │ 2500                   │ 2                │
│ 9-evaluation          │ Jun 20, 2020 │ 0.54175 │ 500                    │ 1                │
│ 8-ml-pipeline         │ Jun 20, 2020 │       - │ 500                    │ 1                │
│ 6-prep-stage          │ Jun 20, 2020 │       - │ 500                    │ 1                │
│ 5-source-code         │ Jun 20, 2020 │       - │ 500                    │ 1                │
│ 4-import-data         │ Jun 20, 2020 │       - │ 1500                   │ 2                │
│ 2-track-data          │ Jun 20, 2020 │       - │ 1500                   │ 2                │
│ 3-config-remote       │ Jun 20, 2020 │       - │ 1500                   │ 2                │
│ 1-dvc-init            │ Jun 20, 2020 │       - │ 1500                   │ 2                │
│ 0-git-init            │ Jun 20, 2020 │       - │ 1500                   │ 2                │
└───────────────────────┴──────────────┴─────────┴────────────────────────┴──────────────────┘
```

Note that in the final example, the top level Git commits remain in their
original order. The experiment sorting only applies to experiments grouped
according to each top level Git commit.

The
[Compare Experiments](/doc/tutorials/get-started/experiments#compare-experiments)
chapter of our _Get Started_ covers the `-a` option to collect and print a
metrics file value across all Git branches.
