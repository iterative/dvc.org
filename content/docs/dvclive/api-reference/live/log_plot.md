# Live.log_plot()

```py
def log_plot(self, name: str, labels, predictions, **kwargs):
```

#### Usage:

```py
from dvclive import Live

live = Live()

y_true = [0, 0, 1, 1]
y_pred = [1, 0, 1, 0]
y_score = [0.1, 0.4, 0.35, 0.8]]
live.log_plot("roc", y_true, y_score)
live.log_plot("confusion_matrix", y_true, y_pred)
```

## Description

Generates a
[scikit learn plot](https://scikit-learn.org/stable/visualizations.html) and
saves the result in `{path}/plots/{name}.json`.

💡 The generated `{path}/plots/{name}.json` can be visualized with `dvc plots`.

### Step updates

⚠️ `Live.log_plot()` can't be currently used in scripts where the step is being
updated ( with `Live.next_step() or `Live.set_step()`).

## Supported plots

`name` must be one of the supported plots:

### `calibration`

Generates a
[calibration curve](https://scikit-learn.org/stable/modules/calibration.html#calibration-curves)
plot.

Calls
[sklearn.calibration.calibration_curve](https://scikit-learn.org/stable/modules/generated/sklearn.calibration.calibration_curve.html)
and stores the outputs as `dvc plots` in `{path}/plots/calibratrion.json`

```py
y_true = [0, 0, 1, 1]
y_score = [0.1, 0.4, 0.35, 0.8]]
live.log_plot("calibration", y_true, y_score)
```

![](/img/dvclive-calibration.png)

### `confusion_matrix`

Generates a [confusion matrix](https://en.wikipedia.org/wiki/Confusion_matrix)
plot.

Stores the abels and predictions in `{path}/plots/confusion_matrix.json`, with
the format expected by the confusion matrix
[template](/doc/command-reference/plots#plot-templates-data-series-only) of
`dvc plots`.

```py
y_true = [1, 1, 2, 2]
y_pred = [2, 1, 1, 2]
live.log_plot("confusion_matrix", y_true, y_pred)
```

![](/img/dvclive-confusion_matrix.png)

### `det`

Generates a
[detection error tradeoff (DET)](https://scikit-learn.org/stable/modules/model_evaluation.html#det-curve)
plot.

Calls
[sklearn.metrics.det_curve](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.det_curve.html)
and stores the outputs as `dvc plots` in `{path}/plots/det.json`.

```py
y_true = [1, 1, 2, 2]
y_score = [0.1, 0.4, 0.35, 0.8]
live.log_plot("det", y_true, y_score)
```

![](/img/dvclive-det.png)

### `precision_recall`

Generates a
[precision-recall curve](https://scikit-learn.org/stable/modules/model_evaluation.html#precision-recall-f-measure-metrics)
plot.

Calls
[sklearn.metrics.precision_recall_curve](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.precision_recall_curve.html)
and stores the outputs as `dvc plots` in `{path}/plots/precision_recall.json`.

```py
y_true = [1, 1, 2, 2]
y_score = [0.1, 0.4, 0.35, 0.8]
live.log_plot("precision_recall", y_true, y_score)
```

![](/img/dvclive-precision_recall.png)

### `roc`

Generates a
[receiver operating characteristic (ROC) curve](https://scikit-learn.org/stable/modules/model_evaluation.html#roc-metrics)
plot.

Calls
[sklearn.metrics.roc_curve](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.roc_curve.html#sklearn.metrics.roc_curve)
and stores the outputs as `dvc plots` in `{path}/plots/roc.json`

```py
y_true = [1, 1, 2, 2]
y_score = [0.1, 0.4, 0.35, 0.8]
live.log_plot("roc", y_true, y_score)
```

![](/img/dvclive-roc.png)

## Parameters

- `name` - One of the supported plots.

- `labels` - Array of ground truth labels.

- `predictions` - Array of predicted labels (for `confusion_matrix`) or
  predicted probabilities (for the rest of the supported plots)

- `**kwargs` - Additional arguments to be passed to the internal scikit-learn
  function being called.

## Exceptions

- `dvclive.error.InvalidPlotTypeError` - thrown if the provided `name` does not
  correspond to any of the supported plots.

- `RuntimeError` - thrown if `Live.log_plot()` is used alongside
  `Live.next_step()` or `Live.set_step()`.
