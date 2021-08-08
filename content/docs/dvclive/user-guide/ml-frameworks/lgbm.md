# LightGBM

The DVCLive - LightGBM integration allows you to easily add experiment tracking
capabilities to your LightGBM projects.

The integration is
[maintained in the DVCLive repository](https://github.com/iterative/dvclive/blob/master/dvclive/lgbm.py)

## About LightGBM

[LightGBM](https://lightgbm.readthedocs.io/en/latest/) is a gradient boosting framework that uses tree based learning algorithms.

## Usage

To start using the integration you just need to add a few lines to your training
code in **any** LightGBM project.

You just need to add the `DvcLiveCallback` to the callbacks list passed to the
`model.fit` call:

```git
from dvclive.lgbm import DvcLiveCallback

. . .

model.fit(
    X_train,
    y_train,
    eval_set=(X_val, y_val),
    callbacks=[DvcLiveCallback()])
```

This will generate the metrics logs and summaries as described in the
[Quickstart](/docs/dvclive/user-guide/quickstart#outputs).

## Parameters

- `model_file` - The name of the file where the model will be saved at the end of the training.

Example:

```python
model.fit(
    X_train,
    y_train,
    eval_set=(X_val, y_val),
    callbacks=[DvcLiveCallback(model_file="model")])
```