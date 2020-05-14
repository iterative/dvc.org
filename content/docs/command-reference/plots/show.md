# plots show

Generate a plot image from from a [metrics](/doc/command-reference/plots) file.

## Synopsis

```usage
usage: dvc plots show [-h] [-q | -v] [-t [TEMPLATE]] [-f FILE]
                     [-s SELECT] [-x X] [-y Y] [--stdout]
                     [--no-csv-header] [--no-html] [--title TITLE]
                     [--xlab XLAB] [--ylab YLAB] [datafile]

positional arguments:
  datafile              Metrics file to visualize
```

## Description

This command provides a quick way to visualize
[continuous metrics](/doc/command-reference/plots) such as loss functions, AUC
curves, confusion matrices, etc. Please see `dvc plots` for information on the
supported data formats and other relevant details about DVC plots.

## Options

- `-t [TEMPLATE], --template [TEMPLATE]` - File to be injected with data. The
  default template is `.dvc/plot/default.json`. See more details in `dvc plots`.

- `-f FILE, --file FILE` - Name of the generated file. By default, the output
  file name is equal to the input filename with additional `.html` suffix or
  `.json` suffix for `--no-html` mode.

- `--no-html` - Do not wrap output Vega specification (JSON) with HTML.

- `-x X` - Field name for X axis. An auto-generated `index` field is used by
  default.

- `-y Y` - Field name for Y axis. The last column or field found in the
  `datafile` is used by default.

- `-s SELECT, --select SELECT` - Select which fields or JSONPath to store in the
  plot file [metadata](https://vega.github.io/vega/docs/data/). The
  auto-generated, zero-based `index` column is always included.

- `--xlab XLAB` - X axis title. The X field name is the default title.

- `--ylab YLAB` - Y axis title. The Y field name is the default title.

- `--title TITLE` - Plot title.

- `-o, --stdout` - Print plot content to stdout.

- `--no-csv-header` - Provided CSV or TSV datafile does not have a header.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

We'll use tabular metrics file `logs.csv` for these examples:

```csv
epoch,accuracy,loss,val_accuracy,val_loss
0,0.9418667,0.19958884770199656,0.9679,0.10217399864746257
1,0.9763333,0.07896138601688048,0.9768,0.07310650711813942
2,0.98375,0.05241111190887168,0.9788,0.06665669009438716
3,0.98801666,0.03681169906261687,0.9781,0.06697812260198989
4,0.99111664,0.027362171787042946,0.978,0.07385754839298315
5,0.9932333,0.02069501801203781,0.9771,0.08009233058886166
6,0.9945,0.017702101902437668,0.9803,0.07830339228538505
7,0.9954,0.01396906608727198,0.9802,0.07247738889862157
```

By default, this command plots the last column of the table (see `-y` option):

```dvc
$ dvc plots show logs.csv
file:///Users/usr/src/plot/logs.csv.html
```

![](/img/plots_show.svg)

Use the `-y` option to change the column to plot:

```dvc
$ dvc plots show -y loss logs.csv
file:///Users/usr/src/plot/logs.csv.html
```

![](/img/plots_show_field.svg)

### Plot file size

Note that by default, all the columns (or fields) are embedded in the plot file
metadata. You can select a subset of the columns using the `--select` option,
which can help reduce the file size:

```dvc
$ ls -lh /Users/usr/src/plot/logs.csv.html
-rw-r--r-- 1 usr grp 2.8K May  9 19:39 /Users/usr/src/plot/logs.csv.html

$ dvc plots show -y loss --select loss logs.csv
file:///Users/usr/src/plot/logs.csv.html

$ ls -lh /Users/usr/src/plot/logs.csv.html
-rw-r--r-- 1 usr grp 1.8K May  9 19:43 /Users/usr/src/plot/logs.csv.html
```

### Headerless tables

A tabular data file without headers can be plotted with `--no-csv-header`
option. A field or column can be specified with `--select` by it's numeric
position (starting with `0`):

```dvc
$ dvc plots show --no-csv-header --select 2 logs.csv
file:///Users/usr/src/plot/logs.csv.html
```

### Vega specification

In many automation scenarios (like CI/CD for ML), it is convenient to have the
[Vega-Lite](https://vega.github.io/vega-lite/) specification instead of the
entire HTML plot file. For example to generating another image format like PNG
or JPEG, or to include differently into a web app. The `--no-html` option
prevents wrapping the plot in HTML. Note that the resulting file is JSON:

```dvc
$ dvc plots show --select accuracy --no-html logs.csv
file:///Users/usr/src/plot/logs.csv.json
```

```json
{
    "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
    "data": {
        "values": [
    {
        "accuracy": "0.9418667",
        "index": 0,
        "rev": "workspace"
    },
    {
        "accuracy": "0.9763333",
        "index": 1,
        "rev": "workspace"
    },
    ...
```

## Example: Hierarchical data (JSON)

We'll use tabular metrics file `train.json` for this example:

```json
{
  "train": [
    { "accuracy": 0.96658, "loss": 0.10757 },
    { "accuracy": 0.97641, "loss": 0.07324 },
    { "accuracy": 0.87707, "loss": 0.08136 },
    { "accuracy": 0.87402, "loss": 0.09026 },
    { "accuracy": 0.8795, "loss": 0.0764 },
    { "accuracy": 0.88038, "loss": 0.07608 },
    { "accuracy": 0.89872, "loss": 0.08455 }
  ]
}
```

DVC identifies and plots JSON objects from the first JSON array found in the
file:

```dvc
$ dvc plots show train.json
file:///Users/usr/src/plot/train.json.html
```

![](/img/plots_show_json.svg)

Same as with tabular data, use the `-y` option to change the field to plot:

```dvc
$ dvc plots show -y accuracy train.json
file:///Users/usr/src/plot/logs.json.html
```

![](/img/plots_show_json_field.svg)
