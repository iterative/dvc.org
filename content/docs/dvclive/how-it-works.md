# How it Works

## Directory structure

DVCLive will store the logged data under the directory (`dir`) passed to
[`Live()`](/doc/dvclive/live). If not provided, `dvclive` will be used by
default.

The contents of the directory will depend on the methods used:

| Method                                                      | Writes to                                                                  |
| ----------------------------------------------------------- | -------------------------------------------------------------------------- |
| [`Live.log_artifact(path)`](/doc/dvclive/live/log_artifact) | `{path}.dvc`                                                               |
| `Live.log_metric()`                                         | `dvclive/plots/metrics`                                                    |
| `Live.log_image()`                                          | `dvclive/plots/images`                                                     |
| `Live.log_param()`                                          | `dvclive/params.yaml`                                                      |
| `Live.log_plot()`                                           | `dvclive/plots/custom`                                                     |
| `Live.log_sklearn_plot()`                                   | `dvclive/plots/sklearn`                                                    |
| `Live.make_dvcyaml()`                                       | `dvclive/dvc.yaml`                                                         |
| `Live.make_report()`                                        | `dvclive/report.{md/html}`                                                 |
| `Live.make_summary()`                                       | `dvclive/metrics.json`                                                     |
| `Live.next_step()`                                          | `dvclive/dvc.yaml`<br>`dvclive/metrics.json`<br>`dvclive/report.{md/html}` |
| `Live.end()`                                                | `dvclive/dvc.yaml`<br>`dvclive/metrics.json`<br>`dvclive/report.{md/html}` |

### Example

To illustrate with an example, given the following code:

```python
import random

from dvclive import Live
from PIL import Image

EPOCHS = 2

with Live(save_dvc_exp=True) as live:
    live.log_param("epochs", EPOCHS)

    for i in range(EPOCHS):
        live.log_metric("metric", i + random.random())
        live.log_metric("nested/metric", i + random.random())
        live.log_image("img.png", Image.new("RGB", (50, 50), (i, i, i)))
        Path("model.pt").write_text(str(random.random()))
        live.next_step()

    live.log_artifact("model.pt")
    live.log_sklearn_plot("confusion_matrix", [0, 0, 1, 1], [0, 1, 0, 1])
    live.summary["additional_metric"] = 1.0
# live.end() has been called at this point
```

The resulting structure will be:

```
dvclive
├── dvc.yaml
├── metrics.json
├── params.yaml
├── plots
│   ├── images
│   │   └── img.png
│   ├── metrics
│   │   ├── metric.tsv
│   │   └── nested
│   │       └── metric.tsv
│   └── sklearn
│       └── confusion_matrix.json
└── report.html
model.pt
model.pt.dvc
```

## Track the results

DVCLive expects each run to be tracked by Git, so it will save each run to the
same path and overwrite the results each time. Include
[`save_dvc_exp=True`](/doc/dvclive/api-reference/live#parameters) to auto-track
as a <abbr>DVC experiment</abbr>. DVC experiments are Git commits that DVC can
find but that don't clutter your Git history or create extra branches.

### Track large artifacts with DVC

Models and data are often large and aren't easily tracked in Git.
`Live.log_artifact("model.pt", type="model")` will
[cache](/doc/start/data-management/data-versioning) the `model.pt` file with DVC
and make Git ignore it. It will generate a `model.pt.dvc` metadata file, which
can be tracked in Git and becomes part of the experiment. With this metadata
file, you can [retrieve](/doc/start/data-management/data-versioning#retrieving)
the versioned artifact from the Git commit.

If `Live` was initialized with `dvcyaml=True` (which is the default), this will
add an [artifact](/doc/user-guide/project-structure/dvcyaml-files#artifacts) to
the corresponding `dvc.yaml`. Passing `type="model"` will mark it as a `model`
for DVC and will also make [Studio Model Registry](/doc/studio) support it
(coming soon!).

### Run with DVC

Experimenting in Python interactively (like in notebooks) is great for
exploration, but eventually you may need a more structured way to run
reproducible experiments (for example, running a parallelized hyperparameter
search). By configuring DVC <abbr>pipelines</abbr>, you can
[run experiments](/doc/user-guide/experiment-management/running-experiments)
with `dvc exp run`.

You can configure a pipeline stage in `dvc.yaml` like:

```yaml
stages:
  dvclive:
    cmd: <python my_code_file.py my_args>
    deps:
      - <my_code_file.py>
    outs:
      - model.pt
```

Add this pipeline stage into `dvc.yaml`, modifying it to fit your project. Then,
run it with `dvc exp run`. This will track the inputs and outputs of your code,
and also enable features like queuing, parameter tuning, and grid searches.

<admon type="warn">

Add to a `dvc.yaml` file at the base of your repository. Do not use
`dvclive/dvc.yaml` since DVCLive will overwrite it during each run.

</admon>

<admon type="tip">

If you already have a `.dvc` file like `model.pt.dvc`, DVC will not allow you to
also track `model.pt` in `dvc.yaml`. You must `dvc remove model.pt.dvc` before
you can add it to `dvc.yaml`.

</admon>
