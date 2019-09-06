# metrics add

Tag the file located at `path` as a metric file.

## Synopsis

```usage
usage: dvc metrics add [-h] [-q | -v] [-t TYPE] [-x XPATH] path

positional arguments:
  path                  Path to a metric file.
```

## Description

Sets a special field in the [DVC-file](/doc/user-guide/dvc-file-format) which
defines the given `path` as an <abbr>output</abbr>, identifying this output as a
[project metric](/doc/commands-reference/metrics) to track.

Note that outputs can also be marked as metrics via the `-m` or `-M` options of
the `dvc run` command.

While any text file can be tracked as a metric file, it's recommended to use
`TSV`, `CSV`, or `JSON` formats. DVC provides a way to parse those formats to
get to a specific value, if the file contains multiple metrics. See
`dvc metrics show` for more details.

> Note that [external output](/doc/user-guide/external-outputs) cannot be marked
> as project metrics.

## Options

- `-t`, `--type` - specify a type of the metric file. Accepted values are:
  `raw`, `json`, `tsv`, `htsv`, `csv`, `hcsv`. Type will be used to determine
  how `dvc metrics show` handles displaying it. This type will be saved into the
  corresponding DVC-file and will be used automatically in the
  `dvc metrics show`. `htsv`/`hcsv` are the same `tsv`/`csv` but the values in
  the first row of the file will be used as the field names and should be used
  to address columns in the `--xpath` option. `raw` means that no additional
  parsing is applied, and `--xpath` is ignored. `raw` is the same as default
  when no type is provided.

- `-x`, `--xpath` - specify a path within a metric file to get a specific metric
  value. Should be used if the metric file contains multiple numbers and you
  need to get a only one of them. Only a single path is allowed. This path will
  be saved into the corresponding DVC-file and will be used automatically in
  `dvc metrics show`. The accepted value depends on the metric file type
  (`--type` option):

  - `json` - see [JSONPath spec](https://goessner.net/articles/JsonPath/) or
    [jsonpath-ng](https://github.com/h2non/jsonpath-ng) for available options.
    For example, `"AUC"` extracts the value from the following JSON-formatted
    metric file: `{"AUC": "0.624652"}`.
  - `tsv`/`csv` - `row,column` e.g. `1,2`. Indices are 0-based.
  - `htsv`/`hcsv` - `row,column name` e.g. `0,Name`. Row index is 0-based. First
    row is used to specify column names and is not included into index.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

Let's first create an output that is not a metric file:

```dvc
$ dvc run -o metrics.txt "echo 0.9643 > metrics.txt"
```

The content of `metrics.txt.dvc` should look like (notice the `mertic: false`
field):

```yaml
cmd: echo 0.9643 > metrics.txt
md5: f75f291b02ab38530ba659c1e10e577f
outs:
  - cache: true
    md5: 235d585fcea283135682457b15c76101
    metric: false
    path: metrics.txt
```

If you run `dvc metrics show` you should get an error message like this:

```dvc
ERROR: failed to show metrics - no metric files in
       this repository. use 'dvc metrics add' to add
       a metric file to track.
```

Now, let's make a metric file out it:

```dvc
$ dvc metrics add metrics.txt

Saving information to 'metrics.txt.dvc'.
```

This command updates the `metrics.txt.dvc` to specify that the `metrics.txt`
output is a metric file now:

```yaml
cmd: echo 0.9643 > metrics.txt
md5: f75f291b02ab38530ba659c1e10e577f
outs:
  - cache: true
    md5: 235d585fcea283135682457b15c76101
    metric:
      type: raw
    path: metrics.txt
```

And if you run `dvc metrics show` you should see something like this:

```dvc
metrics.txt: 0.9643
```
