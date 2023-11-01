# Live()

Initializes a DVCLive logger.

```py
class Live:

    def __init__(
        self,
        dir: str = "dvclive",
        resume: bool = False,
        report: Optional[str] = None,
        save_dvc_exp: bool = True,
        dvcyaml: Union[str, bool] = "dvc.yaml",
        exp_message: Optional[str] = None,
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
`Live.end()` will be called.

## Properties

- `step` - See `Live.next_step()`.

- `summary` - See `Live.make_summary()`.

- `dir` - Location of the directory to store
  [outputs](/doc/dvclive/how-it-works).

- `dvc_file` - Path for `dvc.yaml` file.

- `metrics_file` - `{Live.dir}/metrics.json`.

- `params_file` - `{Live.dir}/params.yaml`.

- `plots_dir` - `{Live.dir}/plots`.

- `report_file` - `{Live.dir}/report.{format}`. The `format` can be HTML
  (`.html`) or Markdown (`.md`) depending on the value of the `report`
  parameter.

## Parameters

- `dir` - Where to save DVCLive's outputs. Defaults to `dvclive`.

- `resume` - If `True`, DVCLive will try to read the previous `step` from the
  `metrics_file` and start from that point. Defaults to `False`.

- `report` - Any of `html`, `notebook`, `md` or `None`. See
  `Live.make_report()`. Defaults to `None`.

- `save_dvc_exp` - If `True` , DVCLive will create a new
  [DVC experiment](/doc/dvclive/how-it-works#git-integration) as part of
  `Live.end()`. Defaults to `True`.

  If you are using DVCLive inside a <abbr>DVC Pipeline</abbr> and running with
  `dvc exp run`, the option will be ignored.

- `dvcyaml` - Where to write `dvc.yaml` file, which adds
  [DVC configuration](/doc/user-guide/project-structure/dvcyaml-files) for
  metrics, plots, and parameters as part of `Live.next_step()` and `Live.end()`.
  If `None`, no `dvc.yaml` file is written. Defaults to `dvc.yaml`. See
  `Live.make_dvcyaml()`.

  If a string like `subdir/dvc.yaml`, DVCLive will write the configuration to
  that path (file must be named `dvc.yaml`).

  If `False`, DVCLive will not write to `dvc.yaml` (useful if you are tracking
  DVCLive metrics, plots, and parameters independently and want to avoid
  duplication).

- `cache_images` - If `True`, DVCLive will <abbr>cache</abbr> any images logged
  with `Live.log_image()` as part of `Live.end()`. Defaults to `False`.

  If running a <abbr>DVC pipeline</abbr>, `cache_images` will be ignored, and
  you should instead cache images as pipeline <abbr>outputs</abbr>.

- `exp_message` - If not `None`, and `save_dvc_exp` is `True`, the provided
  string will be passed to
  [`dvc exp save --message`](/doc/command-reference/exp/save#--message).

  If DVCLive is used inside `dvc exp run`, the option will be ignored, use
  [`dvc exp run --message`](/doc/command-reference/exp/run#--message) instead.

## Methods

- `Live.log_artifact()`
- `Live.log_image()`
- `Live.log_metric()`
- `Live.log_param()`
- `Live.log_params()`
- `Live.log_plot()`
- `Live.log_sklearn_plot()`
- `Live.make_dvcyaml()`
- `Live.make_report()`
- `Live.make_summary()`
- `Live.next_step()`
