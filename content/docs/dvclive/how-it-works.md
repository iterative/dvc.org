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

### Git integration

Unlike other experiment trackers, DVCLive relies on Git to track the [directory]
it generates. This enables DVCLive to work with Git instead of separate from it.
With this approach, DVCLive can use Git to automatically manage experiment
results, code changes, and data changes
([with DVC](#track-large-artifacts-with-dvc)), so you don't need to worry about
manually making Git commits or branches for each experiment.

Before using DVCLive, it helps to get accustomed to some differences with how
DVCLive works compared to other experiments trackers. Set
[`save_dvc_exp=True`](/doc/dvclive/live#parameters), which tells DVCLive to use
Git to auto-track the results as a <abbr>DVC experiment</abbr>. If you do not
set `save_dvc_exp=True`, you will be responsible for committing the results of
each experiment to Git, or else they may be lost since DVCLive will overwrite
the files it generates on each run. You can recover previous experiments using
`dvc exp` commands or using Git.

<admon type="tip">

`save_dvc_exp=True` is ignored when [running with DVC](#run-with-dvc) since
`dvc exp run` takes care of auto-tracking the results as a <abbr>DVC
experiment</abbr>.

</admon>

### Track large artifacts with DVC

Models and data are often large and aren't easily tracked in Git.
`Live.log_artifact("model.pt")` will [cache] the `model.pt` file with DVC and
make Git ignore it. It will generate a `model.pt.dvc` metadata file, which can
be tracked in Git and becomes part of the experiment. With this metadata file,
you can [retrieve](/doc/start/data-management/data-versioning#retrieving) the
versioned artifact from the Git commit. You can also use
`Live.log_artifact("model.pt", type="model")` to add it to the [Studio Model
Registry].

<admon type="tip">

When [running with DVC](#run-with-dvc) in a <abbr>pipeline</abbr>, [outputs] are
tracked in `dvc.lock` files. `Live.log_artifact()` will fail to add them since
they are already tracked, but they are functionally the same as if you had added
them with `Live.log_artifact()`.

</admon>

### Run with DVC

Experimenting in Python interactively (like in notebooks) is great for
exploration, but eventually you may need a more structured way to run
reproducible experiments (for example, running a parallelized hyperparameter
search). By configuring DVC [pipelines], you can
[run experiments](/doc/user-guide/experiment-management/running-experiments)
with `dvc exp run`. This will track the inputs and outputs of your code, and
also enable features like queuing, parameter tuning, and grid searches.

You can configure a pipeline stage in your own `dvc.yaml` file at the base of
the repository (not the `dvc.yaml` file inside the DVCLive [directory], since
that gets overwritten on each experiment run):

```yaml
stages:
  dvclive:
    cmd: <python my_code_file.py my_args>
    deps:
      - <my_code_file.py>
    outs:
      - model.pt
```

Adding any subpaths of the DVCLive [directory] to the [outputs] is optional, but
do not add the entire directory since DVC does not expect the DVCLive `dvc.yaml`
file to be inside the [outputs]. DVC will [cache] any paths you add as [outputs]
by default, and you can use those paths as [dependencies] downstream in your
pipeline.

<admon type="tip">

If you already have a `.dvc` file like `model.pt.dvc`, DVC will not allow you to
also add `model.pt` as a pipeline [output][outputs] since it is already tracked
by `model.pt.dvc`. You must `dvc remove model.pt.dvc` before you can add it to
the pipeline.

</admon>

### Customize with DVC

DVCLive by default [generates] its own `dvc.yaml` file to configure the
experiment results, but you can create your own `dvc.yaml` file to customize
your project. For example, to define a [pipeline](#run-with-dvc) or
[customize plots](/doc/user-guide/experiment-management/visualizing-plots#defining-plots).
Do not reuse the DVCLive `dvc.yaml` file since it gets overwritten during each
experiment run. Instead, write customizations to a new `dvc.yaml` file at the
base of your repository or elsewhere outside the DVCLive directory.

[directory]: /doc/dvclive/how-it-works#directory-structure
[studio model registry]: /doc/studio/user-guide/model-registry
[cache]: /doc/start/data-management/data-versioning
[outputs]: /doc/user-guide/pipelines/defining-pipelines#outputs
[dependencies]: /doc/user-guide/pipelines/defining-pipelines#simple-dependencies
[pipelines]: /doc/start/experiments/experiment-pipelines
[generates]: /doc/dvclive/live/make_dvcyaml
