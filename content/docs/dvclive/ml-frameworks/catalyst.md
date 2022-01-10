# Catalyst

DVCLive allows you to add experiment tracking capabilities to your
[Catalyst](https://catalyst-team.com/) projects.

## Usage

To start using DVCLive, add a few lines to your training code in **any**
[Catalyst](https://catalyst-team.com/) project.

Include the
[`DvcLiveCallback`](https://github.com/iterative/dvclive/blob/master/dvclive/catalyst.py)
int the callbacks list passed to your
[`Runner`](https://catalyst-team.github.io/catalyst/core/runner.html):

```git
+from dvclive.catalyst import DvcLiveCallback

. . .

runner.train(
    model=model,
    criterion=criterion,
    optimizer=optimizer,
    loaders=loaders,
-    num_epochs=2)
+    num_epochs=2,
+    callbacks=[DvcLiveCallback()])
```

This will generate the metrics logs and summaries as described in the
[Get Started](/docs/dvclive/get-started#outputs).

> 💡Without requiring additional modifications to your training code, you can
> use DVCLive alongside DVC. See
> [DVCLive with DVC](/doc/dvclive/dvclive-with-dvc) for more info.

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
    callbacks=[DvcLiveCallback("model.pth")])
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
      DvcLiveCallback(path="custom_path", summary=False)])
```
