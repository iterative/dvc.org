# DVCLive with DVC

Even though DVCLive does not require DVC, they can integrate in a couple useful
ways:

- The [outputs](#outputs) DVCLive produces are recognized by `dvc exp`,
  `dvc metrics` and `dvc plots`. Those same outputs can be visualized in
  [Iterative Studio](#iterative-studio).

- DVCLive is also capable of generating [checkpoint](#checkpoints) signal files
  used by DVC <abbr>experiments<abbr>.

## Setup

We will refer to a training script (`train.py`) already using `dvclive`:

<admon type="tip">

If you use one of the supported [ML Frameworks](/doc/dvclive/ml-frameworks), you
can jump to its corresponding page to find an example usage.

</admon>

```python
# train.py

from dvclive import Live

live = Live("training_metrics")

for epoch in range(NUM_EPOCHS):
    train_model(...)
    metrics = evaluate_model(...)

    for metric_name, value in metrics.items():
        live.log(metric_name, value)

    live.next_step()
```

Let's use `dvc exp init` to create a stage to wrap this code (don't forget to
`dvc init` first):

```dvc
$ dvc exp init \
--code "train.py" \
--live "training_metrics" \
python train.py
```

<admon type="info">

Note that the path passed to the `--live` option (`"training_metrics"`) matches
the `path` passed to `Live()` in the Python code.

</admon>

`dvc.yaml` will contain a new `train` stage using the DVCLive outputs as
`dvc metrics` and `dvc plots`:

```yaml
stages:
  train:
    cmd: python train.py
    deps:
      - train.py
    metrics:
      - training_metrics.json:
          cache: false
    plots:
      - training_metrics/scalars:
          cache: false
```

Run the training with `dvc repro` or `dvc exp run`:

```dvc
$ dvc repro train
```

<admon type="warn">

When using [DVC Checkpoints](/doc/user-guide/experiment-management/checkpoints)
and/or enabling DVCLive's [`resume`](/doc/dvclive/api-reference/live#parameters)
you need to add the flag
[`persist: true`](/doc/user-guide/project-structure/pipelines-files#output-subfields)
to all DVCLive outputs.

Passing `--type checkpoint` to `dvc exp init` will take care of doing this.

</admon>

## Outputs

After that's finished, you should see the following content in the project:

```dvc
$ tree
├── dvc.lock
├── dvc.yaml
├── training_metrics
│   ├── report.html
│   └── scalars
│       ├── acc.tsv
│       └── loss.tsv
├── training_metrics.json
└── train.py
```

The [metrics summary](/doc/dvclive/api-reference/live/log#description) in
`training_metrics.json` can be used by `dvc metrics` and visualized with
`dvc exp show`/`dvc exp diff`.

The [metrics history](/doc/dvclive/api-reference/live/log#step-updates)
`training_metrics/scalars` can be visualized with `dvc plots`.

The [HTML report](/doc/dvclive/api-reference/live/make_report#description) in
`training_metrics/report.html` will contain all the logged data and will be
automatically updated during training on each `step` update!

![](/img/dvclive-html.gif)

<admon type="info">

If you don't update the step number, the HTML report won't be generated unless
you call `Live.make_report()` directly.

</admon>

### Iterative Studio

[Iterative Studio](/doc/studio) will automatically parse the outputs generated
by DVCLive, allowing to
[compare and visualize](/doc/studio/user-guide/visualize-experiments)
experiments using DVCLive in Iterative Studio.

![](/img/dvclive-studio-plots.png)

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
