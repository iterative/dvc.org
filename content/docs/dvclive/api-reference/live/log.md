# Live.log()

```py
 def log(name: str, val: float):
```

#### Usage:

```py
from dvclive import Live

live = Live()

live.log("loss", 0.9)
```

## Description

If `summary` is True, `Live.log()` DVCLive will update the
[summary](/doc/dvclive/get-started#summary) with the latest value logged.

💡 The summary `{path}.json` is usable by `dvc metrics`.

### Step updates

The first `step` update (with `Live.next_step()` or `Live.set_step()`) will
create a new [linear plot](/doc/dvclive/get-started#linear-plots) in
`{path}/{name}.tsv`:

```
timestamp step  loss
1623671484747 0 0.9
```

Each subsequent call to `live.log(name, val)` will add a new row to
`{path}/{name}.tsv`.

💡 The linear plot `{path}/{name}.tsv` is usable by `dvc plots`.

If `name` contains slashes (e.g. `train/loss`), the required subdirectories will
be created and the file will be saved inside the last one (e.g.
`{path}/train/loss.tsv)`.

## Parameters

- `name` - Name of the metric being logged.

- `val` - The value to be logged.

## Exceptions

- `dvclive.error.InvalidMetricTypeError` - thrown if the provided `val` does not
  have a supported type.

- `dvclive.error.DataAlreadyLoggedError` - thrown if the provided `name` has
  already been logged within the same `step`.
