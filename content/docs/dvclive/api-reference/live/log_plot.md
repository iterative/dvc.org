# Live.log_plot()

Generates a
[scikit learn plot](https://scikit-learn.org/stable/visualizations.html) and
saves the data in `{path}/plots/{name}.json`.

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

Uses `name` to determine which plot should be generated. See
[supported plots](#supported-plots).

<admon type="tip">

The generated `{path}/plots/{name}.json` can be visualized with `dvc plots`.

</admon>

### Step updates

`Live.log_plot()` can be currently only used when `step` is `None`.

If you perform `step` updates in your code, you can later use
`Live.set_step(None)` in order to be able to use `Live.log_plot()`.

```python
for epoch in range(NUM_EPOCHS):
    live.log(metric_name, value)
    live.next_step()

live.set_step(None)
live.log_plot("roc", y_true, y_score)
```

## Supported plots

`name` must be one of the supported plots:

<toggle>

<tab title="calibration">

Generates a
[calibration curve](https://scikit-learn.org/stable/modules/calibration.html#calibration-curves)
plot.

Calls
[sklearn.calibration.calibration_curve](https://scikit-learn.org/stable/modules/generated/sklearn.calibration.calibration_curve.html)
and stores the data at `{path}/plots/calibratrion.json` in a format compatible
with `dvc plots`.

```py
y_true = [0, 0, 1, 1]
y_score = [0.1, 0.4, 0.35, 0.8]
live.log_plot("calibration", y_true, y_score)
```

Example usage with `dvc plots`:

```dvc
$ dvc plots show 'dvclive/plots/calibration.json' \
-x prob_pred -y prob_true \
--x-label 'Mean Predicted Probability' \
--y-label 'Fraction of Positives' \
--title 'Calibration Curve'
```

![](/img/dvclive-calibration.png)

</tab>

<tab title="confusion_matrix">

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

Example usage with `dvc plots`:

```dvc
$ dvc plots show 'dvclive/plots/confusion_matrix.json' \
-x actual -y predicted \
--template confusion
```

![](/img/dvclive-confusion_matrix.png)

</tab>

<tab title="det">

Generates a
[detection error tradeoff (DET)](https://scikit-learn.org/stable/modules/model_evaluation.html#det-curve)
plot.

Calls
[sklearn.metrics.det_curve](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.det_curve.html)
and stores the data at `{path}/plots/det.json` in a format compatible with
`dvc plots`.

```py
y_true = [1, 1, 2, 2]
y_score = [0.1, 0.4, 0.35, 0.8]
live.log_plot("det", y_true, y_score)
```

Example usage with `dvc plots`:

```dvc
$ dvc plots show 'dvclive/plots/det.json' \
-x fpr -y fnr \
--title 'DET Curve'
```

![](/img/dvclive-det.png)

</tab>

<tab title="precision_recall">

Generates a
[precision-recall curve](https://scikit-learn.org/stable/modules/model_evaluation.html#precision-recall-f-measure-metrics)
plot.

Calls
[sklearn.metrics.precision_recall_curve](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.precision_recall_curve.html)
and stores the data at `{path}/plots/precision_recall.json` in a format
compatible with `dvc plots`.

```py
y_true = [1, 1, 2, 2]
y_score = [0.1, 0.4, 0.35, 0.8]
live.log_plot("precision_recall", y_true, y_score)
```

Example usage with `dvc plots`:

```dvc
$ dvc plots show 'dvclive/plots/precision_recall.json' \
-x recall -y precision \
--title 'Precision Recall Curve'
```

![](/img/dvclive-precision_recall.png)

</tab>

<tab title="roc">

Generates a
[receiver operating characteristic (ROC) curve](https://scikit-learn.org/stable/modules/model_evaluation.html#roc-metrics)
plot.

Calls
[sklearn.metrics.roc_curve](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.roc_curve.html#sklearn.metrics.roc_curve)
and stores the data at `{path}/plots/roc.json` in a format compatible with
`dvc plots`.

```py
y_true = [1, 1, 2, 2]
y_score = [0.1, 0.4, 0.35, 0.8]
live.log_plot("roc", y_true, y_score)
```

Example usage with `dvc plots`:

```dvc
$ dvc plots show 'dvclive/plots/roc.json' \
-x fpr -y tpr \
--title 'ROC Curve'
```

![](/img/dvclive-roc.png)

</tab>

</toggle>

## Parameters

- `name` - a [supported plot type](#supported-plots)

- `labels` - array of ground truth labels

- `predictions` - array of predicted labels (for `confusion_matrix`) or
  predicted probabilities (for other plots)

- `**kwargs` - additional arguments to be passed to the internal scikit-learn
  function being called

## Exceptions

- `dvclive.error.InvalidPlotTypeError` - thrown if the provided `name` does not
  correspond to any of the supported plots.

- `RuntimeError` - thrown if `Live.log_plot()` is used and `step` is not `None`.
