# Optuna

DVCLive allows you to add experiment tracking capabilities to your
[Optuna](https://optuna.org/) projects.

## Usage

Include the
[`DVCLiveCallback`](https://github.com/treeverse/dvclive/blob/main/src/dvclive/optuna.py)
in the callbacks list passed to [`study.optimize`]():

```python
from dvclive.optuna import DVCLiveCallback

...

study.optimize(
    objective, n_trials=7, callbacks=[DVCLiveCallback()])
```

If you are using an ML Framework inside the `objective` function, you can
instead use the corresponding DVCLive integration for the ML Framework. See the
[example bellow](#optuna-with-ml-framework).

Each `trial` will create a DVC <abbr>Experiment</abbr>, tracking the associated
metrics and parameters.

## Parameters

- `metric_name` - (`metric` by default) - Name assigned to the metric to be
  optimized.

- `**kwargs` - Any additional arguments will be used to instantiate a new
  [`Live`] instance.

## Examples

### Optuna callback

```python
import optuna

from dvclive.optuna import DVCLiveCallback

def objective(trial):
    x = trial.suggest_float("x", -10, 10)
    return (x - 2) ** 2

study = optuna.create_study()

study.optimize(
    objective, n_trials=7, callbacks=[DVCLiveCallback()])
```

### Optuna with ML Framework

In the
[Optuna and Keras example](https://github.com/optuna/optuna-examples/blob/main/keras/keras_simple.py)
you can use the [`dvclive.keras`](/dvclive/ml-frameworks/keras) callback:

```python
from dvclive import Live
from dvclive.keras import DVCLiveCallback

...

with Live() as live:
    live.log_params(trial.params)
    model.fit(
        x_train,
        y_train,
        validation_data=(x_valid, y_valid),
        shuffle=True,
        batch_size=BATCHSIZE,
        epochs=EPOCHS,
        verbose=False,
        callbacks=[DVCLiveCallback(live=live)]
    )
```

[`live`]: /dvclive/live
