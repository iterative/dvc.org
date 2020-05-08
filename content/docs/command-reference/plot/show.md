# plot show

Generate a plot image from from a [metrics](/doc/command-reference/plot) file.

## Synopsis

```usage
usage: dvc plot show [-h] [-q | -v] [-t [TEMPLATE]] [-f FILE] [-s SELECT]
                     [-x X] [-y Y] [--stdout] [--no-csv-header] [--no-html]
                     [--title TITLE] [--xlab XLAB] [--ylab YLAB]

positional arguments:
  datafile              Metrics file to visualize
```

## Description

This command provides a quick way to visualize continuous metrics such as loss
functions, AUC curves, confusion matrixes etc. Please read `dvc plot` for more
information.

## Options

- `-t [TEMPLATE], --template [TEMPLATE]` - File to be injected with data. The
  default template is `.dvc/plot/default.json`. See more details in `dvc plot`.

- `-f FILE, --file FILE` - Name of the generated file. By default, the output
  file name is equal to the input filename with additional `.html` suffix or
  `.json` suffix for `--no-html` mode.

- `--no-html` - Do not wrap output vega plot json with HTML.

- `-s SELECT, --select SELECT` - Select which fields or jsonpath to put into
  plot. All the fields will be included by default with DVC generated `index`
  field - see `dvc plot`.

- `-x X` - Field name for x axis. `index` is the default field for X.

- `-y Y` - Field name for y axis. The default field is the last field found in
  the input file: the last column in CSV file or the last field in the JSON
  array object (the first object).

- `--xlab XLAB` - X axis title. The X column name is the default title.

- `--ylab YLAB` - Y axis title. The Y column name is the default title.

- `--title TITLE` - Plot title.

- `-o, --stdout` - Print plot content to stdout.

- `--no-csv-header` - Provided CSV or TSV datafile does not have a header.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

Tabular file `logs.csv` visualization:

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

By default, the command plots the last column of the tabular file. Please look
at the default behavior of `-y` option.

```dvc
$ dvc plot show logs.csv
file:///Users/dmitry/src/plot/logs.csv.html
```

![](/img/plot_show.svg)

Use `-y` option to change column to visualize:

```dvc
$ dvc plot show -y loss logs.csv
file:///Users/dmitry/src/plot/logs.csv.html
```

![](/img/plot_show_field.svg)

In the previous example all the columns (or fields) were included into the
output file. You can select only specified subset ot the columns by `--select`
option which might be important for reducing the output file size. In this case
the default `index` column will be still included.

```dvc
$ dvc plot show -y loss --select loss logs.csv
file:///Users/dmitry/src/plot/logs.csv.html
```

A tabular file without header can be plotted with `--no-csv-header` option. A
field can be specified through column number (starting with 0):

```dvc
$ dvc plot show --no-csv-header --field 2 logs.csv
file:///Users/dmitry/src/plot/logs.csv.html
```

In many automation scenarios (like CI/CD for ML), it is convenient to have Vega
specification instead of a whole HTML file because it might be used for
generating another image format like PNG or JPEG or just included to some web
page. `--no-html` option prevents adding HTML header and footer to the file.
Note, the result file extension changes to JSON:

```
$ dvc plot show --no-html logs.csv
file:///Users/dmitry/src/plot/logs.csv.json
```

JSON file plotting example:

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

DVC identifies and plots JSON-objects from the first JSON array it was able to
find.

```dvc
$ dvc plot show train.json
file:///Users/dmitry/src/plot/train.json.html
```

![](/img/plot_show.svg)

The field name can be specified with the same `-y` option. The signal from the
first JSON array with the specified name will be shown:

```dvc
$ dvc plot show -y accuracy logs.json
file:///Users/dmitry/src/plot/logs.json.html
```
