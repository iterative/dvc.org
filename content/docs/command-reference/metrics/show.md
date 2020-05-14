# metrics show

Print [project metrics](/doc/command-reference/metrics), with optional
formatting.

## Synopsis

```usage
usage: dvc metrics show [-h] [-q | -v] [-t <type>] [-x <path>]
                        [-a] [-T] [-R] [--all-commits]
                        [targets [targets ...]]

positional arguments:
  targets               Metric files or directories (see -R) to show
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

- `-t <type>`, `--type <type>` - specify a type for the metric file. Accepted
  values are: `json`. It will be saved into the corresponding DVC-file, and used
  to determine how to handle displaying metrics.

  This option will override `type` and `xpath` defined in the corresponding
  DVC-file. If no `type` is provided or found in the DVC-file, DVC will try to
  detect it based on file extension.

- `-x <path>`, `--xpath <path>` - specify a path within a metric file to get a
  specific metric value. Should be used if the metric file contains multiple
  numbers and you want to use only one of them. Only a single path is allowed.
  It will override `xpath` defined in the corresponding DVC-file. The accepted
  value depends on the metric file type (`--type` option):

  - For `json` - see [JSONPath](https://goessner.net/articles/JsonPath/) or
    [jsonpath-ng](https://github.com/h2non/jsonpath-ng) for syntax details. For
    example, `"AUC"` extracts the value from the following JSON-formatted metric
    file: `{"AUC": "0.624652"}`. You can also filter on certain values, for
    example `"$.metrics[?(@.deviation_mse<0.30) & (@.value_mse>0.4)]"` extracts
    only the values for model versions if they meet the given conditions from
    the metric file:
    `{"metrics": [{"dataset": "train", "deviation_mse": 0.173461, "value_mse": 0.421601}]}`

  If multiple metric files exist in the <abbr>project</abbr>, the same parser
  and path will be applied to all of them. If `xpath` for a particular metric
  has been set using `dvc metrics modify`, the path passed with this option will
  overwrite it for the current command run only – It may fail to produce any
  results or parse files that are not in a corresponding format in this case.

- `-a`, `--all-branches` - print metric file contents in all Git branches
  instead of just those present in the current workspace. It can be used to
  compare different experiments. Note that this can be combined with `-T` below,
  for example using the `-aT` flag.

- `-T`, `--all-tags` - same as `-a` above, but applies to Git tags as well as
  the workspace. Note that both options can be combined, for example using the
  `-aT` flag.

- `--all-commits` - the same as `-a` or `-T` above, but applies to _all_ Git  
  commits as well as the workspace. Useful for printing metric file contents for
  the entire existing commit history of the project.

- `-R`, `--recursive` - determines the metric files to show by searching each
  target directory and its subdirectories for DVC-files to inspect. If there are
  no directories among the `targets`, this option is ignored.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

Examples in [add](/doc/command-reference/metrics/add),
[modify](/doc/command-reference/metrics/modify), and
[remove](/doc/command-reference/metrics/remove) cover most of the basic cases
for the `dvc metrics show`.

The [Compare Experiments](/doc/tutorials/get-started/compare-experiments)
chapter of our _Get Started_ covers the `-a` option to collect and print a
metric file value across all Git branches.
