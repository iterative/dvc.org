# plots

A set of commands to visualize and compare data series or images from ML
projects: [show](/doc/command-reference/plots/show),
[diff](/doc/command-reference/plots/diff),
[modify](/doc/command-reference/plots/modify) and
[templates](/doc/command-reference/plots/templates).

## Synopsis

```usage
usage: dvc plots [-h] [-q | -v] {show,diff,modify,templates} ...

positional arguments:
  COMMAND
    show        Generate plots from target files or from `plots`
                definitions in `dvc.yaml`.
    diff        Show multiple versions of a plot by overlaying them
                in a single image.
    modify      Modify display properties of data-series plots
                defined in stages (has no effect on image plots).
    templates   Write built-in plots templates to a directory
                (.dvc/plots by default).
```

## Description

DVC provides a set of commands to visualize data produced by machine learning
projects. Usual plots include AUC curves, loss functions, or confusion matrices,
for example. Plots are a great alternative to `dvc metrics` when working with
multi-dimensional performance data. They also help you present and compare
[experiments] effectively.

DVC can work with two types of plots files:

1. Data series files, which can be JSON, YAML, CSV or TSV.
2. Image files in JPEG, GIF, or PNG format.

DVC generates plots as static HTML webpages you can open with a web browser
(they can be saved as SVG or PNG image files from there). You can also visualize
DVC plots from the [VS Code Extension], which includes a special [Plots
Dashboard] that corresponds to the features in the `dvc plots` commands.

Data-series plots utilize [Vega-Lite](https://vega.github.io/vega-lite/) for
rendering (declarative JSON grammar for defining graphics). Images are rendered
using `<img>` tags directly.

[vs code extension]:
  https://marketplace.visualstudio.com/items?itemName=Iterative.dvc
[plots dashboard]:
  https://github.com/iterative/vscode-dvc/blob/main/extension/resources/walkthrough/plots.md
[experiments]: /doc/user-guide/experiment-management/experiments-overview

### Supported file formats

Images are included in HTML as-is, without additional processing.

> We recommend to track these source image files with DVC instead of Git, to
> prevent the repository from bloating.

Structured plots can be read from JSON, YAML 1.2, CSV, or TSV files. DVC expects
to see an array (or multiple arrays) of objects (usually _float numbers_) in the
file.

In tabular file formats such as CSV and TSV, each column is an array.
`dvc plots` subcommands can produce plots for a specified column or a set of
them. For example, `epoch`, `AUC`, and `loss` are the column names below:

```
epoch, AUC, loss
34, 0.91935, 0.0317345
35, 0.91913, 0.0317829
36, 0.92256, 0.0304632
37, 0.92302, 0.0299015
```

Hierarchical file formats such as JSON and YAML consists of an array of
consistent objects (sharing a common structure): All objects should contain the
fields used for the X and Y axis of the plot (see
[DVC template anchors](/doc/command-reference/plots#custom-templates)); Extra
elements will be ignored silently.

`dvc plots` subcommands can produce plots for a specified field or a set of
them, from the array's objects. For example, `val_loss` is one of the field
names in the `train` array below:

```json
{
  "train": [
    { "val_accuracy": 0.9665, "val_loss": 0.10757 },
    { "val_accuracy": 0.9764, "val_loss": 0.07324 },
    { "val_accuracy": 0.877, "val_loss": 0.08136 },
    { "val_accuracy": 0.874, "val_loss": 0.09026 },
    { "val_accuracy": 0.8795, "val_loss": 0.0764 },
    { "val_accuracy": 0.8803, "val_loss": 0.07608 },
    { "val_accuracy": 0.8987, "val_loss": 0.08455 }
  ]
}
```

## Defining plots

In order to create visualizations, users need to provide the data and
(optionally) configuration that will help customize the plot. DVC provides two
ways to configure visualizations. Users can mark specific stage
<abbr>outputs</abbr> as plots or define top-level `plots` in `dvc.yaml`.

### Stage plots

When using `dvc stage add`, instead of using `--outs/--outs-no-cache` particular
outputs can be marked with `--plots/--plots-no-cache`. This will tell DVC that
they are intended for visualizations.

Upon running `dvc plots show/diff` DVC will collect stage plots alongside the
[top-level plots](#top-level-plots) and display them conforming to their
configuration. Note, that if there are stage plots in the project and they are
also used in some top-level definitions, DVC will create separate rendering for
the stage plots and all definitions using them.

This special type of outputs might come in handy if users want to visually
compare experiments results with other experiments versions and not bother with
writing top-level plot definitions in `dvc.yaml`.

### Top-level plots

Plots can also be defined in a top-level `plots` key in `dvc.yaml`. Unlike
[stage plots](#stage-plots), these definitions let you overlay plots from
different data sources, for example training vs. test results (on the current
project version). Conversely, you can create multiple plots from a single source
file. You can also use any plot file in the project, regardless of whether it's
a stage outputs. This creates a separation between visualization and outputs.

In order to define the plot users need to provide data and an optional
configuration for the plot. The plots should be defined in `dvc.yaml` file under
`plots` key.

```yaml
# dvc.yaml
stages: ...

plots: ...
```

Every plot has to have its own ID. Configuration, if provided, should be a
dictionary.

In the simplest use case, a user can provide the file path as the plot ID and
not provide configuration at all:

```yaml
# dvc.yaml
---
plots:
  logs.csv:
```

In that case the default behavior will be applied. DVC will take data from
`logs.csv` file and apply `linear` plot
[template](/doc/command-reference/plots#plot-templates) to the last found column
(CSV, TSV files) or field (JSON, YAML).

We can customize the plot by adding appropriate fields to the configuration:

```yaml
# dvc.yaml
---
plots:
  confusion_matrix:
    y:
      confusion_matrix_data.csv: predicted_class
    x: actual_class
    template: confusion
```

In this case we provided `confusion_matrix` as a plot ID. It will be displayed
in the plot as a title, unless we override it with `title` field. In this case
we provided data source in `y` axis definition. Data will be sourced from
`confusion_matrix_data.csv`. As `y` axis we will use `predicted_class` field. On
`x` axis we will have `actual_class` field. Note that DVC will assume that
`actual_class` is inside `confusion_matrix_data.csv`.

We can provide multiple columns/fields from the same file:

```yaml
#dvc.yaml
---
plots:
  multiple_series:
    y:
      logs.csv: [accuracy, loss]
    x: epoch
```

In this case, we will take `accuracy` and `loss` fields and display them agains
`epoch` column, all coming from `logs.csv` file.

We can source the data from multiple files too:

```yaml
#dvc.yaml
---
plots:
  multiple_files:
    y:
      train_logs.csv: accuracy
      test_logs.csv: accuracy
    x: epoch
```

In this case we will plot `accuracy` field from both `train_logs.csv` and
`test_logs.csv` against the `epoch`. Note that both files have to have `epoch`
field.

### Available configuration fields

- `x` - field name from which the X axis data comes from. An auto-generated
  _step_ field is used by default. It has to be a string.

- `y` - field name from which the Y axis data comes from.
  - Top-level plots: It can be a string, list or dictionary. If its a string or
    list, it is assumed that plot ID will be the path to the data source.
    String, or list elements will be the names of data columns or fields withing
    the source file. If this field is a dictionary, it is assumed that its keys
    are paths to data sources. The values have to be either strings or lists,
    and are treated as column(s)/field(s) within respective files.
  - Plot outputs: It is a field name from which the Y axis data comes from.
- `x_label` - X axis label. The X field name is the default.
- `y_label` - Y axis label. If all provided Y entries have the same field name,
  this name will be the default, `y` string otherwise.
- `title` - Plot title. Defaults:
  - Top-level plots: `path/to/dvc.yaml::plot_id`
  - Plot outputs: Path to the file.

Refer to the [`show` command] documentation for examples.

[`show` command]: /doc/command-reference/plots/show#example-top-level-plots

## Plot templates (data-series only)

DVC uses [Vega-Lite](https://vega.github.io/vega-lite/) JSON specifications to
create plots from user data. A set of built-in _plot templates_ are included.

The `linear` template is the default. It can be changed with the `--template`
(`-t`) option of `dvc plots show` and `dvc plots diff`. The argument provided to
`--template` can be a (built-in) template name or a path to a [custom template].

<admon type="tip">

For templates stored in `.dvc/plots` (default location for custom templates),
the path and the json extension are not required: you can specify only the base
name, e.g. `--template scatter`.

</admon>

DVC has the following built-in plot templates:

- `linear` - basic linear plot including cursor interactivity (default)
- `simple` - simplest linear template (not interactive); Good base to create
  [custom templates].
- `scatter` - scatter plot
- `smooth` - linear plot with LOESS smoothing, see
  [example](/doc/command-reference/plots#example-smooth-plot)
- `confusion` - confusion matrix, see
  [example](/doc/command-reference/plots#example-confusion-matrix)

[custom templates]: https://dvc.org/doc/command-reference/plots/templates

- `confusion_normalized` - confusion matrix with values normalized to <0, 1>
  range

Note that in the case of CSV/TSV metrics files, column names from the table
header (first row) are equivalent to field names.

### Custom templates

Plot templates are [Vega-Lite](https://vega.github.io/vega-lite/) JSON
specifications. They use predefined DVC anchors as placeholders for DVC to
inject the plot values.

- `<DVC_METRIC_DATA>` (**required**) - the plot data from any type of metrics
  files is converted to a single JSON array, and injected instead of this
  anchor. Two additional fields will be added: `step` and `rev` (explained
  below).

- `<DVC_METRIC_TITLE>` (optional) - a title for the plot, that can be defined
  with the `--title` option of the `dvc plots` subcommands.

- `<DVC_METRIC_X>` (optional) - field name of the data for the X axis. It can be
  defined with the `-x` option of the `dvc plots` subcommands. The
  auto-generated `step` field (explained below) is the default.

- `<DVC_METRIC_Y>` (optional) - field name of the data for the Y axis. It can be
  defined with the `-y` option of the `dvc plots` subcommands. It defaults to
  the last header of the metrics file: the last column for CSV/TSV, or the last
  field for JSON/YAML.

- `<DVC_METRIC_X_LABEL>` (optional) - field name to display as the X axis label

- `<DVC_METRIC_Y_LABEL>` (optional) - field name to display as the Y axis label

<details>

### Expand to learn how DVC modifies plot data for rendering.

File targets given to `dvc plots show` and `dvc plots diff` are treated as
separate data series, each to be injected into a template file. There are two
important fields that DVC adds to the plot data:

- `step` - zero-based counter for the data rows/values. In many cases it
  corresponds to a machine learning training epoch number.

- `rev` - This field helps distinguish between data sourced from different
  revisions, files or columns.

</details>

Refer to [`templates`](/doc/command-reference/plots/templates) command for more
information on how to prepare your own template from pre-defined ones.

## Custom HTML templates

It's possible to supply an HTML file to `dvc plots show` and `dvc plots diff` by
using the the `--html-template` option. This allows you to customize the
container where DVC will inject plots it generates.

> ⚠️ This is a separate feature from
> [custom Vega-Lite templates](/doc/command-reference/plots#custom-templates).

The only requirement for this HTML file is to specify the place to inject plots
with a `{plot_divs}` marker. See an
[example](/doc/command-reference/plots#example-offline-html-template) that uses
this feature to render DVC plots without an Internet connection, below.

## Options

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output.

- `-v`, `--verbose` - displays detailed tracing information.

## Example: Offline HTML Template

The plots generated by `dvc plots` uses Vega-Lite JavaScript libraries, and by
default these load [online resources](https://vega.github.io/vega/usage/#embed).
There may be times when you need to produce plots without Internet access, or
want to customize the plots output to put some extra content, like banners or
extra text. DVC allows to replace the HTML file that contains the final plots.

Download the Vega-Lite libraries into the directory where you'll produce the
`dvc plots`:

```dvc
$ wget https://cdn.jsdelivr.net/npm/vega@5.20.2 -O my_vega.js
$ wget https://cdn.jsdelivr.net/npm/vega-lite@5.1.0 -O my_vega_lite.js
$ wget https://cdn.jsdelivr.net/npm/vega-embed@6.18.2 -O my_vega_embed.js
```

Create the following HTML file and save it in `.dvc/plots/mypage.html`:

```html
<html>
  <head>
    <script src="../path/to/my_vega.js" type="text/javascript"></script>
    <script src="../path/to/my_vega_lite.js" type="text/javascript"></script>
    <script src="../path/to/my_vega_embed.js" type="text/javascript"></script>
  </head>
  <body>
    {plot_divs}
  </body>
</html>
```

Note that this is a standard HTML file with only `{plot_divs}` as a placeholder
for DVC to inject plots. `<script>` tags in this file point to the local
JavaScript libraries we downloaded above. We can use it like this:

```dvc
$ dvc plots show --html-template .dvc/plots/mypage.html
```

You can also make it the default HTML template by setting it as `dvc config`
parameter `plots.html_template`.

```dvc
$ dvc config plots.html_template plots/mypage.html
```

Note that the path supplied to `dvc config plots.html_template` is relative to
`.dvc/` directory.

## Example: Smooth plot

In some cases we would like to smooth our plot. In this example we will use a
noisy plot with 100 data points:

```dvc
$ dvc plots show data.csv
file:///Users/usr/src/dvc_plots/index.html
```

![](/img/plots_show_no_smooth.svg)

We can use the `-t` (`--template`) option and `smooth` template to make it less
noisy:

```dvc
$ dvc plots show -t smooth data.csv
file:///Users/usr/src/dvc_plots/index.html
```

![](/img/plots_show_smooth.svg)

## Example: Confusion matrix

We'll use `classes.csv` for this example:

```
actual,predicted
cat,cat
cat,cat
cat,cat
cat,dog
cat,dinosaur
cat,dinosaur
cat,bird
turtle,dog
turtle,cat
...
```

Let's visualize it:

```dvc
$ dvc plots show classes.csv --template confusion \
                             -x actual -y predicted
file:///Users/usr/src/dvc_plots/index.html
```

![](/img/plots_show_confusion.svg)

> A confusion matrix [template](/doc/command-reference/plots#plot-templates) is
> predefined in DVC.

We can use `confusion_normalized` template to normalize the results:

```dvc
$ dvc plots show classes.csv -t confusion_normalized
                             -x actual -y predicted
file:///Users/usr/src/dvc_plots/index.html
```

![](/img/plots_show_confusion_normalized.svg)
