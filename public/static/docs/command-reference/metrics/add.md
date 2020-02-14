# metrics add

Mark the file located at `path` as a metric file.

## Synopsis

```usage
usage: dvc metrics add [-h] [-q | -v] [-t TYPE] [-x XPATH] path

positional arguments:
  path                  Path to a metric file.
```

## Description

Sets the `metric` field in the [DVC-file](/doc/user-guide/dvc-file-format) that
defines the given `path` as an <abbr>output</abbr>, marking `path` as a
[project metric](/doc/command-reference/metrics) to track.

Note that outputs can also be marked as metrics via the `-m` or `-M` options of
the `dvc run` command.

While any text file can be tracked as a metric file, we recommend using TSV,
CSV, or JSON formats. DVC provides a way to parse those formats to get to a
specific value, if the file contains multiple metrics. See `dvc metrics show`
for more details.

> Note that [external output](/doc/user-guide/managing-external-data) cannot be
> marked as project metrics.

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

Let's first create a regular <abbr>output</abbr> with the `-o` option of
`dvc run`:

```dvc
$ dvc run -o metrics.txt "echo 0.9643 > metrics.txt"
```

Even when we named this output file `metrics.txt`, DVC won't know that it's a
metric if we don't specify so. The content of stage file `metrics.txt.dvc` (a
[DVC-file](/doc/user-guide/dvc-file-format)) should look like this: (Notice the
`metric: false` field.)

```yaml
cmd: echo 0.9643 > metrics.txt
md5: f75f291b02ab38530ba659c1e10e577f
outs:
  - cache: true
    md5: 235d585fcea283135682457b15c76101
    metric: false
    path: metrics.txt
```

If you run `dvc metrics show` now, you should get an error message:

```dvc
ERROR: failed to show metrics - no metric files in
       this repository. use 'dvc metrics add' to add
       a metric file to track.
```

Now, let's mark the output as a metric:

```dvc
$ dvc metrics add metrics.txt

Saving information to 'metrics.txt.dvc'.
```

This command updates `metrics.txt.dvc` to specify that `metrics.txt` is actually
a metric file:

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

And if you run `dvc metrics show` you should now see a report like this:

```dvc
metrics.txt: 0.9643
```
