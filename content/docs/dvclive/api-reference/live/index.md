# Live()

Initializes a DVCLive logger.

```py
class Live:

    def __init__(
        self,
        dir: str = "dvclive",
        resume: bool = False,
        report: Optional[str] = "auto",
        save_dvc_exp: bool = False,
    ):
```

## Usage

```py
from dvclive import Live

with Live() as live:
    ...
```

## Description

A `Live()` instance is required in order to log machine learning parameters,
metrics and other metadata.

<admon type="warn">

`Live()` will remove all existing DVCLive related files under `dir` unless
`resume=True`.

</admon>

You can use `Live()` as a context manager. When exiting the context manager,
`Live.make_summary()` and `Live.make_report()` will be called.

## Properties

- `step` - See `Live.next_step()`.

- `summary` - See `Live.make_summary()`.

- `dir` - Location of the directory to store
  [outputs](/doc/dvclive/how-it-works).

- `metrics_file` - `{Live.dir}/metrics.json`.

- `params_file` - `{Live.dir}/params.yaml`.

- `plots_dir` - `{Live.dir}/plots`.

- `report_file` - `{Live.dir}/report.{format}`. The `format` can be HTML
  (`.html`) or Markdown (`.md`) depending on the value of the `report`
  parameter.

## Parameters

- `dir` - Where to save DVCLive's outputs. _Default_: `dvclive`.

- `resume` - If `True`, DVCLive will try to read the previous `step` from the
  `metrics_file` and start from that point. _Default_: `False`.

- `report` - Any of `auto`, `html`, `md` or `None`. See `Live.make_report()`.

  The `auto` mode (default) will use `md` format if the `CI` env var is present
  and [matplotlib](https://matplotlib.org/) is installed, otherwise it will use
  `html`.

  If `report` is `None`, `Live.make_report()` won't generate anything.

- `save_dvc_exp` - If `True`, DVCLive will create a DVC <abbr>experiment</abbr>
  as part of `live.end()`.

## Methods

- `Live.log_image()`
- `Live.log_metric()`
- `Live.log_param()`
- `Live.log_params()`
- `Live.log_sklearn_plot()`
- `Live.make_report()`
- `Live.make_summary()`
- `Live.next_step()`
