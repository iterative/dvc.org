# exp show

Print a customizable table of experiments, their metrics and parameters.

> Press `q` to exit.

## Synopsis

```usage
usage: dvc exp show [-h] [-q | -v] [-a] [-T] [-A] [-n <num>]
                    [--no-pager] [--drop <regex>]
                    [--keep <regex>] [--param-deps]
                    [--sort-by <metric/param>]
                    [--sort-order {asc,desc}] [--sha]
                    [--json] [--csv] [--md] [--precision <n>]
                    [--only-changed]
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
```

```dvctable
┏━━━━━━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━┓
┃ neutral:**Experiment**    ┃ metric:**avg_prec** ┃ metric:**roc_auc** ┃ param:**train.n_est**┃ param:**train.min_split** ┃
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
and params from the entire project. The `--only-changed`, `--drop`, `--keep`,
and other [options](#options) can determine which ones should be displayed.

Experiments in the table are first grouped (by parent commit). They are then
sorted inside each group, chronologically by default. The `--sort-by` and
`--sort-order` options can change this ordering, based on any single, visible
metric or param.

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
  across experiments.

- `--drop <regex>` - remove the matching columns. This option has higher
  priority than `--only-changed`. If both options are combined, `--drop` will
  remove matching columns even if their values vary across experiments.

- `--keep <regex>` - prevent the matching columns to be removed by any of the
  other options, including `--only-changed` and `--drop`.

- `--sort-by <name>` - sort experiments by the specified metric or param
  (`name`). Only one visible column (either metric or param) can be used for
  sorting. This only affects the ordering of experiments derived from the same
  parent commit. Parent commits are always sorted chronologically.

- `--sort-order {asc,desc}` - sort order to use with `--sort-by`. Defaults to
  ascending (`asc`).

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

## Examples

> This example is based on our [Get Started](/doc/start/experiments), where you
> can find the actual source code.

Let's say we have run 3 experiments in our project. The basic usage shows the
workspace (Git working tree) and experiments derived from `HEAD` (`master`
branch in this case), and all of their metrics and params (scroll right to see
all):

```dvc
$ dvc exp show
```

```dvctable
┏━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━┳━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━┓
┃ neutral:**Experiment**              ┃ neutral:**Created**      ┃ metric:**avg_prec** ┃ metric:**roc_auc** ┃ param:**prepare.split** ┃ param:**prepare.seed** ┃ param:**featurize.max_features** ┃ param:**featurize.ngrams** ┃ param:**train.seed** ┃ param:**train.n_est** ┃ param:**train.min_split** ┃
┡━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━╇━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━┩
│ workspace               │ -            │  0.60405 │  0.9608 │ 0.2           │ 20170428     │ 3000                   │ 2                │ 20170428   │ 100         │ 64              │
│ master                  │ May 29, 2021 │  0.60405 │  0.9608 │ 0.2           │ 20170428     │ 3000                   │ 2                │ 20170428   │ 100         │ 64              │
│ ├── d384680 [exp-bc055] │ 08:03 PM     │  0.51799 │ 0.92333 │ 0.2           │ 20170428     │ 500                    │ 2                │ 20170428   │ 100         │ 64              │
│ ├── 6b338f8 [exp-3315b] │ 08:03 PM     │  0.58589 │   0.945 │ 0.2           │ 20170428     │ 2000                   │ 2                │ 20170428   │ 100         │ 64              │
│ └── d7fdde2 [exp-1b262] │ 08:03 PM     │  0.56447 │ 0.94713 │ 0.2           │ 20170428     │ 1500                   │ 2                │ 20170428   │ 100         │ 64              │
└─────────────────────────┴──────────────┴──────────┴─────────┴───────────────┴──────────────┴────────────────────────┴──────────────────┴────────────┴─────────────┴─────────────────┘
```

> You can exit this screen with `Q`, typically.

As a quick way of reducing noise, `--only-changed` will drop any column with
values that do not change across experiments:

```dvc
$ dvc exp show --only-changed
```

```dvctable
┏━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ neutral:**Experiment**              ┃ neutral:**Created**      ┃ metric:**avg_prec** ┃ metric:**roc_auc** ┃ param:**featurize.max_features** ┃
┡━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━┩
│ workspace               │ -            │  0.60405 │  0.9608 │ 3000                   │
│ master                  │ May 29, 2021 │  0.60405 │  0.9608 │ 3000                   │
│ ├── d7fdde2 [exp-1b262] │ 08:03 PM     │  0.56447 │ 0.94713 │ 1500                   │
│ ├── 6b338f8 [exp-3315b] │ 08:03 PM     │  0.58589 │   0.945 │ 2000                   │
│ └── d384680 [exp-bc055] │ 08:03 PM     │  0.51799 │ 0.92333 │ 500                    │
└─────────────────────────┴──────────────┴──────────┴─────────┴────────────────────────┘
```

You can also use `--drop` to filter specific columns:

```dvc
$ dvc exp show --drop prepare
```

```dvctable
┏━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━┳━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━┓
┃ neutral:**Experiment**              ┃ neutral:**Created**      ┃ metric:**avg_prec** ┃ metric:**roc_auc** ┃ param:**featurize.max_features** ┃ param:**featurize.ngrams** ┃ param:**train.seed** ┃ param:**train.n_est** ┃ param:**train.min_split** ┃
┡━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━╇━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━┩
│ workspace               │ -            │  0.60405 │  0.9608 │ 3000                   │ 2                │ 20170428   │ 100         │ 64              │
│ master                  │ May 29, 2021 │  0.60405 │  0.9608 │ 3000                   │ 2                │ 20170428   │ 100         │ 64              │
│ ├── 6b338f8 [exp-3315b] │ 08:03 PM     │  0.58589 │   0.945 │ 2000                   │ 2                │ 20170428   │ 100         │ 64              │
│ ├── d384680 [exp-bc055] │ 08:03 PM     │  0.51799 │ 0.92333 │ 500                    │ 2                │ 20170428   │ 100         │ 64              │
│ └── d7fdde2 [exp-1b262] │ 08:03 PM     │  0.56447 │ 0.94713 │ 1500                   │ 2                │ 20170428   │ 100         │ 64              │
└─────────────────────────┴──────────────┴──────────┴─────────┴────────────────────────┴──────────────────┴────────────┴─────────────┴─────────────────┘
```

You can use [regex][regex] to match columns. For example, to remove multiple
columns:

```dvc
$ dvc exp show --drop 'avg_prec|train.min_split'
```

```dvctable
┏━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━┳━━━━━━━━━━━━━┓
┃ neutral:**Experiment**              ┃ neutral:**Created**      ┃ metric:**roc_auc** ┃ param:**prepare.split** ┃ param:**prepare.seed** ┃ param:**featurize.max_features** ┃ param:**featurize.ngrams** ┃ param:**train.seed** ┃ param:**train.n_est** ┃
┡━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━╇━━━━━━━━━━━━━┩
│ workspace               │ -            │  0.9608 │ 0.2           │ 20170428     │ 3000                   │ 2                │ 20170428   │ 100         │
│ master                  │ May 29, 2021 │  0.9608 │ 0.2           │ 20170428     │ 3000                   │ 2                │ 20170428   │ 100         │
│ ├── d384680 [exp-bc055] │ Dec 17, 2021 │ 0.92333 │ 0.2           │ 20170428     │ 500                    │ 2                │ 20170428   │ 100         │
│ ├── d7fdde2 [exp-1b262] │ Dec 17, 2021 │ 0.94713 │ 0.2           │ 20170428     │ 1500                   │ 2                │ 20170428   │ 100         │
│ └── 6b338f8 [exp-3315b] │ Dec 17, 2021 │   0.945 │ 0.2           │ 20170428     │ 2000                   │ 2                │ 20170428   │ 100         │
└─────────────────────────┴──────────────┴─────────┴───────────────┴──────────────┴────────────────────────┴──────────────────┴────────────┴─────────────┘
```

If combined `--only-changed` has the least priority, `--drop` comes next, and
`--keep` has the last word:

```dvc
$ dvc exp show --only-changed --drop Created --keep 'train.(?!seed)'
```

```dvctable
┏━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━┓
┃ neutral:**Experiment**              ┃ metric:**avg_prec** ┃ metric:**roc_auc** ┃ param:**featurize.max_features** ┃ param:**train.n_est** ┃ param:**train.min_split** ┃
┡━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━┩
│ workspace               │  0.60405 │  0.9608 │ 3000                   │ 100         │ 64              │
│ master                  │  0.60405 │  0.9608 │ 3000                   │ 100         │ 64              │
│ ├── d384680 [exp-bc055] │  0.51799 │ 0.92333 │ 500                    │ 100         │ 64              │
│ ├── 6b338f8 [exp-3315b] │  0.58589 │   0.945 │ 2000                   │ 100         │ 64              │
│ └── d7fdde2 [exp-1b262] │  0.56447 │ 0.94713 │ 1500                   │ 100         │ 64              │
└─────────────────────────┴──────────┴─────────┴────────────────────────┴─────────────┴─────────────────┘
```

Sort experiments by the `roc_auc` metric, in descending order:

```dvc
$ dvc exp show --only-changed --sort-by=roc_auc --sort-order desc
```

```dvctable
┏━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ neutral:**Experiment**              ┃ neutral:**Created**      ┃ metric:**avg_prec** ┃ metric:**roc_auc** ┃ param:**featurize.max_features** ┃
┡━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━┩
│ workspace               │ -            │  0.60405 │  0.9608 │ 3000                   │
│ master                  │ May 29, 2021 │  0.60405 │  0.9608 │ 3000                   │
│ ├── d7fdde2 [exp-1b262] │ 08:03 PM     │  0.56447 │ 0.94713 │ 1500                   │
│ ├── 6b338f8 [exp-3315b] │ 08:03 PM     │  0.58589 │   0.945 │ 2000                   │
│ └── d384680 [exp-bc055] │ 08:03 PM     │  0.51799 │ 0.92333 │ 500                    │
└─────────────────────────┴──────────────┴──────────┴─────────┴────────────────────────┘
```

To see all experiments throughout the Git history:

```dvc
$ dvc exp show --all-commits --only-changed --sort-by=roc_auc
```

```dvctable
┏━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━┓
┃ neutral:**Experiment**              ┃ neutral:**Created**      ┃ metric:**avg_prec** ┃ metric:**roc_auc** ┃ param:**featurize.max_features** ┃ param:**featurize.ngrams** ┃ param:**train.n_est** ┃ param:**train.min_split** ┃
┡━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━┩
│ workspace               │ -            │  0.60405 │  0.9608 │ 3000                   │ 2                │ 100         │ 64              │
│ try-large-dataset       │ Jun 01, 2021 │  0.67038 │ 0.96693 │ 3000                   │ 2                │ 100         │ 64              │
│ master                  │ May 29, 2021 │  0.60405 │  0.9608 │ 3000                   │ 2                │ 100         │ 64              │
│ ├── d384680 [exp-bc055] │ 08:03 PM     │  0.51799 │ 0.92333 │ 500                    │ 2                │ 100         │ 64              │
│ ├── 6b338f8 [exp-3315b] │ 08:03 PM     │  0.58589 │   0.945 │ 2000                   │ 2                │ 100         │ 64              │
│ └── d7fdde2 [exp-1b262] │ 08:03 PM     │  0.56447 │ 0.94713 │ 1500                   │ 2                │ 100         │ 64              │
│ cc51022                 │ May 28, 2021 │  0.55259 │ 0.91536 │ 1500                   │ 2                │ 50          │ 2               │
│ 7ab3585                 │ May 27, 2021 │  0.52048 │  0.9032 │ 1500                   │ 2                │ 50          │ 2               │
│ 53b2d9d                 │ May 25, 2021 │  0.52048 │  0.9032 │ 500                    │ 1                │ 50          │ 2               │
│ 872cd6c                 │ May 24, 2021 │        - │       - │ 500                    │ 1                │ 50          │ 2               │
│ 8188b34                 │ May 23, 2021 │        - │       - │ 500                    │ 1                │ 50          │ 2               │
│ 9244ec3                 │ May 22, 2021 │        - │       - │ 500                    │ 1                │ 50          │ 2               │
│ 08a3b89                 │ May 21, 2021 │        - │       - │ -                      │ -                │ -           │ -               │
│ 16ba2cd                 │ May 20, 2021 │        - │       - │ -                      │ -                │ -           │ -               │
│ f0c0269                 │ May 18, 2021 │        - │       - │ -                      │ -                │ -           │ -               │
│ 3e07290                 │ May 17, 2021 │        - │       - │ -                      │ -                │ -           │ -               │
│ 90b2aea                 │ May 16, 2021 │        - │       - │ -                      │ -                │ -           │ -               │
└─────────────────────────┴──────────────┴──────────┴─────────┴────────────────────────┴──────────────────┴─────────────┴─────────────────┘
└───────────────────────┴──────────────┴─────────┴────────────────────────┴──────────────────┘
```

Note that in the final example, Git commits remain in chronological order. The
sorting only applies to experiment groups (sharing a parent commit).

📖 See [Metrics, Parameters, and Plots](/doc/start/metrics-parameters-plots) for
an introduction to parameters, metrics, plots.

[regex]: https://regexone.com/
