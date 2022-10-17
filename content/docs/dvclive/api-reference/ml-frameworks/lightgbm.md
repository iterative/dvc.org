# LightGBM

DVCLive allows you to add experiment tracking capabilities to your
[LightGBM](https://lightgbm.readthedocs.io/en/latest/) projects.

## Usage

Include the
[`DvcLiveCallback`](https://github.com/iterative/dvclive/blob/main/src/dvclive/lgbm.py)
in the callbacks list passed to the `lightgbm.train` call:

```python
from dvclive.lgbm import DvcLiveCallback

...

lightgbm.train(
  param, train_data, valid_sets=[validation_data], num_round=5,
  callbacks=[DvcLiveCallback()])
```

## Parameters

- `model_file` - (`None` by default) - The name of the file where the model will
  be saved at the end of each `step`.

- `**kwargs` - Any additional arguments will be passed to
  [`Live`](/docs/dvclive/api-reference/live).

## Examples

- Using `model_file`.

```python
lightgbm.train(
    param,
    train_data,
    valid_sets=[validation_data],
    num_round=5,
    callbacks=[DvcLiveCallback(model_file="lgbm_model.txt")])
```

- Using `**kwargs` to customize [`Live`](/docs/dvclive/api-reference/live).

```python
lightgbm.train(
    param,
    train_data,
    valid_sets=[validation_data],
    num_round=5,
    callbacks=[DvcLiveCallback(
      model_file="lgbm_model.txt",
      path="custom_path")])
```
