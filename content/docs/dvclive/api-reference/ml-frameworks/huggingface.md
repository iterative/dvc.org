# Hugging Face

DVCLive allows you to add experiment tracking capabilities to your
[Hugging Face](https://huggingface.co/) projects.

## Usage

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
from dvclive.huggingface import DVCLiveCallback

live = Live("custom_dir")

trainer = Trainer(
    model, args,
    train_dataset=train_data, eval_dataset=eval_data, tokenizer=tokenizer)
trainer.add_callback(
    DVCLiveCallback(live=live))

# Log additional metrics after training
live.summary["additional_metric"] = 1.0
live.make_summary()
```

- Using `model_file`.

```python
trainer.add_callback(
    DVCLiveCallback(model_file="my_model_file"))
trainer.train()
```

- Using `**kwargs` to customize the new [`Live`] instance.

```python
trainer.add_callback(
    DVCLiveCallback(model_file="my_model_file", dir="custom_dir"))
```

[`live`]: /docs/dvclive/api-reference/live
