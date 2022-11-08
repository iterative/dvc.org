# Keras

DVCLive allows you to add experiment tracking capabilities to your
[Keras](https://keras.io/) projects.

## Usage

Include the
[`DVCLiveCallback`](https://github.com/iterative/dvclive/blob/main/src/dvclive/keras.py)
in the callbacks list passed to your
[`Model`](https://keras.io/api/models/model/):

```python
from dvclive.keras import DVCLiveCallback

...

model.fit(
    train_dataset, epochs=num_epochs, validation_data=validation_dataset,
    callbacks=[DVCLiveCallback()])
```

Each metric will be logged to:

```py
{Live.plots_dir}/metrics/{split}/{metric}.tsv
```

Where:

- `{Live.plots_dir}` is defined in [`Live`].
- `{split}` can be either `train` or `eval`.
- `{metric}` is the name provided by the framework.

## Parameters

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
from dvclive.keras import DVCLiveCallback

live = Live("custom_dir")

model.fit(
    train_dataset,
    epochs=num_epochs,
    validation_data=validation_dataset,
    callbacks=[DVCLiveCallback(live=live)])

# Log additional metrics after training
live.summary["additional_metric"] = 1.0
live.make_summary()
```

- Using `model_file` and `save_weights_only`.

```python
model.fit(
    train_dataset,
    epochs=num_epochs,
    validation_data=validation_dataset,
    callbacks=[DVCLiveCallback(
        model_file="my_model_weights.h5",
        save_weights_only=True)])
```

- Using `**kwargs` to customize the new [`Live`] instance.

```python
model.fit(
    train_dataset,
    epochs=num_epochs,
    validation_data=validation_dataset,
    callbacks=[DVCLiveCallback(
        model_file="my_model_weights.h5",
        dir="custom_dir")])
```

[`live`]: /docs/dvclive/api-reference/live
