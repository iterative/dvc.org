# Keras

DVCLive allows you to add experiment tracking capabilities to your
[Keras](https://keras.io/) projects.

## Usage

Include the
[`DVCLiveCallback`](https://github.com/treeverse/dvclive/blob/main/src/dvclive/keras.py)
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

- `live` - (`None` by default) - Optional [`Live`] instance. If `None`, a new
  instance will be created using `**kwargs`.

- `**kwargs` - Any additional arguments will be used to instantiate a new
  [`Live`] instance. If `live` is used, the arguments are ignored.

## Examples

- Using `live` to pass an existing [`Live`] instance.

```python
from dvclive import Live
from dvclive.keras import DVCLiveCallback

with Live("custom_dir") as live:
    model.fit(
        train_dataset,
        epochs=num_epochs,
        validation_data=validation_dataset,
        callbacks=[DVCLiveCallback(live=live)])

    model.load_weights(os.path.join("model", "best_model"))

    # Log additional data after training
    test_loss, test_acc = model.evaluate(test_dataset)
    live.log_metric("test_loss", test_loss, plot=False)
    live.log_metric("test_acc", test_acc, plot=False)
```

- Using `**kwargs` to customize the new [`Live`] instance.

```python
model.fit(
    train_dataset,
    epochs=num_epochs,
    validation_data=validation_dataset,
    callbacks=[DVCLiveCallback(dir="custom_dir")])
```

[`live`]: /dvclive/live
