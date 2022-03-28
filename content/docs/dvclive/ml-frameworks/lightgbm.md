# LightGBM

DVCLive allows you to add experiment tracking capabilities to your
[LightGBM](https://lightgbm.readthedocs.io/en/latest/) projects.

## Usage

To start using DVCLive you just need to add a few lines to your training code in
**any** [LightGBM](https://lightgbm.readthedocs.io/en/latest/) project.

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
