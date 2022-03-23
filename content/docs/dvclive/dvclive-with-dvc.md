# DVCLive with DVC

Even though DVCLive does not require DVC, they can integrate in several useful
ways:

- The [outputs](#outputs) DVCLive produces are recognized by `dvc exp`,
  `dvc metrics` and `dvc plots`. Those same outputs can be visualized in
  [Iterative Studio](#iterative-studio).

- You can monitor model performance in realtime with the
  [HTML report](#html-report) that DVCLive generates when used alongside DVC.

- DVCLive is also capable of generating [checkpoint](#checkpoints) signal files
  used by DVC <abbr>experiments<abbr>.

## Setup

We will refer to a training script (`train.py`) already using `dvclive`:

```python
# train.py

from dvclive import Live

live = Live()

for epoch in range(NUM_EPOCHS):
    train_model(...)
    metrics = evaluate_model(...)

    for metric_name, value in metrics.items():
        live.log(metric_name, value)

    live.next_step()
```

Let's use `dvc stage add` to create a stage to wrap this code (don't forget to
`dvc init` first):

```dvc
$ dvc stage add -n train --live training_metrics
                -d train.py python train.py
```

`dvc.yaml` will contain a new `train` stage with the DVCLive configuration (in
the `live` field):

```yaml
stages:
  train:
    cmd: python train.py
    deps:
      - train.py
    live:
      training_metrics:
        summary: true
        html: true
```

The value passed to `--live` (`training_metrics`) became the directory `path`
for DVCLive to write logs in, and DVC will now
[track](/doc/use-cases/versioning-data-and-model-files) it. Other supported
command options for the DVC integration:

- `--live-no-cache <path>` - specify a DVCLive log directory `path` but don't
  track it with DVC. Useful if you prefer to track it with Git.
- `--live-no-html` - deactivates [HTML report](#html-report) generation.

> Note that DVC will not track summary files or the HTML report.

Run the training with `dvc repro` or `dvc exp run`:

```dvc
$ dvc repro train
```

## Outputs

After that's finished, you should see the following content in the project:

```dvc
$ tree
├── dvc.lock
├── dvc.yaml
├── training_metrics
│   └── scalars
│       ├── acc.tsv
│       └── loss.tsv
├── training_metrics.json
└── train.py
```

The [metrics summary](/doc/dvclive/api-reference/live/log#description)
`training_metrics.json` can be used by `dvc metrics` and visualized with
`dvc exp show`/`dvc exp diff`.

In addition, the
[metrics history](/doc/dvclive/api-reference/live/log#step-updates) generated
under `training_metrics/scalars` can be visualized with `dvc plots`.

### Iterative Studio

[Iterative Studio](/doc/studio) will automatically parse the outputs generated
by DVCLive, allowing to
[compare and visualize](/doc/studio/user-guide/visualize-experiments)
experiments using DVCLive in Iterative Studio.

![](/img/dvclive-studio-plots.png)

### HTML report

When `html: true`, DVC generates an _HTML report_.

If you open `training_metrics_dvc_plots/index.html` in a browser, you'll see a
plot for the logged data automatically updated during the model training!

![](/img/dvclive-html.gif)

<admon type="info">
 
If you don't update the step number, the HTML report won't be generated.

</admon>

### Checkpoints

When used alongside DVC, DVCLive can create _checkpoint_ signal files used by
DVC <abbr>experiments<abbr>.

This will save all the outputs (metrics, plots, models, etc.) associated to each
[`step`](/doc/dvclive/api-reference/live/get_step).

You can learn more about how to use them in the
[Checkpoints User Guide](/docs/user-guide/experiment-management/checkpoints).

<admon type="info">

If you don't update the step number, checkpoints won't be created.

</admon>
