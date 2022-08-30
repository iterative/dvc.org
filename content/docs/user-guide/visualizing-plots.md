# Visualizing Plots

A typical workflow for DVC plots is:

1. [Save data](#generating-plots-files) to a
   [supported file format](#supported-file-formats) (for example, as a
   [pipeline output](#stage-plots)).

```csv
fpr,tpr,threshold
0.0,0.0,1.5
1.0,1.0,0.0
```

2. [Define plots](#defining-plots), optionally using
   [templates](#plot-templates-data-series-only) to configure how to visualize
   the data.

```yaml
plots:
  auc.tsv:
    x: fpr
    y: tpr
```

3. [Show](/doc/command-reference/plots/show) all plots in a single view or
   report.

![](/img/plots_prc_get_started_show.svg)
![](/img/plots_roc_get_started_show.svg)
![](/img/plots_importance_get_started_show.png '=300 :wrap-left')
![](/img/plots_cm_get_started_show.svg)

4. Run [experiments](/doc/user-guide/experiment-management/experiments-overview)
   and [compare](#comparing-plots) plots.

![](/img/plots_prc_get_started_diff.svg)
![](/img/plots_roc_get_started_diff.svg)
![](/img/plots_importance_get_started_diff.png)

## Generating plots files

To generate the data files for plots, you can:

- Use [DVCLive](/doc/dvclive/dvclive-with-dvc) in your Python code to log the
  data in the expected format for you.
- Save data yourself in one of the
  [supported file formats](#supported-file-formats).
- Save an image file of the visualization (helpful for custom visualizations
  that would be hard to configure in DVC).

## Supported file formats

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
[DVC template anchors](/doc/command-reference/plots/templates#custom-templates));
Extra elements will be ignored silently.

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

### Example: Tabular data

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

### Example: Hierarchical data

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

## Defining plots

In order to create visualizations, users need to provide the data and
(optionally) configuration that will help customize the plot. DVC provides two
ways to configure visualizations. Users can define top-level plots in `dvc.yaml`
or mark specific stage <abbr>outputs</abbr> as plots. Upon running
`dvc plots show/diff` DVC will collect both top-level plots and stage plots and
display them conforming to their configuration.

### Top-level plots

Plots can be defined in a
[top-level `plots` key](/doc/user-guide/project-structure/dvcyaml-files#top-level-plot-definitions)
in `dvc.yaml`. Unlike [stage plots](#stage-plots), these definitions let you
overlay plots from different data sources, for example training vs. test results
(on the current project version). Conversely, you can create multiple plots from
a single source file. You can also use any plot file in the project, regardless
of whether it's a stage outputs. This creates a separation between visualization
and outputs.

In order to define the plot users need to provide data and an optional
configuration for the plot. The plots should be defined in `dvc.yaml` file under
`plots` key.

```yaml
# dvc.yaml
stages: ...

plots: ...
```

This example makes output `auc.json` viable for visualization, configuring keys
`fpr` and `tpr` as X and Y axis, respectively:

```yaml
stages:
  build:
    cmd: python train.py
    deps:
      - features.csv
    outs:
      - model.pt
      - auc.json
    metrics:
      - accuracy.txt:
          cache: false
plots:
  auc.json:
    x: fpr
    y: tpr
```

Note that we didn't have to specify `auc.json` as a plot output in the stage. In
fact, top-level plots can use any file found in the <abbr>project</abbr>.

Refer to the [`show` command] documentation for examples or the [available
configuration fields] for the full specification.

[`show` command]: /doc/command-reference/plots/show#example-top-level-plots
[available configuration fields]:
  /doc/user-guide/project-structure/dvcyaml-files#available-configuration-fields

### Stage plots

When using `dvc stage add`, instead of using `--outs/--outs-no-cache` particular
outputs can be marked with `--plots/--plots-no-cache`. This will tell DVC that
they are intended for visualizations.

If the same file is used in stage plots and some top-level plots definitions,
DVC will separately render each of them.

Stage plots might come in handy if users want to not bother with writing
top-level plot definitions in `dvc.yaml`.

## Plot templates (data-series only)

DVC uses [Vega-Lite](https://vega.github.io/vega-lite/) JSON specifications to
create plots from user data. A set of built-in _plot templates_ are included.

The `linear` template is the default. It can be changed with the `--template`
(`-t`) option of `dvc plots show` and `dvc plots diff`. The argument provided to
`--template` can be a (built-in) template name or a path to a
[custom template](#custom-templates).

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
  [example](#example-smooth-plot)
- `confusion` - confusion matrix, see [example](#example-confusion-matrix)
- `confusion_normalized` - confusion matrix with values normalized to <0, 1>
  range

Note that in the case of CSV/TSV metrics files, column names from the table
header (first row) are equivalent to field names.

Refer to [`templates`](#custom-templates) command for more information on how to
prepare your own template from pre-defined ones.

### Example: Smooth plot

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

### Example: Confusion matrix

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

> A confusion matrix [template](#plot-templates-data-series-only) is predefined
> in DVC.

We can use `confusion_normalized` template to normalize the results:

```dvc
$ dvc plots show classes.csv -t confusion_normalized
                             -x actual -y predicted
file:///Users/usr/src/dvc_plots/index.html
```

![](/img/plots_show_confusion_normalized.svg)

## Comparing plots

When you run [experiments] or otherwise update the data in the plots files,those
updates will be automatically reflected in your visualizations. To compare
between experiments or Git [revisions], you can use `dvc plots diff` or the
[plots dashboard] from the [VS Code Extension].

![](/img/plots_compare_vs_code.png)

[vs code extension]:
  https://marketplace.visualstudio.com/items?itemName=Iterative.dvc
[plots dashboard]:
  https://github.com/iterative/vscode-dvc/blob/main/extension/resources/walkthrough/plots.md
[experiments]: /doc/user-guide/experiment-management/experiments-overview
[revisions]: https://git-scm.com/docs/revisions
