# PyTorch Lightning

DVCLive allows you to add experiment tracking capabilities to your
[PyTorch Lightning](https://www.pytorchlightning.ai/) projects.

## Usage

Pass the
[`DvcLiveLogger`](https://github.com/iterative/dvclive/blob/main/src/dvclive/lightning.py)
to your
[`Trainer`](https://pytorch-lightning.readthedocs.io/en/latest/common/trainer.html):

```python
from dvclive.lightning import DvcLiveLogger

...
 dvclive_logger = DvcLiveLogger()

trainer = Trainer(logger=dvclive_logger)
trainer.fit(model)
```

The [history](/doc/dvclive/api-reference/live/log#step-updates) of each
`{metric}` will be stored in:

```py
{Live_dir}/scalars/{split}/{iter_type}/{metric}.tsv
```

Where:

- `{Live.dir}` is the
  [`dir` attribute of `Live`](/doc/dvclive/api-reference/live#attributes).
- `{split}` can be either `train` or `eval`.
- `{iter_type}` can be either `epoch` or `step`.
- `{metric}` is the name provided by the framework.

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
    path='my_logs_path'
)
trainer = Trainer(
    logger=dvclive_logger,
)
trainer.fit(model)
```

<admon type="info">

By default, PyTorch Lightning creates a directory to store checkpoints using the
logger's name (`DvcLiveLogger`). You can change the checkpoint path or disable
checkpointing at all as described in the
[PyTorch Lightning documentation](https://pytorch-lightning.readthedocs.io/en/latest/common/checkpointing.html)

</admon>
