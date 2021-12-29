# Scikit-learn

DVCLive allows you to easily add experiment tracking capabilities to your
Scikit-learn projects.

## About Scikit-learn

[Scikit-learn](https://scikit-learn.org/) is an open source machine learning
library that supports supervised and unsupervised learning. It also provides
various tools for model fitting, data preprocessing, model selection, model
evaluation, and many other utilities.

## Usage

To start using DVCLive you just need to add few modifications to your training
code in **any** Scikit-learn project.

To ilustrate with some code, given the following example:

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

DVCLive provides a set of
[Scikit-learn utilities](/doc/dvclive/api-reference/sklearn) that allow you to
generate `dvc plots` from the labels and predictions.

```python
...

from dvclive.sklearn import (
    log_confusion_matrix,
    log_precision_recall,
    log_roc,
)

roc = log_roc(y_test, y_score, "roc.json")
prc = log_precision_recall(y_test, y_score, "prc.json")
cm = log_confusion_matrix(y_test, y_pred, "cm.json")

```

Joining the above snippets into a single script named `train.py`, we can
integrate with DVC without further modifications to the script.

We just need to define a `dvc.yaml` stage as follows:

```yaml
stages:
  train:
    cmd: python train.py
    plots:
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

![](/img/sklearn-plots.png)
