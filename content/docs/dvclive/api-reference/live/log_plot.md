# Live.log_plot()

```py
def log_plot(self, name: str, labels, predictions, **kwargs):
```

#### Usage:

```py
from dvclive import Live

live = Live()

y_true = [0, 0, 1, 1]
y_pred = [1, 0, 1, 0]
y_score = [0.1, 0.4, 0.35, 0.8]]
live.log_plot("roc", y_true, y_score)
live.log_plot("confusion_matrix", y_true, y_pred)
```

## Description

Generates a
[scikit learn plot](https://scikit-learn.org/stable/visualizations.html) and
saves the result in `{path}/{name}.json`.

### Step updates

The first `step` update (with `Live.next_step()` or `Live.set_step()`) will move
the saved file from `{path}/{name}` to `{path}/{step}/{name}`.

Each subsequent call to `live.log_plot(name, val)` will save the image under the
folder `{path}/{step}/{name}` corresponding to the current `step`.

## Supported plots

`name` must be one of the supported plots:

### `calibration`

```py
y_true = [0, 0, 1, 1]
y_score = [0.1, 0.4, 0.35, 0.8]]
live.log_plot("calibration", y_true, y_score)
```

- `confusion_matrix` -
- `

💡 The generated `{path}/{name}.json` can be visualized with `dvc plots`.

## Parameters

- `name` - Name of the output file.

- `val` - The image to be saved.

## Exceptions

- `dvclive.error.InvalidDataTypeError` - thrown if the provided `val` does not
  have a supported type.

- `dvclive.error.DataAlreadyLoggedError` - thrown if the provided `name` has
  already been logged whithin the same `step`.
