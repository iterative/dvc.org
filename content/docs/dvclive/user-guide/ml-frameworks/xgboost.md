# XGBoost

DVCLive allows you to easily add experiment tracking capabilities to your
XGBoost projects.

## About XGBoost

[XGBoost](https://xgboost.ai/) is an optimized distributed gradient boosting
library designed to be highly efficient, flexible and portable. It implements
machine learning algorithms under the Gradient Boosting framework.

## Usage

To start using DVCLive you just need to add a few lines to your training code in
**any** XGBoost project.

You just need to add the
[`DvcLiveCallback`](https://github.com/iterative/dvclive/blob/master/dvclive/xgb.py)
to the callbacks list passed to the `xgboost.train` call:

```git
+from dvclive.xgboost import DvcLiveCallback

. . .

xgboost.train(
    param,
    dtrain,
-   num_round=5)
+   num_round=5,
+   callbacks=[DvcLiveCallback("eval_data")],
+   evals=[(dval, "eval_data")])
```

This will generate the metrics logs and summaries as described in the
[Quickstart](/docs/dvclive/user-guide/quickstart#outputs).

> 💡Without requiring additional modifications to your training code, you can
> use DVCLive alongside DVC. See
> [DVCLive with DVC](/doc/dvclive/user-guide/dvclive-with-dvc) for more info.

## Parameters

- `model_file` - The name of the file where the model will be saved at the end
  of each `step`.

Example:

```python
xgboost.train(
    param,
    dtrain,
    num_round=5,
    callbacks=[DvcLiveCallback("eval_data", model_file="model.json")],
    evals=[(dval, "eval_data")])
```
