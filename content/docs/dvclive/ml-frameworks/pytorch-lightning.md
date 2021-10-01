# PyTorch Lightning

DVCLive allows you to easily add experiment tracking capabilities to your
Hugging Face projects.

## About PyTorch Lightning

[PyTorch Lightning](https://www.pytorchlightning.ai/) is an open-source
framework for training PyTorch networks.

## Usage

To start using DVCLive you just need to add a few lines to your training code in
**any** PyTorch Lightning project.

You just need to pass the
[`DvcLiveLogger`](https://github.com/iterative/dvclive/blob/master/dvclive/lightning.py)
to your `trainer`:

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

- `run_name` - Optional name of the run, used in PyTorch Lightning to get
  version.
- `prefix` - Optional string that adds to each metric name.
- `experiment` - Optional DVCLive object which will be used instead of
  initializing a new one.

You can also pass any argument of dvclive object described in the
[dvclive.init()](/docs/dvclive/api-reference/init).

Example:

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

> 📖 PyTorch Lightning by default creates directory with the logger's name to
> store checkpoints, and it will create DvcLiveLogger in your workspace. If you
> want to avoid it use checkpoint callback, change checkpoint path or disable
> checkpointing at all as described in the
> [PyTorch Lightning documentation](https://pytorch-lightning.readthedocs.io/en/latest/common/weights_loading.html#automatic-saving)
