# Live()

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

Initializes a DVCLive logger.

⚠️ `Live()` will remove all existing DVCLive related files under `path` unless
`resume=True`.

## Attributes

- `dir` - Location of the [linear plots](/doc/dvclive/get-started#linear-plots)
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

  ⚠️ Don't change the default value unless you are going to update the `step`
  value during training.

- `summary` - If `True`, upon each `Live.log()` call, DVCLive will generate a
  summary (usable by `dvc metrics`). The summary will be located at
  `{path}.json`. _Default_: `True`.

  ⚠️ Don't change the default value unless you are going to update the `step`
  value during training.

## Exceptions

- `dvclive.error.ConfigMismatchError` - thrown if the provided `path` does not
  match with the one set in DVC (see
  [DVCLive with DVC](/docs/dvclive/dvclive-with-dvc))

## Methods

- `Live.log()`
- `Live.get_step()`
- `Live.next_step()`
- `Live.set_step()`
