# Hugging Face

DVCLive allows you to add experiment tracking capabilities to your
[Hugging Face](https://huggingface.co/) projects.

## Usage

Include the
[`DvcLiveCallback`](https://github.com/iterative/dvclive/blob/master/dvclive/huggingface.py)
int the callbacks list passed to your
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
    DvcLiveCallback(model_file="my_model_path"))
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
    DvcLiveCallback(model_file="my_model_path", path="custom_path"))
trainer.train()
```
