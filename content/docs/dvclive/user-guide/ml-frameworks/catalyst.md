# Catalyst

DVCLive allows you to easily add experiment tracking capabilities to your
Catalyst projects.

## About Catalyst

[Catalyst](https://catalyst-team.com/) is a PyTorch framework for Deep Learning
Research and Development. It focuses on reproducibility, rapid experimentation,
and codebase reuse.

## Usage

To start using DVCLive you just need to add a few lines to your training code in
**any** Catalyst project.

You just need to add the
[`DvcLiveCallback`](https://github.com/iterative/dvclive/blob/master/dvclive/catalyst.py)
to the callbacks list passed to your `runner`:

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
[Quickstart](/docs/dvclive/user-guide/quickstart#outputs).

> 💡Without requiring additional modifications to your training code, you can
> use DVCLive alongside DVC. See
> [DVCLive with DVC](/doc/dvclive/user-guide/dvclive-with-dvc) for more info.

## Parameters

- `model_file` - The name of the file where the model will be saved at the end
  of each `step`.

Example:

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
