# Fast.ai

DVCLive allows you to easily add experiment tracking capabilities to your Fastai
projects.

## About Fast.ai

[Fast.ai](https://docs.fast.ai/) is a deep learning library which provides
practitioners with high-level components that can quickly and easily provide
state-of-the-art results in standard deep learning domains, and provides
researchers with low-level components that can be mixed and matched to build new
approaches.

## Usage

To start using DVCLive you just need to add a few lines to your training code in
**any** Fast.ai project.

You just need to add the
[`DvcLiveCallback`](https://github.com/iterative/dvclive/blob/master/dvclive/fastai.py)
to the callbacks list passed to your `learner`:

```git
+from dvclive.fastai import DvcLiveCallback

. . .

learn = tabular_learner(data_loader, metrics=accuracy)
learn.fit_one_cycle(
-  n_epoch=2)
+  n_epoch=2,
+  cbs=[DvcLiveCallback()])
```

This will generate the metrics logs and summaries as described in the
[Get Started](/docs/dvclive/get-started#outputs).

> 💡Without requiring additional modifications to your training code, you can
> use DVCLive alongside DVC. See
> [DVCLive with DVC](/doc/dvclive/dvclive-with-dvc) for more info.

## Parameters

- `model_file` - The name of the file where the model will be saved at the end
  of each `step`.

Example:

```python
from dvclive.fastai import DvcLiveCallback

learn = tabular_learner(data_loader, metrics=accuracy)
learn.fit_one_cycle(
  n_epoch=2,
  cbs=[DvcLiveCallback(model_file='model.pth')])
```
