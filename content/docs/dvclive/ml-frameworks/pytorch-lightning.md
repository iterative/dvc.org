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
        # See Output Format bellow
        self.log("train_metric", metric, on_step=False, on_epoch=True)

dvclive_logger = DVCLiveLogger(save_dvc_exp=True)

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

with Live("custom_dir", save_dvc_exp=True) as live:
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
    logger=DVCLiveLogger(save_dvc_exp=True, dir='my_logs_dir'))
trainer.fit(model)
```

- Using [`live.log_artifact()`](/doc/dvclive/live/log_artifact) to save the
  [best checkpoint](https://lightning.ai/docs/pytorch/stable/api/lightning.pytorch.callbacks.ModelCheckpoint.html).

```python
with Live(save_dvc_exp=True) as live:
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
{Live.plots_dir}/metrics/{split_prefix}/{iter_type}/{metric_name}.tsv
```

Where:

- `{Live.plots_dir}` is defined in [`Live`].
- `{iter_type}` can be either `epoch` or `step`. This is inferred from the
  `on_step` and `on_epoch` arguments used in the `log` call.
- `{split_prefix}_{metric_name}` is the full string passed to the `log` call.
  `split_prefix` can be either `train`, `val` or `test`.

In the example above, the metric logged as:

```py
self.log("train_metric", metric, on_step=False, on_epoch=True)
```

Will be stored in:

```
dvclive/metrics/train/epoch/metric.tsv
```

[`live`]: /doc/dvclive/live
