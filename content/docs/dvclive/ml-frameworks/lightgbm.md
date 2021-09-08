# LightGBM

DVCLive allows you to easily add experiment tracking capabilities to your
LightGBM projects.

## About LightGBM

[LightGBM](https://lightgbm.readthedocs.io/en/latest/) is a gradient boosting
framework that uses tree based learning algorithms.

## Usage

To start using DVCLive you just need to add a few lines to your training code in
**any** LightGBM project.

You just need to add the
[`DvcLiveCallback`](https://github.com/iterative/dvclive/blob/master/dvclive/lgbm.py)
to the callbacks list passed to the `lightgbm.train` call:

```git
+from dvclive.lgbm import DvcLiveCallback

. . .

lightgbm.train(
  param,
  train_data,
  valid_sets=[validation_data],
-   num_round=5)
+   num_round=5,
+   callbacks=[DvcLiveCallback()])
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
lightgbm.train(
    param,
    train_data,
    valid_sets=[validation_data],
    num_round=5,
    callbacks=[DvcLiveCallback(model_file="lgbm_model.txt")])
```
