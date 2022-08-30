# Visualizing Plots

DVC can generate and render plots based on your project's data. A typical
workflow is:

1. Save some data, for example in CSV format. This may be an output file from
   your [ML pipeline].

   ```csv
   fpr, tpr,  threshold
   0.0, 0.0,  1.5
   1.0, 1.0,  0.0
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

3. Use `dvc plots show` to see all plots in a single view or report.

   ![](/img/guide_plots_intro_show_confusion.svg)
   ![](/img/guide_plots_intro_show_importance.png '=400 :wrap-left')
   ![](/img/guide_plots_intro_show_roc.svg)

4. Run [experiments](/doc/user-guide/experiment-management/experiments-overview)
   and [compare](#comparing-plots) the resulting plots.

   ![](/img/guide_plots_intro_compare.png)

   This can be done in VS Code via the [Plots Dashboard] of the [DVC Extension].

[ml pipeline]: /doc/start/data-management/pipelines
[plots dashboard]:
  https://github.com/iterative/vscode-dvc/blob/main/extension/resources/walkthrough/plots.md
[dvc extension]:
  https://marketplace.visualstudio.com/items?itemName=Iterative.dvc

## Supported plot file formats

To create valid plots files, you can:

- Use [DVCLive](/doc/dvclive/dvclive-with-dvc) in your Python code to log the
  data automatically in a DVC-compatible format.
- Generate a JSON, YAML 1.2, CSV, or TSV data series file yourself.
- Save an JPEG, GIF, or PNG image file to render directly in your reports
  (helpful for custom visualizations that would be hard to configure in DVC).

DVC generates plots as static HTML webpages you can open with a web browser
(they can be saved as SVG or PNG image files from there).

Images are rendered using `<img>` tags directly, without additional processing.

<admon type="tip">

We recommend [tracking] image files with DVC instead of Git, to prevent the
repository from bloating.

[tracking]: /doc/start/data-management

</admon>

For data-series plots, DVC expects to see one or more arrays of objects (usually
_float numbers_) in the file. These are rendered using
[Vega-Lite](https://vega.github.io/vega-lite/) (declarative grammar for defining
graphics).

In tabular file formats (CSV and TSV), each column is an array. `dvc plots`
subcommands can produce plots for a specified column or a set of them. For
example, `epoch`, `AUC`, and `loss` are the column names below:

```
epoch,  AUC,      loss
34,     0.91935,  0.0317345
35,     0.91913,  0.0317829
36,     0.92256,  0.0304632
37,     0.92302,  0.0299015
```

Hierarchical file formats (JSON and YAML) should contain an array of consistent
objects (sharing a common structure): All objects should contain the fields used
for the X and Y axis of the plot (see [DVC template anchors]); Extra elements
will be ignored silently.

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

[dvc template anchors]: /doc/command-reference/plots/templates#custom-templates

<details>

### Example: Tabular data (CSV, TSV)

We'll use tabular metrics file `logs.csv` for these examples:

```
epoch,loss,accuracy
1,0.19,0.81
2,0.11,0.89
3,0.07,0.93
4,0.04,0.96
```

<admon type="info">

Here's a corresponding `logs.tsv` metrics file:

```
epoch	loss	accuracy
1	0.19	0.81
2	0.11	0.89
3	0.07	0.93
4	0.04	0.96
```

</admon>

By default, this command plots the last column of the table (see `-y` option):

```cli
$ dvc plots show logs.csv
file:///Users/usr/src/dvc_plots/index.html
```

![](/img/plots_show.svg)

</details>

<details>

### Example: Hierarchical data (JSON, YAML)

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

<admon type="info">

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

</admon>

DVC identifies and plots JSON objects from the first JSON array found in the
file (`train`):

```cli
$ dvc plots show train.json
file:///Users/usr/src/dvc_plots/index.html
```

![](/img/plots_show_json.svg)

</details>

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
file. You can also use any plots file in the project, regardless of whether it's
a stage outputs. This creates a separation between visualization and outputs.

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

📖 Refer to the [full format specification] and to `dvc plots show` for more
examples.

[full format specification]:
  /doc/user-guide/project-structure/dvcyaml-files#top-level-plot-definitions

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
  [example](#example-smooth-plot)
- `confusion` - confusion matrix, see [example](#example-confusion-matrix)

[custom templates]: /doc/command-reference/plots/templates

- `confusion_normalized` - confusion matrix with values normalized to <0, 1>
  range

Note that in the case of CSV/TSV metrics files, column names from the table
header (first row) are equivalent to field names.

Refer to [`templates`](/doc/command-reference/plots/templates) command for more
information on how to prepare your own template from pre-defined ones.

<details>

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

</details>

<details>

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

<admon type="info">

A confusion matrix [template](#plot-templates-data-series-only) is predefined in
DVC.

</admon>

We can use `confusion_normalized` template to normalize the results:

```dvc
$ dvc plots show classes.csv -t confusion_normalized
                             -x actual -y predicted
file:///Users/usr/src/dvc_plots/index.html
```

![](/img/plots_show_confusion_normalized.svg)

</details>

## Comparing plots

When you run [experiments] or otherwise update the data in the plots files,those
updates will be automatically reflected in your visualizations. To compare
between experiments or Git [revisions], you can use `dvc plots diff` or the
[plots dashboard] from the [VS Code Extension].

![](/img/plots_compare_vs_code.png)

[experiments]: /doc/user-guide/experiment-management/experiments-overview
[revisions]: https://git-scm.com/docs/revisions
