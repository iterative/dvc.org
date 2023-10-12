# XGBoost

DVCLive allows you to add experiment tracking capabilities to your
[XGBoost](https://xgboost.ai/) projects.

## Usage

Include the
[`DVCLiveCallback`](https://github.com/iterative/dvclive/blob/main/src/dvclive/xgb.py)
in the callbacks list passed to the `xgboost.train` call:

```python
from dvclive.xgb import DVCLiveCallback

...

params = {
  "eval_metric": "rmse"
}

xgboost.train(
    params,
    dtrain,
    num_round=5,
    callbacks=[DVCLiveCallback("eval_data")],
    evals=[(dval, "eval_data")],
)
```

## Parameters

- `live` - (`None` by default) - Optional [`Live`] instance. If `None`, a new
  instance will be created using `**kwargs`.

- `**kwargs` - Any additional arguments will be used to instantiate a new
  [`Live`] instance. If `live` is used, the arguments are ignored.

## Examples

- Using `live` to pass an existing [`Live`] instance.

```python
from dvclive import Live
from dvclive.xgb import DVCLiveCallback

...

with Live("custom_dir") as live:
    xgboost.train(
        params,
        dtrain,
        num_round=5,
        callbacks=[DVCLiveCallback("eval_data", live=live)],
        evals=[(dval, "eval_data")])

    # Log additional metrics after training
    live.log_metric("summary_metric", 1.0, plot=False)
```

- Using `**kwargs` to customize [`Live`].

```python
xgboost.train(
    params,
    dtrain,
    num_round=5,
    callbacks=[
      DVCLiveCallback(
        "eval_data",
        dir="custom_dir")],
    evals=[(dval, "eval_data")])
```

[`live`]: /doc/dvclive/live
