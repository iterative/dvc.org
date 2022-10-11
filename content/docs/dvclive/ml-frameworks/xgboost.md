# XGBoost

DVCLive allows you to add experiment tracking capabilities to your
[XGBoost](https://xgboost.ai/) projects.

## Usage

Include the
[`DvcLiveCallback`](https://github.com/iterative/dvclive/blob/main/src/dvclive/xgb.py)
in the callbacks list passed to the `xgboost.train` call:

```python
from dvclive.xgb import DvcLiveCallback

...

xgboost.train(
    param, dtrain, num_round=5, evals=[(dval, "eval_data")]
    callbacks=[DvcLiveCallback("eval_data")],
)
```

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
