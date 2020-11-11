# exp[eriments] diff

Show changes in [metrics](/doc/command-reference/metrics) and
[parameters](/doc/command-reference/params) between experiments.

## Synopsis

```usage
usage: dvc exp diff [-h] [-q | -v] [--all] [--show-json] [--show-md]
                    [--old] [--no-path] [--precision <n>] [a_rev] [b_rev]

positional arguments:
  a_rev            Old experiment to compare (defaults to HEAD)
  b_rev            New experiment to compare (defaults to the current workspace)
```

## Description

This command simply combines the output of both `dvc metrics diff` and
`dvc params diff` for quickly comparing two experiments.

`a_rev` and `b_rev` can be experiment hashes, Git commit hashes, tag, or branch
names. If only `a_rev` is provided and `a_rev` is an experiment hash, it will be
compared to the baseline commit from which the experiment was derived.

## Options

- `--all` - prints all parameters including not changed.

- `--show-json` - prints the command's output in easily parsable JSON format,
  instead of a human-readable table.

- `--show-md` - prints the command's output in the Markdown table format.

- `--old` - show old metric value in addition to the new value.

- `--no-path` - don't show metric or param path in the result table. This option
  is useful when only one metrics or params file is in use or there is no
  intersection between the metric or param names.

- `--precision <n>` -
  [round](https://docs.python.org/3/library/functions.html#round) metrics to `n`
  digits precision after the decimal point. Rounds to 5 digits by default.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Example

> This example is based on our
> [Get Started](/doc/tutorials/get-started/experiments), where you can find the
> actual source code.

Let's say we have run 3 experiments in our project workspace:

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

To compare a experiment `1dad0d2` to its baseline (`11-bigrams-experiment`):

```dvc
$ dvc exp diff 1dad0d2
Path         Metric    Value    Change
scores.json  auc       0.61314  0.035575

Path         Param                   Value    Change
params.yaml  featurize.max_features  1500     -500
```

To compare two experiments:

```dvc
$ dvc exp diff 1dad0d2 1df77f7
Path         Metric    Value    Change
scores.json  auc       0.51676  -0.060799

Path         Param                   Value    Change
params.yaml  featurize.max_features  500      -1500
```

To compare an experiment to a Git tag:

```dvc
$ dvc exp diff 1dad0d2 8-ml-pipeline
Path         Metric    Value    Change
scores.json  auc       None     diff not supported

Path         Param                   Value    Change
params.yaml  featurize.max_features  500      -1500
params.yaml  featurize.ngrams        1        -1
```
