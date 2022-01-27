# Live()

Initializes a DVCLive logger.

```py
class Live:

    def __init__(
        self,
        path: Optional[str] = None,
        resume: bool = False,
        summary: bool = True,
    ):
```

#### Usage:

```py
from dvclive import Live

live = Live()
```

## Description

A `Live()` instance is required in order to log machine learning metrics and
other metadata.

⚠️ `Live()` will remove all existing DVCLive related files under `path` unless
`resume=True`.

## Attributes

- `dir` - Location of the [metrics history](/doc/dvclive/get-started#history)
  directory.
- `summary_path` - Location of the
  [summary](/doc/dvclive/get-started#metrics-summary).
- `html_path` - Location of the
  [html report](/doc/dvclive/dvclive-with-dvc#html-report).

## Parameters

- `path` - Where to save DVCLive's outputs. _Default_: `None`.

  If `None` and DVC is enabled (see
  [DVCLive with DVC](/docs/dvclive/dvclive-with-dvc)), the `path` set by DVC
  will be used. If `None` and DVC is **not** enabled, `"dvclive"` will be used.

- `resume` - If `True`, DVCLive will try to read the previous `step` from the
  `path` directory and start from that point. _Default_: `False`.

  ⚠️ If you are not using steps, don't set to `True` since DVCLive will preserve
  previous run's files and assume that `step` has been enabled.

- `summary` - If `True`, upon each `Live.log()` call, DVCLive will generate a
  summary (usable by `dvc metrics`). The summary will be located at
  `{path}.json`. _Default_: `True`.

  ⚠️ If you are not using steps, don't set to `False` since `Live.log()` won't
  be generating any output.

## Exceptions

- `dvclive.error.ConfigMismatchError` - thrown if the provided `path` does not
  match with the one set in DVC (see
  [DVCLive with DVC](/docs/dvclive/dvclive-with-dvc))

## Methods

- `Live.log()`
- `Live.get_step()`
- `Live.next_step()`
- `Live.set_step()`
