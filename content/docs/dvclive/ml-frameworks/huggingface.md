# Hugging Face

DVCLive allows you to add experiment tracking capabilities to your
[Hugging Face](https://huggingface.co/) projects.

## Usage

To start using DVCLive, add a few lines to your training code in **any**
[Hugging Face](https://huggingface.co/) project.

Include the
[`DvcLiveCallback`](https://github.com/iterative/dvclive/blob/master/dvclive/huggingface.py)
int the callbacks list passed to your
[`Trainer`](https://huggingface.co/transformers/main_classes/trainer.html):

```git
+from dvclive.huggingface import DvcLiveCallback

. . .

 trainer = Trainer(
        model,
        args,
        train_dataset=train_data,
        eval_dataset=eval_data,
        tokenizer=tokenizer,
        compute_metrics=compute_metrics,
    )
+   trainer.add_callback(DvcLiveCallback())
    trainer.train()
```

This will generate the outputs as described in the
[Get Started](/docs/dvclive/get-started#outputs).

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
