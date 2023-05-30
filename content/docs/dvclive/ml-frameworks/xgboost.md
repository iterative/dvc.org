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

xgboost.train(
    param, dtrain, num_round=5, evals=[(dtrain, "train"), (dval, "val")]
    callbacks=[DVCLiveCallback()],
)
```

## Parameters

- `metric_data` - (`None` by default) - The name of the evaluation set to use
  for logging metrics. When omitted or `None`, the metrics will be logged in a
  dedicated subdirectory for all evaluation sets specified via `evals`.

  <admon type="warn">

  This parameter has been deprecated and will be removed in a future DVCLive
  release.

  </adom>

- `model_file` - (`None` by default) - The name of the file where the model will
  be saved at the end of each `step`.

- `live` - (`None` by default) - Optional [`Live`] instance. If `None`, a new
  instance will be created using `**kwargs`.

- `**kwargs` - Any additional arguments will be used to instantiate a new
  [`Live`] instance. If `live` is used, the arguments are ignored.

## Examples

- Using `live` to pass an existing [`Live`] instance.

```python
from dvclive import Live
from dvclive.xgb import DVCLiveCallback

with Live("custom_dir") as live:
    xgboost.train(
        param,
        dtrain,
        num_round=5,
        callbacks=[DVCLiveCallback(live=live)],
        evals=[(dval, "val")])

    # Log additional metrics after training
    live.log_metric("summary_metric", 1.0, plot=False)
```

- Using `**kwargs` to customize [`Live`].

```python
xgboost.train(
    param,
    dtrain,
    num_round=5,
    callbacks=[DVCLiveCallback(dir="custom_dir")],
    evals=[(dval, "val")])
```

[`live`]: /doc/dvclive/live
