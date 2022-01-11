# Scikit-learn

DVCLive allows you to add experiment tracking capabilities to your
[Scikit-learn](https://scikit-learn.org/) projects.

## Usage

To start using DVCLive, add a few modifications to your training code in **any**
[Scikit-learn](https://scikit-learn.org/) project.

To illustrate with some code, let's consider the following example:

```python
from sklearn.datasets import make_classification
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

X, y = make_classification(random_state=0)
X_train, X_test, y_train, y_test = train_test_split(X, y, random_state=0)
clf = RandomForestClassifier(random_state=0)
clf.fit(X_train, y_train)

y_pred = clf.predict(X_test)
y_score = clf.predict_proba(X_test)[:, 1]
```

DVCLive provides a set of [plotting utilities](/doc/dvclive/api-reference/plots)
that allow you to generate `dvc plots` from your labels and predictions.

```python
from dvclive.sklearn import (
    log_calibration,
    log_confusion_matrix,
    log_det,
    log_precision_recall,
    log_roc,
)

cc = log_calibration(y_test, y_score, "calibration.json")
cm = log_confusion_matrix(y_test, y_pred, "cm.json")
det = log_det(y_test, y_score, "det.json")
prc = log_precision_recall(y_test, y_score, "prc.json")
roc = log_roc(y_test, y_score, "roc.json")
```

We can integrate with DVC by joining the above snippets into a single script
(e.g. named `train.py`). We also need to write a `dvc.yaml` file as follows:

```yaml
stages:
  train:
    cmd: python train.py
    plots:
      - calibration.json:
          cache: false
          x: prob_pred
          y: prob_true
          x_label: Mean Predicted Probability
          y_label: Fraction of Positives
          title: Calibration Curve
      - cm.json:
          cache: false
          template: confusion
          x: actual
          y: predicted
          title: Confusion Matrix
      - prc.json:
          cache: false
          x: recall
          y: precision
          title: Precision Recall Curve
      - det.json:
          cache: false
          x: fpr
          y: fnr
          title: DET curve
      - roc.json:
          cache: false
          x: fpr
          y: tpr
          title: ROC curve
```

And we will be able to use `dvc plots` commands:

```dvc
$ dvc plots show
```

![](/img/dvclive-sklearn.png)
