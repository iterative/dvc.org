# PyTorch Lightning

DVCLive allows you to add experiment tracking capabilities to your
[PyTorch Lightning](https://www.pytorchlightning.ai/) projects.

## Usage

To start using DVCLive, add a few lines to your training code in **any**
[PyTorch Lightning](https://www.pytorchlightning.ai/) project.

Pass the
[`DvcLiveLogger`](https://github.com/iterative/dvclive/blob/master/dvclive/lightning.py)
to your
[`Trainer`](https://pytorch-lightning.readthedocs.io/en/latest/common/trainer.html):

```git
+from dvclive.lightning import DvcLiveLogger

. . .
 dvclive_logger = DvcLiveLogger()

 trainer = Trainer(
+       logger=dvclive_logger,
    )
 trainer.fit(model)
```

This will generate the metrics logs and summaries as described in the
[Get Started](/docs/dvclive/get-started#outputs).

> 💡Without requiring additional modifications to your training code, you can
> use DVCLive alongside DVC. See
> [DVCLive with DVC](/doc/dvclive/dvclive-with-dvc) for more info.

## Parameters

- `run_name` - (`None` by default) - Name of the run, used in PyTorch Lightning
  to get version.

- `prefix` - (`None` by default) - string that adds to each metric name.

- `experiment` - (`None` by default) -
  [`Live`](/docs/dvclive/api-reference/live) object to be used instead of
  initializing a new one.

- `**kwargs` - Any additional arguments will be passed to
  [`Live`](/docs/dvclive/api-reference/live).

## Examples

- Using `**kwargs` to customize [`Live`](/docs/dvclive/api-reference/live).

```python
from dvclive.lightning import DvcLiveLogger

dvclive_logger = DvcLiveLogger(
    path='my_logs_path',
    summary=False
)
trainer = Trainer(
    logger=dvclive_logger,
)
trainer.fit(model)
```

> 📖 By default, PyTorch Lightning creates a directory to store checkpoints
> using the logger's name (`DvcLiveLogger`). You can change the checkpoint path
> or disable checkpointing at all as described in the
> [PyTorch Lightning documentation](https://pytorch-lightning.readthedocs.io/en/latest/common/weights_loading.html#automatic-saving)
