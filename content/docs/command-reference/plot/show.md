# plot show

Generate a [plot](/doc/command-reference/plot) from a file with
[continuous metrics](/doc/command-reference/plot#continous-metrics).

## Synopsis

```usage
usage: dvc plot show [-h] [-q | -v] [-t [TEMPLATE]] [-r RESULT] [--show-json]
                     [-f FIELDS]
                     [datafile]

positional arguments:
  datafile              Data to be visualized.
```

## Description

This command provides a quick way to visualize countinuous metrics such as loss
functions, AUC curves, confusion matrixes etc. Please read `dvc params` for more
information.

## Options

- `-t [TEMPLATE], --template [TEMPLATE]` - File to be injected with data.

- `-r RESULT, --result RESULT` - Name of the generated file.

- `--no-html` - Do not wrap vega plot json with HTML.

- `-f FIELDS, --fields FIELDS` - Choose which fileds or jsonpath to put into
  plot.

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

By default, the command plots the last column of the tabular file.

```dvc
$ dvc plot show logs.csv
file:///Users/dmitry/src/plot/logs.html
```

![](/img/plot_show.svg)

Use `--field` option to changing column to visualize:

```dvc
$ dvc plot show --field loss logs.csv
file:///Users/dmitry/src/plot/logs.html
```

![](/img/plot_show_field.svg)

A tabular file without header can be plotted with `--no-csv-header` option. A
field can be specified through column number (starting with 0):

```dvc
$ dvc plot show --no-csv-header --field 2 logs.csv
file:///Users/dmitry/src/plot/logs.html
```

In many automation scenarios (like CI/CD for ML), it is convinient to have Vega
specification instead of a whole HTML file because it might be used for
generating another image format like PNG or JPEG or just included to some web
page. `--no-html` option prevents adding HTML header and footer to the file.
Note, the result file extension changes to JSON:

```
$ dvc plot show --no-html logs.csv
file:///Users/dmitry/src/plot/logs.json
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
file:///Users/dmitry/src/plot/train.html
```

![](/img/plot_show.svg)

The field name can be specified with the same `--field` option. The signal from
the first JSON array with the specified name will be showned:

```dvc
$ dvc plot show --field accuracy logs.json
file:///Users/dmitry/src/plot/logs.html
```
