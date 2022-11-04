# Live()

Initializes a DVCLive logger.

```py
class Live:

    def __init__(
        self,
        path: Optional[str] = None,
        resume: bool = False,
        report: Optional[str] = "auto",
    ):
```

## Usage

```py
from dvclive import Live

live = Live()
```

## Description

A `Live()` instance is required in order to log machine learning parameters,
metrics and other metadata.

<admon type="warn">

`Live()` will remove all existing DVCLive related files under `path` unless
`resume=True`.

</admon>

## Attributes

- `dir` - Location of the directory to store
  [outputs](/doc/dvclive/get-started#outputs).

- `summary_path` - `{Live.dir}.json`. Location of the
  [summary](/doc/dvclive/api-reference/live/log#description).

- `report_path` - `{Live.dir}/report.{format}`. Location of the
  [metrics report](/doc/dvclive/api-reference/live/make_report). The `format`
  can be HTML or Markdown depending on the value of the `report` parameter.

## Parameters

- `path` - Where to save DVCLive's outputs. _Default_: `None`. If `None`,
  `"dvclive"` will be used.

- `resume` - If `True`, DVCLive will try to read the previous `step` from the
  `path` directory and start from that point. _Default_: `False`.

  <admon type="info">

  If you are not using steps, don't set `resume=True` since DVCLive will
  preserve previous run's files and assume that `step` has been enabled.

  </admon>

- `report` - If `auto`, `html`, or `md`, DVCLive will call `Live.make_report()`
  on each step update. The `auto` mode (default) will use `md` format if a `CI`
  env var is present, otherwise it will use `html`.

  If `report` is `None`, `Live.make_report()` won't be called automatically.

## Methods

- `Live.get_step()`
- `Live.log()`
- `Live.log_image()`
- `Live.log_param()`
- `Live.log_params()`
- `Live.log_plot()`
- `Live.make_report()`
- `Live.next_step()`
- `Live.set_step()`
