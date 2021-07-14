# dvclive.log()

Generates _plot metrics_ by saving the given `name`: `val` pair to a `.tsv`
file.

```py
 def log(name: str, val: Union[int, float], step: int = None) -> None:
```

#### Usage:

```py
import dvclive

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

💡 If `name` contains slashes (i.e. `train/loss`), the required subfolders will
be created and the file will be saved inside the last subfolder (i.e.
`{path}/train/loss.tsv`).

💡 If you call `dvclive.log` without calling [`dvclive.init()`](init.md) first,
`dvclive` will automatically initialize itself using either default values or
environment variables (when used alongside `DVC`).

## Parameters

- `name` - The _plot metrics_ will be saved in `{path}/{name}.tsv`.

- `val` - The value to be added in the `name` column of a new row.

- `step` (`None` by default) - The value to be added in the `step` column of a
  new row. If `None`, the value of the internal `_step` property will be used.

## Exceptions

- `dvclive.error.DvcLiveError` - If the provided `val` has not supported type.
