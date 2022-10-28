# Keras

DVCLive allows you to add experiment tracking capabilities to your
[Keras](https://keras.io/) projects.

## Usage

Include the
[`DvcLiveCallback`](https://github.com/iterative/dvclive/blob/main/src/dvclive/keras.py)
int the callbacks list passed to your
[`Model`](https://keras.io/api/models/model/):

```python
from dvclive.keras import DvcLiveCallback

...

model.fit(
    train_dataset, epochs=num_epochs, validation_data=validation_dataset,
    callbacks=[DvcLiveCallback()])
```

Each metric will be logged to:

```py
{Live.plots_dir}/metrics/{split}/{metric}.tsv
```

Where:

- `{Live.plots_dir}` is defined in `Live()`.
- `{split}` can be either `train` or `eval`.
- `{metric}` is the name provided by the framework.

## Parameters

- `model_file` - (`None` by default) - The name of the file where the model will
  be saved at the end of each `step`.

- `save_weights_only` (`False` by default) - if True, then only the model's
  weights will be saved (`model.save_weights(model_file)`), else the full model
  is saved (`model.save(model_file)`)

- `**kwargs` - Any additional arguments will be passed to
  [`Live`](/docs/dvclive/api-reference/live).

## Examples

- Using `model_file` and `save_weights_only`.

```python
from dvclive.keras import DvcLiveCallback

model.fit(
    train_dataset,
    epochs=num_epochs,
    validation_data=validation_dataset,
    callbacks=[DvcLiveCallback(
        model_file="my_model_weights.h5",
        save_weights_only=True)])
```

- Using `**kwargs` to customize [`Live`](/docs/dvclive/api-reference/live).

```python
from dvclive.keras import DvcLiveCallback

model.fit(
    train_dataset,
    epochs=num_epochs,
    validation_data=validation_dataset,
    callbacks=[DvcLiveCallback(
        model_file="my_model_weights.h5",
        dir="custom_dir")])
```
