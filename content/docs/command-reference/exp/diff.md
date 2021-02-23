# exp diff

Show [parameters](/doc/command-reference/params) and
[metrics](/doc/command-reference/metrics) changes between `dvc experiments`, or
between the last <abbr>project</abbr> version and the workspace.

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
`dvc experiments`. The differences shown by this command include the old and new
values, and numeric difference (delta) from the previous ones.

> This is similar to combining the reports from `dvc params diff` and
> `dvc metrics diff` together, for the experiments in question.

Without arguments, this command compares params and metrics currently present in
the <abbr>workspace</abbr> (last `dvc exp run`) with the latest committed
versions (required).

`a_rev` and `b_rev` are optional experiment IDs (printed by `dvc exp run`) to
compare.

All params and metrics defined in the experiments' `dvc.yaml` files are used by
default.

Another way to display experiments is the `dvc exp show` command, which lists
all the current experiments (without comparisons).
