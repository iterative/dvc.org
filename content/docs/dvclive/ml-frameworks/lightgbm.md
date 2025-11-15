# LightGBM

DVCLive allows you to add experiment tracking capabilities to your
[LightGBM](https://lightgbm.readthedocs.io/en/latest/) projects.

## Usage

Include the
[`DVCLiveCallback`](https://github.com/iterative/dvclive/blob/main/src/dvclive/lgbm.py)
in the callbacks list passed to the `lightgbm.train` call:

```python
from dvclive.lgbm import DVCLiveCallback

...

lightgbm.train(
  param, train_data, valid_sets=[validation_data], num_round=5,
  callbacks=[DVCLiveCallback()])
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
from dvclive.lgbm import DVCLiveCallback

with Live("custom_dir") as live:
    lightgbm.train(
        param,
        train_data,
        valid_sets=[validation_data],
        num_round=5,
        callbacks=[DVCLiveCallback(live=live)])

    # Log additional metrics after training
    live.log_metric("summary_metric", 1.0, plot=False)
```

- Using `**kwargs` to customize the new [`Live`] instance.

```python
lightgbm.train(
    param,
    train_data,
    valid_sets=[validation_data],
    num_round=5,
    callbacks=[DVCLiveCallback(dir="custom_dir")])
```

[`live`]: /dvclive/live
