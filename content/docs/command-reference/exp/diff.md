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
the difference ("Change") fpr numeric values.

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

- `--show-json` - prints the command's output in JSON format (machine-readable)
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
