# exp diff

Show changes in [metrics](/doc/command-reference/metrics) and
[parameters](/doc/command-reference/params) between `dvc experiments`.

## Synopsis

```usage
usage: dvc experiments diff [-h] [-q | -v] [--all] [--show-json]
                            [--show-md] [--old] [--no-path]
                            [--precision <n>] [a_rev] [b_rev]

positional arguments:
  a_rev            Old experiment to compare (defaults to HEAD)
  b_rev            New experiment to compare (defaults to the current
                   workspace)
```

# Description

Provides a quick way to compare `dvc params` and `dvc metrics` between two
`dvc experiments` by printing a table of differences. By default, it includes
the params/metrics file "Path", "Param" or "Metric" name, the new "Value", and
the difference ("Change") for numeric values. Example:

```dvc
$ dvc exp diff
Path         Metric    Value    Change
scores.json  roc_auc   0.93345  0.018087
scores.json  grade     B-       —

Path         Param         Value    Change
params.yaml  max_features  3000     1500
```

> This is similar to combining the reports from `dvc params diff` and
> `dvc metrics diff` together, for the experiments in question.

Without arguments, this command compares all the params and metrics defined in
`dvc.yaml` files currently present in the <abbr>workspace</abbr> (e.g. the last
`dvc exp run`) with the latest committed versions (required). Only
params/metrics that changed are listed, by default (show everything with
`--all`).

`a_rev` and `b_rev` are optional experiments to compare. They accept experiment
names or hashes (see `dvc exp run`). Providing a single one results in comparing
it to the workspace.

Another way to display experiments is the `dvc exp show` command, which lists
all the current experiments (without comparisons).

## Options

- `--all` - list all parameters and metrics, including those without changes.

- `--show-json` - prints the command's output in easily parsable JSON format,
  instead of a human-readable table.

- `--show-md` - prints the command's output in the Markdown table format
  ([GFM](https://github.github.com/gfm/#tables-extension-)).

- `--old` - include the "Old" value column in addition to the new "Value" (and
  "Change"). Useful when the values are not numeric, for example

- `--no-path` - hide the "Path" column that lists the param/metrics file
  location. Useful when only one metrics or params file exists, for example

- `--precision <n>` -
  [round](https://docs.python.org/3/library/functions.html#round) decimal values
  to `n` digits of precision (5 by default). Applies to metrics only.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

> This example is based on our
> [Get Started](/doc/tutorials/get-started/experiments), where you can find the
> actual source code.

Let's say we have run 3 experiments in our project:

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

Since we haven't made any changes to the workspace, we can compare `exp-1dad0`
to its baseline (`10-bigrams-experiment`, current `HEAD`) like this:

```dvc
$ dvc exp diff exp-1dad0
Path         Metric    Value    Change
scores.json  auc       0.61314  0.035575
Path         Param                   Value    Change
params.yaml  featurize.max_features  1500     -500
```

To compare two specific experiments (values are shown for the second one by
default):

```dvc
$ dvc exp diff exp-1dad0 exp-1df77
Path         Metric    Value    Change
scores.json  auc       0.51676  -0.060799
Path         Param                   Value    Change
params.yaml  featurize.max_features  500      -1500
```

To compare an experiment to the
[`7-ml-pipeline`](https://github.com/iterative/example-get-started/releases/tag/7-ml-pipeline)
tag (or any other [revision](https://git-scm.com/docs/revisions)):

```dvc
$ dvc exp diff exp-1dad0 7-ml-pipeline
Path         Metric    Value    Change
scores.json  auc       None     diff not supported
Path         Param                   Value    Change
params.yaml  featurize.max_features  500      -1500
params.yaml  featurize.ngrams        1        -1
```
