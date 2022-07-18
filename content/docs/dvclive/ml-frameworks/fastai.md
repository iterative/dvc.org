# Fast.ai

DVCLive allows you to add experiment tracking capabilities to your
[Fast.ai](https://docs.fast.ai/) projects.

## Usage

To start using DVCLive, add a few lines to your training code in **any**
[Fast.ai](https://docs.fast.ai/) project.

Include the
[`DvcLiveCallback`](https://github.com/iterative/dvclive/blob/master/dvclive/fastai.py)
int the callbacks list passed to your
[`Learner`](https://docs.fast.ai/learner.html#Learner):

```git
+from dvclive.fastai import DvcLiveCallback

. . .

learn = tabular_learner(data_loader, metrics=accuracy)
learn.fit_one_cycle(
-  n_epoch=2)
+  n_epoch=2,
+  cbs=[DvcLiveCallback()])
```

The [history](/doc/dvclive/api-reference/live/log#step-updates) of each
`{metric}` will be stored in:

```py
{Live.dir}/scalars/{split}/{metric}.tsv
```

Where:

- `{Live.dir}` is the
  [`dir` attribute of `Live`](/doc/dvclive/api-reference/live#attributes).
- `{split}` can be either `train` or `eval`.
- `{metric}` is the name provided by the framework.

<admon type="tip">

Without requiring additional modifications to your training code, you can use
DVCLive alongside DVC. See [DVCLive with DVC](/doc/dvclive/dvclive-with-dvc) for
more info.

</admon>

## Parameters

- `model_file` - (`None` by default) - The name of the file where the model will
  be saved at the end of each `step`.

- `**kwargs` - Any additional arguments will be passed to
  [`Live`](/docs/dvclive/api-reference/live).

## Examples

- Using `model_file`.

```python
from dvclive.fastai import DvcLiveCallback

learn = tabular_learner(data_loader, metrics=accuracy)
learn.fit_one_cycle(
  n_epoch=2,
  cbs=[DvcLiveCallback(model_file="model.pth")])
```

- Using `**kwargs` to customize [`Live`](/docs/dvclive/api-reference/live).

```python
from dvclive.fastai import DvcLiveCallback

learn = tabular_learner(data_loader, metrics=accuracy)
learn.fit_one_cycle(
  n_epoch=2,
  cbs=[DvcLiveCallback(model_file="model.pth", path="custom_path")])
```
