# metrics show

Find and print [project metrics](/doc/command-reference/metrics), with optional
formatting.

## Synopsis

```usage
usage: dvc metrics show [-h] [-q | -v] [-t TYPE] [-x XPATH] [-a] [-T] [-R]
                        [targets [targets ...]]

positional arguments:
  targets               Metric files or directories (see -R) to show (leave
                        empty to display all)
```

## Description

Finds and prints all metrics in the <abbr>project</abbr> by examining all of its
[DVC-files](/doc/user-guide/dvc-file-format). If `targets` are provided, it will
show those specific metric files instead. With the `-a` or`-T` options, this
command shows the different metrics values across all Git branches or tags,
respectively.

The optional `targets` argument can contain one or more metric files. With the
`-R` option, some of the target can even be directories, so that DVC recursively
shows all metric files inside.

Providing a `type` (`-t` option) overrides the full metric specification (both
`type` and `xpath` fields) defined in the
[DVC-file](/doc/user-guide/dvc-file-format) (with `dvc metrics modify`,
typically).

If `type` (via `-t`) is not specified and only `xpath` (`-x` option) is, only
the `xpath` field from the DVC-file is overridden. (DVC will first try to read
`type` from the DVC-file, but it can be automatically detected by the file
extension.)

> See `dvc metrics modify` to learn how to apply `-t` and `-x` permanently.

An alternative way to display metrics is the `dvc metrics diff` command, which
compares them with a previous version.

## Options

- `-t`, `--type` - specify a type of the metric file. Accepted values are: `raw`
  (default), `json`, `tsv`, `htsv`, `csv`, `hcsv`. It will be used to determine
  how to parse and format metics for display.

  `raw` means that no additional parsing is applied, and `--xpath` is ignored.
  `htsv`/`hcsv` are the same as `tsv`/`csv`, but the values in the first row of
  the file will be used as the field names and should be used to address columns
  in the `--xpath` option.

  This option will override `type` and `xpath` defined in the corresponding
  DVC-file. If no `type` is provided or found in the DVC-file, DVC will try to
  detect it based on file extension.

- `-x`, `--xpath` - specify a path within a metric file to get a specific metric
  value. Should be used if the metric file contains multiple numbers and you
  want to use only one of them. Only a single path is allowed. It will override
  `xpath` defined in the corresponding DVC-file. The accepted value depends on
  the metric file type (`--type` option):

  - For `json` - see [JSONPath spec](https://goessner.net/articles/JsonPath/) or
    [jsonpath-ng](https://github.com/h2non/jsonpath-ng) for available options.
    For example, `"AUC"` extracts the value from the following JSON-formatted
    metric file: `{"AUC": "0.624652"}`. You can also filter on certain values,
    for example `"$.metrics[?(@.deviation_mse<0.30) & (@.value_mse>0.4)]"`
    extracts only the values for model versions if they meet the given
    conditions from the metric file:
    `{"metrics": [{"dataset": "train", "deviation_mse": 0.173461, "value_mse": 0.421601}]}`
  - For `tsv`/`csv` - `row,column` e.g. `1,2`. Indices are 0-based.
  - For `htsv`/`hcsv` - `row,column name` e.g. `0,Name`. Row index is 0-based.
    First row is used to specify column names and is not included into index.

  If multiple metric files exist in the <abbr>project</abbr>, the same parser
  and path will be applied to all of them. If `xpath` for a particular metric
  has been set using `dvc metrics modify`, the path passed with this option will
  overwrite it for the current command run only – It may fail to produce any
  results or parse files that are not in a corresponding format in this case.

- `-a`, `--all-branches` - print metric file contents in all Git branches
  instead of just those present in the current workspace. It can be used to
  compare different experiments.

- `-T`, `--all-tags` - print metric file contents in all Git tags. Similar to
  `-a` above. Note that both options can be combined, for example using the
  `-aT` flag.

- `-R`, `--recursive` - determines the metric files to show by searching each
  target directory and its subdirectories for DVC-files to inspect. `targets` is
  expected to contain one or more directories for this option to have effect.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

Examples in [add](/doc/command-reference/metrics/add),
[modify](/doc/command-reference/metrics/modify), and
[remove](/doc/command-reference/metrics/remove) cover most of the basic cases
for the `dvc metrics show`.

The [Compare Experiments](/doc/get-started/compare-experiments) chapter of our
_Get Started_ section covers the `-a` option to collect and print a metric file
value across all Git branches.
