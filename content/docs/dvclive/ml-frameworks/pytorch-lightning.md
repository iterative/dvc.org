# PyTorch Lightning

DVCLive allows you to add experiment tracking capabilities to your
[PyTorch Lightning](https://www.pytorchlightning.ai/) projects.

## Usage

<p align='center'>
  <a href="https://colab.research.google.com/github/iterative/dvclive/blob/main/examples/DVCLive-PyTorch-Lightning.ipynb">
    <img src="https://colab.research.google.com/assets/colab-badge.svg" />
  </a>
</p>

If you pass the
[`DVCLiveLogger`](https://github.com/iterative/dvclive/blob/main/src/dvclive/lightning.py)
to your
[`Trainer`](https://lightning.ai/docs/pytorch/stable/common/trainer.html),
DVCLive will automatically log the
[metrics](https://lightning.ai/docs/pytorch/stable/visualize/logging_basic.html#track-metrics)
and
[parameters](https://lightning.ai/docs/pytorch/stable/common/lightning_module.html#save-hyperparameters)
tracked in your
[`LightningModule`](https://pytorch-lightning.readthedocs.io/en/2.0.1/common/lightning_module.html).

```python
import lightning.pytorch as pl
from dvclive.lightning import DVCLiveLogger

...
class LitModule(pl.LightningModule):
    def __init__(self, layer_1_dim=128, learning_rate=1e-2):
        super().__init__()
        # layer_1_dim and learning_rate will be logged by DVCLive
        self.save_hyperparameters()

    def training_step(self, batch, batch_idx):
        metric = ...
        # some_metric will be logged by DVCLive
        self.log("some_metric", metric)

dvclive_logger = DVCLiveLogger()

model = LitModule()
trainer = pl.Trainer(logger=dvclive_logger)
trainer.fit(model)
```

<admon type="info">

By default, PyTorch Lightning creates a directory to store checkpoints using the
logger's name (`DVCLiveLogger`). You can change the checkpoint path or disable
checkpointing at all as described in the
[PyTorch Lightning documentation](https://lightning.ai/docs/pytorch/stable/common/checkpointing_basic.html#disable-checkpointing)

</admon>

## Parameters

- `run_name` - (`None` by default) - Name of the run, used in PyTorch Lightning
  to get version.

- `prefix` - (`None` by default) - string that adds to each metric name.

- `experiment` - (`None` by default) - [`Live`](/doc/dvclive/live) object to be
  used instead of initializing a new one.

- `**kwargs` - Any additional arguments will be used to instantiate a new
  [`Live`] instance. If `experiment` is used, the arguments are ignored.

## Examples

- Using `experiment` to pass an existing [`Live`] instance.

```python
from dvclive import Live
from dvclive.lightning import DVCLiveLogger

with Live("custom_dir") as live:
    trainer = Trainer(
        logger=DVCLiveLogger(experiment=live))
    trainer.fit(model)
    # Log additional metrics after training
    live.log_metric("summary_metric", 1.0, plot=False)
```

- Using `**kwargs` to customize [`Live`].

```python
from dvclive.lightning import DVCLiveLogger

trainer = Trainer(
    logger=DVCLiveLogger(dir='my_logs_dir'))
trainer.fit(model)
```

- Using [`live.log_artifact()`](/doc/dvclive/live/log_artifact) to save the
  [best checkpoint](https://lightning.ai/docs/pytorch/stable/api/lightning.pytorch.callbacks.ModelCheckpoint.html).

```python
with Live() as live:
    checkpoint = ModelCheckpoint(dirpath="mymodel")
    trainer = Trainer(
        logger=DVCLiveLogger(experiment=live),
        callbacks=checkpoint
    )
    trainer.fit(model)
    live.log_artifact(
        checkpoint.best_model_path,
        type="model",
        name="lightning-model"
    )
```

## Output format

Each metric will be logged to:

```py
{Live.plots_dir}/metrics/{split}/{iter_type}/{metric}.tsv
```

Where:

- `{Live.plots_dir}` is defined in [`Live`].
- `{split}` can be either `train`, `val` or `test`.
- `{iter_type}` can be either `epoch` or `step`.
- `{metric}` is the name provided by the framework.

[`live`]: /doc/dvclive/live
