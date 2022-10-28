# Catalyst

DVCLive allows you to add experiment tracking capabilities to your
[Catalyst](https://catalyst-team.com/) projects.

## Usage

Include the
[`DvcLiveCallback`](https://github.com/iterative/dvclive/blob/main/src/dvclive/catalyst.py)
in the callbacks list passed to your
[`Runner`](https://catalyst-team.github.io/catalyst/core/runner.html):

```python
from dvclive.catalyst import DvcLiveCallback

...

runner.train(
    model=model, criterion=criterion, optimizer=optimizer, loaders=loaders,
    callbacks=[DvcLiveCallback()])
```

Each metric will be logged to:

```py
{Live.plots_dir}/metrics/{split}/{metric}.tsv
```

Where:

- `{Live.plots_dir}` is defined in `Live()`.
- `{split}` can be either `train` or `valid`.
- `{metric}` is the name provided by the framework.

## Parameters

- `model_file` - (`None` by default) - The name of the file where the model will
  be saved at the end of each `step`.

- `**kwargs` - Any additional arguments will be passed to
  [`Live`](/docs/dvclive/api-reference/live).

## Examples

- Using `model_file`.

```python
from dvclive.catalyst import DvcLiveCallback

runner.train(
    model=model,
    criterion=criterion,
    optimizer=optimizer,
    loaders=loaders,
    num_epochs=2,
    callbacks=[DvcLiveCallback(model_file="model.pth")])
```

- Using `**kwargs` to customize [`Live`](/docs/dvclive/api-reference/live).

```python
from dvclive.catalyst import DvcLiveCallback

runner.train(
    model=model,
    criterion=criterion,
    optimizer=optimizer,
    loaders=loaders,
    num_epochs=2,
    callbacks=[
      DvcLiveCallback(model_file="model.pth", dir="custom_dir")])
```
