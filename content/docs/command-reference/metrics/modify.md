# metrics modify

Modify [project metric](/doc/command-reference/metrics) default formatting with
options such as `type` or `xpath`. See full [options](#options) info below.

## Synopsis

```usage
usage: dvc metrics modify [-h] [-q | -v] [-t <type>] [-x <path>] path

positional arguments:
  path                  Path to a metric file.
```

## Description

This command finds a corresponding [DVC-file](/doc/user-guide/dvc-file-format)
for the provided metric file (`path` is defined among the <abbr>outputs</abbr>
of the DVC-file), and updates the default formatting of the metric. See the
[options](#options) below and `dvc metrics show` for more info.

If `path` isn't tracked by DVC (described in one of the <abbr>workspace</abbr>
DVC-files), the following error will be raised:

```dvc
ERROR: failed to modify metric file settings -
       unable to find stage file with output '<path>'
```

> Alternatively, see `dvc metrics modify` command to learn how to apply `-t` and
> `-x` temporarily.

## Options

- `-t <type>`, `--type <type>` - specify a type for the metric file. Accepted
  values are: `json`. It will be saved into the corresponding DVC-file, and used
  by `dvc metrics show` and `dvc metrics diff` to determine how to handle
  displaying metrics.

- `-x <path>`, `--xpath <path>` - specify a path within a metric file to get a
  specific metric value. Should be used if the metric file contains multiple
  numbers and you want to use only one of them. Only a single path is allowed.
  It will be saved into the corresponding DVC-file, and used by
  `dvc metrics show` to determine how to display metrics. The accepted value
  depends on the metric file type (`--type` option):

  - For `json` - see [JSONPath](https://goessner.net/articles/JsonPath/) or
    [jsonpath-ng](https://github.com/h2non/jsonpath-ng) for syntax details. For
    example, `"AUC"` extracts the value from the following JSON-formatted metric
    file: `{"AUC": "0.624652"}`.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

Let's first imagine we have a [stage](/doc/command-reference/run) with a generic
metric file initially. The dummy command below simulates this imaginary setup:

```dvc
$ dvc run -M metrics.json \
        'echo {\"AUC\": 0.9643, \"TP\": 527} > metrics.json'
```

The resulting stage file `metrics.json.dvc` should look like this:

```yaml
md5: c607baf8e350957c2a6db134cfe1c2e2
cmd: 'echo {\"AUC\": 0.9643, \"TP\": 527} > metrics.json'
outs:
  - md5: 2d975ad7af38fe0511163e60b80cb1b4
    path: metrics.json
    cache: false
    metric: true
    persist: false
```

And if we run `dvc metrics show metrics.json`, we will get the complete contents
of the file:

```dvc
$ dvc metrics show metrics.json
        metrics.json: {"AUC":0.9643, "TP":527}
```

Okay. Let's now imagine we are interested only in a single value of true
positives (TP). We can specify the `JSON` type (`-t`) and an `xpath` (`-x`) to
extract the TP value:

```dvc
$ dvc metrics modify -t json -x TP metrics.json
```

After this change, `dvc metrics show` should always select only the specified
value:

```dvc
$ dvc metrics show metrics.json
        metrics.json: {'TP': 527}
```

Notice that the `metric` field in the `metrics.json.dvc` stage file changed to
include this information:

```yaml
metric:
  type: json
  xpath: TP
```
