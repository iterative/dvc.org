# Hugging Face

DVCLive allows you to add experiment tracking capabilities to your
[Hugging Face](https://huggingface.co/) projects.

## Usage

<p align='center'>
  <a href="https://colab.research.google.com/github/iterative/dvclive/blob/main/examples/DVCLive-HuggingFace.ipynb">
    <img src="https://colab.research.google.com/assets/colab-badge.svg" />
  </a>
</p>

Include the
[`DVCLiveCallback`](https://github.com/iterative/dvclive/blob/main/src/dvclive/huggingface.py)
in the callbacks list passed to your
[`Trainer`](https://huggingface.co/transformers/main_classes/trainer.html):

```python
from dvclive.huggingface import DVCLiveCallback

...

 trainer = Trainer(
    model, args,
    train_dataset=train_data,
    eval_dataset=eval_data,
    tokenizer=tokenizer,
    compute_metrics=compute_metrics,
)
trainer.add_callback(DVCLiveCallback())
trainer.train()
```

## Parameters

- `live` - (`None` by default) - Optional [`Live`] instance. If `None`, a new
  instance will be created using `**kwargs`.

- `log_model` - (`None` by default) - use `Live.log_artifact()` to log
  checkpoints created by the
  [`Trainer`](https://huggingface.co/docs/transformers/main_classes/trainer#checkpoints).

  - if `log_model is None` (default), no checkpoint is logged.

  - if `log_model == 'True'`, the final checkpoint is logged at the end of
    training.

  - if `log_model == 'all'`, all checkpoints are logged during training.
    `Live.log_artifact()` is called with `Trainer.output_dir`.

- `**kwargs` - Any additional arguments will be used to instantiate a new
  [`Live`] instance. If `live` is used, the arguments are ignored.

## Examples

### Log model checkpoints

Use `log_model` to save the checkpoints (it will use `Live.log_artifact()`
internally to save those).

If `log_model=True` DVCLive will save a copy of the last checkpoint to the
`dvclive/artifacts` directory and annotate it with name `last` or `best` (if
[args.load_best_model_at_end](https://huggingface.co/docs/transformers/main_classes/trainer#transformers.TrainingArguments.load_best_model_at_end)).

This is useful to be consumed in [Studio model registry] or automation
scenarios.

- Save the `last` checkpoint at the end of training:

```python
from dvclive.huggingface import DVCLiveCallback

trainer.add_callback(
    DVCLiveCallback(log_model=True))
```

- Save the `best` checkpoint at the end of training:

```python
from dvclive.huggingface import DVCLiveCallback

trainer.args.load_best_model_at_end = True
trainer.add_callback(
    DVCLiveCallback(log_model=True))
```

- Save updates to the checkpoints directory whenever a new checkpoint is saved:

```python
from dvclive.huggingface import DVCLiveCallback

trainer.add_callback(
    DVCLiveCallback(log_model="all"))
```

### Passing additional DVCLive arguments

- Using `live` to pass an existing [`Live`] instance.

```python
from dvclive import Live
from dvclive.huggingface import DVCLiveCallback

with Live("custom_dir") as live:
    trainer = Trainer(
        model, args,
        train_dataset=train_data, eval_dataset=eval_data, tokenizer=tokenizer)
    trainer.add_callback(
        DVCLiveCallback(live=live))

    # Log additional metrics after training
    live.log_metric("summary_metric", 1.0, plot=False)
```

- Using `**kwargs` to customize the new [`Live`] instance.

```python
trainer.add_callback(
    DVCLiveCallback(dir="custom_dir"))
```

## Output format

Each metric will be logged to:

```py
{Live.plots_dir}/metrics/{split}/{metric}.tsv
```

Where:

- `{Live.plots_dir}` is defined in [`Live`].
- `{split}` can be either `train` or `eval`.
- `{metric}` is the name provided by the framework.

[`live`]: /doc/dvclive/live
[studio model registry]:
  /doc/studio/user-guide/model-registry/what-is-a-model-registry
