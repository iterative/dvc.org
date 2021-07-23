# DVCLive with DVC

Even though DVCLive does not require DVC, they can integrate in several useful
ways.

The logs/summaries DVCLive produces can be fed as `dvc plots`/`dvc metrics`.

## Setup

We will refer to a training script (`train.py`) already using `dvclive`:

```python
# train.py

import dvclive

for epoch in range(NUM_EPOCHS):
    train_model(...)
    metrics = evaluate_model(...)

    for metric_name, value in metrics.items():
        dvclive.log(metric_name, value)

    dvclive.next_step()
```

> 💡 When using DVCLive in a DVC project, there is no need for manual
> initialization of DVCLive (no [`dvclive.init()`] call). DVCLive will use the
> settings provided by DVC.

Let's use `dvc stage add` to create a stage to wrap this code (don't forget to
`dvc init` first):

```dvc
$ dvc stage add -n train --live training_metrics
                -d train.py python train.py
```

`dvc.yaml` will contain a new `train` stage with the DVCLive
[configuration](/doc/dvclive/api-reference/init#parameters) (in the `live`
field):

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
  tracked it with DVC. Useful if you prefer to track it with Git.
- `--live-no-summary` - passes `summary=False` to DVCLive.
- `--live-no-html` - passes `html=False` to DVCLive.

> Note that these are convenience CLI options. You can still use
> [`dvclive.init()`] manually, which will override any options sent to
> `dvc stage add`. Just be careful to match the `--live` value (CLI) and `path`
> argument (code). Also, note that summary files are never tracked by DVC
> automatically.

Run the training with `dvc repro`:

```bash
$ dvc repro train
```

## Outputs

After that's finished, you should see the following content in the project:

```bash
$ ls
dvc.lock  training_metrics       training_metrics.json
dvc.yaml  training_metrics.html  train.py
```

In addition to the
[outputs described in the Quickstart](/docs/dvclive/user-guide/quickstart#outputs),
DVC generates an _HTML report_. If you open `training_metrics.html` in a
browser, you'll see a plot for metrics logged during the model training!

![](/img/dvclive_report.png)

## Checkpoints

When used alongside DVC, DVCLive is also capable of creating _checkpoint_ signal
files used by <abbr>experiments<abbr> .

You can learn more how to use them in the
[Checkpoints User Guide](/docs/user-guide/experiment-management/checkpoints) and
in this example
[repository](https://github.com/iterative/dvc-checkpoints-mnist).

[`dvclive.init()`]: /doc/dvclive/api-reference/init
