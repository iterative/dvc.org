# Scikit-learn utilities

See [detailed usage examples](/doc/dvclive/ml-frameworks/sklearn).

## sklearn.log_confusion_matrix

Generates a [_Confusion Matrix_](https://en.wikipedia.org/wiki/Confusion_matrix)
plot (usable by `dvc plots`) .

```py
def log_confusion_matrix(y_true, y_pred, output_file):
```

#### Usage:

```py
from dvclive.sklearn import log_confusion_matrix

y_true = [1, 1, 2, 2]
y_pred = [2, 1, 1, 2]

log_confusion_matrix(y_true, y_score, "cm.json")
```

### Description

Stores the predictions and labels in the format expected by the confusion matrix
[template](/doc/command-reference/plots#plot-templates-data-series-only) of
`dvc plots`.

### Parameters

- `y_true` - ground truth (correct) target values

- `y_score` - estimated targets as returned by a classifier

- `output_file` - name of the file where the JSON plot will be saved

## sklearn.log_roc

Generates a
[_ROC curve_](https://scikit-learn.org/stable/modules/model_evaluation.html#roc-metrics)
plot (usable by `dvc plots`) .

```py
def log_roc(y_true, y_score, output_file, **kwargs):
```

#### Usage:

```py
from dvclive.sklearn import log_roc

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

## sklearn.log_precision_recall

Generates a
[_precision-recall curve_](https://scikit-learn.org/stable/modules/model_evaluation.html#precision-recall-f-measure-metrics)
plot (usable by `dvc plots`) .

```py
def log_precision_recall(y_true, probas_pred, output_file, **kwargs):
```

#### Usage:

```py
from dvclive.sklearn import log_precision_recall

y_true = [1, 1, 2, 2]
y_score = [0.1, 0.4, 0.35, 0.8]

log_precision_recall(y_true, y_score, "prc.json")
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
