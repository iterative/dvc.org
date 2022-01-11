# Plotting utilities

Generates
[Scikit-learn visualizations](https://scikit-learn.org/stable/visualizations.html)
in the format expected by `dvc plots`.

![](/img/dvclive-sklearn.png)

> See also a [detailed usage example](/doc/dvclive/ml-frameworks/sklearn).

## log_calibration_curve

Generates a
[calibration curve](https://scikit-learn.org/stable/modules/calibration.html#calibration-curves)
plot (which can be visualized with `dvc plots`) .

![](/img/dvclive-sklearn-cc.png)

```py
def log_calibration_curve(y_true, y_prob, output_file, **kwargs):
```

#### Usage:

```py
from dvclive.plots import log_calibration_curve

y_true = [1, 1, 2, 2]
y_prob = [0.1, 0.4, 0.35, 0.8]

log_calibration_curve(y_true, y_prob, "cc.json")
```

### Description

Calls
[sklearn.calibration.calibration_curve](https://scikit-learn.org/stable/modules/generated/sklearn.calibration.calibration_curve.html)
and stores the result as a `dvc plot` in `output_file`

### Parameters

- `y_true` - See
  [sklearn.calibration.calibration_curve](https://scikit-learn.org/stable/modules/generated/sklearn.calibration.calibration_curve.html).

- `y_prob` - See
  [sklearn.calibration.calibration_curve](https://scikit-learn.org/stable/modules/generated/sklearn.calibration.calibration_curve.html).

- `output_file` - The name of the file where the `.json` plot will be saved.

- `**kwargs` - Additional arguments that will be passed to
  [sklearn.calibration.calibration_curve](https://scikit-learn.org/stable/modules/generated/sklearn.calibration.calibration_curve.html).

## log_confusion_matrix

Generates a [confusion matrix](https://en.wikipedia.org/wiki/Confusion_matrix)
plot (which can be visualized with `dvc plots`) .

![](/img/dvclive-sklearn-cm.png)

```py
def log_confusion_matrix(y_true, y_pred, output_file):
```

#### Usage:

```py
from dvclive.plots import log_confusion_matrix

y_true = [1, 1, 2, 2]
y_pred = [2, 1, 1, 2]

log_confusion_matrix(y_true, y_pred, "cm.json")
```

### Description

Stores the predictions and labels in the `.json` format expected by the
confusion matrix
[template](/doc/command-reference/plots#plot-templates-data-series-only) of
`dvc plots`.

### Parameters

- `y_true` - ground truth (correct) target values

- `y_pred` - estimated targets as returned by a classifier

- `output_file` - name of the file where the JSON plot will be saved

## log_det

Generates a
[Detection error tradeoff (DET)](https://scikit-learn.org/stable/modules/model_evaluation.html#det-curve)
plot (which can be visualized with `dvc plots`) .

![](/img/dvclive-sklearn-det.png)

```py
def log_det(y_true, y_score, output_file, **kwargs):
```

#### Usage:

```py
from dvclive.plots import log_det

y_true = [1, 1, 2, 2]
y_score = [0.1, 0.4, 0.35, 0.8]

log_det(y_true, y_score, "det.json")
```

### Description

Calls
[sklearn.metrics.det_curve](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.det_curve.html)
and stores the result as a `dvc plot` in `output_file`

### Parameters

- `y_true` - See
  [sklearn.metrics.det_curve](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.det_curve.html).

- `y_score` - See
  [sklearn.metrics.det_curve](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.det_curve.html).

- `output_file` - The name of the file where the `.json` plot will be saved.

- `**kwargs` - Additional arguments that will be passed to
  [sklearn.metrics.det_curve](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.det_curve.html).

## log_precision_recall

Generates a
[precision-recall curve](https://scikit-learn.org/stable/modules/model_evaluation.html#precision-recall-f-measure-metrics)
plot (which can be visualized with `dvc plots`) .

![](/img/dvclive-sklearn-pr.png)

```py
def log_precision_recall(y_true, probas_pred, output_file, **kwargs):
```

#### Usage:

```py
from dvclive.plots import log_precision_recall

y_true = [1, 1, 2, 2]
probas_pred = [0.1, 0.4, 0.35, 0.8]

log_precision_recall(y_true, probas_pred, "prc.json")
```

### Description

Calls
[sklearn.metrics.precision_recall_curve](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.precision_recall_curve.html)
and stores the result as a `dvc plot` in `output_file`

### Parameters

- `y_true` - See
  [sklearn.metrics.precision_recall_curve](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.precision_recall_curve.html).

- `probas_pred` - See
  [sklearn.metrics.precision_recall_curve](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.precision_recall_curve.html).

- `output_file` - The name of the file where the `.json` plot will be saved.

- `**kwargs` - Additional arguments that will be passed to
  [sklearn.metrics.precision_recall_curve](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.precision_recall_curve.html).

## log_roc

Generates a
[ROC curve](https://scikit-learn.org/stable/modules/model_evaluation.html#roc-metrics)
plot (which can be visualized with `dvc plots`) .

![](/img/dvclive-sklearn-roc.png)

```py
def log_roc(y_true, y_score, output_file, **kwargs):
```

#### Usage:

```py
from dvclive.plots import log_roc

y_true = [1, 1, 2, 2]
y_score = [0.1, 0.4, 0.35, 0.8]

log_roc(y_true, y_score, "roc.json")
```

### Description

Calls
[sklearn.metrics.roc_curve](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.roc_curve.html#sklearn.metrics.roc_curve)
and stores the result as a `dvc plot` in `output_file`

### Parameters

- `y_true` - See
  [sklearn.metrics.roc_curve](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.roc_curve.html#sklearn.metrics.roc_curve).

- `y_score` - See
  [sklearn.metrics.roc_curve](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.roc_curve.html#sklearn.metrics.roc_curve).

- `output_file` - The name of the file where the `.json` plot will be saved.

- `**kwargs` - Additional arguments that will be passed to
  [sklearn.metrics.roc_curve](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.roc_curve.html#sklearn.metrics.roc_curve)
