# Live()

Initializes a DVCLive logger.

```py
class Live:

    def __init__(
        self,
        dir: str = "dvclive",
        resume: bool = False,
        report: Literal["md", "notebook", "html", None] = None,
        save_dvc_exp: bool = True,
        dvcyaml: Optional[str] = "dvc.yaml",
        cache_images: bool = False,
        exp_name: Optional[str] = None,
        exp_message: Optional[str] = None,
        monitor_system: bool = False,
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

- `step` - see `Live.next_step()`.

- `summary` - see `Live.make_summary()`.

- `dir` - location of the directory to store [outputs](/dvclivehow-it-works).

- `dvc_file` - path for `dvc.yaml` file.

- `metrics_file` - `{Live.dir}/metrics.json`.

- `params_file` - `{Live.dir}/params.yaml`.

- `plots_dir` - `{Live.dir}/plots`.

- `report_file` - `{Live.dir}/report.{format}`. The `format` can be HTML
  (`.html`) or Markdown (`.md`) depending on the value of the `report`
  parameter.

## Parameters

- `dir` - where to save DVCLive's outputs. Defaults to `dvclive`.

- `resume` - if `True`, DVCLive will try to read the previous `step` from the
  `metrics_file` and start from that point. Defaults to `False`.

- `report` - any of `html`, `notebook`, `md` or `None`. See
  `Live.make_report()`. Defaults to `None`.

- `save_dvc_exp` - if `True`, DVCLive will create a new
  [DVC experiment](/dvclivehow-it-works#git-integration) as part of
  `Live.end()`. Defaults to `True`.

  If you are using DVCLive inside a <abbr>DVC Pipeline</abbr> and running with
  `dvc exp run`, the option will be ignored.

- `dvcyaml` - where to write `dvc.yaml` file, which adds
  [DVC configuration](/user-guide/project-structure/dvcyaml-files) for metrics,
  plots, and parameters as part of `Live.next_step()` and `Live.end()`. If
  `None`, no `dvc.yaml` file is written. Defaults to `dvc.yaml`. See
  `Live.make_dvcyaml()`.

  If a string like `subdir/dvc.yaml`, DVCLive will write the configuration to
  that path (file must be named `dvc.yaml`).

  If `False`, DVCLive will not write to `dvc.yaml` (useful if you are tracking
  DVCLive metrics, plots, and parameters independently and want to avoid
  duplication).

- `cache_images` - if `True`, DVCLive will <abbr>cache</abbr> any images logged
  with `Live.log_image()` as part of `Live.end()`. Defaults to `False`.

  If running a <abbr>DVC pipeline</abbr>, `cache_images` will be ignored, and
  you should instead cache images as pipeline <abbr>outputs</abbr>.

- `exp_name` - if not `None`, and `save_dvc_exp` is `True`, the provided string
  will be passed to [`dvc exp save --name`](/command-reference/exp/save#--name).

  If DVCLive is used inside `dvc exp run`, the option will be ignored, use
  [`dvc exp run --name`](/command-reference/exp/run#--name) instead.

- `exp_message` - if not `None`, and `save_dvc_exp` is `True`, the provided
  string will be passed to
  [`dvc exp save --message`](/command-reference/exp/save#--message).

  If DVCLive is used inside `dvc exp run`, the option will be ignored, use
  [`dvc exp run --message`](/command-reference/exp/run#--message) instead.

- `monitor_system` - if `True`, DVCLive will log
  [system metrics](/dvclivelive/monitor_system), including GPU, CPU, RAM, and
  disk usage. Defaults to `False`.

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
- `Live.monitor_system()`
