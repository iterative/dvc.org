# exp show

Displays your experiments in a customizable table or
[parallel coordinates plot](#example-parallel-coordinates-plot-pcp).

> Press `q` to exit.

## Synopsis

```usage
usage: dvc exp show [-h] [-q | -v] [-a] [-T] [-A] [-n <num>]
                    [--no-pager] [--include-metrics <metrics_list>]
                    [--exclude-metrics <metrics_list>]
                    [--include-params <params_list>]
                    [--exclude-params <params_list>] [--param-deps]
                    [--sort-by <metric/param>]
                    [--sort-order {asc,desc}] [--no-timestamp] [--sha]
                    [--json] [--csv] [--md] [--precision <n>]
                    [--pcp] [--only-changed]
```

## Description

Displays experiments and
[checkpoints](/doc/command-reference/exp/run#checkpoints) in a detailed table
which includes their parent and name (or hash), as well as project metrics and
parameters. Only the experiments derived from the Git `HEAD` are shown by
default but all experiments can be included with the `--all-commits` option.
Example:

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
and params from the entire project. The `--param-deps`, `--include-metrics`, and
other [options](#options) can determine which ones should be displayed.

Experiments in the table are first grouped (by parent commit). They are then
sorted inside each group, chronologically by default. The `--sort-by` and
`--sort-order` options can change this ordering, based on any single, visible
metric or param.

When the `--pcp` option is passed, an interactive
[parallel coordinates plot](#example-parallel-coordinates-plot-pcp) will be
generated using the same data from the table. This plot is useful to explore the
relationships between the metrics and params used in experiments. You can
reorder the columns to make some patterns more easily visible.

![](/img/pcp_interaction.gif) _Parallel Coordinates Plot_

## Options

- `-a`, `--all-branches` - include experiments derived from all Git branches, as
  well as from the last commit (`HEAD`). Note that this can be combined with
  `-T` below, for example using the `-aT` flags.

- `-T`, `--all-tags` - include experiments derived from all Git tags, as well as
  from the last commit. Note that this can be combined with `-a` above, for
  example using the `-aT` flags.

- `-A`, `--all-commits` - include experiments derived from all Git commits, as
  well as from the last one. This prints all experiments in the project.

- `-n <num>`, `--num <num>` - show the last `num` commits from HEAD.

- `--no-pager` - do not enter the pager screen. Writes the entire table to
  standard output. Useful to redirect the output to a file, or use your own
  paginator.

- `--param-deps` - include only parameters that are stage dependencies.

- `--only-changed` - show only parameters and metrics with values that vary
  across experiments. Note that this option takes precedence over
  `--include-params` and `--include-metrics`, for example given
  `--include-params=foo --only-changed`, param `foo` would still be hidden if
  its value is the same in all experiments.

- `--include-params <list>` - show the specified `dvc params` in the table only.
  Accepts a comma-separated `list` of param names. Shell style wildcards
  supported: `*`, `?`, `[seq]`, `[!seq]`, and `**` If a `path:` prefix is
  included in the name, the wildcard pattern will **not** be matched against
  that prefix but only against the rest of the name.

- `--exclude-params <list>` - hide the specified `dvc params` from the table
  (all param will be shown except for these). Accepts a comma-separated `list`
  of param names. Shell style wildcards supported: `*`, `?`, `[seq]`, `[!seq]`,
  and `**` If a `path:` prefix is included in the name, the wildcard pattern
  will **not** be matched against that prefix but only against the rest of the
  name.

- `--include-metrics <list>` - show the specified `dvc metrics` in the table
  only. Accepts a comma-separated `list` of metric names. Shell style wildcards
  supported: `*`, `?`, `[seq]`, `[!seq]`, and `**`. If a `path:` prefix is
  included in the name, the wildcard pattern will **not** be matched against
  that prefix but only against the rest of the name.

- `--exclude-metrics <list>` - hide the specified `dvc metrics` from the table
  (all param will be shown except for these). Accepts a comma-separated `list`
  of metric names. Shell style wildcards supported: `*`, `?`, `[seq]`, `[!seq]`,
  and `**`. If a `path:` prefix is included in the name, the wildcard pattern
  will **not** be matched against that prefix but only against the rest of the
  name.

- `--sort-by <name>` - sort experiments by the specified metric or param
  (`name`). Only one visible column (either metric or param) can be used for
  sorting. This only affects the ordering of experiments derived from the same
  parent commit. Parent commits are always sorted chronologically.

- `--sort-order {asc,desc}` - sort order to use with `--sort-by`. Defaults to
  ascending (`asc`).

- `--no-timestamp` - do not show experiment timestamps.

- `--sha` - display Git commit (SHA) hashes instead of branch, tag, or
  experiment names.

- `--json` - prints the command's output in easily parsable JSON format, instead
  of a human-readable table.

- `--csv` - prints the command's output in CSV format instead of a
  human-readable table.

- `--md` - prints the command's output in Markdown table format.

- `--precision <n>` -
  [round](https://docs.python.org/3/library/functions.html#round) decimal values
  to `n` digits of precision (5 by default). Applies to metrics only.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

- `--pcp` - generates an interactive
  [parallel coordinates plot](#example-parallel-coordinates-plot-pcp) from the
  table.

- `-o <folder>, --out <folder>` - when used with `--pcp`, specifies a
  destination `folder` of the plot. By default its `dvc_plots`.

- `--open` - when used with `--pcp`, opens the generated plot in a browser
  automatically.

## Examples

> This example is based on our [Get Started](/doc/start/experiments), where you
> can find the actual source code.

Let's say we have run 3 experiments in our project. The basic usage shows the
workspace (Git working tree) and experiments derived from `HEAD`
(`10-bigrams-experiment` branch in this case), and all of their metrics and
params (scroll right to see all):

```dvc
$ dvc exp show
┏━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━┓
┃ Experiment            ┃ Created      ┃     auc ┃ featurize.max_fea… ┃ featurize.ngrams ┃ prepare.seed ┃ prepare.split ┃ train.n_estimators ┃ train.seed ┃
┡━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━┩
│ workspace             │ -            │ 0.61314 │ 1500               │ 2                │ 20170428     │ 0.2           │ 50                 │ 20170428   │
│ 10-bigrams-experiment │ Jun 20, 2020 │ 0.61314 │ 1500               │ 2                │ 20170428     │ 0.2           │ 50                 │ 20170428   │
│ ├── exp-e6c97         │ Oct 21, 2020 │ 0.61314 │ 1500               │ 2                │ 20170428     │ 0.2           │ 50                 │ 20170428   │
│ ├── exp-1dad0         │ Oct 09, 2020 │ 0.57756 │ 2000               │ 2                │ 20170428     │ 0.2           │ 50                 │ 20170428   │
│ └── exp-1df77         │ Oct 09, 2020 │ 0.51676 │ 500                │ 2                │ 20170428     │ 0.2           │ 50                 │ 20170428   │
└───────────────────────┴──────────────┴─────────┴────────────────────┴──────────────────┴──────────────┴───────────────┴────────────────────┴────────────┘
```

> You can exit this screen with `Q`, typically.

Let's limit the param columns to only include the `featurize` group:

```dvc
$ dvc exp show --include-params=featurize
┏━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━┓
┃ Experiment            ┃ Created      ┃     auc ┃ featurize.max_features ┃ featurize.ngrams ┃
┡━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━┩
│ workspace             │ -            │ 0.61314 │ 1500                   │ 2                │
│ 10-bigrams-experiment │ Jun 20, 2020 │ 0.61314 │ 1500                   │ 2                │
│ ├── exp-e6c97         │ Oct 21, 2020 │ 0.61314 │ 1500                   │ 2                │
│ ├── exp-1dad0         │ Oct 09, 2020 │ 0.57756 │ 2000                   │ 2                │
│ └── exp-1df77         │ Oct 09, 2020 │ 0.51676 │ 500                    │ 2                │
└───────────────────────┴──────────────┴─────────┴────────────────────────┴──────────────────┘
```

You can also filter out any metrics and parameters that do not change across the
shown experiments:

```dvc
$ dvc exp show --only-changed
┏━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ Experiment            ┃ Created      ┃     auc ┃ featurize.max_features ┃
┡━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━┩
│ workspace             │ -            │ 0.61314 │ 1500                   │
│ 10-bigrams-experiment │ Jun 20, 2020 │ 0.61314 │ 1500                   │
│ ├── exp-e6c97         │ Oct 21, 2020 │ 0.61314 │ 1500                   │
│ ├── exp-1dad0         │ Oct 09, 2020 │ 0.57756 │ 2000                   │
│ └── exp-1df77         │ Oct 09, 2020 │ 0.51676 │ 500                    │
└───────────────────────┴──────────────┴─────────┴────────────────────────┘
```

Sort experiments by the `auc` metric, in ascending order:

```dvc
$ dvc exp show --include-params=featurize --sort-by=auc --sort-order=asc
┏━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━┓
┃ Experiment            ┃ Created      ┃     auc ┃ featurize.max_features ┃ featurize.ngrams ┃
┡━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━┩
│ workspace             │ -            │ 0.61314 │ 1500                   │ 2                │
│ 10-bigrams-experiment │ Jun 20, 2020 │ 0.61314 │ 1500                   │ 2                │
│ ├── exp-1df77         │ Oct 09, 2020 │ 0.51676 │ 500                    │ 2                │
│ ├── exp-1dad0         │ Oct 09, 2020 │ 0.57756 │ 2000                   │ 2                │
│ └── exp-e6c97         │ Oct 21, 2020 │ 0.61314 │ 1500                   │ 2                │
└───────────────────────┴──────────────┴─────────┴────────────────────────┴──────────────────┘
```

To see all experiments throughout the Git history:

```dvc
$ dvc exp show --all-commits --include-params=featurize --sort-by=auc --sort-order=asc
┏━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━┓
┃ Experiment            ┃ Created      ┃     auc ┃ featurize.max_features ┃ featurize.ngrams ┃
┡━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━┩
│ workspace             │ -            │ 0.61314 │ 1500                   │ 2                │
│ 10-bigrams-experiment │ Jun 20, 2020 │ 0.61314 │ 1500                   │ 2                │
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

Note that in this example, Git commits remain in chronological order. The
sorting only applies to experiment groups (sharing a parent commit).

## Example: Parallel coordinates plot (PCP)

To generate an interactive
[PCP](/doc/user-guide/experiment-management/comparing-experiments#parallel-coordinates-plot)
based on the experiments and their parameters:

```dvc
$ dvc exp show --all-branches --pcp
```

![](/img/ref_pcp_default.png) _Parallel Coordinates Plot_

Using `--sort-by` will reorder the plot experiments as expected, and determine
the color of the lines that represent them:

```dvc
$ dvc exp show --all-branches --pcp --sort-by roc_auc
```

![](/img/ref_pcp_sortby.png) _Colorized by roc_auc_

Combine with other flags for further filtering:

```dvc
$ dvc exp show --all-branches --pcp --sort-by roc_auc
               --exclude-metrics avg_prec
```

![](/img/ref_pcp_filter.png) _Excluded avg_prec column_

📖 See [Metrics, Parameters, and Plots](/doc/start/metrics-parameters-plots) for
an introduction to parameters, metrics, plots.
