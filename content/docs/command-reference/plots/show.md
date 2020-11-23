# plots show

Generate [plot](/doc/command-reference/plots) from a metrics file.

## Synopsis

```usage
usage: dvc plots show [-h] [-q | -v] [-t <name_or_path>] [-x <field>]
                      [-y <field>] [--no-header] [--title <text>]
                      [--x-label <text>] [--y-label <text>] [-o <path>]
                      [--show-vega]
                      [targets [targets ...]]

positional arguments:
  targets               Metrics files to visualize.
                        Shows all plots by default.
```

## Description

This command provides a quick way to visualize
[certain metrics](/doc/command-reference/plots#supported-file-formats) such as
loss functions, AUC curves, confusion matrices, etc.

All plots defined in `dvc.yaml` are used by default, but specific plots files
can be specified as `targets` (note that targets don't necessarily have to be
defined in `dvc.yaml`).

The plot style can be customized with
[plot templates](/doc/command-reference/plots#plot-templates), using the
`--template` option. To learn more about metrics file formats and templates
please see `dvc plots`.

> Note that the default behavior of this command can be modified per metrics
> file with `dvc plots modify`.

## Options

- `-o <path>, --out <path>` - name of the generated file. By default, the output
  file name is equal to the input filename with a `.html` file extension (or
  `.json` when using `--show-vega`).

- `-t <name_or_path>, --template <name_or_path>` -
  [plot template](/doc/command-reference/plots#plot-templates) to be injected
  with data. The default template is `.dvc/plots/default.json`. See more details
  in `dvc plots`.

- `-x <field>` - field name from which the X axis data comes from. An
  auto-generated `index` field is used by default. See
  [Custom templates](/doc/command-reference/plots#custom-templates) for more
  information on this `index` field. Column names or numbers are expected for
  tabular metrics files.

- `-y <field>` - field name from which the Y axis data comes from. The last
  field found in the `targets` is used by default. Column names or numbers are
  expected for tabular metrics files.

- `--x-label <text>` - X axis label. The X field name is the default.

- `--y-label <text>` - Y axis label. The Y field name is the default.

- `--title <text>` - plot title.

- `--show-vega` - produce a
  [Vega specification](https://vega.github.io/vega/docs/specification/) file
  instead of HTML. See `dvc plots` for more info.

- `--no-header` - lets DVC know that CSV or TSV `targets` do not have a header.
  A 0-based numeric index can be used to identify each column instead of names.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Example: Hierarchical data

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
file (`train`):

```dvc
$ dvc plots show train.json
file:///Users/usr/src/plots/train.json.html
```

![](/img/plots_show_json.svg)

> Note that only the last field name (`loss`) is used for the plot by default.

Use the `-y` option to change the field to plot:

```dvc
$ dvc plots show -y accuracy train.json
file:///Users/usr/src/plots/logs.json.html
```

![](/img/plots_show_json_field.svg)

## Example: Tabular data

We'll use tabular metrics file `logs.csv` for these examples:

```
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
file:///Users/usr/src/plots/logs.csv.html
```

![](/img/plots_show.svg)

Use the `-y` option to change the column to plot:

```dvc
$ dvc plots show logs.csv -y loss
file:///Users/usr/src/plots/logs.csv.html
```

![](/img/plots_show_field.svg)

### Headerless tables

A tabular data file without headers can be plotted with `--no-header` option. A
column can be specified with `-y` by it's numeric position (starting with `0`):

```dvc
$ dvc plots show --no-header logs.csv -y 2
file:///Users/usr/src/plots/logs.csv.html
```

## Example: Vega specification file

In many automation scenarios (like CI/CD for ML), it is convenient to output the
[Vega specification](https://vega.github.io/vega/docs/specification/) file
instead of rendering an HTML plot. For example, to generating another image
format like PNG or JPEG, or to include it differently into a web/mobile app. The
`--show-vega` option prevents wrapping this plot spec in HTML. Note that the
resulting file is JSON:

```dvc
$ dvc plots show --show-vega logs.csv -y accuracy
file:///Users/usr/src/plots/logs.csv.json
```

```json
{
    "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
    "data": {
        "values": [
    {
        "accuracy": "0.9418667",
    ...
```
