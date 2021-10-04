# dvclive.log()

Generates [_metrics logs_](/doc/dvclive/get-started#metrics-logs) (usable by
`dvc plots`) by saving the given `name`: `val` pair to a `.tsv` file.

```py
 def log(name: str, val: float, step: int = None):
```

#### Usage:

```py
from dvclive import Live

dvclive = Live()

dvclive.log("loss", 0.9)
```

## Description

The first call to `dvclive.log(name, val)` will create a new file in
`{path}/{name}.tsv` including the header and first row.

For example `dvclive.log("loss", 0.9)` will create `{path}/loss.tsv`:

```
timestamp step  loss
1623671484747 0 0.9
```

Each subsequent call to `dvclive.log(name, val)` will add a new row to
`{path}/{name}.tsv`.

The created file `{path}/{name}.tsv` is usable by `dvc plots`.

💡 If `name` contains slashes (i.e. `train/loss`), the required subfolders will
be created and the file will be saved inside the last subfolder (i.e.
`{path}/train/loss.tsv`).

If `summary` is True, `dvclive.log()` DVCLive will update the
[_metrics summary_](/doc/dvclive/get-started#metrics-summary) with the latest
value logged.

The updated summary `{path}.json` is usable by `dvc metrics`.

## Parameters

- `name` - The _metrics logs_ will be saved in `{path}/{name}.tsv`.

- `val` - The value to be added in the `name` column of a new row.

## Exceptions

- `dvclive.error.InvalidMetricTypeError` - thrown if the provided `val` does not
  have a supported type

- `dvclive.error.DataAlreadyLoggedError` - thrown if the provided `name` has
  already been logged in the same `step`.
