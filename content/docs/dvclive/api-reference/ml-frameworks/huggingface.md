# Hugging Face

DVCLive allows you to add experiment tracking capabilities to your
[Hugging Face](https://huggingface.co/) projects.

## Usage

Include the
[`DvcLiveCallback`](https://github.com/iterative/dvclive/blob/main/src/dvclive/huggingface.py)
in the callbacks list passed to your
[`Trainer`](https://huggingface.co/transformers/main_classes/trainer.html):

```python
from dvclive.huggingface import DvcLiveCallback

...

 trainer = Trainer(
    model, args,
    train_dataset=train_data,
    eval_dataset=eval_data,
    tokenizer=tokenizer,
    compute_metrics=compute_metrics,
)
trainer.add_callback(DvcLiveCallback())
trainer.train()
```

Each metric will be logged to:

```py
{Live.plots_dir}/metrics/{split}/{metric}.tsv
```

Where:

- `{Live.plots_dir}` is defined in `Live()`.
- `{split}` can be either `train` or `eval`.
- `{metric}` is the name provided by the framework.

## Parameters

- `model_file` - (`None` by default) - The name of the file where the model will
  be saved at the end of each `step`.

- `**kwargs` - Any additional arguments will be passed to
  [`Live`](/docs/dvclive/api-reference/live).

## Examples

- Using `model_file`.

```python
from dvclive.huggingface import DvcLiveCallback

trainer = Trainer(
    model,
    args,
    train_dataset=train_data,
    eval_dataset=eval_data,
    tokenizer=tokenizer,
    compute_metrics=compute_metrics,
)
trainer.add_callback(
    DvcLiveCallback(model_file="my_model_file"))
trainer.train()
```

- Using `**kwargs` to customize [`Live`](/docs/dvclive/api-reference/live).

```python
from dvclive.huggingface import DvcLiveCallback

trainer = Trainer(
    model,
    args,
    train_dataset=train_data,
    eval_dataset=eval_data,
    tokenizer=tokenizer,
    compute_metrics=compute_metrics,
)
trainer.add_callback(
    DvcLiveCallback(model_file="my_model_file", dir="custom_dir"))
trainer.train()
```
