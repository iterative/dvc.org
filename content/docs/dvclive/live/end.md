# Live.end()

Signals that the current experiment has ended.

```py
def end():
```

## Usage

`Live.end()` gets automatically called when exiting the context manager:

```py
from dvclive import Live

with Live() as live:
    pass
# live.end() has been called at this point
```

It is also called when the training ends for each of the supported
[ML Frameworks](/dvclive/ml-frameworks)

```py
from dvclive.keras import DVCLiveCallback

...

model.fit(
    train_dataset, epochs=num_epochs, validation_data=validation_dataset,
    callbacks=[DVCLiveCallback()])
# live.end() has been called at this point
```

## Description

By default, `Live.end()` will call `Live.make_summary()`, `Live.make_dvcyaml()`,
and `Live.make_report()`.

If `save_dvc_exp=True`, it will
[save a new DVC experiment](/dvclive/how-it-works#git-integration) and write a
`dvc.yaml` file configuring what DVC will show for logged plots, metrics, and
parameters.
