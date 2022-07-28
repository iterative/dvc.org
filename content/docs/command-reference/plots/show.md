# plots show

Generate [plot](/doc/command-reference/plots) from a plots file or `plots`
[top-level definition] from `dvc.yaml`.

[top-level definition]: /doc/command-reference/plots#top-level-plots

## Synopsis

```usage
usage: dvc plots show [-h] [-q | -v] [-t <name_or_path>] [-x <field>]
                      [-y <field>] [--no-header] [--title <text>]
                      [--x-label <text>] [--y-label <text>] [-o <path>]
                      [--show-vega] [--open] [--html-template <path>]
                      [targets [targets ...]]

positional arguments:
  targets               Plots files or plot IDs from `dvc.yaml` to
                        visualize. Shows all plots by default.
```

## Description

This command provides a quick way to visualize
[certain data](/doc/command-reference/plots#supported-file-formats) such as loss
functions, AUC curves, confusion matrices, etc.

All plots defined in `dvc.yaml` are used by default, but specific plots files or
[top-level plot] IDs can be specified as `targets` (note that target files don't
necessarily have to be defined in `dvc.yaml`).

The plot style can be customized with [plot templates], using the `--template`
option. To learn more about plots file formats and templates, see `dvc plots`.

<admon type="tip">

The default behavior of this command can be modified per [stage plot] file with
`dvc plots modify`.

</admon>

[plot templates]: /doc/command-reference/plots#plot-templates
[top-level plot]: /doc/command-reference/plots#top-level-plots
[stage plot]: /doc/command-reference/plots#stage-plots

## Options

- `-o <path>, --out <path>` - specify a directory to write the HTML file
  containing the plots. The default is `dvc_plots` or the value set with the
  [`plots.out_dir`](/doc/command-reference/config#plots) config option.

- `-t <name_or_path>, --template <name_or_path>` -
  [plot template](/doc/command-reference/plots#plot-templates) to be injected
  with data. The default template is `.dvc/plots/default.json`. See more details
  in `dvc plots`.

- `-x <field>` - field name from which the X axis data comes from. An
  auto-generated `index` field is used by default. See
  [Custom templates](/doc/command-reference/plots#custom-templates) for more
  information on this `index` field. Column names or numbers are expected for
  tabular plots files.

- `-y <field>` - field name from which the Y axis data comes from. The last
  field found in the `targets` is used by default. Column names or numbers are
  expected for tabular plots files.

- `--x-label <text>` - X axis label. The X field name is the default.

- `--y-label <text>` - Y axis label. The Y field name is the default.

- `--title <text>` - plot title.

- `--show-vega` - produce a [Vega-Lite](https://vega.github.io/vega-lite/) spec
  file instead of HTML. See `dvc plots` for more info.

- `--open` - open the HTML generated in a browser automatically. You can enable
  `dvc config plots.auto_open` to make this the default behavior.

- `--no-header` - lets DVC know that CSV or TSV `targets` do not have a header.
  A 0-based numeric index can be used to identify each column instead of names.

- `--html-template <path>` - path to a
  [custom HTML template](/doc/command-reference/plots#html-templates).

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

<details>

### Expand for YAML format

Here's a corresponding `train.yaml` metrics file:

```yaml
train:
  - accuracy: 0.96658
    loss: 0.10757
  - accuracy: 0.97641
    loss: 0.07324
  - accuracy: 0.87707
    loss: 0.08136
  - accuracy: 0.87402
    loss: 0.09026
```

</details>

DVC identifies and plots JSON objects from the first JSON array found in the
file (`train`):

```cli
$ dvc plots show train.json
file:///Users/usr/src/dvc_plots/index.html
```

![](/img/plots_show_json.svg)

> Note that only the last field name (`loss`) is used for the plot by default.

Use the `-y` option to change the field to plot:

```cli
$ dvc plots show -y accuracy train.json
file:///Users/usr/src/dvc_plots/index.html
```

![](/img/plots_show_json_field.svg)

## Example: Tabular data

We'll use tabular metrics file `logs.csv` for these examples:

```
epoch,loss,accuracy
1,0.19,0.81
2,0.11,0.89
3,0.07,0.93
4,0.04,0.96
```

<details>

### Expand for TSV format

Here's a corresponding `train.tsv` metrics file:

```
epoch	loss	accuracy
1	0.19	0.81
2	0.11	0.89
3	0.07	0.93
4	0.04	0.96
```

</details>

By default, this command plots the last column of the table (see `-y` option):

```cli
$ dvc plots show logs.csv
file:///Users/usr/src/dvc_plots/index.html
```

![](/img/plots_show.svg)

Use the `-y` option to change the column to plot:

```cli
$ dvc plots show logs.csv -y loss
file:///Users/usr/src/dvc_plots/index.html
```

![](/img/plots_show_field.svg)

### Headerless tables

A tabular data file without headers can be plotted with `--no-header` option. A
column can be specified with `-y` by it's numeric position (starting with `0`):

```cli
$ dvc plots show --no-header logs.csv -y 2
file:///Users/usr/src/dvc_plots/index.html
```

## Example: Top-level plots

### Simple plot definition

Let's work with the following `logs.csv` data:

```
epoch,loss,accuracy
1,0.19,0.81
2,0.11,0.89
3,0.07,0.93
4,0.04,0.96
```

The minimal plot configuration we can put in `dvc.yaml` is the data source path:

```yaml
stages:
  train:
    cmd: ...

plots:
  logs.csv:
```

```dvc
$ dvc plots show
file:///Users/usr/src/dvc_plots/index.html
```

![](/img/plots_show_spec_default.svg)

We can also customize it:

```yaml
plots:
  logs.csv:
    x: epoch
    y: accuracy
    title: Displaying accuracy
    x_label: This is epoch
    y_label: This is accuracy
```

```dvc
$ dvc plots show
file:///Users/usr/src/dvc_plots/index.html
```

![](/img/plots_show_spec_simple_custom.svg)

### Multiple data series plot

Data in `training_data.csv`:

```csv
epoch,train_loss,test_loss
1,0.33,0.4
2,0.3,0.28
3,0.2,0.25
4,0.1,0.23
```

Plot definition in `dvc.yaml`:

```yaml
plots:
  test_vs_train_loss:
    x: epoch
    y:
      training_data.csv: [test_loss, train_loss]
    title: Compare loss training versus test
```

```dvc
$ dvc plots show
file:///Users/usr/src/dvc_plots/index.html
```

![](/img/plots_show_spec_multiple_columns.svg)

### Sourcing data from different files

Lets prepare a comparison for confusion matrix data between the
`train_classes.csv` and a `test_classes.csv` datasets (below):

```csv
actual_class,predicted_class
dog,dog
dog,dog
dog,dog
dog,bird
cat,cat
cat,cat
cat,cat
cat,dog
bird,bird
bird,bird
bird,bird
bird,dog
```

```csv
actual_class,predicted_class
dog,dog
dog,dog
dog,cat
bird,bird
bird,bird
bird,cat
cat,cat
cat,cat
cat,bird
```

In `dvc.yaml`:

```yaml
plots:
  test_vs_train_confusion:
    x: actual_class
    y:
      train_classes.csv: predicted_class
      test_classes.csv: predicted_class
    title: Compare test vs train confusion matrix
    template: confusion
    x_label: Actual class
    y_label: Predicted class
```

```dvc
$ dvc plots show
file:///Users/usr/src/dvc_plots/index.html
```

![](/img/plots_show_spec_conf_train_test.svg)

## Example: Vega-Lite specification file

In many automation scenarios (like
[CI/CD for ML](/doc/use-cases/ci-cd-for-machine-learning)), it is convenient to
output the [Vega-Lite](https://vega.github.io/vega-lite/) spec file instead of
rendering an HTML plot. For example, to generating another image format like PNG
or JPEG, or to include it differently into a web/mobile app. The `--show-vega`
option prevents wrapping this plot spec in HTML, printing the resulting JSON to
standard output instead:

```cli
$ dvc plots show --show-vega logs.csv -y accuracy
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
