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
`dvc experiments`. The differences shown by this command include the old and new
values, and numeric difference (delta) from the previous ones.

> This is similar to combining the reports from `dvc params diff` and
> `dvc metrics diff` together, for the experiments in question.

Without arguments, this command compares params and metrics currently present in
the <abbr>workspace</abbr> (last `dvc exp run`) with the latest committed
versions (required).

`a_rev` and `b_rev` are optional experiments to compare. They accept experiment
names (see `dvc exp run --name`) or hashes (printed by DVC). Git commit hashes,
tags, or branch names are also accepted. A single specified exp ID results in
comparing it to the baseline commit from which it was derived.

All params and metrics defined in the experiments' `dvc.yaml` files are used by
default.

Another way to display experiments is the `dvc exp show` command, which lists
all the current experiments (without comparisons).

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
