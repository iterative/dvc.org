# Live.log_sklearn_plot()

Generates a
[scikit learn plot](https://scikit-learn.org/stable/visualizations.html) and
saves the data in `{Live.dir}/plots/sklearn/{name}.json`.

```py
def log_sklearn_plot(
  self,
  kind: Literal['calibration', 'confusion_matrix', 'precision_recall', 'roc'],
  labels,
  predictions,
  name: Optional[str] = None,
  **kwargs):
```

## Usage

```py
from dvclive import Live

live = Live()

y_true = [0, 0, 1, 1]
y_pred = [1, 0, 1, 0]
y_score = [0.1, 0.4, 0.35, 0.8]
live.log_sklearn_plot("roc", y_true, y_score)
live.log_sklearn_plot("confusion_matrix", y_true, y_pred, name="cm.json")
```

## Description

Uses `kind` to determine the type of plot to be generated. See
[supported plots](#supported-plots).

If `name` is not provided, `kind` will be used as the default name.

## Supported plots

`kind` must be one of the supported plots:

<toggle>

<tab title="calibration">

Generates a
[calibration curve](https://scikit-learn.org/stable/modules/calibration.html#calibration-curves)
plot.

Calls
[sklearn.calibration.calibration_curve](https://scikit-learn.org/stable/modules/generated/sklearn.calibration.calibration_curve.html)
and stores the data at `{Live.dir}/plots/sklearn/calibratrion.json` in a format
compatible with `dvc plots`.

```py
y_true = [0, 0, 1, 1]
y_score = [0.1, 0.4, 0.35, 0.8]
live.log_sklearn_plot("calibration", y_true, y_score)
```

Example usage with `dvc plots`:

```cli
$ dvc plots show 'dvclive/plots/sklearn/calibration.json' \
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

Stores the labels and predictions in
`{Live.dir}/plots/sklearn/confusion_matrix.json`, with the format expected by
the confusion matrix
[template](/doc/user-guide/visualizing-plots#plot-templates-data-series-only) of
`dvc plots`.

```py
y_true = [1, 1, 2, 2]
y_pred = [2, 1, 1, 2]
live.log_sklearn_plot("confusion_matrix", y_true, y_pred)
```

Example usage with `dvc plots`:

```cli
$ dvc plots show 'dvclive/plots/sklearn/confusion_matrix.json' \
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
and stores the data at `{Live.dir}/plots/sklearn/det.json` in a format
compatible with `dvc plots`.

```py
y_true = [1, 1, 2, 2]
y_score = [0.1, 0.4, 0.35, 0.8]
live.log_sklearn_plot("det", y_true, y_score)
```

Example usage with `dvc plots`:

```cli
$ dvc plots show 'dvclive/plots/sklearn/det.json' \
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
and stores the data at `{Live.dir}/plots/sklearn/precision_recall.json` in a
format compatible with `dvc plots`.

```py
y_true = [1, 1, 2, 2]
y_score = [0.1, 0.4, 0.35, 0.8]
live.log_sklearn_plot("precision_recall", y_true, y_score)
```

Example usage with `dvc plots`:

```cli
$ dvc plots show 'dvclive/plots/sklearn/precision_recall.json' \
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
and stores the data at `{Live.dir}/plots/sklearn/roc.json` in a format
compatible with `dvc plots`.

```py
y_true = [1, 1, 2, 2]
y_score = [0.1, 0.4, 0.35, 0.8]
live.log_sklearn_plot("roc", y_true, y_score)
```

Example usage with `dvc plots`:

```cli
$ dvc plots show 'dvclive/plots/sklearn/roc.json' \
-x fpr -y tpr \
--title 'ROC Curve'
```

![](/img/dvclive-roc.png)

</tab>

</toggle>

## Parameters

- `kind` - a [supported plot type](#supported-plots)

- `labels` - array of ground truth labels

- `predictions` - array of predicted labels (for `confusion_matrix`) or
  predicted probabilities (for other plots)

- `name` - Optional name of the output file. If not provided, `kind` will be
  used as name.

- `**kwargs` - additional arguments to be passed to the internal scikit-learn
  function being called

## Exceptions

- `dvclive.error.InvalidPlotTypeError` - thrown if the provided `kind` does not
  correspond to any of the supported plots.
