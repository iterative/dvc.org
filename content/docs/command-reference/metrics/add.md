# metrics add

Mark a DVC-tracked file as a [project metric](/doc/command-reference/metrics).

## Synopsis

```usage
usage: dvc metrics add [-h] [-q | -v] [-t <type>] [-x <path>] path

positional arguments:
  path                  Path to a metric file.
```

## Description

Sets the `metric` field in the [DVC-file](/doc/user-guide/dvc-file-format) that
defines the given `path` as an <abbr>output</abbr>, marking `path` as a metric
file to track.

Note that outputs can also be marked as metrics via the `-m` or `-M` options of
`dvc run`. We recommend using `-M` option to keep metrics in Git history.

While any text file can be tracked as a metric file, we recommend using JSON
formats. DVC provides a way to parse this formats to get to a specific value, if
the file contains multiple metrics. See the [options](#options) below and
`dvc metrics diff` for more info.

> Note that [external output](/doc/user-guide/managing-external-data) cannot be
> marked as project metrics.

## Options

- `-t <type>`, `--type <type>` - specify a type for the metric file. Accepted
  values are: `json`. It will be saved into the corresponding DVC-file, and used
  by `dvc metrics show` to determine how to handle displaying metrics.

- `-x <path>`, `--xpath <path>` - specify a path within a metric file to get a
  specific metric value. Should be used if the metric file contains multiple
  numbers and you want to use only one of them. Only a single path is allowed.
  It will be saved into the corresponding DVC-file, and used by
  `dvc metrics show` and `dvc metrics diff` to determine how to display metrics.
  The accepted value depends on the metric file type (`--type` option):

  - For `json` - see [JSONPath](https://goessner.net/articles/JsonPath/) or
    [jsonpath-ng](https://github.com/h2non/jsonpath-ng) for syntax details. For
    example, `"AUC"` extracts the value from the following JSON-formatted metric
    file: `{"AUC": "0.624652"}`.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

Let's first create a regular <abbr>output</abbr> with the `-O` option of
`dvc run`:

```dvc
$ dvc run -O metrics.json \
        'echo {\"AUC\": 0.9643, \"TP\": 527} > metrics.json'
```

Even when we named this output file `metrics.json`, DVC won't know that it's a
metric if we don't specify so. The content of stage file `metrics.json.dvc` (a
[DVC-file](/doc/user-guide/dvc-file-format)) should look like this: (Notice the
`metric: false` field.)

```yaml
md5: 906ea9489e432c85d085b248c712567b
cmd: echo {\"AUC\":0.9643, \"TP\":527} > metrics.json
outs:
  - md5: 0f0e67dc927aa69cd3fc37435ee1304f
    path: metrics.json
    cache: true
    metric: false
    persist: false
```

If you run `dvc metrics show` now, you should get an error message:

```dvc
ERROR: failed to show metrics - no metric files in
       this repository. use 'dvc metrics add' to add
       a metric file to track.
```

Now, let's mark the output as a metric:

```dvc
$ dvc metrics add metrics.json
```

This command updates `metrics.json.dvc` to specify that `metrics.json` is
actually a metric file:

```yaml
md5: 906ea9489e432c85d085b248c712567b
cmd: echo {\"AUC\":0.9643, \"TP\":527} > metrics.json
outs:
  - md5: 0f0e67dc927aa69cd3fc37435ee1304f
    path: metrics.json
    cache: true
    metric:
      type: json
    persist: false
```

And if you run `dvc metrics show`, you should now see a report like this:

```dvc
	metrics.json: {"AUC":0.9643, "TP":527}
```
