# modify

Modify metric settings (like type, path expression that is used to parse it,
etc).

## Synopsis

```usage
usage: dvc metrics modify [-h] [-q] [-v]
                          [-t TYPE] [-x XPATH]
                          path

positional arguments:
  path                  Path to a metric file.
```

## Description

This command finds a corresponding DVC file for the metric file path provided
(i.e. a DVC stage file that specifies one of its a metric with the path
provided) and updates the meta-information that is used to manage and show the
metric.

It the path provided is not part of the pipeline, the following error will be
raised:

```text
Error: failed to modify metrics - unable
       to find file '<path>' in the pipeline
```

## Options

- `-t`, `--type` - specify a type of the metric file. Accepted values are:
  `raw`, `json`, `tsv`, `htsv`, `csv`, `hcsv`. It will be used to determine how
  `dvc metrics show` handles displaying it. This type will be saved into the
  corresponding `.dvc` file and will be used automatically in the
  `dvc metrics show`. `htsv` and `hcsv` are `tsv` and `csv` but the values in
  the first row of the file will be used as the field names and can be used to
  address columns in the `--xpath` option. `raw` means that no additional
  parsing is applied, and `--xpath` is ignored. `raw` is the same as default
  when no type is provided.

- `-x`, `--xpath` - specify a path within a metric file to get a specific metric
  value. Should be used if metric file contains multiple numbers and you need to
  get a only one of them. Only single path is allowed. This path will be saved
  into the corresponding `.dvc` file and will be used automatically in
  `dvc metrics show`. Accepted value depends on the metric file type (`-t`
  option):

  - `json` - check [JSONPath spec](https://goessner.net/articles/JsonPath/) to
    see available options. For example, `"AUC"` extracts the value from the
    following json-formatted metric file: `{"AUC": "0.624652"}`.
  - `tsv`/`csv` - `row,column`, e.g. `1,2`. Indices are 0-based.
  - `htsv`/`hcsv` - `row,column name`. Row index is 0-based. First row is used
    to specify column names and is not included into index. For example:
    `0,Name`.

## Examples

Let's first imagine we have stage with a generic raw metric file initially. The
stage below is dummy and is made completely for the sake or this examples
section:

```dvc
    $ dvc run -M metrics.csv "echo auc, 0.9567 > metrics.csv"
```

The stage `metrics.csv.dvc` file should look like this:

```yaml
cmd: echo auc, 0.9567 > metrics.csv
md5: 6ed9b798bf460e1aa80b27388425a07d
outs:
  - cache: false
    md5: 13ee80c6b3e238c5097427c2114ae6e4
    metric: true
    path: metrics.csv
```

And if we run `dvc metrics show metrics.csv` we will get the complete content of
the file:

```dvc
$ dvc metrics show metrics.csv

    metrics.csv: auc, 0.9567
```

Okay. Let's now, imagine we are interested only in numbers - second column of
the CSV file. We can specify the type `CSV` and a path to extract the second
column:

```dvc
$ dvc metrics modify -t csv -x '0,1' metrics.csv
```

After this change `dvc metrics show` should always select only the value itself,
and exclude names:

```dvc
$ dvc metrics show metrics.csv

    metrics.csv: [' 0.9567']
```
