# metrics show

Find and print project metrics.

## Synopsis

```usage
usage: dvc metrics show [-h] [-q | -v] [-t TYPE] [-x XPATH] [-a] [-T]
                        [-R] [path]

positional arguments:
  path                  Path to a metric file or a directory.
```

## Description

It will find and print all metric files (default) or a specified metric file in
the current branch (if `path` is provided) or across all branches/tags (if `-a`
or`-T` specified respectively).

The optional `path` argument can represent a DVC metric file or a directory. If
`path` is a directory, recursively search and process all metric files in it
with the `-R` option.

Providing `type` (via `-t` CLI option), overrides the full metric specification
(both, `type` and `xpath`) defined in the DVC-file (usually, using
`dvc metrics modify` command).

If `type` (via `-t`) is not specified and only `xpath` (`-x`) is, only `xpath`
is overridden. It will try to read type from the DVC-file. The `type` can be
detected by the file extension automatically.

## Options

- `-t`, `--type` - specify a type of the metric file(s) that will be used to
  determine how to handle `xpath` parameter from down below. Accepted values
  are: `raw`, `json`, `tsv`, `htsv`, `csv`, `hcsv`. If this parameter is not
  given, the type can be detected by the file extension automatically if the
  type is supported. If any other value is specified it is ignored and `type` is
  defaulted to `raw`. `htsv`/`hcsv` are the same `tsv`/`csv` but the values in
  the first row of the file will be used as the field names and should be used
  to address columns in the `--xpath` option. `raw` means that no additional
  parsing is applied, and `--xpath` is ignored. `raw` is the same as default
  when no type is provided. This option along with `--xpath` below takes
  precedence over the `type` and `xpath` specified in the corresponding DVC
  file.

- `-x`, `--xpath` - specify a path within a metric file to get a specific metric
  value. Should be used if metric file contains multiple numbers and you need to
  get a only one of them. Only single path is allowed. If multiple metric files
  exist in the project, the same parser and path will be applied to all of them.
  If xpath for particular metric has been set using
  [`dvc metrics modify`](https://dvc.org/doc/commands-reference/metrics-modify#options)
  `xpath` passed in this option will owervrite it, only for current command run.
  It may fail to produce any results or parse files that are not in a
  corresponding format in this case. Accepted value depends on the metric file
  type (`-t` option):

  - `json` - see [JSONPath spec](https://goessner.net/articles/JsonPath/) or
    [jsonpath-ng](https://github.com/h2non/jsonpath-ng) for available options.
    For example, `"AUC"` extracts the value from the following json-formatted
    metric file: `{"AUC": "0.624652"}`. You can also filter on certain values.
    For example, `"$.metrics[?(@.deviation_mse<0.30) & (@.value_mse>0.4)]"`
    extracts only the values for model versions if they meet the given
    condition(s) from the metric file:
    `{"metrics": [{"dataset": "train", "deviation_mse": 0.173461, "value_mse": 0.421601}]}`
  - `tsv`/`csv` - `row,column`, e.g. `1,2`. Indices are 0-based.
  - `htsv`/`hcsv` - `row,column name`. Row index is 0-based. First row is used
    to specify column names and is not included into index. For example:
    `0,Name`.

- `-a`, `--all-branches` - get and print metric file contents across all
  branches. It can be used to compare different variants of an experiment.

- `-T`, `--all-tags` - get and print metric file contents across all tags. It
  can be used to compare different variants of an experiment if tags are used
  for checkpoints.

- `-R`, `--recursive` - `path` is expected to be a directory for this option to
  have effect. Determines the metric files to show by searching each target
  directory and its subdirectories for DVC-files to inspect.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

Examples in [add](/doc/commands-reference/metrics-add),
[modify](/doc/commands-reference/metrics-modify), and
[remove](/doc/commands-reference/metrics-remove) cover most of the basic cases
for the `dvc metrics show`.

Example in the [compare experiments](/doc/get-started/compare-experiments)
section covers the `-a` option to collect and output a metric file value within
multiple branches.
