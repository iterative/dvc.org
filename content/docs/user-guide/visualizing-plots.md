# Visualizing Plots

DVC can generate and render plots based on your project's data. A typical
workflow is:

1. Save some data, for example in JSON format. This may be an
   [ML pipeline output](#stage-plots).

   ```json
   [
       {
           "actual": "0",
           "predicted": "0"
       },
   ...
   ```

2. [Define plots](#defining-plots), optionally using
   [templates](#plot-templates-data-series-only) to configure how to visualize
   the data.

   ```yaml
   plots:
     evaluation/test/plots/confusion_matrix.json: # Configure template and axes.
       template: confusion
       x: actual
       y: predicted
     ROC: # Combine multiple data sources.
       x: fpr
       y:
         evaluation/train/plots/roc.json: tpr
         evaluation/test/plots/roc.json: tpr
     evaluation/importance.png: # Plot an image.
   ```

3. [Show](/doc/command-reference/plots/show) all plots in a single view or
   report.

   ![](/img/guide_plots_intro_show.png)

4. Run [experiments](/doc/user-guide/experiment-management/experiments-overview)
   and [compare](#comparing-plots) the resulting plots.

   ![](/img/guide_plots_intro_compare.png)

## Supported plot file formats

To create valid plots files, you can:

- Use [DVCLive](/doc/dvclive/dvclive-with-dvc) in your Python code to log the
  data automatically in a DVC-compatible format.
- Generate a JSON, YAML 1.2, CSV, or TSV data series file yourself.
- Save an JPEG, GIF, or PNG image file to render directly in your reports
  (helpful for custom visualizations that would be hard to configure in DVC).

DVC generates plots as static HTML webpages you can open with a web browser or
view in VS Code via the [Plots Dashboard] of the [DVC Extension]. (they can be
saved as SVG or PNG image files from there).

<admon type="tip">

We recommend [tracking] image files with DVC instead of Git, to prevent the
repository from bloating.

[plots dashboard]:
  https://github.com/iterative/vscode-dvc/blob/main/extension/resources/walkthrough/plots.md
[dvc extension]:
  https://marketplace.visualstudio.com/items?itemName=Iterative.dvc
[tracking]: /doc/start/data-management

</admon>

For data-series plots, DVC expects to see one or more arrays of objects (usually
_float numbers_) in the file. These are rendered using
[Vega-Lite](https://vega.github.io/vega-lite/) (declarative grammar for defining
graphics).

### Tabular data

In tabular file formats (CSV and TSV), each column is an array. `dvc plots`
subcommands can produce plots for a specified column or a set of them. For
example, `epoch`, `loss`, and `accuracy` are the column names below:

```
epoch,loss,accuracy
1,0.19,0.81
2,0.11,0.89
3,0.07,0.93
4,0.04,0.96
```

You can configure how DVC visualizes the data (see `dvc plots show`):

```cli
$ dvc plots show logs.csv -x epoch -y loss
file:///Users/usr/src/dvc_plots/index.html
```

![](/img/plots_show_field.svg)

### Hierarchical data

Hierarchical file formats (JSON and YAML) should contain an array of consistent
objects (sharing a common structure): All objects should contain the fields used
for the X and Y axis of the plot (see [DVC template anchors]); Extra elements
will be ignored silently.

`dvc plots` subcommands can produce plots for a specified field or a set of
them, from the array's objects. For example, `loss` is one of the field names in
the `train` array below:

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

You can configure how DVC visualizes the data (see `dvc plots show`):

```cli
$ dvc plots show train.json -y loss
file:///Users/usr/src/dvc_plots/index.html
```

![](/img/plots_show_json.svg)

[dvc template anchors]: /doc/command-reference/plots/templates#custom-templates

## Defining plots

In order to create visualizations, users need to provide the data and
(optionally) configuration that will help customize the plot. DVC provides two
ways to configure visualizations. Users can define top-level `plots` in
`dvc.yaml`, or mark specific stage <abbr>outputs</abbr> as plots.

<admon type="info">

DVC will collect both types and display everything conforming to each plot
configuration. If any stage plot files are also used in a top-level definitions,
DVC will create separate rendering for each type.

</admon>

### Top-level plots

Plots can be defined in a top-level `plots` key in `dvc.yaml`. Top-level plots
can use any file found in the <abbr>project</abbr>.

In the simplest use, you only need to provide the plot's file path. In the
example below, DVC will take data from `logs.csv` and use the default plotting
behavior (apply the `linear` plot [template] to the last found column):

```yaml
# dvc.yaml
---
stages:
  build:
    cmd: python train.py
    outs:
      - logs.csv
  ...
plots:
  logs.csv:
```

```dvc
$ dvc plots show
file:///Users/usr/src/dvc_plots/index.html
```

![](/img/plots_show_spec_default.svg)

For customization, we can:

- Use a plot ID (`test_vs_train_confusion`) that is not a file path.
- Specify one or more columns for the `x` (`actual_class`) and `y`
  (`predicted_class`) axes.
- Specify one or more data sources (`train_classes.csv` and `test_classes.csv`)
  as keys to the `y` axis.
- Specify any other available configuration field (`title`, `template`,
  `x_label`, `y_label`).

```yaml
# dvc.yaml
---
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

[template]: #plot-templates-data-series-only

<admon icon="book">

Refer to the [full format specification] and `dvc plots show` for more details.

[full format specification]:
  /doc/user-guide/project-structure/dvcyaml-files#top-level-plot-definitions

</admon>

### Plot Outputs

When defining [pipelines], some <abbr>outputs</abbr> can be placed under a
`plots` list for the corresponding stage. This will tell DVC that they are
intended for visualization.

<admon type="info">

When using `dvc stage add`, use `--plots/--plots-no-cache` instead of
`--outs/--outs-no-cache`.

</admon>

```yaml
# dvc.yaml
---
stages:
  build:
    cmd: python train.py
    plots:
      - logs.csv:
        x: epoch
        y: loss
  ...
```

Plotting stage outputs are convenient for defining plots within the stage
without having to write top-level `plots` definitions in `dvc.yaml`. They do not
support custom plot IDs or multiple data sources.

[pipelines]: /doc/start/data-management/data-pipelines

## Plot templates (data-series only)

DVC uses [Vega-Lite](https://vega.github.io/vega-lite/) JSON specifications to
create plots from user data. A set of built-in _plot templates_ are included.

The `linear` template is the default. It can be changed with the `--template`
(`-t`) option of `dvc plots show` and `dvc plots diff`. The argument provided to
`--template` can be a (built-in) template name or a path to a [custom
template][custom templates].

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
  [example](/doc/command-reference/plots/show#example-smooth-plot)
- `confusion` - confusion matrix, see
  [example](/doc/command-reference/plots/show#example-confusion-matrix)
- `confusion_normalized` - confusion matrix with values normalized to <0, 1>
  range
- `bar_horizontal` - horizontal bar plot, see
  [example](/doc/command-reference/plots/show#example-horizontal-bar-plot)
- `bar_horizontal_sorted` - horizontal bar plot sorted by bar size

Note that in the case of CSV/TSV metrics files, column names from the table
header (first row) are equivalent to field names.

Refer to `dvc plots templates` for more information on how to prepare your own
template from pre-defined ones.

[custom templates]: /doc/command-reference/plots/templates#custom-templates

## Comparing plots

When you run [experiments] or otherwise update the data in the plots files,
those updates will be automatically reflected in your visualizations. To compare
between experiments or Git [revisions], you can use `dvc plots diff` or the
[plots dashboard] from the [VS Code Extension][dvc extension].

![](/img/plots_compare_vs_code.png)

[experiments]: /doc/user-guide/experiment-management/experiments-overview
[revisions]: https://git-scm.com/docs/revisions
