# XGBoost

DVCLive allows you to add experiment tracking capabilities to your
[XGBoost](https://xgboost.ai/) projects.

## Usage

To start using DVCLive you just need to add a few lines to your training code in
**any** [XGBoost](https://xgboost.ai/) project.

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

This will generate the outputs as described in the
[Get Started](/docs/dvclive/get-started#outputs).

<admon type="tip">

Without requiring additional modifications to your training code, you can use
DVCLive alongside DVC. See [DVCLive with DVC](/doc/dvclive/dvclive-with-dvc) for
more info.

</admon>

## Parameters

- `model_file` - (`None` by default) - The name of the file where the model will
  be saved at the end of each `step`.

- `**kwargs` - Any additional arguments will be passed to
  [`Live`](/docs/dvclive/api-reference/live).

## Examples

- Using `**kwargs` to customize [`Live`](/docs/dvclive/api-reference/live).

```python
xgboost.train(
    param,
    dtrain,
    num_round=5,
    callbacks=[
      DvcLiveCallback(
        "eval_data",
        path="custom_path")],
    evals=[(dval, "eval_data")])
```
