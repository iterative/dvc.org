# Live()

Initializes a DVCLive logger.

```py
class Live:

    def __init__(
        self,
        path: Optional[str] = None,
        resume: bool = False,
        report: Optional[str] = "html",
        auto_open: bool = False,
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

<admon type="warn">

`Live()` will remove all existing DVCLive related files under `path` unless
`resume=True`.

</admon>

## Attributes

- `dir` - Location of the directory to store
  [outputs](/doc/dvclive/get-started#outputs).

- `summary_path` - `{dir}.json`. Location of the
  [summary](/doc/dvclive/api-reference/live/log#description).

- `html_path` - `{dir}/report.html`. Location of the
  [html report](/doc/dvclive/api-reference/live/make_report#description).

## Parameters

- `path` - Where to save DVCLive's outputs. _Default_: `None`.

  If `None` and DVC is enabled (see
  [DVCLive with DVC](/docs/dvclive/dvclive-with-dvc)), the `path` set by DVC
  will be used. If `None` and DVC is **not** enabled, `"dvclive"` will be used.

- `resume` - If `True`, DVCLive will try to read the previous `step` from the
  `path` directory and start from that point. _Default_: `False`.

  <admon type="info">

  If you are not using steps, don't set `resume=True` since DVCLive will
  preserve previous run's files and assume that `step` has been enabled.

  </admon>

- `report` - If `html`, DVCLive will call `Live.make_report()` on each step
  update. _Default_: `html`.

- `auto_open` - If `True`, on the first `Live.make_report()` call, DVCLive will
  automatically open `html_path` in a browser. _Default_: `False`.

## Methods

- `Live.log()`
- `Live.log_image()`
- `Live.log_plot()`
- `Live.make_report()`
- `Live.get_step()`
- `Live.next_step()`
- `Live.set_step()`
