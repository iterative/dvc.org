# exp show

Print a customizable table of `dvc experiments`, their metrics and parameters.

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

Displays experiments and
[checkpoints](/doc/command-reference/exp/run#checkpoints) in a detailed table
which includes their parent, name (or hash), metrics, and parameters. Only the
experiments derived from the Git `HEAD` are shown by default but all experiments
can be included with the `--all-commits` option. Example:

```dvc
$ dvc exp show
┏━━━━━━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━┓
┃ Experiment    ┃ avg_prec ┃ roc_auc ┃ train.n_est┃ train.min_split ┃
┡━━━━━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━┩
│ workspace     │  0.56191 │ 0.93345 │ 50         │ 2               │
│ master        │  0.55259 │ 0.91536 │ 50         │ 2               │
│ ├── exp-bfe64 │  0.57833 │ 0.95555 │ 50         │ 8               │
│ └── exp-ad5b1 │  0.56191 │ 0.93345 │ 50         │ 2               │
└───────────────┴──────────┴─────────┴────────────┴─────────────────┘
```

Your terminal will enter a
[paginated screen](/doc/command-reference/dag#paginating-the-output) by default,
which you can typically exit by typing `Q`. Use `--no-pager` to print the table
to standard output.

By default, the printed experiments table will include columns for all metrics
and params from the entire project. The `--include-metrics`,
`--exclude-metrics`, `--include-params`, and `--exclude-params` options can
determine which ones should be visible.

Experiments in the table are first grouped (by parent commit). They are then
sorted inside each group, chronologically by default. The `--sort-by` and
`--sort-order` options can change this ordering, based on any single, visible
metric or param.

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

- `--include-params <list>` - show the specified `dvc params` in the table only.
  Accepts a comma-separated `list` of param names (including groups).

- `--exclude-params <list>` - hide the specified `dvc params` from the table
  (all param will be shown except for these). Accepts a comma-separated `list`
  of param names (including groups).

- `--include-metrics <list>` - show the specified `dvc metrics` in the table
  only. Accepts a comma-separated `list` of metric names (including groups).

- `--exclude-metrics <list>` - hide the specified `dvc metrics` from the table
  (all param will be shown except for these). Accepts a comma-separated `list`
  of metric names (including groups).

- `--sort-by <name>` - sort experiments by the specified metric or param
  (`name`). Only one visible column (either metric or param) can be used for
  sorting. This only affects the ordering of experiments derived from the same
  parent commit. Parent commits are always sorted chronologically.

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

## Example: Tabular data

> This example is based on our
> [Get Started](/doc/tutorials/get-started/experiments), where you can find the
> actual source code. The basic use case shows the values in the current
> workspace:

```dvc
$ dvc exp show
┏━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━┓
┃ Experiment            ┃ Created      ┃     auc ┃ featurize.max_fea… ┃ featurize.ngrams ┃ prepare.seed ┃ prepare.split ┃ train.n_estimators ┃ train.seed ┃
┡━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━┩
│ workspace             │ -            │ 0.61314 │ 1500               │ 2                │ 20170428     │ 0.2           │ 50                 │ 20170428   │
│ 11-bigrams-experiment │ Jun 20, 2020 │ 0.61314 │ 1500               │ 2                │ 20170428     │ 0.2           │ 50                 │ 20170428   │
│ ├── exp-e6c97         │ Oct 21, 2020 │ 0.61314 │ 1500               │ 2                │ 20170428     │ 0.2           │ 50                 │ 20170428   │
│ ├── exp-1dad0         │ Oct 09, 2020 │ 0.57756 │ 2000               │ 2                │ 20170428     │ 0.2           │ 50                 │ 20170428   │
│ └── exp-1df77         │ Oct 09, 2020 │ 0.51676 │ 500                │ 2                │ 20170428     │ 0.2           │ 50                 │ 20170428   │
└───────────────────────┴──────────────┴─────────┴────────────────────┴──────────────────┴──────────────┴───────────────┴────────────────────┴────────────┘
```

```dvc
$ dvc exp show --include-params=featurize
┏━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━┓
┃ Experiment            ┃ Created      ┃     auc ┃ featurize.max_features ┃ featurize.ngrams ┃
┡━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━┩
│ workspace             │ -            │ 0.61314 │ 1500                   │ 2                │
│ 11-bigrams-experiment │ Jun 20, 2020 │ 0.61314 │ 1500                   │ 2                │
│ ├── exp-e6c97         │ Oct 21, 2020 │ 0.61314 │ 1500                   │ 2                │
│ ├── exp-1dad0         │ Oct 09, 2020 │ 0.57756 │ 2000                   │ 2                │
│ └── exp-1df77         │ Oct 09, 2020 │ 0.51676 │ 500                    │ 2                │
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
│ ├── exp-1df77         │ Oct 09, 2020 │ 0.51676 │ 500                    │ 2                │
│ ├── exp-1dad0         │ Oct 09, 2020 │ 0.57756 │ 2000                   │ 2                │
│ └── exp-e6c97         │ Oct 21, 2020 │ 0.61314 │ 1500                   │ 2                │
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
│ ├── exp-1df77         │ Oct 09, 2020 │ 0.51676 │ 500                    │ 2                │
│ ├── exp-1dad0         │ Oct 09, 2020 │ 0.57756 │ 2000                   │ 2                │
│ └── exp-e6c97         │ Oct 21, 2020 │ 0.61314 │ 1500                   │ 2                │
│ 10-bigrams-model      │ Jun 20, 2020 │ 0.54175 │ 1500                   │ 2                │
│ └── exp-069d9         │ Sep 24, 2020 │ 0.51076 │ 2500                   │ 2                │
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
