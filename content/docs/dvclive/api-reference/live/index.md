# Live()

Initializes a DVCLive logger.

```py
class Live:

    def __init__(
        self,
        dir: str = "dvclive",
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

`Live()` will remove all existing DVCLive related files under `dir` unless
`resume=True`.

</admon>

## Attributes

- `dir` - Location of the directory to store [outputs](/doc/dvclive/outputs).

- `metrics_file` - `{Live.dir}/metrics.json`. Location of the
  [summary](</doc/dvclive/api-reference/live/make_summary()>).

- `params_file` - `{Live.dir}/params.yaml`. Location where `Live.log_param()`
  and `Live.log_params()` write to.

- `plots_dir` - `{Live.dir}/plots`.

- `report_file` - `{Live.dir}/report.{format}`. Location of the
  [metrics report](/doc/dvclive/api-reference/live/make_report). The `format`
  can be HTML (`.html`) or Markdown (`.md`) depending on the value of the
  `report` parameter.

## Parameters

- `dir` - Where to save DVCLive's outputs. _Default_: `dvclive`.

- `resume` - If `True`, DVCLive will try to read the previous `step` from the
  `metrics_file` and start from that point. _Default_: `False`.

- `report` - Any of `auto`, `html`, `md` or `None`. See `Live.make_report()`.

  The `auto` mode (default) will use `md` format if the `CI` env var is present
  and [matplotlib](https://matplotlib.org/) is installed, otherwise it will use
  `html`.

  If `report` is `None`, `Live.make_report()` won't generate anything.

## Methods

- `Live.get_step()`
- `Live.log()`
- `Live.log_image()`
- `Live.log_param()`
- `Live.log_params()`
- `Live.log_sklearn_plot()`
- `Live.make_report()`
- `Live.next_step()`
- `Live.set_step()`
