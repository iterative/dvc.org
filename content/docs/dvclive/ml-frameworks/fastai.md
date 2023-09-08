# Fast.ai

DVCLive allows you to add experiment tracking capabilities to your
[Fast.ai](https://docs.fast.ai/) projects.

## Usage

Include the
[`DVCLiveCallback`](https://github.com/iterative/dvclive/blob/main/src/dvclive/fastai.py)
in the callbacks list passed to your
[`Learner`](https://docs.fast.ai/learner.html#Learner):

```python
from dvclive.fastai import DVCLiveCallback

...

learn = tabular_learner(data_loader, metrics=accuracy)
learn.fit_one_cycle(
    n_epoch=2,
    cbs=[DVCLiveCallback()])
```

Each metric will be logged to:

```py
{Live.plots_dir}/metrics/{split}/{metric}.tsv
```

Where:

- `{Live.plots_dir}` is defined in [`Live`].
- `{split}` can be either `train` or `eval`.
- `{metric}` is the name provided by the framework.

## Parameters

- `model_file` - (`None` by default) - The name of the file where the model will
  be saved at the end of each `step`.

- `live` - (`None` by default) - Optional [`Live`] instance. If `None`, a new
  instance will be created using `**kwargs`.

- `**kwargs` - Any additional arguments will be used to instantiate a new
  [`Live`] instance. If `live` is used, the arguments are ignored.

## Examples

- Using `live` to pass an existing [`Live`] instance.

```python
from dvclive import Live
from dvclive.fastai import DVCLiveCallback

with Live("custom_dir") as live:
    learn = tabular_learner(data_loader, metrics=accuracy)
    learn.fit_one_cycle(
      n_epoch=2,
      cbs=[DVCLiveCallback(live=live)])

    # Log additional metrics after training
    live.log_metric("summary_metric", 1.0, plot=False)
```

- Using `**kwargs` to customize the new [`Live`] instance.

```python
learn.fit_one_cycle(
  n_epoch=2,
  cbs=[DVCLiveCallback(dir="custom_dir")])
```

[`live`]: /doc/dvclive/live
