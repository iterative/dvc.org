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

model = xgb.XGBClassifier(
    n_estimators=100,
    early_stopping_rounds=5,
    eval_metric=["merror", "mlogloss"],
    callbacks=[DVCLiveCallback()]
)

model.fit(
    X_train,
    y_train,
    eval_set=[(X_test, y_test)]
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
    model = xgb.XGBClassifier(
        n_estimators=100,
        early_stopping_rounds=5,
        eval_metric=["merror", "mlogloss"],
        callbacks=[DVCLiveCallback(live)]
    )

    model.fit(
        X_train,
        y_train,
        eval_set=[(X_test, y_test)]
    )

    # Log additional metrics after training
    live.log_metric("summary_metric", 1.0, plot=False)
```

- Using `**kwargs` to customize [`Live`].

```python
model = xgb.XGBClassifier(
    ...
    callbacks=[DVCLiveCallback(dir="custom_dir")]
)
```

[`live`]: /doc/dvclive/live
