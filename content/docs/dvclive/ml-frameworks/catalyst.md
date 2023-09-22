# Catalyst

DVCLive allows you to add experiment tracking capabilities to your
[Catalyst](https://catalyst-team.com/) projects.

## Usage

Include the
[`DVCLiveCallback`](https://github.com/iterative/dvclive/blob/main/src/dvclive/catalyst.py)
in the callbacks list passed to your
[`Runner`](https://catalyst-team.github.io/catalyst/core/runner.html):

```python
from dvclive.catalyst import DVCLiveCallback

...

runner.train(
    model=model, criterion=criterion, optimizer=optimizer, loaders=loaders,
    callbacks=[DVCLiveCallback()])
```

Each metric will be logged to:

```py
{Live.plots_dir}/metrics/{split}/{metric}.tsv
```

Where:

- `{Live.plots_dir}` is defined in [`Live`].
- `{split}` can be either `train` or `valid`.
- `{metric}` is the name provided by the framework.

## Parameters

- `live` - (`None` by default) - Optional [`Live`] instance. If `None`, a new
  instance will be created using `**kwargs`.

- `**kwargs` - Any additional arguments will be used to instantiate a new
  [`Live`] instance. If `live` is used, the arguments are ignored.

## Examples

- Using `live` to pass an existing [`Live`] instance.

```python
from dvclive import Live
from dvclive.catalyst import DVCLiveCallback

with Live("custom_dir") as live:
    runner.train(
        model=model,
        criterion=criterion,
        optimizer=optimizer,
        loaders=loaders,
        num_epochs=2,
        callbacks=[
          DVCLiveCallback(live=live)])

    # Log additional metrics after training
    live.log_metric("summary_metric", 1.0, plot=False)
```

[`live`]: /doc/dvclive/live

- Using `**kwargs` to customize the new [`Live`] instance.

```python
runner.train(
    model=model,
    criterion=criterion,
    optimizer=optimizer,
    loaders=loaders,
    num_epochs=2,
    callbacks=[
      DVCLiveCallback(dir="custom_dir")])
```

[`live`]: /doc/dvclive/live
