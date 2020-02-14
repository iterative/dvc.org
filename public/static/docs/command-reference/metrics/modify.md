# metrics modify

Modify [project metric](/doc/command-reference/metrics) values such as type,
path expression that is used to parse it, etc. (See full options below.)

## Synopsis

```usage
usage: dvc metrics modify [-h] [-q | -v] [-t TYPE] [-x XPATH] path

positional arguments:
  path                  Path to a metric file.
```

## Description

This command finds a corresponding [DVC-file](/doc/user-guide/dvc-file-format)
for the provided metric file `path` – the one that defines `path` among its
<abbr>outputs</abbr>, see `dvc metrics add` or the `-m` and `-M` options of
`dvc run` – and updates the specification of the metric. (See full options
below.)

If `path` isn't tracked by DVC (described in one of the <abbr>workspace</abbr>
DVC-files), the following error will be raised:

```dvc
ERROR: failed to modify metric file settings -
       unable to find stage file with output '<path>'
```

> Alternatively, see `dvc metrics modify` command to learn how to apply `-t` and
> `-x` temporarily.

## Options

- `-t`, `--type` - specify a type of the metric file. Accepted values are: `raw`
  (default), `json`, `tsv`, `htsv`, `csv`, `hcsv`. It will be saved into the
  corresponding DVC-file, and used by `dvc metrics show` to determine how to
  handle displaying metrics.

  `raw` means that no additional parsing is applied, and `--xpath` is ignored.
  `htsv`/`hcsv` are the same as `tsv`/`csv`, but the values in the first row of
  the file will be used as the field names and should be used to address columns
  in the `--xpath` option.

- `-x`, `--xpath` - specify a path within a metric file to get a specific metric
  value. Should be used if the metric file contains multiple numbers and you
  want to use only one of them. Only a single path is allowed. It will be saved
  into the corresponding DVC-file, and used by `dvc metrics show` to determine
  how to display metrics. The accepted value depends on the metric file type
  (`--type` option):

  - For `json` - see [JSONPath spec](https://goessner.net/articles/JsonPath/) or
    [jsonpath-ng](https://github.com/h2non/jsonpath-ng) for available options.
    For example, `"AUC"` extracts the value from the following JSON-formatted
    metric file: `{"AUC": "0.624652"}`.
  - For `tsv`/`csv` - `row,column` e.g. `1,2`. Indices are 0-based.
  - For `htsv`/`hcsv` - `row,column name` e.g. `0,Name`. Row index is 0-based.
    First row is used to specify column names and is not included into index.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

Let's first imagine we have a [stage](/doc/command-reference/run) with a generic
metric file initially. The dummy command below simulates this imaginary setup:

```dvc
$ dvc run -M metrics.csv "echo auc, 0.9567 > metrics.csv"
```

The resulting stage file `metrics.csv.dvc` should look like this:

```yaml
md5: 6ed9b798bf460e1aa80b27388425a07d
cmd: echo auc, 0.9567 > metrics.csv
wdir: .
outs:
  - md5: 13ee80c6b3e238c5097427c2114ae6e4
    path: metrics.csv
    cache: false
    metric: true
    persist: false
```

And if we run `dvc metrics show metrics.csv`, we will get the complete contents
of the file:

```dvc
$ dvc metrics show metrics.csv
	metrics.csv: auc    0.9567
```

Okay. Let's now imagine we are interested only in the numeric value, the second
column of the CSV file. We can specify the `CSV` type (`-t`) and an `xpath`
(`-x`) to extract the second column:

```dvc
$ dvc metrics modify -t csv -x '0,1' metrics.csv
```

After this change `dvc metrics show` should always select only the value itself,
and exclude names:

```dvc
$ dvc metrics show metrics.csv
	metrics.csv: [' 0.9567']
```

Notice that the `metric` field in the `metrics.csv.dvc` stage file changed to
include this information:

```yaml
metric:
  type: csv
  xpath: 0,1
```
