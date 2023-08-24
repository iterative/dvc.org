# How it Works

## Directory structure

DVCLive will store the logged data under the directory (`dir`) passed to
[`Live()`](/doc/dvclive/live). If not provided, `dvclive` will be used by
default.

The contents of the directory will depend on the methods used:

| Method                                                  | Writes to                                                                            |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| [`Live.log_artifact()`](/doc/dvclive/live/log_artifact) | `{path}.dvc`<br>_or_<br>`dvclive/artifacts/{path}`<br>`dvclive/artifacts/{path}.dvc` |
| `Live.log_metric()`                                     | `dvclive/plots/metrics`                                                              |
| `Live.log_image()`                                      | `dvclive/plots/images`                                                               |
| `Live.log_param()`                                      | `dvclive/params.yaml`                                                                |
| `Live.log_plot()`                                       | `dvclive/plots/custom`                                                               |
| `Live.log_sklearn_plot()`                               | `dvclive/plots/sklearn`                                                              |
| `Live.make_dvcyaml()`                                   | `dvclive/dvc.yaml`                                                                   |
| `Live.make_report()`                                    | `dvclive/report.{md/html}`                                                           |
| `Live.make_summary()`                                   | `dvclive/metrics.json`                                                               |
| `Live.next_step()`                                      | `dvclive/dvc.yaml`<br>`dvclive/metrics.json`<br>`dvclive/report.{md/html}`           |
| `Live.end()`                                            | `dvclive/dvc.yaml`<br>`dvclive/metrics.json`<br>`dvclive/report.{md/html}`           |

### Example

To illustrate with an example, given the following code:

```python
import random
from pathlib import Path

from dvclive import Live
from PIL import Image

EPOCHS = 2

with Live(save_dvc_exp=True) as live:
    live.log_param("epochs", EPOCHS)

    for i in range(EPOCHS):
        live.log_metric("metric", i + random.random())
        live.log_metric("nested/metric", i + random.random())
        live.log_image(f"img/{live.step}.png", Image.new("RGB", (50, 50), (i, i, i)))
        Path("model.pt").write_text(str(random.random()))
        live.next_step()

    live.log_artifact("model.pt", type="model", name="mymodel")
    live.log_sklearn_plot("confusion_matrix", [0, 0, 1, 1], [0, 1, 0, 1])
    live.log_metric("summary_metric", 1.0, plot=False)
# live.end() has been called at this point
```

The resulting structure will be:

```
dvclive
├── dvc.yaml
├── metrics.json
├── params.yaml
├── plots
│   ├── images
│   │   └── img
│   │       ├── 0.png
│   │       └── 1.png
│   ├── metrics
│   │   ├── metric.tsv
│   │   └── nested
│   │       └── metric.tsv
│   └── sklearn
│       └── confusion_matrix.json
└── report.html
model.pt
model.pt.dvc
```

## Git and DVC integration

DVCLive differs from some other experiment trackers by relying on Git and DVC
for tracking instead of a central database. This provides a closer connection to
your code, but you may need to relearn a few things if coming from another
experiment tracker.

### Git integration

DVCLive relies on Git to track the [directory] it generates, so it will save
each run to the same path and overwrite the results each time. DVCLive uses Git
to manage results, code changes, and data changes
([with DVC](#track-large-artifacts-with-dvc)). Include
[`save_dvc_exp=True`](/doc/dvclive/live#parameters) to auto-track as a <abbr>DVC
experiment</abbr> so you don't need to worry about manually making Git commits
or branches for each experiment. You can recover them using `dvc exp` commands
or using Git.

### Track large artifacts with DVC

Models and data are often large and aren't easily tracked in Git.
`Live.log_artifact("model.pt")` will [cache] the `model.pt` file with DVC and
make Git ignore it. It will generate a `model.pt.dvc` metadata file, which can
be tracked in Git and becomes part of the experiment. With this metadata file,
you can [retrieve](/doc/start/data-management/data-versioning#retrieving) the
versioned artifact from the Git commit. You can also use
`Live.log_artifact("model.pt", type="model")` to add it to the [Studio Model
Registry].

Using `Live.log_image()` to log multiple images may also grow too large to track
with Git, in which case you can use
[`Live(cache_images=True)`](/doc/dvclive/live#parameters) to cache them.

## Setup to Run with DVC

DVCLive by default [generates] its own `dvc.yaml` file to configure the
experiment results, but you can create your own `dvc.yaml` file at the base of
your repository (or elsewhere) to define a [pipeline](#setup-to-run-with-dvc) to
run experiments with DVC or
[customize plots](/doc/user-guide/experiment-management/visualizing-plots#defining-plots).
Do not reuse the DVCLive `dvc.yaml` file since it gets overwritten during each
experiment run. A pipeline stage for model training might look like:

```yaml
stages:
  train:
    cmd: python train.py
    deps:
      - train.py
    outs:
      - model.pt
```

<admon type="tip">

You may have previously tracked [outputs] with `Live.log_artifact()` that
generated a `.dvc` file like `model.pt.dvc`. DVC will not allow you to also add
`model.pt` as a pipeline [output][outputs] since it is already tracked by
`model.pt.dvc`. You must `dvc remove model.pt.dvc` before you can add it to the
pipeline. You can optionally drop `Live.log_artifact()` from your code.

</admon>

Optionally add any subpaths of the DVCLive [directory] to the [outputs]. DVC
will [cache] them by default, and you can use those paths as [dependencies]
downstream in your pipeline. For example, to cache all DVCLive plots:

```diff
  stages:
    train:
      cmd: python train.py
      deps:
        - train.py
      outs:
        - model.pt
+       - dvclive/plots
```

<admon type="warn">

Do not add the entire DVCLive [directory] since DVC does not expect the DVCLive
`dvc.yaml` file to be inside the [outputs].

</admon>

[directory]: /doc/dvclive/how-it-works#directory-structure
[studio model registry]: /doc/studio/user-guide/model-registry
[cache]: /doc/start/data-management/data-versioning
[outputs]: /doc/user-guide/pipelines/defining-pipelines#outputs
[dependencies]: /doc/user-guide/pipelines/defining-pipelines#simple-dependencies
[pipelines]: /doc/start/experiments/experiment-pipelines
[generates]: /doc/dvclive/live/make_dvcyaml
