# How it Works

## Directory structure

DVCLive will store the logged data under the directory (`dir`) passed to
[`Live()`](/dvclive/live). If not provided, `dvclive` will be used by default.

The contents of the directory will depend on the methods used:

| Method                                              | Writes to                                                                            |
| --------------------------------------------------- | ------------------------------------------------------------------------------------ |
| [`Live.log_artifact()`](/dvclive/live/log_artifact) | `{path}.dvc`<br>_or_<br>`dvclive/artifacts/{path}`<br>`dvclive/artifacts/{path}.dvc` |
| `Live.log_metric()`                                 | `dvclive/plots/metrics`                                                              |
| `Live.monitor_system()`                             | `dvclive/plots/metrics/system`                                                       |
| `Live.log_image()`                                  | `dvclive/plots/images`                                                               |
| `Live.log_param()`                                  | `dvclive/params.yaml`                                                                |
| `Live.log_plot()`                                   | `dvclive/plots/custom`                                                               |
| `Live.log_sklearn_plot()`                           | `dvclive/plots/sklearn`                                                              |
| `Live.make_dvcyaml()`                               | `dvc.yaml`                                                                           |
| `Live.make_report()`                                | `dvclive/report.{md/html}`                                                           |
| `Live.make_summary()`                               | `dvclive/metrics.json`                                                               |
| `Live.next_step()`                                  | `dvc.yaml`<br>`dvclive/metrics.json`<br>`dvclive/report.{md/html}`                   |
| `Live.end()`                                        | `dvc.yaml`<br>`dvclive/metrics.json`<br>`dvclive/report.{md/html}`                   |

### Example

To illustrate with an example, given the following code:

```python
import random
from pathlib import Path

from dvclive import Live
from PIL import Image

EPOCHS = 2

with Live(report="notebook") as live:
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
dvc.yaml
dvclive
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
└── report.md
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
([with DVC](#track-large-artifacts-with-dvc)).

By default, DVCLive will save a <abbr>DVC experiment</abbr> so you don't need to
worry about manually making Git commits or branches for each experiment. You can
recover them using `dvc exp` commands or using Git.

### Track large artifacts with DVC

Models and data are often large and aren't easily tracked in Git.
`Live.log_artifact("model.pt")` will [cache] the `model.pt` file with DVC and
make Git ignore it. It will generate a `model.pt.dvc` metadata file, which can
be tracked in Git and becomes part of the experiment. With this metadata file,
you can [retrieve](/start/data-management/data-versioning#retrieving) the
versioned artifact from the Git commit. You can also use
`Live.log_artifact("model.pt", type="model")` to add it to the <abbr>model
registry</abbr>.

Using `Live.log_image()` to log multiple images may also grow too large to track
with Git, in which case you can use
[`Live(cache_images=True)`](/dvclive/live#parameters) to cache them.

## Setup to Run with DVC

Running experiments with DVC provides a structured and reproducible
<abbr>pipeline</abbr> for end-to-end model training. To run experiments with
DVC, define a pipeline using `dvc stage add` or by editing `dvc.yaml`. A
pipeline stage for model training might look like:

<toggle>
<tab title="CLI">

```cli
$ dvc stage add --name train \
  --deps data_dir --deps src/train.py \
  --outs model.pt --outs dvclive \
  python train.py
```

</tab>
<tab title="YAML">

```yaml
stages:
  train:
    cmd: python train.py
    deps:
      - train.py
      - data_dir
    outs:
      - model.pt
      - dvclive
```

</tab>
</toggle>

Adding the DVCLive [directory] to the [outputs] will add it to the DVC [cache]
(if you previously tracked the directory in Git, you must first stop tracking it
there). If you want to keep it in Git, you can disable the cache. You can also
choose to cache only some paths, like keeping lightweight metrics in Git but
adding more heavyweight plots data to the cache:

<toggle>
<tab title="CLI">

```cli
$ dvc stage add --name train \
  --deps data_dir --deps src/train.py \
  --outs model.pt --outs-no-cache dvclive/metrics.json \
  --outs dvclive/plots \
  python train.py
```

</tab>
<tab title="YAML">

```yaml
stages:
  train:
    cmd: python train.py
    deps:
      - train.py
      - data_dir
    outs:
      - model.pt
      - dvclive/metrics.json:
          cache: false
      - dvclive/plots
```

</tab>
</toggle>

Now you can run an experiment using `dvc exp run`. Instead of DVCLive handling
caching and saving experiments, DVC will do this at the end of each run. See
examples of how to [add DVCLive to a pipeline] or [add a pipeline to DVCLive
code], including how to parametrize your code to iterate on experiments.

<admon type="tip">

You may have previously tracked [outputs] with `Live.log_artifact()` that
generated a `.dvc` file like `model.pt.dvc`. DVC will not allow you to also add
`model.pt` as a pipeline [output][outputs] since it is already tracked by
`model.pt.dvc`. You must `dvc remove model.pt.dvc` before you can add it to the
pipeline. You can optionally drop `Live.log_artifact()` from your code.

</admon>

[directory]: /dvclive/how-it-works#directory-structure
[cache]: /start/data-management/data-versioning
[outputs]: /user-guide/pipelines/defining-pipelines#outputs
[dependencies]: /user-guide/pipelines/defining-pipelines#simple-dependencies
[pipeline]: /start/experiments/experiment-pipelines
[generates]: /dvclive/live/make_dvcyaml
[add DVCLive to a pipeline]: /start/data-management/metrics-parameters-plots
[add a pipeline to DVCLive code]: /start/experiments/experiment-pipelines
