# Live.log_sklearn_plot()

Generates a
[scikit learn plot](https://scikit-learn.org/stable/visualizations.html) and
saves the data in `{Live.dir}/plots/sklearn/{name}.json`.

```py
def log_sklearn_plot(
  kind: Literal['calibration', 'confusion_matrix', 'det', 'precision_recall', 'roc'],
  labels,
  predictions,
  name: Optional[str] = None,
  **kwargs):
```

## Usage

```py
from dvclive import Live

with Live() as live:
  y_true = [0, 0, 1, 1]
  y_pred = [1, 0, 1, 0]
  y_score = [0.1, 0.4, 0.35, 0.8]
  live.log_sklearn_plot("roc", y_true, y_score)
  live.log_sklearn_plot(
    "confusion_matrix", y_true, y_pred, name="cm.json")
```

## Description

The method will compute and dump the `kind` plot (see
[supported plots](#supported-plots)) to `{Live.dir}/plots/sklearn/{name}` in a
format compatible with `dvc plots`.

It will also store the provided properties to be included in the `plots` section
written by `Live.make_dvcyaml()`. The example snippet would add the following to
`dvc.yaml`:

```yaml
plots:
  - dvclive/plots/sklearn/roc.json:
      template: simple
      x: fpr
      y: tpr
      title: Receiver operating characteristic (ROC)
      x_label: False Positive Rate
      y_label: True Positive Rate
  - dvclive/plots/sklearn/cm.json:
      template: confusion
      x: actual
      y: predicted
      title: Confusion Matrix
      x_label: True Label
      y_label: Predicted Label
```

## Supported plots

`kind` must be one of the supported plots:

<toggle>

<tab title="calibration">

Generates a
[calibration curve](https://scikit-learn.org/stable/modules/calibration.html#calibration-curves)
plot.

```py
y_true = [0, 0, 1, 1]
y_score = [0.1, 0.4, 0.35, 0.8]
live.log_sklearn_plot("calibration", y_true, y_score)
```

![](/img/dvclive-calibration.png)

</tab>

<tab title="confusion_matrix">

Generates a [confusion matrix](https://en.wikipedia.org/wiki/Confusion_matrix)
plot.

```py
y_true = [1, 1, 2, 2]
y_pred = [2, 1, 1, 2]
live.log_sklearn_plot("confusion_matrix", y_true, y_pred)
```

![](/img/dvclive-confusion_matrix.png)

</tab>

<tab title="det">

Generates a
[detection error tradeoff (DET)](https://scikit-learn.org/stable/modules/model_evaluation.html#det-curve)
plot.

```py
y_true = [1, 1, 2, 2]
y_score = [0.1, 0.4, 0.35, 0.8]
live.log_sklearn_plot("det", y_true, y_score)
```

![](/img/dvclive-det.png)

</tab>

<tab title="precision_recall">

Generates a
[precision-recall curve](https://scikit-learn.org/stable/modules/model_evaluation.html#precision-recall-f-measure-metrics)
plot.

```py
y_true = [1, 1, 2, 2]
y_score = [0.1, 0.4, 0.35, 0.8]
live.log_sklearn_plot("precision_recall", y_true, y_score)
```

![](/img/dvclive-precision_recall.png)

</tab>

<tab title="roc">

Generates a
[receiver operating characteristic (ROC) curve](https://scikit-learn.org/stable/modules/model_evaluation.html#roc-metrics)
plot.

```py
y_true = [1, 1, 2, 2]
y_score = [0.1, 0.4, 0.35, 0.8]
live.log_sklearn_plot("roc", y_true, y_score)
```

![](/img/dvclive-roc.png)

</tab>

</toggle>

## Parameters

- `kind` - a [supported plot type](#supported-plots).

- `labels` - array of ground truth labels.

- `predictions` - array of predicted labels (for `confusion_matrix`) or
  predicted probabilities (for other plots).

- `name` - optional name of the output file. If not provided, `kind` will be
  used as name.

- `**kwargs` - additional arguments to tune the result. Arguments are passed to
  the scikit-learn function (e.g. `drop_intermediate=True` for the
  [`roc`](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.roc_curve.html)
  type). Plus extra arguments supported by the type of a plot are:
  - `normalized` - _default_: `False`. `confusion_matrix` with values normalized
    to `<0, 1>` range.

## Exceptions

- `dvclive.error.InvalidPlotTypeError` - thrown if the provided `kind` does not
  correspond to any of the supported plots.
